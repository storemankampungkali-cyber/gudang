/**
 * ## server/src/controllers/rejectController.ts
 */
import { Request, Response } from 'express';
import { RejectService } from '../services/rejectService';
import { asyncHandler } from '../utils/asyncHandler';
import { success, created } from '../utils/apiResponse';

const rejectService = new RejectService();

export const getRejections = asyncHandler(async (req: Request, res: Response) => {
  const data = await rejectService.getAllRejections();
  success(res, data);
});

export const getRejects = getRejections;

export const createRejection = asyncHandler(async (req: Request, res: Response) => {
  const data = await rejectService.createRejection(req.body);
  created(res, data, 'Reject berhasil dicatat');
});

export const createReject = createRejection;

export const deleteReject = asyncHandler(async (req: Request, res: Response) => {
  await rejectService.deleteRejection(req.params.id);
  success(res, null, 'Reject berhasil dihapus');
});
