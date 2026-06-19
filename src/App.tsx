import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Layout, AuthLayout } from './components/layout/Layout';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { Dashboard } from './pages/Dashboard';
import { ProductGenerator } from './pages/ProductGenerator';
import { DemandForecast } from './pages/DemandForecast';
import { InventoryAlerts } from './pages/InventoryAlerts';
import { ReviewAnalyzer } from './pages/ReviewAnalyzer';
import { PricingEngine } from './pages/PricingEngine';
import { SalesAnalytics } from './pages/SalesAnalytics';
import { TrendingProducts } from './pages/TrendingProducts';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1e293b',
                color: '#fff',
                borderRadius: '12px',
                padding: '12px 16px',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
          <Routes>
            {/* Auth Routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>

            {/* Protected Routes */}
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/product-generator" element={<ProductGenerator />} />
              <Route path="/demand-forecast" element={<DemandForecast />} />
              <Route path="/inventory" element={<InventoryAlerts />} />
              <Route path="/reviews" element={<ReviewAnalyzer />} />
              <Route path="/pricing" element={<PricingEngine />} />
              <Route path="/analytics" element={<SalesAnalytics />} />
              <Route path="/trending" element={<TrendingProducts />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
