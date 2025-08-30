
import { FaCrown, FaStar, FaGlobe, FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";


export function ProfileInfo() {
    return <div className="max-w-6xl mx-auto p-6 border rounded-lg shadow">
        <div className="w-full  border-gray-200 pb-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                {/* Profile Image */}
                <div className="relative w-32 h-32 rounded-full overflow-hidden">
                    <Avatar
                        icon={<UserOutlined />}
                        size={128}
                    />
                </div>

                {/* Profile Info */}
                <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                        <h1 className="text-3xl font-bold text-[#1d2026]">Shereen Ali</h1>
                        <div className="flex items-center bg-[#e6f2f8] px-3 py-1 rounded-md">
                            <FaCrown className="w-4 h-4 text-[#007ab6] mr-2" />
                            <span className="text-[#007ab6] font-medium">Top Rated</span>
                        </div>
                    </div>

                    <p className="text-[#6e7485] text-lg mb-4">Web Designer & Best-Selling Instructor</p>

                    <div className="flex flex-wrap gap-6 mb-2">
                        <div className="flex items-center">
                            <FaStar className="w-5 h-5 text-[#007ab6] mr-2" fill="#007ab6" />
                            <span className="font-bold text-[#1d2026] mr-1">4.8</span>
                            <span className="text-[#6e7485]">(134,633 review)</span>
                        </div>

                        <div className="flex items-center">
                            <svg
                                className="w-5 h-5 text-[#007ab6] mr-2"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
                                    fill="#007ab6"
                                />
                                <path
                                    d="M12 14.5C6.99 14.5 3 17.86 3 22C3 22.28 3.22 22.5 3.5 22.5H20.5C20.78 22.5 21 22.28 21 22C21 17.86 17.01 14.5 12 14.5Z"
                                    fill="#007ab6"
                                />
                            </svg>
                            <span className="font-bold text-[#1d2026] mr-1">430,117</span>
                            <span className="text-[#6e7485]">Coworkers</span>
                        </div>

                        <div className="flex items-center">
                            <svg
                                className="w-5 h-5 text-[#007ab6] mr-2"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M22 10V6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V10C3.11 10 4 10.9 4 12C4 13.1 3.11 14 2 14V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V14C20.9 14 20 13.1 20 12C20 10.9 20.9 10 22 10ZM20 8.54C18.81 9.23 18 10.53 18 12C18 13.47 18.81 14.77 20 15.46V18H4V15.46C5.19 14.77 6 13.47 6 12C6 10.52 5.2 9.23 4 8.54V6H20V8.54ZM11 15H13V17H11V15ZM11 11H13V13H11V11ZM11 7H13V9H11V7Z"
                                    fill="#007ab6"
                                />
                            </svg>
                            <span className="font-bold text-[#1d2026] mr-1">7</span>
                            <span className="text-[#6e7485]">Certifications</span>
                        </div>
                    </div>
                </div>

                {/* Website & Social Links */}
                <div className="flex flex-col items-end gap-4">
                    <div className="flex items-center">
                        <FaGlobe className="w-5 h-5 text-[#007ab6] mr-2" />
                        <a href="https://www.Currentcompanylink.com" className="text-[#007ab6] hover:underline">
                            https://www.Currentcompanylink.com
                        </a>
                    </div>

                    <div className="flex gap-4">
                        <a href="#" className="text-[#4e5566] hover:text-[#007ab6]">
                            <FaFacebook className="w-5 h-5" />
                        </a>
                        <a href="#" className="text-[#4e5566] hover:text-[#007ab6]">
                            <FaTwitter className="w-5 h-5" />
                        </a>
                        <a href="#" className="text-[#4e5566] hover:text-[#007ab6]">
                            <FaInstagram className="w-5 h-5" />
                        </a>
                        <a href="#" className="text-[#4e5566] hover:text-[#007ab6]">
                            <FaYoutube className="w-5 h-5" />
                        </a>
                        <a href="#" className="text-[#4e5566] hover:text-[#007ab6]">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M17.6 6.32C16.12 4.82 14.06 4 12 4C7.72 4 4.23 7.5 4.23 11.78C4.23 13.38 4.67 14.94 5.48 16.29L4.17 19.83L7.79 18.53C9.09 19.27 10.53 19.67 12 19.67C16.28 19.67 19.77 16.17 19.77 11.89C19.77 9.83 18.95 7.77 17.6 6.32ZM12 18.3C10.7 18.3 9.43 17.93 8.32 17.24L8.04 17.07L5.91 17.84L6.69 15.77L6.5 15.47C5.75 14.31 5.34 13.03 5.34 11.7C5.34 8.21 8.28 5.37 11.95 5.37C13.7 5.37 15.35 6.07 16.57 7.28C17.79 8.5 18.59 10.15 18.59 11.9C18.65 15.4 15.71 18.3 12 18.3ZM15.54 13.4C15.31 13.29 14.22 12.75 14.03 12.68C13.83 12.61 13.69 12.57 13.55 12.8C13.41 13.03 12.97 13.53 12.86 13.67C12.75 13.81 12.64 13.83 12.41 13.72C12.18 13.61 11.44 13.37 10.56 12.59C9.89 11.98 9.44 11.24 9.33 11.01C9.22 10.78 9.31 10.67 9.42 10.58C9.5 10.5 9.61 10.36 9.7 10.25C9.79 10.14 9.83 10.05 9.9 9.91C9.97 9.77 9.94 9.66 9.9 9.55C9.86 9.44 9.41 8.35 9.23 7.89C9.05 7.44 8.87 7.5 8.75 7.5C8.63 7.5 8.5 7.46 8.36 7.46C8.22 7.46 8 7.5 7.8 7.73C7.61 7.96 7.03 8.5 7.03 9.59C7.03 10.68 7.84 11.73 7.94 11.87C8.03 12.01 9.43 14.14 11.54 15.11C12.04 15.32 12.44 15.46 12.75 15.56C13.26 15.72 13.73 15.7 14.1 15.66C14.5 15.61 15.38 15.13 15.56 14.6C15.74 14.07 15.74 13.61 15.7 13.54C15.66 13.47 15.52 13.43 15.29 13.32L15.54 13.4Z"
                                    fill="currentColor"
                                />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
}