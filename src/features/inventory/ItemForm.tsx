/**
 * ## src/features/inventory/ItemForm.tsx
 */
import React, { useState } from 'react';
import { Button, Input } from '../../components/ui/BaseUI';
import { Select } from '../../components/ui/Select';
import { inventoryApi } from '../../services/api';
import { toast } from '../../hooks/useToast';
import { Plus, Trash2, X } from 'lucide-react';

export default function ItemForm({ initialData, onSuccess }: { initialData?: any; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    code: initialData?.code || '',
    name: initialData?.name || '',
    category: initialData?.category || '',
    base_unit: initialData?.base_unit || '',
    min_stock: initialData?.min_stock || 0,
    is_active: initialData?.is_active ?? true,
    units: initialData?.units || []
  });
  const [isLoading, setIsLoading] = useState(false);

  const addUnit = () => {
    setFormData({
      ...formData,
      units: [...formData.units, { unit_name: '', conversion_ratio: 1, operator: '*' }]
    });
  };

  const removeUnit = (index: number) => {
    const newUnits = [...formData.units];
    newUnits.splice(index, 1);
    setFormData({ ...formData, units: newUnits });
  };

  const handleUnitChange = (index: number, field: string, value: any) => {
    const newUnits = [...formData.units];
    newUnits[index] = { ...newUnits[index], [field]: value };
    setFormData({ ...formData, units: newUnits });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (initialData) {
        await inventoryApi.updateItem(initialData.id, formData);
        toast.success('Barang berhasil diperbarui');
      } else {
        await inventoryApi.createItem(formData);
        toast.success('Barang baru berhasil ditambahkan');
      }
      onSuccess();
    } catch (err: any) {
      toast.error(err.message || 'Gagal menyimpan barang');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-gray-100 p-2 border border-[#999999] rounded-[2px] font-bold text-[11px] uppercase text-gray-600 mb-2">
        DATA UTAMA BARANG
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
        <Input 
          label="Kode Barang" 
          value={formData.code} 
          onChange={(e) => setFormData({...formData, code: e.target.value})} 
          required 
          disabled={!!initialData}
        />
        <Input 
          label="Nama Barang" 
          value={formData.name} 
          onChange={(e) => setFormData({...formData, name: e.target.value})} 
          required 
        />
        <Input 
          label="Kategori" 
          value={formData.category} 
          onChange={(e) => setFormData({...formData, category: e.target.value})} 
        />
        <div className="flex gap-2">
          <div className="flex-[2]">
            <Input 
              label="Satuan Dasar" 
              value={formData.base_unit} 
              placeholder="Pcs"
              onChange={(e) => setFormData({...formData, base_unit: e.target.value})} 
              required 
            />
          </div>
          <div className="flex-[1]">
            <Input 
              label="Stok Min." 
              type="number"
              value={formData.min_stock} 
              onChange={(e) => setFormData({...formData, min_stock: parseInt(e.target.value)})} 
            />
          </div>
        </div>
        <Select 
          label="Status Aktif" 
          value={formData.is_active ? '1' : '0'} 
          onChange={(e) => setFormData({...formData, is_active: e.target.value === '1'})}
          options={[
            { label: 'AKTIF (YA)', value: '1' },
            { label: 'NON-AKTIF (TIDAK)', value: '0' }
          ]}
        />
      </div>

      <div className="border border-[#999999] rounded-[2px] overflow-hidden mt-4">
        <div className="bg-[#0054a6] text-white px-2 py-1 flex items-center justify-between font-bold text-[11px] uppercase">
          <span>Konversi Satuan Multilevel</span>
          <Button type="button" variant="secondary" size="sm" onClick={addUnit} className="h-5 text-[9px] px-1 border-white/20">
            [+] TAMBAH SATUAN
          </Button>
        </div>
        
        <div className="p-3 bg-gray-50 space-y-2">
          {formData.units.length === 0 && (
            <p className="text-[11px] text-gray-500 italic text-center py-2 underline underline-offset-4 decoration-dotted">Belum ada definisi satuan tambahan</p>
          )}
          <div className="grid grid-cols-12 gap-2 text-[10px] font-bold text-gray-400 uppercase mb-1">
             <div className="col-span-5 px-1 truncate">Nama Satuan</div>
             <div className="col-span-1 text-center"></div>
             <div className="col-span-3 px-1">Ratio</div>
             <div className="col-span-2 px-1">Op</div>
             <div className="col-span-1"></div>
          </div>
          {formData.units.map((unit: any, idx: number) => (
            <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-white p-1 border border-[#999999]/30">
              <div className="col-span-5">
                <input 
                  className="w-full text-[12px] px-1 py-0.5 border border-transparent focus:border-[#0054a6] outline-none"
                  value={unit.unit_name} 
                  onChange={(e) => handleUnitChange(idx, 'unit_name', e.target.value)} 
                />
              </div>
              <div className="col-span-1 text-center text-gray-400">=</div>
              <div className="col-span-3">
                <input 
                  type="number"
                  className="w-full text-[12px] px-1 py-0.5 border border-transparent focus:border-[#0054a6] outline-none font-bold"
                  value={unit.conversion_ratio} 
                  onChange={(e) => handleUnitChange(idx, 'conversion_ratio', parseFloat(e.target.value))} 
                />
              </div>
              <div className="col-span-2">
                 <select 
                    className="w-full text-[11px] bg-transparent outline-none cursor-pointer"
                    value={unit.operator}
                    onChange={(e) => handleUnitChange(idx, 'operator', e.target.value)}
                 >
                    <option value="*">*</option>
                    <option value="/">/</option>
                 </select>
              </div>
              <div className="col-span-1 flex justify-end">
                <button type="button" onClick={() => removeUnit(idx)} className="text-red-600 hover:text-red-800">
                  <X className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t border-[#999999] mt-6">
        <Button variant="secondary" type="button" size="md" onClick={() => onSuccess()} disabled={isLoading}>BATAL</Button>
        <Button type="submit" size="md" isLoading={isLoading}>SIMPAN FORM (CTRL+S)</Button>
      </div>
    </form>
  );
}
