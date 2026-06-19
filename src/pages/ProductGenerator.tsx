import React, { useState } from 'react';
import { Sparkles, Copy, Check, RefreshCw, FileText, Tag, Eye } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Textarea, Select } from '../components/ui/Input';
import { generateDescription } from '../data/mockData';
import toast from 'react-hot-toast';

const categories = [
  { value: '', label: 'Select a category' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'home-garden', label: 'Home & Garden' },
  { value: 'sports', label: 'Sports' },
  { value: 'beauty', label: 'Beauty' },
  { value: 'toys', label: 'Toys' },
  { value: 'books', label: 'Books' },
  { value: 'automotive', label: 'Automotive' },
];

export const ProductGenerator: React.FC = () => {
  const [formData, setFormData] = useState({
    productName: '',
    category: '',
    features: '',
    targetAudience: '',
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof generateDescription> | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenerate = async () => {
    if (!formData.productName || !formData.category) {
      toast.error('Please fill in product name and category');
      return;
    }

    setIsGenerating(true);
    await new Promise((r) => setTimeout(r, 1500));

    const features = formData.features
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);

    const description = generateDescription(
      formData.productName,
      formData.category,
      features,
      formData.targetAudience || 'online shoppers'
    );

    setResult(description);
    setIsGenerating(false);
    toast.success('Description generated successfully!');
  };

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(field);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500 mb-4 shadow-lg shadow-violet-500/25">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          AI Product Description Generator
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Generate compelling product descriptions that drive conversions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Product Name"
              placeholder="e.g., Wireless Bluetooth Earbuds Pro"
              value={formData.productName}
              onChange={(e) => handleChange('productName', e.target.value)}
            />

            <Select
              label="Category"
              options={categories}
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
            />

            <Textarea
              label="Key Features"
              placeholder="Enter each feature on a new line:&#10;• Active noise cancellation&#10;• 24-hour battery life&#10;• IPX5 waterproof"
              value={formData.features}
              onChange={(e) => handleChange('features', e.target.value)}
              rows={4}
            />

            <Input
              label="Target Audience"
              placeholder="e.g., fitness enthusiasts, professionals, gamers"
              value={formData.targetAudience}
              onChange={(e) => handleChange('targetAudience', e.target.value)}
            />

            <Button
              onClick={handleGenerate}
              isLoading={isGenerating}
              className="w-full"
              size="lg"
            >
              <Sparkles className="w-4 h-4" />
              Generate Descriptions
            </Button>
          </CardContent>
        </Card>

        {/* Output */}
        <Card className={result ? '' : 'flex items-center justify-center'}>
          {result ? (
            <div className="flex flex-col h-full">
              <CardHeader>
                <CardTitle>Generated Content</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 space-y-6">
                {/* Full Description */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Full Description
                    </label>
                    <button
                      onClick={() => copyToClipboard(result.fullDescription, 'full')}
                      className="text-slate-500 hover:text-blue-500 transition-colors"
                    >
                      {copied === 'full' ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line">
                    {result.fullDescription}
                  </div>
                </div>

                {/* Short Description */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      Short Description
                    </label>
                    <button
                      onClick={() => copyToClipboard(result.shortDescription, 'short')}
                      className="text-slate-500 hover:text-blue-500 transition-colors"
                    >
                      {copied === 'short' ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300">
                    {result.shortDescription}
                  </div>
                </div>

                {/* SEO Keywords */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      SEO Keywords
                    </label>
                    <button
                      onClick={() => copyToClipboard(result.seoKeywords.join(', '), 'seo')}
                      className="text-slate-500 hover:text-blue-500 transition-colors"
                    >
                      {copied === 'seo' ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.seoKeywords.map((keyword, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={() => setResult(null)}
                  className="w-full"
                >
                  <RefreshCw className="w-4 h-4" />
                  Generate Again
                </Button>
              </CardContent>
            </div>
          ) : (
            <div className="text-center p-8">
              <FileText className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <p className="text-slate-500 dark:text-slate-400">
                Fill in the product details and click generate
              </p>
            </div>
          )}
        </Card>
      </div>

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Pro Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
              <h4 className="font-medium text-slate-900 dark:text-white mb-1">Be Specific</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Include exact features and specifications for better descriptions.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800">
              <h4 className="font-medium text-slate-900 dark:text-white mb-1">Know Your Audience</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Define your target audience for more personalized content.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800">
              <h4 className="font-medium text-slate-900 dark:text-white mb-1">Use Keywords</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Include relevant keywords for better SEO performance.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
