/**
 * ## src/features/transactions/TransactionForm.tsx
 */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input } from '../../components/ui/BaseUI';
import { Select } from '../../components/ui/Select';
import { useTransaction } from '../../hooks/useTransaction';
import { useMaster } from '../../hooks/useMaster';
import { useInventory } from '../../hooks/useInventory';
import { toast } from '../../hooks/useToast';
import { Plus, Trash2, ArrowLeft, Save, ShoppingCart, X, Search, Undo, Redo } from 'lucide-react';
import AutocompleteModal from '../../components/ui/AutocompleteModal';
import { useHistory } from '../../hooks/useHistory';

export default function TransactionForm() {
  const navigate = useNavigate();
  const { createTransaction, loading: trLoading } = useTransaction();
  const { warehouses, partners, fetchWarehouses, fetchPartners } = useMaster();
  const { items, fetchItems } = useInventory();
  
  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false);
  const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null);

  const { 
    state: formData, 
    set: setFormData, 
    undo, 
    redo, 
    canUndo, 
    canRedo 
  } = useHistory({
    date: new Date().toISOString().split('T')[0],
    reference_no: `TX-${Date.now()}`,
    delivery_order_no: '',
    type: 'IN',
    source_warehouse_id: '',
    target_warehouse_id: '',
    partner_id: '',
    notes: '',
    items: [] as any[]
  });

  useEffect(() => {
    fetchItems();
    fetchWarehouses();
    fetchPartners();
  }, [fetchItems, fetchWarehouses, fetchPartners]);

  // Keyboard Shortcuts for History
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { item_id: '', qty: 1, unit: '', note: '' }]
    });
  };

  const removeItem = (index: number) => {
    const newItems = [...formData.items];
    newItems.splice(index, 1);
    setFormData({ ...formData, items: newItems });
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...formData.items];
    
    if (field === 'item_id') {
      const selectedItem = items.find(i => i.id === value);
      newItems[index] = { 
        ...newItems[index], 
        item_id: value, 
        unit: selectedItem?.base_unit || '',
      };
    } else {
      newItems[index] = { ...newItems[index], [field]: value };
    }
    
    setFormData({ ...formData, items: newItems });
  };

  const openAutocomplete = (idx: number) => {
    setActiveItemIndex(idx);
    setIsAutocompleteOpen(true);
  };

  const onSelectItem = (item: any) => {
    if (activeItemIndex !== null) {
      handleItemChange(activeItemIndex, 'item_id', item.id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.items.length === 0) return toast.error('Harap pilih minimal 1 barang');
    
    // Simple validation before sending
    if (formData.type === 'TRANSFER' && formData.source_warehouse_id === formData.target_warehouse_id) {
      return toast.error('Gudang sumber dan tujuan tidak boleh sama');
    }

    try {
      await createTransaction(formData);
      navigate('/transactions');
    } catch (err) {
      // Error handled by hook
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b border-[#999999] opacity-90 pb-2">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/transactions')} size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" /> LISTING
          </Button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 uppercase">Input Transaksi Barang</h1>
            <p className="text-[11px] text-[#0054a6] font-bold tracking-tight uppercase tracking-tighter">GudangPro &gt; Transaksi &gt; Form Utama</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={undo} 
            disabled={!canUndo} 
            className="px-2"
            title="Undo (Ctrl+Z)"
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={redo} 
            disabled={!canRedo} 
            className="px-2"
            title="Redo (Ctrl+Y)"
          >
            <Redo className="h-4 w-4" />
          </Button>
          <span className="w-2"></span>
          <Button variant="secondary" size="md" onClick={() => navigate('/transactions')}>BATAL</Button>
          <Button size="md" onClick={handleSubmit} isLoading={trLoading} className="gap-2">
            <Save className="h-4 w-4" /> SIMPAN (F10)
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Left Side: General Info */}
        <div className="lg:col-span-3 space-y-4">
          <div className="desktop-card overflow-hidden">
            <div className="desktop-header">
              <Plus className="h-3.5 w-3.5 mr-2" /> INFORMASI VOUCHER
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input 
                type="date" 
                label="Tanggal" 
                value={formData.date} 
                onChange={(e) => setFormData({...formData, date: e.target.value})} 
                required 
              />
              <Input 
                label="No. Referensi" 
                value={formData.reference_no} 
                onChange={(e) => setFormData({...formData, reference_no: e.target.value})} 
                required 
              />
              <Select 
                label="Tipe Alur" 
                value={formData.type} 
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                options={[
                  { label: 'MASUK (IN)', value: 'IN' },
                  { label: 'KELUAR (OUT)', value: 'OUT' },
                  { label: 'PINDAH (TRANSFER)', value: 'TRANSFER' },
                ]}
              />
            </div>
            <div className="px-4 pb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input 
                label="No. Surat Jalan" 
                placeholder="---"
                value={formData.delivery_order_no} 
                onChange={(e) => setFormData({...formData, delivery_order_no: e.target.value})} 
              />
              <div className="md:col-span-2">
                <Input 
                  label="Keterangan / Memo" 
                  placeholder="Input catatan disini..."
                  value={formData.notes} 
                  onChange={(e) => setFormData({...formData, notes: e.target.value})} 
                />
              </div>
            </div>
          </div>

          {/* Items Section */}
          <div className="desktop-card overflow-hidden">
            <div className="desktop-header flex justify-between items-center">
              <div className="flex items-center">
                <ShoppingCart className="h-3.5 w-3.5 mr-2" /> RINCIAN BARANG
              </div>
              <Button type="button" variant="secondary" size="sm" onClick={addItem} className="h-5 text-[9px] px-2 border-white/20">
                [+] BARIS BARU
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-[12px] border-collapse bg-white">
                <thead className="bg-gray-100 border-b border-[#999999]">
                  <tr>
                    <th className="px-2 py-1.5 text-left border-r border-[#999999] w-10">NO</th>
                    <th className="px-2 py-1.5 text-left border-r border-[#999999]">NAMA BARANG</th>
                    <th className="px-2 py-1.5 text-left border-r border-[#999999] w-24">QTY</th>
                    <th className="px-2 py-1.5 text-left border-r border-[#999999] w-48">SATUAN</th>
                    <th className="px-2 py-1.5 text-left border-r border-[#999999]">MEMO</th>
                    <th className="px-2 py-1.5 text-center w-10">#</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {formData.items.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-gray-400 italic">Klik tombol [+] untuk menambah barang</td>
                    </tr>
                  )}
                  {formData.items.map((entry, idx) => (
                    <tr key={idx} className="hover:bg-blue-50/30">
                      <td className="px-2 py-1 border-r border-gray-100 text-center font-bold text-gray-400">{idx + 1}</td>
                      <td className="px-2 py-1 border-r border-gray-100">
                        <div 
                          onClick={() => openAutocomplete(idx)}
                          className="w-full flex items-center justify-between px-2 py-1 bg-gray-50 border border-gray-200 rounded-[1px] cursor-pointer hover:bg-blue-50 transition-colors group"
                        >
                          <span className={`${entry.item_id ? 'font-bold text-blue-900' : 'text-gray-400 italic'} truncate`}>
                            {entry.item_id ? `[${items.find(i => i.id === entry.item_id)?.code}] ${items.find(i => i.id === entry.item_id)?.name}` : 'Klik untuk cari barang...'}
                          </span>
                          <Search className="h-3 w-3 text-gray-400 group-hover:text-[#0054a6]" />
                        </div>
                      </td>
                      <td className="px-2 py-1 border-r border-gray-100">
                        <input 
                          type="number"
                          className="w-full bg-transparent outline-none text-right font-bold"
                          value={entry.qty}
                          onChange={(e) => handleItemChange(idx, 'qty', parseFloat(e.target.value))}
                        />
                      </td>
                      <td className="px-2 py-1 border-r border-gray-100">
                        <input 
                          className="w-full bg-transparent outline-none text-gray-500 italic"
                          value={entry.unit}
                          readOnly
                        />
                      </td>
                      <td className="px-2 py-1 border-r border-gray-100">
                        <input 
                          className="w-full bg-transparent outline-none"
                          placeholder="..."
                          value={entry.note}
                          onChange={(e) => handleItemChange(idx, 'note', e.target.value)}
                        />
                      </td>
                      <td className="px-2 py-1 text-center">
                        <button type="button" onClick={() => removeItem(idx)} className="text-red-500 hover:text-red-700">
                          <X className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Side: Sidebar/Control */}
        <div className="space-y-4">
          <div className="desktop-card overflow-hidden">
            <div className="desktop-header">
               PENGATURAN ALUR
            </div>
            <div className="p-3 space-y-3 bg-white">
              {formData.type === 'TRANSFER' ? (
                <>
                  <Select 
                    label="Gudang Sumber"
                    value={formData.source_warehouse_id} 
                    onChange={(e) => setFormData({...formData, source_warehouse_id: e.target.value})}
                    options={warehouses.map(w => ({ label: w.name, value: w.id }))}
                    required
                  />
                  <div className="flex justify-center -my-1">
                    <div className="h-6 w-px bg-[#999999]"></div>
                  </div>
                  <Select 
                    label="Gudang Tujuan"
                    value={formData.target_warehouse_id} 
                    onChange={(e) => setFormData({...formData, target_warehouse_id: e.target.value})}
                    options={warehouses.filter(w => w.id !== formData.source_warehouse_id).map(w => ({ label: w.name, value: w.id }))}
                    required
                  />
                </>
              ) : (
                <>
                  <Select 
                    label="Warehouse"
                    value={formData.type === 'IN' ? formData.target_warehouse_id : formData.source_warehouse_id} 
                    onChange={(e) => setFormData({
                      ...formData, 
                      [formData.type === 'IN' ? 'target_warehouse_id' : 'source_warehouse_id']: e.target.value
                    })}
                    options={warehouses.map(w => ({ label: w.name, value: w.id }))}
                    required
                  />
                  <Select 
                    label={formData.type === 'IN' ? 'Supplier' : 'Customer'}
                    value={formData.partner_id} 
                    onChange={(e) => setFormData({...formData, partner_id: e.target.value})}
                    options={partners.filter(p => p.type === (formData.type === 'IN' ? 'SUPPLIER' : 'CUSTOMER')).map(p => ({ label: p.name, value: p.id }))}
                  />
                </>
              )}
            </div>
          </div>

          <div className="desktop-card overflow-hidden">
            <div className="desktop-header">
               RINGKASAN
            </div>
            <div className="p-3 space-y-2 bg-gray-50">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-gray-500 uppercase">Items:</span>
                <span className="text-[#0054a6]">{formData.items.length}</span>
              </div>
              <div className="flex justify-between text-[13px] font-extrabold border-t border-[#999999] pt-2 mt-2">
                <span className="text-gray-900 uppercase">Total Qty:</span>
                <span className="text-[#0054a6]">
                  {formData.items.reduce((acc, curr) => acc + (curr.qty || 0), 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </form>

      <AutocompleteModal
        isOpen={isAutocompleteOpen}
        onClose={() => setIsAutocompleteOpen(false)}
        onSelect={onSelectItem}
        items={items.filter(i => i.is_active)}
        title="CARI MASTER BARANG"
        placeholder="Ketik nama atau kode barang..."
      />
    </div>
  );
}
