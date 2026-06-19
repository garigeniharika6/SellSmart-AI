import type {
  Product,
  Sale,
  Review,
  InventoryAlert,
  DemandForecast,
  TrendingProduct,
  Activity,
  SalesData,
  DashboardStats,
} from '../types';

const categories = [
  'Electronics',
  'Clothing',
  'Home & Garden',
  'Sports',
  'Beauty',
  'Toys',
  'Books',
  'Automotive',
];

const productNames: Record<string, string[]> = {
  Electronics: [
    'Wireless Bluetooth Earbuds',
    'Smart Watch Pro',
    'Portable Power Bank',
    'USB-C Hub Adapter',
    'Noise Canceling Headphones',
    'Smart Home Speaker',
    'Wireless Charging Pad',
    '4K Webcam',
  ],
  Clothing: [
    'Premium Cotton T-Shirt',
    'Denim Jacket Classic',
    'Running Shoes Elite',
    'Wool Sweater Cozy',
    'Silk Scarf Elegant',
    'Leather Belt Premium',
    'Yoga Pants Flex',
    'Winter Parka Warm',
  ],
  'Home & Garden': [
    'LED Desk Lamp Modern',
    'Ergonomic Office Chair',
    'Air Purifier Pro',
    'Smart Thermostat',
    'Robot Vacuum Cleaner',
    'Memory Foam Pillow',
    'Indoor Plant Set',
    'Coffee Maker Deluxe',
  ],
  Sports: [
    'Yoga Mat Premium',
    'Resistance Bands Set',
    'Dumbbells Adjustable',
    'Running Watch GPS',
    'Cycling Helmet Safe',
    'Tennis Racket Pro',
    'Basketball Official',
    'Golf Clubs Set',
  ],
  Beauty: [
    'Organic Face Serum',
    'Vitamin C Moisturizer',
    'Hair Growth Oil',
    'Makeup Brush Set',
    'Anti-Aging Cream',
    'Sunscreen SPF 50',
    'Lip Care Collection',
    'Eye Cream Revive',
  ],
  Toys: [
    'Building Blocks Set',
    'Remote Control Car',
    'Educational STEM Kit',
    'Board Game Classic',
    'Puzzle 1000 Pieces',
    'Action Figure Hero',
    'Stuffed Animal Cute',
    'Drone for Kids',
  ],
  Books: [
    'Self-Help Bestseller',
    'Cooking Recipes Book',
    'Programming Guide',
    'Mystery Novel Thriller',
    'Business Strategy Book',
    'Science Fiction Epic',
    'Biography Inspiring',
    'Travel Guide World',
  ],
  Automotive: [
    'Car Phone Mount',
    'Dashboard Camera',
    'LED Headlight Kit',
    'Car Vacuum Portable',
    'Seat Covers Premium',
    'Tire Pressure Monitor',
    'Car Organizer Large',
    'Emergency Road Kit',
  ],
};

const channels = ['Website', 'Mobile App', 'Marketplace', 'Social Media'];
const customerNames = [
  'John D.',
  'Sarah M.',
  'Mike T.',
  'Emily R.',
  'David L.',
  'Jessica P.',
  'Chris K.',
  'Amanda W.',
];

const complaints = [
  'Shipping took longer than expected',
  'Product quality could be better',
  'Does not match the description',
  'Packaging was damaged',
  'Customer service response slow',
  'Size runs smaller than expected',
  'Color different from photos',
  'Difficult to assemble',
];

const praises = [
  'Excellent product quality',
  'Fast shipping',
  'Great value for money',
  'Looks exactly as pictured',
  'Easy to use',
  'Durable and well-made',
  'Perfect for gifting',
  'Exceeded expectations',
];

const generateId = () => Math.random().toString(36).substr(2, 9);

const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const randomFloat = (min: number, max: number) =>
  Number((Math.random() * (max - min) + min).toFixed(2));

const randomItem = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

export const generateProducts = (): Product[] => {
  const products: Product[] = [];

  categories.forEach((category) => {
    const names = productNames[category] || [];
    names.forEach((name, index) => {
      const costPrice = randomFloat(10, 200);
      products.push({
        id: `prod_${generateId()}`,
        name,
        category,
        price: Number((costPrice * randomFloat(1.3, 2.5)).toFixed(2)),
        costPrice,
        stock: randomInt(0, 500),
        reorderLevel: randomInt(10, 50),
        sku: `${category.substring(0, 3).toUpperCase()}-${1000 + index}`,
        description: `High-quality ${name.toLowerCase()} perfect for everyday use.`,
        createdAt: new Date(
          Date.now() - randomInt(30, 365) * 24 * 60 * 60 * 1000
        ).toISOString(),
        updatedAt: new Date().toISOString(),
      });
    });
  });

  return products;
};

export const generateSales = (products: Product[]): Sale[] => {
  const sales: Sale[] = [];

  for (let i = 0; i < 500; i++) {
    const product = randomItem(products);
    const quantity = randomInt(1, 5);
    const discount = randomFloat(0, 0.2);
    const unitPrice = product.price * (1 - discount);
    const profit = (unitPrice - product.costPrice) * quantity;

    sales.push({
      id: `sale_${generateId()}`,
      productId: product.id,
      productName: product.name,
      quantity,
      unitPrice: Number(unitPrice.toFixed(2)),
      totalAmount: Number((unitPrice * quantity).toFixed(2)),
      profit: Number(profit.toFixed(2)),
      date: new Date(
        Date.now() - randomInt(0, 90) * 24 * 60 * 60 * 1000
      ).toISOString(),
      channel: randomItem(channels),
    });
  }

  return sales.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};

export const generateReviews = (products: Product[]): Review[] => {
  const reviews: Review[] = [];
  const reviewTexts = {
    positive: [
      'Absolutely love this product! Exceeded my expectations in every way.',
      'Great quality and fast delivery. Will definitely buy again.',
      'Perfect for my needs. Highly recommend to anyone looking for this.',
      'Amazing value for the price. Works exactly as described.',
      'Best purchase I\'ve made this year. Five stars all the way!',
    ],
    neutral: [
      'Product is okay. Nothing special but does the job.',
      'Decent quality for the price. Could be better but not disappointed.',
      'Works as expected. Shipping was average.',
      'It\'s fine for what it is. Nothing to complain about.',
      'Average product. Would recommend trying alternatives too.',
    ],
    negative: [
      'Disappointed with the quality. Not worth the price.',
      'Product arrived damaged. Customer service was unhelpful.',
      'Does not match the description. Returning for refund.',
      'Worst purchase ever. Complete waste of money.',
      'Stopped working after a week. Very frustrated.',
    ],
  };

  for (let i = 0; i < 200; i++) {
    const product = randomItem(products);
    const sentiment = randomItem(['positive', 'neutral', 'negative'] as const);
    const rating =
      sentiment === 'positive'
        ? randomInt(4, 5)
        : sentiment === 'neutral'
          ? randomInt(3, 4)
          : randomInt(1, 2);

    reviews.push({
      id: `rev_${generateId()}`,
      productId: product.id,
      productName: product.name,
      rating,
      text: randomItem(reviewTexts[sentiment]),
      customerName: randomItem(customerNames),
      date: new Date(
        Date.now() - randomInt(0, 60) * 24 * 60 * 60 * 1000
      ).toISOString(),
      sentiment,
    });
  }

  return reviews;
};

export const generateInventoryAlerts = (products: Product[]): InventoryAlert[] => {
  const alerts: InventoryAlert[] = [];

  products.forEach((product) => {
    let alertType: InventoryAlert['alertType'] | null = null;
    let recommendation = '';

    if (product.stock === 0) {
      alertType = 'critical_stock';
      recommendation = `URGENT: ${product.name} is out of stock. Place order immediately. Estimated lost revenue: $${(product.price * 10).toFixed(2)}/day`;
    } else if (product.stock < product.reorderLevel) {
      alertType = 'low_stock';
      recommendation = `Reorder ${product.name} soon. Current stock: ${product.stock}, Reorder level: ${product.reorderLevel}. Suggested order: ${product.reorderLevel * 2} units`;
    } else if (product.stock > 100) {
      alertType = 'overstock';
      recommendation = `${product.name} has excess inventory: ${product.stock} units. Consider running a promotion or bundle deal to reduce stock.`;
    }

    if (alertType) {
      alerts.push({
        id: `alert_${generateId()}`,
        productId: product.id,
        productName: product.name,
        currentStock: product.stock,
        reorderLevel: product.reorderLevel,
        alertType,
        recommendation,
        createdAt: new Date().toISOString(),
      });
    }
  });

  return alerts.sort((a, b) => {
    const priority = { critical_stock: 0, low_stock: 1, overstock: 2 };
    return priority[a.alertType] - priority[b.alertType];
  });
};

export const generateDemandForecasts = (products: Product[]): DemandForecast[] => {
  return products.slice(0, 20).map((product) => {
    const historicalSales = Array.from({ length: 6 }, () => randomInt(10, 100));
    const baseDemand = historicalSales.reduce((a, b) => a + b, 0) / 6;
    const variation = randomFloat(0.8, 1.3);
    const predictedDemand = Math.round(baseDemand * variation);
    const trend: DemandForecast['trend'] =
      variation > 1.1 ? 'increasing' : variation < 0.9 ? 'decreasing' : 'stable';

    return {
      productId: product.id,
      productName: product.name,
      historicalSales,
      predictedDemand,
      confidence: randomFloat(65, 95),
      trend,
      month: new Date().toLocaleString('default', { month: 'long' }),
    };
  });
};

export const generateTrendingProducts = (): TrendingProduct[] => {
  const trending: TrendingProduct[] = [];

  categories.forEach((category) => {
    const count = randomInt(2, 4);
    for (let i = 0; i < count; i++) {
      const names = productNames[category] || [];
      trending.push({
        id: `trend_${generateId()}`,
        name: randomItem(names),
        category,
        demandScore: randomFloat(60, 98),
        opportunityScore: randomFloat(55, 95),
        growthRate: randomFloat(-5, 35),
        avgPrice: randomFloat(25, 150),
        trend:
          randomFloat(-5, 35) > 15
            ? 'rising'
            : randomFloat(-5, 35) < 5
              ? 'declining'
              : 'stable',
      });
    }
  });

  return trending.sort((a, b) => b.opportunityScore - a.opportunityScore);
};

export const generateActivities = (sales: Sale[], reviews: Review[]): Activity[] => {
  const activities: Activity[] = [];

  sales.slice(0, 20).forEach((sale) => {
    activities.push({
      id: `act_${generateId()}`,
      type: 'sale',
      title: `New order for ${sale.productName}`,
      description: `${sale.quantity} units sold via ${sale.channel} - $${sale.totalAmount}`,
      timestamp: sale.date,
      icon: 'ShoppingCart',
    });
  });

  reviews.slice(0, 10).forEach((review) => {
    activities.push({
      id: `act_${generateId()}`,
      type: 'review',
      title: `New review for ${review.productName}`,
      description: `${review.rating}/5 stars from ${review.customerName}`,
      timestamp: review.date,
      icon: 'MessageSquare',
    });
  });

  return activities.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
};

export const generateSalesData = (): SalesData[] => {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  return months.slice(0, 8).map((month, index) => ({
    month,
    revenue: randomInt(15000, 45000),
    orders: randomInt(150, 400),
    profit: randomInt(3000, 12000),
  }));
};

export const calculateDashboardStats = (
  sales: Sale[],
  reviews: Review[],
  products: Product[]
): DashboardStats => {
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const totalOrders = sales.length;
  const avgRating =
    reviews.reduce((sum, rev) => sum + rev.rating, 0) / reviews.length || 0;

  const healthyProducts = products.filter(
    (p) => p.stock > p.reorderLevel && p.stock > 0
  ).length;
  const inventoryHealth = (healthyProducts / products.length) * 100;

  return {
    totalRevenue,
    totalOrders,
    inventoryHealth,
    customerSatisfaction: avgRating * 20,
    revenueChange: randomFloat(-5, 25),
    ordersChange: randomFloat(-3, 18),
    satisfactionChange: randomFloat(-2, 10),
  };
};

export const generateDescription = (
  productName: string,
  category: string,
  features: string[],
  targetAudience: string
) => {
  const fullDescription = `Introducing the ${productName} - a premium ${category.toLowerCase()} product designed specifically for ${targetAudience}.

${features.length > 0 ? `Key Features:\n${features.map((f) => `• ${f}`).join('\n')}` : ''}

This exceptional product combines quality craftsmanship with modern innovation. Perfect for everyday use, the ${productName} delivers outstanding performance and reliability.

Customers love the attention to detail and the premium materials used in construction. Whether you're buying for yourself or as a gift, this product is sure to exceed expectations.

Order now and experience the difference that quality makes!`;

  const shortDescription = `Discover the ${productName} - premium ${category.toLowerCase()} designed for ${targetAudience}. Features: ${features.slice(0, 3).join(', ')}. Exceptional quality, outstanding value.`;

  const seoKeywords = [
    productName.toLowerCase(),
    category.toLowerCase(),
    ...features.slice(0, 3).map((f) => f.toLowerCase().split(' ').slice(0, 2).join(' ')),
    'premium quality',
    'best seller',
    targetAudience.toLowerCase(),
    'online shopping',
  ].filter(Boolean);

  return {
    fullDescription,
    shortDescription,
    seoKeywords: [...new Set(seoKeywords)],
  };
};

export const analyzeReviews = (reviews: Review[]) => {
  const total = reviews.length;
  const positive = reviews.filter((r) => r.sentiment === 'positive').length;
  const neutral = reviews.filter((r) => r.sentiment === 'neutral').length;
  const negative = reviews.filter((r) => r.sentiment === 'negative').length;
  const avgRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / total || 0;

  const summary = `Based on ${total} reviews, this product has an average rating of ${avgRating.toFixed(1)}/5. ${positive > negative ? 'Customers are generally satisfied with their purchase.' : 'There are some concerns that need to be addressed.'} Key themes include quality, value, and customer service.`;

  return {
    totalReviews: total,
    averageRating: avgRating,
    sentimentBreakdown: {
      positive: Math.round((positive / total) * 100) || 0,
      neutral: Math.round((neutral / total) * 100) || 0,
      negative: Math.round((negative / total) * 100) || 0,
    },
    topComplaints: complaints.slice(0, 4),
    topPraises: praises.slice(0, 4),
    summary,
  };
};

export const calculatePricingRecommendation = (
  costPrice: number,
  competitorPrice: number,
  demandLevel: 'low' | 'medium' | 'high'
) => {
  let multiplier = 1.3;
  let strategy = '';

  switch (demandLevel) {
    case 'high':
      multiplier = 1.5;
      strategy =
        'High demand provides pricing power. Position slightly above competitors to capture premium value while maintaining competitiveness.';
      break;
    case 'medium':
      multiplier = 1.35;
      strategy =
        'Balanced market conditions. Price competitively to gain market share while maintaining healthy margins.';
      break;
    case 'low':
      multiplier = 1.2;
      strategy =
        'Lower demand requires competitive pricing. Focus on volume sales and consider promotional strategies to stimulate demand.';
      break;
  }

  const recommendedPrice = Math.max(
    costPrice * multiplier,
    competitorPrice * 0.95
  );
  const profitMargin = ((recommendedPrice - costPrice) / recommendedPrice) * 100;

  return {
    recommendedPrice: Number(recommendedPrice.toFixed(2)),
    profitMargin: Number(profitMargin.toFixed(1)),
    strategy,
  };
};
