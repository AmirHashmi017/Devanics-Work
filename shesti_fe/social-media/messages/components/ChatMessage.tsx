'use client';

import { UserOutlined, MoreOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, Spin } from 'antd';
import { BsSend, BsCheck } from 'react-icons/bs';
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
import { useEffect, useMemo, useRef, useState } from 'react';
import dayjs from 'dayjs';
import { personalChatService } from '@/app/services/personal-chat.service';
import { useUser } from '@/app/hooks/useUser';
import { AiOutlinePaperClip } from 'react-icons/ai';
import filesUrlGenerator from '@/app/utils/filesUrlGenerator';
import { useSocket } from '@/app/contexts/SocketContext';

type ChatMessageProps = {
  selectedContact?: {
    chatRoomId?: string;
    userId: string;
    name: string;
    avatar?: string | null;
  } | null;
};

type IMessage = {
  _id: string;
  message?: string;
  content?: string;
  createdAt?: string;
  sentBy?: string;
  sentTo?: string;
  sender?: { _id: string } | string;
  user?: { _id: string } | string;
  userId?: string;
  files?: Array<{ url: string; type: string; extension: string; name: string }>;
};

export function ChatMessage({ selectedContact }: ChatMessageProps) {
  const user = useUser();
  const { socket } = useSocket();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');
  const listRef = useRef<HTMLDivElement | null>(null);
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [sentMessageIds, setSentMessageIds] = useState<Set<string>>(new Set());

  const canChat = Boolean(selectedContact?.userId);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);
  const [editingMessage, setEditingMessage] = useState<IMessage | null>(null);
  // const [editingText, setEditingText] = useState('');

  const headerName = useMemo(
    () => selectedContact?.name ?? 'Select a conversation',
    [selectedContact]
  );

  const scrollToBottom = () => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  };

  const loadMessages = async () => {
    if (!selectedContact?.chatRoomId) {
      setMessages([]);
      return;
    }
    try {
      setLoading(true);
      const { data } = await personalChatService.httpGetMessages({
        id: selectedContact.userId,
      });
      const loadedMessages = Array.isArray(data) ? data : data?.messages || [];
      setMessages(loadedMessages);
    } catch {
      // noop
    } finally {
      setLoading(false);
      setTimeout(scrollToBottom, 50);
    }
  };

  useEffect(() => {
    loadMessages();
  }, [selectedContact?.chatRoomId]);

  useEffect(() => {
    if (!socket || !user?._id) {
      return;
    }

    socket.emit('join-user-room', user._id);

    // No cleanup needed - backend handles it on disconnect
  }, [socket, user?._id]);

  // 🆕 Join/leave chatroom when contact changes
  useEffect(() => {
    if (!socket || !selectedContact?.chatRoomId) {
      return;
    }

    socket.emit('join-chatroom', selectedContact.chatRoomId);

    return () => {
      socket.emit('leave-chatroom', selectedContact.chatRoomId);
    };
  }, [socket, selectedContact?.chatRoomId]);

  // SOCKET: Receive New Messages (UPDATED with debugging)
  useEffect(() => {
    if (!socket || !selectedContact) {
      return;
    }

    const handler = (newMsg: IMessage) => {
      const isRelated =
        newMsg.sentBy === selectedContact.userId ||
        newMsg.sentTo === selectedContact.userId;

      if (!isRelated) {
        return;
      }

      setMessages((prev) => {
        // Avoid duplicates
        const exists = prev.some((m) => m._id === newMsg._id);
        if (exists) {
          return prev;
        }
        return [...prev, newMsg];
      });
      setTimeout(scrollToBottom, 50);
    };

    socket.on('chatroom-new-message', handler);

    return () => {
      socket.off('chatroom-new-message', handler);
    };
  }, [socket, selectedContact]);

  // SOCKET: Message Deleted (UPDATED with debugging)
  useEffect(() => {
    if (!socket) {
      return;
    }

    const handler = (data: { messageId: string; chatRoomId: string }) => {
      setMessages((prev) => {
        const filtered = prev.filter((m) => m._id !== data.messageId);
        return filtered;
      });
    };

    socket.on('chatroom-message-deleted', handler);

    return () => {
      socket.off('chatroom-message-deleted', handler);
    };
  }, [socket]);

  // SOCKET: Message Updated
  useEffect(() => {
    if (!socket) {
      return;
    }

    const handler = (updatedMessage: IMessage) => {
      setMessages((prev) =>
        prev.map((m) => (m._id === updatedMessage._id ? updatedMessage : m))
      );
    };

    socket.on('chatroom-message-updated', handler);

    return () => {
      socket.off('chatroom-message-updated', handler);
    };
  }, [socket]);

  const handleUpdateMessage = async () => {
    if (!editingMessage || !input.trim()) return;

    let uploadedFiles = editingMessage.files || [];
    if (attachments.length > 0) {
      try {
        const { mediaFiles } = await filesUrlGenerator(attachments);
        uploadedFiles = [
          ...uploadedFiles,
          ...mediaFiles.map((file) => ({
            url: file.url,
            type: file.type,
            extension: file.extension,
            name: file.name,
          })),
        ];
      } catch (error) {
        alert('Failed to upload files');
        return;
      }
    }

    try {
      const response = await personalChatService.httpUpdateMessage({
        id: editingMessage._id,
        message: input.trim(),
        files: uploadedFiles,
      });

      if (response?.data) {
        const updatedMessage = response.data;

        // Emit update event
        socket?.emit('chatroom-message-updated', {
          ...updatedMessage,
          chatRoomId: selectedContact?.chatRoomId,
        });

        setMessages((prev) =>
          prev.map((m) => (m._id === editingMessage._id ? updatedMessage : m))
        );
      }

      setEditingMessage(null);
      setInput('');
      setAttachments([]);
    } catch (error) {
      alert('Failed to update message');
    }
  };

  //  Add connection status indicator to your component
  // Place this in your JSX, maybe in the header
  {
    !socket?.connected && (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-3 py-2 rounded text-sm">
        Socket disconnected - messages may not send in real-time
      </div>
    );
  }

  const extractSenderId = (m: IMessage) => {
    if ((m as any).sentBy) return (m as any).sentBy;
    if (typeof m.sender === 'string') return m.sender;
    if (m.sender && typeof m.sender === 'object' && '_id' in m.sender)
      return (m.sender as any)._id;
    if (typeof m.user === 'string') return m.user;
    if (m.user && typeof m.user === 'object' && '_id' in m.user)
      return (m.user as any)._id;
    return m.userId;
  };

  const extractText = (m: IMessage) => m.message ?? m.content ?? '';
  const extractTime = (m: IMessage) =>
    m.createdAt ? dayjs(m.createdAt).format('hh:mm A') : '';

  const groupMessagesByDate = (msgs: IMessage[]) => {
    const groups: { date: string; messages: IMessage[] }[] = [];
    msgs.forEach((m) => {
      const date = m.createdAt
        ? dayjs(m.createdAt).format('MMMM D, YYYY')
        : 'Unknown';
      const lastGroup = groups[groups.length - 1];
      if (lastGroup && lastGroup.date === date) {
        lastGroup.messages.push(m);
      } else {
        groups.push({ date, messages: [m] });
      }
    });
    return groups;
  };

  const handleSend = async () => {
    const text = input.trim();
    if ((!text && attachments.length === 0) || !canChat) return;

    let uploadedFiles: Array<{
      url: string;
      type: string;
      extension: string;
      name: string;
    }> = [];
    if (attachments.length > 0) {
      try {
        const { mediaFiles } = await filesUrlGenerator(attachments);
        uploadedFiles = mediaFiles.map((file) => ({
          url: file.url,
          type: file.type,
          extension: file.extension,
          name: file.name,
        }));
      } catch (error) {
        alert('Failed to upload files');
        return;
      }
    }

    const tempId = `temp-${Date.now()}`;
    // const tempMessage: IMessage = {
    //   _id: tempId,
    //   message: text,
    //   files: uploadedFiles,
    //   createdAt: new Date().toISOString(),
    //   sentBy: user?._id,
    // };

    // setMessages((prev) => [...prev, tempMessage]);
    // setSentMessageIds((prev) => new Set(prev).add(tempId));
    setInput('');
    setAttachments([]);
    setTimeout(scrollToBottom, 50);

    try {
      const response = await personalChatService.httpCreateMessage({
        userId: selectedContact!.userId,
        message: text,
        files: uploadedFiles,
      });

      if (response?.data) {
        const realMessage = response.data;
        setMessages((prev) =>
          prev.map((m) => (m._id === tempId ? realMessage : m))
        );
        setSentMessageIds((prev) => {
          const next = new Set(prev);
          next.delete(tempId);
          if (realMessage._id) next.add(realMessage._id);
          return next;
        });
      }
    } catch {
      setMessages((prev) => prev.filter((m) => m._id !== tempId));
      setSentMessageIds((prev) => {
        const next = new Set(prev);
        next.delete(tempId);
        return next;
      });
      alert('Failed to send message');
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] bg-white flex-1">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-[#e9eaf0]">
        <div className="flex items-center gap-3">
          <Avatar
            src={selectedContact?.avatar || undefined}
            icon={<UserOutlined />}
            alt={headerName}
            size={60}
          />
          <div>
            <h2 className="text-xl font-medium text-[#1d2026]">{headerName}</h2>
            <p className="text-[#4e5566]">
              {canChat ? '' : 'No conversation selected'}
            </p>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <div
        ref={listRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-white"
      >
        {loading && (
          <div className="flex justify-center py-6">
            <Spin size="default" style={{ color: '#007ab6' }} />
          </div>
        )}
        {!loading && messages.length === 0 && (
          <div className="text-center text-[#6e7485]">
            {canChat ? 'No messages yet' : 'Select a chat to view messages'}
          </div>
        )}
        {!loading &&
          groupMessagesByDate(messages).map((group) => (
            <div key={group.date}>
              <div className="flex justify-center my-4">
                <span className="bg-[#e6f2f8] px-3 py-1 rounded-full text-xs text-[#6e7485]">
                  {group.date}
                </span>
              </div>

              {group.messages.map((m) => {
                const isMe =
                  extractSenderId(m) === user?._id || sentMessageIds.has(m._id);
                const text = extractText(m);
                const time = extractTime(m);

                return (
                  <div
                    key={m._id}
                    className={`flex ${isMe ? 'flex-col items-end' : 'items-start gap-2'} group relative mb-2`}
                  >
                    {!isMe && (
                      <Avatar
                        src={selectedContact?.avatar || undefined}
                        icon={<UserOutlined />}
                        alt={headerName}
                        size={40}
                      />
                    )}

                    <div
                      className={`flex items-center gap-2 ${isMe ? 'flex-row-reverse' : ''}`}
                    >
                      <div
                        className={`${isMe ? 'max-w-[80%] flex flex-col items-end gap-1' : 'max-w-[80%]'}`}
                      >
                        {m.files && m.files.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-2">
                            {m.files.map((file, idx) => (
                              <div key={idx} className="relative">
                                {file.type?.includes('image') ? (
                                  <img
                                    src={file.url}
                                    alt={file.name}
                                    className="max-w-[200px] max-h-[200px] rounded-lg object-cover cursor-pointer"
                                    onClick={() =>
                                      window.open(file.url, '_blank')
                                    }
                                  />
                                ) : file.type?.includes('video') ? (
                                  <video
                                    src={file.url}
                                    className="max-w-[200px] max-h-[200px] rounded-lg object-cover"
                                    controls
                                  />
                                ) : (
                                  <a
                                    href={file.url}
                                    download={file.name}
                                    className="flex items-center gap-2 bg-gray-100 p-3 rounded-lg hover:bg-gray-200"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <AiOutlinePaperClip
                                      className="text-[#007ab6]"
                                      size={20}
                                    />
                                    <span className="text-sm">{file.name}</span>
                                  </a>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {text && (
                          <div
                            className={`${
                              isMe
                                ? 'bg-[#007ab6] text-white'
                                : 'bg-[#e6f2f8] text-[#1d2026]'
                            } p-3 rounded-lg whitespace-pre-wrap`}
                          >
                            {text}
                          </div>
                        )}

                        <span className="text-[#6e7485] text-xs whitespace-pre-wrap text-nowrap flex items-center gap-1">
                          {time}
                          {editingMessage?._id === m._id && (
                            <span className="text-blue-500">(editing...)</span>
                          )}
                        </span>
                      </div>

                      {isMe && (
                        <Dropdown
                          trigger={['click']}
                          menu={{
                            items: [
                              {
                                key: 'edit',
                                icon: <FaPencilAlt size={14} />,
                                label: 'Edit',
                                onClick: () => {
                                  setEditingMessage(m);
                                  // setEditingText(extractText(m));
                                  setInput(extractText(m));
                                },
                              },
                              {
                                key: 'delete',
                                icon: (
                                  <FaTrashAlt
                                    size={14}
                                    className="text-red-500"
                                  />
                                ),
                                label: 'Delete',
                                danger: true,
                                onClick: () => {
                                  setMessageToDelete(m._id);
                                  setDeleteModalOpen(true);
                                },
                              },
                            ],
                          }}
                        >
                          <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-gray-100 rounded-full">
                            <MoreOutlined
                              className="text-gray-500"
                              style={{ fontSize: '16px' }}
                            />
                          </button>
                        </Dropdown>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-[#e9eaf0]">
        {/* ... attachment preview ... */}
        {attachments.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {attachments.map((file, idx) => {
              const isImage = file.type.startsWith('image/');
              const preview = isImage ? URL.createObjectURL(file) : null;

              return (
                <div
                  key={idx}
                  className="bg-[#e6f2f8] p-2 rounded-md flex items-center gap-2 relative"
                >
                  {isImage && preview ? (
                    <img
                      src={preview}
                      alt={file.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-[#007ab6] rounded flex items-center justify-center">
                      <span className="text-white text-xs">File</span>
                    </div>
                  )}
                  <span className="text-xs text-[#1d2026] max-w-[100px] truncate">
                    {file.name}
                  </span>
                  <button
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                    onClick={() => {
                      if (preview) URL.revokeObjectURL(preview);
                      setAttachments((prev) =>
                        prev.filter((_, i) => i !== idx)
                      );
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files) {
                setAttachments((prev) => [
                  ...prev,
                  ...Array.from(e.target.files!),
                ]);
                e.target.value = '';
              }
            }}
          />
          <button
            className="p-4 bg-[#f5f7fa] rounded-md cursor-pointer"
            disabled={!canChat}
            onClick={() => fileInputRef.current?.click()}
          >
            <AiOutlinePaperClip className="text-[#007ab6]" size={20} />
          </button>

          <div className="flex-1 border border-[#e9eaf0] rounded-md flex items-center px-4 py-3">
            <FaPencilAlt className="text-[#007ab6] mr-2" size={20} />
            <input
              type="text"
              placeholder={
                canChat
                  ? editingMessage
                    ? 'Edit your message...'
                    : 'Type your message'
                  : 'Select a contact to start chatting'
              }
              className="flex-1 outline-none text-[#6e7485]"
              disabled={!canChat || loading}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (editingMessage) {
                    handleUpdateMessage();
                  } else {
                    handleSend();
                  }
                } else if (e.key === 'Escape' && editingMessage) {
                  setEditingMessage(null);
                  setInput('');
                }
              }}
            />
          </div>

          {editingMessage ? (
            <button
              className="bg-green-600 text-white p-4 rounded-md flex items-center gap-2 disabled:opacity-50"
              disabled={!canChat || loading || !input.trim()}
              onClick={handleUpdateMessage}
            >
              Update
              <BsCheck size={20} />
            </button>
          ) : (
            <button
              className="bg-[#007ab6] text-white p-4 rounded-md flex items-center gap-2 disabled:opacity-50"
              disabled={
                !canChat ||
                loading ||
                (!input.trim() && attachments.length === 0)
              }
              onClick={handleSend}
            >
              Send
              <BsSend size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-[#1d2026] mb-2">
              Delete Message
            </h3>
            <p className="text-[#6e7485] mb-6">
              Are you sure you want to delete this message? This action cannot
              be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                className="px-4 py-2 border border-[#e9eaf0] rounded-md text-[#6e7485] hover:bg-[#f5f7fa]"
                onClick={() => {
                  setDeleteModalOpen(false);
                  setMessageToDelete(null);
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                onClick={async () => {
                  if (messageToDelete && selectedContact) {
                    try {
                      await personalChatService.httpDeleteMessage(
                        messageToDelete
                      );

                      // Emit delete event
                      socket?.emit('chatroom-message-deleted', {
                        messageId: messageToDelete,
                        chatRoomId: selectedContact.chatRoomId,
                      });

                      setMessages((prev) =>
                        prev.filter((m) => m._id !== messageToDelete)
                      );
                    } catch {
                      alert('Failed to delete message');
                    }
                  }
                  setDeleteModalOpen(false);
                  setMessageToDelete(null);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
