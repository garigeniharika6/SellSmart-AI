import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Sparkles,
  LineChart,
  AlertTriangle,
  MessageSquareText,
  DollarSign,
  BarChart3,
  TrendingUp,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Brain,
  Store,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/product-generator', label: 'AI Description', icon: Sparkles },
  { path: '/demand-forecast', label: 'Demand Forecasting', icon: LineChart },
  { path: '/inventory', label: 'Smart Inventory', icon: AlertTriangle },
  { path: '/reviews', label: 'Review Analyzer', icon: MessageSquareText },
  { path: '/pricing', label: 'Pricing Engine', icon: DollarSign },
  { path: '/analytics', label: 'Sales Analytics', icon: BarChart3 },
  { path: '/trending', label: 'Trending Products', icon: TrendingUp },
];

export const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <aside
      className={`
        fixed left-0 top-0 h-screen z-40
        flex flex-col
        bg-white/80 dark:bg-slate-900/90 backdrop-blur-xl
        border-r border-slate-200 dark:border-slate-800
        transition-all duration-300 ease-in-out
        ${collapsed ? 'w-20' : 'w-64'}
      `}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/25">
          <Brain className="w-6 h-6 text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              SellSmart AI
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              Intelligent Seller Platform
            </p>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-8 w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-3 h-3" />
          ) : (
            <ChevronLeft className="w-3 h-3" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-xl
                    transition-all duration-200
                    ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600/10 to-cyan-500/10 text-blue-600 dark:text-blue-400 font-medium border border-blue-200/50 dark:border-blue-800/50'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                    }
                  `}
                >
                  <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-blue-600 dark:text-blue-400' : ''}`} />
                  {!collapsed && <span className="text-sm">{item.label}</span>}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User section */}
      <div className="px-3 py-4 border-t border-slate-200 dark:border-slate-800">
        {collapsed ? (
          <div className="flex justify-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white font-semibold">
              {user?.name?.charAt(0) || <Store className="w-5 h-5" />}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white font-semibold">
              {user?.name?.charAt(0) || <Store className="w-5 h-5" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                {user?.name || 'Guest'}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {user?.email || 'Not logged in'}
              </p>
            </div>
          </div>
        )}

        <div className={`mt-3 ${collapsed ? 'flex justify-center' : ''}`}>
          <button
            onClick={logout}
            className={`
              flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors
              ${collapsed ? 'p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800' : 'px-2 py-1'}
            `}
          >
            <LogOut className="w-4 h-4" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};
