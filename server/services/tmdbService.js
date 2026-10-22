import dotenv from 'dotenv';
dotenv.config();

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/w1280';
const PROFILE_BASE_URL = 'https://image.tmdb.org/t/p/w185';
const TMDB_API_KEY = process.env.TMDB_API_KEY;

const GENRE_MAP = {
  28: "Akcja",
  12: "Przygodowy",
  16: "Animacja",
  35: "Komedia",
  80: "Kryminał",
  99: "Dokumentalny",
  18: "Dramat",
  10751: "Familijny",
  14: "Fantasy",
  36: "Historia",
  27: "Horror",
  10402: "Muzyczny",
  9648: "Tajemnica",
  10749: "Romans",
  878: "Sci-Fi",
  10770: "Film TV",
  53: "Thriller",
  10752: "Wojenny",
  37: "Western"
};

const GENRE_NAME_TO_ID = {
  "Akcja": 28,
  "Przygodowy": 12,
  "Animacja": 16,
  "Komedia": 35,
  "Kryminał": 80,
  "Dokumentalny": 99,
  "Dramat": 18,
  "Familijny": 10751,
  "Fantasy": 14,
  "Historia": 36,
  "Horror": 27,
  "Muzyczny": 10402,
  "Tajemnica": 9648,
  "Romans": 10749,
  "Sci-Fi": 878,
  "Film TV": 10770,
  "Thriller": 53,
  "Wojenny": 10752,
  "Western": 37
};

export async function fetchPopularMovies(page = 1, genreName = null) {
  try {
    let url = `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=pl-PL&sort_by=vote_count.desc&vote_count.gte=200&primary_release_date.lte=2025-12-31&page=${page}`;

    if (genreName && genreName !== 'Wszystkie' && GENRE_NAME_TO_ID[genreName]) {
      url += `&with_genres=${GENRE_NAME_TO_ID[genreName]}`;
    }

    const res = await fetch(url);
    if (!res.ok) throw new Error('TMDB API error');
    const data = await res.json();
    return {
      page: data.page,
      total_pages: data.total_pages,
      total_results: data.total_results,
      results: (data.results || []).map(formatTmdbMovie)
    };
  } catch (err) {
    console.error('TMDB fetch error:', err.message);
    return { page: 1, total_pages: 1, total_results: 0, results: [] };
  }
}

export async function searchMovies(query, page = 1) {
  try {
    const res = await fetch(`${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&language=pl-PL&query=${encodeURIComponent(query)}&page=${page}`);
    if (!res.ok) throw new Error('TMDB search error');
    const data = await res.json();
    return {
      page: data.page,
      total_pages: data.total_pages,
      total_results: data.total_results,
      results: (data.results || []).map(formatTmdbMovie)
    };
  } catch (err) {
    console.error('TMDB search error:', err.message);
    return { page: 1, total_pages: 1, total_results: 0, results: [] };
  }
}

export async function searchPersons(query) {
  try {
    const res = await fetch(`${TMDB_BASE_URL}/search/person?api_key=${TMDB_API_KEY}&language=pl-PL&query=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error('TMDB person search error');
    const data = await res.json();
    return (data.results || []).slice(0, 6).map(p => ({
      id: p.id,
      name: p.name,
      department: p.known_for_department === 'Directing' ? 'Reżyser' : 'Aktor / Aktorka',
      profileUrl: p.profile_path ? `${PROFILE_BASE_URL}${p.profile_path}` : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'
    }));
  } catch (err) {
    console.error('TMDB person search error:', err.message);
    return [];
  }
}

export async function getMovieDetails(tmdbId) {
  try {
    const res = await fetch(`${TMDB_BASE_URL}/movie/${tmdbId}?api_key=${TMDB_API_KEY}&language=pl-PL&append_to_response=credits,videos`);
    if (!res.ok) throw new Error('Movie not found');
    const data = await res.json();

    const formatted = formatTmdbMovie(data);

    if (data.credits) {
      const directorObj = data.credits.crew?.find(c => c.job === 'Director');
      if (directorObj) formatted.director = directorObj.name;
      if (data.credits.cast) {
        formatted.cast = data.credits.cast.slice(0, 6).map(c => c.name);
      }
    }

    if (data.videos && data.videos.results) {
      const trailerObj = data.videos.results.find(v => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser'));
      if (trailerObj) {
        formatted.trailerUrl = `https://www.youtube.com/embed/${trailerObj.key}`;
      }
    }

    if (data.runtime) {
      const hours = Math.floor(data.runtime / 60);
      const mins = data.runtime % 60;
      formatted.duration = `${hours}h ${mins}m`;
    }

    return formatted;
  } catch (err) {
    console.error('TMDB detail error:', err.message);
    return null;
  }
}

export async function getRandomMovie(filters = {}) {
  const minYear = parseInt(filters.minYear) || 1970;
  const maxYear = parseInt(filters.maxYear) || 2025;

  let queryParams = `api_key=${TMDB_API_KEY}&language=pl-PL&sort_by=vote_count.desc&vote_count.gte=10`;
  queryParams += `&primary_release_date.gte=${minYear}-01-01&primary_release_date.lte=${maxYear}-12-31`;

  if (filters.genreName && filters.genreName !== 'Wszystkie' && GENRE_NAME_TO_ID[filters.genreName]) {
    queryParams += `&with_genres=${GENRE_NAME_TO_ID[filters.genreName]}`;
  }

  // Filter by actor / director if personName or personId is provided
  if (filters.personName) {
    const persons = await searchPersons(filters.personName);
    if (persons && persons.length > 0) {
      queryParams += `&with_people=${persons[0].id}`;
    }
  }

  try {
    const firstRes = await fetch(`${TMDB_BASE_URL}/discover/movie?${queryParams}&page=1`);
    if (!firstRes.ok) return null;
    const firstData = await firstRes.json();

    if (!firstData.results || firstData.results.length === 0) return null;

    const totalPages = Math.min(firstData.total_pages || 1, 15);
    const randomPage = Math.floor(Math.random() * totalPages) + 1;

    let targetResults = firstData.results;
    if (randomPage > 1) {
      const pageRes = await fetch(`${TMDB_BASE_URL}/discover/movie?${queryParams}&page=${randomPage}`);
      if (pageRes.ok) {
        const pageData = await pageRes.json();
        if (pageData.results && pageData.results.length > 0) {
          targetResults = pageData.results;
        }
      }
    }

    const validCandidates = targetResults.filter((m) => {
      if (!m.release_date || m.release_date.length < 4) return false;
      const y = parseInt(m.release_date.substring(0, 4));
      return y >= minYear && y <= maxYear;
    });

    const pool = validCandidates.length > 0 ? validCandidates : targetResults;
    const chosen = pool[Math.floor(Math.random() * pool.length)];

    const detailed = await getMovieDetails(chosen.id);
    const finalMovie = detailed || formatTmdbMovie(chosen);

    if (finalMovie.year >= minYear && finalMovie.year <= maxYear) {
      return finalMovie;
    }
    return null;
  } catch (err) {
    console.error('Random movie error:', err.message);
    return null;
  }
}

function formatTmdbMovie(m) {
  const genresList = m.genres
    ? m.genres.map(g => g.name)
    : (m.genre_ids || []).map(id => GENRE_MAP[id]).filter(Boolean);

  let releaseYear = 2024;
  if (m.release_date && m.release_date.length >= 4) {
    releaseYear = parseInt(m.release_date.substring(0, 4));
  }

  return {
    id: m.id,
    title: m.title || m.original_title || "Nieznany tytuł",
    originalTitle: m.original_title || m.title || "",
    year: releaseYear,
    rating: m.vote_average ? Math.round(m.vote_average * 10) / 10 : 7.5,
    duration: "2h 15m",
    genres: genresList.length > 0 ? genresList : ["Film"],
    director: "Reżyser Kinowy",
    cast: ["Obsada Kinowa"],
    synopsis: m.overview || "Brak opisu dla tego filmu w języku polskim.",
    posterUrl: m.poster_path ? `${IMAGE_BASE_URL}${m.poster_path}` : "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop",
    backdropUrl: m.backdrop_path ? `${BACKDROP_BASE_URL}${m.backdrop_path}` : "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=1600&auto=format&fit=crop",
    trailerUrl: "https://www.youtube.com/embed/uYPbbksJxIg",
    tagline: m.tagline || "Premiera kinowa"
  };
}
