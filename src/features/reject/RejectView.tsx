/**
 * ## src/features/reject/RejectView.tsx
 */
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReject } from '../../hooks/useReject';
import { Button, Badge } from '../../components/ui/BaseUI';
import { Table } from '../../components/ui/AdvancedUI';
import { Plus, AlertCircle, Calendar, Hash, FileText } from 'lucide-react';

export default function RejectView() {
  const navigate = useNavigate();
  const { rejects, loading, fetchRejects } = useReject();

  useEffect(() => {
    fetchRejects();
  }, [fetchRejects]);

  const columns = [
    { 
      header: 'Tanggal', 
      render: (r: any) => (
        <div className="flex items-center gap-2 text-gray-700">
          <Calendar className="h-4 w-4 text-gray-400" />
          {new Date(r.created_at || r.date).toLocaleDateString('id-ID', { dateStyle: 'medium' })}
        </div>
      )
    },
    { 
      header: 'Gudang', 
      render: (r: any) => (
        <span className="font-medium text-gray-900">{r.warehouse_name}</span>
      )
    },
    { 
      header: 'Item Reject', 
      render: (r: any) => (
        <Badge variant="warning">{r.item_count || 0} Barang</Badge>
      )
    },
    { 
      header: 'Catatan', 
      render: (r: any) => (
        <span className="text-gray-500 italic max-w-xs truncate block">{r.notes || '-'}</span>
      )
    },
    { 
      header: 'Aksi', 
      render: (r: any) => (
        <Button variant="ghost" size="sm" className="text-blue-600">Lihat Detail</Button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-100 rounded-2xl text-red-600">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Barang Reject</h1>
            <p className="text-gray-500">Daftar barang yang ditarik dari inventory karena rusak/reject</p>
          </div>
        </div>
        <Button onClick={() => navigate('/reject/new')} className="bg-red-600 hover:bg-red-700 gap-2">
          <Plus className="h-4 w-4" /> Input Reject Baru
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-gray-50 rounded-xl text-gray-400">
            <Hash className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{rejects.length}</p>
            <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Total Batch</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-red-50 rounded-xl text-red-400">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {rejects.reduce((acc, curr) => acc + (curr.item_count || 0), 0)}
            </p>
            <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Total Item</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <Table columns={columns} data={rejects} isLoading={loading} />
      </div>

      {rejects.length === 0 && !loading && (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
            <AlertCircle className="h-8 w-8 text-gray-200" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Belum ada data reject</h3>
          <p className="text-gray-500 mb-6">Semua barang saat ini masih dalam kondisi baik.</p>
          <Button onClick={() => navigate('/reject/new')} variant="outline">Input Reject Pertama</Button>
        </div>
      )}
    </div>
  );
}
