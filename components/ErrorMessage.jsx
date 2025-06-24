"use client"

export default function ErrorMessage({ message, onClose }) {
  return (
    <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6 flex items-center justify-between backdrop-blur-md">
      <div className="flex items-center gap-3">
        <span className="text-2xl">⚠️</span>
        <span className="text-white">{message}</span>
      </div>
      <button onClick={onClose} className="text-white hover:text-red-300 transition-colors duration-300">
        ✕
      </button>
    </div>
  )
}
