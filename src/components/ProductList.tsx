import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  Plus,
  Package,
  AlertTriangle,
  DollarSign
} from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { Product } from '../types';

interface ProductListProps {
  onEditProduct: (product: Product) => void;
  onAddProduct: () => void;
}

export const ProductList: React.FC<ProductListProps> = ({ onEditProduct, onAddProduct }) => {
  const { products, deleteProduct } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'stock' | 'price'>('name');

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
          return a.stock - b.stock;
        case 'price':
          return b.price - a.price;
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const handleDelete = (product: Product) => {
    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      deleteProduct(product.id);
    }
  };

  const getStockStatus = (product: Product) => {
    if (product.stock === 0) return { color: 'text-red-600', bg: 'bg-red-100', label: 'Out of Stock' };
    if (product.stock <= product.minStock) return { color: 'text-orange-600', bg: 'bg-orange-100', label: 'Low Stock' };
    return { color: 'text-green-600', bg: 'bg-green-100', label: 'In Stock' };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        <button
          onClick={onAddProduct}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'name' | 'stock' | 'price')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="name">Sort by Name</option>
            <option value="stock">Sort by Stock</option>
            <option value="price">Sort by Price</option>
          </select>

          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Filter className="h-4 w-4" />
            <span>{filteredProducts.length} of {products.length} products</span>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => {
          const stockStatus = getStockStatus(product);
          const profitMargin = ((product.price - product.cost) / product.price * 100).toFixed(1);
          
          return (
            <div key={product.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{product.category}</p>
                    <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEditProduct(product)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(product)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Stock Status */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Package className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Stock:</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{product.stock}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${stockStatus.bg} ${stockStatus.color}`}>
                        {stockStatus.label}
                      </span>
                    </div>
                  </div>

                  {/* Low Stock Warning */}
                  {product.stock <= product.minStock && (
                    <div className="flex items-center space-x-2 p-2 bg-orange-50 rounded-lg border border-orange-200">
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                      <span className="text-sm text-orange-700">Below minimum stock ({product.minStock})</span>
                    </div>
                  )}

                  {/* Pricing */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Price:</span>
                      </div>
                      <span className="text-lg font-bold text-gray-900">₨ {product.price}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Cost: ₨ {product.cost}</span>
                      <span className="text-green-600 font-medium">{profitMargin}% margin</span>
                    </div>
                  </div>

                  {/* Total Value */}
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Total Value:</span>
                      <span className="font-semibold text-gray-900">
                        ₨ {(product.stock * product.price).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Added: {product.dateAdded}</span>
                  <span>Updated: {product.lastUpdated}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || selectedCategory 
              ? "Try adjusting your search or filter criteria" 
              : "Get started by adding your first product"
            }
          </p>
          <button
            onClick={onAddProduct}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center space-x-2 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Product</span>
          </button>
        </div>
      )}
    </div>
  );
};