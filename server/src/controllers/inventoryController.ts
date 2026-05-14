/**
 * ## server/src/controllers/inventoryController.ts
 */
import { Request, Response } from 'express';
import { InventoryService } from '../services/inventoryService';
import { asyncHandler } from '../utils/asyncHandler';
import { success, created } from '../utils/apiResponse';

const inventoryService = new InventoryService();

export const getInventory = asyncHandler(async (req: Request, res: Response) => {
  const data = await inventoryService.getStock(req.query);
  success(res, data);
});

export const getItems = asyncHandler(async (req: Request, res: Response) => {
  const data = await inventoryService.getItems();
  success(res, data);
});

export const getLowStock = asyncHandler(async (req: Request, res: Response) => {
  const data = await inventoryService.getLowStock();
  success(res, data);
});

export const createItem = asyncHandler(async (req: Request, res: Response) => {
  const data = await inventoryService.createItem(req.body);
  created(res, data, 'Item berhasil ditambahkan');
});

export const bulkImport = asyncHandler(async (req: Request, res: Response) => {
  const data = await inventoryService.bulkImportItems(req.body);
  success(res, data, 'Impor barang selesai diproses');
});

export const updateItem = asyncHandler(async (req: Request, res: Response) => {
  await inventoryService.updateItem(req.params.id, req.body);
  success(res, null, 'Item berhasil diperbarui');
});

export const deleteItem = asyncHandler(async (req: Request, res: Response) => {
  await inventoryService.deleteItem(req.params.id);
  success(res, null, 'Item berhasil dihapus');
});
