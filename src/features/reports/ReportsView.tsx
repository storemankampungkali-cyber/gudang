/**
 * ## src/features/reports/ReportsView.tsx
 */
import React, { useState, useEffect } from 'react';
import { reportApi, warehouseApi } from '../../services/masterApi';
import { inventoryApi } from '../../services/api';
import { Button } from '../../components/ui/BaseUI';
import { Table } from '../../components/ui/AdvancedUI';
import { Select } from '../../components/ui/Select';
import { Download, BarChart3, ListFilter, ArrowLeftRight } from 'lucide-react';
import { toast } from '../../hooks/useToast';
import { formatNumber, formatDate } from '../../utils/formatters';

export default function ReportsView() {
  const [activeTab, setActiveTab] = useState<'mutation' | 'summary'>('summary');
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  
  const [filters, setFilters] = useState({
    warehouseId: '',
    itemId: '',
    type: '',
    date: new Date().toISOString().split('T')[0],
    start: new Date(new Date().setDate(1)).toISOString().split('T')[0], // Beginning of month
    end: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    Promise.all([
      warehouseApi.getWarehouses(),
      inventoryApi.getItems()
    ]).then(([w, i]) => {
      setWarehouses(w.data);
      setItems(i.data);
    });
  }, []);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const res = await reportApi.getStockSummary({
        warehouseId: filters.warehouseId,
        itemId: filters.itemId,
        date: filters.date
      });
      setData(res.data);
    } catch (err) {
      toast.error('Gagal memuat rekapitulasi stok');
    } finally {
      setLoading(false);
    }
  };

  const fetchMutation = async () => {
    setLoading(true);
    try {
      const res = await reportApi.getStockMutation({
        itemId: filters.itemId,
        startDate: filters.start,
        endDate: filters.end,
        type: filters.type,
        warehouseId: filters.warehouseId
      });
      setData(res.data);
    } catch (err) {
      toast.error('Gagal memuat mutasi stok');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const url = reportApi.exportExcel(activeTab, filters);
    window.open(url, '_blank');
  };

  const summaryColumns = [
    { header: 'Gudang', key: 'warehouse_name' },
    { header: 'Kode', key: 'item_code', render: (r: any) => <span className="font-mono">{r.item_code}</span> },
    { header: 'Nama Barang', key: 'item_name', render: (r: any) => <span className="font-medium">{r.item_name}</span> },
    { header: 'Kategori', key: 'category' },
    { header: 'Stok', render: (r: any) => <span className="font-bold">{formatNumber(r.current_stock)}</span> },
  ];

  const mutationColumns = [
    { header: 'Tanggal', key: 'date', render: (r: any) => formatDate(r.date) },
    { header: 'Referensi', key: 'reference_no', render: (r: any) => <span className="font-mono text-xs">{r.reference_no}</span> },
    { header: 'Tipe', key: 'type', render: (r: any) => (
      <span className={`px-1.5 py-0.5 rounded-[2px] text-[10px] font-bold ${
        r.type === 'IN' ? 'bg-green-100 text-green-700' : 
        r.type === 'OUT' ? 'bg-red-100 text-red-700' : 
        r.type === 'TRANSFER' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'
      }`}>
        {r.type}
      </span>
    )},
    { header: 'Gudang', render: (r: any) => (
      <span className="text-[11px] text-gray-500 font-bold">
        {r.source_warehouse || '-'} {r.target_warehouse ? `» ${r.target_warehouse}` : ''}
      </span>
    )},
    { header: 'Qty', key: 'qty', render: (r: any) => (
      <span className="font-black text-blue-900">{r.qty}</span>
    )}
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-[#999999] pb-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900 uppercase tracking-tight">Pelaporan & Analisa</h1>
          <p className="text-[12px] text-gray-500 font-bold italic tracking-tight">Monitoring pergerakan dan ketersediaan barang di seluruh outlet</p>
        </div>
        <Button onClick={handleExport} variant="outline" className="h-8 text-[11px] font-bold border-[#999999]">
          <Download className="h-3.5 w-3.5 mr-2" /> EXPORT EXCEL
        </Button>
      </div>

      <div className="desktop-card min-h-[500px]">
        <div className="flex border-b border-[#999999] bg-gray-50">
          <button 
            onClick={() => { setActiveTab('summary'); setData([]); }}
            className={`flex-1 py-3 text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${activeTab === 'summary' ? 'bg-white text-[#0054a6] border-r border-[#999999]' : 'text-gray-400 hover:bg-white border-r border-[#999999]/50'}`}
          >
            <BarChart3 className="h-4 w-4" /> REKAPITULASI STOK
          </button>
          <button 
            onClick={() => { setActiveTab('mutation'); setData([]); }}
            className={`flex-1 py-3 text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${activeTab === 'mutation' ? 'bg-white text-[#0054a6]' : 'text-gray-400 hover:bg-white'}`}
          >
            <ArrowLeftRight className="h-4 w-4" /> MUTASI STOK
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="p-3 bg-[#f0f0f0] border border-[#999999] rounded-[1px] grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
            {activeTab === 'summary' ? (
              <>
                <div className="md:col-span-3">
                  <Select 
                    label="LOKASI GUDANG" 
                    value={filters.warehouseId} 
                    onChange={(e) => setFilters({...filters, warehouseId: e.target.value})}
                    options={[
                      { label: 'SEMUA GUDANG/OUTLET', value: '' },
                      ...warehouses.map(w => ({ label: w.name.toUpperCase(), value: w.id }))
                    ]}
                  />
                </div>
                <div className="md:col-span-4">
                  <Select 
                    label="PILIH BARANG" 
                    value={filters.itemId} 
                    onChange={(e) => setFilters({...filters, itemId: e.target.value})}
                    options={[
                      { label: 'SEMUA BARANG', value: '' },
                      ...items.map(i => ({ label: `[${i.code}] ${i.name.toUpperCase()}`, value: i.id }))
                    ]}
                  />
                </div>
                <div className="md:col-span-3">
                  <label className="text-[10px] font-black text-[#0054a6] uppercase mb-1 block">PER TANGGAL</label>
                  <input 
                    type="date" 
                    className="w-full h-8 px-2 bg-white border border-[#999999] text-[12px] font-bold outline-none focus:border-[#0054a6] rounded-[1px]" 
                    value={filters.date}
                    onChange={(e) => setFilters({...filters, date: e.target.value})}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="md:col-span-3">
                  <Select 
                    label="ITEM UNTUK DIANALYSA" 
                    value={filters.itemId} 
                    onChange={(e) => setFilters({...filters, itemId: e.target.value})}
                    options={[
                      { label: 'SEMUA BARANG', value: '' },
                      ...items.map(i => ({ label: `[${i.code}] ${i.name.toUpperCase()}`, value: i.id }))
                    ]}
                  />
                </div>
                <div className="md:col-span-2">
                  <Select 
                    label="TIPE TRANSAKSI" 
                    value={filters.type} 
                    onChange={(e) => setFilters({...filters, type: e.target.value})}
                    options={[
                      { label: 'SEMUA TIPE', value: '' },
                      { label: 'MASUK (IN)', value: 'IN' },
                      { label: 'KELUAR (OUT)', value: 'OUT' },
                      { label: 'TRANSFER', value: 'TRANSFER' },
                      { label: 'REJECT', value: 'REJECT' }
                    ]}
                  />
                </div>
                <div className="md:col-span-2">
                  <Select 
                    label="LOKASI" 
                    value={filters.warehouseId} 
                    onChange={(e) => setFilters({...filters, warehouseId: e.target.value})}
                    options={[
                      { label: 'SEMUA LOKASI', value: '' },
                      ...warehouses.map(w => ({ label: w.name.toUpperCase(), value: w.id }))
                    ]}
                  />
                </div>
                <div className="md:col-span-3 grid grid-cols-2 gap-1">
                  <div>
                    <label className="text-[10px] font-black text-[#0054a6] uppercase mb-1 block">DARI</label>
                    <input 
                      type="date" 
                      className="w-full h-8 px-2 bg-white border border-[#999999] text-[12px] font-bold outline-none rounded-[1px]" 
                      value={filters.start}
                      onChange={(e) => setFilters({...filters, start: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-[#0054a6] uppercase mb-1 block">SAMPAI</label>
                    <input 
                      type="date" 
                      className="w-full h-8 px-2 bg-white border border-[#999999] text-[12px] font-bold outline-none rounded-[1px]" 
                      value={filters.end}
                      onChange={(e) => setFilters({...filters, end: e.target.value})}
                    />
                  </div>
                </div>
              </>
            )}
            <div className="md:col-span-2">
              <Button onClick={activeTab === 'summary' ? fetchSummary : fetchMutation} isLoading={loading} className="w-full h-8 text-[11px] font-bold bg-[#0054a6] hover:bg-blue-800">
                <ListFilter className="h-3 w-3 mr-1.5" /> PROSES DATA
              </Button>
            </div>
          </div>

          <div className="border border-[#999999] rounded-[2px] overflow-hidden">
            <Table 
              columns={activeTab === 'summary' ? summaryColumns : mutationColumns} 
              data={data} 
              isLoading={loading} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
