"use client"

import { useState, useEffect } from "react"
import SearchBar from "../components/SearchBar"
import TabNavigation from "../components/TabNavigation"
import GenreFilters from "../components/GenreFilters"
import MovieGrid from "../components/MovieGrid"
import MovieModal from "../components/MovieModal"
import Pagination from "../components/Pagination"
import LoadingSpinner from "../components/LoadingSpinner"
import ErrorMessage from "../components/ErrorMessage"
import { movieService } from "../services/movieService"

export default function MovieDiscoveryApp() {
  const [currentTab, setCurrentTab] = useState("trending")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [currentGenre, setCurrentGenre] = useState(null)
  const [movies, setMovies] = useState([])
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [genres, setGenres] = useState({ movie: [], tv: [] })
  const [watchlist, setWatchlist] = useState([])
  const [recommendations, setRecommendations] = useState([])

  useEffect(() => {
    // Load watchlist from localStorage
    const savedWatchlist = localStorage.getItem("movieWatchlist")
    if (savedWatchlist) {
      setWatchlist(JSON.parse(savedWatchlist))
    }

    // Load genres and initial content
    loadGenres()
    loadContent()
  }, [])

  useEffect(() => {
    loadContent()
  }, [currentTab, currentPage, currentGenre])

  useEffect(() => {
    if (searchQuery.length > 2) {
      const timer = setTimeout(() => {
        setCurrentPage(1)
        loadContent()
      }, 300)
      return () => clearTimeout(timer)
    } else if (searchQuery.length === 0) {
      setCurrentTab("trending")
      setCurrentPage(1)
      loadContent()
    }
  }, [searchQuery])

  const loadGenres = async () => {
    try {
      const genreData = await movieService.getGenres()
      setGenres(genreData)
    } catch (err) {
      console.error("Error loading genres:", err)
    }
  }

  const loadContent = async () => {
    setLoading(true)
    setError("")

    try {
      let data

      if (currentTab === "watchlist") {
        data = await loadWatchlistContent()
      } else if (searchQuery.length > 2) {
        data = await movieService.searchContent(searchQuery, currentPage)
      } else {
        data = await movieService.getContentByType(currentTab, currentPage, currentGenre)
      }

      setMovies(data.results || [])
      setTotalPages(Math.min(data.total_pages || 0, 500))

      // Load recommendations for watchlist
      if (currentTab === "watchlist" && data.results?.length > 0) {
        loadRecommendations()
      }
    } catch (err) {
      setError("Failed to load content. Please try again.")
      console.error("Error loading content:", err)
    } finally {
      setLoading(false)
    }
  }

  const loadWatchlistContent = async () => {
    const watchlistItems = []

    for (const item of watchlist) {
      try {
        const details = await movieService.getMovieDetails(item.id, item.media_type)
        watchlistItems.push({
          ...details,
          media_type: item.media_type,
        })
      } catch (err) {
        console.error(`Error loading watchlist item ${item.id}:`, err)
      }
    }

    return {
      results: watchlistItems,
      total_pages: 1,
      page: 1,
    }
  }

  const loadRecommendations = async () => {
    try {
      const recs = await movieService.getRecommendations(watchlist)
      setRecommendations(recs)
    } catch (err) {
      console.error("Error loading recommendations:", err)
    }
  }

  const handleTabChange = (tab) => {
    setCurrentTab(tab)
    setCurrentPage(1)
    setSearchQuery("")
    setCurrentGenre(null)
  }

  const handleGenreFilter = (genreId) => {
    setCurrentGenre(currentGenre === genreId ? null : genreId)
    setCurrentPage(1)
  }

  const handleMovieClick = async (movieId, mediaType) => {
    try {
      setLoading(true)
      const movieDetails = await movieService.getFullMovieDetails(movieId, mediaType)
      setSelectedMovie(movieDetails)
      setModalOpen(true)
    } catch (err) {
      setError("Failed to load movie details.")
      console.error("Error loading movie details:", err)
    } finally {
      setLoading(false)
    }
  }

  const toggleWatchlist = (movie) => {
    const mediaType = movie.media_type || (movie.title ? "movie" : "tv")
    const isInWatchlist = watchlist.some((item) => item.id === movie.id && item.media_type === mediaType)

    let newWatchlist
    if (isInWatchlist) {
      newWatchlist = watchlist.filter((item) => !(item.id === movie.id && item.media_type === mediaType))
    } else {
      newWatchlist = [
        ...watchlist,
        {
          id: movie.id,
          media_type: mediaType,
          title: movie.title || movie.name,
          added_date: new Date().toISOString(),
        },
      ]
    }

    setWatchlist(newWatchlist)
    localStorage.setItem("movieWatchlist", JSON.stringify(newWatchlist))

    // Refresh watchlist tab if currently active
    if (currentTab === "watchlist") {
      loadContent()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
            🎬 Movie Discovery
          </h1>
          <p className="text-xl text-blue-200">Discover your next favorite movie or TV show</p>
        </div>

        {/* Search Bar */}
        <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

        {/* Tab Navigation */}
        <TabNavigation currentTab={currentTab} onTabChange={handleTabChange} />

        {/* Genre Filters */}
        <GenreFilters
          currentTab={currentTab}
          genres={genres}
          currentGenre={currentGenre}
          onGenreFilter={handleGenreFilter}
        />

        {/* Loading Spinner */}
        {loading && <LoadingSpinner />}

        {/* Error Message */}
        {error && <ErrorMessage message={error} onClose={() => setError("")} />}

        {/* Movie Grid */}
        {!loading && !error && (
          <>
            <MovieGrid
              movies={movies}
              watchlist={watchlist}
              onMovieClick={handleMovieClick}
              onToggleWatchlist={toggleWatchlist}
            />

            {/* Recommendations */}
            {currentTab === "watchlist" && recommendations.length > 0 && (
              <div className="mt-12 pt-8 border-t border-white/20">
                <h2 className="text-3xl font-bold text-center mb-8">🎯 Recommended for You</h2>
                <MovieGrid
                  movies={recommendations}
                  watchlist={watchlist}
                  onMovieClick={handleMovieClick}
                  onToggleWatchlist={toggleWatchlist}
                />
              </div>
            )}

            {/* Pagination */}
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </>
        )}

        {/* Movie Modal */}
        <MovieModal movie={selectedMovie} isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      </div>
    </div>
  )
}
