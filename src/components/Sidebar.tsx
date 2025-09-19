import React from 'react';
import {
  LayoutDashboard,
  Package,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  X
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeView, 
  setActiveView, 
  isOpen, 
  setIsOpen 
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'stock', label: 'Stock Management', icon: TrendingUp },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'sales', label: 'Sales History', icon: TrendingUp },
    { id: 'damages', label: 'Damages History', icon: AlertTriangle },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
<div
  className={`
    fixed left-0 top-0 h-screen bg-white shadow-lg z-50 transition-transform duration-300
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    lg:translate-x-0 lg:static lg:shadow-none
    w-64
    flex flex-col
  `}
>
  <div className="p-6">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <Package className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Siddiqui</h1>
          <p className="text-xs text-gray-500">Snacks</p>
        </div>
      </div>
      <button 
        onClick={() => setIsOpen(false)}
        className="lg:hidden text-gray-500 hover:text-gray-700"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  </div>

  {/* Make nav scrollable if too long */}
  <nav className="px-6 pb-6 overflow-y-auto flex-1">
    <div className="space-y-2">
      {menuItems.map((item) => (
        <button
          key={item.id}
          onClick={() => {
            setActiveView(item.id);
            setIsOpen(false);
          }}
          className={`
            w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
            ${activeView === item.id 
              ? 'bg-blue-100 text-blue-700 border border-blue-200' 
              : 'text-gray-600 hover:bg-gray-100'
            }
          `}
        >
          <item.icon className="h-5 w-5" />
          <span className="font-medium">{item.label}</span>
        </button>
      ))}
    </div>
  </nav>
</div>

    </>
  );
};