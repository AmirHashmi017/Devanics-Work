// import { Edit, ExternalLink } from "lucide-react"
import { UserOutlined } from "@ant-design/icons"
import { Avatar } from "antd"
import { LuExternalLink, } from "react-icons/lu"
import { TbEdit } from "react-icons/tb"

type MinProfileCardProps = {
    className?: string
}
export default function MinProfileCard({ className }: MinProfileCardProps) {
    return (
        <div className={`w-full rounded-xl overflow-hidden shadow border border-gray-100 ${className}`}>
            <div className="relative p-3 pb-4">
                {/* Top icons */}
                <div className="absolute right-2 top-6 flex gap-2">
                    <TbEdit className="h-6 w-6 text-[#007ab6]" />
                    <LuExternalLink className="h-6 w-6 text-[#007ab6]" />

                </div>

                {/* Profile image and info */}
                <div className="mt-8 flex flex-col items-center">
                    <Avatar size={55} icon={<UserOutlined />} />
                    <h1 className="mt-4 text-xl font-bold text-[#101010]">Shereen Ali</h1>
                    <p className="text-sm text-[#717171]">UX /UI Designer</p>
                </div>
            </div>

            {/* Divider */}
            <div className="h-px w-full bg-[#ededed]"></div>

            {/* Stats */}
            <div className="p-6 text-sm">
                <div className="flex items-center justify-between">
                    <span className="text-[#717171]">Profile views</span>
                    <span className="text-[#007ab6] font-medium">88</span>
                </div>
                <div className="mt-4 flex items-center justify-between">
                    <span className="text-[#717171]">Coworkers</span>
                    <span className="text-[#007ab6] font-medium">489</span>
                </div>
                <div className="mt-4">
                    <a href="#" className="text-[#007ab6] font-medium">
                        Grow your network
                    </a>
                </div>
            </div>
        </div>

    )
}
