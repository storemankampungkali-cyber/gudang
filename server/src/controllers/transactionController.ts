/**
 * ## server/src/controllers/transactionController.ts
 */
import { Request, Response } from 'express';
import { TransactionService } from '../services/transactionService';
import { asyncHandler } from '../utils/asyncHandler';
import { success, created } from '../utils/apiResponse';

const transactionService = new TransactionService();

export const getTransactions = asyncHandler(async (req: Request, res: Response) => {
  const data = await transactionService.getAllTransactions(req.query);
  success(res, data);
});

export const getTransactionById = asyncHandler(async (req: Request, res: Response) => {
  const data = await transactionService.getTransactionById(req.params.id);
  success(res, data);
});

export const getTransactionDetail = getTransactionById;

export const createTransaction = asyncHandler(async (req: Request, res: Response) => {
  const data = await transactionService.createTransaction(req.body);
  created(res, data, 'Transaksi berhasil disimpan');
});

export const deleteTransaction = asyncHandler(async (req: Request, res: Response) => {
  await transactionService.deleteTransaction(req.params.id);
  success(res, null, 'Transaksi berhasil dihapus');
});
