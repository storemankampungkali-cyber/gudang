/**
 * ## server/src/controllers/reportController.ts
 */
import { Request, Response } from 'express';
import { ReportService } from '../services/reportService';
import { asyncHandler } from '../utils/asyncHandler';
import { success } from '../utils/apiResponse';

const reportService = new ReportService();

export const getStockReport = asyncHandler(async (req: Request, res: Response) => {
  const data = await reportService.getStockReport(req.query);
  success(res, data);
});

export const stockSummary = getStockReport;

export const getMutationReport = asyncHandler(async (req: Request, res: Response) => {
  const data = await reportService.getMutationReport(req.query);
  success(res, data);
});

export const stockMutation = getMutationReport;

export const exportExcel = asyncHandler(async (req: Request, res: Response) => {
  // Placeholder for export - would use a library like ExcelJS
  success(res, { url: '/exports/sample.xlsx' }, 'Export started');
});
