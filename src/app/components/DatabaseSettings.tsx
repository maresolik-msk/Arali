import React, { useState } from 'react';
import { Database, Check, X, AlertCircle, ExternalLink, Key, Info } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { toast } from 'sonner';

interface DatabaseConfig {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'limited';
  coverage: string;
  cost: string;
  needsKey: boolean;
  keyName?: string;
  setupUrl?: string;
}

export function DatabaseSettings() {
  const [apiKeys, setApiKeys] = useState({
    upcitemdb: '',
    barcodeLookup: '',
    eanSearch: '',
    edamam: '',
    gs1India: '',
    indiamart: '',
    amazonIndia: '',
  });

  const databases: DatabaseConfig[] = [
    {
      id: 'internal',
      name: 'Your Database',
      description: 'Products you\'ve already scanned',
      status: 'active',
      coverage: 'Your Products',
      cost: 'FREE',
      needsKey: false,
    },
    {
      id: 'openFoodFactsIndia',
      name: 'Open Food Facts India 🇮🇳',
      description: '100,000+ Indian food products (Parle, Amul, Britannia, etc.)',
      status: 'active',
      coverage: 'Indian Food & FMCG',
      cost: 'FREE',
      needsKey: false,
    },
    {
      id: 'openFoodFacts',
      name: 'Open Food Facts',
      description: '2.8M+ food products worldwide',
      status: 'active',
      coverage: 'Food & Groceries',
      cost: 'FREE',
      needsKey: false,
    },
    {
      id: 'upcitemdb',
      name: 'UPCitemdb',
      description: 'General retail products',
      status: 'limited',
      coverage: 'General Merchandise',
      cost: 'FREE (100/day)',
      needsKey: false,
      keyName: 'VITE_UPCITEMDB_API_KEY',
      setupUrl: 'https://www.upcitemdb.com/api',
    },
    {
      id: 'gs1India',
      name: 'GS1 India (GEPIR) 🇮🇳',
      description: 'Official GS1-registered Indian products database',
      status: 'inactive',
      coverage: 'All GS1 Indian Products',
      cost: '₹10K-50K/year',
      needsKey: true,
      keyName: 'VITE_GS1_INDIA_API_KEY',
      setupUrl: 'https://www.gs1india.org/membership/',
    },
    {
      id: 'amazonIndia',
      name: 'Amazon India 🇮🇳',
      description: 'All products sold on Amazon India',
      status: 'inactive',
      coverage: 'Indian Consumer Products',
      cost: 'FREE (Associates)',
      needsKey: true,
      keyName: 'VITE_AMAZON_INDIA_API_KEY',
      setupUrl: 'https://affiliate.amazon.in/',
    },
    {
      id: 'indiamart',
      name: 'IndiaMART 🇮🇳',
      description: '70M+ products from Indian suppliers (B2B)',
      status: 'inactive',
      coverage: 'B2B/Wholesale Products',
      cost: 'Contact for pricing',
      needsKey: true,
      keyName: 'VITE_INDIAMART_API_KEY',
      setupUrl: 'https://www.indiamart.com/',
    },
    {
      id: 'barcodeLookup',
      name: 'Barcode Lookup',
      description: '450M+ products, best US coverage',
      status: 'inactive',
      coverage: 'US Retail Products',
      cost: '$20/month',
      needsKey: true,
      keyName: 'VITE_BARCODELOOKUP_API_KEY',
      setupUrl: 'https://www.barcodelookup.com/api',
    },
    {
      id: 'eanSearch',
      name: 'EAN Search',
      description: 'European product database',
      status: 'inactive',
      coverage: 'European Products',
      cost: '€29/month',
      needsKey: true,
      keyName: 'VITE_EANSEARCH_API_KEY',
      setupUrl: 'https://www.ean-search.org/ean-database-api.html',
    },
  ];

  const handleSaveKey = (dbId: string, keyName: string) => {
    const key = apiKeys[dbId as keyof typeof apiKeys];
    
    if (!key.trim()) {
      toast.error('Please enter an API key');
      return;
    }

    // In a real app, you'd save this securely
    toast.success('API key saved!', {
      description: `Add ${keyName}="${key}" to your .env.local file and restart the server`,
    });

    // Show instructions
    navigator.clipboard.writeText(`${keyName}="${key}"`);
    toast.info('Environment variable copied to clipboard!', {
      description: 'Paste it into your .env.local file',
      duration: 8000,
    });
  };

  const getStatusBadge = (status: DatabaseConfig['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/20 text-green-700 border-green-500/30">Active</Badge>;
      case 'limited':
        return <Badge className="bg-yellow-500/20 text-yellow-700 border-yellow-500/30">Limited</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-500/20 text-gray-700 border-gray-500/30">Inactive</Badge>;
    }
  };

  const getStatusIcon = (status: DatabaseConfig['status']) => {
    switch (status) {
      case 'active':
        return <Check className="w-5 h-5 text-green-600" />;
      case 'limited':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'inactive':
        return <X className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-[#0F4C81]/10">
              <Database className="w-6 h-6 text-[#0F4C81]" />
            </div>
            <h2 className="text-[#0F4C81]">Product Database Connections</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Manage external product databases for barcode scanning
          </p>
        </div>
      </div>

      {/* Info Banner */}
      <Card className="p-4 bg-blue-50/50 border-[#0F4C81]/20">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-[#0F4C81] flex-shrink-0 mt-0.5" />
          <div className="text-sm space-y-1">
            <p className="font-medium text-[#0F4C81]">How it works:</p>
            <p className="text-gray-600">
              When you scan a barcode, the app tries each database in order until it finds product information.
              You have <strong>Open Food Facts</strong> (free, unlimited) and <strong>UPCitemdb</strong> (100 free lookups/day) active.
            </p>
          </div>
        </div>
      </Card>

      {/* Database List */}
      <div className="space-y-4">
        {databases.map((db) => (
          <Card
            key={db.id}
            className={`p-5 border-2 transition-all ${
              db.status === 'active'
                ? 'border-[#0F4C81]/30 bg-[#0F4C81]/5'
                : 'border-gray-200 bg-white'
            }`}
          >
            <div className="space-y-4">
              {/* Header Row */}
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`p-2 rounded-lg ${
                    db.status === 'active' ? 'bg-[#0F4C81]/10' : 'bg-gray-100'
                  }`}>
                    {getStatusIcon(db.status)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-semibold ${
                        db.status === 'active' ? 'text-[#0F4C81]' : 'text-gray-700'
                      }`}>
                        {db.name}
                      </h3>
                      {getStatusBadge(db.status)}
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      {db.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Coverage:</span>{' '}
                        <span className="font-medium text-gray-700">{db.coverage}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Cost:</span>{' '}
                        <span className={`font-medium ${
                          db.cost.includes('FREE') ? 'text-green-600' : 'text-gray-700'
                        }`}>
                          {db.cost}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* API Key Input (if needed) */}
              {db.needsKey && db.keyName && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Key className="w-4 h-4" />
                        API Key Required
                      </Label>
                      {db.setupUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(db.setupUrl, '_blank')}
                          className="text-[#0F4C81] border-[#0F4C81]/20 hover:bg-[#0F4C81]/5"
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Get API Key
                        </Button>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Input
                        type="password"
                        placeholder="Enter your API key"
                        value={apiKeys[db.id as keyof typeof apiKeys] || ''}
                        onChange={(e) => setApiKeys(prev => ({ 
                          ...prev, 
                          [db.id]: e.target.value 
                        }))}
                        className="flex-1 bg-white border-[#0F4C81]/20 focus:border-[#0F4C81]"
                      />
                      <Button
                        onClick={() => handleSaveKey(db.id, db.keyName!)}
                        className="bg-[#0F4C81] hover:bg-[#0F4C81]/90 text-white"
                      >
                        Save
                      </Button>
                    </div>
                    
                    <p className="text-xs text-gray-500">
                      Environment variable: <code className="px-1.5 py-0.5 bg-gray-100 rounded text-[#0F4C81]">
                        {db.keyName}
                      </code>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Footer Help */}
      <Card className="p-4 bg-gray-50 border-gray-200">
        <div className="text-sm space-y-2">
          <p className="font-medium text-gray-700">💡 Tips:</p>
          <ul className="space-y-1 text-gray-600 list-disc list-inside">
            <li>Start with the free databases (Open Food Facts + UPCitemdb)</li>
            <li>Add paid databases if you need better coverage or higher limits</li>
            <li>Check the <code className="px-1.5 py-0.5 bg-white rounded text-[#0F4C81]">
              PRODUCT_DATABASE_GUIDE.md
            </code> file for detailed setup instructions</li>
            <li>Test with known barcodes after adding an API key</li>
          </ul>
        </div>
      </Card>

      {/* Test Barcodes */}
      <Card className="p-4 border-dashed border-2 border-gray-300">
        <p className="text-sm font-medium text-gray-700 mb-3">🧪 Test Barcodes:</p>
        
        {/* Indian Products */}
        <div className="mb-4">
          <p className="text-xs font-medium text-[#0F4C81] mb-2 flex items-center gap-1">
            🇮🇳 Indian Products:
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 bg-white rounded border">
              <code className="text-[#0F4C81]">8901063010628</code>
              <p className="text-gray-500 mt-1">Parle-G Gold</p>
            </div>
            <div className="p-2 bg-white rounded border">
              <code className="text-[#0F4C81]">8904063203205</code>
              <p className="text-gray-500 mt-1">Britannia Good Day</p>
            </div>
            <div className="p-2 bg-white rounded border">
              <code className="text-[#0F4C81]">8906010391515</code>
              <p className="text-gray-500 mt-1">Haldiram's Bhujia</p>
            </div>
            <div className="p-2 bg-white rounded border">
              <code className="text-[#0F4C81]">8901063015395</code>
              <p className="text-gray-500 mt-1">Parle Monaco</p>
            </div>
          </div>
        </div>

        {/* Global Products */}
        <div>
          <p className="text-xs font-medium text-gray-600 mb-2">
            🌍 Global Products:
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 bg-white rounded border">
              <code className="text-[#0F4C81]">5449000000996</code>
              <p className="text-gray-500 mt-1">Coca-Cola</p>
            </div>
            <div className="p-2 bg-white rounded border">
              <code className="text-[#0F4C81]">3017620422003</code>
              <p className="text-gray-500 mt-1">Nutella</p>
            </div>
            <div className="p-2 bg-white rounded border">
              <code className="text-[#0F4C81]">0190198068407</code>
              <p className="text-gray-500 mt-1">iPhone</p>
            </div>
            <div className="p-2 bg-white rounded border">
              <code className="text-[#0F4C81]">0044000032067</code>
              <p className="text-gray-500 mt-1">Oreos</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}