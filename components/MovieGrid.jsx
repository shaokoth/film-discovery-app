"use client"

import MovieCard from "./MovieCard"

export default function MovieGrid({ movies, watchlist, onMovieClick, onToggleWatchlist }) {
  if (!movies || movies.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🎭</div>
        <p className="text-xl text-white/70">No movies found. Try a different search or filter.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 mb-8">
      {movies.map((movie) => (
        <MovieCard
          key={`${movie.id}-${movie.media_type || (movie.title ? "movie" : "tv")}`}
          movie={movie}
          isInWatchlist={watchlist.some(
            (item) => item.id === movie.id && item.media_type === (movie.media_type || (movie.title ? "movie" : "tv")),
          )}
          onMovieClick={onMovieClick}
          onToggleWatchlist={onToggleWatchlist}
        />
      ))}
    </div>
  )
}
