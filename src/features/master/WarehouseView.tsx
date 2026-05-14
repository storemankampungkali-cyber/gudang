/**
 * ## src/features/master/WarehouseView.tsx
 */
import React, { useEffect, useState } from 'react';
import { warehouseApi } from '../../services/masterApi';
import { Button, Badge } from '../../components/ui/BaseUI';
import { Table, Modal } from '../../components/ui/AdvancedUI';
import { Plus, Search, MapPin, User, Phone, Warehouse as WarehouseIcon } from 'lucide-react';
import { toast } from '../../hooks/useToast';
import { Warehouse } from '../../types';

export default function WarehouseView() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await warehouseApi.getWarehouses();
      setData(res.data);
    } catch (err) {
      toast.error('Gagal mengambil data gudang');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    { header: 'Nama Gudang', render: (row: any) => (
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><WarehouseIcon className="h-4 w-4" /></div>
        <span className="font-bold">{row.name}</span>
      </div>
    )},
    { header: 'Lokasi', render: (row: any) => (
      <div className="flex items-center gap-2 text-gray-500">
        <MapPin className="h-3 w-3" />
        <span>{row.location || '-'}</span>
      </div>
    )},
    { header: 'PIC', render: (row: any) => (
      <div className="space-y-1">
        <div className="flex items-center gap-1 text-xs font-medium"><User className="h-3 w-3" /> {row.pic || '-'}</div>
        <div className="flex items-center gap-1 text-xs text-gray-500"><Phone className="h-3 w-3" /> {row.phone || '-'}</div>
      </div>
    )},
    { header: 'Status', render: (row: any) => (
      <Badge variant={row.is_active ? 'success' : 'neutral'}>
        {row.is_active ? 'Aktif' : 'Non-aktif'}
      </Badge>
    )},
    { header: 'Aksi', render: (row: any) => (
      <Button variant="ghost" size="sm">Edit</Button>
    )}
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Master Gudang</h1>
          <p className="text-gray-500">Pengaturan lokasi penyimpanan barang</p>
        </div>
        <Button onClick={() => toast.info('Fitur ini akan segera hadir')}>
          <Plus className="h-4 w-4 mr-2" /> Gudang Baru
        </Button>
      </div>
      <Table columns={columns} data={data} isLoading={loading} />
    </div>
  );
}
