"use client"

import React, { useState, useRef, useEffect } from "react"

interface DropdownMenuProps {
  children: React.ReactNode
  className?: string
}

interface DropdownMenuTriggerProps {
  asChild?: boolean
  children: React.ReactNode
}

interface DropdownMenuContentProps {
  children: React.ReactNode
  align?: "start" | "end" | "center"
}

interface DropdownMenuItemProps {
  children: React.ReactNode
  onClick?: () => void
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({ children, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleEscape)
      // Prevent body scroll when dropdown is open
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  return (
    <div className={`dropdown ${className}`} ref={dropdownRef}>
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child as React.ReactElement<any>, { isOpen, setIsOpen })
          : child,
      )}
    </div>
  )
}

export const DropdownMenuTrigger: React.FC<
  DropdownMenuTriggerProps & { isOpen?: boolean; setIsOpen?: (open: boolean) => void }
> = ({ children, isOpen, setIsOpen }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsOpen?.(!isOpen)
  }

  return <div onClick={handleClick}>{children}</div>
}

export const DropdownMenuContent: React.FC<
  DropdownMenuContentProps & { isOpen?: boolean; setIsOpen?: (open: boolean) => void }
> = ({ children, isOpen, setIsOpen, align = "start" }) => {
  if (!isOpen) return null

  const alignmentClass =
    align === "end" ? "dropdown--actions" : align === "center" ? "dropdown--user" : "dropdown--status"

  return (
    <div className={`dropdown__content ${alignmentClass}`}>
      {React.Children.map(children, (child) =>
        React.isValidElement(child) ? React.cloneElement(child as React.ReactElement<any>, { setIsOpen }) : child,
      )}
    </div>
  )
}

export const DropdownMenuItem: React.FC<DropdownMenuItemProps & { setIsOpen?: (open: boolean) => void }> = ({
  children,
  onClick,
  setIsOpen,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onClick?.()
    setIsOpen?.(false)
  }

  return (
    <div className="dropdown__item" onClick={handleClick}>
      {children}
    </div>
  )
}
