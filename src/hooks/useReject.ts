/**
 * ## src/hooks/useReject.ts
 */
import { useState, useCallback } from 'react';
import { rejectApi } from '../services/rejectApi';
import { toast } from './useToast';

export const useReject = () => {
  const [rejects, setRejects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRejects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await rejectApi.getRejects();
      setRejects(res.data);
    } catch (err: any) {
      toast.error(err.message || 'Gagal memuat data reject');
    } finally {
      setLoading(false);
    }
  }, []);

  const createReject = async (data: any) => {
    setLoading(true);
    try {
      await rejectApi.createReject(data);
      toast.success('Reject berhasil dicatat');
      fetchRejects();
    } catch (err: any) {
      toast.error(err.message || 'Gagal mencatat reject');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteReject = async (id: string) => {
    try {
      await rejectApi.deleteReject(id);
      toast.success('Catatan reject berhasil dihapus');
      fetchRejects();
    } catch (err: any) {
      toast.error(err.message || 'Gagal menghapus catatan reject');
      throw err;
    }
  };

  return { rejects, loading, fetchRejects, createReject, deleteReject };
};
