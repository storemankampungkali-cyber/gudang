/**
 * ## server/src/controllers/warehouseController.ts
 */
import { Request, Response } from 'express';
import { WarehouseService } from '../services/warehouseService';
import { asyncHandler } from '../utils/asyncHandler';
import { success, created } from '../utils/apiResponse';

const warehouseService = new WarehouseService();

export const getWarehouses = asyncHandler(async (req: Request, res: Response) => {
  const data = await warehouseService.getAllWarehouses();
  success(res, data);
});

export const createWarehouse = asyncHandler(async (req: Request, res: Response) => {
  const data = await warehouseService.createWarehouse(req.body);
  created(res, data, 'Gudang berhasil ditambahkan');
});

export const updateWarehouse = asyncHandler(async (req: Request, res: Response) => {
  await warehouseService.updateWarehouse(req.params.id, req.body);
  success(res, null, 'Gudang berhasil diperbarui');
});

export const deleteWarehouse = asyncHandler(async (req: Request, res: Response) => {
  await warehouseService.deleteWarehouse(req.params.id);
  success(res, null, 'Gudang berhasil dihapus');
});
