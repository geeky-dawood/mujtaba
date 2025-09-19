// import { Product, StockMovement } from '../types';

// export const mockProducts: Product[] = [
//   // 🍫 Chocolates
//   {
//     id: '1',
//     name: 'Cadbury Dairy Milk (38g)',
//     category: 'Chocolates',
//     sku: 'CDM-001',
//     stock: 100,
//     minStock: 20,
//     price: 180,
//     cost: 120,
//     description: 'Smooth and creamy milk chocolate bar',
//     supplier: 'Cadbury Pakistan',
//     dateAdded: '2024-01-15',
//     lastUpdated: '2024-12-20'
//   },
//   {
//     id: '2',
//     name: 'KitKat (4 Finger)',
//     category: 'Chocolates',
//     sku: 'KTK-002',
//     stock: 85,
//     minStock: 15,
//     price: 160,
//     cost: 110,
//     description: 'Crispy wafer fingers covered with milk chocolate',
//     supplier: 'Nestlé Pakistan',
//     dateAdded: '2024-02-01',
//     lastUpdated: '2024-12-18'
//   },

//   // 🍬 Candies
//   {
//     id: '3',
//     name: 'CandyLand Chillz',
//     category: 'Candies',
//     sku: 'CLC-003',
//     stock: 200,
//     minStock: 40,
//     price: 5,
//     cost: 2,
//     description: 'Cool mint-flavored candy',
//     supplier: 'Ismail Industries',
//     dateAdded: '2024-03-01',
//     lastUpdated: '2024-12-19'
//   },
//   {
//     id: '4',
//     name: 'ABC Goli Candy',
//     category: 'Candies',
//     sku: 'ABC-004',
//     stock: 300,
//     minStock: 50,
//     price: 2,
//     cost: 1,
//     description: 'Classic colorful goli candy',
//     supplier: 'Local Distributor',
//     dateAdded: '2024-02-10',
//     lastUpdated: '2024-12-17'
//   },

//   // 🍭 Lollipops
//   {
//     id: '5',
//     name: 'Chupa Chups Strawberry',
//     category: 'Lollipops',
//     sku: 'CC-005',
//     stock: 150,
//     minStock: 25,
//     price: 30,
//     cost: 18,
//     description: 'Strawberry flavored lollipop',
//     supplier: 'Chupa Chups Pakistan',
//     dateAdded: '2024-01-25',
//     lastUpdated: '2024-12-15'
//   },

//   // 🐻 Gummies & Jelly
//   {
//     id: '6',
//     name: 'CandyLand Jellies (Fruit Mix)',
//     category: 'Gummies & Jelly',
//     sku: 'CLJ-006',
//     stock: 180,
//     minStock: 30,
//     price: 50,
//     cost: 30,
//     description: 'Assorted fruit-flavored jelly candies',
//     supplier: 'Ismail Industries',
//     dateAdded: '2024-02-18',
//     lastUpdated: '2024-12-19'
//   },

//   // 🍟 Chips
//   {
//     id: '7',
//     name: 'Lays Masala',
//     category: 'Chips',
//     sku: 'LAYS-007',
//     stock: 120,
//     minStock: 20,
//     price: 50,
//     cost: 30,
//     description: 'Masala-flavored potato chips',
//     supplier: 'PepsiCo Pakistan',
//     dateAdded: '2024-03-05',
//     lastUpdated: '2024-12-18'
//   },

//   // 🥨 Crisps (Slanty, Kurleez)
//   {
//     id: '8',
//     name: 'Slanty Cheese Flavor',
//     category: 'Crisps (Slanty, Kurleez)',
//     sku: 'SLT-008',
//     stock: 95,
//     minStock: 18,
//     price: 40,
//     cost: 22,
//     description: 'Cheese flavored corn crisps',
//     supplier: 'Ismail Industries',
//     dateAdded: '2024-02-22',
//     lastUpdated: '2024-12-16'
//   },

//   // 🍪 Biscuits
//   {
//     id: '9',
//     name: 'Peek Freans Sooper (Half Roll)',
//     category: 'Biscuits',
//     sku: 'PF-009',
//     stock: 210,
//     minStock: 35,
//     price: 120,
//     cost: 75,
//     description: 'Egg and milk biscuits',
//     supplier: 'EBM Pakistan',
//     dateAdded: '2024-03-01',
//     lastUpdated: '2024-12-17'
//   },

//   // 🌶️ Nimko
//   {
//     id: '10',
//     name: 'Mix Nimko (200g)',
//     category: 'Nimko',
//     sku: 'NMK-010',
//     stock: 80,
//     minStock: 15,
//     price: 160,
//     cost: 100,
//     description: 'Spicy traditional Pakistani nimko mix',
//     supplier: 'Local Manufacturer',
//     dateAdded: '2024-02-28',
//     lastUpdated: '2024-12-15'
//   },

//   // 🍯 Gajak
//   {
//     id: '11',
//     name: 'Til Gajak (250g)',
//     category: 'Gajak',
//     sku: 'GJK-011',
//     stock: 60,
//     minStock: 12,
//     price: 220,
//     cost: 150,
//     description: 'Traditional sesame jaggery sweet',
//     supplier: 'Local Sweet Shop',
//     dateAdded: '2024-01-20',
//     lastUpdated: '2024-12-16'
//   },

//   // 🍬 Rewari
//   {
//     id: '12',
//     name: 'Til Rewari (250g)',
//     category: 'Rewari',
//     sku: 'RWR-012',
//     stock: 55,
//     minStock: 10,
//     price: 180,
//     cost: 120,
//     description: 'Sesame candy made with jaggery',
//     supplier: 'Local Sweet Shop',
//     dateAdded: '2024-01-22',
//     lastUpdated: '2024-12-18'
//   }
// ];

// export const mockStockMovements: StockMovement[] = [
//   {
//     id: '1',
//     productId: '1',
//     type: 'out',
//     quantity: 20,
//     date: '2024-12-20',
//     reason: 'Sale',
//     reference: 'ORD-001'
//   },
//   {
//     id: '2',
//     productId: '7',
//     type: 'in',
//     quantity: 60,
//     date: '2024-12-18',
//     reason: 'Restock',
//     reference: 'PO-002'
//   },
//   {
//     id: '3',
//     productId: '10',
//     type: 'out',
//     quantity: 15,
//     date: '2024-12-19',
//     reason: 'Sale',
//     reference: 'ORD-003'
//   },
//   {
//     id: '4',
//     productId: '3',
//     type: 'out',
//     quantity: 5,
//     date: '2024-12-17',
//     reason: 'Damage',
//     reference: 'DAMAGE-001'
//   },
//   {
//     id: '5',
//     productId: '8',
//     type: 'out',
//     quantity: 3,
//     date: '2024-12-16',
//     reason: 'Loss',
//     reference: 'LOSS-001'
//   },
//   {
//     id: '6',
//     productId: '5',
//     type: 'out',
//     quantity: 2,
//     date: '2024-12-15',
//     reason: 'Return to Supplier',
//     reference: 'RETURN-001'
//   }
// ];
