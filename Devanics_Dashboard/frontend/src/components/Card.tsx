import type React from "react"

interface CardProps {
  children: React.ReactNode
  className?: string
}

interface CardContentProps {
  children: React.ReactNode
  className?: string
}

export const Card: React.FC<CardProps> = ({ children, className = "" }) => {
  return <div className={`card ${className}`}>{children}</div>
}

export const CardContent: React.FC<CardContentProps> = ({ children, className = "" }) => {
  return <div className={`card__content ${className}`}>{children}</div>
}
