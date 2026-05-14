/**
 * ## src/utils/errorHandler.ts
 */
import { ApiError } from '../lib/apiClient';
import { toast } from '../hooks/useToast';

export const getErrorMessage = (err: any): string => {
  if (err instanceof ApiError) {
    return err.message;
  }
  if (err instanceof Error) {
    return err.message;
  }
  return String(err);
};

export const reportError = (err: any, context?: string) => {
  const message = getErrorMessage(err);
  console.error(`[Error]${context ? ` in ${context}` : ''}:`, err);
  toast.error(message);
};
