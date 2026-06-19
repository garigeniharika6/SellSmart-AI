import React, { useMemo, useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Flame,
  Target,
  DollarSign,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input, Select } from '../components/ui/Input';
import { generateTrendingProducts } from '../data/mockData';
import type { TrendingProduct } from '../types';

export const TrendingProducts: React.FC = () => {
  const trendingProducts = useMemo(() => generateTrendingProducts(), []);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const categories = useMemo(() => {
    const cats = new Set(trendingProducts.map((p) => p.category));
    return ['all', ...Array.from(cats)];
  }, [trendingProducts]);

  const filteredProducts = useMemo(() => {
    return trendingProducts.filter((product) => {
      if (search && !product.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (categoryFilter !== 'all' && product.category !== categoryFilter) return false;
      return true;
    });
  }, [trendingProducts, search, categoryFilter]);

  // Category distribution
  const categoryData = useMemo(() => {
    const distribution: Record<string, number> = {};
    filteredProducts.forEach((p) => {
      distribution[p.category] = (distribution[p.category] || 0) + 1;
    });
    return Object.entries(distribution).map(([name, value]) => ({ name, value }));
  }, [filteredProducts]);

  // Opportunity score distribution
  const opportunityData = useMemo(() => {
    const high = filteredProducts.filter((p) => p.opportunityScore >= 80).length;
    const medium = filteredProducts.filter((p) => p.opportunityScore >= 50 && p.opportunityScore < 80).length;
    const low = filteredProducts.filter((p) => p.opportunityScore < 50).length;
    return [
      { name: 'High (>80)', value: high, fill: '#10b981' },
      { name: 'Medium (50-80)', value: medium, fill: '#f59e0b' },
      { name: 'Low (<50)', value: low, fill: '#ef4444' },
    ];
  }, [filteredProducts]);

  const COLORS = ['#3b82f6', '#06b6d4', '#f59e0b', '#8b5cf6', '#10b981', '#ef4444', '#ec4899', '#14b8a6'];

  const getTrendIcon = (trend: TrendingProduct['trend']) => {
    switch (trend) {
      case 'rising':
        return <ArrowUpRight className="w-4 h-4 text-emerald-500" />;
      case 'declining':
        return <ArrowDownRight className="w-4 h-4 text-red-500" />;
      default:
        return <div className="w-4 h-0.5 bg-slate-400" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 60) return 'text-amber-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Trending Products</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Discover high-opportunity products and market trends
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-blue-600 to-cyan-500 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Trending Products</p>
              <p className="text-3xl font-bold mt-1">{trendingProducts.length}</p>
            </div>
            <Flame className="w-8 h-8 opacity-80" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">High Opportunity</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {trendingProducts.filter((p) => p.opportunityScore >= 80).length}
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <Target className="w-5 h-5 text-emerald-500" />
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Rising Trends</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {trendingProducts.filter((p) => p.trend === 'rising').length}
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-500" />
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Avg. Price</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                ${(trendingProducts.reduce((sum, p) => sum + p.avgPrice, 0) / trendingProducts.length).toFixed(0)}
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-amber-500" />
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
                  placeholder="Search trending products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-slate-400" />
              <Select
                options={categories.map((c) => ({ value: c, label: c === 'all' ? 'All Categories' : c }))}
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Products by Category</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" stroke="#94a3b8" fontSize={12} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={12} width={100} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]}>
                  {categoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Opportunity Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Opportunity Score Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={opportunityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {opportunityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              {opportunityData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }} />
                  <span className="text-xs text-slate-600 dark:text-slate-400">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((product) => (
          <Card key={product.id} hover className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white truncate">
                  {product.name}
                </h3>
                <Badge variant="neutral" size="sm" className="mt-1">
                  {product.category}
                </Badge>
              </div>
              {getTrendIcon(product.trend)}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <p className="text-xs text-slate-500 dark:text-slate-400">Demand Score</p>
                <p className={`text-xl font-bold ${getScoreColor(product.demandScore)} mt-1`}>
                  {product.demandScore.toFixed(0)}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <p className="text-xs text-slate-500 dark:text-slate-400">Opp. Score</p>
                <p className={`text-xl font-bold ${getScoreColor(product.opportunityScore)} mt-1`}>
                  {product.opportunityScore.toFixed(0)}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div>
                <span className="text-slate-500 dark:text-slate-400">Avg. Price: </span>
                <span className="font-medium text-slate-900 dark:text-white">
                  ${product.avgPrice.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center gap-1">
                {product.growthRate >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
                <span
                  className={`font-medium ${
                    product.growthRate >= 0 ? 'text-emerald-500' : 'text-red-500'
                  }`}
                >
                  {product.growthRate >= 0 ? '+' : ''}{product.growthRate.toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
              <Button variant="outline" size="sm" className="w-full">
                <Sparkles className="w-4 h-4" />
                Analyze Opportunity
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
