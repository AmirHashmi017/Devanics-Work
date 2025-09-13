import { Image } from "antd"
import { BsGlobe, BsThreeDots, BsX, BsHandThumbsUp, BsChatSquare, BsArrowRepeat, BsSend, BsHeart } from "react-icons/bs"

export default function PostCard() {
    return (
        <div className="w-full max-w-3xl bg-white border rounded-2xl shadow overflow-hidden">
            {/* Post Header */}
            <div className="p-4 flex items-start justify-between">
                <div className="flex gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-[#00496d]">
                        <Image
                            src="/placeholder.svg?height=48&width=48"
                            alt="Civilian Company Logo"
                            width={48}
                            height={48}
                            className="object-cover"
                        />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="font-semibold text-[#1a202c] text-xl">Civilian Company</h2>
                            <span className="text-[#717171]">•</span>
                            <span className="text-[#717171]">1st</span>
                        </div>
                        <p className="text-[#717171]">Civil Engineering Company</p>
                        <div className="flex items-center gap-1 text-[#717171] text-sm mt-1">
                            <span>11m</span>
                            <span>•</span>
                            <BsGlobe className="h-4 w-4" />
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4 text-[#717171]">
                    <BsThreeDots className="h-6 w-6" />
                    <BsX className="h-6 w-6" />
                </div>
            </div>

            {/* Post Content */}
            <div className="px-4 pb-3">
                <p className="text-[#1a202c] text-lg">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                    dolore magna aliqua.
                </p>
            </div>

            {/* Post Image */}
            <div className="w-full relative h-[324px] rounded-md p-2">
                <Image
                    src="/blogs/blog1.png"
                    alt="Conference presentation showing app interfaces"
                    width={'100%'}
                    height={'100%'}
                    className="rounded-md"
                    preview={false}
                />
            </div>

            {/* Engagement Stats */}
            <div className="px-4 py-2 flex justify-between border-b border-[#e8e8e8]">
                <div className="flex items-center gap-1">
                    <div className="flex">
                        <div className="bg-[#378fe9] rounded-full p-1 z-10">
                            <BsHandThumbsUp className="h-3 w-3 text-white" />
                        </div>
                        <div className="bg-[#df704d] rounded-full p-1 -ml-1">
                            <BsHeart className="h-3 w-3 text-white" />
                        </div>
                    </div>
                    <span className="text-[#717171] text-sm ml-1">44</span>
                </div>
                <div>
                    <span className="text-[#717171] text-sm">2 comments</span>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="px-2 py-1 flex justify-between">
                <div className="flex items-center justify-center gap-2 py-3 px-4 rounded-md hover:bg-[#ededed] text-[#717171]">
                    <BsHandThumbsUp className="h-5 w-5" />
                    <span className="font-medium">Like</span>
                </div>
                <div className="flex items-center justify-center gap-2 py-3 px-4 rounded-md hover:bg-[#ededed] text-[#717171]">
                    <BsChatSquare className="h-5 w-5" />
                    <span className="font-medium">Comment</span>
                </div>
                <div className="flex items-center justify-center gap-2 py-3 px-4 rounded-md hover:bg-[#ededed] text-[#717171]">
                    <BsArrowRepeat className="h-5 w-5" />
                    <span className="font-medium">Repost</span>
                </div>
                <div className="flex items-center justify-center gap-2 py-3 px-4 rounded-md hover:bg-[#ededed] text-[#717171]">
                    <BsSend className="h-5 w-5" />
                    <span className="font-medium">Send</span>
                </div>
            </div>
        </div>
    )
}
