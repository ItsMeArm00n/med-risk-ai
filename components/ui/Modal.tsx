import React from "react"

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export const Modal: React.FC<ModalProps> = ({ open, onClose, title, children }) => {
  if (!open) return null
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="fixed inset-0 bg-black/40 pointer-events-none"/>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-sm w-full mx-4 p-6 relative z-50 animate-in fade-in-0 zoom-in-95 duration-200">
        {title && <h2 className="text-xl font-semibold mb-4 pr-6">{title}</h2>}
        <div className="mb-4 text-gray-600 dark:text-gray-300">{children}</div>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          aria-label="Close"
        >
          ×
        </button>
      </div>
    </div>
  )
}
