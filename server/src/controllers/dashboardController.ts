/**
 * ## server/src/controllers/dashboardController.ts
 */
import { Request, Response } from 'express';
import { DashboardService } from '../services/dashboardService';
import { asyncHandler } from '../utils/asyncHandler';
import { success } from '../utils/apiResponse';

const dashboardService = new DashboardService();

export const getStats = asyncHandler(async (req: Request, res: Response) => {
  const data = await dashboardService.getStats();
  success(res, data);
});

export const getSummary = getStats;
