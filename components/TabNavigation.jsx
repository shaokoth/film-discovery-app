"use client"

export default function TabNavigation({ currentTab, onTabChange }) {
  const tabs = [
    { id: "trending", label: "Trending", icon: "🔥" },
    { id: "movies", label: "Movies", icon: "🎬" },
    { id: "tv", label: "TV Shows", icon: "📺" },
    { id: "watchlist", label: "My Watchlist", icon: "❤️" },
  ]

  return (
    <div className="flex justify-center gap-4 mb-8 flex-wrap">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 ${
            currentTab === tab.id
              ? "bg-gradient-to-r from-yellow-400 to-red-500 text-white shadow-lg transform -translate-y-1"
              : "bg-white/10 backdrop-blur-md text-white hover:bg-white/20 hover:transform hover:-translate-y-1"
          }`}
        >
          <span>{tab.icon}</span>
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  )
}
