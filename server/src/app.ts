/**
 * ## server/src/app.ts
 */

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { requestLogger } from './middlewares/requestLogger';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';
import routes from './routes';
import path from 'path';

const app = express();

// Security & Middlewares
app.use(helmet({
  contentSecurityPolicy: false, // Disable for Vite development
}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Custom Request Logger
app.use(requestLogger);

// API Routes
app.use('/api/v1', routes);

// Static files for production will be handled in server.ts
// errorHandler - MOVED TO server.ts to avoid interference with Vite middleware order

export default app;
