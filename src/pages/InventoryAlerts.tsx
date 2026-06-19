import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  Package,
  TrendingUp,
  TrendingDown,
  Filter,
  Search,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input, Select } from '../components/ui/Input';
import { generateProducts, generateInventoryAlerts } from '../data/mockData';
import type { InventoryAlert, Product } from '../types';

export const InventoryAlerts: React.FC = () => {
  const products = useMemo(() => generateProducts(), []);
  const alerts = useMemo(() => generateInventoryAlerts(products), [products]);
  const [filter, setFilter] = useState<'all' | 'critical_stock' | 'low_stock' | 'overstock'>('all');
  const [search, setSearch] = useState('');

  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      if (filter !== 'all' && alert.alertType !== filter) return false;
      if (search && !alert.productName.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [alerts, filter, search]);

  const alertStats = useMemo(() => {
    const critical = alerts.filter((a) => a.alertType === 'critical_stock').length;
    const low = alerts.filter((a) => a.alertType === 'low_stock').length;
    const overstock = alerts.filter((a) => a.alertType === 'overstock').length;
    return { critical, low, overstock, total: alerts.length };
  }, [alerts]);

  const getAlertIcon = (type: InventoryAlert['alertType']) => {
    switch (type) {
      case 'critical_stock':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'low_stock':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'overstock':
        return <Package className="w-5 h-5 text-blue-500" />;
    }
  };

  const getAlertBadge = (type: InventoryAlert['alertType']) => {
    switch (type) {
      case 'critical_stock':
        return <Badge variant="error">Critical</Badge>;
      case 'low_stock':
        return <Badge variant="warning">Low Stock</Badge>;
      case 'overstock':
        return <Badge variant="info">Overstock</Badge>;
    }
  };

  const getStockBar = (product: Product) => {
    const maxStock = 500;
    const percentage = Math.min((product.stock / maxStock) * 100, 100);
    let bgColor = 'bg-emerald-500';
    if (product.stock === 0) bgColor = 'bg-red-500';
    else if (product.stock < product.reorderLevel) bgColor = 'bg-amber-500';
    else if (product.stock > 100) bgColor = 'bg-blue-500';

    return (
      <div className="w-24 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full ${bgColor} transition-all duration-300`} style={{ width: `${percentage}%` }} />
      </div>
    );
  };

  const filterOptions = [
    { value: 'all', label: 'All Alerts' },
    { value: 'critical_stock', label: 'Critical Stock' },
    { value: 'low_stock', label: 'Low Stock' },
    { value: 'overstock', label: 'Overstock' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Smart Inventory Alerts</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Monitor and manage your inventory levels effectively
          </p>
        </div>
        <Button variant="outline">
          <TrendingUp className="w-4 h-4" />
          Export Report
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center shadow-lg shadow-red-500/20">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Critical</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {alertStats.critical}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Low Stock</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {alertStats.low}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Overstock</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {alertStats.overstock}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Healthy</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {products.length - alerts.length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-slate-400" />
              <Select
                options={filterOptions}
                value={filter}
                onChange={(e) => setFilter(e.target.value as typeof filter)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Alerts ({filteredAlerts.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Stock Level
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Reorder Level
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Recommendation
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {filteredAlerts.map((alert) => {
                  const product = products.find((p) => p.id === alert.productId)!;
                  return (
                    <tr key={alert.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {getAlertIcon(alert.alertType)}
                          <div>
                            <p className="text-sm font-medium text-slate-900 dark:text-white">
                              {alert.productName}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              SKU: {product?.sku}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">{getAlertBadge(alert.alertType)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {getStockBar(product)}
                          <span className="text-sm text-slate-700 dark:text-slate-300">
                            {alert.currentStock}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-700 dark:text-slate-300">
                          {alert.reorderLevel}
                        </span>
                      </td>
                      <td className="px-6 py-4 max-w-xs">
                        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                          {alert.recommendation}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button size="sm" variant={alert.alertType === 'critical_stock' ? 'primary' : 'outline'}>
                          {alert.alertType === 'overstock' ? 'Create Promo' : 'Reorder'}
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
