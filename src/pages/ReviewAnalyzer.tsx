import React, { useState, useMemo } from 'react';
import {
  MessageSquareText,
  ThumbsUp,
  ThumbsDown,
  Minus,
  Star,
  TrendingUp,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Textarea } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { generateProducts, generateReviews, analyzeReviews } from '../data/mockData';
import type { Review, ReviewSummary } from '../types';
import toast from 'react-hot-toast';

export const ReviewAnalyzer: React.FC = () => {
  const products = useMemo(() => generateProducts(), []);
  const mockReviews = useMemo(() => generateReviews(products), [products]);
  const [reviewText, setReviewText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ReviewSummary | null>(null);
  const [copied, setCopied] = useState(false);

  // Use mock reviews for the demo product
  const demoProductReviews = mockReviews.slice(0, 50);

  const sentimentData = analysis
    ? [
        { name: 'Positive', value: analysis.sentimentBreakdown.positive, color: '#10b981' },
        { name: 'Neutral', value: analysis.sentimentBreakdown.neutral, color: '#f59e0b' },
        { name: 'Negative', value: analysis.sentimentBreakdown.negative, color: '#ef4444' },
      ]
    : [];

  const handleAnalyze = async () => {
    if (!reviewText.trim()) {
      toast.error('Please enter some reviews to analyze');
      return;
    }

    setIsAnalyzing(true);
    await new Promise((r) => setTimeout(r, 1500));

    // Create mock reviews from pasted text
    const lines = reviewText.split('\n').filter(Boolean);
    const parsedReviews: Review[] = lines.map((line, idx) => ({
      id: `rev_${idx}`,
      productId: 'demo',
      productName: 'Product',
      rating: Math.floor(Math.random() * 3) + 3,
      text: line,
      customerName: 'Customer',
      date: new Date().toISOString(),
      sentiment: line.length > 30 ? 'positive' : Math.random() > 0.5 ? 'neutral' : 'negative',
    }));

    const result = analyzeReviews(parsedReviews.length > 0 ? parsedReviews : demoProductReviews);
    setAnalysis(result);
    setIsAnalyzing(false);
    toast.success('Analysis complete!');
  };

  const handleUseSampleData = () => {
    const sampleReviews = demoProductReviews.map((r) => r.text).join('\n\n');
    setReviewText(sampleReviews.slice(0, 2000));
    const result = analyzeReviews(demoProductReviews);
    setAnalysis(result);
  };

  const copySummary = async () => {
    if (!analysis) return;
    await navigator.clipboard.writeText(analysis.summary);
    setCopied(true);
    toast.success('Summary copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <ThumbsUp className="w-4 h-4 text-emerald-500" />;
      case 'negative':
        return <ThumbsDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Review Analyzer</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            AI-powered customer feedback analysis and insights
          </p>
        </div>
        <Button variant="outline" onClick={handleUseSampleData}>
          Load Sample Reviews
        </Button>
      </div>

      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle>Enter Customer Reviews</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Paste customer reviews here (one per line or paragraph)..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            rows={6}
          />
          <div className="flex gap-2">
            <Button onClick={handleAnalyze} isLoading={isAnalyzing}>
              <MessageSquareText className="w-4 h-4" />
              Analyze Reviews
            </Button>
          </div>
        </CardContent>
      </Card>

      {analysis && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sentiment Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Sentiment Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sentimentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {sentimentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="text-center p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                  <ThumbsUp className="w-5 h-5 text-emerald-500 mx-auto" />
                  <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                    {analysis.sentimentBreakdown.positive}%
                  </p>
                  <p className="text-xs text-slate-500">Positive</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                  <Minus className="w-5 h-5 text-amber-500 mx-auto" />
                  <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                    {analysis.sentimentBreakdown.neutral}%
                  </p>
                  <p className="text-xs text-slate-500">Neutral</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-red-50 dark:bg-red-900/20">
                  <ThumbsDown className="w-5 h-5 text-red-500 mx-auto" />
                  <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                    {analysis.sentimentBreakdown.negative}%
                  </p>
                  <p className="text-xs text-slate-500">Negative</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>AI Summary</CardTitle>
                <button onClick={copySummary} className="text-slate-500 hover:text-blue-500">
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-100 dark:border-blue-800">
                <p className="text-sm text-slate-700 dark:text-slate-300">{analysis.summary}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Total Reviews</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                    {analysis.totalReviews}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Average Rating</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {analysis.averageRating.toFixed(1)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bar Chart */}
              <div className="mt-4">
                <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                  Rating Distribution
                </h4>
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { rating: '5 star', count: Math.round(analysis.sentimentBreakdown.positive * 0.6) },
                        { rating: '4 star', count: Math.round(analysis.sentimentBreakdown.positive * 0.4) },
                        { rating: '3 star', count: Math.round(analysis.sentimentBreakdown.neutral * 0.8) },
                        { rating: '2 star', count: Math.round(analysis.sentimentBreakdown.negative * 0.4) },
                        { rating: '1 star', count: Math.round(analysis.sentimentBreakdown.negative * 0.6) },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="rating" stroke="#94a3b8" fontSize={10} />
                      <YAxis stroke="#94a3b8" fontSize={10} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1e293b',
                          border: 'none',
                          borderRadius: '12px',
                          color: '#fff',
                        }}
                      />
                      <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Complaints */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <CardTitle>Common Complaints</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {analysis.topComplaints.map((complaint, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400"
                  >
                    <ThumbsDown className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                    {complaint}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Praises */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                <CardTitle>Frequently Praised Features</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {analysis.topPraises.map((praise, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-sm text-emerald-700 dark:text-emerald-300"
                  >
                    <ThumbsUp className="w-4 h-4 flex-shrink-0" />
                    {praise}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
