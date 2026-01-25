import { LucideIcon, ShoppingBag, TrendingUp, Boxes, Smartphone, IndianRupee, Calendar, Leaf, AlertTriangle, Lightbulb } from 'lucide-react';

export interface BlogContentBlock {
  type: 'paragraph' | 'heading' | 'subheading' | 'list' | 'tip' | 'quote' | 'image';
  value: string | string[];
  title?: string;
  imageUrl?: string;
  imageCaption?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  readTime: string;
  coverImage: string;
  content: BlogContentBlock[];
  publishedAt: string;
  author: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    slug: 'getting-started-with-arali',
    title: 'Getting Started with Arali – A Simple Guide for Shop Owners',
    subtitle: 'A Simple Guide for Shop Owners',
    description: 'Running a kirana or small retail shop is already demanding. Arali is designed to simplify this daily chaos.',
    category: 'Guides',
    readTime: '4 min read',
    coverImage: 'https://images.unsplash.com/photo-1758328522081-3322352200df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFsbCUyMHJldGFpbCUyMHNob3AlMjBvd25lciUyMGhhcHB5fGVufDF8fHx8MTc2OTA5NDM3M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    publishedAt: 'Jan 15, 2026',
    author: 'Arali Team',
    content: [
      {
        type: 'paragraph',
        value: 'Running a kirana or small retail shop is already demanding. Managing stock, remembering prices, tracking sales, and handling customers — all at once — can become overwhelming. Arali is designed to simplify this daily chaos and bring clarity to your business.'
      },
      {
        type: 'heading',
        value: 'Why Use Arali for Your Shop'
      },
      {
        type: 'list',
        value: [
          'No more paper notebooks',
          'No forgotten sales or missing stock',
          'Clear understanding of profits',
          'Faster billing and customer handling'
        ]
      },
      {
        type: 'heading',
        value: 'Step-by-Step: Using Arali'
      },
      {
        type: 'list',
        value: [
          'Create your shop profile',
          'Add products with prices',
          'Record daily sales',
          'Track stock automatically',
          'View business summary on dashboard'
        ]
      },
      {
        type: 'heading',
        value: 'Daily Habit That Wins'
      },
      {
        type: 'paragraph',
        value: 'Spend 5 minutes every day checking your dashboard. This alone improves decision-making.'
      },
      {
        type: 'heading',
        value: 'Common Mistakes to Avoid'
      },
      {
        type: 'list',
        value: [
          'Not updating stock regularly',
          'Ignoring reports',
          'Mixing personal and shop expenses'
        ]
      },
      {
        type: 'heading',
        value: 'Summary'
      },
      {
        type: 'paragraph',
        value: 'Arali is not just an app — it’s your digital shop assistant.'
      },
      {
        type: 'tip',
        title: 'Call to Action',
        value: 'Start managing your shop digitally today.'
      }
    ]
  },
  {
    id: '2',
    slug: 'digital-records-profit-growth',
    title: 'How Digital Records Can Increase Your Shop Profits',
    subtitle: 'Stop losing money to manual errors.',
    description: 'Many shop owners work hard but still don’t know their real profits. The reason? Manual records hide losses.',
    category: 'Business Tips',
    readTime: '5 min read',
    coverImage: 'https://images.unsplash.com/photo-1742836531271-98fd8151d257?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwdGFibGV0JTIwcmV0YWlsJTIwc2hvcHxlbnwxfHx8fDE3NjkwOTQzNzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    publishedAt: 'Jan 18, 2026',
    author: 'Rajesh Kumar',
    content: [
      {
        type: 'paragraph',
        value: 'Many shop owners work hard but still don’t know their real profits. The reason? Manual records hide losses.'
      },
      {
        type: 'heading',
        value: 'Problems with Manual Tracking'
      },
      {
        type: 'list',
        value: [
          'Missed sales entries',
          'Incorrect pricing',
          'Stock mismatch',
          'No profit visibility'
        ]
      },
      {
        type: 'heading',
        value: 'How Digital Records Help'
      },
      {
        type: 'list',
        value: [
          'Every sale is recorded',
          'Clear profit and loss view',
          'Identify slow-moving products',
          'Reduce daily leakage'
        ]
      },
      {
        type: 'heading',
        value: 'Arali Advantage'
      },
      {
        type: 'paragraph',
        value: 'Arali automatically tracks:'
      },
      {
        type: 'list',
        value: [
          'Total sales',
          'Product-wise performance',
          'Stock usage'
        ]
      },
      {
        type: 'heading',
        value: 'Real Impact'
      },
      {
        type: 'paragraph',
        value: 'Even a 2–5% leakage reduction can significantly increase monthly income.'
      },
      {
        type: 'heading',
        value: 'Summary'
      },
      {
        type: 'paragraph',
        value: 'Knowing numbers gives control. Control gives profit.'
      }
    ]
  },
  {
    id: '3',
    slug: 'smart-inventory-management',
    title: 'Smart Inventory Management for Kirana Stores',
    subtitle: 'Never run out, never waste.',
    description: 'Inventory is money sitting on your shelf. Poor inventory control means locked cash and wastage.',
    category: 'Inventory',
    readTime: '6 min read',
    coverImage: 'https://images.unsplash.com/photo-1760463921652-78b38572da45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncm9jZXJ5JTIwc3RvcmUlMjBzaGVsdmVzJTIwb3JnYW5pemVkfGVufDF8fHx8MTc2OTA5NDM3N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    publishedAt: 'Jan 20, 2026',
    author: 'Arali Team',
    content: [
      {
        type: 'paragraph',
        value: 'Inventory is money sitting on your shelf. Poor inventory control means locked cash and wastage.'
      },
      {
        type: 'heading',
        value: 'Common Inventory Problems'
      },
      {
        type: 'list',
        value: [
          'Overstocking slow items',
          'Understocking fast items',
          'Expired products'
        ]
      },
      {
        type: 'heading',
        value: 'Smart Inventory Practices'
      },
      {
        type: 'list',
        value: [
          'Track stock daily',
          'Identify fast & slow movers',
          'Plan purchases weekly'
        ]
      },
      {
        type: 'heading',
        value: 'Using Arali for Inventory'
      },
      {
        type: 'list',
        value: [
          'Low stock alerts',
          'Product-wise stock view',
          'Easy updates'
        ]
      },
      {
        type: 'tip',
        title: 'Pro Tip',
        value: 'Sell slow items with small offers before expiry.'
      },
      {
        type: 'heading',
        value: 'Summary'
      },
      {
        type: 'paragraph',
        value: 'Smart inventory = better cash flow + less stress.'
      }
    ]
  },
  {
    id: '4',
    slug: 'faster-customer-order-handling',
    title: 'How to Handle Customer Orders Faster Using Arali',
    subtitle: 'Speed up your checkout process.',
    description: 'Customers value speed and accuracy. Delays cost trust.',
    category: 'Customer Service',
    readTime: '4 min read',
    coverImage: 'https://images.unsplash.com/photo-1761783536272-2fb78dd52c76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaG9wJTIwb3duZXIlMjBoZWxwaW5nJTIwY3VzdG9tZXJ8ZW58MXx8fHwxNzY5MDk0Mzc3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    publishedAt: 'Jan 22, 2026',
    author: 'Priya Sharma',
    content: [
      {
        type: 'paragraph',
        value: 'Customers value speed and accuracy. Delays cost trust.'
      },
      {
        type: 'heading',
        value: 'Traditional Order Issues'
      },
      {
        type: 'list',
        value: [
          'Forgotten items',
          'Wrong quantities',
          'Slow billing'
        ]
      },
      {
        type: 'heading',
        value: 'Digital Order Handling'
      },
      {
        type: 'list',
        value: [
          'Record customer lists',
          'Reduce errors',
          'Faster checkout'
        ]
      },
      {
        type: 'heading',
        value: 'Arali in Action'
      },
      {
        type: 'list',
        value: [
          'Save item lists',
          'Repeat orders easily',
          'Build loyal customers'
        ]
      },
      {
        type: 'heading',
        value: 'Business Benefit'
      },
      {
        type: 'paragraph',
        value: 'Faster service = more customers per day.'
      }
    ]
  },
  {
    id: '5',
    slug: 'pricing-products-for-profit',
    title: 'Pricing Your Products Correctly for Maximum Profit',
    subtitle: 'Selling more doesn’t always mean earning more.',
    description: 'Pricing decides profit. Selling more doesn’t always mean earning more.',
    category: 'Finance',
    readTime: '7 min read',
    coverImage: 'https://images.unsplash.com/photo-1585752475238-52db8826b2f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBjdXJyZW5jeSUyMGNvdW50aW5nfGVufDF8fHx8MTc2OTA5NDM3OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    publishedAt: 'Jan 25, 2026',
    author: 'Financial Expert',
    content: [
      {
        type: 'paragraph',
        value: 'Selling more doesn’t always mean earning more. Pricing decides profit.'
      },
      {
        type: 'heading',
        value: 'Pricing Mistakes'
      },
      {
        type: 'list',
        value: [
          'Too low margins',
          'Blind discounts',
          'Copying competitors blindly'
        ]
      },
      {
        type: 'heading',
        value: 'Smart Pricing Strategy'
      },
      {
        type: 'list',
        value: [
          'Know your cost',
          'Fix minimum margin',
          'Track profit per item'
        ]
      },
      {
        type: 'heading',
        value: 'Arali Pricing Support'
      },
      {
        type: 'list',
        value: [
          'Update prices easily',
          'Track performance',
          'Compare products'
        ]
      },
      {
        type: 'heading',
        value: 'Summary'
      },
      {
        type: 'paragraph',
        value: 'Right pricing protects your hard work.'
      }
    ]
  },
  {
    id: '6',
    slug: 'daily-shop-routines',
    title: 'Daily, Weekly, and Monthly Shop Routine Using Arali',
    subtitle: 'Discipline creates success.',
    description: 'A simple routine keeps your business healthy. Discipline creates success.',
    category: 'Operations',
    readTime: '5 min read',
    coverImage: 'https://images.unsplash.com/photo-1692158961562-cb06d93fb63c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVja2xpc3QlMjBub3RlcGFkJTIwc2hvcHxlbnwxfHx8fDE3NjkwOTQzNzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    publishedAt: 'Jan 28, 2026',
    author: 'Arali Team',
    content: [
      {
        type: 'paragraph',
        value: 'Discipline creates success. A simple routine keeps your business healthy.'
      },
      {
        type: 'heading',
        value: 'Daily Tasks'
      },
      {
        type: 'list',
        value: [
          'Record sales',
          'Check stock'
        ]
      },
      {
        type: 'heading',
        value: 'Weekly Tasks'
      },
      {
        type: 'list',
        value: [
          'Review slow items',
          'Plan purchases'
        ]
      },
      {
        type: 'heading',
        value: 'Monthly Tasks'
      },
      {
        type: 'list',
        value: [
          'Check profit reports',
          'Improve pricing'
        ]
      },
      {
        type: 'heading',
        value: 'Arali Makes It Easy'
      },
      {
        type: 'paragraph',
        value: 'All data in one place — no confusion.'
      }
    ]
  },
  {
    id: '7',
    slug: 'reducing-wastage-expiry-loss',
    title: 'How to Reduce Wastage and Expired Products',
    subtitle: 'Wastage silently eats profits.',
    description: 'Wastage silently eats profits. Learn why it happens and how to fix it.',
    category: 'Sustainability',
    readTime: '5 min read',
    coverImage: 'https://images.unsplash.com/photo-1748342319942-223b99937d4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHZlZ2V0YWJsZXMlMjBtYXJrZXR8ZW58MXx8fHwxNzY5MDA3NjQyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    publishedAt: 'Feb 01, 2026',
    author: 'Green Retail',
    content: [
      {
        type: 'paragraph',
        value: 'Wastage silently eats profits.'
      },
      {
        type: 'heading',
        value: 'Why Wastage Happens'
      },
      {
        type: 'list',
        value: [
          'Overstocking',
          'No expiry tracking',
          'Poor rotation'
        ]
      },
      {
        type: 'heading',
        value: 'Solutions'
      },
      {
        type: 'list',
        value: [
          'FIFO method',
          'Smaller bulk buying',
          'Regular checks'
        ]
      },
      {
        type: 'heading',
        value: 'Arali Support'
      },
      {
        type: 'list',
        value: [
          'Stock visibility',
          'Better planning'
        ]
      },
      {
        type: 'heading',
        value: 'Summary'
      },
      {
        type: 'paragraph',
        value: 'Less wastage = direct profit.'
      }
    ]
  },
  {
    id: '8',
    slug: 'eco-friendly-shop-practices',
    title: 'Importance of Environment-Friendly Practices for Small Shops',
    subtitle: 'Good for the planet, good for business.',
    description: 'Customers prefer responsible businesses. Eco-friendly shops build long-term trust.',
    category: 'Sustainability',
    readTime: '4 min read',
    coverImage: 'https://images.unsplash.com/photo-1761793126810-58e0cd971057?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlY28lMjBmcmllbmRseSUyMHNob3BwaW5nJTIwYmFnfGVufDF8fHx8MTc2OTA5NDM3OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    publishedAt: 'Feb 05, 2026',
    author: 'Eco Team',
    content: [
      {
        type: 'paragraph',
        value: 'Customers prefer responsible businesses.'
      },
      {
        type: 'heading',
        value: 'Eco-Friendly Practices'
      },
      {
        type: 'list',
        value: [
          'Reduce plastic bags',
          'Avoid paper waste',
          'Save electricity'
        ]
      },
      {
        type: 'heading',
        value: 'Digital = Green'
      },
      {
        type: 'paragraph',
        value: 'Using Arali reduces paper usage and clutter.'
      },
      {
        type: 'heading',
        value: 'Business Advantage'
      },
      {
        type: 'paragraph',
        value: 'Eco-friendly shops build long-term trust.'
      }
    ]
  },
  {
    id: '9',
    slug: 'common-kirana-mistakes',
    title: 'Top Mistakes Kirana Store Owners Make (And How to Fix Them)',
    subtitle: 'Avoid these common pitfalls.',
    description: 'We have analyzed hundreds of shops. Here are the most common reasons why some struggle while others succeed.',
    category: 'Strategy',
    readTime: '6 min read',
    coverImage: 'https://images.unsplash.com/photo-1717007251602-a5a2ac72fca7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlc3NlZCUyMHNob3AlMjBvd25lcnxlbnwxfHx8fDE3NjkwOTQzNzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    publishedAt: 'Feb 10, 2026',
    author: 'Business Analyst',
    content: [
      {
        type: 'heading',
        value: 'Common Mistakes'
      },
      {
        type: 'list',
        value: [
          'No records',
          'Guess-based decisions',
          'Ignoring stock data'
        ]
      },
      {
        type: 'heading',
        value: 'How to Fix'
      },
      {
        type: 'list',
        value: [
          'Use digital tools',
          'Track daily numbers',
          'Review monthly'
        ]
      },
      {
        type: 'heading',
        value: 'Arali as Solution'
      },
      {
        type: 'paragraph',
        value: 'One app to manage everything.'
      }
    ]
  },
  {
    id: '10',
    slug: 'future-of-kirana-stores',
    title: 'From Notebook to Mobile App – The Future of Kirana Business',
    subtitle: 'Retail is changing. Stay ahead.',
    description: 'Retail is changing. Customers expect speed and accuracy. From Notebook to Mobile App is the future.',
    category: 'Future Trends',
    readTime: '5 min read',
    coverImage: 'https://images.unsplash.com/photo-1725859177379-a0be49d3eba7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXR1cmlzdGljJTIwZGlnaXRhbCUyMHN0b3JlfGVufDF8fHx8MTc2OTA5NDM3OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    publishedAt: 'Feb 15, 2026',
    author: 'Tech Observer',
    content: [
      {
        type: 'paragraph',
        value: 'Retail is changing. Customers expect speed and accuracy.'
      },
      {
        type: 'heading',
        value: 'Why Digital Matters'
      },
      {
        type: 'list',
        value: [
          'Compete with supermarkets',
          'Build loyalty',
          'Stay organized'
        ]
      },
      {
        type: 'heading',
        value: 'Future-Ready Shop'
      },
      {
        type: 'list',
        value: [
          'Digital records',
          'Smart inventory',
          'Data-based decisions'
        ]
      },
      {
        type: 'heading',
        value: 'Arali Vision'
      },
      {
        type: 'paragraph',
        value: 'Empowering small shops to grow confidently.'
      }
    ]
  }
];