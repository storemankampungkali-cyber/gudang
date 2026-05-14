/**
 * ## src/hooks/useTransaction.ts
 */
import { useState, useCallback } from 'react';
import { transactionApi } from '../services/transactionApi';
import { toast } from './useToast';

export const useTransaction = () => {
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [detail, setDetail] = useState<any>(null);

  const fetchTransactions = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const res = await transactionApi.getTransactions(filters);
      setTransactions(res.data);
    } catch (err: any) {
      toast.error(err.message || 'Gagal mengambil data transaksi');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDetail = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const res = await transactionApi.getTransactionDetail(id);
      setDetail(res.data);
      return res.data;
    } catch (err: any) {
      toast.error(err.message || 'Gagal mengambil detail transaksi');
    } finally {
      setLoading(false);
    }
  }, []);

  const createTransaction = async (data: any) => {
    setLoading(true);
    try {
      const res = await transactionApi.createTransaction(data);
      toast.success('Transaksi berhasil diproses');
      return res.data;
    } catch (err: any) {
      toast.error(err.message || 'Gagal memproses transaksi');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      await transactionApi.deleteTransaction(id);
      toast.success('Transaksi berhasil dihapus');
      setTransactions(prev => prev.filter(t => t.id !== id));
    } catch (err: any) {
      toast.error(err.message || 'Gagal menghapus transaksi');
      throw err;
    }
  };

  return { 
    transactions, 
    detail,
    loading, 
    fetchTransactions, 
    fetchDetail,
    createTransaction, 
    deleteTransaction 
  };
};
