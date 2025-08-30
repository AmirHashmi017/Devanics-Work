"use client"

import type React from "react"

export interface SidebarItemProps {
    icon: React.ReactNode
    label: string
    isActive?: boolean
    onClick?: () => void
}

export function SidebarItem({ icon, label, isActive = false, onClick }: SidebarItemProps) {
    return (
        <div
            className={`flex items-center relative border-b border-gray-100 cursor-pointer transition-colors duration-200 hover:bg-gray-50 ${isActive ? "bg-white" : ""}`}
            onClick={onClick}
        >
            {isActive && <div className="absolute left-0 top-0 bottom-0 w-3 bg-schestiPrimary"></div>}
            <div className="py-2 px-2.5 flex items-center w-full">
                <div className={`${isActive ? " text-schestiPrimary" : "text-gray-700"} py-2 rounded mx-3`}>{icon}</div>
                <span className={`${isActive ? "text-schestiPrimary" : "text-gray-600"} text-base font-medium`}>{label}</span>
            </div>
        </div>
    )
}

