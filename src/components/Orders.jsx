import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { Package, ShoppingBag, ChevronDown, ChevronUp } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import './styles.css';

const STATUS_COLOR = {
  pending: { bg: '#fff8e1', color: '#b7791f', label: '⏳ Pending' },
  confirmed: { bg: '#e8f5e0', color: '#2d5a1b', label: '✅ Confirmed' },
  delivered: { bg: '#e0f0ff', color: '#1a56a0', label: '📦 Delivered' },
  cancelled: { bg: '#fff0f0', color: '#e53e3e', label: '❌ Cancelled' },
};

export default function Orders() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    if (!user) { nav('/login'); return; }
    getDocs(query(collection(db, 'orders'), where('uid', '==', user.uid)))
      .then(snap => {
        const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        docs.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        setOrders(docs);
      })
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <>
      <style>{`
        .ord-hero { background:linear-gradient(135deg,#0d2e06,#1a4a0a,#2d7a1b); padding:60px 48px 48px; text-align:center; }
        .ord-hero h1 { color:#fff; font-size:clamp(1.8rem,4vw,2.8rem); font-weight:900; margin:0; }
        .ord-card { background:#fff; border-radius:20px; border:1px solid #e8f5e0; box-shadow:0 4px 16px rgba(0,0,0,.06); overflow:hidden; margin-bottom:16px; }
        .ord-header { display:flex; align-items:center; justify-content:space-between; padding:20px 24px; cursor:pointer; gap:12px; flex-wrap:wrap; }
        .ord-meta { display:flex; flex-direction:column; gap:4px; }
        .ord-id { font-size:.72rem; color:#aaa; font-family:monospace; }
        .ord-date { font-size:.82rem; color:#5a7a4a; }
        .ord-total { font-size:1rem; font-weight:800; color:#1a2e0f; }
        .ord-badge { padding:5px 14px; border-radius:50px; font-size:.78rem; font-weight:700; }
        .ord-body { padding:0 24px 20px; border-top:1px solid #f0fae8; }
        .ord-item { display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid #f7faf3; font-size:.88rem; color:#3a5a2a; }
        .ord-item:last-child { border-bottom:none; }
        .ord-delivery { margin-top:14px; background:#f7faf3; border-radius:12px; padding:14px 16px; font-size:.85rem; color:#5a7a4a; line-height:1.8; }
        .ord-empty { text-align:center; padding:80px 24px; }
        @media(max-width:600px) { .ord-hero { padding:48px 20px 36px; } .ord-header { padding:16px; } }
      `}</style>

      <Navbar cartCount={0} />

      <div className="ord-hero">
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          📦 Your Orders
        </motion.h1>
      </div>

      <svg viewBox="0 0 1440 50" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"
        style={{ display: 'block', background: 'linear-gradient(135deg,#0d2e06,#2d7a1b)', marginBottom: -4 }}>
        <path d="M0,25 C360,50 1080,0 1440,25 L1440,50 L0,50 Z" fill="#f7faf3" />
      </svg>

      <div className="rb-page" style={{ maxWidth: 760, margin: '0 auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#5a7a4a', fontSize: '1.1rem' }}>Loading orders…</div>
        ) : orders.length === 0 ? (
          <motion.div className="ord-empty" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <div style={{ fontSize: '5rem', marginBottom: 16 }}>📭</div>
            <h2 style={{ fontWeight: 800, color: '#1a2e0f', marginBottom: 10 }}>No orders yet</h2>
            <p style={{ color: '#5a7a4a', marginBottom: 28 }}>Place your first order to see it here.</p>
            <motion.button onClick={() => nav('/products')}
              style={{ background: 'linear-gradient(135deg,#2d5a1b,#3d7a25)', color: '#fff', border: 'none', padding: '13px 36px', borderRadius: 50, fontSize: '1rem', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <ShoppingBag size={16} /> Browse Products
            </motion.button>
          </motion.div>
        ) : (
          <AnimatePresence>
            {orders.map((order, i) => {
              const status = STATUS_COLOR[order.status] || STATUS_COLOR.pending;
              const date = order.createdAt?.toDate?.()?.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) || '—';
              const isOpen = expanded === order.id;
              return (
                <motion.div className="ord-card" key={order.id}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}>
                  <div className="ord-header" onClick={() => setExpanded(isOpen ? null : order.id)}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <Package size={28} color="#2d5a1b" strokeWidth={1.5} />
                      <div className="ord-meta">
                        <span className="ord-id">#{order.id.slice(0, 10).toUpperCase()}</span>
                        <span className="ord-date">{date}</span>
                        <span className="ord-total">₹{order.total?.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span className="ord-badge" style={{ background: status.bg, color: status.color }}>{status.label}</span>
                      {isOpen ? <ChevronUp size={18} color="#5a7a4a" /> : <ChevronDown size={18} color="#5a7a4a" />}
                    </div>
                  </div>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div className="ord-body"
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }}>
                        {order.items?.map(item => (
                          <div className="ord-item" key={item.id}>
                            <span>{item.name} <span style={{ fontSize: '.72rem', color: '#aaa' }}>({item.lot})</span></span>
                            <span>×{item.qty} · ₹{(item.price * item.qty).toLocaleString('en-IN')}</span>
                          </div>
                        ))}
                        {order.delivery && (
                          <div className="ord-delivery">
                            <strong>📍 Delivery:</strong> {order.delivery.name}, {order.delivery.village}{order.delivery.mandal ? `, ${order.delivery.mandal}` : ''}, {order.delivery.district} – {order.delivery.pincode}<br />
                            <strong>📞</strong> {order.delivery.phone}
                            {order.delivery.notes && <><br /><strong>📝</strong> {order.delivery.notes}</>}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>

      <Footer />
    </>
  );
}
