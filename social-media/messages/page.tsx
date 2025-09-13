'use client';

import { withAuth } from "@/app/hoc/withAuth";
import { CommunityLayout } from "../components/CommunityLayout";
import { ChatList } from "./components/ChatList";
import { ChatMessage } from "./components/ChatMessage";

function MessagesPage() {
    return <CommunityLayout>
        <div className="flex gap-4">
            <ChatList />
            <ChatMessage />
        </div>
    </CommunityLayout>;
}

export default withAuth(MessagesPage);