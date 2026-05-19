import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
// DEPLOYMENT: Replace http://localhost:5000 with your deployed backend URL
const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const CATEGORIES = [
  { key: 'pizza',   label: 'Pizza',   emoji: '🍕' },
  { key: 'burgers', label: 'Burgers', emoji: '🍔' },
  { key: 'drinks',  label: 'Drinks',  emoji: '🥤' },
  { key: 'salads',  label: 'Salads',  emoji: '🥗' },
  { key: 'deals',   label: 'Deals',   emoji: '🎉' },
];

// SAMPLE MENU DATA - This ensures items show even if backend is empty
const SAMPLE_MENU_ITEMS = [
  // PIZZA ITEMS (5 items)
  { _id: 'sample_p1', name: 'Margherita', description: 'Fresh tomatoes, mozzarella, basil, olive oil', price: 599, category: 'pizza' },
  { _id: 'sample_p2', name: 'Pepperoni', description: 'Classic pepperoni, mozzarella, tomato sauce', price: 799, category: 'pizza' },
  { _id: 'sample_p3', name: 'BBQ Chicken', description: 'Grilled chicken, BBQ sauce, red onions, cilantro', price: 899, category: 'pizza' },
  { _id: 'sample_p4', name: 'Veggie Supreme', description: 'Bell peppers, olives, mushrooms, onions, corn', price: 749, category: 'pizza' },
  { _id: 'sample_p5', name: 'Four Cheese', description: 'Mozzarella, parmesan, gorgonzola, ricotta', price: 849, category: 'pizza' },

  // BURGER ITEMS (5 items)
  { _id: 'sample_b1', name: 'Classic Cheeseburger', description: 'Beef patty, cheddar, lettuce, tomato, special sauce', price: 449, category: 'burgers' },
  { _id: 'sample_b2', name: 'Double Decker', description: 'Two beef patties, double cheese, pickles, onion rings', price: 649, category: 'burgers' },
  { _id: 'sample_b3', name: 'Crispy Chicken', description: 'Fried chicken fillet, slaw, mayo, pickles', price: 499, category: 'burgers' },
  { _id: 'sample_b4', name: 'Mushroom Swiss', description: 'Sauteed mushrooms, swiss cheese, caramelized onions', price: 529, category: 'burgers' },
  { _id: 'sample_b5', name: 'Veggie Delight', description: 'Plant-based patty, avocado, sprouts, vegan sauce', price: 479, category: 'burgers' },

  // DRINKS ITEMS (5 items)
  { _id: 'sample_d1', name: 'Fresh Lime Soda', description: 'Fresh lime, mint, soda water, choice of salt/sweet', price: 149, category: 'drinks' },
  { _id: 'sample_d2', name: 'Mango Smoothie', description: 'Ripe mangoes, yogurt, honey, pinch of cardamom', price: 249, category: 'drinks' },
  { _id: 'sample_d3', name: 'Iced Latte', description: 'Espresso, chilled milk, vanilla syrup, ice', price: 199, category: 'drinks' },
  { _id: 'sample_d4', name: 'Berry Blast', description: 'Mixed berries, lemonade, fresh mint, sparkling water', price: 179, category: 'drinks' },
  { _id: 'sample_d5', name: 'Mocktail Sunrise', description: 'Orange juice, grenadine, soda, cherry garnish', price: 229, category: 'drinks' },

  // SALADS ITEMS (5 items)
  { _id: 'sample_s1', name: 'Caesar Salad', description: 'Romaine, parmesan, croutons, creamy caesar dressing', price: 349, category: 'salads' },
  { _id: 'sample_s2', name: 'Greek Salad', description: 'Feta, olives, cucumber, tomato, red onion, oregano', price: 389, category: 'salads' },
  { _id: 'sample_s3', name: 'Quinoa Power Bowl', description: 'Quinoa, chickpeas, avocado, kale, tahini dressing', price: 429, category: 'salads' },
  { _id: 'sample_s4', name: 'Chicken Cobb', description: 'Grilled chicken, bacon, egg, avocado, blue cheese', price: 479, category: 'salads' },
  { _id: 'sample_s5', name: 'Fruit & Nut', description: 'Mixed greens, apple, walnuts, cranberries, feta', price: 399, category: 'salads' },

  // DEALS / COMBOS (5 items)
  { _id: 'sample_c1', name: 'Pizza & Drink', description: 'Any medium pizza + 2 regular drinks', price: 999, category: 'deals' },
  { _id: 'sample_c2', name: 'Family Feast', description: '2 large pizzas, 4 drinks, 1 garlic bread', price: 1799, category: 'deals' },
  { _id: 'sample_c3', name: 'Burger Meal', description: 'Any burger + fries + drink', price: 599, category: 'deals' },
  { _id: 'sample_c4', name: 'Late Night Munch', description: '2 burgers, 2 drinks, onion rings', price: 1099, category: 'deals' },
  { _id: 'sample_c5', name: 'Healthy Combo', description: 'Any salad + fresh juice', price: 599, category: 'deals' },
];

// Emoji mapping for each category (for consistent display)
const getItemEmoji = (category, index) => {
  const emojiMap = {
    pizza: ['🍕', '🍕', '🍕', '🍕', '🍕'],
    burgers: ['🍔', '🍔', '🍔', '🍔', '🍔'],
    drinks: ['🥤', '🥤', '🥤', '🥤', '🥤'],
    salads: ['🥗', '🥗', '🥗', '🥗', '🥗'],
    deals: ['🎉', '🎉', '🎉', '🎉', '🎉'],
  };
  const categoryEmojis = emojiMap[category] || ['🍽️'];
  return categoryEmojis[index % categoryEmojis.length];
};

const Menu = () => {
  const [items, setItems] = useState(SAMPLE_MENU_ITEMS); // Start with sample data
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState('pizza');
  const [added, setAdded] = useState({});
  const { addToCart } = useCart();

  useEffect(() => {
    // Try to fetch from backend, but keep sample data as fallback
    fetch(`${API}/api/menu`)
      .then(r => r.json())
      .then(data => {
        if (data.items && data.items.length > 0) {
          // If backend has items, use them
          setItems(data.items);
        }
        setLoading(false);
      })
      .catch(err => {
        console.warn('Backend not available, using sample data:', err);
        setLoading(false);
      });
  }, []);

  const filtered = items.filter(item => item.category === active);

  const handleAdd = (item) => {
    addToCart(item);
    setAdded(p => ({ ...p, [item._id]: true }));
    setTimeout(() => setAdded(p => ({ ...p, [item._id]: false })), 1000);
  };

  return (
    <main style={{ minHeight: '80vh', background: 'var(--bg)' }}>
      <div style={{ padding: '50px 48px 20px' }}>
        <h1 className="page-title animated-title">Our Full Menu</h1>
      </div>

      {/* Category tabs */}
      <div style={{ padding: '0 48px', display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 36 }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat.key}
            onClick={() => setActive(cat.key)}
            className={`cat-tab ${active === cat.key ? 'cat-tab-active' : ''}`}
          >
            {cat.emoji} {cat.label} ({items.filter(i => i.category === cat.key).length})
          </button>
        ))}
      </div>

      {/* Grid of items */}
      {loading ? (
        <div style={{ padding: '0 48px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 20 }}>
          {[1,2,3,4,5,6].map(i => <div key={i} className="skeleton-card" style={{ height: 260 }} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ padding: '0 48px 80px', textAlign: 'center' }}>
          <div style={{ padding: '60px 20px', background: 'var(--surface)', borderRadius: '20px' }}>
            <span style={{ fontSize: '4rem', display: 'block', marginBottom: '16px' }}>🍽️</span>
            <h3 style={{ color: 'var(--dark)', marginBottom: '8px' }}>No items in this category</h3>
            <p style={{ color: 'var(--muted)' }}>Check back soon for delicious options!</p>
          </div>
        </div>
      ) : (
        <div className="menu-grid">
          {filtered.map((item, idx) => (
            <div className="menu-item-card" key={item._id}>
              <div className="menu-emoji-box">
                {getItemEmoji(item.category, idx)}
              </div>
              <div className="menu-item-body">
                <h3>{item.name}</h3>
                <p>{item.description || 'Delicious food item'}</p>
                <div className="menu-item-footer">
                  <span className="menu-price">Rs. {item.price.toLocaleString()}</span>
                  <button
                    className={`add-btn-red ${added[item._id] ? 'added-green' : ''}`}
                    onClick={() => handleAdd(item)}
                  >
                    {added[item._id] ? '✓ Added' : '+ Add to Cart'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .page-title{font-family:'Nunito',sans-serif;font-size:2.2rem;font-weight:900;color:var(--dark);display:inline-block;position:relative;padding-bottom:12px}
        .animated-title::after{content:'';position:absolute;bottom:0;left:0;width:0;height:3px;background:var(--red);border-radius:2px;animation:growLine .7s .2s ease forwards}
        @keyframes growLine{to{width:100%}}
        .cat-tab{background:var(--surface);border:1.5px solid #eee;border-radius:50px;padding:10px 22px;font-family:'Nunito',sans-serif;font-weight:700;font-size:.9rem;cursor:pointer;color:var(--dark);transition:all .2s ease}
        .cat-tab:hover{background:var(--red-light);border-color:var(--red-border);color:var(--red);transform:translateY(-2px)}
        .cat-tab-active{background:var(--red)!important;color:#fff!important;border-color:var(--red)!important;box-shadow:0 4px 14px var(--red-glow)}
        .menu-grid{padding:0 48px 80px;display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:24px}
        .menu-item-card{background:var(--surface);border-radius:20px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,.06);transition:transform .3s,box-shadow .3s}
        .menu-item-card:hover{transform:translateY(-8px);box-shadow:0 18px 44px rgba(0,0,0,.12)}
        .menu-emoji-box{height:140px;background:linear-gradient(135deg,var(--red-light),#ffe8ec);display:flex;align-items:center;justify-content:center;font-size:3.5rem}
        .menu-item-body{padding:16px}
        .menu-item-body h3{font-family:'Nunito',sans-serif;font-weight:800;font-size:.95rem;margin-bottom:5px;color:var(--dark)}
        .menu-item-body p{color:var(--muted);font-size:.78rem;line-height:1.5;min-height:48px}
        .menu-item-footer{display:flex;justify-content:space-between;align-items:center;margin-top:12px}
        .menu-price{font-family:'Nunito',sans-serif;font-weight:900;font-size:.9rem;color:var(--dark)}
        .add-btn-red{background:var(--red);color:#fff;border:none;padding:7px 14px;border-radius:50px;font-size:.76rem;font-weight:800;cursor:pointer;transition:background .2s,transform .15s,box-shadow .2s;box-shadow:0 3px 10px var(--red-glow)}
        .add-btn-red:hover{background:var(--red-dark);transform:scale(1.05);box-shadow:0 6px 16px rgba(184,0,31,.4)}
        .added-green{background:#27ae60!important;box-shadow:0 3px 10px rgba(39,174,96,.3)!important}
        .skeleton-card{background:linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%);background-size:200% 100%;animation:shimmer 1.4s infinite;border-radius:20px}
        @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
        @media(max-width:768px){.menu-grid{padding:0 20px 60px;gap:16px}.page-title{font-size:1.7rem}}
      `}</style>
    </main>
  );
};

export default Menu;