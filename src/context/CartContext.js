import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('biterush_cart')) || []; }
    catch { return []; }
  });

  const [orderHistory, setOrderHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('biterush_history')) || []; }
    catch { return []; }
  });

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('biterush_dark') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('biterush_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('biterush_history', JSON.stringify(orderHistory));
  }, [orderHistory]);

  useEffect(() => {
    localStorage.setItem('biterush_dark', darkMode);
    if (darkMode) document.body.classList.add('night');
    else document.body.classList.remove('night');
  }, [darkMode]);

  const addToCart = (item) => {
    setCart(prev => {
      const exists = prev.find(i => i._id === item._id);
      if (exists) return prev.map(i => i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (id, qty) => {
    if (qty < 1) return removeFromCart(id);
    setCart(prev => prev.map(i => i._id === id ? { ...i, quantity: qty } : i));
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(i => i._id !== id));
  };

  const clearCart = () => setCart([]);

  const addToHistory = (order) => {
    setOrderHistory(prev => [order, ...prev].slice(0, 20));
  };

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart, addToCart, updateQuantity, removeFromCart, clearCart,
      cartCount, cartTotal, orderHistory, addToHistory,
      darkMode, setDarkMode
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
