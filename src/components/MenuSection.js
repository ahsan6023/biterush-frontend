import React, { useState, useRef, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import './MenuSection.css';

const CATEGORIES = [
  { key: 'pizza',   label: 'Pizza',   emoji: '🍕' },
  { key: 'burgers', label: 'Burgers', emoji: '🍔' },
  { key: 'drinks',  label: 'Drinks',  emoji: '🥤' },
  { key: 'salads',  label: 'Salads',  emoji: '🥗' },
  { key: 'deals',   label: 'Deals',   emoji: '🎉' },
];

// Fallback emojis per category
const CATEGORY_EMOJIS = {
  pizza:   '🍕',
  burgers: '🍔',
  drinks:  '🥤',
  salads:  '🥗',
  deals:   '🎉',
};

const MenuSection = ({ items, loading }) => {
  const [active, setActive] = useState('pizza');
  const { addToCart } = useCart();
  const [added, setAdded] = useState({});
  const [showLeftBtn, setShowLeftBtn] = useState(false);
  const [showRightBtn, setShowRightBtn] = useState(true);
  const [activeDot, setActiveDot] = useState(0);
  const [imageErrors, setImageErrors] = useState({});
  const scrollContainerRef = useRef(null);

  // Filter items based on active category
  const filteredItems = items.filter(item => item.category === active);

  const handleAdd = (item) => {
    addToCart(item);
    setAdded(prev => ({ ...prev, [item._id]: true }));
    setTimeout(() => setAdded(prev => ({ ...prev, [item._id]: false })), 1000);
  };

  // Get image URL for an item
  const getItemImage = (item) => {
    if (item.imageUrl) return item.imageUrl;
    if (item.image) return item.image;
    return null;
  };

  // Get fallback emoji when image fails to load or doesn't exist
  const getItemEmoji = (item, index) => {
    if (item.emoji) return item.emoji;
    if (item.imageEmoji) return item.imageEmoji;
    return CATEGORY_EMOJIS[item.category] || '🍽️';
  };

  // Handle image load error
  const handleImageError = (itemId) => {
    setImageErrors(prev => ({ ...prev, [itemId]: true }));
  };

  // Scroll functions
  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 240;
      const currentScroll = scrollContainerRef.current.scrollLeft;
      const newScroll = direction === 'left' 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: newScroll,
        behavior: 'smooth'
      });
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftBtn(scrollLeft > 10);
      setShowRightBtn(scrollLeft + clientWidth < scrollWidth - 10);
      
      const totalDots = Math.ceil(filteredItems.length / 3);
      if (totalDots > 0) {
        const scrollPercentage = scrollLeft / (scrollWidth - clientWidth);
        const dotIndex = Math.min(
          Math.floor(scrollPercentage * totalDots),
          totalDots - 1
        );
        setActiveDot(Math.max(0, dotIndex));
      }
    }
  };

  const scrollToDot = (index) => {
    if (scrollContainerRef.current) {
      const cardWidth = 240;
      const scrollPosition = index * 3 * cardWidth;
      scrollContainerRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      setTimeout(handleScroll, 100);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [filteredItems.length, active]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = 0;
      handleScroll();
    }
  }, [active]);

  const totalDots = Math.ceil(filteredItems.length / 3);

  return (
    <section className="menu-section">
      <div className="section-header">
        <h2 className="section-title">Explore Menu</h2>
        <span className="title-underline"></span>
      </div>

      <div className="category-tabs">
        {CATEGORIES.map(cat => (
          <button
            key={cat.key}
            className={`cat-tab ${active === cat.key ? 'active' : ''}`}
            onClick={() => setActive(cat.key)}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-row">
          {[1,2,3,4].map(i => <div key={i} className="skeleton-card" />)}
        </div>
      ) : (
        <>
          <div className="items-scroll-wrapper">
            {showLeftBtn && filteredItems.length > 3 && (
              <button className="scroll-btn scroll-btn-left" onClick={() => scroll('left')}>
                ‹
              </button>
            )}
            
            <div className="items-scroll" ref={scrollContainerRef}>
              {filteredItems.length > 0 ? (
                filteredItems.map((item, idx) => {
                  const itemImage = getItemImage(item);
                  const hasImageError = imageErrors[item._id];
                  const showImage = itemImage && !hasImageError;
                  
                  return (
                    <div className="item-card" key={item._id}>
                      <div className="item-emoji-box">
                        {showImage ? (
                          <img 
                            src={itemImage} 
                            alt={item.name}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                            onError={() => handleImageError(item._id)}
                          />
                        ) : (
                          <span style={{ fontSize: '3.5rem' }}>
                            {getItemEmoji(item, idx)}
                          </span>
                        )}
                      </div>
                      <div className="item-body">
                        <h3>{item.name}</h3>
                        <p>{item.description}</p>
                        <div className="item-footer">
                          <span className="item-price">Rs. {item.price.toLocaleString()}</span>
                          <button
                            className={`add-to-cart-btn ${added[item._id] ? 'added' : ''}`}
                            onClick={() => handleAdd(item)}
                          >
                            {added[item._id] ? '✓ Added' : '+ Add'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="empty-category-message">
                  <span>No items in this category yet. Check back soon! 🍽️</span>
                </div>
              )}
            </div>
            
            {showRightBtn && filteredItems.length > 3 && (
              <button className="scroll-btn scroll-btn-right" onClick={() => scroll('right')}>
                ›
              </button>
            )}
          </div>

          {filteredItems.length > 3 && totalDots > 1 && (
            <div className="scroll-indicator">
              {[...Array(totalDots)].map((_, idx) => (
                <div 
                  key={idx} 
                  className={`scroll-dot ${activeDot === idx ? 'active' : ''}`}
                  onClick={() => scrollToDot(idx)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default MenuSection;