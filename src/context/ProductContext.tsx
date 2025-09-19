import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product, StockMovement } from '../types';
// import { mockProducts, mockStockMovements } from '../data/mockData';

interface ProductContextType {
  products: Product[];
  stockMovements: StockMovement[];
  addProduct: (product: Omit<Product, 'id' | 'dateAdded' | 'lastUpdated'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateStock: (productId: string, quantity: number, type: 'in' | 'out', reason: string) => void;
  updateStockMovement: (id: string, updates: Partial<StockMovement>) => void;
  deleteStockMovement: (id: string) => void;
  getLowStockProducts: () => Product[];
  getTotalValue: () => number;
  getTopSellingProducts: () => Product[];
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProductContext must be used within ProductProvider');
  }
  return context;
};

interface ProductProviderProps {
  children: ReactNode;
}

export const ProductProvider: React.FC<ProductProviderProps> = ({ children }) => {
  // const [products, setProducts] = useState<Product[]>(mockProducts);
  // const [stockMovements, setStockMovements] = useState<StockMovement[]>(mockStockMovements);
    const [products, setProducts] = useState<Product[]>([]);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);

  const addProduct = (product: Omit<Product, 'id' | 'dateAdded' | 'lastUpdated'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      dateAdded: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(product => 
      product.id === id 
        ? { ...product, ...updates, lastUpdated: new Date().toISOString().split('T')[0] }
        : product
    ));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id));
  };

  const updateStock = (productId: string, quantity: number, type: 'in' | 'out', reason: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const newStock = type === 'in' ? product.stock + quantity : product.stock - quantity;
    if (newStock < 0) return; // Prevent negative stock

    updateProduct(productId, { stock: newStock });
    
    const movement: StockMovement = {
      id: Date.now().toString(),
      productId,
      type,
      quantity,
      date: new Date().toISOString().split('T')[0],
      reason
    };
    setStockMovements(prev => [movement, ...prev]);
  };

  const getLowStockProducts = () => {
    return products.filter(product => product.stock <= product.minStock);
  };

  const getTotalValue = () => {
    return products.reduce((total, product) => total + (product.stock * product.price), 0);
  };

  const getTopSellingProducts = () => {
    // Mock implementation - in real app would be based on actual sales data
    return products.slice(0, 3);
  };

  const updateStockMovement = (id: string, updates: Partial<StockMovement>) => {
    setStockMovements(prev => prev.map(movement =>
      movement.id === id ? { ...movement, ...updates } : movement
    ));
  };

  const deleteStockMovement = (id: string) => {
    setStockMovements(prev => prev.filter(movement => movement.id !== id));
  };

  const value: ProductContextType = {
    products,
    stockMovements,
    addProduct,
    updateProduct,
    deleteProduct,
    updateStock,
    updateStockMovement,
    deleteStockMovement,
    getLowStockProducts,
    getTotalValue,
    getTopSellingProducts
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};