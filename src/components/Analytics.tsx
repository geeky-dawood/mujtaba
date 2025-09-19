import React, { useState } from 'react';
import {
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Calendar,
  BarChart3,
  DollarSign,
  FileText,
  PieChart
} from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { Product } from '../types';

export const Analytics: React.FC = () => {
  const { products, stockMovements, getLowStockProducts, getTotalValue } = useProducts();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getTotalProfit = () => {
    return products.reduce((total, product) => total + (product.stock * (product.price - product.cost)), 0);
  };

  const totalProfit = getTotalProfit();

  const salesMovements = stockMovements.filter(m => m.type === 'out' && m.reason === 'Sale');
  const damageMovements = stockMovements.filter(m => m.type === 'out' && (m.reason === 'Damage' || m.reason === 'Loss'));

  const totalSalesQuantity = salesMovements.reduce((sum, m) => sum + m.quantity, 0);
  const totalSalesValue = salesMovements.reduce((sum, m) => {
    const product = products.find(p => p.id === m.productId);
    return sum + (m.quantity * (product?.price || 0));
  }, 0);

  const totalDamageQuantity = damageMovements.reduce((sum, m) => sum + m.quantity, 0);
  const totalDamageValue = damageMovements.reduce((sum, m) => {
    const product = products.find(p => p.id === m.productId);
    return sum + (m.quantity * (product?.cost || 0)); // Use cost for damage value
  }, 0);

  const averageMargin = products.length > 0
    ? ((products.reduce((sum, p) => sum + ((p.price - p.cost) / p.price * 100), 0) / products.length).toFixed(1))
    : '0';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'stock' | 'value' | 'lastUpdated'>('name');

  const categories = [...new Set(products.map(p => p.category))];

  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'stock':
          return b.stock - a.stock;
        case 'value':
          return (b.stock * b.price) - (a.stock * a.price);
        case 'lastUpdated':
          return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const lowStockProducts = getLowStockProducts();
  const totalValue = getTotalValue();
  const outOfStockProducts = products.filter(p => p.stock === 0);

  const getStockStatus = (product: Product) => {
    if (product.stock === 0) return { color: 'text-red-600', bg: 'bg-red-100', label: 'Out of Stock' };
    if (product.stock <= product.minStock) return { color: 'text-orange-600', bg: 'bg-orange-100', label: 'Low Stock' };
    return { color: 'text-green-600', bg: 'bg-green-100', label: 'In Stock' };
  };

  const recentMovements = stockMovements.slice(0, 8);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
        <div className="text-sm text-gray-500">
          <Calendar className="h-4 w-4 inline mr-1" />
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{products.length}</p>
              <div className="flex items-center mt-2">
                <span className="text-xs font-medium text-green-600">+12%</span>
              </div>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <Package className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Stock Value</p>
              <p className="text-2xl font-bold text-gray-900">₨ {totalValue.toLocaleString()}</p>
              <div className="flex items-center mt-2">
                <span className="text-xs font-medium text-green-600">+8%</span>
              </div>
            </div>
            <div className="bg-green-500 p-3 rounded-lg flex items-center justify-center font-bold">
              ₨
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
              <p className="text-2xl font-bold text-gray-900">{lowStockProducts.length}</p>
              <div className="flex items-center mt-2">
                <span className="text-xs font-medium text-red-600">-3%</span>
              </div>
            </div>
            <div className="bg-orange-500 p-3 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Out of Stock</p>
              <p className="text-2xl font-bold text-gray-900">{outOfStockProducts.length}</p>
              <div className="flex items-center mt-2">
                <span className="text-xs font-medium text-green-600">+15%</span>
              </div>
            </div>
            <div className="bg-red-500 p-3 rounded-lg">
              <Package className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Profit</p>
              <p className="text-2xl font-bold text-gray-900">₨ {totalProfit.toLocaleString()}</p>
              <div className="flex items-center mt-2">
                <span className="text-xs font-medium text-green-600">+25%</span>
              </div>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-indigo-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Sales Qty</p>
              <p className="text-2xl font-bold text-gray-900">{totalSalesQuantity}</p>
              <div className="flex items-center mt-2">
                <span className="text-xs font-medium text-green-600">+10%</span>
              </div>
            </div>
            <div className="bg-indigo-500 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Sales Value</p>
              <p className="text-2xl font-bold text-gray-900">₨ {totalSalesValue.toLocaleString()}</p>
              <div className="flex items-center mt-2">
                <span className="text-xs font-medium text-green-600">+18%</span>
              </div>
            </div>
            <div className="bg-yellow-500 p-3 rounded-lg flex items-center justify-center font-bold">
              ₨
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-red-400">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Damage/Loss Qty</p>
              <p className="text-2xl font-bold text-gray-900">{totalDamageQuantity}</p>
              <div className="flex items-center mt-2">
                <span className="text-xs font-medium text-red-600">-5%</span>
              </div>
            </div>
            <div className="bg-red-400 p-3 rounded-lg">
              <TrendingDown className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Reports Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales History */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <FileText className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Sales History</h2>
            </div>
            <span className="text-sm text-gray-500">{salesMovements.length} transactions</span>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {salesMovements.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No sales recorded yet</p>
            ) : (
              salesMovements.map((movement) => {
                const product = products.find(p => p.id === movement.productId);
                const saleValue = product ? movement.quantity * product.price : 0;
                const saleProfit = product ? movement.quantity * (product.price - product.cost) : 0;
                return (
                  <div key={movement.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{product?.name}</p>
                        <p className="text-sm text-gray-600">{formatDate(movement.date)} - {movement.reference || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-600">- {movement.quantity} units</p>
                      <p className="text-sm text-gray-500">Value: ₨ {saleValue.toLocaleString()}</p>
                      <p className={`text-xs font-medium ${saleProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        Profit: ₨ {saleProfit.toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Damage/Loss Report */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <h2 className="text-lg font-semibold text-gray-900">Damage & Loss Report</h2>
            </div>
            <span className="text-sm text-gray-500">{damageMovements.length} incidents</span>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {damageMovements.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No damage or loss recorded</p>
            ) : (
              damageMovements.map((movement) => {
                const product = products.find(p => p.id === movement.productId);
                const lossValue = movement.quantity * (product?.cost || 0);
                return (
                  <div key={movement.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border">
                    <div className="flex items-center space-x-3">
                      <div className="bg-red-100 p-2 rounded-full">
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{product?.name}</p>
                        <p className="text-sm text-gray-600">{movement.reason} - {formatDate(movement.date)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-red-600">- {movement.quantity} units</p>
                      <p className="text-sm text-gray-500">Loss: ₨ {lossValue.toLocaleString()}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Profit Breakdown */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <PieChart className="h-5 w-5 text-green-600" />
            <h2 className="text-lg font-semibold text-gray-900">Profit Breakdown</h2>
          </div>
          <span className="text-sm text-gray-500">Unrealized profit in current stock</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Total Potential Profit</p>
              <p className="text-2xl font-bold text-green-900">₨ {totalProfit.toLocaleString()}</p>
              <p className="text-xs text-gray-500">Based on current stock levels</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Average Margin</p>
              <p className="text-2xl font-bold text-blue-900">{averageMargin}%</p>
              <p className="text-xs text-gray-500">Across all products</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">High Margin Products</p>
              <p className="text-2xl font-bold text-yellow-900">{products.filter(p => ((p.price - p.cost) / p.price * 100) > 30).length}</p>
              <p className="text-xs text-gray-500">Products with 30% margin</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Low Margin Products</p>
              <p className="text-2xl font-bold text-red-900">{products.filter(p => ((p.price - p.cost) / p.price * 100) < 15).length}</p>
              <p className="text-xs text-gray-500">Products with 15% margin</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter for Stock Listing */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {/* Category */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          {/* Sorting */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'name' | 'stock' | 'value' | 'lastUpdated')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="name">Sort by Name</option>
            <option value="stock">Sort by Stock</option>
            <option value="value">Sort by Value</option>
            <option value="lastUpdated">Sort by Last Updated</option>
          </select>

          {/* Filter Count */}
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Filter className="h-4 w-4" />
            <span>{filteredProducts.length} of {products.length} items</span>
          </div>
        </div>
      </div>

      {/* Stock Listing Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Current Stock Listing</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {['Product','SKU','Category','Stock','Status','Unit Price','Total Value','Last Updated'].map((head) => (
                  <th key={head} className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider text-sm">{head}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product);
                const totalValue = product.stock * product.price;
                
                return (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.supplier}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{product.sku}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{product.category}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{product.stock}</div>
                      <div className="text-sm text-gray-500">Min: {product.minStock}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${stockStatus.bg} ${stockStatus.color}`}>
                        {stockStatus.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">₨ {product.price}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">₨ {totalValue.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{product.lastUpdated}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="h-6 w-6 text-orange-600" />
            <h2 className="text-xl font-semibold text-gray-900">Low Stock Alert</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lowStockProducts.map((product) => (
              <div key={product.id} className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{product.name}</h3>
                  <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                    {product.sku}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Current: {product.stock}</span>
                  <span>Min: {product.minStock}</span>
                </div>
                <div className="mt-2 text-sm text-orange-700">
                  Reorder: {Math.max(product.minStock * 2 - product.stock, 0)} units recommended
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
