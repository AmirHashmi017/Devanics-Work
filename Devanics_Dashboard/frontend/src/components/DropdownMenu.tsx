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

  return (
    <div onClick={handleClick} style={{ display: 'inline-block', cursor: 'pointer' }}>
      {children}
    </div>
  )
}

export const DropdownMenuContent: React.FC<
  DropdownMenuContentProps & { isOpen?: boolean; setIsOpen?: (open: boolean) => void }
> = ({ children, isOpen, setIsOpen, align = "start" }) => {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && contentRef.current) {
      
      const rect = contentRef.current.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      
      contentRef.current.style.left = ''
      contentRef.current.style.right = ''
      contentRef.current.style.top = ''
      contentRef.current.style.bottom = ''

      
      if (rect.right > viewportWidth - 20) {
        contentRef.current.style.right = '0'
        contentRef.current.style.left = 'auto'
      }

      
      if (rect.bottom > viewportHeight - 20) {
        contentRef.current.style.bottom = '100%'
        contentRef.current.style.top = 'auto'
        contentRef.current.style.marginBottom = '4px'
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  const alignmentClass = align === "end" ? "dropdown--actions" : 
                        align === "center" ? "dropdown--user" : 
                        "dropdown--status"

  return (
    <div 
      ref={contentRef}
      className={`dropdown__content ${alignmentClass}`}
      onClick={(e) => e.stopPropagation()}
    >
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