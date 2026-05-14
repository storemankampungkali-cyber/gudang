/**
 * ## src/hooks/useReport.ts
 */
import { useState, useCallback } from 'react';
import { reportApi } from '../services/masterApi';
import { toast } from './useToast';

export const useReport = () => {
  const [stockSummary, setStockSummary] = useState<any[]>([]);
  const [stockMutation, setStockMutation] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchStockSummary = useCallback(async (filters: any = {}) => {
    setLoading(true);
    try {
      const res = await reportApi.getStockSummary(filters);
      setStockSummary(res.data);
    } catch (err: any) {
      toast.error(err.message || 'Gagal memuat laporan stok');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStockMutation = useCallback(async (filters: any = {}) => {
    setLoading(true);
    try {
      const res = await reportApi.getStockMutation(filters);
      setStockMutation(res.data);
    } catch (err: any) {
      toast.error(err.message || 'Gagal memuat laporan mutasi');
    } finally {
      setLoading(false);
    }
  }, []);

  return { stockSummary, stockMutation, loading, fetchStockSummary, fetchStockMutation };
};
