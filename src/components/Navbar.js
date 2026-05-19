import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { cartCount, darkMode, setDarkMode, orderHistory, addToCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
        setHistoryOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleRepeatOrder = (order) => {
    order.items.forEach(item => addToCart(item));
    setMenuOpen(false);
    navigate('/cart');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">🍔 Bite<span>Rush</span></Link>

      {/* Desktop nav links */}
      <div className="nav-links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/menu" className="nav-link">Menu</Link>
        <Link to="/cart" className="nav-link">Cart</Link>
        <Link to="/about" className="nav-link">About</Link>
      </div>

      {/* Right side controls */}
      <div className="nav-right" ref={menuRef}>
        {/* Cart icon */}
        <Link to="/cart" className="cart-icon" aria-label="Cart">
          🛒
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </Link>

        {/* Hamburger menu */}
        <button
          className={`hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => { setMenuOpen(!menuOpen); setHistoryOpen(false); }}
          aria-label="Menu"
        >
          <span></span><span></span><span></span>
        </button>

        {/* Dropdown panel */}
        {menuOpen && (
          <div className="dropdown-panel">
            <div className="dropdown-nav">
              <Link to="/" className="dd-link" onClick={() => setMenuOpen(false)}>🏠 Home</Link>
              <Link to="/menu" className="dd-link" onClick={() => setMenuOpen(false)}>🍕 Menu</Link>
              <Link to="/cart" className="dd-link" onClick={() => setMenuOpen(false)}>🛒 Cart {cartCount > 0 && <span className="dd-badge">{cartCount}</span>}</Link>
              <Link to="/about" className="dd-link" onClick={() => setMenuOpen(false)}>ℹ️ About</Link>
            </div>

            {/* Dark/Light toggle */}
            <div className="dd-divider" />
            <div className="dd-toggle-row">
              <span>{darkMode ? '🌙 Night Mode' : '☀️ Day Mode'}</span>
              <button
                className={`toggle-btn ${darkMode ? 'active' : ''}`}
                onClick={() => setDarkMode(!darkMode)}
              >
                <span className="toggle-knob"></span>
              </button>
            </div>

            {/* Order History */}
            <div className="dd-divider" />
            <button className="dd-history-btn" onClick={() => setHistoryOpen(!historyOpen)}>
              📋 Order History {orderHistory.length > 0 && <span className="dd-badge">{orderHistory.length}</span>}
              <span style={{ marginLeft: 'auto' }}>{historyOpen ? '▲' : '▼'}</span>
            </button>

            {historyOpen && (
              <div className="history-list">
                {orderHistory.length === 0 ? (
                  <p className="no-history">No orders yet</p>
                ) : (
                  orderHistory.map((order, idx) => (
                    <div className="history-item" key={idx}>
                      <div className="history-info">
                        <strong>{order.customer?.name || 'Order'}</strong>
                        <span>{order.items?.length} item(s) — Rs. {order.totalAmount}</span>
                        <span className="history-date">
                          {new Date(order.createdAt || Date.now()).toLocaleDateString('en-PK')}
                        </span>
                      </div>
                      <button className="repeat-btn" onClick={() => handleRepeatOrder(order)}>
                        🔁 Repeat
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
