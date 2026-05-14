/**
 * ## src/features/inventory/InventoryView.tsx
 */
import { useEffect, useState } from 'react';
import { inventoryApi } from '../../services/api';
import { Button, Badge } from '../../components/ui/BaseUI';
import { Table, Modal } from '../../components/ui/AdvancedUI';
import { Plus, Search, MoreVertical, Filter, Download, Upload } from 'lucide-react';
import ItemForm from './ItemForm';
import BulkImportModal from './BulkImportModal';
import { toast } from '../../hooks/useToast';

export default function InventoryView() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await inventoryApi.getItems();
      setItems(res.data);
    } catch (err) {
      toast.error('Gagal mengambil data barang');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = items.filter(i => 
    i.name.toLowerCase().includes(search.toLowerCase()) || 
    i.code.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { header: 'Kode', key: 'code', render: (row: any) => <span className="font-mono font-semibold">{row.code}</span> },
    { header: 'Nama Barang', key: 'name', render: (row: any) => (
      <div>
        <p className="font-medium">{row.name}</p>
        <p className="text-xs text-gray-500">{row.category || 'Tanpa Kategori'}</p>
      </div>
    )},
    { header: 'Satuan', key: 'base_unit' },
    { header: 'Stok Total', render: (row: any) => (
      <span className={`font-bold ${row.total_stock <= row.min_stock ? 'text-red-600' : 'text-gray-900'}`}>
        {row.total_stock}
      </span>
    )},
    { header: 'Min. Stok', key: 'min_stock' },
    { header: 'Status', render: (row: any) => (
      <Badge variant={row.is_active ? 'success' : 'neutral'}>
        {row.is_active ? 'Aktif' : 'Non-aktif'}
      </Badge>
    )},
    { header: 'Aksi', render: (row: any) => (
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => { setSelectedItem(row); setIsModalOpen(true); }}
        >
          Edit
        </Button>
      </div>
    )}
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#999999] pb-3 bg-white p-3 shadow-sm rounded-[2px]">
        <div>
          <h1 className="text-xl font-bold text-gray-900 uppercase">Daftar Barang</h1>
          <p className="text-[11px] text-gray-500 font-bold">MASTER DATA &gt; PERSEDIAAN &gt; BARANG &amp; JASA</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsImportModalOpen(true)}>
            <Upload className="h-4 w-4 mr-2" /> Impor (CSV)
          </Button>
          <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-2" /> Export</Button>
          <Button size="sm" onClick={() => { setSelectedItem(null); setIsModalOpen(true); }}>
            <Plus className="h-4 w-4 mr-2" /> Baru
          </Button>
        </div>
      </div>

      <div className="bg-[#f8f9fa] border border-[#999999] p-2 rounded-[2px] flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Cari berdasarkan kode atau nama..." 
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-[#999999] text-[13px] focus:outline-none focus:border-[#0054a6] rounded-[1px]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" size="sm"><Filter className="h-4 w-4 mr-2" /> Filter</Button>
      </div>

      <div className="desktop-card overflow-hidden">
        <div className="desktop-header divide-x divide-[#003d7c]">
           <span className="px-2">MASTER LISTING</span>
           <span className="px-2 text-[10px] opacity-75 uppercase">Total: {items.length} items</span>
        </div>
        <Table columns={columns} data={filteredData} isLoading={loading} />
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={selectedItem ? 'Edit Barang' : 'Tambah Barang Baru'}
        size="lg"
      >
        <ItemForm 
          initialData={selectedItem} 
          onSuccess={() => { setIsModalOpen(false); fetchData(); }} 
        />
      </Modal>

      <BulkImportModal 
        isOpen={isImportModalOpen} 
        onClose={() => setIsImportModalOpen(false)} 
        onSuccess={fetchData} 
      />
    </div>
  );
}
