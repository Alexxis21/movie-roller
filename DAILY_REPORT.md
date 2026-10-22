# CineVault (Filmoteka i Losownik) - Daily Progress Log & Architecture Decisions

This document tracks daily features built, technical architecture decisions, and rationale for the CineVault project.

---

## 📅 2026-07-24

### 🚀 Summary of Work Completed
1. **Project Setup & Design System Foundation**:
   - Initialized Vite + React web application in `c:\Users\Aleksandra\Desktop\movie-roller`.
   - Configured Tailwind CSS with custom design tokens matching Stitch's **Cinematic Noir / Amethyst Noir** theme (`#16111c` dark background, glassmorphism panels, 3D poster stack deck transforms, custom glow animations).
2. **Top Navigation Component (`Navbar.jsx`)**:
   - Built a glassmorphic top header with view navigation, real-time watchlist badge, global search input, notifications button, and user avatar.
3. **Inteligentny Losownik (`Losownik.jsx`)**:
   - Built the movie randomizer with 3D poster deck, custom filter controls (genre chips, release year slider, director/cast tags), spin roll animation, confetti celebration, and instant action buttons.
4. **Biblioteka Filmowa (`Biblioteka.jsx`)**:
   - Built a catalog view supporting Grid and List layout modes, sorting (by rating, release year, title), genre filtering, and search functionality.
5. **Szczegóły Tytułu Modal (`MovieDetailsModal.jsx`)**:
   - Implemented a fullscreen backdrop modal with embedded YouTube trailer player, cast/crew details, and recommendation carousel.
6. **Mój Profil & Listy Dashboard (`Dashboard.jsx`)**:
   - Created the user profile dashboard with live stats counters, custom dedicated collections shelf, list creation modal (`+ Utwórz Nową Listę`), and tabbed list views (*Do Obejrzenia*, *Ulubione*, *Obejrzane*).

---

## 📅 2026-07-27

### 🚀 Summary of Work Completed
1. **Created Daily Progress & Architecture Log (`DAILY_REPORT.md`)**:
   - Established a dedicated tracking log in the codebase root to record all completed features, architectural changes, and rationale after every session.
2. **Created Backend Roadmap & Task Checklist (`BACKEND_TASKS.md`)**:
   - Outlined the full step-by-step roadmap for building the Node.js/Express backend server, TMDB API integration, database schema, and JWT authentication.
3. **Executed Phase 1: Environment & Express Backend Server Setup**:
   - Initialized Express server listening on `http://localhost:5000`.
   - Configured Prisma 7 with SQLite database engine (`dev.db`) using LibSQL driver adapter (`@prisma/adapter-libsql`).
   - Created database models for `User`, `Watchlist`, `Favorite`, `CustomList`, `ListItem`, and `UserRating`.
4. **Live TMDB API Key Activation & Multi-Page Discovery System**:
   - Configured `.env` with live TMDB API key (`TMDB_API_KEY=fa5876db304f1ac0e0c7eb6ad2156be8`).
   - Upgraded [`server/services/tmdbService.js`](file:///c:/Users/Aleksandra/Desktop/movie-roller/server/services/tmdbService.js) to support **Multi-Page Pagination** and **Genre Filtering** across TMDB's full database of over **500,000+ movies**.
   - Added **"Załaduj Więcej Filmów" (Load More Movies)** button in `Biblioteka.jsx` to dynamically fetch pages 2, 3, 4, 5+ without resetting current state.
5. **Eliminated All Front-End Placeholders & Added Dynamic Custom Collections**:
   - Upgraded [`src/App.jsx`](file:///c:/Users/Aleksandra/Desktop/movie-roller/src/App.jsx) and [`src/components/Dashboard.jsx`](file:///c:/Users/Aleksandra/Desktop/movie-roller/src/components/Dashboard.jsx) to make user list counts (*Do Obejrzenia*, *Ulubione*, *Obejrzane*) 100% dynamic.
   - Added full CRUD functionality for **Dedykowane Kolekcje (Custom Lists)**.
6. **Removed Streaming Platforms Aspect**:
   - Cleaned up platform filters and platform badges across `Losownik.jsx`, `Biblioteka.jsx`, `MovieDetailsModal.jsx`, `data/movies.js`, and `tmdbService.js`.
7. **Converted Źródło Losowania to Dropdown Select Menu with Explicit Lists**:
   - Built a rich `<select>` dropdown menu in [`src/components/Losownik.jsx`](file:///c:/Users/Aleksandra/Desktop/movie-roller/src/components/Losownik.jsx).
8. **Resolved & Fixed Year Range Querying (Eliminated Out-of-Range Fallbacks)**:
   - Re-engineered [`server/services/tmdbService.js`](file:///c:/Users/Aleksandra/Desktop/movie-roller/server/services/tmdbService.js) to pass the entire date interval directly to TMDB discover, followed by strict candidate validation.
9. **Eliminated Spin Animation State Leak Bug**:
   - Fixed [`src/components/Losownik.jsx`](file:///c:/Users/Aleksandra/Desktop/movie-roller/src/components/Losownik.jsx) to perform full API fetch AND validation *before* updating `resultMovie`.
10. **Removed Hardcoded Collection Placeholders & Implemented Global Movie Cache**:
    - Removed default dummy list `Maraton Sci-Fi z Przyjaciółmi` so `customLists` starts clean (`[]`).
    - Added global `movieCache` map in [`src/App.jsx`](file:///c:/Users/Aleksandra/Desktop/movie-roller/src/App.jsx) so every movie in your Watchlist, Favorites, History, or Custom Collection always resolves with full title, poster, year, and rating.
11. **Implemented Client State Persistence across Browser Sessions**:
    - Configured automatic state persistence in [`src/App.jsx`](file:///c:/Users/Aleksandra/Desktop/movie-roller/src/App.jsx) via `localStorage` (`cinevault_watchlist`, `cinevault_favorites`, `cinevault_history`, `cinevault_customLists`).

---

## 📅 2026-07-29

### 🚀 Summary of Work Completed
1. **Resolved Search Bar Reset & Full Catalog Restoration Bug**:
   - Updated `useEffect` in [`src/App.jsx`](file:///c:/Users/Aleksandra/Desktop/movie-roller/src/App.jsx) to automatically reload the full TMDB popular catalog whenever `searchQuery` is cleared.
2. **Added Quick Clear `(X)` Button & Auto-Navigation in Navbar**:
   - Added a 1-click `(X)` clear icon in [`src/components/Navbar.jsx`](file:///c:/Users/Aleksandra/Desktop/movie-roller/src/components/Navbar.jsx) to instantly wipe search text and return to the full movie database.
3. **Added Active Search Banner Bar in Biblioteka**:
   - Created a search status banner in [`src/components/Biblioteka.jsx`](file:///c:/Users/Aleksandra/Desktop/movie-roller/src/components/Biblioteka.jsx) displaying current search terms with a **"Wróć do pełnej bazy"** button.
4. **Live Actor & Director Autocomplete Suggestions in Losownik**:
   - Created `searchPersons(query)` in [`server/services/tmdbService.js`](file:///c:/Users/Aleksandra/Desktop/movie-roller/server/services/tmdbService.js) and `GET /api/movies/persons?q=...` endpoint in [`server/routes/movies.js`](file:///c:/Users/Aleksandra/Desktop/movie-roller/server/routes/movies.js).
5. **Integrated TMDB `with_people` Actor/Director Discovery Filter**:
   - Updated `getRandomMovie` in [`server/services/tmdbService.js`](file:///c:/Users/Aleksandra/Desktop/movie-roller/server/services/tmdbService.js) to resolve the person's TMDB ID and query `&with_people=${personId}` directly on TMDB discover.
6. **Resolved First-Click Asynchronous Tag State Delay**:
   - Updated [`src/components/Losownik.jsx`](file:///c:/Users/Aleksandra/Desktop/movie-roller/src/components/Losownik.jsx) to evaluate `activePerson` synchronously from both `tags[0]` and `personTag.trim()`.
7. **Fixed User List Count Discrepancies (`Do Obejrzenia` & `Obejrzane`)**:
   - Removed automatic background `toggleHistory` calls in [`src/components/Losownik.jsx`](file:///c:/Users/Aleksandra/Desktop/movie-roller/src/components/Losownik.jsx).
8. **Added Bulk Clear & Individual Removal Controls in Dashboard**:
   - Added a **"Wyczyść całą historię Obejrzane"** button in [`src/components/Dashboard.jsx`](file:///c:/Users/Aleksandra/Desktop/movie-roller/src/components/Dashboard.jsx).
9. **Fixed Unrendered Card Issue for Saved List Movies**:
   - **Root Cause**: When movies added from TMDB search or randomizer had string vs number ID type mismatches or were not yet fetched in the client's `movieCache`, `resolveMovie` filtered them out, rendering fewer cards than the count badge indicated.
   - **Fix**: Added automatic missing movie detail fetching in [`src/App.jsx`](file:///c:/Users/Aleksandra/Desktop/movie-roller/src/App.jsx) for any ID present in user lists, normalized cache keys as strings (`String(id)`), and added graceful fallback card resolution in [`src/components/Dashboard.jsx`](file:///c:/Users/Aleksandra/Desktop/movie-roller/src/components/Dashboard.jsx).

### 💡 Rationale & Design Choices
- **Automatic Missing Cache Hydration**: Hydrating missing movie details directly from TMDB when reading user list IDs guarantees that every saved movie always renders its poster card regardless of when or how it was added.

---

*Updated automatically after each work session.*
