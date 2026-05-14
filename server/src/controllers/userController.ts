/**
 * ## server/src/controllers/userController.ts
 */
import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { asyncHandler } from '../utils/asyncHandler';
import { success, created } from '../utils/apiResponse';

const userService = new UserService();

export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const data = await userService.getAllUsers();
  success(res, data);
});

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const data = await userService.getUserById(req.params.id);
  success(res, data);
});

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const data = await userService.createUser(req.body);
  created(res, data, 'User berhasil dibuat');
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const data = await userService.updateUser(req.params.id, req.body);
  success(res, data, 'User berhasil diperbarui');
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  await userService.deleteUser(req.params.id);
  success(res, null, 'User berhasil dihapus');
});
