import React, { useState, useMemo } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Calculator, Target, Percent } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { generateProducts, calculatePricingRecommendation } from '../data/mockData';
import toast from 'react-hot-toast';

const demandLevels = [
  { value: '', label: 'Select demand level' },
  { value: 'low', label: 'Low Demand' },
  { value: 'medium', label: 'Medium Demand' },
  { value: 'high', label: 'High Demand' },
];

export const PricingEngine: React.FC = () => {
  const products = useMemo(() => generateProducts(), []);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [costPrice, setCostPrice] = useState('');
  const [competitorPrice, setCompetitorPrice] = useState('');
  const [demandLevel, setDemandLevel] = useState<'low' | 'medium' | 'high' | ''>('');
  const [result, setResult] = useState<{
    recommendedPrice: number;
    profitMargin: number;
    strategy: string;
  } | null>(null);

  const handleProductSelect = (productId: string) => {
    setSelectedProduct(productId);
    const product = products.find((p) => p.id === productId);
    if (product) {
      setCostPrice(product.costPrice.toString());
      setCompetitorPrice((product.price * 1.1).toFixed(2));
    }
  };

  const handleCalculate = () => {
    const cost = parseFloat(costPrice);
    const competitor = parseFloat(competitorPrice);

    if (!cost || !competitor || !demandLevel) {
      toast.error('Please fill in all fields');
      return;
    }

    if (cost <= 0 || competitor <= 0) {
      toast.error('Prices must be greater than zero');
      return;
    }

    const recommendation = calculatePricingRecommendation(cost, competitor, demandLevel);
    setResult(recommendation);
    toast.success('Pricing recommendation generated!');
  };

  const selectedProductData = products.find((p) => p.id === selectedProduct);

  const priceComparisonData = useMemo(() => {
    if (!costPrice || !competitorPrice || !result) return [];
    return [
      { name: 'Cost Price', value: parseFloat(costPrice), color: '#94a3b8' },
      { name: 'Competitor', value: parseFloat(competitorPrice), color: '#f59e0b' },
      { name: 'Recommended', value: result.recommendedPrice, color: '#3b82f6' },
    ];
  }, [costPrice, competitorPrice, result]);

  const marginData = useMemo(() => {
    if (!result) return [];
    const base = 100;
    const profit = result.recommendedPrice - parseFloat(costPrice || '0');
    return [
      { name: 'Cost', value: parseFloat(costPrice || '0') / result.recommendedPrice * 100, fill: '#ef4444' },
      { name: 'Profit', value: (profit / result.recommendedPrice) * 100, fill: '#10b981' },
    ];
  }, [costPrice, result]);

  const productOptions = [
    { value: '', label: 'Select a product' },
    ...products.map((p) => ({ value: p.id, label: p.name })),
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 mb-4 shadow-lg shadow-emerald-500/25">
          <DollarSign className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Pricing Recommendation Engine</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Get AI-powered pricing suggestions to maximize your profit margins
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing Inputs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select
              label="Select Product (optional)"
              options={productOptions}
              value={selectedProduct}
              onChange={(e) => handleProductSelect(e.target.value)}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Cost Price ($)"
                type="number"
                placeholder="0.00"
                value={costPrice}
                onChange={(e) => setCostPrice(e.target.value)}
              />
              <Input
                label="Competitor Price ($)"
                type="number"
                placeholder="0.00"
                value={competitorPrice}
                onChange={(e) => setCompetitorPrice(e.target.value)}
              />
            </div>

            <Select
              label="Demand Level"
              options={demandLevels}
              value={demandLevel}
              onChange={(e) => setDemandLevel(e.target.value as typeof demandLevel)}
            />

            <div className="pt-4">
              <Button onClick={handleCalculate} className="w-full" size="lg">
                <Calculator className="w-4 h-4" />
                Calculate Price
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          {result ? (
            <>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recommendation</CardTitle>
                  {demandLevel === 'high' ? (
                    <Badge variant="success">High Demand</Badge>
                  ) : demandLevel === 'low' ? (
                    <Badge variant="warning">Low Demand</Badge>
                  ) : (
                    <Badge variant="info">Medium Demand</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Recommended Price */}
                <div className="p-6 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                  <p className="text-sm opacity-90">Recommended Selling Price</p>
                  <p className="text-4xl font-bold mt-2">${result.recommendedPrice.toFixed(2)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Percent className="w-4 h-4" />
                    <span className="text-sm">{result.profitMargin.toFixed(1)}% profit margin</span>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-center">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Cost</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">
                      ${parseFloat(costPrice || '0').toFixed(2)}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-center">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Profit</p>
                    <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                      ${(result.recommendedPrice - parseFloat(costPrice || '0')).toFixed(2)}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-center">
                    <p className="text-xs text-slate-500 dark:text-slate-400">vs Competitor</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">
                      {result.recommendedPrice < parseFloat(competitorPrice || '0') ? (
                        <span className="text-emerald-500">
                          {(parseFloat(competitorPrice || '0') - result.recommendedPrice).toFixed(2)} less
                        </span>
                      ) : (
                        <span className="text-amber-500">
                          {(result.recommendedPrice - parseFloat(competitorPrice || '0')).toFixed(2)} more
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Strategy */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-5 h-5 text-blue-500" />
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      Pricing Strategy
                    </p>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{result.strategy}</p>
                </div>
              </CardContent>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-12">
              <DollarSign className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-4" />
              <p className="text-slate-500 dark:text-slate-400 text-center">
                Enter pricing details and click calculate to see recommendations
              </p>
            </div>
          )}
        </Card>
      </div>

      {/* Charts */}
      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Price Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Price Comparison</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={priceComparisonData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `$${v}`} />
                  <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={12} width={80} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: 'none',
                      borderRadius: '12px',
                      color: '#fff',
                    }}
                    formatter={(value: number) => [`$${value.toFixed(2)}`, '']}
                  />
                  <Area dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Profit Margin Visualization */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Profit Margin Breakdown</CardTitle>
                <Badge variant="success">{result.profitMargin.toFixed(1)}% Margin</Badge>
              </div>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={[
                    { point: 'Cost', amount: parseFloat(costPrice || '0') },
                    { point: 'Recommended', amount: result.recommendedPrice },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="point" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `$${v}`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: 'none',
                      borderRadius: '12px',
                      color: '#fff',
                    }}
                    formatter={(value: number) => [`$${value.toFixed(2)}`, '']}
                  />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ fill: '#10b981', r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Pricing Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800">
              <TrendingUp className="w-6 h-6 text-emerald-500 mb-2" />
              <h4 className="font-medium text-slate-900 dark:text-white mb-1">High Demand</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Charge premium prices when demand is high. Customers are willing to pay more.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
              <Target className="w-6 h-6 text-blue-500 mb-2" />
              <h4 className="font-medium text-slate-900 dark:text-white mb-1">Competitive</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Monitor competitor prices and adjust to stay competitive while maintaining margins.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800">
              <TrendingDown className="w-6 h-6 text-amber-500 mb-2" />
              <h4 className="font-medium text-slate-900 dark:text-white mb-1">Low Demand</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Lower prices to drive volume. Consider promotions or bundles.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
