import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import CorsTest from './CorsTest';
import { Toaster } from 'react-hot-toast';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import VoiceGenerate from '@/pages/VoiceGenerate';
import VoiceClone from '@/pages/VoiceClone';
import TextMail from '@/pages/TextMail';



import TextTranslate from '@/pages/TextTranslate'; // Reverted to default import
import Profile from '@/pages/Profile'; // Reverted to default import
import Settings from '@/pages/Settings';
import AdminDashboard from '@/pages/AdminDashboard'; // Reverted to default import
import Pricing from '@/pages/Pricing'; // Reverted to default import

import TransactionsHistory from '@/pages/TransactionsHistory'; // Reverted to default import
import GenerationHistory from '@/pages/GenerationHistory'; // Reverted to default import
import AdminTransactions from '@/pages/admin/Transactions';

// Legal Pages (Named exports)
import { Terms } from '@/pages/legal/Terms';
import { Privacy } from '@/pages/legal/Privacy';
import { Refund } from '@/pages/legal/Refund';
import { Disclaimer } from '@/pages/legal/Disclaimer';


function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (!isAdmin) return <Navigate to="/dashboard" />;
  return children;
}

function GuestRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  return isAuthenticated ? <Navigate to="/dashboard" /> : children;
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-screen">
          <main className="flex-grow">
            <CorsTest />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
              <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
              <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/generate" element={<PrivateRoute><VoiceGenerate /></PrivateRoute>} />
              <Route path="/clone" element={<PrivateRoute><VoiceClone /></PrivateRoute>} />
              <Route path="/translate" element={<PrivateRoute><TextTranslate /></PrivateRoute>} />
              <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
              <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
              <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/admin/transactions" element={<AdminRoute><AdminTransactions /></AdminRoute>} />
              <Route path="/pricing" element={<PrivateRoute><Pricing /></PrivateRoute>} />
              <Route path="/history" element={<PrivateRoute><TransactionsHistory /></PrivateRoute>} />
              <Route path="/generation-history" element={<PrivateRoute><GenerationHistory /></PrivateRoute>} />
              <Route path="/textmail" element={<TextMail />} />

              {/* Legal Routes */}
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/refund" element={<Refund />} />
              <Route path="/disclaimer" element={<Disclaimer />} />

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          <Footer />
      </div>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <AppRoutes />
        <Toaster position="top-right" toastOptions={{ className: 'glass border border-white/10', style: { background: 'hsl(222.2 84% 4.9%)', color: 'hsl(210 40% 98%)' }}} />
      </AuthProvider>
    </BrowserRouter>
  );
}
