/**
 * ## src/components/ui/AutocompleteModal.tsx
 */
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Check } from 'lucide-react';
import Fuse from 'fuse.js';

interface AutocompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (item: any) => void;
  items: any[];
  title: string;
  placeholder?: string;
  searchKeys?: string[];
  displayKey?: string;
  subKey?: string;
}

export default function AutocompleteModal({
  isOpen,
  onClose,
  onSelect,
  items,
  title,
  placeholder = 'Cari data...',
  searchKeys = ['name', 'code'],
  displayKey = 'name',
  subKey = 'code'
}: AutocompleteModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery('');
      setResults(items.slice(0, 50)); // Show all or limited initial list
      setSelectedIndex(0);
    }
  }, [isOpen, items]);

  useEffect(() => {
    if (!query) {
      setResults(items.slice(0, 50));
      return;
    }

    const fuse = new Fuse(items, {
      keys: searchKeys,
      threshold: 0.3,
      distance: 100,
    });

    const searchResults = fuse.search(query).map(r => r.item);
    setResults(searchResults);
    setSelectedIndex(0);
  }, [query, items, searchKeys]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault();
      onSelect(results[selectedIndex]);
      onClose();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  useEffect(() => {
    const activeItem = listRef.current?.children[selectedIndex] as HTMLElement;
    if (activeItem) {
      activeItem.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40"
        />
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-2xl bg-white border-2 border-[#999999] shadow-2xl rounded-[2px] overflow-hidden flex flex-col max-h-[70vh]"
        >
          {/* Header */}
          <div className="bg-[#0054a6] text-white px-3 py-1.5 flex items-center justify-between font-bold text-[13px] uppercase tracking-tight">
            <div className="flex items-center gap-2">
              <Search className="h-3.5 w-3.5" />
              <span>{title}</span>
            </div>
            <button 
              onClick={onClose} 
              className="bg-red-600 border border-red-800 text-white p-0.5 hover:bg-red-700 rounded-[1px]"
            >
              <X className="h-3 w-3" />
            </button>
          </div>

          {/* Search Box */}
          <div className="p-3 bg-gray-100 border-b border-[#999999]">
            <input
              ref={inputRef}
              type="text"
              placeholder={placeholder}
              className="w-full h-9 px-3 py-2 bg-white border border-[#999999] text-[15px] font-bold focus:outline-none focus:border-[#0054a6] focus:ring-1 focus:ring-[#0054a6] shadow-inner"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <div className="mt-1 flex justify-between text-[10px] text-gray-500 font-bold uppercase">
               <span>Pencarian: "{query || 'Semua Data'}"</span>
               <span>HasiL: {results.length} records</span>
            </div>
          </div>

          {/* List Area */}
          <div ref={listRef} className="flex-1 overflow-y-auto bg-white">
            {results.length === 0 ? (
              <div className="p-10 text-center text-gray-400 italic text-[13px]">
                - Tidak ada data yang cocok -
              </div>
            ) : (
              results.map((item, index) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelect(item);
                    onClose();
                  }}
                  className={`
                    px-4 py-2 border-b border-gray-100 flex items-center justify-between cursor-pointer transition-colors
                    ${selectedIndex === index ? 'bg-[#e1f5fe] text-blue-900 border-blue-200' : 'hover:bg-gray-50'}
                    ${selectedIndex === index ? 'shadow-inner' : ''}
                  `}
                >
                  <div className="flex flex-col">
                    <span className="font-extrabold text-[13px] uppercase">{item[displayKey]}</span>
                    <span className="text-[10px] font-mono text-gray-500 tracking-tighter">ID: {item[subKey]}</span>
                  </div>
                  {selectedIndex === index && (
                    <div className="bg-[#0054a6] text-white p-0.5 rounded-[1px]">
                      <Check className="h-3 w-3" />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer Shortcuts */}
          <div className="bg-[#f0f0f0] border-t border-[#999999] px-3 py-1 flex items-center gap-4 text-[10px] font-bold text-gray-500">
             <span className="flex items-center gap-1"><kbd className="bg-white border rounded px-1 text-[9px]">ENTER</kbd> PILIH</span>
             <span className="flex items-center gap-1"><kbd className="bg-white border rounded px-1 text-[9px]">ESC</kbd> BATAL</span>
             <span className="flex items-center gap-1"><kbd className="bg-white border rounded px-1 text-[9px]">↑↓</kbd> NAVIGASI</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
