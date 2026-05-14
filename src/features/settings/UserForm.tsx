/**
 * ## src/features/settings/UserForm.tsx
 */
import React, { useState } from 'react';
import { Button, Input } from '../../components/ui/BaseUI';
import { Select } from '../../components/ui/Select';
import { userApi } from '../../services/userApi';
import { toast } from '../../hooks/useToast';
import { UserRole, UserStatus } from '../../types';

interface UserFormProps {
  initialData?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function UserForm({ initialData, onSuccess, onCancel }: UserFormProps) {
  const [formData, setFormData] = useState({
    username: initialData?.username || '',
    full_name: initialData?.full_name || '',
    password: '',
    role: initialData?.role || UserRole.STAFF,
    status: initialData?.status || UserStatus.ACTIVE
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (initialData) {
        await userApi.updateUser(initialData.id, formData);
        toast.success('User berhasil diperbarui');
      } else {
        if (!formData.password) return toast.error('Password wajib diisi untuk user baru');
        await userApi.createUser(formData);
        toast.success('User baru berhasil dibuat');
      }
      onSuccess();
    } catch (err: any) {
      toast.error(err.message || 'Gagal menyimpan data user');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-gray-100 p-2 border border-[#999999] rounded-[2px] font-bold text-[11px] uppercase text-gray-600 mb-2">
        INFORMASI AUTHENTIKASI & IDENTITAS
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input 
          label="USERNAME LOGIN" 
          value={formData.username} 
          onChange={(e) => setFormData({...formData, username: e.target.value})} 
          required 
          className="font-bold text-[#0054a6]"
        />
        <Input 
          label="NAMA LENGKAP PENGGUNA" 
          value={formData.full_name} 
          onChange={(e) => setFormData({...formData, full_name: e.target.value})} 
          required 
        />
      </div>

      <div className="p-3 bg-blue-50 border border-blue-200 rounded-[2px] space-y-3">
        <Input 
          label={initialData ? "UPDATE PASSWORD (KOSONGKAN JIKA TIDAK BERUBAH)" : "PASSWORD AKSES"}
          type="password"
          value={formData.password} 
          onChange={(e) => setFormData({...formData, password: e.target.value})} 
          required={!initialData}
        />
        {!initialData && (
          <p className="text-[10px] text-blue-600 font-bold italic">* Password minimal 6 karakter unik</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 border-t border-[#999999] pt-4">
        <Select 
          label="OTORITAS SISTEM" 
          value={formData.role} 
          onChange={(e) => setFormData({...formData, role: e.target.value})}
          options={[
            { label: 'ADMINISTRATOR (FULL)', value: UserRole.ADMIN },
            { label: 'MANAGER (SUPERVISOR)', value: UserRole.MANAGER },
            { label: 'STAFF OPERASIONAL', value: UserRole.STAFF }
          ]}
        />
        <Select 
          label="STATUS AKUN" 
          value={formData.status} 
          onChange={(e) => setFormData({...formData, status: e.target.value})}
          options={[
            { label: 'AKTIF (BISA LOGIN)', value: UserStatus.ACTIVE },
            { label: 'SUSPEND (LOCKED)', value: UserStatus.INACTIVE }
          ]}
        />
      </div>

      <div className="flex justify-end gap-2 pt-6 border-t border-[#999999] mt-6">
        <Button variant="secondary" type="button" size="md" onClick={onCancel} disabled={isLoading}>BATAL</Button>
        <Button type="submit" size="md" isLoading={isLoading} className="bg-[#0054a6] hover:bg-[#004e9a]">
          {initialData ? 'SIMPAN PERUBAHAN' : 'REDAKSI USER BARU'}
        </Button>
      </div>
    </form>
  );
}
