import React, { useState } from 'react';
import { 
  Package,
  Plus,
  Minus,
  TrendingUp,
  TrendingDown,
  Clock,
  Search,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { useProducts } from '../hooks/useProducts';

export const StockManagement: React.FC = () => {
  const { products, stockMovements, updateStock } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [movementType, setMovementType] = useState<'in' | 'out'>('in');
  const [reason, setReason] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const recentMovements = stockMovements.slice(0, 10);

  const handleStockUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || quantity <= 0 || !reason.trim()) return;

    updateStock(selectedProduct, quantity, movementType, reason);
    setQuantity(0);
    setReason('');
  };

  const getMovementIcon = (type: 'in' | 'out') => {
    return type === 'in' ? (
      <ArrowUp className="h-4 w-4 text-green-600" />
    ) : (
      <ArrowDown className="h-4 w-4 text-red-600" />
    );
  };

  const selectedProductData = products.find(p => p.id === selectedProduct);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Stock Management</h1>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Clock className="h-4 w-4" />
          <span>Last updated: {new Date().toLocaleString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stock Update Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Package className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Update Stock</h2>
          </div>

          <form onSubmit={handleStockUpdate} className="space-y-4">
            {/* Product Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Product
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Search by name or SKU..."
                />
              </div>
            </div>

            {/* Product Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Product *
              </label>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Choose a product</option>
                {filteredProducts.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name} - {product.sku} (Current: {product.stock})
                  </option>
                ))}
              </select>
            </div>

            {/* Current Stock Display */}
            {selectedProductData && (
              <div className="p-4 bg-gray-50 rounded-lg border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{selectedProductData.name}</p>
                    <p className="text-sm text-gray-600">SKU: {selectedProductData.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{selectedProductData.stock}</p>
                    <p className="text-sm text-gray-600">Current Stock</p>
                  </div>
                </div>
                {selectedProductData.stock <= selectedProductData.minStock && (
                  <div className="mt-2 p-2 bg-orange-100 rounded border border-orange-200">
                    <p className="text-sm text-orange-700">
                      ⚠️ Below minimum stock level ({selectedProductData.minStock})
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Movement Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Movement Type *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setMovementType('in')}
                  className={`p-3 rounded-lg border-2 flex items-center justify-center space-x-2 transition-colors ${
                    movementType === 'in'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-300 text-gray-600 hover:border-green-300'
                  }`}
                >
                  <Plus className="h-4 w-4" />
                  <span>Stock In</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMovementType('out')}
                  className={`p-3 rounded-lg border-2 flex items-center justify-center space-x-2 transition-colors ${
                    movementType === 'out'
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-300 text-gray-600 hover:border-red-300'
                  }`}
                >
                  <Minus className="h-4 w-4" />
                  <span>Stock Out</span>
                </button>
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity *
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter quantity"
                required
              />
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason *
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select reason</option>
                {movementType === 'in' ? (
                  <>
                    <option value="Purchase">Purchase</option>
                    <option value="Restock">Restock</option>
                    <option value="Return">Return</option>
                  </>
                ) : (
                  <>
                    <option value="Sale">Sale</option>
                    <option value="Damage">Damage</option>
                    <option value="Loss">Loss</option>
                    <option value="Return to Supplier">Return to Supplier</option>
                  </>
                )}
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors ${
                movementType === 'in'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {movementType === 'in' ? 'Add Stock' : 'Remove Stock'}
            </button>
          </form>
        </div>

        {/* Recent Stock Movements */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-3 mb-6">
            <TrendingUp className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Recent Movements</h2>
          </div>

          <div className="space-y-3">
            {recentMovements.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No stock movements yet</p>
            ) : (
              recentMovements.map((movement) => {
                const product = products.find(p => p.id === movement.productId);
                return (
                  <div key={movement.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${
                        movement.type === 'in' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {getMovementIcon(movement.type)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{product?.name}</p>
                        <p className="text-sm text-gray-600">{movement.reason}</p>
                        <p className="text-xs text-gray-500">{movement.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${
                        movement.type === 'in' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {movement.type === 'in' ? '+' : '-'}{movement.quantity}
                      </p>
                      {movement.reference && (
                        <p className="text-xs text-gray-500">{movement.reference}</p>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Quick Stock Overview */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Stock Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.slice(0, 8).map((product) => (
            <div key={product.id} className="p-4 bg-gray-50 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
                <span className={`w-3 h-3 rounded-full ${
                  product.stock > product.minStock ? 'bg-green-500' :
                  product.stock > 0 ? 'bg-orange-500' : 'bg-red-500'
                }`}></span>
              </div>
              <p className="text-sm text-gray-600 mb-1">SKU: {product.sku}</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900">{product.stock}</span>
                <span className="text-sm text-gray-500">Min: {product.minStock}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};