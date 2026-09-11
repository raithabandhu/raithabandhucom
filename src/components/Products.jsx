import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, MessageCircle, ArrowRight, FlaskConical, TestTube, Beaker, Recycle, Atom, Layers, Package } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import Navbar from './Navbar';
import Footer from './Footer';
import './styles.css';

const ICON_MAP = {
  FlaskConical, TestTube, Beaker, Recycle, Atom, Layers, Package
};

function ProductIcon({ iconName, size = 64 }) {
  const Icon = ICON_MAP[iconName] || Package;
  return <Icon size={size} strokeWidth={1.5} />;
}

export default function Products({ cart, setCart }) {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    getDocs(collection(db, 'products'))
      .then(snap => setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() }))))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'All' ? products : products.filter(p => p.category === filter);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  function addToCart(product) {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
  }

  const bgColors = ['#e8f5e0,#c8e6a0', '#e0f0ff,#b8d8f0', '#fff8e0,#f0e0a0', '#fce8f0,#f0c8d8', '#e8f0ff,#c8d8f0', '#f0fce8,#d8f0c0'];

  return (
    <>
      <style>{`
        .prod-hero { position:relative; overflow:hidden; background:linear-gradient(135deg,#0d2e06,#1a4a0a,#2d7a1b); padding:72px 48px 56px; text-align:center; }
        .prod-hero-glow { position:absolute; width:500px; height:300px; background:radial-gradient(ellipse,rgba(168,224,99,.15),transparent 70%); top:50%; left:50%; transform:translate(-50%,-50%); pointer-events:none; }
        .prod-hero h1 { color:#fff; font-size:clamp(2rem,5vw,3.2rem); font-weight:900; margin-bottom:12px; position:relative; }
        .prod-hero p { color:rgba(255,255,255,.75); font-size:1rem; position:relative; }
        .prod-filters { display:flex; gap:10px; justify-content:center; margin-bottom:44px; flex-wrap:wrap; }
        .prod-filter-btn { padding:10px 28px; border-radius:50px; border:2px solid #2d5a1b; background:#fff; color:#2d5a1b; font-weight:700; font-size:.88rem; cursor:pointer; position:relative; overflow:hidden; }
        .prod-filter-active { background:#2d5a1b; color:#fff; }
        .prod-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(270px,1fr)); gap:28px; }
        .prod-card { background:#fff; border-radius:24px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,.07); border:1px solid #e8f5e0; display:flex; flex-direction:column; }
        .prod-card-img { height:160px; display:flex; align-items:center; justify-content:center; font-size:5rem; position:relative; overflow:hidden; }
        .prod-label { position:absolute; top:10px; right:10px; padding:3px 10px; border-radius:10px; font-size:.65rem; font-weight:800; letter-spacing:.5px; z-index:1; }
        .prod-card-shine { position:absolute; inset:0; background:linear-gradient(135deg,rgba(255,255,255,.3),transparent); }
        .prod-card-body { padding:22px; flex:1; display:flex; flex-direction:column; }
        .prod-card-cat { font-size:.7rem; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:#5cb85c; margin-bottom:6px; }
        .prod-card-lot { font-size:.7rem; color:#aaa; margin-bottom:4px; }
        .prod-card-body h3 { font-size:1.05rem; font-weight:800; color:#1a2e0f; margin-bottom:8px; }
        .prod-card-body p { font-size:.86rem; color:#5a7a4a; line-height:1.6; flex:1; }
        .prod-card-price { font-size:1.1rem; font-weight:900; color:#2d5a1b; margin-top:10px; }
        .prod-card-footer { display:flex; gap:10px; margin-top:18px; }
        .btn-cart { flex:1; background:linear-gradient(135deg,#2d5a1b,#3d7a25); color:#fff; border:none; padding:11px; border-radius:14px; font-size:.88rem; font-weight:700; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:6px; }
        .btn-enquire { flex:1; background:#f7faf3; color:#2d5a1b; border:2px solid #d0e8c0; padding:11px; border-radius:14px; font-size:.88rem; font-weight:700; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:6px; }
        .prod-cart-bar { position:fixed; bottom:28px; right:28px; background:linear-gradient(135deg,#1a4a0a,#2d7a1b); color:#fff; padding:16px 32px; border-radius:50px; font-weight:700; font-size:.95rem; cursor:pointer; box-shadow:0 8px 32px rgba(0,0,0,.3); z-index:200; display:flex; align-items:center; gap:12px; }
        @media(max-width:640px) { .prod-hero { padding:56px 20px 40px; } }
      `}</style>

      <Navbar cartCount={cartCount} />

      <div className="prod-hero">
        <div className="prod-hero-glow" />
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          🌿 Our Fertilisers
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
          Choose from our range of quality fertilisers for every crop and soil type.
        </motion.p>
      </div>

      <svg viewBox="0 0 1440 50" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"
        style={{ display: 'block', background: 'linear-gradient(135deg,#0d2e06,#2d7a1b)', marginBottom: -4 }}>
        <path d="M0,25 C360,50 1080,0 1440,25 L1440,50 L0,50 Z" fill="#f7faf3" />
      </svg>

      <div className="rb-page">
        {loading && <p style={{ textAlign: 'center', color: '#5a7a4a', padding: '40px' }}>Loading products…</p>}
        <motion.div className="prod-filters"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
          {['All', 'Chemical', 'Organic'].map(f => (
            <motion.button key={f}
              className={`prod-filter-btn${filter === f ? ' prod-filter-active' : ''}`}
              onClick={() => setFilter(f)}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              {f === 'All' ? '🌾 All' : f === 'Chemical' ? '⚗️ Chemical' : '🌱 Organic'}
            </motion.button>
          ))}
        </motion.div>

        <motion.div className="prod-grid" layout>
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) => (
              <motion.div className="prod-card" key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.85, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.85, y: -20 }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                whileHover={{ y: -8, boxShadow: '0 20px 48px rgba(45,90,27,.18)' }}>
                <motion.div className="prod-card-img"
                  style={{ background: `linear-gradient(135deg,${bgColors[i % bgColors.length]})` }}
                  whileHover={{ scale: 1.04 }} transition={{ duration: 0.3 }}>
                  {p.label && (
                    <span className="prod-label" style={{
                      background: p.label === 'new' ? '#2d5a1b' : p.label === 'hot' ? '#e53e3e' : '#d97706',
                      color: '#fff'
                    }}>
                      {p.label.toUpperCase()}
                    </span>
                  )}
                  <motion.span
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 3 + i * 0.3, repeat: Infinity }}>
                    <ProductIcon iconName={p.icon} size={64} />
                  </motion.span>
                  <div className="prod-card-shine" />
                </motion.div>
                <div className="prod-card-body">
                  <div className="prod-card-cat">{p.category}</div>
                  <div className="prod-card-lot">Lot: {p.lot}</div>
                  <h3>{p.name}</h3>
                  <p>{p.desc}</p>
                  <div className="prod-card-price">₹{p.price.toLocaleString('en-IN')} / bag</div>
                  <div className="prod-card-footer">
                    <motion.button className="btn-cart" onClick={() => addToCart(p)}
                      whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}>
                      <ShoppingCart size={14} /> Add to Cart
                    </motion.button>
                    <motion.button className="btn-enquire"
                      whileHover={{ scale: 1.04, background: '#e8f5e0' }} whileTap={{ scale: 0.95 }}>
                      <MessageCircle size={14} /> Enquire
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {cartCount > 0 && (
          <motion.div className="prod-cart-bar" onClick={() => nav('/cart')}
            initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }} transition={{ type: 'spring', stiffness: 300 }}
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <ShoppingCart size={18} />
            View Cart · {cartCount} item{cartCount > 1 ? 's' : ''}
            <ArrowRight size={16} />
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}
