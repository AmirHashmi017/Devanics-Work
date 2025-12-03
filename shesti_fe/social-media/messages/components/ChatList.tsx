'use client';

import { UserOutlined } from '@ant-design/icons';
import { Avatar, Pagination, Spin } from 'antd';
import { CiSearch } from 'react-icons/ci';
import { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { personalChatService } from '@/app/services/personal-chat.service';
import { networkingService } from '@/app/services/networking.service';
import { useUser } from '@/app/hooks/useUser';
import { useSocket } from '@/app/contexts/SocketContext';

type Conversation = {
  id: string;
  userId: string;
  name: string;
  avatar?: string | null;
  message?: string;
  time?: string;
  chatRoomId?: string;
};

export function ChatList({
  onSelect,
  selected,
}: {
  onSelect: (c: {
    chatRoomId?: string;
    userId: string;
    name: string;
    avatar?: string | null;
  }) => void;
  selected?: { userId: string; chatRoomId?: string } | null;
}) {
  const user = useUser();
  const { socket } = useSocket();
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<Conversation[]>([]);
  const [page, setPage] = useState(1);
  const limit = 10;
  const [total, setTotal] = useState(0);

  const offset = useMemo(() => (page - 1) * limit, [page, limit]);

  const load = async () => {
    try {
      setLoading(true);
      const { data, pagination } =
        await personalChatService.httpGetChatContacts({
          searchTerms: search,
          limit,
          offset,
        });

      const chatContacts: Conversation[] = (data || []).map((it: any) => ({
        id: it?.contactUser?._id || it?.contactUser?.id,
        userId: it?.contactUser?._id || it?.contactUser?.id,
        name: it?.contactUser?.name || 'Unknown',
        avatar:
          it?.contactUser?.socialAvatar || it?.contactUser?.avatar || null,
        message: it?.lastMessage || '',
        time: it?.lastMessageTime
          ? dayjs(it.lastMessageTime).format('MMM D, h:mm A')
          : '',
        chatRoomId: it?.chatRoomId,
      }));

      setTotal(pagination?.totalCount || chatContacts.length);

      let result: Conversation[] = chatContacts;
      if (chatContacts.length < limit) {
        const needed = limit - chatContacts.length;
        try {
          const networkRes = await networkingService.httpGetMyNetworkUsers({
            userRole: user?.userRole || '',
            searchText: search,
            locationText: '',
            page: 0,
            limit: needed,
          });
          const connections = networkRes?.data?.user?.connections || [];
          const mapConn: Conversation[] = connections.map((u: any) => ({
            id: u?._id,
            userId: u?._id,
            name: u?.name || 'Unknown',
            avatar: u?.socialAvatar || u?.avatar || null,
            message: '',
            time: '',
            chatRoomId: undefined,
          }));

          const existingIds = new Set(chatContacts.map((c) => c.userId));
          const filtered = mapConn.filter((c) => !existingIds.has(c.userId));
          result = [...chatContacts, ...filtered];
        } catch (e) {
          // ignore
        }
      }

      setItems(result);
    } catch (e) {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => load(), 300);
    return () => clearTimeout(t);
  }, [search, page]);

  useEffect(() => {
    if (!socket || !user?._id) {
      return;
    }

    socket.emit('join-user-room', user._id);
  }, [socket, user?._id]);

  // SOCKET: New Message (UPDATED with debugging)
  useEffect(() => {
    if (!socket) {
      return;
    }

    const handler = (newMsg: any) => {
      const isFromMe = newMsg.sentBy === user?._id;
      const targetUserId = isFromMe ? newMsg.sentTo : newMsg.sentBy;
      const displayText =
        newMsg.message ||
        newMsg.content ||
        (newMsg.files?.length ? '[File]' : '');
      const time = dayjs(newMsg.createdAt).format('MMM D, h:mm A');

      setItems((prev) => {
        const exists = prev.some((i) => i.userId === targetUserId);
        if (!exists) {
          return prev;
        }

        return prev.map((item) =>
          item.userId === targetUserId
            ? { ...item, message: displayText, time }
            : item
        );
      });
    };

    socket.on('chatroom-new-message', handler);

    return () => {
      socket.off('chatroom-new-message', handler);
    };
  }, [socket, user?._id]);

  // SOCKET: Message Deleted (UPDATED with debugging)
  useEffect(() => {
    if (!socket) {
      return;
    }

    const handler = () => {
      // Refetch chat contacts to get updated last message
      load();
    };

    socket.on('chatroom-message-deleted', handler);

    return () => {
      socket.off('chatroom-message-deleted', handler);
    };
  }, [socket]);

  return (
    <div className="max-w-md border border-gray-100 rounded-xl bg-white h-[calc(100vh-100px)] overflow-y-auto">
      <div className="p-4">
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <CiSearch className="h-5 w-5 text-[#8c94a3]" />
          </div>
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            className="w-full pl-10 pr-4 py-3 border border-[#e9eaf0] rounded-md text-[#8c94a3] placeholder-[#8c94a3] focus:outline-none focus:ring-1 focus:ring-[#564ffd]"
          />
        </div>

        <div className="space-y-0">
          {loading ? (
            <div className="flex justify-center py-6">
              <Spin size="default" style={{ color: '#007ab6' }} />
            </div>
          ) : (
            items.map((conversation) => (
              <div
                key={conversation.userId}
                className={`flex items-center p-3 cursor-pointer ${
                  selected &&
                  (selected.userId === conversation.userId ||
                    (!!selected.chatRoomId &&
                      selected.chatRoomId === conversation.chatRoomId))
                    ? 'bg-[#e6f2f8] rounded-md'
                    : 'hover:bg-[#f5f7fa] rounded-md'
                }`}
                onClick={() =>
                  onSelect({
                    chatRoomId: conversation.chatRoomId,
                    userId: conversation.userId,
                    name: conversation.name,
                    avatar: conversation.avatar,
                  })
                }
              >
                <div className="relative mr-3">
                  <div className="h-12 w-12 rounded-full overflow-hidden">
                    <Avatar
                      src={conversation.avatar || undefined}
                      icon={<UserOutlined />}
                      alt={conversation.name}
                      size={48}
                    />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="text-[#1d2026] font-medium truncate pr-2">
                      {conversation.name}
                    </h3>
                    <span className="text-xs text-[#8c94a3] whitespace-nowrap">
                      {conversation.time}
                    </span>
                  </div>
                  <p className="text-[#8c94a3] truncate">
                    {conversation.message || 'Start a conversation'}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-3 flex justify-center">
          <Pagination
            current={page}
            pageSize={limit}
            total={total}
            showSizeChanger={false}
            onChange={(p) => setPage(p)}
          />
        </div>
      </div>
    </div>
  );
}
