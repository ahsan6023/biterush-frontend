import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MenuSection from '../components/MenuSection';
// DEPLOYMENT: Replace http://localhost:5000 with your deployed backend URL
const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const SLIDES = [
  { emoji: '🎉', title: 'Weekend Mega Deal', subtitle: 'Get 2 large pizzas + 4 drinks for the price of one', tag: '40% OFF', bg: 'linear-gradient(135deg,#fff0f2,#ffd0d8)' },
  { emoji: '🏷️', title: "Today's Special Discount", subtitle: 'All burgers 30% off — today only!', tag: '30% OFF', bg: 'linear-gradient(135deg,#fff8e0,#ffe0b2)' },
  { emoji: '🚀', title: 'Free Delivery', subtitle: 'On your first 3 orders — no code needed', tag: 'FREE DELIVERY', bg: 'linear-gradient(135deg,#e0f7ef,#b2ead8)' },
];

// SAMPLE DATA FALLBACK - This ensures menu shows even if backend is not available
const SAMPLE_MENU_ITEMS = [
  // PIZZA ITEMS (5 items)
  { _id: 'sample_p1', name: 'Margherita', description: 'Fresh tomatoes, mozzarella, basil, olive oil', price: 599, category: 'pizza', emoji: '🍕' },
  { _id: 'sample_p2', name: 'Pepperoni', description: 'Classic pepperoni, mozzarella, tomato sauce', price: 799, category: 'pizza', emoji: '🍕' },
  { _id: 'sample_p3', name: 'BBQ Chicken', description: 'Grilled chicken, BBQ sauce, red onions, cilantro', price: 899, category: 'pizza', emoji: '🍕' },
  { _id: 'sample_p4', name: 'Veggie Supreme', description: 'Bell peppers, olives, mushrooms, onions, corn', price: 749, category: 'pizza', emoji: '🍕' },
  { _id: 'sample_p5', name: 'Four Cheese', description: 'Mozzarella, parmesan, gorgonzola, ricotta', price: 849, category: 'pizza', emoji: '🧀' },
  // BURGERS
  { _id: 'sample_b1', name: 'Classic Cheeseburger', description: 'Beef patty, cheddar, lettuce, tomato, special sauce', price: 449, category: 'burgers', emoji: '🍔' },
  { _id: 'sample_b2', name: 'Double Decker', description: 'Two beef patties, double cheese, pickles, onion rings', price: 649, category: 'burgers', emoji: '🍔' },
  { _id: 'sample_b3', name: 'Crispy Chicken', description: 'Fried chicken fillet, slaw, mayo, pickles', price: 499, category: 'burgers', emoji: '🐔' },
  { _id: 'sample_b4', name: 'Mushroom Swiss', description: 'Sauteed mushrooms, swiss cheese, caramelized onions', price: 529, category: 'burgers', emoji: '🍄' },
  { _id: 'sample_b5', name: 'Veggie Delight', description: 'Plant-based patty, avocado, sprouts, vegan sauce', price: 479, category: 'burgers', emoji: '🥑' },
  // DRINKS
  { _id: 'sample_d1', name: 'Fresh Lime Soda', description: 'Fresh lime, mint, soda water, choice of salt/sweet', price: 149, category: 'drinks', emoji: '🍋' },
  { _id: 'sample_d2', name: 'Mango Smoothie', description: 'Ripe mangoes, yogurt, honey, pinch of cardamom', price: 249, category: 'drinks', emoji: '🥭' },
  { _id: 'sample_d3', name: 'Iced Latte', description: 'Espresso, chilled milk, vanilla syrup, ice', price: 199, category: 'drinks', emoji: '☕' },
  { _id: 'sample_d4', name: 'Berry Blast', description: 'Mixed berries, lemonade, fresh mint, sparkling water', price: 179, category: 'drinks', emoji: '🍓' },
  { _id: 'sample_d5', name: 'Mocktail Sunrise', description: 'Orange juice, grenadine, soda, cherry garnish', price: 229, category: 'drinks', emoji: '🍹' },
  // SALADS
  { _id: 'sample_s1', name: 'Caesar Salad', description: 'Romaine, parmesan, croutons, creamy caesar dressing', price: 349, category: 'salads', emoji: '🥗' },
  { _id: 'sample_s2', name: 'Greek Salad', description: 'Feta, olives, cucumber, tomato, red onion, oregano', price: 389, category: 'salads', emoji: '🥗' },
  { _id: 'sample_s3', name: 'Quinoa Power Bowl', description: 'Quinoa, chickpeas, avocado, kale, tahini dressing', price: 429, category: 'salads', emoji: '🥑' },
  { _id: 'sample_s4', name: 'Chicken Cobb', description: 'Grilled chicken, bacon, egg, avocado, blue cheese', price: 479, category: 'salads', emoji: '🍗' },
  { _id: 'sample_s5', name: 'Fruit & Nut', description: 'Mixed greens, apple, walnuts, cranberries, feta', price: 399, category: 'salads', emoji: '🍎' },
  // DEALS
  { _id: 'sample_c1', name: 'Pizza & Drink', description: 'Any medium pizza + 2 regular drinks', price: 999, category: 'deals', emoji: '🎉' },
  { _id: 'sample_c2', name: 'Family Feast', description: '2 large pizzas, 4 drinks, 1 garlic bread', price: 1799, category: 'deals', emoji: '👨‍👩‍👧‍👦' },
  { _id: 'sample_c3', name: 'Burger Meal', description: 'Any burger + fries + drink', price: 599, category: 'deals', emoji: '🍟' },
  { _id: 'sample_c4', name: 'Late Night Munch', description: '2 burgers, 2 drinks, onion rings', price: 1099, category: 'deals', emoji: '🌙' },
  { _id: 'sample_c5', name: 'Healthy Combo', description: 'Any salad + fresh juice', price: 599, category: 'deals', emoji: '💪' },
];

const Carousel = () => {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setCurrent(c => (c + 1) % SLIDES.length), 3500);
    return () => clearInterval(t);
  }, []);
  const s = SLIDES[current];
  return (
    <div style={{ background: s.bg, borderRadius: 24, padding: '40px 32px', minHeight: 300, display: 'flex', flexDirection: 'column', justifyContent: 'center', transition: 'background 0.6s' }}>
      <div style={{ textAlign: 'center' }}>
        <span style={{ display: 'inline-block', background: 'var(--red)', color: '#fff', padding: '4px 14px', borderRadius: 50, fontSize: '.78rem', fontWeight: 800, marginBottom: 12 }}>{s.tag}</span>
        <div style={{ fontSize: '4.5rem', margin: '10px 0' }}>{s.emoji}</div>
        <h3 style={{ fontFamily: 'Nunito,sans-serif', fontWeight: 900, fontSize: '1.4rem', color: 'var(--dark)', marginBottom: 6 }}>{s.title}</h3>
        <p style={{ color: 'var(--muted)', fontSize: '.88rem' }}>{s.subtitle}</p>
      </div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 20 }}>
        {SLIDES.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} style={{ width: i === current ? 22 : 8, height: 8, borderRadius: 4, border: 'none', background: i === current ? 'var(--red)' : '#ccc', cursor: 'pointer', transition: 'all 0.3s', padding: 0 }} />
        ))}
      </div>
    </div>
  );
};

const Home = () => {
  const [menuItems, setMenuItems] = useState(SAMPLE_MENU_ITEMS); // Start with sample data
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to fetch from backend, but keep sample data as fallback
    fetch(`${API}/api/menu`)
      .then(r => r.json())
      .then(data => { 
        if (data.success && data.items && data.items.length > 0) {
          setMenuItems(data.items);
        }
        setLoading(false);
      })
      .catch((err) => { 
        console.warn('Backend not available, using sample data:', err);
        setLoading(false);
      });
  }, []);

  // Debug: Log how many items we have
  console.log('Menu items loaded:', menuItems.length);

  return (
    <main>
      {/* HERO */}
      <section className="home-hero">
        <div className="home-hero-text">
          <div className="hero-badge">⚡ 20–30 min delivery</div>
          <h1>Your Favorite Food,<br /><em>Delivered Fast</em></h1>
          <p>Order from 500+ local restaurants. Fresh, hot and right to your door.</p>
          <div className="hero-btns">
            <Link to="/menu" className="btn-red">🍕 Order Now</Link>
          </div>
        </div>
        <div className="home-hero-visual"><Carousel /></div>
      </section>

      {/* EXPLORE MENU - This will now show items */}
      <MenuSection items={menuItems} loading={loading} />

      {/* WHY US GALLERY */}
      <section className="why-section">
        <div className="why-header">
          <h2 className="animated-title">Why Choose BiteRush?</h2>
        </div>
        <div className="why-grid">
          {[
            { emoji: '⚡', label: 'Lightning Fast', desc: 'Average delivery in under 30 minutes, guaranteed fresh and hot.', bg: 'linear-gradient(135deg,var(--red-light),#ffe8ec)' },
            { emoji: '🌿', label: 'Fresh Ingredients', desc: 'Every meal made with locally sourced, quality ingredients daily.', bg: 'linear-gradient(135deg,#e8f5e9,#c8e6c9)' },
            { emoji: '💳', label: 'Cash on Delivery', desc: 'Simple cash on delivery — no hidden charges, no complications.', bg: 'linear-gradient(135deg,#e3f2fd,#bbdefb)' },
            { emoji: '❤️', label: 'Loved by Thousands', desc: 'Over 50,000 happy customers and growing every single day.', bg: 'linear-gradient(135deg,#fce4ec,#f8bbd9)' },
          ].map(c => (
            <div className="why-card" key={c.label}>
              <div className="why-icon" style={{ background: c.bg }}>{c.emoji}</div>
              <div className="why-info">
                <h3>{c.label}</h3>
                <p>{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <style>{`
        .home-hero{padding:70px 48px;display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center;background:linear-gradient(160deg,var(--red-light) 0%,var(--bg) 100%)}
        .hero-badge{display:inline-block;background:var(--red-light);color:var(--red);padding:6px 16px;border-radius:50px;font-size:.8rem;font-weight:700;margin-bottom:16px;border:1px solid var(--red-border)}
        .home-hero-text h1{font-family:'Nunito',sans-serif;font-size:3rem;font-weight:900;line-height:1.15;color:var(--dark)}
        .home-hero-text h1 em{color:var(--red);font-style:normal}
        .home-hero-text p{color:var(--muted);margin:16px 0 32px;font-size:1rem;line-height:1.75}
        .hero-btns{display:flex;flex-wrap:wrap;gap:12px}
        .btn-red{background:var(--red);color:#fff;border:none;padding:14px 34px;border-radius:50px;font-size:1rem;font-weight:800;cursor:pointer;box-shadow:0 6px 20px var(--red-glow);transition:background .2s,transform .2s,box-shadow .25s;display:inline-flex;align-items:center;gap:8px;text-decoration:none}
        .btn-red:hover{background:var(--red-dark);transform:translateY(-3px) scale(1.02);box-shadow:0 12px 30px rgba(184,0,31,.45)}
        .btn-outline-red{background:transparent;color:var(--red);border:2px solid var(--red);padding:13px 28px;border-radius:50px;font-size:1rem;font-weight:700;cursor:pointer;transition:background .2s,color .2s,transform .2s;text-decoration:none;display:inline-flex;align-items:center}
        .btn-outline-red:hover{background:var(--red);color:#fff;transform:translateY(-2px);box-shadow:0 8px 22px var(--red-glow)}
        .why-section{padding:60px 48px 80px}
        .why-header{text-align:center;margin-bottom:40px}
        .animated-title{font-family:'Nunito',sans-serif;font-size:2rem;font-weight:900;color:var(--dark);display:inline-block;position:relative;padding-bottom:12px}
        .animated-title::after{content:'';position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:0;height:3px;background:var(--red);border-radius:2px;animation:growLine 0.7s 0.3s ease forwards}
        @keyframes growLine{to{width:60%}}
        .why-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:24px}
        .why-card{background:var(--surface);border-radius:20px;overflow:hidden;display:flex;box-shadow:0 2px 16px rgba(0,0,0,.06);transition:transform .3s,box-shadow .3s}
        .why-card:hover{transform:translateY(-5px);box-shadow:0 14px 36px rgba(0,0,0,.1)}
        .why-icon{width:110px;min-height:110px;display:flex;align-items:center;justify-content:center;font-size:2.8rem;flex-shrink:0}
        .why-info{padding:20px}
        .why-info h3{font-family:'Nunito',sans-serif;font-weight:800;font-size:1.05rem;color:var(--dark);margin-bottom:6px}
        .why-info p{color:var(--muted);font-size:.83rem;line-height:1.6}
        @media(max-width:900px){.home-hero{grid-template-columns:1fr;padding:48px 24px}.home-hero-text h1{font-size:2.2rem}.why-grid{grid-template-columns:1fr}}
        @media(max-width:600px){.home-hero{padding:36px 16px}.home-hero-text h1{font-size:1.9rem}}
      `}</style>
    </main>
  );
};

export default Home;
