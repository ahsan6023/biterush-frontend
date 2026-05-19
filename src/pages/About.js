import React from 'react';

const About = () => (
  <main style={{ background: 'var(--bg)', minHeight: '80vh' }}>
    <div style={{ padding: '60px 48px 80px', maxWidth: 960, margin: '0 auto' }}>
      <h1 className="about-title animated-title">About BiteRush</h1>

      <div className="about-layout">
        {/* Owner image placeholder */}
        <div className="owner-img-box">
          <div className="owner-placeholder">👨‍🍳</div>
          <h3>Chef & Founder</h3>
          <p className="owner-name">Muhammad Ali</p>
          <p className="owner-tagline">"Food is love made edible."</p>
        </div>

        {/* Description */}
        <div className="about-content">
          <h2>Our Story</h2>
          <p>BiteRush was founded in 2020 with a simple mission — bring the best local food to your doorstep as fast as possible. What started as a small family kitchen in Peshawar has grown into one of the most trusted food delivery platforms in the region.</p>
          <p>Our founder, Chef Muhammad Ali, has over 15 years of culinary experience across Pakistan and abroad. He built BiteRush on the belief that great food shouldn't be a luxury — it should be accessible, fast, and absolutely delicious.</p>
          <p>Every dish we serve is prepared fresh to order, using locally sourced ingredients from trusted suppliers.</p>

          <div className="about-stats">
            <div className="astat"><strong>500+</strong><span>Menu Items</span></div>
            <div className="astat"><strong>50k+</strong><span>Happy Customers</span></div>
            <div className="astat"><strong>28 min</strong><span>Avg Delivery</span></div>
            <div className="astat"><strong>4.9 ⭐</strong><span>Rating</span></div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div style={{ marginTop: 60 }}>
        <h2 className="animated-title" style={{ fontFamily: 'Nunito,sans-serif', fontWeight: 900, fontSize: '1.8rem', color: 'var(--dark)', paddingBottom: 12, marginBottom: 32 }}>Our Values</h2>
        <div className="values-grid">
          {[
            { emoji: '🌿', title: 'Fresh Always', desc: 'We never compromise on freshness. Every ingredient is sourced daily from local markets.' },
            { emoji: '⚡', title: 'Speed Matters', desc: 'Your time is precious. We guarantee delivery in under 30 minutes or your next order is free.' },
            { emoji: '❤️', title: 'Community First', desc: 'We partner with local restaurants and farms, supporting the community we call home.' },
            { emoji: '✅', title: 'Quality Assured', desc: 'Every order goes through a quality check before it reaches your door. No exceptions.' },
          ].map(v => (
            <div className="value-card" key={v.title}>
              <div className="value-emoji">{v.emoji}</div>
              <h3>{v.title}</h3>
              <p>{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>

    <style>{`
      .about-title{font-family:'Nunito',sans-serif;font-size:2.2rem;font-weight:900;color:var(--dark);display:inline-block;position:relative;padding-bottom:12px;margin-bottom:40px}
      .animated-title::after{content:'';position:absolute;bottom:0;left:0;width:0;height:3px;background:var(--red);border-radius:2px;animation:growLine .7s .2s ease forwards}
      @keyframes growLine{to{width:100%}}
      .about-layout{display:grid;grid-template-columns:280px 1fr;gap:48px;align-items:start}
      .owner-img-box{background:var(--surface);border-radius:24px;padding:32px 24px;text-align:center;box-shadow:0 2px 20px rgba(0,0,0,.07)}
      .owner-placeholder{width:120px;height:120px;background:linear-gradient(135deg,var(--red-light),#ffe8ec);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:3.5rem;margin:0 auto 16px;border:3px solid var(--red-border)}
      .owner-img-box h3{font-family:'Nunito',sans-serif;font-weight:800;color:var(--muted);font-size:.88rem;letter-spacing:.5px;text-transform:uppercase;margin-bottom:4px}
      .owner-name{font-family:'Nunito',sans-serif;font-weight:900;font-size:1.2rem;color:var(--dark);margin-bottom:8px}
      .owner-tagline{color:var(--muted);font-size:.85rem;font-style:italic;line-height:1.5}
      .about-content h2{font-family:'Nunito',sans-serif;font-weight:900;font-size:1.5rem;color:var(--dark);margin-bottom:16px}
      .about-content p{color:var(--muted);font-size:.95rem;line-height:1.8;margin-bottom:16px}
      .about-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-top:28px}
      .astat{background:var(--red-light);border-radius:14px;padding:16px 12px;text-align:center;border:1px solid var(--red-border)}
      .astat strong{display:block;font-family:'Nunito',sans-serif;font-weight:900;font-size:1.4rem;color:var(--red)}
      .astat span{font-size:.78rem;color:var(--muted);font-weight:600}
      .values-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:20px}
      .value-card{background:var(--surface);border-radius:18px;padding:24px;box-shadow:0 2px 14px rgba(0,0,0,.06);transition:transform .3s,box-shadow .3s}
      .value-card:hover{transform:translateY(-5px);box-shadow:0 12px 30px rgba(0,0,0,.1)}
      .value-emoji{font-size:2rem;margin-bottom:12px}
      .value-card h3{font-family:'Nunito',sans-serif;font-weight:800;font-size:1rem;color:var(--dark);margin-bottom:6px}
      .value-card p{color:var(--muted);font-size:.83rem;line-height:1.65}
      @media(max-width:768px){.about-layout{grid-template-columns:1fr}.about-stats{grid-template-columns:repeat(2,1fr)}.values-grid{grid-template-columns:1fr}main>div{padding:40px 20px 60px!important}}
    `}</style>
  </main>
);

export default About;
