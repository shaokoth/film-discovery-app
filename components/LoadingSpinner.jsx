"use client"

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-yellow-400 rounded-full animate-spin animation-delay-150"></div>
      </div>
      <p className="mt-4 text-xl text-white/80">Loading amazing content...</p>
    </div>
  )
}
