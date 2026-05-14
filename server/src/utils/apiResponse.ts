/**
 * ## server/src/utils/apiResponse.ts
 */

import { Response } from 'express';

export const success = (res: Response, data: any, message = 'OK', statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    data,
    message,
    timestamp: new Date().toISOString()
  });
};

export const created = (res: Response, data: any, message = 'Created') => {
  success(res, data, message, 201);
};

export const paginated = (res: Response, data: any, meta: any, message = 'OK') => {
  res.status(200).json({
    success: true,
    data,
    meta,
    message,
    timestamp: new Date().toISOString()
  });
};
