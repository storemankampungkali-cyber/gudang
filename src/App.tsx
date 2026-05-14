/**
 * ## src/App.tsx
 */
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './store/AuthContext';
import { useAuth } from './hooks/useAuth';
import LoginPage from './features/auth/LoginPage';
import DashboardView from './features/dashboard/DashboardView';
import InventoryView from './features/inventory/InventoryView';
import TransactionList from './features/transactions/TransactionList';
import TransactionForm from './features/transactions/TransactionForm';
import TransactionDetail from './features/transactions/TransactionDetail';
import WarehouseView from './features/master/WarehouseView';
import PartnerView from './features/master/PartnerView';
import ReportsView from './features/reports/ReportsView';
import RejectView from './features/reject/RejectView';
import RejectForm from './features/reject/RejectForm';
import SettingsView from './features/settings/SettingsView';
import { AppShell } from './components/layout/Layout';
import { Loader2 } from 'lucide-react';

const PrivateRoute = ({ children, roles }: { children: React.ReactNode; roles?: string[] }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50">
      <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
      <p className="text-gray-500 font-medium">Memuat GudangPro...</p>
    </div>
  );

  if (!isAuthenticated) return <Navigate to="/login" />;

  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <AppShell>
      {children}
    </AppShell>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          <Route path="/dashboard" element={<PrivateRoute><DashboardView /></PrivateRoute>} />
          <Route path="/inventory" element={<PrivateRoute><InventoryView /></PrivateRoute>} />
          <Route path="/transactions" element={<PrivateRoute><TransactionList /></PrivateRoute>} />
          <Route path="/transactions/new" element={<PrivateRoute><TransactionForm /></PrivateRoute>} />
          <Route path="/transactions/:id" element={<PrivateRoute><TransactionDetail /></PrivateRoute>} />
          <Route path="/warehouses" element={<PrivateRoute roles={['ADMIN', 'MANAGER']}><WarehouseView /></PrivateRoute>} />
          <Route path="/partners" element={<PrivateRoute><PartnerView /></PrivateRoute>} />
          <Route path="/reject" element={<PrivateRoute><RejectView /></PrivateRoute>} />
          <Route path="/reject/new" element={<PrivateRoute><RejectForm /></PrivateRoute>} />
          <Route path="/reports" element={<PrivateRoute roles={['ADMIN', 'MANAGER']}><ReportsView /></PrivateRoute>} />
          
          <Route path="/settings" element={<PrivateRoute><SettingsView /></PrivateRoute>} />
          <Route path="/settings/users" element={<PrivateRoute roles={['ADMIN']}><SettingsView /></PrivateRoute>} />

          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

