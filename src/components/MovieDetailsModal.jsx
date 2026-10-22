import React, { useState } from 'react';
import { X, Star, Play, Bookmark, Check, Clock, Calendar, User, Film, Heart, CheckCircle2, Plus } from 'lucide-react';

export default function MovieDetailsModal({
  movie,
  onClose,
  watchlist,
  toggleWatchlist,
  favorites = [],
  toggleFavorite = () => {},
  history = [],
  toggleHistory = () => {},
  customLists = [],
  toggleMovieInCustomList = () => {},
  onSelectMovie,
  allMovies = []
}) {
  const [isPlayingTrailer, setIsPlayingTrailer] = useState(false);
  const [showCollectionDropdown, setShowCollectionDropdown] = useState(false);

  if (!movie) return null;

  const isInWatchlist = watchlist.includes(movie.id);
  const isFavorite = favorites.includes(movie.id);
  const isWatched = history.includes(movie.id);

  // Recommendations (same genres)
  const recommendations = allMovies.filter(
    (m) => m.id !== movie.id && m.genres.some((g) => movie.genres.includes(g))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-4xl glass-panel rounded-3xl overflow-hidden border border-white/10 shadow-2xl my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-black/60 text-zinc-300 hover:text-white hover:bg-black transition-all border border-white/10 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Banner Header */}
        <div className="relative h-72 sm:h-96 w-full overflow-hidden bg-zinc-950">
          {!isPlayingTrailer ? (
            <>
              <img
                src={movie.backdropUrl}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#16111c] via-[#16111c]/60 to-transparent" />

              {/* Play Trailer Floating Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={() => setIsPlayingTrailer(true)}
                  className="group flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-pink-500/90 hover:bg-pink-500 text-white font-extrabold text-sm shadow-2xl shadow-pink-500/50 hover:scale-105 transition-all cursor-pointer backdrop-blur-md"
                >
                  <Play className="w-5 h-5 fill-white" /> OGLĄDAJ ZWIASTUN
                </button>
              </div>
            </>
          ) : (
            <div className="relative w-full h-full">
              <iframe
                src={`${movie.trailerUrl}?autoplay=1`}
                title={`${movie.title} Trailer`}
                className="w-full h-full border-none"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              <button
                onClick={() => setIsPlayingTrailer(false)}
                className="absolute bottom-4 right-4 bg-zinc-900/90 text-white px-3 py-1.5 rounded-xl text-xs font-semibold border border-white/10 cursor-pointer"
              >
                Zamknij zwiastun
              </button>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6 relative -mt-16 z-20">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            {/* Floating Poster Image */}
            <div className="w-36 h-52 sm:w-48 sm:h-72 rounded-2xl overflow-hidden shadow-2xl shrink-0 border-2 border-white/10 relative -mt-12 sm:-mt-24 bg-zinc-900">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info Section */}
            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-pink-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> {movie.year}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {movie.duration}
                </span>
                <span>•</span>
                <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-md border border-amber-500/30 flex items-center gap-1 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" /> {movie.rating} / 10
                </span>
              </div>

              <div>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
                  {movie.title}
                </h1>
                <p className="text-xs text-zinc-400 italic font-medium">
                  Tytuł oryginalny: {movie.originalTitle}
                </p>
              </div>

              {/* Genre Badges */}
              <div className="flex flex-wrap gap-2 pt-1">
                {movie.genres.map((g) => (
                  <span
                    key={g}
                    className="px-3 py-1 rounded-full text-xs font-semibold bg-zinc-800/80 text-zinc-200 border border-white/5"
                  >
                    {g}
                  </span>
                ))}
              </div>

              {/* Action Buttons: Watchlist, Favorites, Watched, Custom Lists */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => toggleWatchlist(movie.id)}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    isInWatchlist
                      ? 'bg-pink-500 text-white border-pink-400 shadow-lg shadow-pink-500/30'
                      : 'bg-zinc-900 border-white/10 text-zinc-300 hover:text-white'
                  }`}
                >
                  <Bookmark className="w-4 h-4" /> {isInWatchlist ? 'W Zakładkach' : '+ Do Obejrzenia'}
                </button>

                <button
                  onClick={() => toggleFavorite(movie.id)}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    isFavorite
                      ? 'bg-rose-500 text-white border-rose-400 shadow-lg shadow-rose-500/30'
                      : 'bg-zinc-900 border-white/10 text-zinc-300 hover:text-white'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`} /> {isFavorite ? 'Ulubiony' : 'Do Ulubionych'}
                </button>

                <button
                  onClick={() => toggleHistory(movie.id)}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    isWatched
                      ? 'bg-purple-600 text-white border-purple-400 shadow-lg shadow-purple-500/30'
                      : 'bg-zinc-900 border-white/10 text-zinc-300 hover:text-white'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" /> {isWatched ? 'Obejrzany' : 'Oznacz jako Obejrzany'}
                </button>

                {/* Custom Collection Dropdown */}
                {customLists.length > 0 && (
                  <div className="relative">
                    <button
                      onClick={() => setShowCollectionDropdown(!showCollectionDropdown)}
                      className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white text-xs font-bold flex items-center gap-2 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" /> Dodaj do Kolekcji
                    </button>

                    {showCollectionDropdown && (
                      <div className="absolute top-full left-0 mt-2 w-56 glass-panel rounded-2xl p-2 border border-white/10 shadow-2xl z-40 space-y-1">
                        <span className="text-[10px] uppercase font-bold text-pink-300 px-3 py-1 block">Wybierz kolekcję:</span>
                        {customLists.map((list) => {
                          const isInList = list.movieIds.includes(movie.id);
                          return (
                            <button
                              key={list.id}
                              onClick={() => toggleMovieInCustomList(list.id, movie.id)}
                              className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between font-semibold transition-colors cursor-pointer ${
                                isInList ? 'bg-pink-500/20 text-pink-300' : 'text-zinc-300 hover:bg-white/5'
                              }`}
                            >
                              <span className="truncate">{list.name}</span>
                              {isInList && <Check className="w-3.5 h-3.5 text-pink-400" />}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Synopsis */}
          <div className="space-y-2 pt-4 border-t border-white/10">
            <h3 className="text-sm uppercase tracking-wider font-bold text-pink-300">
              Opis filmu
            </h3>
            <p className="text-sm text-zinc-300 leading-relaxed">{movie.synopsis}</p>
          </div>

          {/* Cast & Director */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-white/10 text-xs">
            <div className="space-y-2">
              <span className="font-bold uppercase text-pink-300 block">Reżyseria</span>
              <span className="text-zinc-200 font-semibold bg-zinc-900 px-3 py-1.5 rounded-xl border border-white/5 inline-block">
                {movie.director}
              </span>
            </div>

            <div className="space-y-2">
              <span className="font-bold uppercase text-pink-300 block">Obsada</span>
              <div className="flex flex-wrap gap-2">
                {movie.cast.map((c) => (
                  <span
                    key={c}
                    className="bg-zinc-900 text-zinc-300 border border-white/5 px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5"
                  >
                    <User className="w-3.5 h-3.5 text-zinc-500" /> {c}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Recommendations Carousel */}
          {recommendations.length > 0 && (
            <div className="pt-6 border-t border-white/10 space-y-3">
              <h3 className="text-sm uppercase tracking-wider font-bold text-pink-300 flex items-center gap-2">
                <Film className="w-4 h-4" /> Podobne Tytuły
              </h3>
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
                {recommendations.map((rec) => (
                  <div
                    key={rec.id}
                    onClick={() => {
                      setIsPlayingTrailer(false);
                      onSelectMovie(rec);
                    }}
                    className="w-32 shrink-0 group cursor-pointer space-y-1.5"
                  >
                    <div className="w-32 h-44 rounded-xl overflow-hidden border border-white/10 group-hover:border-pink-500/50 transition-all bg-zinc-900">
                      <img
                        src={rec.posterUrl}
                        alt={rec.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <h4 className="text-xs font-bold text-white line-clamp-1 group-hover:text-pink-300">
                      {rec.title}
                    </h4>
                    <span className="text-[10px] text-zinc-400 font-semibold">{rec.year}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
