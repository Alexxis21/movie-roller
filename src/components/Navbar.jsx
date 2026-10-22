import React from 'react';
import { Film, Dices, Library, Bell, Bookmark, User, Search, X } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, watchlistCount, searchQuery, setSearchQuery }) {
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    // Auto switch to Biblioteka when user starts typing
    if (value.trim() && activeTab !== 'biblioteka') {
      setActiveTab('biblioteka');
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  return (
    <nav className="fixed top-0 w-full z-50 glass-nav px-4 md:px-8 h-20 flex items-center justify-between shadow-2xl">
      {/* Brand Logo */}
      <div
        // onClick={() => setActiveTab('losownik')}
        className="flex items-center gap-3 cursor-pointer group"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 via-rose-500 to-purple-600 flex items-center justify-center shadow-lg shadow-pink-500/30 group-hover:scale-105 transition-transform">
          <Film className="w-6 h-6 text-white" />
        </div>
        <div>
          <span className="font-extrabold text-2xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-rose-300 to-purple-200 uppercase font-headline">
            CINEVAULT
          </span>
          {/* <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-widest text-pink-400/80 ml-2 px-2 py-0.5 rounded-full bg-pink-500/10 border border-pink-500/20">
            Losownik
          </span> */}
        </div>
      </div>

      {/* Center Nav Links */}
      <div className="hidden md:flex items-center gap-2 p-1.5 rounded-2xl bg-surface-container/60 border border-white/5 backdrop-blur-md">
        <button
          onClick={() => setActiveTab('losownik')}
          className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === 'losownik'
            ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-500/25'
            : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
        >
          <Dices className="w-4 h-4" />
          Losownik
        </button>

        <button
          onClick={() => setActiveTab('biblioteka')}
          className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === 'biblioteka'
            ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-500/25'
            : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
        >
          <Library className="w-4 h-4" />
          Biblioteka
        </button>

        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === 'dashboard'
            ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-500/25'
            : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
        >
          <User className="w-4 h-4" />
          Moje Listy
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Quick Search Bar with Clear X Button */}
        <div className="relative hidden lg:block w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Szukaj filmu, reżysera..."
            className="w-full pl-9 pr-8 py-2 bg-zinc-900/80 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white p-0.5 rounded-full hover:bg-white/10 transition-colors"
              title="Wyczyść szukanie i wróć do bazy"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Watchlist Quick Button */}
        <button
          onClick={() => setActiveTab('dashboard')}
          className="relative p-2.5 rounded-xl bg-zinc-900/80 border border-white/10 hover:border-pink-500/50 text-zinc-300 hover:text-pink-300 transition-all group cursor-pointer"
          title="Moja Lista & Profil"
        >
          <Bookmark className="w-5 h-5" />
          {watchlistCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-pink-500 text-white text-[11px] font-bold flex items-center justify-center shadow-md animate-pulse">
              {watchlistCount}
            </span>
          )}
        </button>

        {/* User Profile Avatar Button
        <div
          onClick={() => setActiveTab('dashboard')}
          className={`w-10 h-10 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${activeTab === 'dashboard' ? 'border-pink-500 shadow-lg shadow-pink-500/30' : 'border-pink-500/30 hover:border-pink-500'
            }`}
          title="Przejdź do profilu"
        >
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
            alt="User avatar"
            className="w-full h-full object-cover rounded-lg"
          />
        </div> */}
      </div>
    </nav>
  );
}
