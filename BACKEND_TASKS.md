# CineVault (Filmoteka i Losownik) - Backend Development Task List

Roadmap and checklist for building a fully working backend server integrated with the **TMDB (The Movie Database) / IMDb API** and a persistent database.

---

## 🎯 Architecture Overview
- **Backend Stack**: Node.js + Express.js
- **Database**: SQLite with Prisma ORM 7 & LibSQL driver adapter (`dev.db`)
- **Authentication**: JWT (JSON Web Tokens) with bcrypt password hashing
- **External Data Source**: TMDB API v3 (movies, genres, trailers, cast/crew, streaming providers)
- **Cache & Fallback**: Smart fallback mechanism so app functions smoothly before API key is provided

---

## 📋 Task Checklist

### Phase 1: Environment & Server Setup
- [x] **1.1. Initialize Backend Project**:
  - Installed Express, Cors, Dotenv, JWT, bcryptjs, Prisma 7, LibSQL adapter.
  - Configured `.env` file (`PORT=5000`, `DATABASE_URL`, `JWT_SECRET`, `TMDB_API_KEY`).
  - Added npm scripts `"server": "nodemon server/index.js"` and `"start:server": "node server/index.js"`.
- [x] **1.2. Setup Database Schema (Prisma / SQLite)**:
  - Defined Prisma models:
    - `User` (id, email, passwordHash, name, avatarUrl, createdAt)
    - `Watchlist` (id, userId, tmdbId, addedAt)
    - `Favorite` (id, userId, tmdbId, addedAt)
    - `CustomList` (id, userId, title, description, coverUrl, createdAt)
    - `ListItem` (id, listId, tmdbId)
    - `UserRating` (id, userId, tmdbId, rating, reviewText, updatedAt)
  - Generated database and client (`npx prisma db push` and `npx prisma generate`).

---

### Phase 2: External Movie API Service (TMDB Integration)
- [x] **2.1. TMDB Service Module (`server/services/tmdbService.js`)**:
  - Implemented fetch routines (`fetchPopularMovies`, `searchMovies`, `getRandomMovie`) with intelligent mock fallback when TMDB API key is pending.
- [x] **2.2. Randomizer Engine (`server/services/randomizerService.js`)**:
  - Filtering logic based on genres, year range, and random pool selection.

---

### Phase 3: REST API Endpoints

#### 🎬 Movie Endpoints (`/api/movies`)
- [x] `GET /api/movies/popular` - Fetch popular movies.
- [x] `GET /api/movies/search?q=...` - Search across movies.
- [x] `GET /api/movies/random` - Randomizer query endpoint.

#### 👤 Auth Endpoints (`/api/auth`)
- [x] `POST /api/auth/register` - Create user account.
- [x] `POST /api/auth/login` - Authenticate user & return JWT token.
- [x] `GET /api/auth/me` - Fetch authenticated user profile data.

#### 🔖 User Lists & Watchlist Endpoints (`/api/user`)
- [x] `GET /api/user/watchlist` - Get watchlist.
- [x] `POST /api/user/watchlist` - Toggle watchlist.
- [x] `GET /api/user/favorites` - Get favorites.
- [x] `GET /api/user/lists` - Fetch custom user lists.
- [x] `POST /api/user/lists` - Create custom collection list.

---

### Phase 4: Frontend API Integration
- [ ] **4.1. Create Frontend API Client (`src/services/api.js`)**:
  - Setup Axios/fetch instance with base URL and auth token headers.
- [ ] **4.2. Connect Components**:
  - Update `Losownik.jsx` to request random movies from `/api/movies/random`.
  - Update `Biblioteka.jsx` to fetch real movies from `/api/movies/popular` and `/api/movies/search`.
  - Update `MovieDetailsModal.jsx` to fetch trailers & watch providers dynamically.
  - Update `Dashboard.jsx` to read/write real user watchlists, favorites, and custom lists from the database.

---

### Phase 5: Verification & Testing
- [x] Tested `/api/health` endpoint on `http://localhost:5000`.
- [ ] End-to-end frontend to backend connection test.
