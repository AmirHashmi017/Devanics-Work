'use client';

import { withAuth } from '@/app/hoc/withAuth';
import { CommunityLayout } from '../components/CommunityLayout';
import { ChatList } from './components/ChatList';
import { ChatMessage } from './components/ChatMessage';
import { useState } from 'react';

function MessagesPage() {
  const [selectedContact, setSelectedContact] = useState<{
    chatRoomId?: string;
    userId: string;
    name: string;
    avatar?: string | null;
  } | null>(null);

  return (
    <CommunityLayout>
      <div className="flex gap-4">
        <ChatList onSelect={setSelectedContact} selected={selectedContact} />
        <ChatMessage selectedContact={selectedContact} />
      </div>
    </CommunityLayout>
  );
}

export default withAuth(MessagesPage);
