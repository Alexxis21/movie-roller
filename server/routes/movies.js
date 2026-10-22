import express from 'express';
import { fetchPopularMovies, searchMovies, getRandomMovie, getMovieDetails, searchPersons } from '../services/tmdbService.js';

const router = express.Router();

// Get popular/trending movies with page & genre support
router.get('/popular', async (req, res) => {
  try {
    const page = req.query.page || 1;
    const genre = req.query.genre || null;
    const data = await fetchPopularMovies(page, genre);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching movies' });
  }
});

// Search movies
router.get('/search', async (req, res) => {
  try {
    const query = req.query.q || '';
    const page = req.query.page || 1;
    if (!query.trim()) {
      return res.json({ results: [], page: 1, total_pages: 1 });
    }
    const data = await searchMovies(query, page);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Server error searching movies' });
  }
});

// Search actors and directors for autocomplete suggestions
router.get('/persons', async (req, res) => {
  try {
    const query = req.query.q || '';
    if (!query.trim()) return res.json([]);
    const persons = await searchPersons(query);
    res.json(persons);
  } catch (err) {
    res.status(500).json({ error: 'Server error searching persons' });
  }
});

// Get random movie recommendation with minYear, maxYear, and personName
router.get('/random', async (req, res) => {
  try {
    const { genreName, minYear, maxYear, personName } = req.query;
    const movie = await getRandomMovie({ genreName, minYear, maxYear, personName });
    res.json(movie);
  } catch (err) {
    res.status(500).json({ error: 'Server error generating random movie' });
  }
});

// Get single movie details by TMDB ID
router.get('/:id', async (req, res) => {
  try {
    const movie = await getMovieDetails(req.params.id);
    if (!movie) return res.status(404).json({ error: 'Movie not found' });
    res.json(movie);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching movie details' });
  }
});

export default router;
