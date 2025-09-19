import React from 'react';
import {
  Package,
  TrendingUp,
  AlertTriangle,
  ShoppingCart,
  DollarSign
} from 'lucide-react';
import { useProducts } from '../hooks/useProducts';

export const Dashboard: React.FC = () => {
  const { products, stockMovements, getLowStockProducts, getTotalValue, getTopSellingProducts } = useProducts();
  
  const lowStockProducts = getLowStockProducts();
  const totalValue = getTotalValue();
  const topSellingProducts = getTopSellingProducts();
  const recentMovements = stockMovements.slice(0, 5);

  const salesMovements = stockMovements.filter(m => m.type === 'out' && m.reason === 'Sale');
  const totalSalesValue = salesMovements.reduce((sum, m) => {
    const product = products.find(p => p.id === m.productId);
    return sum + (m.quantity * (product?.price || 0));
  }, 0);
  const totalSalesQuantity = salesMovements.reduce((sum, m) => sum + m.quantity, 0);
  const recentSales = salesMovements.slice(0, 5);

  const stats = [
    {
      title: 'Total Products',
      value: products.length,
      icon: Package,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Total Value',
      value: `₨ ${totalValue.toLocaleString()}`,
      icon: ({ className = "" }) => <span className={`text-white font-bold text-lg ${className}`}>₨</span>,
      color: 'bg-green-500',
      change: '+8%'
    },
    {
      title: 'Total Sales Value',
      value: `₨ ${totalSalesValue.toLocaleString()}`,
      icon: ({ className = "" }) => <span className={`text-white font-bold text-lg ${className}`}>₨</span>,
      color: 'bg-indigo-500',
      change: '+18%'
    },
    {
      title: 'Sales Quantity',
      value: totalSalesQuantity,
      icon: ShoppingCart,
      color: 'bg-yellow-500',
      change: '+10%'
    },
    {
      title: 'Low Stock Items',
      value: lowStockProducts.length,
      icon: AlertTriangle,
      color: 'bg-red-500',
      change: '-3%'
    },
    {
      title: 'Recent Sales',
      value: recentSales.length,
      icon: TrendingUp,
      color: 'bg-purple-500',
      change: '+15%'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <span className={`text-xs font-medium ${
                    stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                {React.createElement(stat.icon, { className: "h-6 w-6 text-white" })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alert */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Low Stock Alerts</h2>
            <AlertTriangle className="h-5 w-5 text-red-500" />
          </div>
          <div className="space-y-3">
            {lowStockProducts.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No low stock items</p>
            ) : (
              lowStockProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">SKU: {product.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-red-600">
                      {product.stock} / {product.minStock}
                    </p>
                    <p className="text-xs text-gray-500">Current / Min</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Sales */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Sales</h2>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <div className="space-y-3">
            {recentSales.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No recent sales</p>
            ) : (
              recentSales.map((movement) => {
                const product = products.find(p => p.id === movement.productId);
                const saleValue = movement.quantity * (product?.price || 0);
                return (
                  <div key={movement.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border">
                    <div className="flex items-center space-x-3">
                      <div className="bg-green-100 p-2 rounded-full">
                        <ShoppingCart className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{product?.name}</p>
                        <p className="text-sm text-gray-600">{movement.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">{movement.quantity} units</p>
                      <p className="text-sm text-gray-500">₨ {saleValue.toLocaleString()}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Top Selling Products */}
 {/* Top Selling Products */}
<div className="bg-white rounded-lg shadow-md p-6">
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-lg font-semibold text-gray-900">Top Products</h2>
    <ShoppingCart className="h-5 w-5 text-green-500" />
  </div>

  {topSellingProducts.length === 0 ? (
    <p className="text-gray-500 text-center py-6">
      No top selling products available
    </p>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {topSellingProducts.map((product, index) => (
        <div
          key={product.id}
          className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-blue-600">#{index + 1}</span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                product.stock > product.minStock
                  ? 'bg-green-100 text-green-600'
                  : 'bg-red-100 text-red-600'
              }`}
            >
              {product.stock} in stock
            </span>
          </div>
          <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
          <p className="text-sm text-gray-600 mb-2">{product.category}</p>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-gray-900">₨ {product.price}</span>
            <span className="text-sm text-gray-500">SKU: {product.sku}</span>
          </div>
        </div>
      ))}
    </div>
  )}
</div>

    </div>
  );
};