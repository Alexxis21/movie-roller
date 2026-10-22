import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import moviesRouter from './routes/movies.js';
import authRouter from './routes/auth.js';
import userRouter from './routes/user.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/movies', moviesRouter);
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'CineVault Express API Server is running!' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🎬 CineVault Backend Server listening on http://localhost:${PORT}`);
});
