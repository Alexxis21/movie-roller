import React, { useState } from 'react';
import { Bookmark, Heart, CheckCircle2, FolderPlus, Trash2, Film, Plus, Star, Play, Sparkles, X, LayoutGrid, RotateCcw } from 'lucide-react';

export default function Dashboard({
  movies = [],
  watchlist = [],
  toggleWatchlist,
  favorites = [],
  toggleFavorite,
  history = [],
  toggleHistory,
  customLists = [],
  createCustomList,
  deleteCustomList,
  toggleMovieInCustomList,
  onSelectMovie
}) {
  const [activeTab, setActiveTab] = useState('watchlist');
  const [selectedCustomListId, setSelectedCustomListId] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newListDesc, setNewListDesc] = useState('');

  // Clear entire list helpers
  const clearWatchlist = () => {
    watchlist.forEach((id) => toggleWatchlist(id));
  };
  const clearFavorites = () => {
    favorites.forEach((id) => toggleFavorite(id));
  };
  const clearHistory = () => {
    history.forEach((id) => toggleHistory(id));
  };

  // Robust movie resolution matching both number and string IDs
  const resolveMovie = (id) =>
    movies.find((m) => String(m.id) === String(id)) || {
      id,
      title: `Film (#${id})`,
      year: 2024,
      rating: 8.0,
      duration: '2h',
      genres: ['Film'],
      posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop'
    };

  const getWatchlistMovies = () => watchlist.map(resolveMovie).filter(Boolean);
  const getFavoriteMovies = () => favorites.map(resolveMovie).filter(Boolean);
  const getHistoryMovies = () => history.map(resolveMovie).filter(Boolean);

  const handleCreateList = (e) => {
    e.preventDefault();
    if (!newListName.trim()) return;
    createCustomList(newListName.trim(), newListDesc.trim());
    setNewListName('');
    setNewListDesc('');
    setShowCreateModal(false);
  };

  const currentTabMovies =
    activeTab === 'watchlist'
      ? getWatchlistMovies()
      : activeTab === 'favorites'
        ? getFavoriteMovies()
        : activeTab === 'history'
          ? getHistoryMovies()
          : [];

  const selectedCustomList = customLists.find((l) => l.id === selectedCustomListId);
  const customListMovies = selectedCustomList
    ? selectedCustomList.movieIds.map(resolveMovie).filter(Boolean)
    : [];

  return (
    <div className="pt-24 pb-16 px-4 md:px-8 max-w-[1400px] mx-auto min-h-screen space-y-8">
      {/* Header Profile Section */}
      <div className="glass-panel rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-pink-500/50 shadow-xl shrink-0">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop"
              alt="Profil użytkownika"
              className="w-full h-full object-cover"
            />
          </div> */}

          {/* User Info & Stats */}
          <div className="flex-1 text-center md:text-left space-y-4">
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <h1 className="text-2xl md:text-3xl font-extrabold text-white">Aleksandra</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold bg-pink-500/20 text-pink-300 border border-pink-500/30">
                  Cinephile VIP
                </span>
              </div>
              {/* <p className="text-xs text-zinc-400 mt-1">Twój spersonalizowany kokpit kinowy i autorskie kolekcje.</p> */}
            </div>

            {/* Quick Stat Counters */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              <div className="bg-zinc-900/80 px-4 py-2 rounded-2xl border border-white/5 flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-pink-400" />
                <span className="text-xs text-zinc-400">Do Obejrzenia:</span>
                <span className="text-sm font-bold text-white">{watchlist.length}</span>
              </div>

              <div className="bg-zinc-900/80 px-4 py-2 rounded-2xl border border-white/5 flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
                <span className="text-xs text-zinc-400">Ulubione:</span>
                <span className="text-sm font-bold text-white">{favorites.length}</span>
              </div>

              <div className="bg-zinc-900/80 px-4 py-2 rounded-2xl border border-white/5 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                <span className="text-xs text-zinc-400">Obejrzane:</span>
                <span className="text-sm font-bold text-white">{history.length}</span>
              </div>

              <div className="bg-zinc-900/80 px-4 py-2 rounded-2xl border border-white/5 flex items-center gap-2">
                <LayoutGrid className="w-4 h-4 text-amber-400" />
                <span className="text-xs text-zinc-400">Własne Kolekcje:</span>
                <span className="text-sm font-bold text-white">{customLists.length}</span>
              </div>
            </div>
          </div>

          {/* Action Button: Create Custom List */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-pink-500/30 transition-all cursor-pointer shrink-0"
          >
            <FolderPlus className="w-4 h-4" /> Utwórz Nową Listę
          </button>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="border-b border-white/10 flex flex-wrap items-center justify-between gap-4 pb-2">
        <div className="flex gap-2">
          <button
            onClick={() => {
              setActiveTab('watchlist');
              setSelectedCustomListId(null);
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${activeTab === 'watchlist'
              ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/30'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
          >
            <Bookmark className="w-4 h-4" /> Do Obejrzenia ({watchlist.length})
          </button>

          <button
            onClick={() => {
              setActiveTab('favorites');
              setSelectedCustomListId(null);
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${activeTab === 'favorites'
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
          >
            <Heart className="w-4 h-4" /> Ulubione ({favorites.length})
          </button>

          <button
            onClick={() => {
              setActiveTab('history');
              setSelectedCustomListId(null);
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${activeTab === 'history'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
          >
            <CheckCircle2 className="w-4 h-4" /> Obejrzane ({history.length})
          </button>

          <button
            onClick={() => setActiveTab('custom')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${activeTab === 'custom'
              ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
          >
            <LayoutGrid className="w-4 h-4" /> Dedykowane Kolekcje ({customLists.length})
          </button>
        </div>

        {/* Clear List Button */}
        {activeTab === 'watchlist' && watchlist.length > 0 && (
          <button
            onClick={clearWatchlist}
            className="px-3.5 py-1.5 rounded-xl bg-zinc-900 border border-white/10 hover:border-rose-500/50 text-zinc-400 hover:text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" /> Wyczyść listę "Do Obejrzenia"
          </button>
        )}

        {activeTab === 'favorites' && favorites.length > 0 && (
          <button
            onClick={clearFavorites}
            className="px-3.5 py-1.5 rounded-xl bg-zinc-900 border border-white/10 hover:border-rose-500/50 text-zinc-400 hover:text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" /> Wyczyść "Ulubione"
          </button>
        )}

        {activeTab === 'history' && history.length > 0 && (
          <button
            onClick={clearHistory}
            className="px-3.5 py-1.5 rounded-xl bg-zinc-900 border border-white/10 hover:border-rose-500/50 text-zinc-400 hover:text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Wyczyść całą historię "Obejrzane"
          </button>
        )}
      </div>

      {/* View: Standard Lists (Watchlist / Favorites / History) */}
      {activeTab !== 'custom' ? (
        currentTabMovies.length === 0 ? (
          <div className="glass-panel rounded-3xl p-12 text-center max-w-md mx-auto my-12 space-y-4">
            <Film className="w-12 h-12 text-zinc-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">Ta lista jest pusta</h3>
            <p className="text-xs text-zinc-400">
              Przeglądaj bibliotekę lub użyj Losownika, aby dodać pierwsze filmy do swojej kolekcji.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {currentTabMovies.map((movie) => (
              <div
                key={movie.id}
                onClick={() => onSelectMovie(movie)}
                className="group glass-panel rounded-2xl overflow-hidden border border-white/10 hover:border-pink-500/50 transition-all duration-300 hover:-translate-y-1.5 shadow-xl cursor-pointer flex flex-col relative"
              >
                {/* Remove single item button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (activeTab === 'watchlist') toggleWatchlist(movie.id);
                    if (activeTab === 'favorites') toggleFavorite(movie.id);
                    if (activeTab === 'history') toggleHistory(movie.id);
                  }}
                  className="absolute top-3 left-3 z-30 p-1.5 rounded-xl bg-black/80 text-zinc-400 hover:text-rose-300 hover:bg-rose-950/80 border border-white/10 transition-colors cursor-pointer"
                  title="Usuń z tej listy"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="relative aspect-[2/3] overflow-hidden bg-zinc-900">
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-xl text-xs font-bold text-amber-400 flex items-center gap-1 border border-amber-500/30">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    {movie.rating}
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-semibold text-pink-400 mb-1">
                      <span>{movie.year}</span>
                      <span>{movie.duration}</span>
                    </div>
                    <h3 className="font-bold text-white text-base group-hover:text-pink-300 transition-colors line-clamp-1">
                      {movie.title}
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {movie.genres && movie.genres.slice(0, 2).map((g) => (
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
            ))}
          </div>
        )
      ) : (
        /* View: Custom Lists Shelf */
        <div className="space-y-8">
          {customLists.length === 0 ? (
            <div className="glass-panel rounded-3xl p-12 text-center max-w-md mx-auto my-12 space-y-4">
              <FolderPlus className="w-12 h-12 text-amber-400 mx-auto" />
              <h3 className="text-lg font-bold text-white">Brak własnych kolekcji</h3>
              <p className="text-xs text-zinc-400">
                Nie utworzyłeś jeszcze żadnej dedykowanej listy. Stwórz własne kolekcje na maratony filmowe lub tematyczne wieczory!
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs"
              >
                + Utwórz Pierwszą Listę
              </button>
            </div>
          ) : !selectedCustomListId ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {customLists.map((list) => (
                <div
                  key={list.id}
                  onClick={() => setSelectedCustomListId(list.id)}
                  className="group glass-panel rounded-2xl p-6 border border-white/10 hover:border-amber-500/50 transition-all cursor-pointer space-y-4 relative overflow-hidden"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-white text-lg group-hover:text-amber-300 transition-colors">
                        {list.name}
                      </h3>
                      <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{list.description || 'Brak opisu.'}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteCustomList(list.id);
                      }}
                      className="text-zinc-500 hover:text-rose-400 p-1 transition-colors cursor-pointer"
                      title="Usuń kolekcję"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-xs text-zinc-400 pt-2 border-t border-white/5">
                    <span>Liczba filmów:</span>
                    <span className="font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                      {list.movieIds.length} filmów
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Selected Custom List View */
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <button
                    onClick={() => setSelectedCustomListId(null)}
                    className="text-xs text-pink-400 hover:underline font-semibold mb-1 block cursor-pointer"
                  >
                    ← Wróć do wszystkich kolekcji
                  </button>
                  <h2 className="text-2xl font-bold text-white">{selectedCustomList.name}</h2>
                  <p className="text-xs text-zinc-400">{selectedCustomList.description}</p>
                </div>
                <button
                  onClick={() => deleteCustomList(selectedCustomList.id)}
                  className="px-3 py-1.5 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center gap-1.5 hover:bg-rose-500 hover:text-white transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Usuń tę listę
                </button>
              </div>

              {customListMovies.length === 0 ? (
                <div className="glass-panel rounded-3xl p-8 text-center text-xs text-zinc-400 space-y-2">
                  <p>Ta kolekcja nie zawiera jeszcze żadnych filmów.</p>
                  <p className="text-zinc-500">Otwórz dowolny film i kliknij "+ Dodaj do Kolekcji".</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {customListMovies.map((movie) => (
                    <div
                      key={movie.id}
                      onClick={() => onSelectMovie(movie)}
                      className="group glass-panel rounded-2xl overflow-hidden border border-white/10 hover:border-pink-500/50 transition-all cursor-pointer flex flex-col"
                    >
                      <div className="relative aspect-[2/3] overflow-hidden bg-zinc-900">
                        <img
                          src={movie.posterUrl}
                          alt={movie.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleMovieInCustomList(selectedCustomList.id, movie.id);
                          }}
                          className="absolute top-3 right-3 p-1.5 rounded-xl bg-black/70 text-rose-300 hover:text-rose-100 hover:bg-rose-600 transition-colors"
                          title="Usuń z tej kolekcji"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <h3 className="font-bold text-white text-sm group-hover:text-pink-300 line-clamp-1">
                          {movie.title}
                        </h3>
                        <span className="text-xs text-pink-400 font-semibold">{movie.year}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Modal: Create Custom Collection */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="glass-panel w-full max-w-md rounded-3xl p-6 border border-white/10 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-amber-400" /> Utwórz Dedykowaną Kolekcję
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-full text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateList} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">Nazwa Kolekcji</label>
                <input
                  type="text"
                  required
                  placeholder="np. Maraton Sci-Fi, Ulubione Horrory 90s..."
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">Opis (Opcjonalnie)</label>
                <textarea
                  rows="3"
                  placeholder="Krótki opis zestawienia..."
                  value={newListDesc}
                  onChange={(e) => setNewListDesc(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white cursor-pointer"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-lg shadow-amber-500/30 cursor-pointer"
                >
                  Utwórz Kolekcję
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
