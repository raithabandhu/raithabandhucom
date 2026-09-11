import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, ArrowRight, FlaskConical, TestTube, Beaker, Recycle, Atom, Layers, Package } from 'lucide-react';

const ICON_MAP = { FlaskConical, TestTube, Beaker, Recycle, Atom, Layers, Package };
function ProductIcon({ iconName, size = 36 }) {
  const Icon = ICON_MAP[iconName] || Package;
  return <Icon size={size} strokeWidth={1.5} />;
}
import Navbar from './Navbar';
import Footer from './Footer';
import './styles.css';

export default function Cart({ cart, setCart }) {
  const nav = useNavigate();
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  function updateQty(id, delta) {
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i));
  }

  function remove(id) {
    setCart(prev => prev.filter(i => i.id !== id));
  }

  return (
    <>
      <style>{`
        .cart-hero { position:relative; overflow:hidden; background:linear-gradient(135deg,#0d2e06,#1a4a0a,#2d7a1b); padding:60px 48px 48px; text-align:center; }
        .cart-hero h1 { color:#fff; font-size:clamp(1.8rem,4vw,2.8rem); font-weight:900; }
        .cart-layout { display:grid; grid-template-columns:1fr 360px; gap:32px; align-items:start; }
        .cart-items { display:flex; flex-direction:column; gap:16px; }
        .cart-item { background:#fff; border-radius:20px; padding:22px; display:flex; align-items:center; gap:20px; box-shadow:0 4px 16px rgba(0,0,0,.06); border:1px solid #e8f5e0; }
        .cart-item-icon { border-radius:16px; width:76px; height:76px; display:flex; align-items:center; justify-content:center; flex-shrink:0; color:#2d5a1b; background:linear-gradient(135deg,#e8f5e0,#c8e6a0); }
        .cart-item-info { flex:1; }
        .cart-item-info h3 { font-size:1rem; font-weight:800; color:#1a2e0f; margin-bottom:2px; }
        .cart-item-lot { font-size:.72rem; color:#aaa; margin-bottom:4px; }
        .cart-item-info p { font-size:.82rem; color:#5a7a4a; line-height:1.5; }
        .cart-item-price { font-size:.88rem; font-weight:800; color:#2d5a1b; margin-top:4px; }
        .cart-qty { display:flex; align-items:center; gap:14px; margin-top:12px; }
        .qty-btn { width:32px; height:32px; border-radius:50%; border:2px solid #2d5a1b; background:#fff; color:#2d5a1b; cursor:pointer; display:flex; align-items:center; justify-content:center; }
        .qty-val { font-weight:800; font-size:1.05rem; color:#1a2e0f; min-width:24px; text-align:center; }
        .cart-remove { background:none; border:none; color:#e53e3e; cursor:pointer; padding:8px; border-radius:10px; display:flex; align-items:center; gap:4px; font-size:.82rem; font-weight:600; }
        .cart-summary { background:#fff; border-radius:24px; padding:32px; box-shadow:0 4px 24px rgba(0,0,0,.08); border:1px solid #e8f5e0; position:sticky; top:90px; }
        .cart-summary h2 { font-size:1.2rem; font-weight:800; color:#1a2e0f; margin-bottom:24px; padding-bottom:16px; border-bottom:2px solid #f0fae8; }
        .summary-row { display:flex; justify-content:space-between; font-size:.9rem; color:#5a7a4a; margin-bottom:12px; align-items:center; }
        .summary-row .emoji { font-size:1.1rem; margin-right:6px; }
        .summary-total { display:flex; justify-content:space-between; font-weight:800; font-size:1.05rem; color:#1a2e0f; border-top:2px solid #f0fae8; padding-top:16px; margin-top:8px; }
        .summary-note { font-size:.75rem; color:#8ab87a; font-style:italic; margin:14px 0 24px; line-height:1.5; }
        .btn-checkout { width:100%; background:linear-gradient(135deg,#2d5a1b,#3d7a25); color:#fff; border:none; padding:15px; border-radius:16px; font-size:1rem; font-weight:800; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; }
        .btn-continue { width:100%; background:#f7faf3; color:#2d5a1b; border:2px solid #d0e8c0; padding:13px; border-radius:16px; font-size:.92rem; font-weight:700; cursor:pointer; margin-top:10px; display:flex; align-items:center; justify-content:center; gap:8px; }
        .cart-empty { text-align:center; padding:100px 20px; }
        .cart-empty-icon { font-size:6rem; margin-bottom:24px; display:block; }
        .cart-empty h2 { font-size:1.6rem; font-weight:800; color:#1a2e0f; margin-bottom:12px; }
        .cart-empty p { color:#5a7a4a; margin-bottom:32px; font-size:1rem; }
        .btn-shop { background:linear-gradient(135deg,#2d5a1b,#3d7a25); color:#fff; border:none; padding:15px 44px; border-radius:50px; font-size:1rem; font-weight:800; cursor:pointer; display:inline-flex; align-items:center; gap:8px; }
        @media(max-width:768px) { .cart-layout { grid-template-columns:1fr; } .cart-hero { padding:48px 20px 36px; } }
      `}</style>

      <Navbar cartCount={cartCount} />

      <div className="cart-hero">
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          🛒 Your Cart
        </motion.h1>
      </div>

      <svg viewBox="0 0 1440 50" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"
        style={{ display: 'block', background: 'linear-gradient(135deg,#0d2e06,#2d7a1b)', marginBottom: -4 }}>
        <path d="M0,25 C360,50 1080,0 1440,25 L1440,50 L0,50 Z" fill="#f7faf3" />
      </svg>

      <div className="rb-page">
        {cart.length === 0 ? (
          <motion.div className="cart-empty"
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            <motion.span className="cart-empty-icon"
              animate={{ rotate: [0, -10, 10, -10, 0] }} transition={{ duration: 1, delay: 0.5 }}>
              🛒
            </motion.span>
            <h2>Your cart is empty</h2>
            <p>Add some fertilisers to get started.</p>
            <motion.button className="btn-shop" onClick={() => nav('/products')}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <ShoppingBag size={18} /> Browse Products
            </motion.button>
          </motion.div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items">
              <AnimatePresence>
                {cart.map((item, i) => (
                  <motion.div className="cart-item" key={item.id}
                    initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 60, scale: 0.9 }}
                    transition={{ duration: 0.35, delay: i * 0.07 }}
                    layout>
                    <motion.div className="cart-item-icon" whileHover={{ scale: 1.1, rotate: 5 }}>
                      <ProductIcon iconName={item.icon} size={36} />
                    </motion.div>
                    <div className="cart-item-info">
                      <h3>{item.name}</h3>
                      <div className="cart-item-lot">Lot: {item.lot}</div>
                      <p>{item.desc}</p>
                      <div className="cart-item-price">₹{(item.price * item.qty).toLocaleString('en-IN')}</div>
                      <div className="cart-qty">
                        <motion.button className="qty-btn" onClick={() => updateQty(item.id, -1)}
                          whileHover={{ background: '#2d5a1b', color: '#fff' }} whileTap={{ scale: 0.9 }}>
                          <Minus size={14} />
                        </motion.button>
                        <motion.span className="qty-val" key={item.qty}
                          initial={{ scale: 1.4, color: '#2d5a1b' }} animate={{ scale: 1, color: '#1a2e0f' }}
                          transition={{ duration: 0.2 }}>
                          {item.qty}
                        </motion.span>
                        <motion.button className="qty-btn" onClick={() => updateQty(item.id, +1)}
                          whileHover={{ background: '#2d5a1b', color: '#fff' }} whileTap={{ scale: 0.9 }}>
                          <Plus size={14} />
                        </motion.button>
                      </div>
                    </div>
                    <motion.button className="cart-remove" onClick={() => remove(item.id)}
                      whileHover={{ scale: 1.1, background: '#fff0f0' }} whileTap={{ scale: 0.9 }}>
                      <Trash2 size={15} /> Remove
                    </motion.button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <motion.div className="cart-summary"
              initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}>
              <h2>🧾 Order Summary</h2>
              <AnimatePresence>
                {cart.map(item => (
                  <motion.div className="summary-row" key={item.id}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <span>{item.name} <span style={{fontSize:'.75rem',color:'#aaa'}}>({item.lot})</span></span>
                    <span>×{item.qty} · ₹{(item.price * item.qty).toLocaleString('en-IN')}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div className="summary-total">
                <span>Total ({cartCount} bag{cartCount > 1 ? 's' : ''})</span>
                <motion.span key={cartCount}
                  initial={{ scale: 1.3, color: '#2d5a1b' }} animate={{ scale: 1, color: '#1a2e0f' }}
                  transition={{ duration: 0.3 }}>
                  ₹{cart.reduce((s, i) => s + i.price * i.qty, 0).toLocaleString('en-IN')}
                </motion.span>
              </div>
              <p className="summary-note">* Final price will be confirmed by our team after order placement.</p>
              <motion.button className="btn-checkout" onClick={() => nav('/checkout')}
                whileHover={{ scale: 1.03, boxShadow: '0 8px 28px rgba(45,90,27,.3)' }}
                whileTap={{ scale: 0.97 }}>
                Proceed to Checkout <ArrowRight size={16} />
              </motion.button>
              <motion.button className="btn-continue" onClick={() => nav('/products')}
                whileHover={{ scale: 1.02, background: '#e8f5e0' }} whileTap={{ scale: 0.97 }}>
                <ArrowLeft size={16} /> Continue Shopping
              </motion.button>
            </motion.div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
