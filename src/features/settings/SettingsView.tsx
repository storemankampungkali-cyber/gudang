/**
 * ## src/features/settings/SettingsView.tsx
 */
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Button, Badge } from '../../components/ui/BaseUI';
import { User, Shield, Info, Database, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { userApi } from '../../services/userApi';
import { Table, Modal } from '../../components/ui/AdvancedUI';
import UserForm from './UserForm';

export default function SettingsView() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'users' | 'system'>('profile');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-[#999999] pb-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900 uppercase tracking-tight">System Settings</h1>
          <p className="text-[12px] text-gray-500 font-bold italic tracking-tight">Konfigurasi akun dan sistem PT KAMPUNG KALI MAJU</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Sidebar Tabs */}
        <div className="w-full lg:w-56 space-y-px">
          <TabButton 
            active={activeTab === 'profile'} 
            onClick={() => setActiveTab('profile')} 
            icon={User} 
            label="PROFIL SAYA" 
          />
          {user?.role === 'ADMIN' && (
            <TabButton 
              active={activeTab === 'users'} 
              onClick={() => setActiveTab('users')} 
              icon={Shield} 
              label="MANAJEMEN USER" 
            />
          )}
          <TabButton 
            active={activeTab === 'system'} 
            onClick={() => setActiveTab('system')} 
            icon={Database} 
            label="UNIT INFORMASI" 
          />
        </div>

        {/* Content Area */}
        <div className="flex-1 desktop-card min-h-[500px]">
          {activeTab === 'profile' && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-full">
                <div className="desktop-header">
                   IDENTITAS PENGGUNA TER-LOGIN
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-8 mb-10">
                    <div className="h-24 w-24 rounded-[2px] bg-[#f0f0f0] border-2 border-[#999999] flex items-center justify-center text-[#0054a6] text-4xl font-black shadow-inner">
                      {user?.full_name[0]}
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">{user?.full_name}</h2>
                      <div className="flex gap-2">
                        <span className="bg-[#0054a6] text-white px-2 py-0.5 text-[10px] font-bold rounded-[1px] uppercase">{user?.role}</span>
                        <span className="bg-green-600 text-white px-2 py-0.5 text-[10px] font-bold rounded-[1px] uppercase tracking-wider">{user?.status}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-[#e0e0e0]">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#0054a6] uppercase tracking-tight">Username System</label>
                      <p className="text-lg font-bold text-gray-900 border-b border-dashed border-[#999999] pb-1">{user?.username}</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#0054a6] uppercase tracking-tight">Otentikasi Keamanan</label>
                      <p className="text-[13px] text-gray-500 font-bold italic">PASSWORD TER-ENKRIPSI (STANDARD MD5/BCRYPT)</p>
                      <Button variant="outline" size="sm" className="mt-2 font-bold h-7 text-[11px] px-4 border-[#0054a6] text-[#0054a6] hover:bg-[#0054a6] hover:text-white">GANTI PASSWORD</Button>
                    </div>
                  </div>
                </div>
             </motion.div>
          )}

          {activeTab === 'users' && <UserManagement />}

          {activeTab === 'system' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-full">
               <div className="desktop-header">
                  DETAIL INFRASTRUKTUR PERANGKAT LUNAK
               </div>
               <div className="p-6 space-y-6">
                 <div className="flex items-center gap-3 p-3 bg-blue-50 border border-[#0054a6]/30 text-[#0054a6] rounded-[2px]">
                    <div className="p-1.5 bg-[#0054a6] text-white rounded-[1px]">
                      <Info className="h-4 w-4" />
                    </div>
                    <p className="text-[12px] font-bold uppercase tracking-tight">GudangPro Enterprise v2026.05 • Build ID: GDN-9982</p>
                 </div>
                 
                 <div className="space-y-4">
                    <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Core Technologies</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <TechCard label="BACKEND ENGINE" value="NODE.JS 20 + EXPRESS 5" />
                      <TechCard label="DATABASE ENGINE" value="MYSQL 8.0 CLUSTER" />
                      <TechCard label="FRONTEND UI" value="REACT 18 + VITE + TS" />
                      <TechCard label="DESIGN SYSTEM" value="TAILWIND DESKTOP PRESET" />
                    </div>
                 </div>

                 <div className="pt-4 mt-auto opacity-50 grayscale flex justify-center grayscale-100">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/29/MySQL-logo.svg" alt="MySQL" className="h-10 opacity-30 px-4" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg" alt="NodeJS" className="h-10 opacity-30 px-4" />
                 </div>
               </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon: Icon, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-white hover:text-gray-900'}`}
    >
      <Icon className="h-5 w-5" />
      <span className="font-bold">{label}</span>
    </button>
  );
}

function TechCard({ label, value }: any) {
  return (
    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
      <p className="text-[10px] font-bold text-gray-400 uppercase">{label}</p>
      <p className="text-sm font-bold text-gray-900 mt-0.5">{value}</p>
    </div>
  );
}

function UserManagement() {
  return (
     <div className="flex flex-col h-full">
        <div className="desktop-header flex items-center justify-between">
           <span>ADMINISTRASI DATA PENGGUNA</span>
        </div>
        <div className="p-4">
           <UserManagementTable />
        </div>
     </div>
  );
}

function UserManagementTable() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const fetchUsers = () => {
    setLoading(true);
    userApi.getUsers().then(res => {
      setUsers(res.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openModal = (user: any = null) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const columns = [
    { header: 'USERNAME', key: 'username', render: (r: any) => <span className="font-bold text-[#0054a6]">{r.username}</span> },
    { header: 'NAMA LENGKAP', key: 'full_name' },
    { header: 'OTORITAS', render: (r: any) => (
      <span className={`px-2 py-0.5 text-[9px] font-black rounded-[1px] border ${r.role === 'ADMIN' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
        {r.role}
      </span>
    )},
    { header: 'STATUS', render: (r: any) => (
      <span className={`px-2 py-0.5 text-[9px] font-black rounded-[1px] border ${r.status === 'ACTIVE' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-100 text-gray-500 border-gray-300'}`}>
        {r.status}
      </span>
    )},
    { header: 'AKSI', render: (r: any) => (
      <button 
        onClick={() => openModal(r)}
        className="text-[10px] font-bold text-[#0054a6] hover:underline"
      >
        [ EDIT ]
      </button>
    )}
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-end p-2 bg-gray-50 border border-[#999999] rounded-[1px]">
        <Button size="sm" onClick={() => openModal()} className="h-7 text-[11px] font-bold uppercase">
          <Plus className="h-3.5 w-3.5 mr-1" /> Buat User Baru
        </Button>
      </div>
      
      <div className="border border-[#999999] rounded-[2px] overflow-hidden">
        <Table columns={columns} data={users} isLoading={loading} />
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={selectedUser ? 'KOREKSI DATA PENGGUNA' : 'REGISTRASI PENGGUNA BARU'}
      >
        <UserForm 
          initialData={selectedUser} 
          onSuccess={() => { setIsModalOpen(false); fetchUsers(); }} 
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
