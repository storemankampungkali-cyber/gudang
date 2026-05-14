/**
 * ## src/features/master/PartnerView.tsx
 */
import React, { useEffect, useState } from 'react';
import { partnerApi } from '../../services/masterApi';
import { Button, Badge } from '../../components/ui/BaseUI';
import { Table } from '../../components/ui/AdvancedUI';
import { Plus, Truck, UserCircle, Mail, Phone, FileText } from 'lucide-react';
import { toast } from '../../hooks/useToast';

export default function PartnerView() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState<string>('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await partnerApi.getPartners(type);
      setData(res.data);
    } catch (err) {
      toast.error('Gagal mengambil data partner');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [type]);

  const columns = [
    { header: 'Nama Partner', render: (row: any) => (
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${row.type === 'SUPPLIER' ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'}`}>
          <UserCircle className="h-4 w-4" />
        </div>
        <div>
          <p className="font-bold">{row.name}</p>
          <Badge variant={row.type === 'SUPPLIER' ? 'warning' : 'success'}>{row.type}</Badge>
        </div>
      </div>
    )},
    { header: 'Kontak', render: (row: any) => (
      <div className="space-y-1 text-xs">
        {row.phone && <div className="flex items-center gap-1 text-gray-700 font-medium"><Phone className="h-3 w-3" /> {row.phone}</div>}
        {row.email && <div className="flex items-center gap-1 text-gray-500"><Mail className="h-3 w-3" /> {row.email}</div>}
      </div>
    )},
    { header: 'Dokumen', render: (row: any) => (
      <div className="flex items-center gap-1 text-xs text-gray-500">
        <FileText className="h-3 w-3" /> NPWP: {row.npwp || '-'}
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
          <h1 className="text-2xl font-bold text-gray-900">Master Partner</h1>
          <p className="text-gray-500">Kelola data Supplier dan Customer</p>
        </div>
        <Button onClick={() => toast.info('Fitur ini akan segera hadir')}>
          <Plus className="h-4 w-4 mr-2" /> Partner Baru
        </Button>
      </div>

      <div className="flex gap-2 bg-white p-1 rounded-lg border border-gray-200 w-fit">
        <button onClick={() => setType('')} className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${!type ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}>Semua</button>
        <button onClick={() => setType('SUPPLIER')} className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${type === 'SUPPLIER' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}>Supplier</button>
        <button onClick={() => setType('CUSTOMER')} className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${type === 'CUSTOMER' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}>Customer</button>
      </div>

      <Table columns={columns} data={data} isLoading={loading} />
    </div>
  );
}
