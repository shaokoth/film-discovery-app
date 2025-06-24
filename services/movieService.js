class MovieService {
  constructor() {
    this.TMDB_API_KEY =
      "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ZTFkN2RlOWZkYjUzODhjNTE2NThlNDg3MTQ2ZDc2ZiIsIm5iZiI6MTc1MDY5MTg1OC43MDIwMDAxLCJzdWIiOiI2ODU5NzAxMjRmMWZlOGMwODI2YmE2ZDciLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.cKSOUSzQ-ykD6_1OOcYzfJEPFRHbTsafMcCJZ6EHtD0"
    this.OMDB_API_KEY = "8b8d7f8e" 
    this.TMDB_BASE_URL = "https://api.themoviedb.org/3"
    this.OMDB_BASE_URL = "https://www.omdbapi.com"
    this.cache = new Map()
    this.requestQueue = []
    this.isProcessingQueue = false
  }

  async makeRequest(url) {
    // Check cache first
    if (this.cache.has(url)) {
      const cached = this.cache.get(url)
      if (Date.now() - cached.timestamp < 300000) {
        // 5 minutes cache
        return cached.data
      }
    }

    // Add to request queue for rate limiting
    return new Promise((resolve, reject) => {
      this.requestQueue.push({ url, resolve, reject })
      this.processQueue()
    })
  }

  async processQueue() {
    if (this.isProcessingQueue || this.requestQueue.length === 0) {
      return
    }

    this.isProcessingQueue = true

    while (this.requestQueue.length > 0) {
      const { url, resolve, reject } = this.requestQueue.shift()

      try {
        const headers = {}
        if (url.includes("themoviedb.org")) {
          headers["Authorization"] = `Bearer ${this.TMDB_API_KEY}`
        }

        const response = await fetch(url, { headers })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        // Cache the response
        this.cache.set(url, {
          data,
          timestamp: Date.now(),
        })

        resolve(data)
      } catch (error) {
        reject(error)
      }

      // Rate limiting delay
      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    this.isProcessingQueue = false
  }

  async getGenres() {
    try {
      const [movieGenres, tvGenres] = await Promise.all([
        this.makeRequest(`${this.TMDB_BASE_URL}/genre/movie/list`),
        this.makeRequest(`${this.TMDB_BASE_URL}/genre/tv/list`),
      ])

      return {
        movie: movieGenres.genres || [],
        tv: tvGenres.genres || [],
      }
    } catch (error) {
      console.error("Error loading genres:", error)
      return { movie: [], tv: [] }
    }
  }

  async getContentByType(type, page = 1, genreId = null) {
    let endpoint
    const params = new URLSearchParams({
      page: page.toString(),
      language: "en-US",
    })

    if (genreId) {
      params.append("with_genres", genreId.toString())
    }

    switch (type) {
      case "trending":
        endpoint = `${this.TMDB_BASE_URL}/trending/all/week?${params}`
        break
      case "movies":
        endpoint = `${this.TMDB_BASE_URL}/discover/movie?${params}&sort_by=popularity.desc`
        break
      case "tv":
        endpoint = `${this.TMDB_BASE_URL}/discover/tv?${params}&sort_by=popularity.desc`
        break
      default:
        throw new Error("Invalid content type")
    }

    return await this.makeRequest(endpoint)
  }

  async searchContent(query, page = 1) {
    const params = new URLSearchParams({
      query,
      page: page.toString(),
      language: "en-US",
    })

    return await this.makeRequest(`${this.TMDB_BASE_URL}/search/multi?${params}`)
  }

  async getMovieDetails(id, mediaType) {
    return await this.makeRequest(`${this.TMDB_BASE_URL}/${mediaType}/${id}`)
  }

  async getFullMovieDetails(id, mediaType) {
    try {
      const [tmdbData, credits, omdbData] = await Promise.all([
        this.makeRequest(`${this.TMDB_BASE_URL}/${mediaType}/${id}`),
        this.makeRequest(`${this.TMDB_BASE_URL}/${mediaType}/${id}/credits`),
        this.getOMDBData(id, mediaType),
      ])

      // Prepare ratings
      const ratings = []
      if (tmdbData.vote_average) {
        ratings.push({ source: "TMDB", value: tmdbData.vote_average.toFixed(1) + "/10" })
      }
      if (omdbData && omdbData.Ratings) {
        omdbData.Ratings.forEach((rating) => {
          ratings.push({ source: rating.Source, value: rating.Value })
        })
      }

      return {
        ...tmdbData,
        cast: credits.cast || [],
        ratings,
        media_type: mediaType,
      }
    } catch (error) {
      console.error("Error loading full movie details:", error)
      throw error
    }
  }

  async getOMDBData(tmdbId, mediaType) {
    try {
      // First get IMDB ID from TMDB
      const externalIds = await this.makeRequest(`${this.TMDB_BASE_URL}/${mediaType}/${tmdbId}/external_ids`)

      if (externalIds.imdb_id) {
        const omdbUrl = `${this.OMDB_BASE_URL}/?i=${externalIds.imdb_id}&apikey=${this.OMDB_API_KEY}`
        return await this.makeRequest(omdbUrl)
      }
    } catch (error) {
      console.error("Error fetching OMDB data:", error)
    }
    return null
  }

  async getRecommendations(watchlist) {
    if (watchlist.length === 0) return []

    try {
      const recommendations = new Set()
      const watchlistGenres = new Set()

      // Collect genres from watchlist
      for (const item of watchlist.slice(-5)) {
        // Use last 5 items
        try {
          const details = await this.makeRequest(`${this.TMDB_BASE_URL}/${item.media_type}/${item.id}`)
          if (details.genres) {
            details.genres.forEach((genre) => watchlistGenres.add(genre.id))
          }
        } catch (error) {
          console.error("Error loading item for recommendations:", error)
        }
      }

      // Get recommendations based on genres
      if (watchlistGenres.size > 0) {
        const genreIds = Array.from(watchlistGenres).slice(0, 3).join(",")
        const [movieRecs, tvRecs] = await Promise.all([
          this.makeRequest(
            `${this.TMDB_BASE_URL}/discover/movie?with_genres=${genreIds}&sort_by=popularity.desc&page=1`,
          ),
          this.makeRequest(`${this.TMDB_BASE_URL}/discover/tv?with_genres=${genreIds}&sort_by=popularity.desc&page=1`),
        ])

        // Filter out items already in watchlist
        const filteredMovies = movieRecs.results
          .filter((movie) => !watchlist.some((w) => w.id === movie.id && w.media_type === "movie"))
          .slice(0, 6)

        const filteredTV = tvRecs.results
          .filter((show) => !watchlist.some((w) => w.id === show.id && w.media_type === "tv"))
          .slice(0, 6)

        return [
          ...filteredMovies.map((item) => ({ ...item, media_type: "movie" })),
          ...filteredTV.map((item) => ({ ...item, media_type: "tv" })),
        ].slice(0, 8)
      }

      return []
    } catch (error) {
      console.error("Error loading recommendations:", error)
      return []
    }
  }
}

export const movieService = new MovieService()
