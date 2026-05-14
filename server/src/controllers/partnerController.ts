/**
 * ## server/src/controllers/partnerController.ts
 */
import { Request, Response } from 'express';
import { PartnerService } from '../services/partnerService';
import { asyncHandler } from '../utils/asyncHandler';
import { success, created } from '../utils/apiResponse';

const partnerService = new PartnerService();

export const getPartners = asyncHandler(async (req: Request, res: Response) => {
  const data = await partnerService.getAllPartners();
  success(res, data);
});

export const createPartner = asyncHandler(async (req: Request, res: Response) => {
  const data = await partnerService.createPartner(req.body);
  created(res, data, 'Partner berhasil ditambahkan');
});

export const updatePartner = asyncHandler(async (req: Request, res: Response) => {
  await partnerService.updatePartner(req.params.id, req.body);
  success(res, null, 'Partner berhasil diperbarui');
});

export const deletePartner = asyncHandler(async (req: Request, res: Response) => {
  await partnerService.deletePartner(req.params.id);
  success(res, null, 'Partner berhasil dihapus');
});
