/**
 * ## src/components/layout/Layout.tsx
 */
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ArrowLeftRight, 
  Warehouse, 
  Users, 
  BarChart3, 
  Settings,
  AlertOctagon,
  Truck,
  Menu, 
  LogOut, 
  Bell, 
  User as UserIcon, 
  Clock
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Badge } from '../ui/BaseUI';
import { ToastContainer } from '../ui/AdvancedUI';

export const Sidebar = ({ isOpen }: { isOpen: boolean }) => {
  const { user } = useAuth();
  
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', roles: ['ADMIN', 'MANAGER', 'STAFF'] },
    { name: 'Inventory', icon: Package, path: '/inventory', roles: ['ADMIN', 'MANAGER', 'STAFF'] },
    { name: 'Transaksi', icon: ArrowLeftRight, path: '/transactions', roles: ['ADMIN', 'MANAGER', 'STAFF'] },
    { name: 'Reject', icon: AlertOctagon, path: '/reject', roles: ['ADMIN', 'MANAGER', 'STAFF'] },
    { name: 'Gudang', icon: Warehouse, path: '/warehouses', roles: ['ADMIN', 'MANAGER'] },
    { name: 'Partner', icon: Truck, path: '/partners', roles: ['ADMIN', 'MANAGER', 'STAFF'] },
    { name: 'Laporan', icon: BarChart3, path: '/reports', roles: ['ADMIN', 'MANAGER'] },
    { name: 'Pengguna', icon: Users, path: '/settings/users', roles: ['ADMIN'] },
    { name: 'Settings', icon: Settings, path: '/settings', roles: ['ADMIN', 'MANAGER', 'STAFF'] },
  ];

  const filteredItems = menuItems.filter(item => user && item.roles.includes(user.role));

  return (
    <aside className={`bg-[#f0f0f0] border-r border-[#999999] transition-all duration-300 h-full flex flex-col ${isOpen ? 'w-56' : 'w-14'}`}>
      <div className="bg-[#0054a6] h-12 flex items-center px-4 gap-3 border-b border-[#003d7c]">
        <div className="bg-white h-6 w-6 rounded-[2px] flex items-center justify-center text-[#0054a6] font-extrabold text-xs shadow-inner">G</div>
        {isOpen && <span className="text-sm font-bold tracking-tight text-white uppercase italic">GudangPro</span>}
      </div>
      
      <nav className="flex-1 overflow-y-auto py-2">
        {filteredItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-2 border-l-4 transition-all text-[13px]
              ${isActive ? 'bg-white border-[#0054a6] text-[#0054a6] font-bold shadow-sm' : 'border-transparent text-gray-700 hover:bg-gray-200'}
            `}
          >
            <item.icon className={`h-4 w-4 flex-shrink-0 ${isOpen ? '' : 'mx-auto'}`} />
            {isOpen && <span>{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      {isOpen && (
        <div className="p-3 border-t border-[#999999] text-[10px] text-gray-500 font-bold uppercase tracking-tighter bg-gray-200">
           Accurate Style v1.0
        </div>
      )}
    </aside>
  );
};

export const Topbar = ({ onToggleSidebar }: { onToggleSidebar: () => void }) => {
  const { user, logout } = useAuth();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="bg-white border-b border-[#999999] h-12 flex items-center justify-between px-4 z-10 shadow-sm">
      <div className="flex items-center gap-4">
        <button onClick={onToggleSidebar} className="p-1.5 hover:bg-gray-100 border border-transparent hover:border-gray-300 rounded-[2px] text-gray-600">
          <Menu className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-4 text-gray-600 text-xs font-bold divide-x divide-gray-300">
          <div className="flex items-center gap-1.5 px-3">
            <Clock className="h-3.5 w-3.5" />
            <span>{time.toLocaleString('id-ID', { hour12: false })}</span>
          </div>
          <div className="px-3 text-blue-800 uppercase italic">
            PT KAMPUNG KALI MAJU
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-1.5 text-gray-500 hover:bg-gray-100 rounded-[2px]">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1 right-1 h-1.5 w-1.5 bg-red-600 rounded-full border border-white"></span>
        </button>

        <div className="flex items-center gap-3 border-l border-gray-300 pl-4">
          <div className="text-right hidden sm:block">
            <p className="text-[12px] font-bold text-gray-900 leading-tight">{user?.full_name}</p>
            <p className="text-[10px] text-blue-600 font-bold uppercase tracking-tighter">{user?.role}</p>
          </div>
          <button 
            onClick={logout}
            className="flex items-center gap-1.5 px-2 py-1 bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 rounded-[2px] text-[11px] font-bold uppercase transition-all"
            title="Keluar"
          >
            <LogOut className="h-3.5 w-3.5" />
            Keluar
          </button>
        </div>
      </div>
    </header>
  );
};

export const AppShell = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user } = useAuth();

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden flex-col">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Topbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#f4f4f4] pattern-dots">
            {children}
          </main>
        </div>
      </div>
      {/* Accurate style Status Bar */}
      <footer className="h-6 bg-[#0054a6] border-t border-[#003d7c] flex items-center justify-between px-3 text-[10px] text-white font-bold select-none shrink-0">
        <div className="flex items-center gap-4 divide-x divide-white/20">
          <span className="flex items-center gap-1">
             <div className="h-2 w-2 rounded-full bg-green-400"></div>
             ONLINE: {user?.id?.substring(0, 8) || 'GUEST'}
          </span>
          <span className="px-3 uppercase italic">DB: GDN_PRO_KAMP_KALI_MAJU_V1</span>
          <span className="px-3">MODE: MULTI-USER ENTERPRISE</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="bg-white/10 px-2">CAPS: OFF</span>
          <span className="font-mono">VER 2026.05.14.01</span>
        </div>
      </footer>
      <ToastContainer />
    </div>
  );
};
