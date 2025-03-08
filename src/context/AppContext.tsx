import React, { createContext, useContext, useState, useEffect } from 'react';

// Types
export type UserRole = 'none' | 'admin' | 'customer' | 'security';

export interface Product {
  id: string;
  name: string;
  price: number;
  discountedPrice?: number;
  image: string;
  stock: number;
  category: string;
  description: string;
  qrCode?: string;
  addedOn: Date;
}

export interface CartItem {
  productId: string;
  quantity: number;
  product: Product;
}

export interface Bill {
  id: string;
  customerId: string;
  customerName: string;
  items: CartItem[];
  totalAmount: number;
  paymentStatus: 'pending' | 'completed';
  createdAt: Date;
  qrCode: string;
  verifiedAt?: Date;
  verifiedBy?: string;
  status?: 'pending' | 'verified';
}

export interface Staff {
  id: string;
  name: string;
  role: 'security' | 'admin';
  phone: string;
  email: string;
  addedOn: Date;
}

export interface SalesData {
  date: string;
  amount: number;
}

// Context type
interface AppContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  userName: string;
  setUserName: (name: string) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (status: boolean) => void;
  products: Product[];
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  removeProduct: (productId: string) => void;
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  bills: Bill[];
  addBill: (bill: Bill) => void;
  updateBill: (bill: Bill) => void;
  currentBill: Bill | null;
  setCurrentBill: (bill: Bill | null) => void;
  staff: Staff[];
  addStaff: (staff: Staff) => void;
  salesData: SalesData[];
  generateNewSalesData: () => void;
}

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// Initial dummy products
const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Headphones',
    price: 299.99,
    discountedPrice: 249.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
    stock: 50,
    category: 'Electronics',
    description: 'High-quality wireless headphones with noise cancellation.',
    qrCode: 'dummy-qr-code-1',
    addedOn: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
  },
  {
    id: '2',
    name: 'Smart Watch',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
    stock: 30,
    category: 'Electronics',
    description: 'Feature-rich smartwatch with fitness tracking and notifications.',
    qrCode: 'dummy-qr-code-2',
    addedOn: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000), // 25 days ago
  },
  {
    id: '3',
    name: 'Designer Handbag',
    price: 499.99,
    discountedPrice: 399.99,
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3',
    stock: 15,
    category: 'Fashion',
    description: 'Luxury designer handbag with premium materials.',
    qrCode: 'dummy-qr-code-3',
    addedOn: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
  },
  {
    id: '4',
    name: 'Premium Sneakers',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
    stock: 25,
    category: 'Fashion',
    description: 'Comfortable and stylish sneakers for everyday wear.',
    qrCode: 'dummy-qr-code-4',
    addedOn: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
  },
  {
    id: '5',
    name: 'Smart Home Hub',
    price: 249.99,
    discountedPrice: 199.99,
    image: 'https://images.unsplash.com/photo-1558089687-f282ffcbc126',
    stock: 20,
    category: 'Electronics',
    description: 'Central hub for controlling all your smart home devices.',
    qrCode: 'dummy-qr-code-5',
    addedOn: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
  },
  {
    id: '6',
    name: 'Gourmet Coffee Set',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1618576893223-ae040bb3d1e9',
    stock: 40,
    category: 'Home & Kitchen',
    description: 'Premium coffee beans and brewing equipment for coffee enthusiasts.',
    qrCode: 'dummy-qr-code-6',
    addedOn: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
  },
];

// Initial staff
const initialStaff: Staff[] = [
  {
    id: '1',
    name: 'John Smith',
    role: 'admin',
    phone: '123-456-7890',
    email: 'john.smith@qwikpay.com',
    addedOn: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
  },
  {
    id: '2',
    name: 'Emily Johnson',
    role: 'security',
    phone: '234-567-8901',
    email: 'emily.johnson@qwikpay.com',
    addedOn: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
  },
];

// Generate random sales data
const generateSalesData = (): SalesData[] => {
  const data: SalesData[] = [];
  const now = new Date();
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    data.push({
      date: date.toISOString().split('T')[0],
      amount: Math.floor(Math.random() * 5000) + 1000, // Random sales between 1000 and 6000
    });
  }
  
  return data;
};

// Provider component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userRole, setUserRole] = useState<UserRole>('none');
  const [userName, setUserName] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [currentBill, setCurrentBill] = useState<Bill | null>(null);
  const [staff, setStaff] = useState<Staff[]>(initialStaff);
  const [salesData, setSalesData] = useState<SalesData[]>(generateSalesData());

  // Add a product
  const addProduct = (product: Product) => {
    setProducts([...products, product]);
  };

  // Update a product
  const updateProduct = (updatedProduct: Product) => {
    setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  // Remove a product
  const removeProduct = (productId: string) => {
    setProducts(products.filter(p => p.id !== productId));
  };

  // Add to cart
  const addToCart = (product: Product, quantity: number = 1) => {
    const existingItemIndex = cartItems.findIndex(item => item.productId === product.id);
    
    if (existingItemIndex >= 0) {
      // Update quantity if already in cart
      const newCartItems = [...cartItems];
      newCartItems[existingItemIndex].quantity += quantity;
      setCartItems(newCartItems);
    } else {
      // Add new item to cart
      setCartItems([...cartItems, { productId: product.id, quantity, product }]);
    }
    
    // Update product stock
    const updatedProduct = { ...product, stock: product.stock - quantity };
    updateProduct(updatedProduct);
  };

  // Remove from cart
  const removeFromCart = (productId: string) => {
    const itemToRemove = cartItems.find(item => item.productId === productId);
    
    if (itemToRemove) {
      // Update product stock
      const product = products.find(p => p.id === productId);
      if (product) {
        const updatedProduct = { ...product, stock: product.stock + itemToRemove.quantity };
        updateProduct(updatedProduct);
      }
      
      // Remove from cart
      setCartItems(cartItems.filter(item => item.productId !== productId));
    }
  };

  // Update cart item quantity
  const updateCartItemQuantity = (productId: string, quantity: number) => {
    const existingItem = cartItems.find(item => item.productId === productId);
    
    if (existingItem) {
      const qtyDifference = quantity - existingItem.quantity;
      
      // Update product stock
      const product = products.find(p => p.id === productId);
      if (product) {
        const updatedProduct = { ...product, stock: product.stock - qtyDifference };
        updateProduct(updatedProduct);
      }
      
      // Update cart quantity
      setCartItems(cartItems.map(item => 
        item.productId === productId ? { ...item, quantity } : item
      ));
    }
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Add bill
  const addBill = (bill: Bill) => {
    setBills([...bills, bill]);
  };

  // Update bill
  const updateBill = (updatedBill: Bill) => {
    setBills(bills.map(b => b.id === updatedBill.id ? updatedBill : b));
    
    // If this is the current bill, update it as well
    if (currentBill && currentBill.id === updatedBill.id) {
      setCurrentBill(updatedBill);
    }
    
    // Update sales data if payment status changed to completed
    if (updatedBill.paymentStatus === 'completed') {
      generateNewSalesData();
    }
  };

  // Add staff
  const addStaff = (newStaff: Staff) => {
    setStaff([...staff, newStaff]);
  };

  // Generate new sales data
  const generateNewSalesData = () => {
    setSalesData(generateSalesData());
  };

  // Value object
  const value: AppContextType = {
    userRole,
    setUserRole,
    userName,
    setUserName,
    isLoggedIn,
    setIsLoggedIn,
    products,
    setProducts,
    addProduct,
    updateProduct,
    removeProduct,
    cartItems,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    bills,
    addBill,
    updateBill,
    currentBill,
    setCurrentBill,
    staff,
    addStaff,
    salesData,
    generateNewSalesData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
