import { UserOutlined } from "@ant-design/icons"
import { Avatar } from "antd"
import { CiSearch } from "react-icons/ci"

const conversations = [
    {
        id: 1,
        name: "Jane Cooper",
        message: "Yeah sure, tell me zafor",
        time: "just now",
        isOnline: true,
        hasUnread: false,
        avatar: "/placeholder.svg?height=48&width=48",
    },
    {
        id: 2,
        name: "Jenny Wilson",
        message: "Thank you so much, sir",
        time: "2 d",
        isOnline: true,
        hasUnread: true,
        avatar: "/placeholder.svg?height=48&width=48",
    },
    {
        id: 3,
        name: "Marvin McKinney",
        message: "You're Welcome",
        time: "1 m",
        isOnline: true,
        hasUnread: true,
        avatar: "/placeholder.svg?height=48&width=48",
    },
    {
        id: 4,
        name: "Eleanor Pena",
        message: "Thank you so much, sir",
        time: "1 m",
        isOnline: false,
        hasUnread: false,
        avatar: "/placeholder.svg?height=48&width=48",
    },
    {
        id: 5,
        name: "Ronald Richards",
        message: "Sorry, I can't help you",
        time: "2 m",
        isOnline: true,
        hasUnread: false,
        avatar: "/placeholder.svg?height=48&width=48",
    },
    {
        id: 6,
        name: "Kathryn Murphy",
        message: "new message",
        time: "2 m",
        isOnline: false,
        hasUnread: false,
        avatar: "/placeholder.svg?height=48&width=48",
    },
    {
        id: 7,
        name: "Jacob Jones",
        message: "Thank you so much, sir",
        time: "6 m",
        isOnline: true,
        hasUnread: false,
        avatar: "/placeholder.svg?height=48&width=48",
    },
    {
        id: 8,
        name: "Cameron Williamson",
        message: "It's okay, no problem brother, i will fix everhitn...",
        time: "6 m",
        isOnline: false,
        hasUnread: false,
        avatar: "/placeholder.svg?height=48&width=48",
    },
    {
        id: 9,
        name: "Arlene McCoy",
        message: "Thank you so much, sir",
        time: "9 m",
        isOnline: false,
        hasUnread: false,
        avatar: "/placeholder.svg?height=48&width=48",
    },
    {
        id: 10,
        name: "Dianne Russell",
        message: "You're Welcome",
        time: "9 m",
        isOnline: true,
        hasUnread: false,
        avatar: "/placeholder.svg?height=48&width=48",
    },
    {
        id: 11,
        name: "Kristin Watson",
        message: "new message",
        time: "9 m",
        isOnline: true,
        hasUnread: false,
        avatar: "/placeholder.svg?height=48&width=48",
    },
]
export function ChatList() {
    return <div className="max-w-md border border-gray-100 rounded-xl bg-white h-[calc(100vh-100px)] overflow-y-auto">
        <div className="p-4">
            <div className="relative mb-4">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <CiSearch className="h-5 w-5 text-[#8c94a3]" />
                </div>
                <input
                    type="text"
                    placeholder="Search"
                    className="w-full pl-10 pr-4 py-3 border border-[#e9eaf0] rounded-md text-[#8c94a3] placeholder-[#8c94a3] focus:outline-none focus:ring-1 focus:ring-[#564ffd]"
                />
            </div>

            <div className="space-y-0">
                {conversations.map((conversation, index) => (
                    <div
                        key={conversation.id}
                        className={`flex items-center p-3 ${index === 0 ? "bg-[#e6f2f8] rounded-md" : ""}`}
                    >
                        <div className="relative mr-3">
                            <div className="h-12 w-12 rounded-full overflow-hidden">
                                <Avatar
                                    src={conversation.avatar || <UserOutlined />}
                                    alt={conversation.name}
                                    size={48}
                                />
                            </div>
                            {conversation.isOnline && (
                                <div className="absolute bottom-0 right-0 h-3 w-3 bg-[#23bd33] rounded-full border-2 border-white"></div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                                <h3 className="text-[#1d2026] font-medium">{conversation.name}</h3>
                                <span className="text-sm text-[#8c94a3]">{conversation.time}</span>
                            </div>
                            <p className="text-[#8c94a3] truncate">{conversation.message}</p>
                        </div>
                        {conversation.hasUnread && <div className="ml-2 h-2 w-2 bg-[#564ffd] rounded-full"></div>}
                    </div>
                ))}
            </div>
        </div>
    </div>
}