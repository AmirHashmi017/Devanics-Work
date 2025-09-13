import ModalComponent from "@/app/component/modal";
import { UserOutlined } from "@ant-design/icons";
import { Avatar } from "antd";
import { useEffect, useRef, useState } from "react";
import { Popups } from "../../bid-management/components/Popups";
import CustomButton from "@/app/component/customButton/button";

export function CreatePost() {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (!isModalOpen && inputRef.current) {
            inputRef.current.value = '';
            inputRef.current.blur();
        }
    }, [isModalOpen]);

    return <div className="w-full max-w-3xl bg-white rounded-3xl shadow-sm border border-gray-200 p-6">
        <ModalComponent open={isModalOpen} setOpen={() => setIsModalOpen(false)}>
            <Popups title="Create Post" onClose={() => setIsModalOpen(false)}>
                <CreatePostModal />
            </Popups>
        </ModalComponent>
        <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
                <Avatar size={55} icon={<UserOutlined />} />
            </div>
            <div className="w-full border border-gray-200 rounded-full py-3 px-6 mb-4">
                <input type="text" placeholder="Good Morning Eng Shereen ^_^" className="w-full outline-none text-gray-700 text-lg"
                    onClick={() => setIsModalOpen(true)}
                    onChange={() => setIsModalOpen(true)}
                    ref={inputRef}
                />
            </div>
        </div>

        <div className="flex justify-between pl-12">

            <div onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 text-gray-600 cursor-pointer hover:bg-gray-100  px-4 py-2 rounded-lg ">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="font-medium">Media</span>
            </div>

            <div onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 text-gray-600 cursor-pointer hover:bg-gray-100  px-4 py-2 rounded-lg ">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="font-medium">Event</span>
            </div>


            <div onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 text-gray-600 cursor-pointer hover:bg-gray-100  px-4 py-2 rounded-lg ">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="font-medium">Write article</span>
            </div>
        </div>
    </div>
}


export function CreatePostModal() {
    return <div>
        <div className="px-4 py-3 flex items-center gap-3">
            <Avatar size={55} icon={<UserOutlined />} />
            <div className="font-medium text-lg text-[#101828]">Shereen Ali</div>
        </div>

        <div className="px-4 pb-4">
            <textarea
                rows={10}
                placeholder="Good Morning Eng. Shereen ^_^"
                className="w-full border rounded-md p-4 shadow-none resize-none focus-visible:ring-0 focus:outline-none text-lg text-[#98a2b3] placeholder:text-[#98a2b3]"
            />
        </div>


        <div className="px-4 py-3 flex justify-between">
            <div className="flex items-center gap-2 text-[#384250] cursor-pointer hover:bg-[#f2f4f7] px-4 py-2 rounded">
                <div className="flex items-center justify-center w-5 h-5 text-[#5ad439]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                    </svg>
                </div>
                <span>Photo/Video</span>
            </div>

            <div className="flex items-center gap-2 text-[#384250] cursor-pointer hover:bg-[#f2f4f7] px-4 py-2 rounded">
                <div className="flex items-center justify-center w-5 h-5 text-[#007ab6]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                </div>
                <span>Tag Coworkers</span>
            </div>

            <div className="flex items-center gap-2 text-[#384250] cursor-pointer hover:bg-[#f2f4f7] px-4 py-2 rounded">
                <div className="flex items-center justify-center w-5 h-5 text-[#ffd93b]">
                    <span className="text-xl">😀</span>
                </div>
                <span>Feeling/ activity</span>
            </div>
        </div>

        <hr className="border-t border-gray-200" />

        <div className="p-4">
            <CustomButton
                text="Create Post"
                className="w-full"
                onClick={() => { }}
            />
        </div>
    </div>
}