"use client"

import { useEffect } from "react"

export default function MovieModal({ movie, isOpen, onClose }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose])

  if (!isOpen || !movie) return null

  const title = movie.title || movie.name
  const year = movie.release_date || movie.first_air_date || ""
  const yearDisplay = year ? new Date(year).getFullYear() : "N/A"
  const runtime = movie.runtime || (movie.episode_run_time && movie.episode_run_time[0]) || "N/A"
  const genres = movie.genres ? movie.genres.map((g) => g.name).join(", ") : "N/A"

  const backdropPath = movie.backdrop_path ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}` : null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-blue-900 to-purple-900 rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-red-500 rounded-full flex items-center justify-center text-white transition-all duration-300"
        >
          ✕
        </button>

        {/* Header with Backdrop */}
        <div
          className="relative h-64 md:h-80 bg-cover bg-center rounded-t-2xl"
          style={{
            backgroundImage: backdropPath
              ? `url(${backdropPath})`
              : "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 to-transparent rounded-t-2xl" />
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">{title}</h2>

          {/* Meta Information */}
          <div className="flex flex-wrap gap-3 mb-6">
            <span className="px-3 py-1 bg-white/20 rounded-full text-sm">{yearDisplay}</span>
            <span className="px-3 py-1 bg-white/20 rounded-full text-sm">{runtime} min</span>
            <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
              {movie.media_type === "tv" ? "TV Show" : "Movie"}
            </span>
            {movie.vote_average > 0 && (
              <span className="px-3 py-1 bg-yellow-500/20 rounded-full text-sm flex items-center gap-1">
                <span className="text-yellow-400">⭐</span>
                {movie.vote_average.toFixed(1)}
              </span>
            )}
          </div>

          {/* Plot */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3 text-white">Plot</h3>
            <p className="text-white/90 leading-relaxed">{movie.overview || "No plot available."}</p>
          </div>

          {/* Genres */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3 text-white">Genres</h3>
            <p className="text-white/90">{genres}</p>
          </div>

          {/* Ratings */}
          {movie.ratings && movie.ratings.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3 text-white">Ratings</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {movie.ratings.map((rating, index) => (
                  <div key={index} className="text-center bg-white/10 rounded-lg p-3">
                    <div className="text-xs text-white/70 mb-1">{rating.source}</div>
                    <div className="text-lg font-bold text-yellow-400">{rating.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cast */}
          {movie.cast && movie.cast.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4 text-white">Cast</h3>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                {movie.cast.slice(0, 12).map((actor) => (
                  <div key={actor.id} className="text-center">
                    <img
                      src={
                        actor.profile_path
                          ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                          : "/placeholder.svg?height=120&width=80"
                      }
                      alt={actor.name}
                      className="w-full aspect-[2/3] object-cover rounded-lg mb-2"
                      loading="lazy"
                    />
                    <div className="text-sm font-semibold text-white">{actor.name}</div>
                    <div className="text-xs text-white/70">{actor.character}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
