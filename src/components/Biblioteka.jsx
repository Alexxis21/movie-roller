import React, { useState } from 'react';
import { Star, Bookmark, LayoutGrid, List, Filter, Play, Film, Loader2, ArrowDown, X, Search } from 'lucide-react';
import { GENRES } from '../data/movies';

export default function Biblioteka({
  movies,
  watchlist,
  toggleWatchlist,
  onSelectMovie,
  searchQuery,
  setSearchQuery,
  isLoading,
  onLoadMore,
  page,
  totalPages,
  totalResults,
  selectedGenre,
  setSelectedGenre
}) {
  const [sortBy, setSortBy] = useState('rating');
  const [viewMode, setViewMode] = useState('grid');

  const filteredMovies = [...movies].sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'year') return b.year - a.year;
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    return 0;
  });

  return (
    <div className="pt-24 pb-16 px-4 md:px-8 max-w-[1400px] mx-auto min-h-screen space-y-8">
      {/* Header & Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white flex items-center gap-3">
            <Film className="w-8 h-8 text-pink-400" /> Biblioteka Filmowa
          </h1>
        </div>

        {/* View mode & Sort controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Sort Select */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-zinc-900 border border-white/10 rounded-xl text-xs px-3 py-2.5 text-white focus:outline-none focus:border-pink-500 cursor-pointer"
          >
            <option value="rating">Sortuj: Najwyżej oceniane</option>
            <option value="year">Sortuj: Najnowsze</option>
            <option value="title">Sortuj: Tytuł A-Z</option>
          </select>

          {/* Toggle Grid/List */}
          <div className="flex bg-zinc-900 border border-white/10 rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === 'grid' ? 'bg-pink-500 text-white' : 'text-zinc-400 hover:text-white'
                }`}
              title="Widok siatki"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === 'list' ? 'bg-pink-500 text-white' : 'text-zinc-400 hover:text-white'
                }`}
              title="Widok listy"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Active Search Banner Bar */}
      {searchQuery && (
        <div className="bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-transparent border border-pink-500/40 rounded-2xl p-4 flex items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-center gap-2 text-xs text-white">
            <Search className="w-4 h-4 text-pink-400" />
            <span>Wyniki wyszukiwania dla:</span>
            <strong className="text-pink-300 bg-pink-500/20 px-2 py-0.5 rounded-md border border-pink-500/30">
              "{searchQuery}"
            </strong>
          </div>
          <button
            onClick={() => setSearchQuery('')}
            className="px-3.5 py-1.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-pink-500/30 transition-all cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" /> Wróć do pełnej bazy
          </button>
        </div>
      )}

      {/* Genre Chips */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-zinc-400 flex items-center gap-1 font-semibold mr-2">
            <Filter className="w-3.5 h-3.5" /> Gatunek:
          </span>
          {GENRES.map((g) => (
            <button
              key={g}
              onClick={() => {
                setSelectedGenre(g);
                if (searchQuery) setSearchQuery('');
              }}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${selectedGenre === g && !searchQuery
                ? 'bg-pink-500 text-white font-bold shadow-md shadow-pink-500/30'
                : 'bg-zinc-900/60 border border-white/5 text-zinc-400 hover:text-white'
                }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Movie Results Grid / List */}
      {filteredMovies.length === 0 && !isLoading ? (
        <div className="glass-panel rounded-3xl p-12 text-center max-w-md mx-auto my-12 space-y-4">
          <Film className="w-12 h-12 text-zinc-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">Brak wyników</h3>
          <p className="text-xs text-zinc-400">
            Nie znaleziono filmów spełniających wybrane kryteria wyszukiwania. Spróbuj zresetować wyszukiwanie.
          </p>
          <button
            onClick={() => {
              setSelectedGenre('Wszystkie');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-pink-500 text-white text-xs font-semibold"
          >
            Zresetuj filtry i szukanie
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredMovies.map((movie) => {
            const inWatchlist = watchlist.includes(movie.id);
            return (
              <div
                key={movie.id}
                className="group relative glass-panel rounded-2xl overflow-hidden border border-white/10 hover:border-pink-500/50 transition-all duration-300 hover:-translate-y-1.5 shadow-xl flex flex-col"
              >
                {/* Poster Container */}
                <div
                  onClick={() => onSelectMovie(movie)}
                  className="relative aspect-[2/3] overflow-hidden cursor-pointer bg-zinc-900"
                >
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-xl text-xs font-bold text-amber-400 flex items-center gap-1 border border-amber-500/30">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    {movie.rating}
                  </div>

                  {/* Watchlist Toggle Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWatchlist(movie.id);
                    }}
                    className={`absolute top-3 left-3 p-2 rounded-xl backdrop-blur-md border transition-all ${inWatchlist
                      ? 'bg-pink-500 text-white border-pink-400 shadow-lg shadow-pink-500/40'
                      : 'bg-black/60 text-zinc-300 border-white/10 hover:text-white hover:bg-black'
                      }`}
                    title={inWatchlist ? 'Usuń z listy' : 'Dodaj do listy'}
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>

                  {/* Play Overlay Icon on Hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-pink-500/90 text-white flex items-center justify-center shadow-lg shadow-pink-500/50 transform group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    </div>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-semibold text-pink-400 mb-1">
                      <span>{movie.year}</span>
                      <span>{movie.duration}</span>
                    </div>
                    <h3
                      onClick={() => onSelectMovie(movie)}
                      className="font-bold text-white text-base hover:text-pink-300 cursor-pointer line-clamp-1 transition-colors"
                    >
                      {movie.title}
                    </h3>
                  </div>

                  {/* Genre Badges */}
                  <div className="flex flex-wrap gap-1">
                    {movie.genres.slice(0, 2).map((g) => (
                      <span
                        key={g}
                        className="px-2 py-0.5 rounded bg-zinc-800/80 text-zinc-400 text-[10px] font-medium"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="space-y-4">
          {filteredMovies.map((movie) => {
            const inWatchlist = watchlist.includes(movie.id);
            return (
              <div
                key={movie.id}
                onClick={() => onSelectMovie(movie)}
                className="glass-panel rounded-2xl p-4 border border-white/10 hover:border-pink-500/40 transition-all flex flex-col sm:flex-row items-center gap-4 cursor-pointer group"
              >
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="w-20 h-28 object-cover rounded-xl shrink-0 group-hover:scale-105 transition-transform"
                />

                <div className="flex-1 space-y-1 text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-pink-400 font-semibold">
                    <span>{movie.year}</span>
                    <span>•</span>
                    <span>{movie.duration}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-pink-300 transition-colors">
                    {movie.title}
                  </h3>
                  <p className="text-xs text-zinc-400 line-clamp-2">{movie.synopsis}</p>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="bg-black/60 px-3 py-1.5 rounded-xl text-xs font-bold text-amber-400 flex items-center gap-1 border border-amber-500/20">
                    <Star className="w-4 h-4 fill-amber-400" />
                    {movie.rating}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWatchlist(movie.id);
                    }}
                    className={`p-2.5 rounded-xl border transition-all ${inWatchlist
                      ? 'bg-pink-500 text-white border-pink-400'
                      : 'bg-zinc-800 text-zinc-300 border-white/10 hover:text-white'
                      }`}
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Load More Button / Pagination Controls */}
      <div className="pt-8 flex flex-col items-center gap-3">
        {page < totalPages && (
          <button
            onClick={onLoadMore}
            disabled={isLoading}
            className="px-8 py-3.5 rounded-2xl bg-zinc-900 border border-pink-500/40 text-pink-300 font-bold text-sm hover:bg-pink-500 hover:text-white shadow-xl flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Ładowanie kolejnych filmów...
              </>
            ) : (
              <>
                <ArrowDown className="w-4 h-4" /> Załaduj Więcej Filmów (Strona {page + 1} z {totalPages})
              </>
            )}
          </button>
        )}
        <span className="text-xs text-zinc-500">
          Strona {page} z {totalPages} • Wyświetlono {filteredMovies.length} filmów
        </span>
      </div>
    </div>
  );
}
