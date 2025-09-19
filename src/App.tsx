import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { ProductList } from './components/ProductList';
import { ProductForm } from './components/ProductForm';
import { SalesHistory } from './components/SalesHistory';
import { DamagesHistory } from './components/DamagesHistory';
import { StockManagement } from './components/StockManagement';
import { Analytics } from './components/Analytics';
import { Product } from './types';
import { ProductProvider } from './context/ProductContext';

function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleAddProduct = () => {
    setEditingProduct(undefined);
    setShowProductForm(true);
  };

  const handleCloseProductForm = () => {
    setShowProductForm(false);
    setEditingProduct(undefined);
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'products':
        return (
          <ProductList 
            onEditProduct={handleEditProduct}
            onAddProduct={handleAddProduct}
          />
        );
      case 'stock':
        return <StockManagement />;
      case 'analytics':
        return <Analytics />;
      case 'sales':
        return <SalesHistory />;
      case 'damages':
        return <DamagesHistory />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ProductProvider>
      <div className="h-screen bg-gray-50 flex">
        <Sidebar
          activeView={activeView}
          setActiveView={setActiveView}
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
        />
        
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Mobile header */}
          <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(true)}
                className="text-gray-600 hover:text-gray-900"
              >
                <Menu className="h-6 w-6" />
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">S</span>
                </div>
                <h1 className="text-lg font-semibold text-gray-900">Siddiqui</h1>
              </div>
              <div className="w-6"></div>
            </div>
          </div>

          {/* Main content */}
          <main className="p-4 lg:p-8">
            {renderActiveView()}
          </main>
        </div>

        {/* Product Form Modal */}
        {showProductForm && (
          <ProductForm
            product={editingProduct}
            onClose={handleCloseProductForm}
          />
        )}
      </div>
    </ProductProvider>
  );
}

export default App;