/**
 * ## src/components/ui/Modal.tsx
 */
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { Button } from './BaseUI';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal = ({ isOpen, onClose, title, children, size = 'md' }: ModalProps) => {
  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/30"
          />
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className={`relative w-full rounded-[2px] border-2 border-[#999999] bg-[#f0f0f0] shadow-2xl ${sizes[size]} overflow-hidden`}
          >
            <div className="flex items-center justify-between bg-[#0054a6] px-3 py-1.5 border-b border-[#003d7c]">
              <h3 className="text-[13px] font-bold text-white uppercase tracking-tight">{title}</h3>
              <button 
                onClick={onClose} 
                className="bg-red-600 border border-red-800 text-white p-0.5 hover:bg-red-700 transition-colors rounded-[1px]"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
            <div className="max-h-[85vh] overflow-y-auto p-4 bg-white">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

/**
 * ## src/components/ui/ToastContainer.tsx
 */
import { useToast } from '../../hooks/useToast';

export const ToastContainer = () => {
  const toasts = useToast();

  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };

  const bgColors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200'
  };

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div
            key={t.id}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            className={`flex min-w-[200px] items-center gap-3 rounded-lg border px-4 py-3 shadow-lg ${bgColors[t.type]}`}
          >
            <span className="text-lg">{icons[t.type]}</span>
            <p className="text-sm font-medium text-gray-800">{t.message}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

/**
 * ## src/components/ui/Table.tsx
 */
export const Table = ({ columns, data, isLoading }: { columns: any[]; data: any[]; isLoading?: boolean }) => {
  return (
    <div className="w-full overflow-x-auto border border-[#999999] bg-white shadow-sm">
      <table className="w-full text-left text-[12px] border-collapse">
        <thead className="bg-[#f0f0f0] border-b border-[#999999]">
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className="px-3 py-1.5 font-bold text-gray-700 bg-gradient-to-b from-white to-[#e0e0e0] border-r border-[#999999] last:border-r-0 uppercase tracking-tighter">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#d1d5db]">
          {isLoading ? (
            [1, 2, 3, 4, 5].map(i => (
              <tr key={i} className="animate-pulse">
                {columns.map((_, idx) => (
                  <td key={idx} className="px-3 py-1.5 border-r border-[#eeeeee] last:border-r-0">
                    <div className="h-3 bg-gray-100 rounded-[1px]"></div>
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-3 py-8 text-center text-gray-400 italic">
                - Tidak ada data -
              </td>
            </tr>
          ) : (
            data.map((row, rowIdx) => (
              <tr key={rowIdx} className="hover:bg-[#e1f5fe]/50 transition-colors odd:bg-white even:bg-[#fafafa]">
                {columns.map((col, colIdx) => (
                  <td key={colIdx} className="px-3 py-1.5 border-r border-[#eeeeee] last:border-r-0 text-gray-800">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
