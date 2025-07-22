# Movie & TV Show Discovery Web App

A responsive entertainment discovery platform where users can search for movies and TV shows, explore detailed information, manage personal watchlists, and discover trending content. Built with data from **TMDB** and **OMDB APIs**.

## Features

### Search & Discovery
- Real-time search for movies and TV shows
- Debounced search input with responsive feedback
- Pagination for large result sets

### Detail Pages
- Title, plot summary, cast, release date
- Poster images and background banners
- Ratings from TMDB, OMDB (IMDB, Rotten Tomatoes)

### Trending & Genre Filtering
- Popular content dashboard (movies & shows)
- Filter by genre and category (e.g., Action, Comedy)

### Watchlist Management
- Add/remove titles from personal watchlist
- Mark items as “watched”
- Data saved in `localStorage`

### Smart Recommendations
- Suggested titles based on watchlist genres

### Extra Features
- Dark/light mode toggle
- Responsive layout (mobile-first)
- Trailer integration via YouTube (optional)
- Export watchlist as PDF/CSV (bonus)
- Share favorite movies with social media links


## Tech Stack

- **Framework**: Next.js 15 with Turbopack
- **Styling**: Tailwind CSS
- **APIs**:
  - [TMDB API](https://api.themoviedb.org/3/discover/movie?/api) (primary)
  - [OMDB API](http://www.omdbapi.com/) (supplementary)
  - [YouTube API](https://developers.google.com/youtube/) (bonus)

---

## Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/shaokoth/film-discovery-app.git
   cd film-discovery-app


## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

