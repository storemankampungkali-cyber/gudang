/**
 * ## src/features/inventory/BulkImportModal.tsx
 */
import React, { useState, useRef } from 'react';
import { Button } from '../../components/ui/BaseUI';
import { Badge } from '../../components/ui/BaseUI';
import { Modal } from '../../components/ui/AdvancedUI';
import { useInventory } from '../../hooks/useInventory';
import { toast } from '../../hooks/useToast';
import { Upload, FileText, CheckCircle2, AlertCircle, X, Download } from 'lucide-react';
import Papa from 'papaparse';

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function BulkImportModal({ isOpen, onClose, onSuccess }: BulkImportModalProps) {
  const { bulkImport, loading } = useInventory();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [errors, setErrors] = useState<any[]>([]);
  const [importResult, setImportResult] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  const processFile = (selectedFile: File) => {
    if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
      toast.error('Harap pilih file CSV');
      return;
    }

    setFile(selectedFile);
    Papa.parse(selectedFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setPreviewData(results.data);
        setErrors([]);
        setImportResult(null);
      },
      error: (err) => {
        toast.error('Gagal memproses file: ' + err.message);
      }
    });
  };

  const handleImport = async () => {
    if (previewData.length === 0) return;
    
    try {
      const result = await bulkImport(previewData);
      setImportResult(result);
      if (result.failed === 0) {
        setTimeout(() => {
          onSuccess();
          handleClose();
        }, 2000);
      }
    } catch (err) {
      // Error handled by hook
    }
  };

  const handleClose = () => {
    setFile(null);
    setPreviewData([]);
    setErrors([]);
    setImportResult(null);
    onClose();
  };

  const downloadTemplate = () => {
    const headers = ['code', 'name', 'category', 'base_unit', 'min_stock'];
    const csvContent = "data:text/csv;charset=utf-8," + headers.join(',') + "\n" + "BRG001,Barang Contoh,Kategori A,pcs,10";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "template_import_barang.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="IMPOR DATA BARANG (CSV)" size="xl">
      <div className="space-y-4">
        {!file && !importResult && (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-[#999999] rounded-[2px] p-10 text-center hover:border-[#0054a6] hover:bg-blue-50 cursor-pointer transition-all space-y-4"
          >
            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-[2px] flex items-center justify-center text-[#0054a6] border border-[#999999]">
              <Upload className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[14px] font-extrabold text-gray-900 uppercase">Pilih File Sumber CSV</p>
              <p className="text-[11px] text-gray-500 font-bold uppercase tracking-tight">Format: code, name, category, base_unit, min_stock</p>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept=".csv" 
              className="hidden" 
            />
            <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); downloadTemplate(); }}>
              <Download className="h-3.5 w-3.5 mr-2" /> DOWNLOAD TEMPLATE (.CSV)
            </Button>
          </div>
        )}

        {file && !importResult && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-100 rounded-[2px] border border-[#999999]">
              <div className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-[#0054a6]" />
                <div>
                  <p className="font-bold text-[13px] text-gray-900 uppercase">{file.name}</p>
                  <p className="text-[10px] text-gray-500 font-bold italic tracking-tighter">
                    SIZE: {(file.size / 1024).toFixed(2)} KB | RECORDS: {previewData.length}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => { setFile(null); setPreviewData([]); }} className="h-6 w-6 p-0 border-[#cc0000] text-[#cc0000]">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="desktop-card overflow-hidden">
              <div className="desktop-header text-[10px]">
                PREVIEW DATA TRANSMISI (MAX 5 BARIS)
              </div>
              <table className="w-full text-[12px] text-left border-collapse">
                <thead className="bg-[#f0f0f0] border-b border-[#999999]">
                  <tr>
                    <th className="px-2 py-1 font-bold text-gray-700 border-r border-[#999999]">CODE</th>
                    <th className="px-2 py-1 font-bold text-gray-700 border-r border-[#999999]">NAME</th>
                    <th className="px-2 py-1 font-bold text-gray-700 border-r border-[#999999]">UNIT</th>
                    <th className="px-2 py-1 font-bold text-gray-700">STOK MIN</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {previewData.slice(0, 5).map((row, i) => (
                    <tr key={i} className="hover:bg-blue-50/50">
                      <td className="px-2 py-1 font-mono font-bold text-blue-900 border-r border-gray-100">{row.code}</td>
                      <td className="px-2 py-1 border-r border-gray-100">{row.name}</td>
                      <td className="px-2 py-1 border-r border-gray-100">{row.base_unit}</td>
                      <td className="px-2 py-1 text-right italic font-bold">{row.min_stock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end gap-2 border-t border-[#999999] pt-4">
              <Button variant="secondary" size="md" onClick={handleClose}>BATAL</Button>
              <Button size="md" onClick={handleImport} isLoading={loading} className="gap-2">
                <CheckCircle2 className="h-4 w-4" /> PROSES IMPOR SEKARANG
              </Button>
            </div>
          </div>
        )}

        {importResult && (
          <div className="space-y-4 text-center py-4">
            <div className={`mx-auto w-14 h-14 rounded-[2px] flex items-center justify-center border-2 ${importResult.failed === 0 ? 'bg-green-50 border-green-500 text-green-600' : 'bg-orange-50 border-orange-500 text-orange-600'}`}>
              {importResult.failed === 0 ? <CheckCircle2 className="h-8 w-8" /> : <AlertCircle className="h-8 w-8" />}
            </div>
            
            <div className="space-y-2">
              <h3 className="text-[16px] font-extrabold text-gray-900 uppercase">Laporan Hasil Impor</h3>
              <div className="flex justify-center gap-2">
                <div className="bg-green-50 px-4 py-2 border border-green-300 min-w-[100px]">
                  <p className="text-2xl font-black text-green-700">{importResult.success}</p>
                  <p className="text-[9px] text-green-700 uppercase font-black tracking-widest">BERHASIL</p>
                </div>
                <div className="bg-red-50 px-4 py-2 border border-red-300 min-w-[100px]">
                  <p className="text-2xl font-black text-red-700">{importResult.failed}</p>
                  <p className="text-[9px] text-red-700 uppercase font-black tracking-widest">GAGAL</p>
                </div>
              </div>
            </div>

            {importResult.errors.length > 0 && (
              <div className="mt-4 text-left border border-[#cc0000] rounded-[2px] overflow-hidden">
                <div className="bg-[#cc0000] px-2 py-1 font-bold text-white text-[11px] uppercase flex items-center">
                  <AlertCircle className="h-3.5 w-3.5 mr-2" />
                  DAFTAR LOG KESALAHAN ({importResult.errors.length})
                </div>
                <div className="max-h-32 overflow-y-auto p-2 space-y-1 bg-white font-mono text-[11px]">
                  {importResult.errors.map((err: any, i: number) => (
                    <div key={i} className="p-1 border-b border-gray-100 last:border-0 flex gap-2">
                      <span className="font-bold text-[#cc0000] shrink-0">LINE {err.row}:</span> 
                      <span className="text-gray-600">{err.error}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-center mt-6 border-t border-[#999999] pt-4">
              <Button size="md" onClick={handleClose}>TUTUP JENDELA</Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
