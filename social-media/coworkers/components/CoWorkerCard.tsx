import { PlusCircleOutlined, UserOutlined } from "@ant-design/icons"
import { Avatar } from "antd"


export function CoWorkerCard() {
    return <div className="w-full max-w-md p-6 bg-white rounded-3xl shadow-sm">
        <div className="flex items-start gap-4">
            <Avatar size={55} icon={<UserOutlined />} />

            <div className="flex-1">
                <h2 className="text-2xl font-medium text-[#191919]">Ahmed Mohamed</h2>
                <p className="text-[#707070] mt-1">Industry · City, State</p>
                <p className="text-[#707070] mt-1">623 followers</p>
                <div className="mt-4 flex justify-start">
                    <div className="flex items-center justify-center gap-1.5 px-8 py-2 text-[#007ab6] border border-[#007ab6] rounded-full font-medium hover:bg-[#007ab6]/5 transition-colors">
                        <PlusCircleOutlined size={18} />
                        <span>Follow</span>
                    </div>

                </div>
            </div>
        </div>


    </div>
}