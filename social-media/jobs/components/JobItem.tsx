import { BsCalendar, BsClock } from "react-icons/bs";
import { CiMapPin } from "react-icons/ci";
import { FaDollarSign } from "react-icons/fa6";

export function JobItem() {

    return  <div className="w-full max-w-4xl rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
    <div className="flex flex-col gap-4 md:flex-row md:items-start">
      <div className="h-[112px] w-[112px] flex-shrink-0 rounded bg-[#5755d9]">
        <div className="flex h-full w-full items-center justify-center">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M32 64C49.6731 64 64 49.6731 64 32C64 14.3269 49.6731 0 32 0C14.3269 0 0 14.3269 0 32C0 49.6731 14.3269 64 32 64Z"
              fill="#5755d9"
            />
            <path d="M48 16L16 48" stroke="white" strokeWidth="4" strokeLinecap="round" />
            <path d="M40 16L16 40" stroke="white" strokeWidth="4" strokeLinecap="round" />
            <path d="M32 16L16 32" stroke="white" strokeWidth="4" strokeLinecap="round" />
          </svg>
        </div>
      </div>
      <div className="flex-1">
        <h2 className="text-xl font-medium text-[#141414]">Linear company</h2>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <h1 className="text-3xl font-semibold text-[#007ab6]">Software Engineer</h1>
          <span className="rounded bg-[#e6f2f8] px-3 py-1 text-sm font-medium text-[#007ab6]">New post</span>
        </div>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[#475467]">
          <div className="flex items-center gap-2">
            <CiMapPin className="h-5 w-5 text-gray-500" />
            <span>Madrid</span>
          </div>
          <div className="flex items-center gap-2">
            <BsClock className="h-5 w-5 text-gray-500" />
            <span>Full time</span>
          </div>
          <div className="flex items-center gap-2">
            <FaDollarSign className="h-5 w-5 text-gray-500" />
            <span>30-32k</span>
          </div>
          <div className="flex items-center gap-2">
            <BsCalendar className="h-5 w-5 text-gray-500" />
            <span>1 day ago</span>
          </div>
        </div>
        <p className="mt-6 text-[#475467]">
          Mollit in laborum tempor Lorem incididunt irure. Aute eu ex ad sunt. Pariatur sint culpa do incididunt
          eiusmod eiusmod culpa. laborum tempor Lorem incididunt.
        </p>
      </div>
    </div>
  </div>
}