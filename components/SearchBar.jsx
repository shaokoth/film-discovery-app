"use client"

export default function SearchBar({ searchQuery, onSearchChange }) {
  return (
    <div className="relative max-w-2xl mx-auto mb-8">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search for movies and TV shows..."
        className="w-full px-6 py-4 text-lg rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300"
      />
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
        <span className="text-2xl">🔍</span>
      </div>
    </div>
  )
}
