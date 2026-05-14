/**
 * ## server/src/utils/AppError.ts
 */

class AppError extends Error {
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

export default AppError;
