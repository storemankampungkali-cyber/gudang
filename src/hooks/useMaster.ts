/**
 * ## src/hooks/useMaster.ts
 */
import { useState, useCallback } from 'react';
import { warehouseApi, partnerApi } from '../services/masterApi';
import { toast } from './useToast';

export const useMaster = () => {
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchWarehouses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await warehouseApi.getWarehouses();
      setWarehouses(res.data);
    } catch (err: any) {
      toast.error(err.message || 'Gagal memuat data gudang');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPartners = useCallback(async () => {
    setLoading(true);
    try {
      const res = await partnerApi.getPartners();
      setPartners(res.data);
    } catch (err: any) {
      toast.error(err.message || 'Gagal memuat data partner');
    } finally {
      setLoading(false);
    }
  }, []);

  const createWarehouse = async (data: any) => {
    try {
      await warehouseApi.createWarehouse(data);
      toast.success('Gudang berhasil ditambahkan');
      fetchWarehouses();
    } catch (err: any) {
      toast.error(err.message || 'Gagal menambahkan gudang');
      throw err;
    }
  };

  const updateWarehouse = async (id: string, data: any) => {
    try {
      await warehouseApi.updateWarehouse(id, data);
      toast.success('Gudang berhasil diperbarui');
      fetchWarehouses();
    } catch (err: any) {
      toast.error(err.message || 'Gagal memperbarui gudang');
      throw err;
    }
  };

  const deleteWarehouse = async (id: string) => {
    try {
      await warehouseApi.deleteWarehouse(id);
      toast.success('Gudang berhasil dihapus');
      fetchWarehouses();
    } catch (err: any) {
      toast.error(err.message || 'Gagal menghapus gudang');
      throw err;
    }
  };

  const createPartner = async (data: any) => {
    try {
      await partnerApi.createPartner(data);
      toast.success('Partner berhasil ditambahkan');
      fetchPartners();
    } catch (err: any) {
      toast.error(err.message || 'Gagal menambahkan partner');
      throw err;
    }
  };

  const updatePartner = async (id: string, data: any) => {
    try {
      await partnerApi.updatePartner(id, data);
      toast.success('Partner berhasil diperbarui');
      fetchPartners();
    } catch (err: any) {
      toast.error(err.message || 'Gagal memperbarui partner');
      throw err;
    }
  };

  const deletePartner = async (id: string) => {
    try {
      await partnerApi.deletePartner(id);
      toast.success('Partner berhasil dihapus');
      fetchPartners();
    } catch (err: any) {
      toast.error(err.message || 'Gagal menghapus partner');
      throw err;
    }
  };

  return {
    warehouses,
    partners,
    loading,
    fetchWarehouses,
    fetchPartners,
    createWarehouse,
    updateWarehouse,
    deleteWarehouse,
    createPartner,
    updatePartner,
    deletePartner
  };
};
