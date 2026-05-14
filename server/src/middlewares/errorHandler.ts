/**
 * ## server/src/middlewares/errorHandler.ts
 * Centralized error handling
 */

import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';

export class AppError extends Error {
  public statusCode: number;
  public code: string | null;
  public isOperational: boolean;

  constructor(message: string, statusCode = 500, code: string | null = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

const DB_ERROR_MAP: Record<string, number> = {
  'ER_DUP_ENTRY': 409,
  'ER_ROW_IS_REFERENCED_2': 409,
  'ER_NO_REFERENCED_ROW_2': 400,
};

const BUSINESS_ERROR_MAP: Record<string, number> = {
  'INSUFFICIENT_STOCK': 409,
  'NOT_FOUND': 404,
  'UNAUTHORIZED': 401,
  'FORBIDDEN': 403,
};

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let code = err.code || 'INTERNAL_ERROR';

  // Map MySQL errors
  if (err.code && DB_ERROR_MAP[err.code]) {
    statusCode = DB_ERROR_MAP[err.code];
    code = err.code;
  }

  // Map Business errors if they have a specific code
  if (err.code && BUSINESS_ERROR_MAP[err.code]) {
    statusCode = BUSINESS_ERROR_MAP[err.code];
  }

  logger.error(`[${req.method}] ${req.originalUrl} - ${statusCode} - ${message}`, {
    stack: err.stack,
    code,
  });

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
    },
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
  });
};

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.originalUrl} not found`,
    },
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
  });
};
