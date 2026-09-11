import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Truck, BadgeCheck, Sprout, HeartHandshake, ArrowRight, ChevronDown } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import products from '../data/products';
import './styles.css';

const features = [
  { icon: Truck, title: 'Farm-Direct Quality', desc: 'Sourced straight from certified manufacturers with quality assurance.', color: '#e8f5e0' },
  { icon: Truck, title: 'Fast Delivery', desc: 'Doorstep delivery across Telangana & Andhra Pradesh.', color: '#e0f0ff' },
  { icon: BadgeCheck, title: 'Best Prices', desc: 'Competitive rates with special bulk-order discounts for farmers.', color: '#fff8e0' },
  { icon: HeartHandshake, title: 'Expert Guidance', desc: 'Free crop advisory and soil consultation with every order.', color: '#fce8f0' },
];

const featureIcons = ['🚜', '🚚', '💰', '🧑‍🌾'];

const floatingSeeds = ['🌾', '🌿', '🍃', '🌱', '🌻', '🍀', '🌾', '🌿'];

function FadeUp({ children, delay = 0, className }) {
  return (
    <motion.div className={className}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}>
      {children}
    </motion.div>
  );
}

export default function Home({ cart, setCart }) {
  const nav = useNavigate();
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  function addToCart(product) {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
  }

  return (
    <>
      <style>{`
        /* HERO */
        .rb-hero { position:relative; min-height:100vh; display:flex; align-items:center; justify-content:center; text-align:center; overflow:hidden;
          background:linear-gradient(135deg,#0d2e06 0%,#1a4a0a 30%,#2d7a1b 65%,#4a9e2a 100%); }
        .rb-hero-bg { position:absolute; inset:0; background:url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1400&q=80') center/cover no-repeat; opacity:.12; }
        .rb-hero-overlay { position:absolute; inset:0; background:radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,.4) 100%); }
        .rb-hero-content { position:relative; z-index:2; max-width:820px; padding:40px 24px; }
        .rb-hero-tag { display:inline-flex; align-items:center; gap:8px; background:rgba(168,224,99,.15); color:#a8e063; border:1px solid rgba(168,224,99,.4); border-radius:32px; padding:8px 20px; font-size:.82rem; font-weight:700; letter-spacing:1px; text-transform:uppercase; margin-bottom:28px; }
        .rb-hero h1 { font-size:clamp(2.6rem,6vw,4.8rem); font-weight:900; color:#fff; line-height:1.08; margin-bottom:24px; text-shadow:0 4px 24px rgba(0,0,0,.4); letter-spacing:-1px; }
        .rb-hero h1 .accent { color:#a8e063; display:inline-block; }
        .rb-hero p { font-size:1.15rem; color:rgba(255,255,255,.8); margin-bottom:44px; line-height:1.8; max-width:560px; margin-left:auto; margin-right:auto; }
        .rb-btn-group { display:flex; gap:16px; justify-content:center; flex-wrap:wrap; }
        .rb-btn-primary { background:linear-gradient(135deg,#a8e063,#5cb85c); color:#0d2e06; padding:16px 40px; border-radius:50px; font-weight:800; font-size:1rem; cursor:pointer; border:none; box-shadow:0 8px 32px rgba(92,184,92,.4); display:flex; align-items:center; gap:8px; }
        .rb-btn-secondary { background:rgba(255,255,255,.1); backdrop-filter:blur(10px); color:#fff; padding:16px 40px; border-radius:50px; font-weight:700; font-size:1rem; cursor:pointer; border:1px solid rgba(255,255,255,.3); display:flex; align-items:center; gap:8px; }
        .rb-scroll-hint { position:absolute; bottom:32px; left:50%; transform:translateX(-50%); color:rgba(255,255,255,.5); display:flex; flex-direction:column; align-items:center; gap:6px; font-size:.75rem; letter-spacing:1px; z-index:2; }
        .rb-floating-seed { position:absolute; font-size:1.5rem; pointer-events:none; z-index:1; opacity:.25; }
        /* WAVE */
        .rb-wave { display:block; width:100%; margin-bottom:-4px; }
        /* FEATURES */
        .rb-features { background:#fff; padding:80px 48px; }
        .rb-features-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(230px,1fr)); gap:24px; max-width:1060px; margin:0 auto; }
        .rb-feature-card { border-radius:20px; padding:36px 28px; text-align:center; border:1px solid #e8f5e0; position:relative; overflow:hidden; cursor:default; }
        .rb-feature-card::before { content:''; position:absolute; inset:0; background:inherit; opacity:0; transition:opacity .3s; }
        .rb-feature-icon { font-size:2.8rem; margin-bottom:16px; display:block; }
        .rb-feature-card h3 { font-size:1.05rem; font-weight:800; color:#1a2e0f; margin-bottom:10px; }
        .rb-feature-card p { font-size:.88rem; color:#5a7a4a; line-height:1.65; }
        /* PRODUCTS PREVIEW */
        .rb-products { background:linear-gradient(180deg,#f7faf3,#edf5e4); padding:80px 48px; }
        .rb-products-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(250px,1fr)); gap:28px; max-width:1100px; margin:0 auto 44px; }
        .rb-product-card { background:#fff; border-radius:24px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,.06); border:1px solid #e8f5e0; display:flex; flex-direction:column; cursor:pointer; }
        .rb-product-img { height:160px; display:flex; align-items:center; justify-content:center; font-size:5rem; position:relative; overflow:hidden; }
        .rb-product-img-shine { position:absolute; inset:0; background:linear-gradient(135deg,rgba(255,255,255,.3),transparent); }
        .rb-product-body { padding:22px; flex:1; display:flex; flex-direction:column; }
        .rb-product-cat { font-size:.7rem; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:#5cb85c; margin-bottom:6px; }
        .rb-product-body h3 { font-size:1.05rem; font-weight:800; color:#1a2e0f; margin-bottom:8px; }
        .rb-product-body p { font-size:.86rem; color:#5a7a4a; line-height:1.6; flex:1; }
        .rb-product-footer { display:flex; gap:10px; margin-top:18px; }
        .rb-add-btn { flex:1; background:linear-gradient(135deg,#2d5a1b,#3d7a25); color:#fff; border:none; padding:11px; border-radius:14px; font-size:.88rem; font-weight:700; cursor:pointer; }
        .rb-view-all-wrap { text-align:center; }
        .rb-view-all { background:#fff; color:#2d5a1b; border:2px solid #2d5a1b; padding:14px 44px; border-radius:50px; font-size:.95rem; font-weight:700; cursor:pointer; display:inline-flex; align-items:center; gap:8px; }
        /* BANNER */
        .rb-banner { position:relative; overflow:hidden; background:linear-gradient(135deg,#0d2e06,#1a4a0a,#2d7a1b); padding:80px 48px; text-align:center; }
        .rb-banner-glow { position:absolute; width:400px; height:400px; border-radius:50%; background:radial-gradient(circle,rgba(168,224,99,.2),transparent 70%); top:50%; left:50%; transform:translate(-50%,-50%); pointer-events:none; }
        .rb-banner h2 { font-size:clamp(1.8rem,4vw,2.8rem); font-weight:900; color:#fff; margin-bottom:14px; position:relative; }
        .rb-banner p { color:rgba(255,255,255,.75); font-size:1.05rem; margin-bottom:36px; position:relative; }
        .rb-banner-btn { background:linear-gradient(135deg,#a8e063,#5cb85c); color:#0d2e06; padding:16px 48px; border-radius:50px; font-weight:800; font-size:1rem; cursor:pointer; border:none; box-shadow:0 8px 32px rgba(92,184,92,.35); display:inline-flex; align-items:center; gap:8px; position:relative; }
        /* PROCESS */
        .rb-process { background:#fff; padding:80px 48px; }
        .rb-process-steps { display:flex; gap:0; max-width:900px; margin:0 auto; position:relative; flex-wrap:wrap; justify-content:center; }
        .rb-process-steps::before { content:''; position:absolute; top:36px; left:10%; right:10%; height:2px; background:linear-gradient(90deg,#a8e063,#2d5a1b); z-index:0; }
        .rb-step { flex:1; min-width:160px; text-align:center; position:relative; z-index:1; padding:0 12px; }
        .rb-step-num { width:72px; height:72px; border-radius:50%; background:linear-gradient(135deg,#a8e063,#5cb85c); color:#0d2e06; font-size:1.5rem; font-weight:900; display:flex; align-items:center; justify-content:center; margin:0 auto 16px; box-shadow:0 4px 20px rgba(92,184,92,.35); }
        .rb-step h4 { font-size:.95rem; font-weight:800; color:#1a2e0f; margin-bottom:6px; }
        .rb-step p { font-size:.82rem; color:#5a7a4a; line-height:1.5; }
        @media(max-width:640px) {
          .rb-features, .rb-products, .rb-banner, .rb-process { padding:56px 20px; }
          .rb-process-steps::before { display:none; }
        }
      `}</style>

      <Navbar cartCount={cartCount} />

      {/* HERO */}
      <section className="rb-hero">
        <div className="rb-hero-bg" />
        <div className="rb-hero-overlay" />

        {floatingSeeds.map((seed, i) => (
          <motion.div key={i} className="rb-floating-seed"
            style={{ left: `${10 + i * 11}%`, top: `${15 + (i % 3) * 25}%` }}
            animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}>
            {seed}
          </motion.div>
        ))}

        <div className="rb-hero-content">
          <motion.div className="rb-hero-tag"
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}>
            <Sprout size={14} /> Premium Fertilisers for Indian Farmers
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}>
            Grow More.<br />
            <motion.span className="accent"
              initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}>
              Spend Less.
            </motion.span><br />
            Harvest Better.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}>
            Premium quality fertilisers delivered straight to your farm.<br />
            Boost your yield with science-backed nutrition for every crop.
          </motion.p>

          <motion.div className="rb-btn-group"
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}>
            <motion.button className="rb-btn-primary" onClick={() => nav('/products')}
              whileHover={{ scale: 1.05, boxShadow: '0 12px 40px rgba(92,184,92,.5)' }}
              whileTap={{ scale: 0.97 }}>
              🛒 Shop Fertilisers <ArrowRight size={16} />
            </motion.button>
            <motion.button className="rb-btn-secondary"
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              whileHover={{ scale: 1.05, background: 'rgba(255,255,255,.2)' }}
              whileTap={{ scale: 0.97 }}>
              Learn More <ChevronDown size={16} />
            </motion.button>
          </motion.div>
        </div>

        <motion.div className="rb-scroll-hint"
          animate={{ y: [0, 8, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>
          <span>SCROLL</span>
          <ChevronDown size={16} />
        </motion.div>
      </section>

      {/* WAVE */}
      <svg className="rb-wave" viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"
        style={{ background: 'linear-gradient(135deg,#0d2e06,#2d7a1b)', display: 'block' }}>
        <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z" fill="#fff" />
      </svg>

      {/* FEATURES */}
      <section className="rb-features" id="features">
        <FadeUp><div className="rb-section-label">Why Raithabandhu</div></FadeUp>
        <FadeUp delay={0.1}><div className="rb-section-title">Everything Your Farm Needs</div></FadeUp>
        <div className="rb-features-grid">
          {features.map((f, i) => (
            <motion.div className="rb-feature-card" key={f.title}
              style={{ background: f.color }}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              whileHover={{ y: -8, boxShadow: '0 16px 40px rgba(45,90,27,.15)', scale: 1.02 }}>
              <motion.span className="rb-feature-icon"
                whileHover={{ rotate: [0, -10, 10, 0], scale: 1.2 }}
                transition={{ duration: 0.4 }}>
                {featureIcons[i]}
              </motion.span>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="rb-process">
        <FadeUp><div className="rb-section-label">How It Works</div></FadeUp>
        <FadeUp delay={0.1}><div className="rb-section-title">Order in 3 Simple Steps</div></FadeUp>
        <div className="rb-process-steps">
          {[
            { num: '1', emoji: '🔍', title: 'Browse Products', desc: 'Explore our range of fertilisers and pick what suits your crop.' },
            { num: '2', emoji: '🛒', title: 'Add to Cart', desc: 'Select quantities and add items to your cart easily.' },
            { num: '3', emoji: '🚚', title: 'Get Delivered', desc: 'Place your order and we deliver right to your farm.' },
          ].map((step, i) => (
            <motion.div className="rb-step" key={step.num}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.2 }}>
              <motion.div className="rb-step-num"
                whileHover={{ scale: 1.15, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 300 }}>
                {step.emoji}
              </motion.div>
              <h4>{step.title}</h4>
              <p>{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PRODUCTS PREVIEW */}
      <section className="rb-products" id="products">
        <FadeUp><div className="rb-section-label">Our Products</div></FadeUp>
        <FadeUp delay={0.1}><div className="rb-section-title">Featured Fertilisers</div></FadeUp>
        <div className="rb-products-grid">
          {products.slice(0, 4).map((p, i) => (
            <motion.div className="rb-product-card" key={p.id}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -10, boxShadow: '0 20px 48px rgba(45,90,27,.18)' }}>
              <motion.div className="rb-product-img"
                style={{ background: `linear-gradient(135deg, ${['#e8f5e0,#c8e6a0', '#e0f0ff,#b8d8f0', '#fff8e0,#f0e0a0', '#fce8f0,#f0c8d8'][i]})` }}
                whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                <motion.span animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}>
                  {p.emoji}
                </motion.span>
                <div className="rb-product-img-shine" />
              </motion.div>
              <div className="rb-product-body">
                <div className="rb-product-cat">{p.category}</div>
                <h3>{p.name}</h3>
                <p>{p.desc}</p>
                <div className="rb-product-footer">
                  <motion.button className="rb-add-btn" onClick={() => addToCart(p)}
                    whileHover={{ scale: 1.04, background: 'linear-gradient(135deg,#3d7a25,#5cb85c)' }}
                    whileTap={{ scale: 0.96 }}>
                    + Add to Cart
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <FadeUp delay={0.2}>
          <div className="rb-view-all-wrap">
            <motion.button className="rb-view-all" onClick={() => nav('/products')}
              whileHover={{ scale: 1.05, background: '#2d5a1b', color: '#fff' }}
              whileTap={{ scale: 0.97 }}>
              View All Products <ArrowRight size={16} />
            </motion.button>
          </div>
        </FadeUp>
      </section>

      {/* BANNER */}
      <section className="rb-banner">
        <motion.div className="rb-banner-glow"
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 4, repeat: Infinity }} />
        <FadeUp>
          <motion.h2
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}>
            🌿 Order in Bulk & Save More
          </motion.h2>
        </FadeUp>
        <FadeUp delay={0.15}>
          <p>Special rates for farmers ordering 10+ bags. Call us or order online.</p>
        </FadeUp>
        <FadeUp delay={0.3}>
          <motion.button className="rb-banner-btn" onClick={() => nav('/products')}
            whileHover={{ scale: 1.06, boxShadow: '0 12px 40px rgba(168,224,99,.5)' }}
            whileTap={{ scale: 0.97 }}>
            Get Bulk Quote <ArrowRight size={16} />
          </motion.button>
        </FadeUp>
      </section>

      <Footer />
    </>
  );
}
