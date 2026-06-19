import React, { useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  DollarSign,
  ShoppingCart,
  Package,
  ArrowUpRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { generateProducts, generateSales, generateSalesData } from '../data/mockData';
import type { Product } from '../types';

export const SalesAnalytics: React.FC = () => {
  const products = useMemo(() => generateProducts(), []);
  const sales = useMemo(() => generateSales(products), [products]);
  const monthlyData = useMemo(() => generateSalesData(), []);

  // Calculate top products
  const topProducts = useMemo(() => {
    const productSales: Record<string, { name: string; count: number; revenue: number; profit: number }> = {};
    sales.forEach((sale) => {
      if (!productSales[sale.productId]) {
        const product = products.find((p) => p.id === sale.productId)!;
        productSales[sale.productId] = {
          name: sale.productName,
          count: 0,
          revenue: 0,
          profit: 0,
        };
      }
      productSales[sale.productId].count += sale.quantity;
      productSales[sale.productId].revenue += sale.totalAmount;
      productSales[sale.productId].profit += sale.profit;
    });

    return Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10)
      .map((p, idx) => ({ ...p, rank: idx + 1 }));
  }, [sales, products]);

  // Channel distribution
  const channelData = useMemo(() => {
    const channels: Record<string, number> = {};
    sales.forEach((sale) => {
      channels[sale.channel] = (channels[sale.channel] || 0) + sale.totalAmount;
    });
    return Object.entries(channels).map(([name, value]) => ({
      name,
      value,
      fill:
        name === 'Website'
          ? '#3b82f6'
          : name === 'Mobile App'
            ? '#06b6d4'
            : name === 'Marketplace'
              ? '#f59e0b'
              : '#8b5cf6',
    }));
  }, [sales]);

  // Category performance
  const categoryData = useMemo(() => {
    const categories: Record<string, { count: number; revenue: number }> = {};
    sales.forEach((sale) => {
      const product = products.find((p) => p.id === sale.productId);
      if (product) {
        if (!categories[product.category]) {
          categories[product.category] = { count: 0, revenue: 0 };
        }
        categories[product.category].count += sale.quantity;
        categories[product.category].revenue += sale.totalAmount;
      }
    });
    return Object.entries(categories)
      .map(([name, data]) => ({
        name: name.substring(0, 3),
        fullName: name,
        ...data,
      }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [sales, products]);

  // Stats
  const totalRevenue = sales.reduce((sum, s) => sum + s.totalAmount, 0);
  const totalProfit = sales.reduce((sum, s) => sum + s.profit, 0);
  const avgOrderValue = totalRevenue / sales.length;
  const growthRate = 18.5;

  const COLORS = ['#3b82f6', '#06b6d4', '#f59e0b', '#8b5cf6', '#10b981', '#ef4444'];

  const handleExport = () => {
    const csvContent = [
      'Product,Quantity Sold,Revenue,Profit',
      ...topProducts.map((p) => `${p.name},${p.count},${p.revenue.toFixed(2)},${p.profit.toFixed(2)}`),
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sales_report.csv';
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Sales Analytics</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Comprehensive view of your sales performance
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Revenue</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                ${(totalRevenue / 1000).toFixed(1)}K
              </p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                <span className="text-sm text-emerald-500">+{growthRate}%</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Orders</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {sales.length.toLocaleString()}
              </p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                <span className="text-sm text-emerald-500">+12.3%</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Profit</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                ${(totalProfit / 1000).toFixed(1)}K
              </p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                <span className="text-sm text-emerald-500">+22.1%</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Avg Order Value</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                ${avgOrderValue.toFixed(2)}
              </p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingDown className="w-4 h-4 text-red-500" />
                <span className="text-sm text-red-500">-2.4%</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Revenue & Profit Trend</CardTitle>
              <Badge variant="success">{growthRate}% Growth</Badge>
            </div>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorRevenue2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
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
                  formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRevenue2)"
                />
                <Area
                  type="monotone"
                  dataKey="profit"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorProfit)"
                />
                <Legend />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Orders Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Orders Trend</CardTitle>
              <div className="flex gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-500 dark:text-slate-400">Last 8 months</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
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
                <Bar dataKey="orders" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Channel Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Sales by Channel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={channelData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    dataKey="value"
                  >
                    {channelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: 'none',
                      borderRadius: '12px',
                      color: '#fff',
                    }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {channelData.map((channel) => (
                <div key={channel.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: channel.fill }} />
                  <span className="text-xs text-slate-600 dark:text-slate-400">{channel.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Category Performance */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Category Performance</CardTitle>
          </CardHeader>
          <CardContent className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `$${v / 1000}k`} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={12} width={40} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                  }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Products Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Best-Selling Products</CardTitle>
            <Button variant="ghost" size="sm">
              View All
              <ArrowUpRight className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Units Sold
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Profit
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Margin
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {topProducts.map((product) => (
                  <tr key={product.rank} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-lg ${
                          product.rank === 1
                            ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                            : product.rank === 2
                              ? 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                              : product.rank === 3
                                ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
                                : 'bg-slate-50 dark:bg-slate-800 text-slate-500'
                        }`}
                      >
                        {product.rank}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-slate-900 dark:text-white max-w-xs truncate">
                        {product.name}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm text-slate-700 dark:text-slate-300">{product.count}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-medium text-slate-900 dark:text-white">
                        ${product.revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm text-emerald-600 dark:text-emerald-400">
                        ${product.profit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Badge
                        variant={
                          (product.profit / product.revenue) * 100 > 30
                            ? 'success'
                            : (product.profit / product.revenue) * 100 > 15
                              ? 'neutral'
                              : 'warning'
                        }
                      >
                        {((product.profit / product.revenue) * 100).toFixed(0)}%
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
