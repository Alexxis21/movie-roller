import React, { useState, useEffect, useRef } from 'react';
import { SlidersHorizontal, Dices, Play, Plus, Check, Star, X, UserPlus, Sparkles, Database, Bookmark, AlertCircle, RefreshCw, User } from 'lucide-react';
import confetti from 'canvas-confetti';
import { GENRES } from '../data/movies';
import { fetchRandomMovieApi, searchPersonsApi } from '../services/api';

export default function Losownik({
  movies,
  watchlist = [],
  favorites = [],
  history = [],
  customLists = [],
  toggleWatchlist,
  onSelectMovie,
  toggleHistory
}) {
  const [selectedSource, setSelectedSource] = useState('tmdb');
  const [selectedGenre, setSelectedGenre] = useState('Wszystkie');
  const [minYear, setMinYear] = useState(1970);
  const [maxYear, setMaxYear] = useState(2025);
  const [personTag, setPersonTag] = useState('');
  const [personSuggestions, setPersonSuggestions] = useState([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [tags, setTags] = useState([]);
  const [isRolling, setIsRolling] = useState(false);
  const [resultMovie, setResultMovie] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const autocompleteRef = useRef(null);

  // Close autocomplete on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (autocompleteRef.current && !autocompleteRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced live autocomplete search for actors / directors from TMDB database
  useEffect(() => {
    if (!personTag.trim() || personTag.trim().length < 2) {
      setPersonSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoadingSuggestions(true);
      const results = await searchPersonsApi(personTag);
      setPersonSuggestions(results);
      setShowSuggestions(results.length > 0);
      setIsLoadingSuggestions(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [personTag]);

  const handleSelectPersonSuggestion = (person) => {
    if (!tags.includes(person.name)) {
      setTags([person.name]);
    }
    setPersonTag('');
    setPersonSuggestions([]);
    setShowSuggestions(false);
    setErrorMessage(null);
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && personTag.trim()) {
      if (!tags.includes(personTag.trim())) {
        setTags([personTag.trim()]);
      }
      setPersonTag('');
      setShowSuggestions(false);
      setErrorMessage(null);
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
    setErrorMessage(null);
  };

  const resetFilters = () => {
    setSelectedGenre('Wszystkie');
    setMinYear(1970);
    setMaxYear(2025);
    setTags([]);
    setPersonTag('');
    setErrorMessage(null);
    setResultMovie(null);
  };

  const getPoolMovies = () => {
    if (selectedSource === 'tmdb') {
      return movies;
    }
    if (selectedSource === 'watchlist') {
      return movies.filter((m) => watchlist.includes(m.id));
    }
    if (selectedSource === 'favorites') {
      return movies.filter((m) => favorites.includes(m.id));
    }
    if (selectedSource === 'history') {
      return movies.filter((m) => history.includes(m.id));
    }
    const customList = customLists.find((l) => l.id === selectedSource);
    if (customList) {
      return movies.filter((m) => customList.movieIds.includes(m.id));
    }
    return movies;
  };

  const currentPool = getPoolMovies();

  const filteredPool = currentPool.filter((m) => {
    if (selectedGenre !== 'Wszystkie') {
      if (!m.genres || !m.genres.includes(selectedGenre)) return false;
    }
    if (m.year && (m.year < minYear || m.year > maxYear)) return false;
    if (tags.length > 0 || personTag.trim()) {
      const activePersonStr = tags.length > 0 ? tags[0] : personTag.trim();
      const lower = activePersonStr.toLowerCase();
      const matchesTag =
        (m.director && m.director.toLowerCase().includes(lower)) ||
        (m.cast && m.cast.some((c) => c.toLowerCase().includes(lower)));
      if (!matchesTag) return false;
    }
    return true;
  });

  const handleRoll = async () => {
    if (isRolling) return;
    setErrorMessage(null);
    setIsRolling(true);

    let activePerson = tags.length > 0 ? tags[0] : personTag.trim() ? personTag.trim() : null;

    if (personTag.trim() && !tags.includes(personTag.trim())) {
      setTags([personTag.trim()]);
      setPersonTag('');
      setShowSuggestions(false);
    }

    if (selectedSource === 'tmdb') {
      const randomApiMovie = await fetchRandomMovieApi({
        genreName: selectedGenre,
        minYear,
        maxYear,
        personName: activePerson
      });

      const isValidYear = randomApiMovie && randomApiMovie.year >= minYear && randomApiMovie.year <= maxYear;
      const isValidGenre = selectedGenre === 'Wszystkie' || (randomApiMovie && randomApiMovie.genres && randomApiMovie.genres.includes(selectedGenre));

      if (randomApiMovie && randomApiMovie.id && isValidYear && isValidGenre) {
        let count = 0;
        const interval = setInterval(() => {
          count++;
          if (count >= 8) {
            clearInterval(interval);
            setResultMovie(randomApiMovie);
            setIsRolling(false);
            confetti({
              particleCount: 90,
              spread: 80,
              origin: { y: 0.6 },
              colors: ['#ffafd3', '#c084fc', '#e50914']
            });
          }
        }, 80);
      } else {
        setResultMovie(null);
        const personNotice = activePerson ? ` oraz udziałem "${activePerson}"` : '';
        setErrorMessage(
          `Nie znaleziono filmu z gatunku "${selectedGenre}"${personNotice} w latach ${minYear} - ${maxYear}.`
        );
        setIsRolling(false);
      }
    } else {
      if (filteredPool.length === 0) {
        setResultMovie(null);
        setErrorMessage(
          `Brak filmów w wybranej sekcji spełniających filtry (${selectedGenre}, lata ${minYear} - ${maxYear}).`
        );
        setIsRolling(false);
        return;
      }

      const drawnMovie = filteredPool[Math.floor(Math.random() * filteredPool.length)];

      let count = 0;
      const interval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * filteredPool.length);
        setResultMovie(filteredPool[randomIndex]);
        count++;
        if (count >= 8) {
          clearInterval(interval);
          setResultMovie(drawnMovie);
          setIsRolling(false);
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#ffafd3', '#c084fc', '#e50914']
          });
        }
      }, 80);
    }
  };

  const isInWatchlist = resultMovie ? watchlist.includes(resultMovie.id) : false;

  return (
    <div className="pt-24 pb-12 px-4 md:px-8 max-w-[1400px] mx-auto min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4">
        {/* Sidebar Filter Controls */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="glass-panel p-6 rounded-2xl space-y-6 shadow-xl border border-white/10">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                <SlidersHorizontal className="w-5 h-5 text-pink-400" />
                Filtry Losowania
              </h2>
              <button
                onClick={resetFilters}
                className="text-[11px] text-zinc-400 hover:text-pink-300 flex items-center gap-1 font-semibold transition-colors cursor-pointer"
                title="Zresetuj wszystkie filtry"
              >
                <RefreshCw className="w-3 h-3" /> Reset
              </button>
            </div>

            {/* Source Dropdown Select */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-pink-300/80">
                Źródło Losowania
              </label>
              <select
                value={selectedSource}
                onChange={(e) => {
                  setSelectedSource(e.target.value);
                  setErrorMessage(null);
                }}
                className="w-full bg-zinc-900 border border-white/10 rounded-xl text-xs font-bold px-4 py-3 text-white focus:ring-2 focus:ring-pink-500 focus:outline-none transition-all cursor-pointer"
              >
                <optgroup label="Baza Aplikacji / Światowa">
                  <option value="tmdb"> Cała Baza TMDB</option>
                </optgroup>
                <optgroup label="Moje Listy w Profilu">
                  <option value="watchlist">Do Obejrzenia ({watchlist.length})</option>
                  <option value="favorites">Ulubione ({favorites.length})</option>
                  <option value="history">Obejrzane ({history.length})</option>
                </optgroup>
                {customLists.length > 0 && (
                  <optgroup label="Moje Dedykowane Kolekcje">
                    {customLists.map((list) => (
                      <option key={list.id} value={list.id}>
                        {list.name} ({list.movieIds.length})
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>
            </div>

            {/* Genre Chips */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-pink-300/80">
                Gatunek
              </label>
              <div className="flex flex-wrap gap-2">
                {GENRES.map((g) => (
                  <button
                    key={g}
                    onClick={() => {
                      setSelectedGenre(g);
                      setErrorMessage(null);
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${selectedGenre === g
                      ? 'bg-pink-500 text-white shadow-md shadow-pink-500/30 font-bold'
                      : 'bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700'
                      }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Year Range Sliders (Min & Max Year) */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold uppercase tracking-wider text-pink-300/80">
                  Zakres lat premiery
                </label>
                <span className="text-sm font-bold text-pink-400">
                  {minYear} - {maxYear}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-zinc-400 w-10">Od:</span>
                  <input
                    type="range"
                    min="1950"
                    max="2025"
                    value={minYear}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val <= maxYear) setMinYear(val);
                      setErrorMessage(null);
                    }}
                    className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-xs font-bold text-pink-300 w-10">{minYear}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-zinc-400 w-10">Do:</span>
                  <input
                    type="range"
                    min="1950"
                    max="2025"
                    value={maxYear}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val >= minYear) setMaxYear(val);
                      setErrorMessage(null);
                    }}
                    className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-xs font-bold text-pink-300 w-10">{maxYear}</span>
                </div>
              </div>
            </div>

            {/* Cast / Director Input with Live Autocomplete Suggestions */}
            <div className="space-y-2 relative" ref={autocompleteRef}>
              <label className="text-xs font-semibold uppercase tracking-wider text-pink-300/80">
                Obsada / Reżyser
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={personTag}
                  onChange={(e) => setPersonTag(e.target.value)}
                  onKeyDown={handleAddTag}
                  onFocus={() => personSuggestions.length > 0 && setShowSuggestions(true)}
                  placeholder="..."
                  className="w-full bg-zinc-900/90 border border-white/10 rounded-xl text-sm px-4 py-3 pl-10 text-white placeholder-zinc-500 focus:ring-2 focus:ring-pink-500 focus:outline-none transition-all"
                />
                <UserPlus className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              </div>

              {/* Autocomplete Suggestions Dropdown Menu */}
              {showSuggestions && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-zinc-900/95 border border-pink-500/30 rounded-2xl p-2 shadow-2xl z-50 backdrop-blur-xl space-y-1 animate-fadeIn">
                  {personSuggestions.map((person) => (
                    <div
                      key={person.id}
                      onClick={() => handleSelectPersonSuggestion(person)}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-pink-500/20 cursor-pointer transition-colors group"
                    >
                      <img
                        src={person.profileUrl}
                        alt={person.name}
                        className="w-9 h-9 rounded-full object-cover border border-white/10 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-white group-hover:text-pink-300 transition-colors truncate">
                          {person.name}
                        </h4>
                        <span className="text-[10px] text-pink-400 font-semibold block">
                          {person.department}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tag Chips */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="bg-purple-950/60 text-purple-200 border border-purple-500/30 px-3 py-1 rounded-lg text-xs flex items-center gap-1.5 font-medium"
                    >
                      <User className="w-3 h-3 text-pink-400" />
                      {t}
                      <button
                        onClick={() => handleRemoveTag(t)}
                        className="hover:text-pink-400 transition-colors cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Source Pool Summary */}
            {/* <div className="pt-2 border-t border-white/5 flex justify-between items-center text-xs text-zinc-400">
              <span>Zakres:</span>
              <span className="font-bold text-pink-300 px-2 py-0.5 bg-pink-500/10 rounded-md border border-pink-500/20">
                {selectedSource === 'tmdb'
                  ? `${selectedGenre} (${minYear} - ${maxYear})`
                  : `${filteredPool.length} filmów z listy`}
              </span>
            </div> */}
          </div>
        </aside>

        {/* Main Stage / Result & Deck Area */}
        <section className="lg:col-span-8 flex flex-col items-center justify-center min-h-[600px] relative">
          {/* Atmospheric Glow */}
          <div className="absolute inset-0 -z-10 opacity-30 bg-gradient-to-tr from-purple-900/40 via-pink-900/20 to-transparent blur-3xl rounded-full" />

          <div className="flex flex-col items-center gap-8 w-full max-w-xl text-center">
            {/* Header Title */}
            <div>
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-xs font-semibold text-pink-300 mb-2">
                <Sparkles className="w-3.5 h-3.5" /> CineVault
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white">
                Co oglądamy dzisiaj?
              </h1>
              <p className="text-sm text-zinc-400 mt-1 max-w-md mx-auto">
                {/* {selectedSource === 'tmdb'
                  ? `Losuj filmy z gatunku ${selectedGenre} wydane w latach ${minYear} - ${maxYear}!`
                  : 'Losuj film z wybranej listy lub własnej kolekcji.'} */}
              </p>
            </div>

            {/* Error / No Result Card */}
            {errorMessage && (
              <div className="w-full glass-panel rounded-3xl p-8 border border-rose-500/40 shadow-2xl text-center space-y-4 animate-fadeIn">
                <div className="w-14 h-14 rounded-full bg-rose-500/20 text-rose-300 flex items-center justify-center mx-auto border border-rose-500/30">
                  <AlertCircle className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white">Brak filmów spełniających kryteria</h3>
                  <p className="text-xs text-zinc-400 max-w-md mx-auto">{errorMessage}</p>
                </div>
                <div className="pt-2 flex justify-center gap-3">
                  <button
                    onClick={resetFilters}
                    className="px-5 py-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-pink-500/30 transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4" /> Zresetuj filtry
                  </button>
                </div>
              </div>
            )}

            {/* 3D Poster Stack or Drawn Result */}
            {!resultMovie && !errorMessage ? (
              <div
                onClick={handleRoll}
                className="poster-stack cursor-pointer group hover:scale-[1.02] transition-transform"
              >
                <div className="layer layer-3 bg-zinc-900 border border-white/10 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop"
                    alt="Poster 3"
                    className="w-full h-full object-cover blur-[1px]"
                  />
                </div>
                <div className="layer layer-2 bg-zinc-900 border border-white/10 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop"
                    alt="Poster 2"
                    className="w-full h-full object-cover blur-[0.5px]"
                  />
                </div>
                <div className="layer layer-1 bg-zinc-900/90 border border-pink-500/30 overflow-hidden flex flex-col items-center justify-center p-6 text-center shadow-2xl">
                  <div className="w-16 h-16 rounded-full bg-pink-500/10 flex items-center justify-center mb-4 text-pink-400 group-hover:scale-110 transition-transform border border-pink-500/20">
                    <Dices className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Gotowy do losowania?</h3>
                  <p className="text-xs text-zinc-400">
                    {/* Wybrano: <strong className="text-pink-300">{selectedGenre}</strong> ({minYear} - {maxYear} r.) */}
                    {(tags.length > 0 || personTag.trim()) && (
                      <span className="block mt-1 text-pink-400 font-semibold">
                        Osoba: {tags.length > 0 ? tags[0] : personTag.trim()}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            ) : resultMovie ? (
              <div className="w-full glass-panel rounded-3xl p-6 md:p-8 border border-pink-500/30 shadow-2xl text-left animate-fadeIn relative overflow-hidden">
                {/* Backdrop ambient blur */}
                <img
                  src={resultMovie.backdropUrl}
                  alt={resultMovie.title}
                  className="absolute inset-0 w-full h-full opacity-10 blur-xl pointer-events-none"
                />

                <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center md:items-start">
                  {/* Poster image */}
                  <div className="w-48 h-72 rounded-2xl overflow-hidden shadow-2xl shrink-0 border border-white/10 relative group bg-zinc-900">
                    <img
                      src={resultMovie.posterUrl}
                      alt={resultMovie.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-xl text-xs font-bold text-amber-400 flex items-center gap-1 border border-amber-500/30">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      {resultMovie.rating}
                    </div>
                  </div>

                  {/* Movie Info */}
                  <div className="flex-1 space-y-4 text-center md:text-left">
                    <div>
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs font-semibold text-pink-400 mb-1">
                        <span>{resultMovie.year}</span>
                        <span>•</span>
                        <span>{resultMovie.duration}</span>
                        <span>•</span>
                        <span>Reż. {resultMovie.director}</span>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-extrabold text-white">
                        {resultMovie.title}
                      </h2>
                      <p className="text-xs text-zinc-400 italic mt-0.5">"{resultMovie.tagline}"</p>
                    </div>

                    {/* Genres */}
                    <div className="flex flex-wrap gap-1.5 justify-center md:justify-start">
                      {resultMovie.genres.map((g) => (
                        <span
                          key={g}
                          className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-800/80 text-zinc-300 border border-white/5"
                        >
                          {g}
                        </span>
                      ))}
                    </div>

                    <p className="text-xs md:text-sm text-zinc-300 line-clamp-3">
                      {resultMovie.synopsis}
                    </p>

                    {/* Actions */}
                    <div className="pt-2 flex flex-wrap gap-3 justify-center md:justify-start">
                      <button
                        onClick={() => onSelectMovie(resultMovie)}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-pink-500/30 transition-all cursor-pointer"
                      >
                        <Play className="w-4 h-4 fill-white" /> Oglądaj / Zwiastun
                      </button>

                      <button
                        onClick={() => toggleWatchlist(resultMovie.id)}
                        className={`px-4 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${isInWatchlist
                          ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                          : 'bg-zinc-800/80 border-white/10 text-zinc-200 hover:bg-zinc-700'
                          }`}
                      >
                        {isInWatchlist ? (
                          <>
                            <Check className="w-4 h-4" /> Na Twojej liście
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4" /> Do mojej listy
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {/* Roll Button */}
            <button
              onClick={handleRoll}
              disabled={isRolling}
              className={`w-full max-w-md py-4 px-8 rounded-2xl font-black text-base uppercase tracking-wider text-white shadow-2xl flex items-center justify-center gap-3 transition-all cursor-pointer ${isRolling
                ? 'bg-zinc-800 opacity-80 cursor-wait'
                : 'bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:scale-[1.02] active:scale-95 shadow-pink-500/40 animate-roll'
                }`}
            >
              <Dices className={`w-6 h-6 ${isRolling ? 'animate-spin' : ''}`} />
              {isRolling ? 'Losowanie w toku...' : resultMovie ? 'Losuj Ponownie' : 'LOSUJ FILM TERAZ'}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
