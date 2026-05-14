/**
 * ## src/hooks/useToast.ts
 */
import { useState, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

let toastId = 0;
let observers: ((toasts: Toast[]) => void)[] = [];
let toasts: Toast[] = [];

const notify = () => observers.forEach(fn => fn([...toasts]));

export const toast = {
  show: (message: string, type: ToastType = 'info') => {
    const id = ++toastId;
    toasts.push({ id, message, type });
    notify();
    setTimeout(() => {
      toasts = toasts.filter(t => t.id !== id);
      notify();
    }, 3000);
  },
  success: (msg: string) => toast.show(msg, 'success'),
  error: (msg: string) => toast.show(msg, 'error'),
  warning: (msg: string) => toast.show(msg, 'warning'),
  info: (msg: string) => toast.show(msg, 'info')
};

export const useToast = () => {
  const [currentToasts, setCurrentToasts] = useState<Toast[]>(toasts);

  useCallback((newToasts: Toast[]) => {
    setCurrentToasts(newToasts);
  }, []);

  // Simple observer pattern
  useState(() => {
    observers.push(setCurrentToasts);
    return () => {
      observers = observers.filter(fn => fn !== setCurrentToasts);
    };
  });

  return currentToasts;
};
