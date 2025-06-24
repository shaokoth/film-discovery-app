"use client"

export default function GenreFilters({ currentTab, genres, currentGenre, onGenreFilter }) {
  if (currentTab === "watchlist" || currentTab === "trending") {
    return null
  }

  const genreList = currentTab === "movies" ? genres.movie : genres.tv

  return (
    <div className="flex flex-wrap justify-center gap-3 mb-8">
      {genreList.map((genre) => (
        <button
          key={genre.id}
          onClick={() => onGenreFilter(genre.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
            currentGenre === genre.id
              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
              : "bg-white/10 backdrop-blur-md text-white hover:bg-white/20 border border-white/20"
          }`}
        >
          {genre.name}
        </button>
      ))}
    </div>
  )
}
