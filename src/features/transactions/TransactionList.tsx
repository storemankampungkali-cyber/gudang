/**
 * ## src/features/transactions/TransactionList.tsx
 */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransaction } from '../../hooks/useTransaction';
import { useMaster } from '../../hooks/useMaster';
import { Button, Badge, Input } from '../../components/ui/BaseUI';
import { Table } from '../../components/ui/AdvancedUI';
import { Select } from '../../components/ui/Select';
import { Plus, ChevronRight, Filter, Calendar } from 'lucide-react';

export default function TransactionList() {
  const navigate = useNavigate();
  const { transactions, loading, fetchTransactions } = useTransaction();
  const { warehouses, fetchWarehouses } = useMaster();
  
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    warehouseId: '',
    type: ''
  });

  useEffect(() => {
    fetchWarehouses();
    fetchTransactions(filters);
  }, [fetchWarehouses, fetchTransactions, filters]);

  const columns = [
    { 
      header: 'REFERENSI', 
      render: (row: any) => (
        <span className="font-mono font-black text-[#0054a6] text-[13px] block">{row.reference_no}</span> 
      )
    },
    { 
      header: 'TANGGAL', 
      render: (row: any) => (
        <div className="flex items-center gap-2 text-gray-700 font-bold text-[12px]">
          <Calendar className="h-3 w-3 text-gray-400" />
          {new Date(row.date).toLocaleDateString('id-ID')}
        </div>
      )
    },
    { header: 'TIPE', render: (row: any) => {
      const colors: any = { 
        IN: 'bg-green-50 text-green-700 border-green-200', 
        OUT: 'bg-red-50 text-red-700 border-red-200', 
        TRANSFER: 'bg-blue-50 text-blue-700 border-blue-200', 
        REJECT: 'bg-orange-50 text-orange-700 border-orange-200' 
      };
      return (
        <span className={`px-2 py-0.5 text-[9px] font-black rounded-[1px] border uppercase ${colors[row.type] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
          {row.type}
        </span>
      );
    }},
    { header: 'LOGISTIK FLOW', render: (row: any) => (
      <div className="flex items-center gap-2 max-w-xs truncate text-[11px] font-bold">
        <span className="text-gray-500 italic">
          {row.source_warehouse_name || 'EKSTERNAL'}
        </span>
        <ChevronRight className="h-3 w-3 text-gray-400 shrink-0" />
        <span className="text-gray-900">
          {row.target_warehouse_name || 'TUJUAN'}
        </span>
      </div>
    )},
    { header: 'TOTAL ITEM', render: (row: any) => (
      <div className="text-[12px] font-black text-[#0054a6]">
        {row.item_count} SKU
      </div>
    )},
    { header: 'AKSI', render: (row: any) => (
      <button 
        onClick={() => navigate(`/transactions/${row.id}`)} 
        className="text-[11px] font-black text-[#0054a6] hover:underline flex items-center gap-1"
      >
        [ LIHAT DETAIL ]
      </button>
    )}
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-[#999999] pb-3">
        <div>
          <h1 className="text-xl font-black text-gray-900 uppercase tracking-tight">Data Mutasi Inventori</h1>
          <p className="text-[12px] text-gray-500 font-bold italic tracking-tight underline decoration-dotted decoration-gray-300">History pergerakan stok antar warehouse dan partner</p>
        </div>
        <Button onClick={() => navigate('/transactions/new')} className="h-9 px-6 text-[12px] font-black uppercase tracking-wider bg-[#0054a6] hover:bg-blue-800 shadow-md">
          <Plus className="h-4 w-4 mr-2" /> BUAT TRANSAKSI BARU
        </Button>
      </div>

      {/* Legacy Filter Bar */}
      <div className="bg-[#f0f0f0] border border-[#999999] p-3 rounded-[1px] shadow-inner">
        <div className="flex items-center gap-2 mb-3 text-gray-600 border-b border-[#999999]/30 pb-1">
          <Filter className="h-3.5 w-3.5" />
          <span className="text-[10px] font-black uppercase tracking-widest">Parameter Filter Laporan</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-[10px] font-black text-[#0054a6] uppercase mb-1 block">TITIK LOKASI</label>
            <select 
              className="w-full h-8 px-2 bg-white border border-[#999999] text-[12px] font-bold outline-none focus:border-[#0054a6] rounded-[1px]"
              value={filters.warehouseId} 
              onChange={(e) => setFilters({...filters, warehouseId: e.target.value})}
            >
              <option value="">-- SEMUA LOKASI --</option>
              {warehouses.map(w => (
                <option key={w.id} value={w.id}>{w.name.toUpperCase()}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-black text-[#0054a6] uppercase mb-1 block">KATEGORI TIPE</label>
            <select 
              className="w-full h-8 px-2 bg-white border border-[#999999] text-[12px] font-bold outline-none focus:border-[#0054a6] rounded-[1px]"
              value={filters.type} 
              onChange={(e) => setFilters({...filters, type: e.target.value})}
            >
              <option value="">-- SEMUA TIPE --</option>
              <option value="IN">BARANG MASUK (IN)</option>
              <option value="OUT">BARANG KELUAR (OUT)</option>
              <option value="TRANSFER">PINDAHAN (TRANSFER)</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-black text-[#0054a6] uppercase mb-1 block">PERIODE AWAL</label>
            <input 
              type="date" 
              className="w-full h-8 px-2 bg-white border border-[#999999] text-[12px] font-bold outline-none focus:border-[#0054a6] rounded-[1px]" 
              value={filters.startDate}
              onChange={(e) => setFilters({...filters, startDate: e.target.value})}
            />
          </div>
          <div>
            <label className="text-[10px] font-black text-[#0054a6] uppercase mb-1 block">PERIODE AKHIR</label>
            <input 
              type="date" 
              className="w-full h-8 px-2 bg-white border border-[#999999] text-[12px] font-bold outline-none focus:border-[#0054a6] rounded-[1px]" 
              value={filters.endDate}
              onChange={(e) => setFilters({...filters, endDate: e.target.value})}
            />
          </div>
        </div>
      </div>

      <div className="desktop-card min-h-[400px]">
        <div className="desktop-header flex items-center justify-between">
           <span>REKAPITULASI DOKUMEN TRANSAKSI</span>
           <span className="text-[10px] italic font-normal lowercase tracking-normal">showing {transactions.length} entries</span>
        </div>
        <div className="p-0 border-t border-[#999999]">
          <Table columns={columns} data={transactions} isLoading={loading} />
        </div>
      </div>
    </div>
  );
}
