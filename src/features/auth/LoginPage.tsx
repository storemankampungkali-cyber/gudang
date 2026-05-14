/**
 * ## src/features/auth/LoginPage.tsx
 */
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Button, Input } from '../../components/ui/BaseUI';
import { Lock, User } from 'lucide-react';
import { motion } from 'motion/react';

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login({ username, password });
    } catch (err) {
      // Error handled by hook toast
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse delay-700"></div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl relative z-10 border border-gray-100"
      >
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg mb-4">G</div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">GudangPro</h1>
          <p className="text-gray-500 mt-2">Inventory Management Enterprise System</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <User className="absolute left-3 top-9 h-5 w-5 text-gray-400 z-10" />
            <Input
              label="Username"
              placeholder="Masukkan username"
              className="pl-10"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-9 h-5 w-5 text-gray-400 z-10" />
            <Input
              label="Password"
              type="password"
              placeholder="Masukkan password"
              className="pl-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full py-6 text-lg" isLoading={isLoading}>
            Masuk ke Dashboard
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Lupa password? Hubungi Admin</p>
        </div>
      </motion.div>
    </div>
  );
}
