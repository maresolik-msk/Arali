// Type Definitions for Dashboard Data

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number; // Keep for backwards compatibility, will represent selling price
  costPrice: number; // Price bought from vendor
  sellingPrice: number; // Price sold to customers
  stock: number;
  threshold: number;
  alertEnabled: boolean; // Enable/disable low stock alerts
  sku: string;
  description?: string;
  imageUrl?: string; // Product image URL
  vendorType?: string; // Type/name of vendor
  unitsSold: number;
  revenue: number;
  expiryDate?: string; // ISO date string format
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  customerId: number;
  customerName: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'Completed' | 'Processing' | 'Pending' | 'Cancelled';
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
}

export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address?: string;
  totalOrders: number;
  totalSpent: number;
  joinedDate: Date;
  lastOrderDate?: Date;
  segment: 'VIP' | 'Regular' | 'Occasional';
  notes?: string;
}

export interface Vendor {
  id: number;
  name: string;
  email: string;
  phone: string;
  address?: string;
  company: string;
  category: string; // e.g., "Beverages", "Dairy", "Groceries"
  totalProducts: number; // Number of products supplied
  totalPurchases: number; // Total amount spent purchasing from this vendor
  joinedDate: Date;
  lastOrderDate?: Date;
  rating: number; // 1-5 rating
  status: 'Active' | 'Inactive';
  paymentTerms?: string; // e.g., "Net 30", "COD"
  notes?: string;
}

export interface RevenueSource {
  id: number;
  category: 'Product Sales' | 'Service Fees' | 'Subscriptions' | 'Other';
  amount: number;
  percentage: number;
  change: string;
  trend: 'up' | 'down';
  month: number;
  year: number;
}

export interface LowStockAlert {
  id: number;
  productId: number;
  productName: string;
  currentStock: number;
  threshold: number;
  category: string;
  lastRestocked?: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'low_stock' | 'out_of_stock' | 'order_status' | 'new_customer' | 'general';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  relatedTo?: {
    type: 'product' | 'order' | 'customer';
    id: number | string;
    name?: string;
  };
}

export interface DashboardMetrics {
  totalRevenue: number;
  revenueChange: string;
  revenueTrend: 'up' | 'down';
  totalOrders: number;
  ordersChange: string;
  ordersTrend: 'up' | 'down';
  totalProducts: number;
  productsChange: string;
  productsTrend: 'up' | 'down';
  totalCustomers: number;
  customersChange: string;
  customersTrend: 'up' | 'down';
}

export interface SalesDataPoint {
  date: string;
  sales: number;
  orders: number;
  day: string;
}

export interface CustomerSegment {
  type: 'VIP Customers' | 'Regular Customers' | 'Occasional Customers';
  count: number;
  percentage: number;
  avgSpend: number;
  totalRevenue: number;
}

export interface ProductCategory {
  id: number;
  name: string;
  count: number;
  percentage: number;
  totalRevenue: number;
}

// Initial Mock Data with proper structure

export const initialProducts: Product[] = [
  {
    id: 1,
    name: 'Organic Coffee Beans',
    category: 'Beverages',
    price: 450,
    costPrice: 300,
    sellingPrice: 450,
    stock: 12,
    threshold: 50,
    alertEnabled: true,
    sku: 'BEV-001',
    description: 'Premium organic coffee beans from Karnataka',
    imageUrl: 'https://example.com/images/coffee-beans.jpg',
    vendorType: 'Karnataka Coffee Co.',
    unitsSold: 340,
    revenue: 153000,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-12-20'),
  },
  {
    id: 2,
    name: 'Greek Yogurt',
    category: 'Dairy',
    price: 120,
    costPrice: 80,
    sellingPrice: 120,
    stock: 45,
    threshold: 30,
    alertEnabled: true,
    sku: 'DAI-001',
    description: 'Fresh Greek yogurt with probiotics',
    imageUrl: 'https://example.com/images/greek-yogurt.jpg',
    vendorType: 'Dairy Farm',
    unitsSold: 1050,
    revenue: 126000,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-12-20'),
  },
  {
    id: 3,
    name: 'Olive Oil',
    category: 'Groceries',
    price: 650,
    costPrice: 400,
    sellingPrice: 650,
    stock: 78,
    threshold: 40,
    alertEnabled: true,
    sku: 'GRO-001',
    description: 'Extra virgin olive oil',
    imageUrl: 'https://example.com/images/olive-oil.jpg',
    vendorType: 'Olive Oil Mill',
    unitsSold: 306,
    revenue: 198900,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-12-20'),
  },
  {
    id: 4,
    name: 'Brown Rice',
    category: 'Groceries',
    price: 180,
    costPrice: 120,
    sellingPrice: 180,
    stock: 92,
    threshold: 60,
    alertEnabled: true,
    sku: 'GRO-002',
    description: 'Organic brown rice',
    imageUrl: 'https://example.com/images/brown-rice.jpg',
    vendorType: 'Rice Farm',
    unitsSold: 347,
    revenue: 62460,
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-12-20'),
  },
  {
    id: 5,
    name: 'Almond Milk',
    category: 'Beverages',
    price: 220,
    costPrice: 150,
    sellingPrice: 220,
    stock: 8,
    threshold: 30,
    alertEnabled: true,
    sku: 'BEV-002',
    description: 'Unsweetened almond milk',
    imageUrl: 'https://example.com/images/almond-milk.jpg',
    vendorType: 'Almond Milk Co.',
    unitsSold: 245,
    revenue: 53900,
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-12-20'),
  },
  {
    id: 6,
    name: 'Whole Wheat Bread',
    category: 'Bakery',
    price: 45,
    costPrice: 30,
    sellingPrice: 45,
    stock: 5,
    threshold: 25,
    alertEnabled: true,
    sku: 'BAK-001',
    description: 'Fresh whole wheat bread',
    imageUrl: 'https://example.com/images/whole-wheat-bread.jpg',
    vendorType: 'Bakery',
    unitsSold: 678,
    revenue: 30510,
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-12-20'),
  },
  {
    id: 7,
    name: 'Fresh Spinach',
    category: 'Vegetables',
    price: 40,
    costPrice: 25,
    sellingPrice: 40,
    stock: 15,
    threshold: 40,
    alertEnabled: true,
    sku: 'VEG-001',
    description: 'Fresh organic spinach',
    imageUrl: 'https://example.com/images/fresh-spinach.jpg',
    vendorType: 'Vegetable Farm',
    unitsSold: 523,
    revenue: 20920,
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-12-20'),
  },
];

export const initialCustomers: Customer[] = [
  {
    id: 1,
    name: 'Sarah Martinez',
    email: 'sarah.martinez@email.com',
    phone: '+91 98765 43210',
    address: '123 MG Road, Bangalore',
    totalOrders: 47,
    totalSpent: 4567,
    joinedDate: new Date('2024-01-15'),
    lastOrderDate: new Date('2024-12-20'),
    segment: 'VIP',
    notes: 'Prefers organic products',
  },
  {
    id: 2,
    name: 'Michael Chen',
    email: 'michael.chen@email.com',
    phone: '+91 98765 43211',
    address: '456 Park Street, Mumbai',
    totalOrders: 39,
    totalSpent: 3892,
    joinedDate: new Date('2024-02-01'),
    lastOrderDate: new Date('2024-12-19'),
    segment: 'VIP',
    notes: 'Bulk buyer',
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@email.com',
    phone: '+91 98765 43212',
    address: '789 Brigade Road, Bangalore',
    totalOrders: 35,
    totalSpent: 3245,
    joinedDate: new Date('2024-01-20'),
    lastOrderDate: new Date('2024-12-18'),
    segment: 'VIP',
  },
  {
    id: 4,
    name: 'James Thompson',
    email: 'james.thompson@email.com',
    phone: '+91 98765 43213',
    address: '321 MG Road, Delhi',
    totalOrders: 31,
    totalSpent: 2987,
    joinedDate: new Date('2024-03-01'),
    lastOrderDate: new Date('2024-12-17'),
    segment: 'VIP',
  },
  {
    id: 5,
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+91 98765 43214',
    totalOrders: 15,
    totalSpent: 1875,
    joinedDate: new Date('2024-04-01'),
    lastOrderDate: new Date('2024-12-21'),
    segment: 'Regular',
  },
  {
    id: 6,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+91 98765 43215',
    totalOrders: 12,
    totalSpent: 1500,
    joinedDate: new Date('2024-05-01'),
    lastOrderDate: new Date('2024-12-21'),
    segment: 'Regular',
  },
  {
    id: 7,
    name: 'Mike Davis',
    email: 'mike.davis@email.com',
    phone: '+91 98765 43216',
    totalOrders: 18,
    totalSpent: 2250,
    joinedDate: new Date('2024-03-15'),
    lastOrderDate: new Date('2024-12-21'),
    segment: 'Regular',
  },
  {
    id: 8,
    name: 'Emily Brown',
    email: 'emily.brown@email.com',
    phone: '+91 98765 43217',
    totalOrders: 5,
    totalSpent: 625,
    joinedDate: new Date('2024-08-01'),
    lastOrderDate: new Date('2024-12-21'),
    segment: 'Occasional',
  },
  {
    id: 9,
    name: 'David Wilson',
    email: 'david.wilson@email.com',
    phone: '+91 98765 43218',
    totalOrders: 8,
    totalSpent: 1000,
    joinedDate: new Date('2024-07-01'),
    lastOrderDate: new Date('2024-12-21'),
    segment: 'Regular',
  },
];

export const initialOrders: Order[] = [
  {
    id: 'ORD-1234',
    customerId: 5,
    customerName: 'John Smith',
    items: [
      { productId: 1, productName: 'Organic Coffee Beans', quantity: 2, price: 450, subtotal: 900 },
      { productId: 2, productName: 'Greek Yogurt', quantity: 3, price: 120, subtotal: 360 },
    ],
    totalAmount: 1260,
    status: 'Completed',
    createdAt: new Date('2024-12-21T10:00:00'),
    updatedAt: new Date('2024-12-21T10:30:00'),
  },
  {
    id: 'ORD-1233',
    customerId: 6,
    customerName: 'Sarah Johnson',
    items: [
      { productId: 3, productName: 'Olive Oil', quantity: 1, price: 650, subtotal: 650 },
      { productId: 5, productName: 'Almond Milk', quantity: 2, price: 220, subtotal: 440 },
    ],
    totalAmount: 1090,
    status: 'Processing',
    createdAt: new Date('2024-12-21T09:45:00'),
    updatedAt: new Date('2024-12-21T09:45:00'),
  },
  {
    id: 'ORD-1232',
    customerId: 7,
    customerName: 'Mike Davis',
    items: [
      { productId: 4, productName: 'Brown Rice', quantity: 5, price: 180, subtotal: 900 },
      { productId: 6, productName: 'Whole Wheat Bread', quantity: 10, price: 45, subtotal: 450 },
    ],
    totalAmount: 1350,
    status: 'Completed',
    createdAt: new Date('2024-12-21T09:00:00'),
    updatedAt: new Date('2024-12-21T09:30:00'),
  },
  {
    id: 'ORD-1231',
    customerId: 8,
    customerName: 'Emily Brown',
    items: [
      { productId: 7, productName: 'Fresh Spinach', quantity: 3, price: 40, subtotal: 120 },
    ],
    totalAmount: 120,
    status: 'Pending',
    createdAt: new Date('2024-12-21T08:00:00'),
    updatedAt: new Date('2024-12-21T08:00:00'),
  },
  {
    id: 'ORD-1230',
    customerId: 9,
    customerName: 'David Wilson',
    items: [
      { productId: 1, productName: 'Organic Coffee Beans', quantity: 3, price: 450, subtotal: 1350 },
      { productId: 2, productName: 'Greek Yogurt', quantity: 5, price: 120, subtotal: 600 },
    ],
    totalAmount: 1950,
    status: 'Completed',
    createdAt: new Date('2024-12-21T07:00:00'),
    updatedAt: new Date('2024-12-21T07:30:00'),
  },
];

export const initialRevenueSources: RevenueSource[] = [
  {
    id: 1,
    category: 'Product Sales',
    amount: 32450,
    percentage: 71.8,
    change: '+15.2%',
    trend: 'up',
    month: 12,
    year: 2024,
  },
  {
    id: 2,
    category: 'Service Fees',
    amount: 8921,
    percentage: 19.7,
    change: '+8.4%',
    trend: 'up',
    month: 12,
    year: 2024,
  },
  {
    id: 3,
    category: 'Subscriptions',
    amount: 3860,
    percentage: 8.5,
    change: '+5.1%',
    trend: 'up',
    month: 12,
    year: 2024,
  },
];

export const initialSalesData: SalesDataPoint[] = [
  { date: '2024-12-15', day: 'Mon', sales: 4000, orders: 24 },
  { date: '2024-12-16', day: 'Tue', sales: 3000, orders: 18 },
  { date: '2024-12-17', day: 'Wed', sales: 5000, orders: 32 },
  { date: '2024-12-18', day: 'Thu', sales: 2780, orders: 19 },
  { date: '2024-12-19', day: 'Fri', sales: 6890, orders: 42 },
  { date: '2024-12-20', day: 'Sat', sales: 7390, orders: 51 },
  { date: '2024-12-21', day: 'Sun', sales: 5490, orders: 35 },
];

// Helper Functions for Data Management

export const getLowStockProducts = (products: Product[]): LowStockAlert[] => {
  return products
    .filter(product => product.stock <= product.threshold && product.alertEnabled)
    .map(product => ({
      id: product.id,
      productId: product.id,
      productName: product.name,
      currentStock: product.stock,
      threshold: product.threshold,
      category: product.category,
      lastRestocked: product.updatedAt,
    }));
};

export const getTopProductsByRevenue = (products: Product[], limit: number = 4) => {
  if (!products || products.length === 0) {
    return [];
  }
  
  return [...products]
    .filter(p => p && typeof p.revenue === 'number')
    .sort((a, b) => (b.revenue || 0) - (a.revenue || 0))
    .slice(0, limit)
    .map(p => ({
      name: p.name || 'Unknown',
      revenue: `₹${(p.revenue || 0).toLocaleString('en-IN')}`,
      units: p.unitsSold || 0,
    }));
};

export const getTopProductsBySales = (products: Product[], limit: number = 4) => {
  if (!products || products.length === 0) {
    return [];
  }
  
  return [...products]
    .filter(p => p && typeof p.unitsSold === 'number')
    .sort((a, b) => (b.unitsSold || 0) - (a.unitsSold || 0))
    .slice(0, limit)
    .map(p => ({
      id: p.id,
      name: p.name || 'Unknown',
      sold: p.unitsSold || 0,
      stock: p.stock || 0,
      category: p.category || 'Uncategorized',
    }));
};

export const getOrdersByStatus = (orders: Order[]) => {
  const total = orders.length;
  const statusCounts = {
    Completed: orders.filter(o => o.status === 'Completed').length,
    Processing: orders.filter(o => o.status === 'Processing').length,
    Pending: orders.filter(o => o.status === 'Pending').length,
    Cancelled: orders.filter(o => o.status === 'Cancelled').length,
  };

  return [
    { 
      status: 'Completed', 
      count: statusCounts.Completed, 
      percentage: parseFloat(((statusCounts.Completed / total) * 100).toFixed(1)), 
      color: '#10B981' 
    },
    { 
      status: 'Processing', 
      count: statusCounts.Processing, 
      percentage: parseFloat(((statusCounts.Processing / total) * 100).toFixed(1)), 
      color: '#3B82F6' 
    },
    { 
      status: 'Pending', 
      count: statusCounts.Pending, 
      percentage: parseFloat(((statusCounts.Pending / total) * 100).toFixed(1)), 
      color: '#F59E0B' 
    },
  ].filter(item => item.count > 0);
};

export const getRecentOrders = (orders: Order[], limit: number = 5) => {
  return [...orders]
    .sort((a, b) => {
      // Handle both Date objects and date strings
      const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
      const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, limit)
    .map(order => {
      const now = new Date();
      const createdAt = order.createdAt instanceof Date ? order.createdAt : new Date(order.createdAt);
      const diff = now.getTime() - createdAt.getTime();
      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(minutes / 60);
      
      let timeAgo = '';
      if (minutes < 60) {
        timeAgo = `${minutes} min ago`;
      } else if (hours < 24) {
        timeAgo = `${hours} hour${hours > 1 ? 's' : ''} ago`;
      } else {
        const days = Math.floor(hours / 24);
        timeAgo = `${days} day${days > 1 ? 's' : ''} ago`;
      }

      return {
        id: order.id,
        customer: order.customerName,
        amount: `₹${order.totalAmount.toFixed(2)}`,
        status: order.status,
        time: timeAgo,
        items: order.items.length,
      };
    });
};

export const getProductCategories = (products: Product[]): ProductCategory[] => {
  const categoryMap = new Map<string, { count: number; revenue: number }>();
  
  products.forEach(product => {
    const existing = categoryMap.get(product.category) || { count: 0, revenue: 0 };
    categoryMap.set(product.category, {
      count: existing.count + 1,
      revenue: existing.revenue + product.revenue,
    });
  });

  const total = products.length;
  const categories: ProductCategory[] = [];
  let id = 1;

  categoryMap.forEach((value, name) => {
    categories.push({
      id: id++,
      name,
      count: value.count,
      percentage: parseFloat(((value.count / total) * 100).toFixed(1)),
      totalRevenue: value.revenue,
    });
  });

  return categories.sort((a, b) => b.count - a.count);
};

export const getProductsStats = (products: Product[]) => {
  return {
    total: products.length,
    inStock: products.filter(p => p.stock > p.threshold).length,
    lowStock: products.filter(p => p.stock <= p.threshold && p.stock > 0).length,
    outOfStock: products.filter(p => p.stock === 0).length,
  };
};

export const getCustomerSegments = (customers: Customer[]): CustomerSegment[] => {
  const total = customers.length;
  const segments = {
    VIP: customers.filter(c => c.segment === 'VIP'),
    Regular: customers.filter(c => c.segment === 'Regular'),
    Occasional: customers.filter(c => c.segment === 'Occasional'),
  };

  const avgSpend = (customers: Customer[]) => 
    customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.length;

  return [
    {
      type: 'VIP Customers',
      count: segments.VIP.length,
      percentage: parseFloat(((segments.VIP.length / total) * 100).toFixed(1)),
      avgSpend: Math.round(avgSpend(segments.VIP)),
      totalRevenue: segments.VIP.reduce((sum, c) => sum + c.totalSpent, 0),
    },
    {
      type: 'Regular Customers',
      count: segments.Regular.length,
      percentage: parseFloat(((segments.Regular.length / total) * 100).toFixed(1)),
      avgSpend: Math.round(avgSpend(segments.Regular)),
      totalRevenue: segments.Regular.reduce((sum, c) => sum + c.totalSpent, 0),
    },
    {
      type: 'Occasional Customers',
      count: segments.Occasional.length,
      percentage: parseFloat(((segments.Occasional.length / total) * 100).toFixed(1)),
      avgSpend: Math.round(avgSpend(segments.Occasional)),
      totalRevenue: segments.Occasional.reduce((sum, c) => sum + c.totalSpent, 0),
    },
  ];
};

export const getTopCustomers = (customers: Customer[], limit: number = 4) => {
  return [...customers]
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, limit)
    .map(c => {
      // Handle both Date objects and date strings
      const joinedDate = c.joinedDate instanceof Date ? c.joinedDate : new Date(c.joinedDate);
      return {
        name: c.name,
        orders: c.totalOrders,
        totalSpent: `₹${c.totalSpent.toLocaleString('en-IN')}`,
        joinedDate: joinedDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      };
    });
};

export const getCustomersStats = (customers: Customer[]) => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const newCustomers = customers.filter(c => {
    // Handle both Date objects and date strings
    const joinedDate = c.joinedDate instanceof Date ? c.joinedDate : new Date(c.joinedDate);
    return joinedDate >= thirtyDaysAgo;
  }).length;
  const returning = customers.filter(c => c.totalOrders > 1).length;

  return {
    total: customers.length,
    new: newCustomers,
    returning,
    growth: '+15.4%', // This would be calculated from historical data
  };
};

export const calculateDashboardMetrics = (
  products: Product[],
  orders: Order[],
  customers: Customer[],
  revenueSources: RevenueSource[]
): DashboardMetrics => {
  // Calculate total revenue from products' revenue field
  const totalRevenue = products.reduce((sum, p) => sum + (p.revenue || 0), 0);
  
  return {
    totalRevenue,
    revenueChange: '+12.5%',
    revenueTrend: 'up',
    totalOrders: orders.length,
    ordersChange: '+8.2%',
    ordersTrend: 'up',
    totalProducts: products.length,
    productsChange: '-2.3%',
    productsTrend: 'down',
    totalCustomers: customers.length,
    customersChange: '+15.4%',
    customersTrend: 'up',
  };
};

// CRUD Operations

export const addProduct = (products: Product[], newProduct: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product[] => {
  const maxId = products.reduce((max, p) => Math.max(max, p.id), 0);
  const product: Product = {
    ...newProduct,
    id: maxId + 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  return [...products, product];
};

export const updateProduct = (products: Product[], id: number, updates: Partial<Product>): Product[] => {
  return products.map(p => 
    p.id === id 
      ? { ...p, ...updates, updatedAt: new Date() }
      : p
  );
};

export const deleteProduct = (products: Product[], id: number): Product[] => {
  return products.filter(p => p.id !== id);
};

export const restockProduct = (products: Product[], id: number, quantity: number): Product[] => {
  return products.map(p => 
    p.id === id 
      ? { ...p, stock: p.stock + quantity, updatedAt: new Date() }
      : p
  );
};

export const addOrder = (orders: Order[], newOrder: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Order[] => {
  const maxOrderNum = orders.reduce((max, o) => {
    const num = parseInt(o.id.split('-')[1]);
    return Math.max(max, num);
  }, 0);
  
  const order: Order = {
    ...newOrder,
    id: `ORD-${(maxOrderNum + 1).toString().padStart(4, '0')}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  return [...orders, order];
};

export const updateOrderStatus = (orders: Order[], id: string, status: Order['status']): Order[] => {
  return orders.map(o => 
    o.id === id 
      ? { ...o, status, updatedAt: new Date() }
      : o
  );
};

export const addCustomer = (customers: Customer[], newCustomer: Omit<Customer, 'id' | 'joinedDate'>): Customer[] => {
  const maxId = customers.reduce((max, c) => Math.max(max, c.id), 0);
  const customer: Customer = {
    ...newCustomer,
    id: maxId + 1,
    joinedDate: new Date(),
  };
  return [...customers, customer];
};

export const updateCustomer = (customers: Customer[], id: number, updates: Partial<Customer>): Customer[] => {
  return customers.map(c => 
    c.id === id 
      ? { ...c, ...updates }
      : c
  );
};

// Vendor CRUD Operations

export const addVendor = (vendors: Vendor[], newVendor: Omit<Vendor, 'id' | 'joinedDate'>): Vendor[] => {
  const maxId = vendors.reduce((max, v) => Math.max(max, v.id), 0);
  const vendor: Vendor = {
    ...newVendor,
    id: maxId + 1,
    joinedDate: new Date(),
  };
  return [...vendors, vendor];
};

export const updateVendor = (vendors: Vendor[], id: number, updates: Partial<Vendor>): Vendor[] => {
  return vendors.map(v => 
    v.id === id 
      ? { ...v, ...updates }
      : v
  );
};

export const deleteVendor = (vendors: Vendor[], id: number): Vendor[] => {
  return vendors.filter(v => v.id !== id);
};

export const getTopVendors = (vendors: Vendor[], limit: number = 5) => {
  return [...vendors]
    .sort((a, b) => b.totalPurchases - a.totalPurchases)
    .slice(0, limit)
    .map(v => {
      const joinedDate = v.joinedDate instanceof Date ? v.joinedDate : new Date(v.joinedDate);
      return {
        name: v.name,
        company: v.company,
        totalProducts: v.totalProducts,
        totalPurchases: `₹${v.totalPurchases.toLocaleString('en-IN')}`,
        rating: v.rating,
        status: v.status,
      };
    });
};

export const getVendorsByStatus = (vendors: Vendor[]) => {
  return {
    active: vendors.filter(v => v.status === 'Active').length,
    inactive: vendors.filter(v => v.status === 'Inactive').length,
    total: vendors.length,
  };
};

// Initial vendor data
export const initialVendors: Vendor[] = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    email: 'rajesh@karnatakacc.com',
    phone: '+91 98765 11111',
    address: 'Coffee Estate, Chikmagalur, Karnataka',
    company: 'Karnataka Coffee Co.',
    category: 'Beverages',
    totalProducts: 3,
    totalPurchases: 45000,
    joinedDate: new Date('2024-01-10'),
    lastOrderDate: new Date('2024-12-15'),
    rating: 5,
    status: 'Active',
    paymentTerms: 'Net 30',
    notes: 'Premium quality organic coffee beans supplier',
  },
  {
    id: 2,
    name: 'Amit Patel',
    email: 'amit@dairyfarm.com',
    phone: '+91 98765 22222',
    address: 'Dairy Farm Complex, Anand, Gujarat',
    company: 'Dairy Farm',
    category: 'Dairy',
    totalProducts: 5,
    totalPurchases: 84000,
    joinedDate: new Date('2024-01-15'),
    lastOrderDate: new Date('2024-12-20'),
    rating: 5,
    status: 'Active',
    paymentTerms: 'Net 15',
    notes: 'Fresh dairy products, excellent quality',
  },
  {
    id: 3,
    name: 'Maria Fernandes',
    email: 'maria@oliveoilmill.com',
    phone: '+91 98765 33333',
    address: 'Oil Mill Road, Nashik, Maharashtra',
    company: 'Olive Oil Mill',
    category: 'Groceries',
    totalProducts: 2,
    totalPurchases: 122400,
    joinedDate: new Date('2024-01-20'),
    lastOrderDate: new Date('2024-12-18'),
    rating: 4,
    status: 'Active',
    paymentTerms: 'Net 30',
    notes: 'Extra virgin olive oil supplier',
  },
  {
    id: 4,
    name: 'Suresh Reddy',
    email: 'suresh@ricefarm.com',
    phone: '+91 98765 44444',
    address: 'Farm House, Warangal, Telangana',
    company: 'Rice Farm',
    category: 'Groceries',
    totalProducts: 4,
    totalPurchases: 41640,
    joinedDate: new Date('2024-02-01'),
    lastOrderDate: new Date('2024-12-19'),
    rating: 5,
    status: 'Active',
    paymentTerms: 'COD',
    notes: 'Organic rice and grains',
  },
  {
    id: 5,
    name: 'Priya Singh',
    email: 'priya@almondmilkco.com',
    phone: '+91 98765 55555',
    address: 'Industrial Area, Ludhiana, Punjab',
    company: 'Almond Milk Co.',
    category: 'Beverages',
    totalProducts: 2,
    totalPurchases: 36750,
    joinedDate: new Date('2024-02-05'),
    lastOrderDate: new Date('2024-12-17'),
    rating: 4,
    status: 'Active',
    paymentTerms: 'Net 30',
  },
  {
    id: 6,
    name: 'Thomas Matthew',
    email: 'thomas@bakery.com',
    phone: '+91 98765 66666',
    address: 'Baker Street, Kochi, Kerala',
    company: 'Bakery',
    category: 'Bakery',
    totalProducts: 6,
    totalPurchases: 20340,
    joinedDate: new Date('2024-02-10'),
    lastOrderDate: new Date('2024-12-21'),
    rating: 5,
    status: 'Active',
    paymentTerms: 'Net 7',
    notes: 'Fresh baked goods daily',
  },
  {
    id: 7,
    name: 'Lakshmi Krishnan',
    email: 'lakshmi@vegetablefarm.com',
    phone: '+91 98765 77777',
    address: 'Farm Land, Ooty, Tamil Nadu',
    company: 'Vegetable Farm',
    category: 'Vegetables',
    totalProducts: 8,
    totalPurchases: 13075,
    joinedDate: new Date('2024-02-20'),
    lastOrderDate: new Date('2024-12-20'),
    rating: 4,
    status: 'Active',
    paymentTerms: 'COD',
    notes: 'Fresh organic vegetables',
  },
];