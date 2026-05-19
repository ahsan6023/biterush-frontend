import React, { useState, useEffect } from 'react';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const CATEGORIES = ['pizza', 'burgers', 'drinks', 'salads', 'deals'];
const EMOJIS_BY_CAT = { pizza: '🍕', burgers: '🍔', drinks: '🥤', salads: '🥗', deals: '🎉' };

const emptyForm = { name: '', description: '', price: '', category: 'pizza', emoji: '🍕', available: true, imageUrl: '' };

const Admin = () => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginCredentials, setLoginCredentials] = useState({ username: '', password: '' });
  const [token, setToken] = useState(localStorage.getItem('adminToken'));

  // Admin panel state
  const [tab, setTab] = useState('menu');
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  
  // Change Password state
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Check if token is valid on page load
  useEffect(() => {
    if (token) {
      verifyToken();
    }
  }, [token]);

  const verifyToken = async () => {
    try {
      const res = await fetch(`${API}/api/admin/verify`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setIsAuthenticated(true);
        fetchMenu();
        fetchOrders();
      } else {
        handleLogout();
      }
    } catch (error) {
      handleLogout();
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    try {
      const res = await fetch(`${API}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginCredentials)
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('adminToken', data.token);
        setToken(data.token);
        setIsAuthenticated(true);
        fetchMenu();
        fetchOrders();
      } else {
        alert('Login failed: ' + data.error);
      }
    } catch (error) {
      alert('Error connecting to server');
    }
    setLoginLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
    setIsAuthenticated(false);
    setLoginCredentials({ username: '', password: '' });
  };

  const fetchMenu = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API}/api/admin/menu`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const d = await res.json();
      if (d.success) setItems(d.items || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching menu:', error);
    }
  };

  const fetchOrders = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API}/api/admin/orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const d = await res.json();
      if (d.success) {
        setOrders(d.orders || []);
        setTotalRevenue(d.totalRevenue || 0);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleSeed = async () => {
    await fetch(`${API}/api/menu/seed`, { method: 'POST' });
    fetchMenu();
    setMsg('✅ Menu seeded with default items!');
    setTimeout(() => setMsg(''), 3000);
  };

 const handleSubmit = async () => {
  if (!form.name || !form.price) {
    setMsg('❌ Name and price required');
    return;
  }
  
  const body = { 
    name: form.name,
    description: form.description,
    price: Number(form.price),
    category: form.category,
    emoji: EMOJIS_BY_CAT[form.category],
    available: form.available,
    imageUrl: form.imageUrl || ''  // Make sure this is included
  };
  
  // DEBUG: Check what's being sent
  console.log('📤 Submitting item with imageUrl:', body.imageUrl);
  console.log('📤 Full body:', body);
  
  const url = editId ? `${API}/api/admin/menu/${editId}` : `${API}/api/admin/menu`;
  const method = editId ? 'PUT' : 'POST';
  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  
  console.log('📥 Response:', data);
  
  if (data.success) {
    setMsg(editId ? '✅ Item updated!' : '✅ Item added!');
    setForm(emptyForm);
    setEditId(null);
    fetchMenu();
  } else setMsg('❌ Error: ' + data.error);
  setTimeout(() => setMsg(''), 3000);
};

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    await fetch(`${API}/api/admin/menu/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchMenu();
    setMsg('✅ Item deleted');
    setTimeout(() => setMsg(''), 2500);
  };

  const handleEdit = (item) => {
  console.log('✏️ Editing item with imageUrl:', item.imageUrl); // Debug
  setForm({
    name: item.name,
    description: item.description,
    price: item.price,
    category: item.category,
    emoji: item.emoji,
    available: item.available,
    imageUrl: item.imageUrl || ''
  });
  setEditId(item._id);
  setTab('menu');
};

  const handleStatusChange = async (id, status) => {
    await fetch(`${API}/api/admin/orders/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    fetchOrders();
  };

  // CHANGE PASSWORD FUNCTION
  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMsg('❌ New passwords do not match!');
      setTimeout(() => setMsg(''), 3000);
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setMsg('❌ Password must be at least 6 characters!');
      setTimeout(() => setMsg(''), 3000);
      return;
    }
    
    try {
      const res = await fetch(`${API}/api/admin/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });
      
      const data = await res.json();
      
      if (data.success) {
        setMsg('✅ Password changed! Please login again.');
        setShowChangePassword(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => handleLogout(), 2000);
      } else {
        setMsg('❌ ' + data.error);
      }
      setTimeout(() => setMsg(''), 3000);
    } catch (error) {
      setMsg('❌ Error changing password');
    }
  };

  const STATUS_COLORS = { pending: '#ff9800', confirmed: '#2196f3', preparing: '#9c27b0', delivered: '#27ae60', cancelled: '#f44336' };

  // SHOW LOGIN PAGE IF NOT AUTHENTICATED
  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <form onSubmit={handleLogin} style={{
          background: 'white',
          padding: '40px',
          borderRadius: '20px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
          width: '350px'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{ fontSize: '48px' }}>🍕</div>
            <h2 style={{ color: '#333', marginTop: '10px' }}>Admin Login</h2>
            <p style={{ color: '#666', fontSize: '14px' }}>Enter your credentials</p>
          </div>

          <input
            type="text"
            placeholder="Username"
            value={loginCredentials.username}
            onChange={(e) => setLoginCredentials({ ...loginCredentials, username: e.target.value })}
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '15px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={loginCredentials.password}
            onChange={(e) => setLoginCredentials({ ...loginCredentials, password: e.target.value })}
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '20px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
            required
          />

          <button
            type="submit"
            disabled={loginLoading}
            style={{
              width: '100%',
              padding: '12px',
              background: '#e31837',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: loginLoading ? 'not-allowed' : 'pointer',
              opacity: loginLoading ? 0.7 : 1
            }}
          >
            {loginLoading ? 'Logging in...' : 'Login to Dashboard'}
          </button>

          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: '#999' }}>
            Contact administrator for credentials
          </p>
        </form>
      </div>
    );
  }

  // SHOW ADMIN DASHBOARD IF AUTHENTICATED
  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh', padding: '40px 48px 80px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <h1 style={{ fontFamily: 'Nunito,sans-serif', fontWeight: 900, fontSize: '2rem', color: 'var(--dark)' }}>⚙️ Admin Panel</h1>
          <span style={{ background: 'var(--red)', color: '#fff', padding: '3px 12px', borderRadius: 50, fontSize: '.75rem', fontWeight: 800 }}>PROTECTED</span>
        </div>
        <div>
          <button onClick={() => setShowChangePassword(true)} style={{
            background: '#ff9800',
            color: 'white',
            border: 'none',
            borderRadius: '50px',
            padding: '8px 20px',
            fontWeight: 700,
            cursor: 'pointer',
            marginRight: '10px'
          }}>
            🔐 Change Password
          </button>
          <button onClick={handleLogout} style={{
            background: '#f0f0f0',
            border: '1px solid #ddd',
            borderRadius: '50px',
            padding: '8px 20px',
            fontWeight: 700,
            cursor: 'pointer'
          }}>
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="admin-stats">
        <div className="astat-box"><span>📦</span><strong>{orders.length}</strong><label>Total Orders</label></div>
        <div className="astat-box"><span>💰</span><strong>Rs. {totalRevenue.toLocaleString()}</strong><label>Total Revenue</label></div>
        <div className="astat-box"><span>🍕</span><strong>{items.length}</strong><label>Menu Items</label></div>
        <div className="astat-box"><span>✅</span><strong>{orders.filter(o => o.status === 'delivered').length}</strong><label>Delivered</label></div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
        {['menu', 'orders'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`admin-tab ${tab === t ? 'active' : ''}`}>
            {t === 'menu' ? '🍕 Menu Management' : '📋 Orders'}
          </button>
        ))}
        <button onClick={handleSeed} style={{ marginLeft: 'auto', background: '#f0f0f0', border: '1.5px solid #ddd', borderRadius: 50, padding: '8px 20px', fontWeight: 700, fontSize: '.85rem', cursor: 'pointer' }}>
          🌱 Seed Default Menu
        </button>
      </div>

      {msg && <div style={{ background: msg.startsWith('✅') ? '#e8f5e9' : '#ffebee', color: msg.startsWith('✅') ? '#2e7d32' : '#c62828', borderRadius: 10, padding: '10px 16px', marginBottom: 18, fontWeight: 600 }}>{msg}</div>}

      {/* MENU TAB */}
      {tab === 'menu' && (
        <div className="admin-layout">
          <div className="admin-form-box">
            <h3 style={{ fontFamily: 'Nunito,sans-serif', fontWeight: 800, marginBottom: 20, color: 'var(--dark)' }}>{editId ? '✏️ Edit Item' : '➕ Add New Item'}</h3>
            {[
              { label: 'Item Name', key: 'name', type: 'text', ph: 'e.g. Pepperoni Feast' },
              { label: 'Description', key: 'description', type: 'text', ph: 'Short description...' },
              { label: 'Price (PKR)', key: 'price', type: 'number', ph: 'e.g. 1299' },
            ].map(f => (
              <div className="form-group" key={f.key}>
                <label>{f.label}</label>
                <input type={f.type} placeholder={f.ph} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} className="form-input" />
              </div>
            ))}
            <div className="form-group">
              <label>Category</label>
              <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="form-input">
                {CATEGORIES.map(c => <option key={c} value={c}>{EMOJIS_BY_CAT[c]} {c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Image URL (optional)</label>
              <input 
                type="text" 
                placeholder="https://example.com/food-image.jpg" 
                value={form.imageUrl || ''}
                onChange={e => setForm(p => ({ ...p, imageUrl: e.target.value }))}
                className="form-input"
              />
              <small style={{ fontSize: '11px', color: '#666', display: 'block', marginTop: '4px' }}>
                Leave empty to use emoji. Use online image URLs (Unsplash, Imgur, etc.)
              </small>
            </div>
            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input type="checkbox" id="avail" checked={form.available} onChange={e => setForm(p => ({ ...p, available: e.target.checked }))} />
              <label htmlFor="avail" style={{ margin: 0, cursor: 'pointer' }}>Available on menu</label>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
              <button onClick={handleSubmit} className="submit-red-btn">{editId ? '💾 Update Item' : '➕ Add Item'}</button>
              {editId && <button onClick={() => { setForm(emptyForm); setEditId(null) }} style={{ flex: 1, background: '#f0f0f0', border: 'none', borderRadius: 50, fontWeight: 700, cursor: 'pointer' }}>Cancel</button>}
            </div>
          </div>

          <div>
            <div className="admin-items-grid">
              {loading ? <p>Loading...</p> : items.map(item => (
                <div className="admin-item-row" key={item._id}>
                  <span style={{ fontSize: '1.5rem' }}>{item.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <strong style={{ fontFamily: 'Nunito,sans-serif', fontSize: '.92rem', color: 'var(--dark)' }}>{item.name}</strong>
                    <div style={{ fontSize: '.75rem', color: 'var(--muted)' }}>{item.category} · Rs. {item.price.toLocaleString()}</div>
                    {item.imageUrl && <div style={{ fontSize: '.7rem', color: '#999', marginTop: '2px' }}>🖼️ Has image</div>}
                  </div>
                  <span style={{ fontSize: '.72rem', background: item.available ? '#e8f5e9' : '#ffebee', color: item.available ? '#2e7d32' : '#c62828', padding: '2px 8px', borderRadius: 50, fontWeight: 700 }}>
                    {item.available ? 'ON' : 'OFF'}
                  </span>
                  <button onClick={() => handleEdit(item)} style={{ background: '#e3f2fd', border: 'none', borderRadius: 8, padding: '5px 12px', cursor: 'pointer', fontWeight: 700, fontSize: '.78rem', color: '#1565c0' }}>Edit</button>
                  <button onClick={() => handleDelete(item._id)} style={{ background: '#ffebee', border: 'none', borderRadius: 8, padding: '5px 12px', cursor: 'pointer', fontWeight: 700, fontSize: '.78rem', color: '#c62828' }}>Del</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ORDERS TAB */}
      {tab === 'orders' && (
        <div>
          {orders.length === 0 ? <p style={{ color: 'var(--muted)', padding: 20 }}>No orders yet.</p> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {orders.map(order => (
                <div className="order-card" key={order._id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 10 }}>
                    <div>
                      <strong style={{ fontFamily: 'Nunito,sans-serif', fontSize: '1rem', color: 'var(--dark)' }}>{order.customer?.name}</strong>
                      <span style={{ marginLeft: 12, color: 'var(--muted)', fontSize: '.82rem' }}>{order.customer?.phone}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <strong style={{ color: 'var(--red)', fontFamily: 'Nunito,sans-serif' }}>Rs. {order.totalAmount?.toLocaleString()}</strong>
                      <select value={order.status} onChange={e => handleStatusChange(order._id, e.target.value)}
                        style={{ border: `1.5px solid ${STATUS_COLORS[order.status]}`, borderRadius: 50, padding: '4px 10px', fontWeight: 700, fontSize: '.78rem', color: STATUS_COLORS[order.status], background: '#fff', cursor: 'pointer' }}>
                        {['pending', 'confirmed', 'preparing', 'delivered', 'cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                  <div style={{ fontSize: '.8rem', color: 'var(--muted)', marginBottom: 6 }}>📍 {order.customer?.address}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {order.items?.map((it, i) => (
                      <span key={i} style={{ background: 'var(--red-light)', color: 'var(--red)', padding: '3px 10px', borderRadius: 50, fontSize: '.75rem', fontWeight: 700 }}>
                        {it.emoji} {it.name} ×{it.quantity}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Change Password Modal */}
      {showChangePassword && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <form onSubmit={handleChangePassword} style={{
            background: 'white',
            padding: '30px',
            borderRadius: '20px',
            width: '400px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
          }}>
            <h3 style={{ marginBottom: '20px', color: '#333' }}>Change Password</h3>
            
            <input
              type="password"
              placeholder="Current Password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
              style={{
                width: '100%',
                padding: '12px',
                marginBottom: '15px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                boxSizing: 'border-box'
              }}
              required
            />
            
            <input
              type="password"
              placeholder="New Password (min 6 characters)"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
              style={{
                width: '100%',
                padding: '12px',
                marginBottom: '15px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                boxSizing: 'border-box'
              }}
              required
            />
            
            <input
              type="password"
              placeholder="Confirm New Password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
              style={{
                width: '100%',
                padding: '12px',
                marginBottom: '20px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                boxSizing: 'border-box'
              }}
              required
            />
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" style={{
                flex: 1,
                padding: '12px',
                background: '#e31837',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}>
                Update Password
              </button>
              <button type="button" onClick={() => setShowChangePassword(false)} style={{
                flex: 1,
                padding: '12px',
                background: '#666',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <style>{`
        .admin-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:28px}
        .astat-box{background:var(--surface);border-radius:16px;padding:20px;text-align:center;box-shadow:0 2px 12px rgba(0,0,0,.06)}
        .astat-box span{font-size:1.8rem;display:block;margin-bottom:4px}
        .astat-box strong{display:block;font-family:'Nunito',sans-serif;font-weight:900;font-size:1.3rem;color:var(--red);margin-bottom:2px}
        .astat-box label{font-size:.75rem;color:var(--muted);font-weight:600}
        .admin-tab{background:var(--surface);border:1.5px solid #eee;border-radius:50px;padding:9px 20px;font-weight:700;font-size:.88rem;cursor:pointer;color:var(--dark);transition:all .2s}
        .admin-tab:hover{border-color:var(--red);color:var(--red)}
        .admin-tab.active{background:var(--red);color:#fff;border-color:var(--red);box-shadow:0 4px 14px var(--red-glow)}
        .admin-layout{display:grid;grid-template-columns:350px 1fr;gap:28px;align-items:start}
        .admin-form-box{background:var(--surface);border-radius:20px;padding:24px;box-shadow:0 2px 14px rgba(0,0,0,.06)}
        .form-group{margin-bottom:14px}
        .form-group label{display:block;font-weight:700;font-size:.82rem;color:var(--dark);margin-bottom:6px}
        .form-input{width:100%;border:1.5px solid #e0e0e0;border-radius:10px;padding:10px 14px;font-family:'Nunito Sans',sans-serif;font-size:.9rem;color:var(--dark);background:var(--surface);outline:none;transition:border-color .2s}
        .form-input:focus{border-color:var(--red)}
        .submit-red-btn{flex:1;background:var(--red);color:#fff;border:none;padding:12px;border-radius:50px;font-family:'Nunito',sans-serif;font-weight:800;font-size:.9rem;cursor:pointer;box-shadow:0 4px 14px var(--red-glow);transition:background .2s,transform .15s}
        .submit-red-btn:hover{background:var(--red-dark);transform:translateY(-1px)}
        .admin-items-grid{display:flex;flex-direction:column;gap:10px}
        .admin-item-row{background:var(--surface);border-radius:12px;padding:12px 16px;display:flex;align-items:center;gap:12px;box-shadow:0 1px 8px rgba(0,0,0,.05)}
        .order-card{background:var(--surface);border-radius:14px;padding:18px 20px;box-shadow:0 2px 12px rgba(0,0,0,.06)}
        @media(max-width:900px){.admin-stats{grid-template-columns:repeat(2,1fr)}.admin-layout{grid-template-columns:1fr}main[style]{padding:36px 20px 60px!important}}
      `}</style>
    </main>
  );
};

export default Admin;