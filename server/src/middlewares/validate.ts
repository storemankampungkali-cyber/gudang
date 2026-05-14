/**
 * ## server/src/middlewares/validate.ts
 * Joi validation wrapper
 */

import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
import { AppError } from './errorHandler';

export const validate = (schema: Schema, target: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req[target], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const message = error.details.map(d => d.message).join(', ');
      return next(new AppError(message, 400, 'VALIDATION_ERROR'));
    }

    req[target] = value;
    next();
  };
};
