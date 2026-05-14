/**
 * ## src/features/transactions/TransactionDetail.tsx
 */
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTransaction } from '../../hooks/useTransaction';
import { Button } from '../../components/ui/BaseUI';
import { Table } from '../../components/ui/AdvancedUI';
import { ArrowLeft, Printer, Trash2, Calendar, FileText, Info, MapPin, Hash, Package, ShoppingCart } from 'lucide-react';
import { formatNumber } from '../../utils/formatters';

export default function TransactionDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { detail, loading, fetchDetail, deleteTransaction } = useTransaction();

  useEffect(() => {
    if (id) fetchDetail(id);
  }, [id, fetchDetail]);

  const handleDelete = async () => {
    if (window.confirm('APAKAH ANDA YAKIN INGIN MENGHAPUS TRANSAKSI INI?\nStok akan dikembalikan ke kondisi sebelumnya secara otomatis.')) {
      try {
        await deleteTransaction(id!);
        navigate('/transactions');
      } catch (err) {
        // Error handled by hook
      }
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-[12px] font-black text-blue-600 animate-pulse tracking-widest uppercase">
         MEMUAT DATA DARI SERVER STORAGE...
      </div>
    </div>
  );

  if (!detail) return (
    <div className="text-center py-20 desktop-card p-10">
      <h2 className="text-xl font-black text-red-600 uppercase">Dokumen Tidak Ditemukan</h2>
      <p className="text-[11px] font-bold text-gray-500 mt-2 italic">ID Transaksi atau Referensi mungkin telah dihapus atau dipindahkan.</p>
      <Button onClick={() => navigate('/transactions')} variant="secondary" className="mt-6 font-bold">KEMBALI KE DAFTAR</Button>
    </div>
  );

  const columns = [
    { 
      header: 'KODE BARANG', 
      render: (r: any) => <span className="font-mono font-black text-[#0054a6] text-[12px]">{r.item_code}</span>
    },
    { header: 'NAMA KOMODITAS', key: 'item_name', render: (r: any) => <span className="font-extrabold uppercase text-gray-800">{r.item_name}</span> },
    { 
      header: 'QTY', 
      render: (r: any) => (
        <span className="font-black text-[14px] text-blue-900 border-b-2 border-blue-100">{formatNumber(r.qty)}</span>
      )
    },
    { header: 'CATATAN ITEM', key: 'note', render: (r: any) => <span className="text-[11px] text-gray-500 italic">{r.note || '-'}</span> }
  ];

  return (
    <div className="space-y-4">
      {/* Header Actions */}
      <div className="flex items-center justify-between border-b border-[#999999] pb-3">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/transactions')} className="h-8 w-8 p-0 border border-[#999999]">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl font-black text-gray-900 uppercase tracking-tight">Detail Dokumen Mutasi</h1>
            <p className="text-[10px] font-bold text-gray-500 italic uppercase">Logistik Inventory System • PT KAMPUNG KALI MAJU</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="h-8 text-[11px] font-black uppercase border-[#999999] gap-1.5" onClick={() => window.print()}>
            <Printer className="h-3.5 w-3.5" /> CETAK BUKTI
          </Button>
          <Button variant="outline" onClick={handleDelete} className="h-8 text-[11px] font-black uppercase border-red-400 text-red-600 hover:bg-red-50 gap-1.5">
            <Trash2 className="h-3.5 w-3.5" /> HAPUS PERMANEN
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Main Info Section */}
        <div className="md:col-span-4 space-y-4">
           {/* Section 1: Header Info */}
           <div className="desktop-card overflow-hidden">
               <div className="desktop-header flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  SUMMARY HEADER
               </div>
               <div className="p-4 space-y-4 bg-gray-50">
                  <DetailItem icon={Calendar} label="TGL TRANSAKSI" value={new Date(detail.date).toLocaleDateString('id-ID', { dateStyle: 'long' }).toUpperCase()} />
                  <DetailItem icon={Hash} label="NO. REFERENSI" value={detail.reference_no} isBold />
                  <DetailItem icon={ShoppingCart} label="TIPE MUTASI" value={detail.type} isBadge />
                  <DetailItem icon={FileText} label="SURAT JALAN / DO" value={detail.delivery_order_no || 'N/A'} />
                  <DetailItem icon={Package} label="KONTRA PARTNER" value={detail.partner_name || 'INTERNAL TRANSFER'} />
               </div>
           </div>

           {/* Section 2: Distribution Flow */}
           <div className="desktop-card">
               <div className="desktop-header flex items-center gap-2 bg-[#555555]">
                  <MapPin className="h-4 w-4" />
                  DISTRIBUTION FLOW
               </div>
               <div className="p-4 space-y-4">
                  <div className="flex flex-col gap-1">
                     <span className="text-[10px] font-black text-gray-400 uppercase">Gudang Sumber</span>
                     <div className="px-3 py-2 bg-red-50 border-l-4 border-red-600 font-bold text-[13px] uppercase text-red-900">
                        {detail.source_warehouse_name || 'DI LUAR SISTEM'}
                     </div>
                  </div>
                  <div className="flex justify-center flex-col items-center py-1">
                     <div className="h-4 w-px bg-gray-300"></div>
                     <span className="text-[9px] font-black text-[#0054a6]">{'>>>'} TRANSFER {'>>>'}</span>
                     <div className="h-4 w-px bg-gray-300"></div>
                  </div>
                  <div className="flex flex-col gap-1">
                     <span className="text-[10px] font-black text-gray-400 uppercase">Gudang Tujuan</span>
                     <div className="px-3 py-2 bg-green-50 border-l-4 border-green-600 font-bold text-[13px] uppercase text-green-900">
                        {detail.target_warehouse_name || 'DI LUAR SISTEM'}
                     </div>
                  </div>
               </div>
           </div>
        </div>

        {/* Goods List Section */}
        <div className="md:col-span-8">
          <div className="desktop-card h-full flex flex-col">
            <div className="desktop-header">
               RINCIAN BARANG TER-INPUT
            </div>
            <div className="p-0 flex-1 border-b border-[#999999]">
               <Table columns={columns} data={detail.items || []} />
            </div>
            
            <div className="p-4 bg-gray-50 flex-none border-t border-[#999999]">
               <h3 className="text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest">Memo / Justifikasi Transaksi:</h3>
               <div className="p-3 bg-white border border-gray-200 min-h-[60px] text-[13px] font-bold text-gray-600 italic">
                 {detail.notes || '- TIDAK ADA CATATAN TAMBAHAN -'}
               </div>
            </div>

            <div className="bg-[#f0f0f0] p-2 px-4 flex justify-between items-center text-[10px] font-bold text-gray-500 uppercase tracking-widest border-t border-[#999999]">
               <span>Entry By: {detail.created_by_name || 'SYSTEM'}</span>
               <span>Audit Time: {new Date(detail.created_at).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ icon: Icon, label, value, isBold = false, isBadge = false }: any) {
  return (
    <div className="flex justify-between items-center border-b border-gray-100 pb-2">
      <div className="flex items-center gap-2">
         <Icon className="h-3 w-3 text-gray-400" />
         <span className="text-[10px] font-black text-gray-400 uppercase">{label}</span>
      </div>
      {isBadge ? (
        <span className={`px-2 py-0.5 text-[9px] font-black rounded-[1px] border ${
          value === 'IN' ? 'bg-green-100 text-green-800 border-green-200' :
          value === 'OUT' ? 'bg-red-100 text-red-800 border-red-200' :
          'bg-blue-100 text-blue-800 border-blue-200'
        }`}>
          {value}
        </span>
      ) : (
        <span className={`text-[12px] ${isBold ? 'font-black text-[#0054a6]' : 'font-bold text-gray-700'} uppercase`}>{value}</span>
      )}
    </div>
  );
}

