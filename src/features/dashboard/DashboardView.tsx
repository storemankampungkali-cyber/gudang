/**
 * ## src/features/dashboard/DashboardView.tsx
 */
import { useEffect, useState } from 'react';
import { dashboardApi } from '../../services/masterApi';
import { Package, Warehouse, ArrowUpRight, AlertTriangle, BarChart3 } from 'lucide-react';
import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Badge } from '../../components/ui/BaseUI';

export default function DashboardView() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dashboardApi.getSummary().then(res => {
      setData(res.data);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) return <div className="animate-pulse space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[1,2,3].map(i => <div key={i} className="h-24 bg-white border border-[#999999]"></div>)}
    </div>
    <div className="h-64 bg-white border border-[#999999]"></div>
  </div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-[#999999] pb-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900 uppercase tracking-tight">E-Gudang Dashboard</h1>
          <p className="text-[12px] text-gray-500 font-bold italic">Ringkasan operasional PT KAMPUNG KALI MAJU</p>
        </div>
        <div className="bg-[#0054a6] text-white px-3 py-1 text-xs font-bold rounded-[2px]">
          SISTEM AKTIF
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard 
          title="TOTAL MASTER BARANG" 
          value={data.summary.totalItems} 
          icon={Package} 
        />
        <SummaryCard 
          title="GUDANG AKTIF" 
          value={data.summary.totalWarehouses} 
          icon={Warehouse} 
        />
        <SummaryCard 
          title="TRANSAKSI HARI INI" 
          value={data.summary.todayTransactions} 
          icon={ArrowUpRight} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Chart */}
        <div className="lg:col-span-2 desktop-card overflow-hidden">
          <div className="desktop-header">
             <BarChart3 className="h-4 w-4 mr-2" />
             GRAFIK AKTIVITAS 7 HARI
          </div>
          <div className="p-4">
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                  <XAxis dataKey="date" tick={{fontSize: 11}} />
                  <YAxis tick={{fontSize: 11}} />
                  <Tooltip />
                  <Legend iconType="rect" />
                  <Bar dataKey="count" name="Jumlah Transaksi" fill="#0054a6" barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="desktop-card overflow-hidden">
          <div className="bg-[#cc0000] text-white px-2 py-1 flex items-center font-bold text-sm">
             <AlertTriangle className="h-4 w-4 mr-2" />
             PERINGATAN STOK RENDAH
          </div>
          <div className="p-3 space-y-2">
            {data.lowStock.length === 0 ? (
              <p className="text-[11px] text-gray-500 italic p-4 text-center">Seluruh stok dalam batas aman</p>
            ) : (
              data.lowStock.slice(0, 8).map((item: any) => (
                <div key={item.id} className="flex items-center justify-between p-2 bg-[#fff8f8] border border-[#ffcccc]">
                  <div>
                    <p className="text-[12px] font-bold text-gray-900">{item.name}</p>
                    <p className="text-[10px] text-gray-500 font-mono tracking-tighter">{item.code}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[12px] font-bold text-[#cc0000]">{item.current_stock} {item.base_unit}</p>
                    <p className="text-[9px] text-gray-400 font-bold uppercase">Min: {item.min_stock}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ title, value, icon: Icon }: any) {
  return (
    <div className="desktop-card overflow-hidden group">
      <div className="bg-gray-100 px-2 py-1 border-b border-[#999999] flex items-center justify-between">
        <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wide">{title}</span>
        <Icon className="h-3 w-3 text-[#0054a6]" />
      </div>
      <div className="p-4 flex items-center justify-center">
        <h3 className="text-4xl font-extrabold text-[#0054a6] tracking-tighter">{value}</h3>
      </div>
      <div className="bg-[#0054a6]/5 h-1 w-full"></div>
    </div>
  );
}
