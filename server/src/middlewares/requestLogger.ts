/**
 * ## server/src/middlewares/requestLogger.ts
 */

import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const userId = (req as any).user?.id || 'anonymous';
    logger.info(`[${req.method}] ${req.originalUrl} ${res.statusCode} ${duration}ms - User: ${userId}`);
  });
  next();
};
