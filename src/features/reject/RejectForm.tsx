/**
 * ## src/features/reject/RejectForm.tsx
 */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input } from '../../components/ui/BaseUI';
import { Select } from '../../components/ui/Select';
import { useReject } from '../../hooks/useReject';
import { useMaster } from '../../hooks/useMaster';
import { useInventory } from '../../hooks/useInventory';
import { toast } from '../../hooks/useToast';
import { ArrowLeft, Save, Trash2, Plus, AlertTriangle, X, Search, Undo, Redo } from 'lucide-react';
import AutocompleteModal from '../../components/ui/AutocompleteModal';
import { useHistory } from '../../hooks/useHistory';

export default function RejectForm() {
  const navigate = useNavigate();
  const { createReject, loading } = useReject();
  const { warehouses, fetchWarehouses } = useMaster();
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
    warehouse_id: '',
    notes: '',
    items: [] as any[]
  });

  useEffect(() => {
    fetchItems();
    fetchWarehouses();
  }, [fetchItems, fetchWarehouses]);

  // Keyboard Shortcuts for History
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) redo();
        else undo();
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
      items: [...formData.items, { item_id: '', qty: 1, reason: '' }]
    });
  };

  const removeItem = (index: number) => {
    const newItems = [...formData.items];
    newItems.splice(index, 1);
    setFormData({ ...formData, items: newItems });
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
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
    
    try {
      await createReject(formData);
      navigate('/reject');
    } catch (err) {
      // Handled by hook
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-4">
      <div className="flex items-center justify-between mb-4 border-b border-[#999999] opacity-90 pb-2">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/reject')} size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" /> LISTING
          </Button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 uppercase">Input Barang Reject / Rusak</h1>
            <p className="text-[11px] text-[#cc0000] font-bold tracking-tight uppercase tracking-tighter tracking-widest uppercase">GudangPro &gt; Transaksi &gt; Form Reject</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={undo} 
            disabled={!canUndo} 
            className="px-2"
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={redo} 
            disabled={!canRedo} 
            className="px-2"
          >
            <Redo className="h-4 w-4" />
          </Button>
          <span className="w-2"></span>
          <Button variant="secondary" size="md" onClick={() => navigate('/reject')}>BATAL</Button>
          <Button onClick={handleSubmit} isLoading={loading} className="gap-2 bg-[#cc0000] hover:bg-[#aa0000] border-[#990000] shadow-sm">
            <Save className="h-4 w-4" /> SIMPAN REJECT (F10)
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 space-y-4">
          <div className="desktop-card overflow-hidden">
            <div className="bg-[#cc0000] text-white px-2 py-1 flex items-center font-bold text-[11px] uppercase border-b border-[#990000]">
              <AlertTriangle className="h-3.5 w-3.5 mr-2" /> INFORMASI REJECT
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                type="date" 
                label="Tanggal Pencatatan" 
                value={formData.date} 
                onChange={(e) => setFormData({...formData, date: e.target.value})} 
                required 
              />
              <Select 
                label="Lokasi Gudang (Sumbar)"
                value={formData.warehouse_id} 
                onChange={(e) => setFormData({...formData, warehouse_id: e.target.value})}
                options={warehouses.map(w => ({ label: w.name, value: w.id }))}
                required
              />
            </div>
            <div className="px-4 pb-4">
              <Input 
                label="Keterangan Umum / Alasan Utama" 
                placeholder="Berikan keterangan singkat..."
                value={formData.notes} 
                onChange={(e) => setFormData({...formData, notes: e.target.value})} 
              />
            </div>
          </div>

          <div className="desktop-card overflow-hidden">
            <div className="desktop-header flex justify-between items-center">
              <div className="flex items-center">
                <Trash2 className="h-3.5 w-3.5 mr-2" /> DETAIL BARANG RUSAK
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
                    <th className="px-2 py-1.5 text-left border-r border-[#999999]">ALASAN SPESIFIK</th>
                    <th className="px-2 py-1.5 text-center w-10">#</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {formData.items.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-400 italic">Gunakan tombol [+] untuk menambahkan barang rusak</td>
                    </tr>
                  )}
                  {formData.items.map((entry, idx) => (
                    <tr key={idx} className="hover:bg-red-50/30">
                      <td className="px-2 py-1 border-r border-gray-100 text-center font-bold text-gray-400">{idx + 1}</td>
                      <td className="px-2 py-1 border-r border-gray-100">
                        <div 
                          onClick={() => openAutocomplete(idx)}
                          className="w-full flex items-center justify-between px-2 py-1 bg-gray-50 border border-gray-200 rounded-[1px] cursor-pointer hover:bg-red-50 transition-colors group"
                        >
                          <span className={`${entry.item_id ? 'font-bold text-red-900' : 'text-gray-400 italic'} truncate`}>
                            {entry.item_id ? `[${items.find(i => i.id === entry.item_id)?.code}] ${items.find(i => i.id === entry.item_id)?.name}` : 'Klik untuk cari barang...'}
                          </span>
                          <Search className="h-3 w-3 text-gray-400 group-hover:text-[#cc0000]" />
                        </div>
                      </td>
                      <td className="px-2 py-1 border-r border-gray-100">
                        <input 
                          type="number"
                          className="w-full bg-transparent outline-none text-right font-bold text-red-600"
                          value={entry.qty}
                          onChange={(e) => handleItemChange(idx, 'qty', parseFloat(e.target.value))}
                        />
                      </td>
                      <td className="px-2 py-1 border-r border-gray-100">
                        <input 
                          className="w-full bg-transparent outline-none"
                          placeholder="Pecah / Expired / Hilang..."
                          value={entry.reason}
                          onChange={(e) => handleItemChange(idx, 'reason', e.target.value)}
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

        <div className="space-y-4">
          <div className="desktop-card overflow-hidden">
            <div className="bg-[#aa0000] text-white px-2 py-1 font-bold text-[11px] uppercase">
               CATATAN KEAMANAN
            </div>
            <div className="p-3 bg-red-50 space-y-2">
              <p className="text-[11px] text-red-800 leading-tight">
                <span className="font-bold underline">PERHATIAN:</span> Pencatatan ini akan langsung memotong saldo stok pada gudang yang dipilih.
              </p>
              <div className="h-px bg-red-200"></div>
              <p className="text-[10px] text-red-600 italic">
                Pastikan item telah diverifikasi secara fisik sebelum disimpan.
              </p>
            </div>
          </div>
        </div>
      </form>

      <AutocompleteModal
        isOpen={isAutocompleteOpen}
        onClose={() => setIsAutocompleteOpen(false)}
        onSelect={onSelectItem}
        items={items}
        title="SEARCH REJECT ITEM"
        placeholder="Cari item yang akan direject..."
      />
    </div>
  );
}
