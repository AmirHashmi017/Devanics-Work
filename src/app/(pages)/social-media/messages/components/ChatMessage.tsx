import { UserOutlined } from "@ant-design/icons";
import { Avatar } from "antd";
import { BsSend, BsTelephone } from "react-icons/bs";
import { FaPencilAlt } from "react-icons/fa";
import { LuMoreHorizontal } from "react-icons/lu";

export function ChatMessage() {
    return <div className="flex flex-col h-[calc(100vh-100px)] bg-white">
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b border-[#e9eaf0]">
            <div className="flex items-center gap-3">

                <Avatar
                    src={<UserOutlined />}
                    alt={"Jane Cooper"}
                    size={60}
                />

                <div>
                    <h2 className="text-xl font-medium text-[#1d2026]">Jane Cooper</h2>
                    <p className="text-[#4e5566]">Active Now</p>
                </div>
            </div>
            <div className="flex gap-2">
                <div className="p-4 bg-[#f5f7fa] rounded-md">
                    <BsTelephone className="text-[#007ab6]" size={24} />
                </div>
                <div className="p-4 bg-[#f5f7fa] rounded-md">
                    <LuMoreHorizontal className="text-[#6e7485]" size={24} />
                </div>
            </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
            <div className="flex justify-center my-4">
                <div className="px-4 py-2 bg-[#f5f7fa] rounded-full text-[#6e7485]">Today</div>
            </div>

            {/* First message from Jane */}
            <div className="flex items-start gap-2">
                <Avatar
                    src={<UserOutlined />}
                    alt={"Jane Cooper"}
                    size={60}
                />
                <div className="max-w-[80%]">
                    <span className="text-[#6e7485] text-sm">Time</span>
                    <div className="bg-[#e6f2f8] p-4 rounded-lg text-[#1d2026]">
                        Hello and thanks for signing up to the course. If you have any questions about the course or Adobe XD,
                        feel free to get in touch and I&apos;ll be happy to help 😀
                    </div>
                </div>
            </div>

            {/* User messages */}
            <div className="flex flex-col items-end gap-2">
                <span className="text-[#6e7485] text-sm">Time</span>
                <div className="bg-[#007ab6] p-3 rounded-lg text-white max-w-[80%]">Hello, Good Evening.</div>
            </div>

            <div className="flex flex-col items-end gap-2">
                <div className="bg-[#007ab6] p-3 rounded-lg text-white max-w-[80%]">I&apos;m Zafor</div>
            </div>

            <div className="flex flex-col items-end gap-2">
                <div className="bg-[#007ab6] p-3 rounded-lg text-white max-w-[80%]">
                    I only have a small doubt about your lecture. can you give me some time for this?
                </div>
            </div>

            {/* Second message from Jane */}
            <div className="flex items-start gap-2">
                <Avatar
                    src={<UserOutlined />}
                    alt={"Jane Cooper"}
                    size={60}
                />
                <div className="max-w-[80%]">
                    <span className="text-[#6e7485] text-sm">Time</span>
                    <div className="bg-[#e6f2f8] p-4 rounded-lg text-[#1d2026]">Yeah sure, tell me zafor</div>
                </div>
            </div>
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-[#e9eaf0]">
            <div className="flex items-center gap-2">
                <div className="flex-1 border border-[#e9eaf0] rounded-md flex items-center px-4 py-3">
                    <FaPencilAlt className="text-[#007ab6] mr-2" size={20} />
                    <input type="text" placeholder="Type your message" className="flex-1 outline-none text-[#6e7485]" />
                </div>
                <button className="bg-[#007ab6] text-white p-4 rounded-md flex items-center gap-2">
                    Send
                    <BsSend size={20} />
                </button>
            </div>
        </div>
    </div>
}