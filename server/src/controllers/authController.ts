/**
 * ## server/src/controllers/authController.ts
 */

import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { asyncHandler } from '../utils/asyncHandler';
import { success } from '../utils/apiResponse';

const authService = new AuthService();

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.login(req.body.username, req.body.password);
  success(res, result, 'Login berhasil');
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const user = await authService.getMe(userId);
  success(res, user);
});
