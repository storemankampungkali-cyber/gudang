/**
 * ## src/hooks/useDashboard.ts
 */
import { useState, useCallback } from 'react';
import { dashboardApi } from '../services/masterApi';
import { toast } from './useToast';

export const useDashboard = () => {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchSummary = useCallback(async () => {
    setLoading(true);
    try {
      const res = await dashboardApi.getSummary();
      setSummary(res.data);
    } catch (err: any) {
      toast.error(err.message || 'Gagal memuat ringkasan dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  return { summary, loading, fetchSummary };
};
