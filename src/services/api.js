const API_BASE_URL = 'http://localhost:5000/api';

export async function fetchPopularMoviesApi(page = 1, genre = null) {
  try {
    let url = `${API_BASE_URL}/movies/popular?page=${page}`;
    if (genre && genre !== 'Wszystkie') {
      url += `&genre=${encodeURIComponent(genre)}`;
    }
    const res = await fetch(url);
    if (!res.ok) throw new Error('Network error');
    return await res.json();
  } catch (err) {
    console.warn('API error:', err);
    return { results: [], page: 1, total_pages: 1 };
  }
}

export async function searchMoviesApi(query, page = 1) {
  try {
    const res = await fetch(`${API_BASE_URL}/movies/search?q=${encodeURIComponent(query)}&page=${page}`);
    if (!res.ok) throw new Error('Network error');
    return await res.json();
  } catch (err) {
    console.warn('Search API error:', err);
    return { results: [], page: 1, total_pages: 1 };
  }
}

export async function searchPersonsApi(query) {
  try {
    const res = await fetch(`${API_BASE_URL}/movies/persons?q=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error('Network error');
    return await res.json();
  } catch (err) {
    console.warn('Person search API error:', err);
    return [];
  }
}

export async function fetchRandomMovieApi(filters = {}) {
  try {
    let url = `${API_BASE_URL}/movies/random?`;
    if (filters.genreName && filters.genreName !== 'Wszystkie') {
      url += `genreName=${encodeURIComponent(filters.genreName)}&`;
    }
    if (filters.minYear) url += `minYear=${filters.minYear}&`;
    if (filters.maxYear) url += `maxYear=${filters.maxYear}&`;
    if (filters.personName) url += `personName=${encodeURIComponent(filters.personName)}&`;

    const res = await fetch(url);
    if (!res.ok) throw new Error('Network error');
    return await res.json();
  } catch (err) {
    console.warn('Random movie API error:', err);
    return null;
  }
}

export async function fetchMovieDetailsApi(tmdbId) {
  try {
    const res = await fetch(`${API_BASE_URL}/movies/${tmdbId}`);
    if (!res.ok) throw new Error('Network error');
    return await res.json();
  } catch (err) {
    console.warn('Movie details API error:', err);
    return null;
  }
}
