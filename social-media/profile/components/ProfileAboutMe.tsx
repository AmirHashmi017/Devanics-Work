import { BsInfoCircle, BsHandThumbsUp, BsCheckSquare, BsPinMap, BsGlobe, BsTelephone, BsEnvelope, BsBriefcase, BsChatSquare } from "react-icons/bs"
export function ProfileAboutMe() {
    return <div className="w-full  bg-white rounded-lg shadow-sm border border-[#e9eaf0] p-8">
        <h1 className="text-3xl font-bold text-[#1d2026] mb-6">ABOUT ME</h1>

        <div className="space-y-2">
            {/* About text */}
            <div className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                    <div className="w-10 h-10 rounded-full bg-[#b0d6e8] flex items-center justify-center text-white">
                        <BsInfoCircle className="w-5 h-5" />
                    </div>
                </div>
                <p className="text-[#1d2026] text-base">
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                    industry&apos;s standard dummy text ever since the 1500s.
                </p>
            </div>

            {/* Likes */}
            <div className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                    <div className="w-10 h-10 rounded-full bg-[#b0d6e8] flex items-center justify-center text-white">
                        <BsHandThumbsUp className="w-5 h-5" />
                    </div>
                </div>
                <div>
                    <p className="text-[#1d2026] text-base text-wrap">36,762 people like this, including 25 of your friends</p>
                    <div className="flex mt-2">
                        {[1, 2, 3, 4,].map((_, index) => (
                            <div
                                key={index}
                                className="w-10 h-10 rounded-full bg-[#007ab6] border-2 border-white -ml-2 first:ml-0"
                            />
                        ))}
                        <div className="w-10 h-10 rounded-full bg-[#007ab6] border-2 border-white -ml-2 flex items-center justify-center text-white text-xs">
                            ...
                        </div>
                    </div>
                </div>
            </div>

            {/* Followers */}
            <div className="flex gap-4">
                <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-[#b0d6e8] flex items-center justify-center text-white">
                        <BsCheckSquare className="w-5 h-5" />
                    </div>
                </div>
                <p className="text-[#1d2026] text-base">37,822 people follow this</p>
            </div>

            {/* Check-ins */}
            <div className="flex gap-4">
                <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-[#b0d6e8] flex items-center justify-center text-white">
                        <BsPinMap className="w-5 h-5" />
                    </div>
                </div>
                <p className="text-[#1d2026] text-base">43 people checked in here</p>
            </div>

            {/* Website */}
            <div className="flex gap-4">
                <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-[#b0d6e8] flex items-center justify-center text-white">
                        <BsGlobe className="w-5 h-5" />
                    </div>
                </div>
                <a href="https://www.website.com/" className="text-[#007ab6] text-base hover:underline">
                    https://www.website.com/
                </a>
            </div>

            {/* Phone */}
            <div className="flex gap-4">
                <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-[#b0d6e8] flex items-center justify-center text-white">
                        <BsTelephone className="w-5 h-5" />
                    </div>
                </div>
                <p className="text-[#1d2026] text-base">012 345 6789</p>
            </div>

            {/* Status & Message */}
            <div className="flex gap-4">
                <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-[#b0d6e8] flex items-center justify-center text-white">
                        <BsChatSquare className="w-5 h-5" />
                    </div>
                </div>
                <div className="flex flex-col">
                    <p className="text-[#1d2026] text-base">Away</p>
                    <a href="#" className="text-[#007ab6] text-base hover:underline">
                        Send message
                    </a>
                </div>
            </div>

            {/* Email */}
            <div className="flex gap-4">
                <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-[#b0d6e8] flex items-center justify-center text-white">
                        <BsEnvelope className="w-5 h-5" />
                    </div>
                </div>
                <a href="mailto:email@website.com" className="text-[#007ab6] text-base hover:underline">
                    email@website.com
                </a>
            </div>

            {/* Industry */}
            <div className="flex gap-4">
                <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-[#b0d6e8] flex items-center justify-center text-white">
                        <BsBriefcase className="w-5 h-5" />
                    </div>
                </div>
                <p className="text-[#1d2026] text-base">
                    Industry · <span className="text-[#1d2026]">Industry</span>
                </p>
            </div>
        </div>
    </div>
}