import React, { useMemo } from 'react';
import {
  DollarSign,
  ShoppingCart,
  Package,
  Smile,
  TrendingUp,
  TrendingDown,
  Activity as ActivityIcon,
  Zap,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import {
  generateProducts,
  generateSales,
  generateReviews,
  generateActivities,
  calculateDashboardStats,
  generateSalesData,
} from '../data/mockData';
import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const products = useMemo(() => generateProducts(), []);
  const sales = useMemo(() => generateSales(products), [products]);
  const reviews = useMemo(() => generateReviews(products), [products]);
  const activities = useMemo(() => generateActivities(sales, reviews), [sales, reviews]);
  const stats = useMemo(() => calculateDashboardStats(sales, reviews, products), [sales, reviews, products]);
  const salesData = useMemo(() => generateSalesData(), []);

  const statCards = [
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      change: stats.revenueChange,
      icon: DollarSign,
      gradient: 'from-emerald-500 to-teal-500',
      shadowColor: 'emerald',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders.toLocaleString(),
      change: stats.ordersChange,
      icon: ShoppingCart,
      gradient: 'from-blue-500 to-cyan-500',
      shadowColor: 'blue',
    },
    {
      title: 'Inventory Health',
      value: `${stats.inventoryHealth.toFixed(0)}%`,
      change: 5.2,
      icon: Package,
      gradient: 'from-amber-500 to-orange-500',
      shadowColor: 'amber',
    },
    {
      title: 'Customer Satisfaction',
      value: `${stats.customerSatisfaction.toFixed(0)}%`,
      change: stats.satisfactionChange,
      icon: Smile,
      gradient: 'from-rose-500 to-pink-500',
      shadowColor: 'rose',
    },
  ];

  const quickActions = [
    { label: 'AI Description', icon: Zap, path: '/product-generator', color: 'text-blue-500' },
    { label: 'Forecast', icon: TrendingUp, iconAlt: TrendingDown, path: '/demand-forecast', color: 'text-emerald-500' },
    { label: 'Inventory', icon: AlertTriangle, path: '/inventory', color: 'text-amber-500' },
    { label: 'Reviews', icon: FileText, path: '/reviews', color: 'text-rose-500' },
  ];

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Welcome back! Here's your business overview.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Export Report
          </Button>
          <Button size="sm">+ Add Product</Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title} hover className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{stat.title}</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {stat.value}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  {stat.change >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      stat.change >= 0 ? 'text-emerald-500' : 'text-red-500'
                    }`}
                  >
                    {stat.change >= 0 ? '+' : ''}{stat.change.toFixed(1)}%
                  </span>
                  <span className="text-xs text-slate-400">vs last month</span>
                </div>
              </div>
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}
                style={{ boxShadow: `0 10px 25px -5px rgba(var(--${stat.shadowColor}-500), 0.3)` }}
              >
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Revenue Trend</CardTitle>
              <div className="flex gap-2">
                <Badge variant="success">+15.2%</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                  }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Sales Trend */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Sales Trend</CardTitle>
              <div className="flex gap-2">
                <Badge variant="info">Orders</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  dot={{ fill: '#06b6d4', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Activity</CardTitle>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.slice(0, 5).map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                    <ActivityIcon className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                      {activity.title}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {activity.description}
                    </p>
                  </div>
                  <span className="text-xs text-slate-400 flex-shrink-0">
                    {formatTime(activity.timestamp)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => navigate(action.path)}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg transition-all duration-200 group"
                >
                  <action.icon className={`w-6 h-6 ${action.color} mb-2 group-hover:scale-110 transition-transform`} />
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {action.label}
                  </p>
                </button>
              ))}
            </div>

            {/* AI Health Score */}
            <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-100 dark:border-blue-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">AI Health Score</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">87/100</p>
                </div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
                Your store is performing well! Consider reviewing your pricing strategy.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
