import CustomButton from "@/app/component/customButton/button";
import WhiteButton from "@/app/component/customButton/white";
import { InputComponent } from "@/app/component/customInput/Input";
import { PhoneNumberInputWithLable } from "@/app/component/phoneNumberInput/PhoneNumberInputWithLable";
import { TextAreaComponent } from "@/app/component/textarea";
import { EditOutlined } from "@ant-design/icons";
import { Breadcrumb, Checkbox } from "antd";
import { useState } from "react"
import { BsCalendar, BsGlobe, BsUpload } from "react-icons/bs";


export function ProfileForm() {

    const [titleCount, setTitleCount] = useState(0)

    return (
        <div className="min-h-screen bg-[#e6f2f8]">
            <div className="container mx-auto px-4 py-6">
                {/* Breadcrumb */}
                <nav className="mb-6 text-sm">
                    <Breadcrumb
                        items={[
                            {
                                title: <a href="#" className="!text-[#007ab6] hover:underline">Community</a>,
                            },
                            {
                                title: <a href="#" className="!text-[#007ab6] hover:underline">Profile</a>,
                            },
                            {
                                title: <span className="text-[#1d2026] font-medium">Edit Profile</span>,
                            },
                        ]}
                    />
                </nav>

                {/* Main Content */}
                <div className="bg-white rounded-md shadow-sm p-8 mb-6">
                    <div className="">
                        <div className="flex-1">
                            {/* Account Settings */}
                            <h2 className="text-2xl font-semibold text-[#1d2026] mb-6">Account Settings</h2>

                            <div className="space-y-6">
                                <div className="flex gap-5">
                                    <div className="space-y-6 flex-1">
                                        <div>
                                            <label htmlFor="firstName" className="block mb-2 text-[#4e5566]">
                                                Full name
                                            </label>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <InputComponent
                                                    name="firstName"
                                                    placeholder="First name"
                                                    label=""
                                                    type="text"
                                                />
                                                <InputComponent
                                                    name="lastName"
                                                    placeholder="Last name"
                                                    label=""
                                                    type="text"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="username" className="block mb-2 text-[#4e5566]">
                                                Username
                                            </label>
                                            <InputComponent
                                                name="username"
                                                placeholder="Enter your username"
                                                label=""
                                                type="text"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="phone" className="block mb-2 text-[#4e5566]">
                                                Phone Number
                                            </label>
                                            <div className="">

                                                <PhoneNumberInputWithLable
                                                    name="phone"
                                                    placeholder="Your Phone number..."
                                                    label=""
                                                    onChange={(e) => { }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    {/* Profile Photo */}
                                    <div className="bg-[#f5f7fa] p-6 rounded-md flex flex-col items-center ">
                                        <div className="relative mb-4">
                                            <div className="w-32 h-32 rounded-full overflow-hidden bg-[#e9eaf0] flex items-center justify-center">
                                                <img
                                                    src="/placeholder.svg?height=128&width=128"
                                                    alt="Profile"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <button className="absolute bottom-0 right-0 bg-[#007ab6] text-white p-1 rounded-full">
                                                <BsUpload className="h-4 w-4" />
                                            </button>
                                        </div>
                                        <div className="text-[#007ab6] text-sm font-medium mb-2">Upload Photo</div>
                                        <p className="text-xs text-center text-[#8c94a3]">
                                            Image size should be under 1MB and image ratio needs to be 1:1
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between mb-2">
                                        <label className="block text-[#4e5566]">
                                            Title
                                        </label>
                                        <span className="text-xs text-[#8c94a3]">{titleCount}/50</span>
                                    </div>
                                    <InputComponent
                                        name="title"
                                        placeholder="Your title, profession or small biography"
                                        label=""
                                        type="text"
                                        maxLength={50}
                                        field={{
                                            onChange: (e) => setTitleCount(e.target.value.length)
                                        }}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="biography" className="block mb-2 text-[#4e5566]">
                                        Biography
                                    </label>
                                    <TextAreaComponent
                                        name="biography"
                                        placeholder="Your title, profession or small biography"
                                        label=""
                                    />
                                </div>
                            </div>

                            {/* Social Profile */}
                            <h2 className="text-2xl font-semibold text-[#1d2026] mt-10 mb-6">Social Profile</h2>

                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="website" className="block mb-2 text-[#4e5566]">
                                        Personal Website
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                            <BsGlobe className="h-4 w-4 text-[#8c94a3]" />
                                        </div>
                                        <InputComponent
                                            name="website"
                                            placeholder="Personal website or portfolio url..."
                                            label=""
                                            type="text"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="facebook" className="block mb-2 text-[#4e5566]">
                                            Facebook
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                <svg className="h-4 w-4 text-[#007ab6]" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M9.19795 21.5H13.198V13.4901H16.8021L17.198 9.50977H13.198V7.5C13.198 6.94772 13.6457 6.5 14.198 6.5H17.198V2.5H14.198C11.4365 2.5 9.19795 4.73858 9.19795 7.5V9.50977H7.19795L6.80206 13.4901H9.19795V21.5Z" />
                                                </svg>
                                            </div>
                                            <InputComponent
                                                name="facebook"
                                                placeholder="Username"
                                                label=""
                                                type="text"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="instagram" className="block mb-2 text-[#4e5566]">
                                            Instagram
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                <svg className="h-4 w-4 text-[#007ab6]" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M12 2C14.717 2 15.056 2.01 16.122 2.06C17.187 2.11 17.912 2.277 18.55 2.525C19.21 2.779 19.766 3.123 20.322 3.678C20.8305 4.1779 21.224 4.78259 21.475 5.45C21.722 6.087 21.89 6.813 21.94 7.878C21.987 8.944 22 9.283 22 12C22 14.717 21.99 15.056 21.94 16.122C21.89 17.187 21.722 17.912 21.475 18.55C21.2247 19.2178 20.8311 19.8226 20.322 20.322C19.822 20.8303 19.2173 21.2238 18.55 21.475C17.913 21.722 17.187 21.89 16.122 21.94C15.056 21.987 14.717 22 12 22C9.283 22 8.944 21.99 7.878 21.94C6.813 21.89 6.088 21.722 5.45 21.475C4.78233 21.2245 4.17753 20.8309 3.678 20.322C3.16941 19.8222 2.77593 19.2175 2.525 18.55C2.277 17.913 2.11 17.187 2.06 16.122C2.013 15.056 2 14.717 2 12C2 9.283 2.01 8.944 2.06 7.878C2.11 6.812 2.277 6.088 2.525 5.45C2.77524 4.78218 3.1688 4.17732 3.678 3.678C4.17767 3.16923 4.78243 2.77573 5.45 2.525C6.088 2.277 6.812 2.11 7.878 2.06C8.944 2.013 9.283 2 12 2ZM12 7C10.6739 7 9.40215 7.52678 8.46447 8.46447C7.52678 9.40215 7 10.6739 7 12C7 13.3261 7.52678 14.5979 8.46447 15.5355C9.40215 16.4732 10.6739 17 12 17C13.3261 17 14.5979 16.4732 15.5355 15.5355C16.4732 14.5979 17 13.3261 17 12C17 10.6739 16.4732 9.40215 15.5355 8.46447C14.5979 7.52678 13.3261 7 12 7ZM18.5 6.75C18.5 6.41848 18.3683 6.10054 18.1339 5.86612C17.8995 5.6317 17.5815 5.5 17.25 5.5C16.9185 5.5 16.6005 5.6317 16.3661 5.86612C16.1317 6.10054 16 6.41848 16 6.75C16 7.08152 16.1317 7.39946 16.3661 7.63388C16.6005 7.8683 16.9185 8 17.25 8C17.5815 8 17.8995 7.8683 18.1339 7.63388C18.3683 7.39946 18.5 7.08152 18.5 6.75ZM12 9C12.7956 9 13.5587 9.31607 14.1213 9.87868C14.6839 10.4413 15 11.2044 15 12C15 12.7956 14.6839 13.5587 14.1213 14.1213C13.5587 14.6839 12.7956 15 12 15C11.2044 15 10.4413 14.6839 9.87868 14.1213C9.31607 13.5587 9 12.7956 9 12C9 11.2044 9.31607 10.4413 9.87868 9.87868C10.4413 9.31607 11.2044 9 12 9Z" />
                                                </svg>
                                            </div>
                                            <InputComponent
                                                name="instagram"
                                                placeholder="Username"
                                                label=""
                                                type="text"

                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="linkedin" className="block mb-2 text-[#4e5566]">
                                            LinkedIn
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                <svg className="h-4 w-4 text-[#007ab6]" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M6.5 8C7.32843 8 8 7.32843 8 6.5C8 5.67157 7.32843 5 6.5 5C5.67157 5 5 5.67157 5 6.5C5 7.32843 5.67157 8 6.5 8Z" />
                                                    <path d="M5 10C5 9.44772 5.44772 9 6 9H7C7.55228 9 8 9.44771 8 10V18C8 18.5523 7.55228 19 7 19H6C5.44772 19 5 18.5523 5 18V10Z" />
                                                    <path d="M11 19H12C12.5523 19 13 18.5523 13 18V13.5C13 12 16 11 16 13V18.0004C16 18.5527 16.4477 19 17 19H18C18.5523 19 19 18.5523 19 18V12C19 10 17.5 9 15.5 9C13.5 9 13 10.5 13 10.5V10C13 9.44771 12.5523 9 12 9H11C10.4477 9 10 9.44772 10 10V18C10 18.5523 10.4477 19 11 19Z" />
                                                    <path
                                                        fillRule="evenodd"
                                                        clipRule="evenodd"
                                                        d="M20 1C21.6569 1 23 2.34315 23 4V20C23 21.6569 21.6569 23 20 23H4C2.34315 23 1 21.6569 1 20V4C1 2.34315 2.34315 1 4 1H20ZM20 3C20.5523 3 21 3.44772 21 4V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V4C3 3.44772 3.44772 3 4 3H20Z"
                                                    />
                                                </svg>
                                            </div>
                                            <InputComponent
                                                label=""
                                                name=""
                                                type="text"
                                                placeholder="Username"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="twitter" className="block mb-2 text-[#4e5566]">
                                            Twitter
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                <svg className="h-4 w-4 text-[#007ab6]" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M22 5.89c-.74.33-1.53.55-2.35.65.85-.5 1.5-1.3 1.8-2.24-.79.47-1.67.8-2.6.99a4.13 4.13 0 0 0-7.1 3.74c-3.4-.17-6.43-1.8-8.46-4.29a4.13 4.13 0 0 0 1.28 5.5c-.68-.02-1.3-.2-1.86-.5v.05a4.13 4.13 0 0 0 3.31 4.05c-.62.17-1.28.2-1.9.07a4.13 4.13 0 0 0 3.85 2.87A8.33 8.33 0 0 1 2 18.53a11.72 11.72 0 0 0 6.34 1.86c7.62 0 11.8-6.3 11.8-11.79v-.54c.8-.58 1.5-1.3 2.05-2.12l-.19-.05z" />
                                                </svg>
                                            </div>
                                            <InputComponent
                                                label=""
                                                name=""
                                                type="text"
                                                placeholder="Username"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="whatsapp" className="block mb-2 text-[#4e5566]">
                                            Whatsapp
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                <svg className="h-4 w-4 text-[#007ab6]" viewBox="0 0 24 24" fill="currentColor">
                                                    <path
                                                        fillRule="evenodd"
                                                        clipRule="evenodd"
                                                        d="M17.415 14.382c-.298-.149-1.759-.867-2.031-.967-.272-.099-.47-.148-.669.15-.198.296-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.1-.198.05-.371-.025-.52-.074-.149-.668-1.612-.916-2.207-.241-.579-.486-.5-.668-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.57-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0011.992 0C5.438 0 .102 5.335.1 11.892c-.001 2.096.546 4.142 1.588 5.945L0 24l6.304-1.654a11.881 11.881 0 005.684 1.448h.005c6.554 0 11.89-5.335 11.892-11.893a11.821 11.821 0 00-3.48-8.413z"
                                                    />
                                                </svg>
                                            </div>
                                            <InputComponent
                                                label=""
                                                name=""
                                                type="text"
                                                placeholder="Phone number"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="youtube" className="block mb-2 text-[#4e5566]">
                                            Youtube
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                <svg className="h-4 w-4 text-[#007ab6]" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                                </svg>
                                            </div>
                                            <InputComponent
                                                label=""
                                                name=""
                                                type="text"
                                                placeholder="Username"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                {/* Education */}
                                <div className="flex-1">
                                    <h2 className="text-2xl font-semibold text-[#1d2026] mt-10 mb-6">Education</h2>

                                    <div className="space-y-6">
                                        <div>
                                            <label htmlFor="school" className="block mb-2 text-[#4e5566]">
                                                School
                                            </label>
                                            <InputComponent
                                                label=""
                                                name=""
                                                type="text"
                                                placeholder="School"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label htmlFor="grade" className="block mb-2 text-[#4e5566]">
                                                    Grade
                                                </label>
                                                <InputComponent
                                                    label=""
                                                    name=""
                                                    type="text"
                                                    placeholder="Grade"
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="degree" className="block mb-2 text-[#4e5566]">
                                                    Degree
                                                </label>
                                                <InputComponent
                                                    label=""
                                                    name=""
                                                    type="text"
                                                    placeholder="Degree"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="fieldOfStudy" className="block mb-2 text-[#4e5566]">
                                                Field of Study
                                            </label>
                                            <InputComponent
                                                label=""
                                                name=""
                                                type="text"
                                                placeholder="Field of Study"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label htmlFor="eduStartDate" className="block mb-2 text-[#4e5566]">
                                                    Start Date
                                                </label>
                                                <div className="relative">
                                                    <InputComponent
                                                        label=""
                                                        name=""
                                                        type="text"
                                                        placeholder="ex:Jun 15,2025"
                                                    />
                                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                        <BsCalendar className="h-4 w-4 text-[#8c94a3]" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <label htmlFor="eduEndDate" className="block mb-2 text-[#4e5566]">
                                                    End Date
                                                </label>
                                                <div className="relative">
                                                    <InputComponent
                                                        label=""
                                                        name=""
                                                        type="text"
                                                        placeholder="ex:Jun 15,2025"
                                                    />
                                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                        <BsCalendar className="h-4 w-4 text-[#8c94a3]" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="currentlyStudying" />
                                            <label htmlFor="currentlyStudying" className="text-sm text-[#4e5566]">
                                                I am currently Studying there
                                            </label>
                                        </div>

                                        <div className="flex justify-center">
                                            <CustomButton
                                                text="Add Education"
                                                className="w-fit"
                                            />
                                        </div>

                                        {/* Education List */}
                                        <div className="space-y-4 mt-6">
                                            <div className="flex items-start gap-4 p-4 border border-[#ced1d9] rounded-md">
                                                <div className="flex-shrink-0 w-10 h-10 bg-[#007ab6] rounded-full flex items-center justify-center text-white">
                                                    <span className="text-xs">ME</span>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between">
                                                        <div>
                                                            <h4 className="font-bold text-[#1d2026]">MASTER OF MANAGEMENT</h4>
                                                            <p className="text-sm text-[#6e7485]">CAIRO UNIVERSITY</p>
                                                            <p className="text-xs text-[#8c94a3]">2019</p>
                                                        </div>
                                                        <button className="text-[#007ab6]">
                                                            <EditOutlined className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-4 p-4 border border-[#ced1d9] rounded-md">
                                                <div className="flex-shrink-0 w-10 h-10 bg-[#007ab6] rounded-full flex items-center justify-center text-white">
                                                    <span className="text-xs">BA</span>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between">
                                                        <div>
                                                            <h4 className="font-bold text-[#1d2026]">BACHELOR OF COMPUTER SCIENCE</h4>
                                                            <p className="text-sm text-[#6e7485]">CAIRO UNIVERSITY</p>
                                                            <p className="text-xs text-[#8c94a3]">2017</p>
                                                        </div>
                                                        <button className="text-[#007ab6]">
                                                            <EditOutlined className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Work Experience */}
                                <div className="mt-8  flex-1">
                                    <h2 className="text-2xl font-semibold text-[#1d2026] mb-6">Work Experience</h2>

                                    <div className="space-y-6">
                                        <div>
                                            <label htmlFor="jobTitle" className="block mb-2 text-[#4e5566]">
                                                Title
                                            </label>
                                            <InputComponent
                                                label=""
                                                name=""
                                                type="text"
                                                placeholder="ex:IT engineer"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="company" className="block mb-2 text-[#4e5566]">
                                                Company or Organization
                                            </label>
                                            <InputComponent
                                                label=""
                                                name=""
                                                type="text"
                                                placeholder="ex:Schest"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="employmentType" className="block mb-2 text-[#4e5566]">
                                                Employment type
                                            </label>
                                            <InputComponent
                                                label=""
                                                name=""
                                                type="text"
                                                placeholder="ex: full time"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 gap-6">
                                            <div>
                                                <label htmlFor="workStartDate" className="block mb-2 text-[#4e5566]">
                                                    Start Date
                                                </label>
                                                <div className="relative">
                                                    <InputComponent
                                                        label=""
                                                        name=""
                                                        type="text"
                                                        placeholder="ex:Jun 15,2025"
                                                    />
                                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                        <BsCalendar className="h-4 w-4 text-[#8c94a3]" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="location" className="block mb-2 text-[#4e5566]">
                                                Location
                                            </label>
                                            <InputComponent
                                                label=""
                                                name=""
                                                type="text"
                                                placeholder="ex: Egypt"

                                            />
                                        </div>

                                        <div className="flex items-center space-x-2">

                                            <Checkbox>
                                                <label htmlFor="currentlyWorking" className="text-sm text-[#4e5566]">
                                                    I am currently working in this role
                                                </label>
                                            </Checkbox>

                                        </div>

                                        <div className="flex justify-center">
                                            <CustomButton
                                                text="Add Work Experience"
                                                className="w-fit"
                                            />
                                        </div>
                                    </div>

                                    {/* Work Experience List */}
                                    <div className="space-y-4 mt-6">
                                        <div className="flex items-start gap-4 p-4 border border-[#ced1d9] rounded-md">
                                            <div className="flex-shrink-0 w-10 h-10 bg-[#007ab6] rounded-full flex items-center justify-center text-white">
                                                <span className="text-xs">UI</span>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between">
                                                    <div>
                                                        <h4 className="font-bold text-[#1d2026]">UI/UX DESIGNER</h4>
                                                        <p className="text-sm text-[#6e7485]">COMPANY NAME</p>
                                                        <p className="text-xs text-[#8c94a3]">June 2019 - Jan 2022 · 2 yrs 3 mos</p>
                                                    </div>
                                                    <button className="text-[#007ab6]">
                                                        <EditOutlined className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4 p-4 border border-[#ced1d9] rounded-md">
                                            <div className="flex-shrink-0 w-10 h-10 bg-[#007ab6] rounded-full flex items-center justify-center text-white">
                                                <span className="text-xs">UI</span>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between">
                                                    <div>
                                                        <h4 className="font-bold text-[#1d2026]">UI/UX DESIGNER</h4>
                                                        <p className="text-sm text-[#6e7485]">COMPANY NAME</p>
                                                        <p className="text-xs text-[#8c94a3]">June 2019 - Jan 2022 · 2 yrs 3 mos</p>
                                                    </div>
                                                    <button className="text-[#007ab6]">
                                                        <EditOutlined className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}

                    </div>

                    {/* Skills and Certifications */}
                    <div className="flex items-center gap-8 mt-5">
                        {/* Skills */}
                        <div className="flex-1">
                            <h2 className="text-2xl font-semibold text-[#1d2026]  mb-6">Skills</h2>

                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="skill1" className="block mb-2 text-[#4e5566]">
                                        Skill-1
                                    </label>
                                    <InputComponent
                                        label=""
                                        name=""
                                        type="text"
                                        placeholder="Skill-1"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="skill2" className="block mb-2 text-[#4e5566]">
                                        Skill-2
                                    </label>
                                    <InputComponent
                                        label=""
                                        name=""
                                        type="text"
                                        placeholder="Skill-2"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="skill3" className="block mb-2 text-[#4e5566]">
                                        Skill-3
                                    </label>
                                    <InputComponent
                                        label=""
                                        name=""
                                        type="text"
                                        placeholder="Skill-3"
                                    />
                                </div>
                            </div>
                        </div>



                        {/* Certifications */}
                        <div className="flex-1">
                            <h2 className="text-2xl font-semibold text-[#1d2026] mb-6">Certifications</h2>

                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="certification1" className="block mb-2 text-[#4e5566]">
                                        Certification-1
                                    </label>
                                    <InputComponent

                                        placeholder="Certification-1"
                                        label=""
                                        name=""
                                        type="text"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="certification2" className="block mb-2 text-[#4e5566]">
                                        Certification-1
                                    </label>
                                    <InputComponent

                                        placeholder="Certification-1"
                                        label=""
                                        name=""
                                        type="text"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="certification3" className="block mb-2 text-[#4e5566]">
                                        Certification-1
                                    </label>
                                    <InputComponent

                                        placeholder="Certification-1"
                                        label=""
                                        name=""
                                        type="text"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Footer Buttons */}
                    <div className="flex items-center justify-end gap-4 mt-10">
                        <WhiteButton
                            text="Cancel"
                            className="!w-fit"
                        />
                        <CustomButton
                            text="Save"
                            className="!w-fit"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}