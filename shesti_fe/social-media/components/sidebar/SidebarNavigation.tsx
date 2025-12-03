'use client';

import type React from 'react';
// import { useState } from "react"
import { SidebarItem } from './SidebarItem';

export interface NavigationItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  href: string;
}

interface SidebarNavigationProps {
  items: NavigationItem[];
  activeId?: string;
  onChange?: (href: string) => void;
  className?: string;
}

export function SidebarNavigation({
  items,
  activeId,
  onChange,
  className = '',
}: SidebarNavigationProps) {
  const handleItemClick = (item: NavigationItem) => {
    if (onChange) {
      onChange(item.href); // Pass the href to onChange
    }
  };

  return (
    <div
      className={`w-full rounded-xl overflow-hidden shadow border border-gray-100 ${className}`}
    >
      {items.map((item) => (
        <SidebarItem
          key={item.id}
          icon={item.icon}
          label={item.label}
          isActive={item.id === activeId} // Compare IDs, not href
          onClick={() => handleItemClick(item)}
        />
      ))}
    </div>
  );
}
