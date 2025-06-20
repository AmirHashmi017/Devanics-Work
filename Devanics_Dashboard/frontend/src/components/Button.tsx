import type React from "react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost" | "outline"
  size?: "default" | "sm" | "lg" | "icon"
  children: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
  variant = "default",
  size = "default",
  className = "",
  children,
  ...props
}) => {
  const baseClass = "button"
  const variantClass = `button--${variant}`
  const sizeClass = `button--${size}`

  return (
    <button className={`${baseClass} ${variantClass} ${sizeClass} ${className}`} {...props}>
      {children}
    </button>
  )
}
