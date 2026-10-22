import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Losownik from './components/Losownik';
import Biblioteka from './components/Biblioteka';
import Dashboard from './components/Dashboard';
import MovieDetailsModal from './components/MovieDetailsModal';
import { MOVIES as FALLBACK_MOVIES } from './data/movies';
import { fetchPopularMoviesApi, searchMoviesApi, fetchMovieDetailsApi } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('losownik');
  const [movies, setMovies] = useState(FALLBACK_MOVIES);

  // Global movie cache map to resolve any movie by ID cleanly
  const [movieCache, setMovieCache] = useState(() => {
    const initialCache = {};
    FALLBACK_MOVIES.forEach((m) => {
      initialCache[String(m.id)] = m;
    });
    return initialCache;
  });

  // Persistent User lists with localStorage auto-save
  const [watchlist, setWatchlist] = useState(() => {
    try {
      const saved = localStorage.getItem('cinevault_watchlist');
      return saved ? Array.from(new Set(JSON.parse(saved))) : [];
    } catch {
      return [];
    }
  });

  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('cinevault_favorites');
      return saved ? Array.from(new Set(JSON.parse(saved))) : [];
    } catch {
      return [];
    }
  });

  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('cinevault_history');
      return saved ? Array.from(new Set(JSON.parse(saved))) : [];
    } catch {
      return [];
    }
  });

  const [customLists, setCustomLists] = useState(() => {
    try {
      const saved = localStorage.getItem('cinevault_customLists');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [selectedMovie, setSelectedMovie] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('Wszystkie');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Save user state to localStorage automatically whenever lists change
  useEffect(() => {
    localStorage.setItem('cinevault_watchlist', JSON.stringify(Array.from(new Set(watchlist))));
  }, [watchlist]);

  useEffect(() => {
    localStorage.setItem('cinevault_favorites', JSON.stringify(Array.from(new Set(favorites))));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('cinevault_history', JSON.stringify(Array.from(new Set(history))));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('cinevault_customLists', JSON.stringify(customLists));
  }, [customLists]);

  // Helper to add movies to global cache using string key indexing
  const cacheMovies = (movieList) => {
    if (!movieList || !Array.isArray(movieList)) return;
    setMovieCache((prev) => {
      const updated = { ...prev };
      movieList.forEach((m) => {
        if (m && m.id !== undefined) updated[String(m.id)] = m;
      });
      return updated;
    });
  };

  // Automatically fetch missing movie details for any ID in user's lists
  useEffect(() => {
    const allUserMovieIds = new Set([
      ...watchlist,
      ...favorites,
      ...history,
      ...customLists.flatMap((l) => l.movieIds)
    ]);

    allUserMovieIds.forEach(async (id) => {
      const stringId = String(id);
      if (!movieCache[stringId]) {
        const details = await fetchMovieDetailsApi(id);
        if (details) {
          cacheMovies([details]);
        }
      }
    });
  }, [watchlist, favorites, history, customLists, movieCache]);

  // Main movie catalog loader: handles full catalog vs live search smoothly
  useEffect(() => {
    let isSubscribed = true;

    if (searchQuery.trim()) {
      const timer = setTimeout(async () => {
        setIsLoading(true);
        setPage(1);
        const data = await searchMoviesApi(searchQuery, 1);
        if (isSubscribed && data && data.results) {
          setMovies(data.results);
          cacheMovies(data.results);
          setTotalPages(data.total_pages || 1);
          setTotalResults(data.total_results || data.results.length);
        }
        if (isSubscribed) setIsLoading(false);
      }, 350);

      return () => {
        isSubscribed = false;
        clearTimeout(timer);
      };
    } else {
      async function loadFullCatalog() {
        setIsLoading(true);
        setPage(1);
        const data = await fetchPopularMoviesApi(1, selectedGenre);
        if (isSubscribed && data && data.results && data.results.length > 0) {
          setMovies(data.results);
          cacheMovies(data.results);
          setTotalPages(data.total_pages || 1);
          setTotalResults(data.total_results || data.results.length);
        }
        if (isSubscribed) setIsLoading(false);
      }
      loadFullCatalog();
    }

    return () => {
      isSubscribed = false;
    };
  }, [selectedGenre, searchQuery]);

  // Load next page of movies
  const handleLoadMore = async () => {
    const nextPage = page + 1;
    setIsLoading(true);
    let data;
    if (searchQuery.trim()) {
      data = await searchMoviesApi(searchQuery, nextPage);
    } else {
      data = await fetchPopularMoviesApi(nextPage, selectedGenre);
    }
    if (data && data.results && data.results.length > 0) {
      cacheMovies(data.results);
      setMovies((prev) => {
        const existingIds = new Set(prev.map((m) => String(m.id)));
        const uniqueNew = data.results.filter((m) => !existingIds.has(String(m.id)));
        return [...prev, ...uniqueNew];
      });
      setPage(nextPage);
    }
    setIsLoading(false);
  };

  // Toggle Watchlist with strict deduplication
  const toggleWatchlist = (movieId) => {
    setWatchlist((prev) => {
      const set = new Set(prev);
      if (set.has(movieId)) {
        set.delete(movieId);
      } else {
        set.add(movieId);
      }
      return Array.from(set);
    });
  };

  // Toggle Favorites with strict deduplication
  const toggleFavorite = (movieId) => {
    setFavorites((prev) => {
      const set = new Set(prev);
      if (set.has(movieId)) {
        set.delete(movieId);
      } else {
        set.add(movieId);
      }
      return Array.from(set);
    });
  };

  // Toggle History / Watched with strict deduplication
  const toggleHistory = (movieId) => {
    setHistory((prev) => {
      const set = new Set(prev);
      if (set.has(movieId)) {
        set.delete(movieId);
      } else {
        set.add(movieId);
      }
      return Array.from(set);
    });
  };

  // Create Custom Collection
  const createCustomList = (name, description) => {
    const newList = {
      id: `list-${Date.now()}`,
      name,
      description: description || '',
      movieIds: [],
      cover: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop'
    };
    setCustomLists((prev) => [...prev, newList]);
  };

  // Delete Custom Collection
  const deleteCustomList = (listId) => {
    setCustomLists((prev) => prev.filter((l) => l.id !== listId));
  };

  // Toggle Movie in Custom Collection
  const toggleMovieInCustomList = (listId, movieId) => {
    setCustomLists((prev) =>
      prev.map((list) => {
        if (list.id !== listId) return list;
        const set = new Set(list.movieIds);
        if (set.has(movieId)) {
          set.delete(movieId);
        } else {
          set.add(movieId);
        }
        return { ...list, movieIds: Array.from(set) };
      })
    );
  };

  const handleSelectMovie = async (movie) => {
    if (movie.id) {
      const detailed = await fetchMovieDetailsApi(movie.id);
      const target = detailed || movie;
      cacheMovies([target]);
      setSelectedMovie(target);
    } else {
      setSelectedMovie(movie);
    }
  };

  // Helper list of all cached movies for components
  const allCachedMovies = Object.values(movieCache);

  return (
    <div className="min-h-screen bg-[#16111c] text-[#eadfee] selection:bg-pink-500 selection:text-white relative">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        watchlistCount={watchlist.length}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Content Views */}
      <main>
        {activeTab === 'losownik' && (
          <Losownik
            movies={allCachedMovies}
            watchlist={watchlist}
            favorites={favorites}
            history={history}
            customLists={customLists}
            toggleWatchlist={toggleWatchlist}
            onSelectMovie={handleSelectMovie}
            toggleHistory={toggleHistory}
          />
        )}

        {activeTab === 'biblioteka' && (
          <Biblioteka
            movies={movies}
            watchlist={watchlist}
            toggleWatchlist={toggleWatchlist}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            onSelectMovie={handleSelectMovie}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isLoading={isLoading}
            onLoadMore={handleLoadMore}
            page={page}
            totalPages={totalPages}
            totalResults={totalResults}
            selectedGenre={selectedGenre}
            setSelectedGenre={setSelectedGenre}
          />
        )}

        {activeTab === 'dashboard' && (
          <Dashboard
            movies={allCachedMovies}
            watchlist={watchlist}
            toggleWatchlist={toggleWatchlist}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            history={history}
            toggleHistory={toggleHistory}
            customLists={customLists}
            createCustomList={createCustomList}
            deleteCustomList={deleteCustomList}
            toggleMovieInCustomList={toggleMovieInCustomList}
            onSelectMovie={handleSelectMovie}
          />
        )}
      </main>

      {/* Movie Details Modal */}
      {selectedMovie && (
        <MovieDetailsModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          watchlist={watchlist}
          toggleWatchlist={toggleWatchlist}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
          history={history}
          toggleHistory={toggleHistory}
          customLists={customLists}
          toggleMovieInCustomList={toggleMovieInCustomList}
          onSelectMovie={handleSelectMovie}
          allMovies={allCachedMovies}
        />
      )}
    </div>
  );
}
