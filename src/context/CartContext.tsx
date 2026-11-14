import React, { createContext, useContext, useState, useEffect } from 'react';
import { Lang } from '../data/divingData';

export interface CartItem {
  id: string;
  title: Record<Lang, string>;
  subtitle?: Record<Lang, string>;
  price: number;
  priceFormatted: Record<Lang, string>;
  quantity: number;
  type: 'course' | 'trip' | 'package' | 'other';
  category?: string;
}

interface AddToCartParams {
  id: string;
  title: Record<Lang, string>;
  subtitle?: Record<Lang, string>;
  price: number | string;
  priceFormatted?: Record<Lang, string>;
  type?: 'course' | 'trip' | 'package' | 'other';
  category?: string;
  quantity?: number;
}

interface CartContextType {
  items: CartItem[];
  totalCount: number;
  totalPrice: number;
  isCartOpen: boolean;
  lastAddedId: string | null;
  addToCart: (item: AddToCartParams) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'riwa_alfan_cart_items_v1';

export const parsePriceNumber = (rawPrice: number | string): number => {
  if (typeof rawPrice === 'number') return rawPrice;
  if (!rawPrice) return 0;
  // Strip commas, arabic commas, letters, leave numbers and dots
  const cleaned = rawPrice.toString().replace(/,/g, '').replace(/[^\d.]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse cart items from storage:', e);
    }
    return [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('Failed to save cart items to storage:', e);
    }
  }, [items]);

  const addToCart = (params: AddToCartParams) => {
    const qtyToAdd = params.quantity && params.quantity > 0 ? params.quantity : 1;
    const numPrice = parsePriceNumber(params.price);
    const formattedPrice: Record<Lang, string> = params.priceFormatted || {
      ar: `${numPrice.toLocaleString('ar-SA')} ر.س`,
      en: `${numPrice.toLocaleString('en-US')} SAR`,
    };

    setItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === params.id);
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + qtyToAdd,
        };
        return next;
      } else {
        const newItem: CartItem = {
          id: params.id,
          title: params.title,
          subtitle: params.subtitle,
          price: numPrice,
          priceFormatted: formattedPrice,
          quantity: qtyToAdd,
          type: params.type || 'course',
          category: params.category,
        };
        return [...prev, newItem];
      }
    });

    setLastAddedId(params.id);
    setTimeout(() => {
      setLastAddedId((curr) => (curr === params.id ? null : curr));
    }, 2500);
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        totalCount,
        totalPrice,
        isCartOpen,
        lastAddedId,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        openCart,
        closeCart,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
