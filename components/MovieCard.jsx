"use client"

export default function MovieCard({ movie, isInWatchlist, onMovieClick, onToggleWatchlist }) {
  const title = movie.title || movie.name || "Unknown Title"
  const year = movie.release_date || movie.first_air_date || ""
  const yearDisplay = year ? new Date(year).getFullYear() : "N/A"
  const mediaType = movie.media_type || (movie.title ? "movie" : "tv")

  const posterPath = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "/placeholder.svg?height=300&width=200"

  const handleCardClick = () => {
    onMovieClick(movie.id, mediaType)
  }

  const handleWatchlistClick = (e) => {
    e.stopPropagation()
    onToggleWatchlist(movie)
  }

  return (
    <div
      className="relative group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:z-10"
      onClick={handleCardClick}
    >
      <div className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden border border-white/20 shadow-lg group-hover:shadow-2xl group-hover:bg-white/20 transition-all duration-300">
        {/* Poster Image */}
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={posterPath || "/placeholder.svg"}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />

          {/* Watchlist Button */}
          <button
            onClick={handleWatchlistClick}
            className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
              isInWatchlist ? "bg-red-500 text-white shadow-lg" : "bg-black/50 text-white hover:bg-red-500"
            }`}
          >
            {isInWatchlist ? "❤️" : "🤍"}
          </button>

          {/* Rating Badge */}
          {movie.vote_average > 0 && (
            <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
              <span className="text-yellow-400 text-xs">⭐</span>
              <span className="text-white text-xs font-semibold">{movie.vote_average.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Movie Info */}
        <div className="p-3">
          <h3 className="font-semibold text-sm leading-tight mb-1 line-clamp-2 text-white">{title}</h3>
          <p className="text-xs text-white/70 mb-1">{yearDisplay}</p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/60 capitalize">{mediaType === "tv" ? "TV Show" : "Movie"}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
