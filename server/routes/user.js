import express from 'express';
import { prisma } from '../db.js';
import { authenticateToken } from './auth.js';

const router = express.Router();

// Get user Watchlist
router.get('/watchlist', authenticateToken, async (req, res) => {
  try {
    const list = await prisma.watchlist.findMany({
      where: { userId: req.user.userId },
      orderBy: { addedAt: 'desc' }
    });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Błąd pobierania listy' });
  }
});

// Toggle Watchlist item
router.post('/watchlist', authenticateToken, async (req, res) => {
  try {
    const { tmdbId } = req.body;
    const existing = await prisma.watchlist.findUnique({
      where: { userId_tmdbId: { userId: req.user.userId, tmdbId: parseInt(tmdbId) } }
    });

    if (existing) {
      await prisma.watchlist.delete({ where: { id: existing.id } });
      return res.json({ action: 'removed', tmdbId });
    } else {
      const created = await prisma.watchlist.create({
        data: { userId: req.user.userId, tmdbId: parseInt(tmdbId) }
      });
      return res.json({ action: 'added', item: created });
    }
  } catch (err) {
    res.status(500).json({ error: 'Błąd edycji listy' });
  }
});

// Get User Favorites
router.get('/favorites', authenticateToken, async (req, res) => {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: req.user.userId },
      orderBy: { addedAt: 'desc' }
    });
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ error: 'Błąd pobierania ulubionych' });
  }
});

// Get User Custom Lists
router.get('/lists', authenticateToken, async (req, res) => {
  try {
    const lists = await prisma.customList.findMany({
      where: { userId: req.user.userId },
      include: { items: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(lists);
  } catch (err) {
    res.status(500).json({ error: 'Błąd pobierania kolekcji' });
  }
});

// Create Custom List
router.post('/lists', authenticateToken, async (req, res) => {
  try {
    const { title, description, coverUrl } = req.body;
    const newList = await prisma.customList.create({
      data: {
        userId: req.user.userId,
        title,
        description: description || '',
        coverUrl: coverUrl || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=600&auto=format&fit=crop'
      }
    });
    res.json(newList);
  } catch (err) {
    res.status(500).json({ error: 'Błąd tworzenia kolekcji' });
  }
});

export default router;
