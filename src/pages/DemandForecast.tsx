import React, { useState, useMemo } from 'react';
import { Upload, LineChart, TrendingUp, TrendingDown, Minus, AlertCircle } from 'lucide-react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { generateProducts, generateDemandForecasts } from '../data/mockData';
import type { DemandForecast } from '../types';
import toast from 'react-hot-toast';

export const DemandForecast: React.FC = () => {
  const products = useMemo(() => generateProducts(), []);
  const forecasts = useMemo(() => generateDemandForecasts(products), [products]);
  const [selectedProduct, setSelectedProduct] = useState<DemandForecast | null>(null);
  const [csvData, setCsvData] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setCsvData(text);
        toast.success('CSV file uploaded successfully!');
      };
      reader.readAsText(file);
    }
  };

  const getTrendIcon = (trend: DemandForecast['trend']) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="w-5 h-5 text-emerald-500" />;
      case 'decreasing':
        return <TrendingDown className="w-5 h-5 text-red-500" />;
      default:
        return <Minus className="w-5 h-5 text-slate-400" />;
    }
  };

  const getTrendBadge = (trend: DemandForecast['trend']) => {
    switch (trend) {
      case 'increasing':
        return <Badge variant="success">Rising Demand</Badge>;
      case 'decreasing':
        return <Badge variant="error">Falling Demand</Badge>;
      default:
        return <Badge variant="neutral">Stable</Badge>;
    }
  };

  const chartData = selectedProduct
    ? selectedProduct.historicalSales.map((sales, idx) => ({
        month: `M${idx + 1}`,
        sales,
      }))
    : null;

  const forecastWithPrediction = selectedProduct
    ? [...(chartData || []), { month: 'Next', sales: selectedProduct.predictedDemand, isForecast: true }]
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Demand Forecasting</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Predict future demand based on historical sales data
          </p>
        </div>
        <div className="flex gap-2">
          <label className="cursor-pointer">
            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileUpload}
            />
            <Button variant="outline" as="span">
              <Upload className="w-4 h-4" />
              Upload CSV
            </Button>
          </label>
        </div>
      </div>

      {/* CSV Upload Status */}
      {csvData && (
        <Card className="bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800">
          <CardContent className="py-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                <Upload className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
                  CSV Data Uploaded
                </p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400">
                  {csvData.split('\n').length - 1} records found
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Products</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100 dark:divide-slate-700 max-h-[600px] overflow-y-auto">
              {forecasts.map((forecast) => (
                <button
                  key={forecast.productId}
                  onClick={() => setSelectedProduct(forecast)}
                  className={`w-full px-6 py-4 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                    selectedProduct?.productId === forecast.productId
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500'
                      : ''
                  }`}
                >
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                      {forecast.productName}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Predicted: {forecast.predictedDemand} units
                    </p>
                  </div>
                  {getTrendIcon(forecast.trend)}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Forecast Details */}
        <Card className="lg:col-span-2">
          {selectedProduct ? (
            <>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{selectedProduct.productName}</CardTitle>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Monthly Forecast: {selectedProduct.month}
                    </p>
                  </div>
                  {getTrendBadge(selectedProduct.trend)}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-100 dark:border-blue-800">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Predicted Demand
                    </p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                      {selectedProduct.predictedDemand}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">units</p>
                  </div>
                  <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-100 dark:border-emerald-800">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Confidence
                    </p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                      {selectedProduct.confidence.toFixed(0)}%
                    </p>
                    <p className="text-xs text-emerald-500">High Accuracy</p>
                  </div>
                  <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-100 dark:border-amber-800">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Trend</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1 capitalize">
                      {selectedProduct.trend}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {selectedProduct.trend === 'increasing'
                        ? 'Order more stock'
                        : selectedProduct.trend === 'decreasing'
                          ? 'Reduce inventory'
                          : 'Maintain levels'}
                    </p>
                  </div>
                </div>

                {/* Historical Chart */}
                <div>
                  <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                    Historical Sales + Forecast
                  </h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsLineChart data={forecastWithPrediction || []}>
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
                          dataKey="sales"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          dot={{ fill: '#3b82f6', r: 4 }}
                        />
                      </RechartsLineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Historical Data Bar Chart */}
                <div>
                  <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                    Monthly Sales Distribution
                  </h4>
                  <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData || []}>
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
                        <Bar dataKey="sales" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Alert */}
                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                      Recommendation
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                      {selectedProduct.trend === 'increasing'
                        ? `Demand is rising. Consider increasing your stock by ${Math.round(selectedProduct.predictedDemand * 0.2)} units to avoid stockouts.`
                        : selectedProduct.trend === 'decreasing'
                          ? 'Demand is declining. Consider running promotions or reducing new orders.'
                          : 'Demand is stable. Maintain current inventory levels and monitor for changes.'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-12">
              <LineChart className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-4" />
              <p className="text-slate-500 dark:text-slate-400">
                Select a product to view forecast details
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
