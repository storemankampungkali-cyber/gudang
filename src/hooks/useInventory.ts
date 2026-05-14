/**
 * ## src/hooks/useInventory.ts
 */
import { useState, useCallback } from 'react';
import { inventoryApi } from '../services/inventoryApi';
import { toast } from './useToast';

export const useInventory = () => {
  const [items, setItems] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [lowStock, setLowStock] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await inventoryApi.getItems();
      setItems(res.data);
    } catch (err: any) {
      toast.error(err.message || 'Gagal memuat master barang');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchInventory = useCallback(async (warehouseId?: string) => {
    setLoading(true);
    try {
      const res = await inventoryApi.getInventory(warehouseId);
      setInventory(res.data);
    } catch (err: any) {
      toast.error(err.message || 'Gagal memuat data stok');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchLowStock = useCallback(async () => {
    setLoading(true);
    try {
      const res = await inventoryApi.getLowStock();
      setLowStock(res.data);
    } catch (err: any) {
      toast.error(err.message || 'Gagal memuat data stok menipis');
    } finally {
      setLoading(false);
    }
  }, []);

  const createItem = async (data: any) => {
    try {
      await inventoryApi.createItem(data);
      toast.success('Barang berhasil ditambahkan');
      fetchItems();
    } catch (err: any) {
      toast.error(err.message || 'Gagal menambahkan barang');
      throw err;
    }
  };

  const updateItem = async (id: string, data: any) => {
    try {
      await inventoryApi.updateItem(id, data);
      toast.success('Barang berhasil diperbarui');
      fetchItems();
    } catch (err: any) {
      toast.error(err.message || 'Gagal memperbarui barang');
      throw err;
    }
  };

  const deleteItem = async (id: string) => {
    try {
      await inventoryApi.deleteItem(id);
      toast.success('Barang berhasil dihapus');
      fetchItems();
    } catch (err: any) {
      toast.error(err.message || 'Gagal menghapus barang');
      throw err;
    }
  };

  const bulkImport = async (data: any[]) => {
    setLoading(true);
    try {
      const res = await inventoryApi.bulkImport(data);
      if (res.data.failed > 0) {
        toast.warning(`${res.data.success} berhasil, ${res.data.failed} gagal.`);
      } else {
        toast.success(`Berhasil mengimpor ${res.data.success} barang`);
      }
      fetchItems();
      return res.data;
    } catch (err: any) {
      toast.error(err.message || 'Gagal mengimpor data');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { 
    items, 
    inventory, 
    lowStock,
    loading, 
    fetchItems, 
    fetchInventory, 
    fetchLowStock,
    createItem, 
    updateItem,
    deleteItem,
    bulkImport
  };
};
