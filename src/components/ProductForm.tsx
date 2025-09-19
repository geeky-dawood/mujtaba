import React, { useState, useEffect } from 'react';
import { X, Save, Package } from 'lucide-react';
import { Product } from '../types';
import { useProducts } from '../hooks/useProducts';

interface ProductFormProps {
  product?: Product;
  onClose: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({ product, onClose }) => {
  const { addProduct, updateProduct } = useProducts();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    sku: '',
    stock: 0,
    minStock: 0,
    price: 0,
    cost: 0,
    description: '',
    supplier: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        category: product.category,
        sku: product.sku,
        stock: product.stock,
        minStock: product.minStock,
        price: product.price,
        cost: product.cost,
        description: product.description,
        supplier: product.supplier
      });
    }
  }, [product]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    if (!formData.sku.trim()) newErrors.sku = 'SKU is required';
    if (formData.stock < 0) newErrors.stock = 'Stock cannot be negative';
    if (formData.minStock < 0) newErrors.minStock = 'Minimum stock cannot be negative';
    if (formData.price <= 0) newErrors.price = 'Price must be greater than 0';
    if (formData.cost < 0) newErrors.cost = 'Cost cannot be negative';
    if (formData.cost >= formData.price) newErrors.cost = 'Cost should be less than price';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    if (product) {
      updateProduct(product.id, formData);
    } else {
      addProduct(formData);
    }
    
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

const categories = [
  'Chocolates',
  'Candies',
  'Lollipops',
  'Gummies & Jelly',
  'Chips',
  'Crisps (Slanty, Kurleez)',
  'Biscuits',
  'Nimko',
  'Gajak',
  'Rewari',
];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Package className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              {product ? 'Edit Product' : 'Add New Product'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Name */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter product name"
              />
              {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.category ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && <p className="text-red-600 text-sm mt-1">{errors.category}</p>}
            </div>

            {/* SKU */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SKU *
              </label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.sku ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="e.g., ABC-123"
              />
              {errors.sku && <p className="text-red-600 text-sm mt-1">{errors.sku}</p>}
            </div>

            {/* Stock Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Stock *
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.stock ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="0"
              />
              {errors.stock && <p className="text-red-600 text-sm mt-1">{errors.stock}</p>}
            </div>

            {/* Minimum Stock */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Stock *
              </label>
              <input
                type="number"
                name="minStock"
                value={formData.minStock}
                onChange={handleChange}
                min="0"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.minStock ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="0"
              />
              {errors.minStock && <p className="text-red-600 text-sm mt-1">{errors.minStock}</p>}
            </div>

            {/* Selling Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selling Price (Rs) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.price ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="0"
              />
              {errors.price && <p className="text-red-600 text-sm mt-1">{errors.price}</p>}
            </div>

            {/* Cost Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cost Price (Rs) *
              </label>
              <input
                type="number"
                name="cost"
                value={formData.cost}
                onChange={handleChange}
                min="0"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.cost ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="0"
              />
              {errors.cost && <p className="text-red-600 text-sm mt-1">{errors.cost}</p>}
              {formData.price > 0 && formData.cost > 0 && (
                <p className="text-sm text-gray-600 mt-1">
                  Profit Margin: {(((formData.price - formData.cost) / formData.price) * 100).toFixed(1)}%
                </p>
              )}
            </div>

            {/* Supplier */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Supplier
              </label>
              <input
                type="text"
                name="supplier"
                value={formData.supplier}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter supplier name"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter product description"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>{product ? 'Update' : 'Add'} Product</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};