import { LuInfo, LuPlus, LuArrowRight } from "react-icons/lu"
import { UserOutlined } from "@ant-design/icons"
import { Avatar } from "antd"

export default function FeedRecommendationsCard() {
    // Sample data for the recommendations
    const recommendations = [
        {
            id: 1,
            name: "Camila Obando",
            title: "IT Freelance Recruiter | Talent Acquisition",
            image: "/placeholder.svg?height=72&width=72",
        },
        {
            id: 2,
            name: "Camila Obando",
            title: "IT Freelance Recruiter | Talent Acquisition",
            image: "/placeholder.svg?height=72&width=72",
        },
        {
            id: 3,
            name: "Camila Obando",
            title: "IT Freelance Recruiter | Talent Acquisition",
            image: "/placeholder.svg?height=72&width=72",
        },
    ]

    return (

        <div className="w-full border rounded-3xl bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#101010]">Add to your feed</h2>
                <div className="rounded-full p-1 text-[#717171] hover:bg-gray-100">
                    <LuInfo size={20} />
                </div>
            </div>

            <div className="space-y-6">
                {recommendations.map((recommendation) => (
                    <div key={recommendation.id} className="flex items-start space-x-3">

                        <Avatar size={55} icon={<UserOutlined />} />

                        <div className="flex-1 ">
                            <h5 className="font-bold text-base text-[#101010]">{recommendation.name}</h5>
                            <p className="text-xs text-[#717171]">{recommendation.title}</p>
                            <div className="mt-2 w-fit flex items-center justify-center rounded-full border border-[#007ab6] px-6 py-2 text-[#007ab6] hover:bg-[#007ab6]/5">
                                <LuPlus size={16} className="mr-1" />
                                <span>Follow</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 flex w-full items-center justify-between text-[#101010] hover:text-[#007ab6]">
                <span className="text-base font-medium">View all recommendations</span>
                <LuArrowRight size={20} />
            </div>
        </div>

    )
}
