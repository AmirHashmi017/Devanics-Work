"use client"

import type React from "react"
import { useState } from "react"
import { SidebarItem } from "./SidebarItem"

export interface NavigationItem {
    id: string
    icon: React.ReactNode
    label: string
    href: string
}

interface SidebarNavigationProps {
    items: NavigationItem[]
    defaultActiveId?: string
    onChange?: (href: string) => void
    className?: string
}

export function SidebarNavigation({ items, defaultActiveId, onChange, className = "" }: SidebarNavigationProps) {
    const [activeId, setActiveId] = useState<string>(defaultActiveId || items[0]?.id || "")

    const handleItemClick = (href: string) => {
        setActiveId(href)
        if (onChange) {
            onChange(href)
        }
    }

    return (
        <div className={`w-full rounded-xl overflow-hidden shadow border border-gray-100 ${className}`}>
            {items.map((item,) => (
                <SidebarItem
                    key={item.id}
                    icon={item.icon}
                    label={item.label}
                    isActive={item.href === activeId}
                    onClick={() => handleItemClick(item.href)}
                />
            ))}
        </div>
    )
}

