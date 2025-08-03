import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler.middleware';

dotenv.config();

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json());

// Mount API routes
app.use('/api', routes);

app.get('/', (_, res) => {
  res.send('FitTrack API running!');
});

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;
