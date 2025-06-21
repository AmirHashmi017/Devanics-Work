"use client"

import type React from "react"
import { useEffect } from "react"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"
import "../styles/Slider.css"

interface SliderProps {
  type: "success" | "error" | "warning" | "info"
  message: string
  show: boolean
  onClose: () => void
  autoClose?: boolean
  duration?: number
}

const Slider: React.FC<SliderProps> = ({ type, message, show, onClose, autoClose = true, duration = 3000 }) => {
  useEffect(() => {
    if (show && autoClose) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [show, autoClose, duration, onClose])

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle size={20} />
      case "error":
        return <AlertCircle size={20} />
      case "warning":
        return <AlertTriangle size={20} />
      case "info":
        return <Info size={20} />
    }
  }

  return (
    <div className={`slider ${show ? "slider--show" : ""} slider--${type}`}>
      <div className="slider__content">
        <div className="slider__icon">{getIcon()}</div>
        <div className="slider__message">{message}</div>
        <button className="slider__close" onClick={onClose}>
          <X size={18} />
        </button>
      </div>
      {autoClose && show && (
        <div className="slider__progress">
          <div className="slider__progress-bar" style={{ animationDuration: `${duration}ms` }} />
        </div>
      )}
    </div>
  )
}

export default Slider
