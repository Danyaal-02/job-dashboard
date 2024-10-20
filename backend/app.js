import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

const frontendURL = process.env.FRONTEND_URL || 'http://localhost:5000';

// Configure CORS
const corsOptions = {
  origin: frontendURL,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);

app.use(errorHandler);

export default app;