import { BsX } from "react-icons/bs"
import Image from "next/image"

export default function JobListingCard() {
    return (
        <div className="max-w-xl mx-auto p-6 border rounded-3xl shadow">
            <h5 className="text-[#191919] text-xl font-normal mb-6">Jobs</h5>

            <div className="space-y-4">
                {[1, 2, 3].map((job, index) => (
                    <div key={index} className="relative">
                        <div className="flex items-start gap-4 pb-4">
                            <div className="w-16 h-16 bg-[#191919] flex-shrink-0">
                                <Image
                                    src="/placeholder.svg?height=64&width=64"
                                    alt="Company logo"
                                    width={64}
                                    height={64}
                                    className="bg-[#191919]"
                                />
                            </div>

                            <div className="flex-grow">
                                <h5 className="text-[#007ab6] text-base font-medium">Software Engineer</h5>
                                <p className="text-[#707070] text-sm mt-1">Maadi, Cairo</p>
                            </div>

                            <div className="text-[#191919]">
                                <BsX size={24} />
                            </div>
                        </div>

                        {index < 2 && <div className="border-b border-[#dddddd] w-full"></div>}
                    </div>
                ))}
            </div>

            <div className="flex items-center text-[#007ab6] mt-6 font-medium">
                Show more
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="ml-1"
                >
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </div>
        </div>
    )
}
