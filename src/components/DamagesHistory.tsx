import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  AlertTriangle,
  Calendar,
  Package,
  Edit2, 
  Trash2, 
  X, 
  Save
} from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { StockMovement } from '../types';

export const DamagesHistory: React.FC = () => {
  const { products, stockMovements, updateStockMovement, deleteStockMovement } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [editingMovement, setEditingMovement] = useState<StockMovement | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [tempQuantity, setTempQuantity] = useState(0);
  const [tempDate, setTempDate] = useState('');
  const [tempReason, setTempReason] = useState('');
  const [tempReference, setTempReference] = useState('');

  const categories = [...new Set(products.map(p => p.category))];

  const damageReasons = ['Damage', 'Loss', 'Return to Supplier'];

  const damageMovements = stockMovements.filter(m => m.type === 'out' && damageReasons.includes(m.reason))
    .filter(movement => {
      const product = products.find(p => p.id === movement.productId);
      const matchesSearch = !searchTerm || 
        product?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product?.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || product?.category === selectedCategory;
      const movementDate = new Date(movement.date);
      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate) : null;
      const matchesDate = (!from || movementDate >= from) && (!to || movementDate <= to);
      return matchesSearch && matchesCategory && matchesDate;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const totalDamageQuantity = damageMovements.reduce((sum, m) => sum + m.quantity, 0);
  const totalDamageValue = damageMovements.reduce((sum, m) => {
    const product = products.find(p => p.id === m.productId);
    return sum + (m.quantity * (product?.cost || 0));
  }, 0);

  const handleEdit = (movement: StockMovement) => {
    setEditingMovement(movement);
    setTempQuantity(movement.quantity);
    setTempDate(movement.date);
    setTempReason(movement.reason);
    setTempReference(movement.reference || '');
    setShowModal(true);
  };

  const handleSaveEdit = () => {
    if (editingMovement) {
      updateStockMovement(editingMovement.id, {
        quantity: tempQuantity,
        date: tempDate,
        reason: tempReason,
        reference: tempReference
      });
    }
    setShowModal(false);
    setEditingMovement(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this damage record?')) {
      deleteStockMovement(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Damages History</h1>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>Total: {damageMovements.length} records</span>
          <span>Qty: {totalDamageQuantity}</span>
          <span>Value: ₨ {totalDamageValue.toLocaleString()}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search product or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />

          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Filter className="h-4 w-4" />
            <span>{damageMovements.length} results</span>
          </div>
        </div>
      </div>

      {/* Damages Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Damage Transactions</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider text-sm">Date</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider text-sm">Product</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider text-sm">SKU</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider text-sm">Category</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider text-sm">Quantity</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider text-sm">Cost</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider text-sm">Total Loss</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider text-sm">Reason</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider text-sm">Reference</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {damageMovements.map((movement) => {
                const product = products.find(p => p.id === movement.productId);
                const totalLoss = movement.quantity * (product?.cost || 0);
                return (
                  <tr key={movement.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {formatDate(movement.date)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{product?.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{product?.sku}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{product?.category}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{movement.quantity}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">₨ {product?.cost.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm font-medium text-red-600">₨ {totalLoss.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{movement.reason}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{movement.reference || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(movement)}
                          className="p-1 text-red-600 hover:text-red-800"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(movement.id)}
                          className="p-1 text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {damageMovements.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No damages found</h3>
          <p className="text-gray-500">
            {searchTerm || fromDate || toDate || selectedCategory 
              ? "Try adjusting your filters" 
              : "No damage records yet"
            }
          </p>
        </div>
      )}

      {/* Edit Modal */}
      {showModal && editingMovement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-6 w-6 text-red-600" />
                <h2 className="text-xl font-semibold text-gray-900">Edit Damage</h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <input
                  type="number"
                  value={tempQuantity}
                  onChange={(e) => setTempQuantity(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={tempDate}
                  onChange={(e) => setTempDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
                <select
                  value={tempReason}
                  onChange={(e) => setTempReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="Damage">Damage</option>
                  <option value="Loss">Loss</option>
                  <option value="Return to Supplier">Return to Supplier</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reference</label>
                <input
                  type="text"
                  value={tempReference}
                  onChange={(e) => setTempReference(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Damage ID or reference"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>Update</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};