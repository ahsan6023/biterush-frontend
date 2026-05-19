import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
// DEPLOYMENT: Replace http://localhost:5000 with your deployed backend URL
const API = process.env.REACT_APP_API_URL || 'https://biterush-api.onrender.com';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, cartTotal, addToHistory } = useCart();
  const [form, setForm] = useState({ name: '', phone: '', address: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleQty = (id, val) => {
    const num = parseInt(val);
    if (!isNaN(num) && num >= 1) updateQuantity(id, num);
    else if (val === '') updateQuantity(id, 1);
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim()) {
      setError('Please fill in all fields.'); return;
    }
    if (cart.length === 0) { setError('Your cart is empty.'); return; }
    setError(''); setSubmitting(true);
    try {
      // DEPLOYMENT: Replace http://localhost:5000 with your deployed backend URL
      const res = await fetch(`${API}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer: form, items: cart, totalAmount: cartTotal }),
      });
      const data = await res.json();
      if (data.success) {
        addToHistory({ ...data.order, items: cart, customer: form, totalAmount: cartTotal, createdAt: new Date().toISOString() });
        clearCart();
        setForm({ name: '', phone: '', address: '' });
        setSuccess(true);
      } else setError(data.error || 'Order failed. Please try again.');
    } catch {
      setError('Could not connect to server. Please try again.');
    }
    setSubmitting(false);
  };

  if (success) return (
    <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: 40 }}>
      <div style={{ fontSize: '5rem', marginBottom: 20 }}>🎉</div>
      <h2 style={{ fontFamily: 'Nunito,sans-serif', fontWeight: 900, fontSize: '2rem', color: 'var(--dark)', marginBottom: 10 }}>Order Placed!</h2>
      <p style={{ color: 'var(--muted)', marginBottom: 28, textAlign: 'center', maxWidth: 400 }}>Thank you! Your order has been received and will be delivered shortly. Cash on delivery.</p>
      <button onClick={() => setSuccess(false)} style={{ background: 'var(--red)', color: '#fff', border: 'none', padding: '12px 32px', borderRadius: 50, fontFamily: 'Nunito,sans-serif', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 6px 20px var(--red-glow)' }}>Order Again</button>
    </div>
  );

  return (
    <main style={{ background: 'var(--bg)', minHeight: '80vh', padding: '50px 48px 80px' }}>
      <h1 className="cart-title animated-title">Your Cart</h1>

      {cart.length === 0 ? (
        <div style={{ textAlign: 'center', paddingTop: 60, color: 'var(--muted)' }}>
          <div style={{ fontSize: '4rem', marginBottom: 16 }}>🛒</div>
          <p style={{ fontSize: '1.1rem' }}>Your cart is empty.</p>
          <a href="/menu" style={{ display: 'inline-block', marginTop: 20, background: 'var(--red)', color: '#fff', padding: '12px 30px', borderRadius: 50, fontWeight: 800, textDecoration: 'none', boxShadow: '0 6px 16px var(--red-glow)' }}>Browse Menu</a>
        </div>
      ) : (
        <div className="cart-layout">
          {/* Items */}
          <div className="cart-items">
            <h2 style={{ fontFamily: 'Nunito,sans-serif', fontWeight: 800, fontSize: '1.2rem', marginBottom: 20, color: 'var(--dark)' }}>Order Items ({cart.length})</h2>
            {cart.map(item => (
              <div className="cart-row" key={item._id}>
                <div className="cart-emoji">{item.emoji || '🍔'}</div>
                <div className="cart-info">
                  <strong>{item.name}</strong>
                  <span>Rs. {item.price.toLocaleString()} each</span>
                </div>
                <div className="cart-qty">
                  <label style={{ fontSize: '.75rem', color: 'var(--muted)', display: 'block', marginBottom: 4 }}>Qty</label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={e => handleQty(item._id, e.target.value)}
                    className="qty-input"
                  />
                </div>
                <div className="cart-subtotal">Rs. {(item.price * item.quantity).toLocaleString()}</div>
                <button className="remove-btn" onClick={() => removeFromCart(item._id)}>✕</button>
              </div>
            ))}
            <div className="cart-total-row">
              <span>Total Amount</span>
              <strong>Rs. {cartTotal.toLocaleString()}</strong>
            </div>
          </div>

          {/* Customer form */}
          <div className="cart-form-box">
            <h2 style={{ fontFamily: 'Nunito,sans-serif', fontWeight: 800, fontSize: '1.2rem', marginBottom: 20, color: 'var(--dark)' }}>Delivery Details</h2>

            <div className="form-group">
              <label>Full Name</label>
              <input type="text" placeholder="e.g. Ahmed Khan" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="form-input" />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="tel" placeholder="e.g. 0300-1234567" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="form-input" />
            </div>
            <div className="form-group">
              <label>Delivery Address</label>
              <textarea placeholder="House #, Street, Area, City" value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} className="form-input" rows={3} style={{ resize: 'vertical' }} />
            </div>
            <div className="cod-note">💵 Cash on Delivery — Pay when your food arrives.</div>

            {error && <div className="form-error">{error}</div>}

            <button className="submit-order-btn" onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Placing Order...' : `🛍️ Place Order — Rs. ${cartTotal.toLocaleString()}`}
            </button>
          </div>
        </div>
      )}

      <style>{`
        .cart-title{font-family:'Nunito',sans-serif;font-size:2.2rem;font-weight:900;color:var(--dark);display:inline-block;position:relative;padding-bottom:12px;margin-bottom:36px}
        .animated-title::after{content:'';position:absolute;bottom:0;left:0;width:0;height:3px;background:var(--red);border-radius:2px;animation:growLine .7s .2s ease forwards}
        @keyframes growLine{to{width:100%}}
        .cart-layout{display:grid;grid-template-columns:1fr 420px;gap:32px;align-items:start}
        .cart-items{background:var(--surface);border-radius:20px;padding:28px;box-shadow:0 2px 16px rgba(0,0,0,.06)}
        .cart-row{display:flex;align-items:center;gap:14px;padding:14px 0;border-bottom:1px solid rgba(0,0,0,.06)}
        .cart-emoji{width:50px;height:50px;background:var(--red-light);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.6rem;flex-shrink:0}
        .cart-info{flex:1;display:flex;flex-direction:column;gap:3px}
        .cart-info strong{font-family:'Nunito',sans-serif;font-weight:800;font-size:.95rem;color:var(--dark)}
        .cart-info span{color:var(--muted);font-size:.8rem}
        .cart-qty{display:flex;flex-direction:column;align-items:center}
        .qty-input{width:64px;border:1.5px solid #ddd;border-radius:8px;padding:6px 10px;font-family:'Nunito',sans-serif;font-weight:700;font-size:.95rem;text-align:center;color:var(--dark);background:var(--surface);outline:none;transition:border-color .2s}
        .qty-input:focus{border-color:var(--red)}
        .cart-subtotal{font-family:'Nunito',sans-serif;font-weight:800;font-size:.95rem;color:var(--dark);min-width:90px;text-align:right}
        .remove-btn{background:none;border:none;color:#ccc;font-size:1rem;cursor:pointer;padding:4px;transition:color .2s}
        .remove-btn:hover{color:var(--red)}
        .cart-total-row{display:flex;justify-content:space-between;align-items:center;padding-top:18px;margin-top:4px;font-size:1.1rem;color:var(--dark)}
        .cart-total-row strong{font-family:'Nunito',sans-serif;font-weight:900;color:var(--red);font-size:1.3rem}
        .cart-form-box{background:var(--surface);border-radius:20px;padding:28px;box-shadow:0 2px 16px rgba(0,0,0,.06)}
        .form-group{margin-bottom:18px}
        .form-group label{display:block;font-weight:700;font-size:.85rem;color:var(--dark);margin-bottom:7px}
        .form-input{width:100%;border:1.5px solid #e0e0e0;border-radius:12px;padding:11px 16px;font-family:'Nunito Sans',sans-serif;font-size:.92rem;color:var(--dark);background:var(--surface);outline:none;transition:border-color .2s,box-shadow .2s}
        .form-input:focus{border-color:var(--red);box-shadow:0 0 0 3px var(--red-light)}
        .cod-note{background:var(--red-light);border:1px solid var(--red-border);color:var(--red);border-radius:12px;padding:12px 16px;font-size:.85rem;font-weight:600;margin-bottom:18px}
        .form-error{background:#fff0f0;border:1px solid #ffcccc;color:#cc0000;border-radius:10px;padding:10px 14px;font-size:.85rem;margin-bottom:14px}
        .submit-order-btn{width:100%;background:var(--red);color:#fff;border:none;padding:15px;border-radius:50px;font-family:'Nunito',sans-serif;font-weight:900;font-size:1.05rem;cursor:pointer;box-shadow:0 6px 20px var(--red-glow);transition:background .2s,transform .15s,box-shadow .25s}
        .submit-order-btn:hover:not(:disabled){background:var(--red-dark);transform:translateY(-2px);box-shadow:0 10px 28px rgba(184,0,31,.45)}
        .submit-order-btn:disabled{opacity:.6;cursor:not-allowed}
        @media(max-width:900px){.cart-layout{grid-template-columns:1fr}}
        @media(max-width:600px){main[style]{padding:36px 16px 60px!important}}
      `}</style>
    </main>
  );
};

export default Cart;
