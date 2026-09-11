import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, Plus, Edit2, Trash2, Save, X, ShoppingBag,
  TrendingUp, BarChart2, CheckCircle, Clock, XCircle, FlaskConical,
  TestTube, Beaker, Recycle, Atom, Layers
} from 'lucide-react';
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc, orderBy, query
} from 'firebase/firestore';
import { db } from '../firebase';
import Navbar from './Navbar';
import Footer from './Footer';

const ICON_MAP = { FlaskConical, TestTube, Beaker, Recycle, Atom, Layers, Package };
function ProductIcon({ iconName, size = 20 }) {
  const Icon = ICON_MAP[iconName] || Package;
  return <Icon size={size} strokeWidth={1.5} />;
}

const LABEL_STYLES = {
  new:  { bg: '#2d5a1b', text: '#fff', label: 'NEW' },
  hot:  { bg: '#e53e3e', text: '#fff', label: 'HOT' },
  sale: { bg: '#d97706', text: '#fff', label: 'SALE' },
};

const STATUS_STYLES = {
  pending:   { bg: '#fff8e0', color: '#b45309', icon: <Clock size={13} /> },
  confirmed: { bg: '#e0f0ff', color: '#1d4ed8', icon: <CheckCircle size={13} /> },
  delivered: { bg: '#e8f5e0', color: '#2d5a1b', icon: <CheckCircle size={13} /> },
  cancelled: { bg: '#fee2e2', color: '#b91c1c', icon: <XCircle size={13} /> },
};

const EMPTY_PRODUCT = { name: '', desc: '', category: 'Chemical', icon: 'Package', price: '', lot: '', label: '' };

export default function AdminDashboard() {
  const [tab, setTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_PRODUCT);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => { loadProducts(); loadOrders(); }, []);

  async function loadProducts() {
    const snap = await getDocs(collection(db, 'products'));
    setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  }

  async function loadOrders() {
    try {
      const snap = await getDocs(query(collection(db, 'orders'), orderBy('createdAt', 'desc')));
      setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch {
      const snap = await getDocs(collection(db, 'orders'));
      setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }
  }

  function nextLot() {
    const nums = products.map(p => parseInt(p.lot, 10)).filter(n => !isNaN(n));
    const next = nums.length > 0 ? Math.max(...nums) + 1 : 1001001;
    return String(next).padStart(7, '0');
  }

  function openAdd() { setForm({ ...EMPTY_PRODUCT, lot: nextLot() }); setEditingProduct(null); setShowForm(true); }
  function openEdit(p) { setForm({ name: p.name, desc: p.desc, category: p.category, icon: p.icon, price: p.price, lot: p.lot, label: p.label || '' }); setEditingProduct(p.id); setShowForm(true); }

  async function saveProduct() {
    if (!form.name || !form.price || !form.lot) { setMsg('Name, price and lot are required.'); return; }
    setSaving(true);
    const data = { ...form, price: Number(form.price) };
    if (editingProduct) await updateDoc(doc(db, 'products', editingProduct), data);
    else await addDoc(collection(db, 'products'), data);
    await loadProducts();
    setShowForm(false);
    setMsg(editingProduct ? 'Product updated!' : 'Product added!');
    setSaving(false);
    setTimeout(() => setMsg(''), 3000);
  }

  async function deleteProduct(id) {
    if (!confirm('Delete this product?')) return;
    await deleteDoc(doc(db, 'products', id));
    setProducts(p => p.filter(x => x.id !== id));
    setMsg('Product deleted.');
    setTimeout(() => setMsg(''), 3000);
  }

  async function updateOrderStatus(id, status) {
    await updateDoc(doc(db, 'orders', id), { status });
    setOrders(o => o.map(x => x.id === id ? { ...x, status } : x));
  }

  const totalRevenue = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + (o.total || 0), 0);
  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const deliveredCount = orders.filter(o => o.status === 'delivered').length;

  const topProducts = products.map(p => ({
    ...p,
    sold: orders.filter(o => o.status !== 'cancelled')
      .flatMap(o => o.items || [])
      .filter(i => i.id === p.id)
      .reduce((s, i) => s + (i.qty || 0), 0)
  })).sort((a, b) => b.sold - a.sold).slice(0, 5);

  return (
    <>
      <style>{`
        .adm-wrap { min-height:100vh; background:#f7faf3; display:flex; flex-direction:column; }
        .adm-wrap > .adm-body { flex:1; }
        .adm-hero { background:linear-gradient(135deg,#0d2e06,#2d7a1b); padding:48px 48px 32px; }
        .adm-hero h1 { color:#fff; font-size:1.8rem; font-weight:900; margin:0 0 4px; }
        .adm-hero p { color:rgba(255,255,255,.7); margin:0; font-size:.9rem; }
        .adm-tabs { display:flex; gap:4px; background:#fff; border-bottom:2px solid #e8f5e0; padding:0 32px; position:sticky; top:64px; z-index:10; }
        .adm-tab { padding:14px 24px; font-weight:700; font-size:.88rem; cursor:pointer; border:none; background:none; color:#5a7a4a; border-bottom:3px solid transparent; margin-bottom:-2px; display:flex; align-items:center; gap:6px; }
        .adm-tab-active { color:#2d5a1b; border-bottom-color:#2d5a1b; }
        .adm-body { padding:32px; max-width:1200px; margin:0 auto; }
        .adm-cols { display:grid; grid-template-columns:1fr 1fr; gap:24px; align-items:start; }
        .adm-cols-3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:24px; align-items:start; }
        .adm-card { background:#fff; border-radius:20px; padding:28px; box-shadow:0 2px 16px rgba(0,0,0,.06); border:1px solid #e8f5e0; margin-bottom:24px; }
        .adm-card-full { grid-column:1/-1; }
        .adm-card h2 { font-size:1rem; font-weight:800; color:#1a2e0f; margin:0 0 20px; display:flex; align-items:center; gap:8px; }
        .adm-stats { display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:16px; margin-bottom:28px; }
        .adm-stat { background:#fff; border-radius:16px; padding:20px 24px; box-shadow:0 2px 12px rgba(0,0,0,.06); border:1px solid #e8f5e0; }
        .adm-stat-label { font-size:.75rem; font-weight:700; color:#8ab87a; text-transform:uppercase; letter-spacing:.5px; margin-bottom:6px; }
        .adm-stat-val { font-size:1.6rem; font-weight:900; color:#1a2e0f; }
        .adm-table { width:100%; border-collapse:collapse; font-size:.88rem; }
        .adm-table th { text-align:left; padding:10px 14px; font-size:.72rem; font-weight:800; color:#8ab87a; text-transform:uppercase; letter-spacing:.5px; border-bottom:2px solid #f0fae8; }
        .adm-table td { padding:12px 14px; border-bottom:1px solid #f5faf0; color:#1a2e0f; vertical-align:middle; }
        .adm-table tr:last-child td { border-bottom:none; }
        .adm-badge { display:inline-flex; align-items:center; gap:4px; padding:3px 10px; border-radius:20px; font-size:.72rem; font-weight:700; }
        .adm-label-badge { display:inline-block; padding:2px 8px; border-radius:10px; font-size:.65rem; font-weight:800; letter-spacing:.5px; }
        .btn-add { background:linear-gradient(135deg,#2d5a1b,#3d7a25); color:#fff; border:none; padding:10px 22px; border-radius:12px; font-size:.88rem; font-weight:700; cursor:pointer; display:flex; align-items:center; gap:6px; }
        .btn-icon { background:none; border:none; cursor:pointer; padding:6px; border-radius:8px; display:inline-flex; align-items:center; }
        .btn-icon:hover { background:#f0fae8; }
        .btn-icon-del:hover { background:#fee2e2; }
        .adm-form-overlay { position:fixed; inset:0; background:rgba(0,0,0,.4); z-index:100; display:flex; align-items:center; justify-content:center; padding:20px; }
        .adm-form { background:#fff; border-radius:24px; padding:32px; width:100%; max-width:480px; max-height:90vh; overflow-y:auto; }
        .adm-form h3 { font-size:1.1rem; font-weight:800; color:#1a2e0f; margin:0 0 24px; }
        .adm-field { margin-bottom:16px; }
        .adm-field label { display:block; font-size:.75rem; font-weight:800; color:#2d5a1b; margin-bottom:6px; text-transform:uppercase; letter-spacing:.5px; }
        .adm-field input, .adm-field select, .adm-field textarea { width:100%; padding:10px 14px; border:2px solid #c8e6b0; border-radius:10px; font-size:.9rem; color:#1a2e0f; outline:none; font-family:inherit; box-sizing:border-box; background:#f0fae8; }
        .adm-field input:focus, .adm-field select:focus, .adm-field textarea:focus { border-color:#2d5a1b; background:#e8f5e0; }
        .adm-form-row { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
        .adm-form-btns { display:flex; gap:10px; margin-top:24px; }
        .btn-save { flex:1; background:linear-gradient(135deg,#2d5a1b,#3d7a25); color:#fff; border:none; padding:12px; border-radius:12px; font-weight:700; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:6px; }
        .btn-cancel { flex:1; background:#f7faf3; color:#2d5a1b; border:2px solid #d0e8c0; padding:12px; border-radius:12px; font-weight:700; cursor:pointer; }
        .adm-msg { position:fixed; bottom:28px; left:50%; transform:translateX(-50%); background:#2d5a1b; color:#fff; padding:12px 28px; border-radius:50px; font-weight:700; font-size:.88rem; z-index:200; }
        .adm-status-sel { padding:5px 10px; border-radius:8px; border:1px solid #d0e8c0; font-size:.8rem; font-weight:700; cursor:pointer; background:#f7faf3; color:#1a2e0f; }
        .adm-order-items { font-size:.78rem; color:#5a7a4a; }
        @media(max-width:900px) { .adm-cols, .adm-cols-3 { grid-template-columns:1fr; } }
        @media(max-width:640px) { .adm-body { padding:16px; } .adm-tabs { padding:0 8px; overflow-x:auto; } .adm-tab { padding:12px 14px; font-size:.8rem; white-space:nowrap; } .adm-form-row { grid-template-columns:1fr; } }
      `}</style>

      <div className="adm-wrap">
        <Navbar cartCount={0} />

        <div className="adm-hero">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>⚙️ Admin Dashboard</motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>Manage products, orders, and view business insights</motion.p>
        </div>

        <div className="adm-tabs">
          {[
            { id: 'products', label: 'Products', icon: <Package size={15} /> },
            { id: 'orders',   label: 'Orders',   icon: <ShoppingBag size={15} /> },
            { id: 'income',   label: 'Income',   icon: <TrendingUp size={15} /> },
            { id: 'stats',    label: 'Statistics', icon: <BarChart2 size={15} /> },
          ].map(t => (
            <button key={t.id} className={`adm-tab${tab === t.id ? ' adm-tab-active' : ''}`} onClick={() => setTab(t.id)}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        <div className="adm-body">
          <AnimatePresence mode="wait">
            {tab === 'products' && (
              <motion.div key="products" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="adm-cols">
                  {/* Left: product list */}
                  <div className="adm-card" style={{ marginBottom: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                      <h2 style={{ margin: 0 }}><Package size={16} /> Products ({products.length})</h2>
                      <button className="btn-add" onClick={openAdd}><Plus size={15} /> Add</button>
                    </div>
                    <table className="adm-table">
                      <thead><tr><th>Product</th><th>Price</th><th>Label</th><th></th></tr></thead>
                      <tbody>
                        {products.map(p => (
                          <tr key={p.id}>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ color: '#2d5a1b' }}><ProductIcon iconName={p.icon} size={16} /></span>
                                <div>
                                  <div style={{ fontWeight: 700, fontSize: '.88rem' }}>{p.name}</div>
                                  <div style={{ fontSize: '.72rem', color: '#8ab87a' }}>{p.lot} · {p.category}</div>
                                </div>
                              </div>
                            </td>
                            <td style={{ fontWeight: 700, fontSize: '.88rem' }}>₹{Number(p.price).toLocaleString('en-IN')}</td>
                            <td>
                              {p.label && LABEL_STYLES[p.label] && (
                                <span className="adm-label-badge" style={{ background: LABEL_STYLES[p.label].bg, color: LABEL_STYLES[p.label].text }}>
                                  {LABEL_STYLES[p.label].label}
                                </span>
                              )}
                            </td>
                            <td style={{ whiteSpace: 'nowrap' }}>
                              <button className="btn-icon" onClick={() => openEdit(p)}><Edit2 size={14} color="#2d5a1b" /></button>
                              <button className="btn-icon btn-icon-del" onClick={() => deleteProduct(p.id)}><Trash2 size={14} color="#e53e3e" /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {/* Right: quick stats */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {[
                      { label: 'Total Products', value: products.length, color: '#2d5a1b' },
                      { label: 'Chemical', value: products.filter(p => p.category === 'Chemical').length, color: '#1d4ed8' },
                      { label: 'Organic', value: products.filter(p => p.category === 'Organic').length, color: '#059669' },
                      { label: 'With Labels', value: products.filter(p => p.label).length, color: '#d97706' },
                    ].map(s => (
                      <motion.div className="adm-stat" key={s.label} whileHover={{ y: -3 }} style={{ marginBottom: 0 }}>
                        <div className="adm-stat-label">{s.label}</div>
                        <div className="adm-stat-val" style={{ color: s.color }}>{s.value}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {tab === 'orders' && (
              <motion.div key="orders" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="adm-cols">
                  {/* Left: order list */}
                  <div className="adm-card" style={{ marginBottom: 0 }}>
                    <h2><ShoppingBag size={16} /> Orders ({orders.length})</h2>
                    {orders.length === 0 && <p style={{ color: '#8ab87a', textAlign: 'center', padding: '24px 0' }}>No orders yet.</p>}
                    <table className="adm-table">
                      <thead><tr><th>Customer</th><th>Total</th><th>Date</th><th>Status</th></tr></thead>
                      <tbody>
                        {orders.map(o => {
                          const st = STATUS_STYLES[o.status] || STATUS_STYLES.pending;
                          return (
                            <tr key={o.id}>
                              <td>
                                <div style={{ fontWeight: 700, fontSize: '.88rem' }}>{o.delivery?.name || '—'}</div>
                                <div style={{ fontSize: '.72rem', color: '#8ab87a' }}>{o.delivery?.phone}</div>
                                <div style={{ fontSize: '.72rem', color: '#aaa' }}>{(o.items || []).map(i => `${i.name} ×${i.qty}`).join(', ')}</div>
                              </td>
                              <td style={{ fontWeight: 700, fontSize: '.88rem' }}>₹{(o.total || 0).toLocaleString('en-IN')}</td>
                              <td style={{ fontSize: '.75rem', color: '#8ab87a' }}>
                                {o.createdAt?.toDate ? o.createdAt.toDate().toLocaleDateString('en-IN') : '—'}
                              </td>
                              <td>
                                <select className="adm-status-sel"
                                  style={{ background: st.bg, color: st.color }}
                                  value={o.status || 'pending'}
                                  onChange={e => updateOrderStatus(o.id, e.target.value)}>
                                  <option value="pending">⏳ Pending</option>
                                  <option value="confirmed">✅ Confirmed</option>
                                  <option value="delivered">📦 Delivered</option>
                                  <option value="cancelled">❌ Cancelled</option>
                                </select>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  {/* Right: order stats */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {[
                      { label: 'Total Orders', value: orders.length, color: '#1a2e0f' },
                      { label: 'Pending', value: pendingCount, color: '#b45309' },
                      { label: 'Delivered', value: deliveredCount, color: '#059669' },
                      { label: 'Cancelled', value: orders.filter(o => o.status === 'cancelled').length, color: '#b91c1c' },
                    ].map(s => (
                      <motion.div className="adm-stat" key={s.label} whileHover={{ y: -3 }} style={{ marginBottom: 0 }}>
                        <div className="adm-stat-label">{s.label}</div>
                        <div className="adm-stat-val" style={{ color: s.color }}>{s.value}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {tab === 'income' && (
              <motion.div key="income" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="adm-cols">
                  {/* Left: stat cards */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {[
                      { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, color: '#2d5a1b' },
                      { label: 'Total Orders', value: orders.length, color: '#1d4ed8' },
                      { label: 'Delivered', value: deliveredCount, color: '#059669' },
                      { label: 'Pending', value: pendingCount, color: '#b45309' },
                    ].map(s => (
                      <motion.div className="adm-stat" key={s.label} whileHover={{ y: -3 }} style={{ marginBottom: 0 }}>
                        <div className="adm-stat-label">{s.label}</div>
                        <div className="adm-stat-val" style={{ color: s.color }}>{s.value}</div>
                      </motion.div>
                    ))}
                  </div>
                  {/* Right: revenue breakdown */}
                  <div className="adm-card" style={{ marginBottom: 0 }}>
                    <h2><TrendingUp size={16} /> Revenue by Status</h2>
                    {['pending', 'confirmed', 'delivered', 'cancelled'].map(status => {
                      const rev = orders.filter(o => o.status === status).reduce((s, o) => s + (o.total || 0), 0);
                      const allRev = orders.reduce((s, o) => s + (o.total || 0), 0);
                      const pct = allRev > 0 ? (rev / allRev) * 100 : 0;
                      const st = STATUS_STYLES[status];
                      return (
                        <div key={status} style={{ marginBottom: 18 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '.85rem' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, color: st.color }}>{st.icon} {status.charAt(0).toUpperCase() + status.slice(1)}</span>
                            <span style={{ fontWeight: 700 }}>₹{rev.toLocaleString('en-IN')}</span>
                          </div>
                          <div style={{ background: '#f0fae8', borderRadius: 8, height: 10, overflow: 'hidden' }}>
                            <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }}
                              style={{ height: '100%', background: st.color, borderRadius: 8 }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {tab === 'stats' && (
              <motion.div key="stats" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="adm-cols">
                  {/* Left: summary stats */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {[
                      { label: 'Total Products', value: products.length, color: '#2d5a1b' },
                      { label: 'Total Orders', value: orders.length, color: '#1d4ed8' },
                      { label: 'Delivered', value: deliveredCount, color: '#059669' },
                      { label: 'Cancelled', value: orders.filter(o => o.status === 'cancelled').length, color: '#b91c1c' },
                    ].map(s => (
                      <motion.div className="adm-stat" key={s.label} whileHover={{ y: -3 }} style={{ marginBottom: 0 }}>
                        <div className="adm-stat-label">{s.label}</div>
                        <div className="adm-stat-val" style={{ color: s.color }}>{s.value}</div>
                      </motion.div>
                    ))}
                  </div>
                  {/* Right: top products */}
                  <div className="adm-card" style={{ marginBottom: 0 }}>
                    <h2><BarChart2 size={16} /> Top Products by Units Sold</h2>
                    {topProducts.length === 0 && <p style={{ color: '#8ab87a' }}>No order data yet.</p>}
                    {topProducts.map((p, i) => (
                      <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                        <span style={{ fontWeight: 900, color: '#8ab87a', width: 20 }}>#{i + 1}</span>
                        <span style={{ color: '#2d5a1b' }}><ProductIcon iconName={p.icon} size={18} /></span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: '.9rem', marginBottom: 4 }}>{p.name}</div>
                          <div style={{ background: '#f0fae8', borderRadius: 8, height: 8, overflow: 'hidden' }}>
                            <motion.div initial={{ width: 0 }}
                              animate={{ width: topProducts[0].sold > 0 ? `${(p.sold / topProducts[0].sold) * 100}%` : '0%' }}
                              transition={{ duration: 0.8, delay: i * 0.1 }}
                              style={{ height: '100%', background: 'linear-gradient(90deg,#2d5a1b,#5cb85c)', borderRadius: 8 }} />
                          </div>
                        </div>
                        <span style={{ fontWeight: 700, fontSize: '.85rem', color: '#2d5a1b', minWidth: 60, textAlign: 'right' }}>{p.sold} bags</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Footer />
      </div>

      {/* Product Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div className="adm-form-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={e => e.target === e.currentTarget && setShowForm(false)}>
            <motion.div className="adm-form" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
              <h3>{editingProduct ? '✏️ Edit Product' : '➕ Add Product'}</h3>
              <div className="adm-form-row">
                <div className="adm-field">
                  <label>Name *</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Product name" />
                </div>
                <div className="adm-field">
                  <label>Lot {!editingProduct && <span style={{color:'#8ab87a',fontWeight:400,textTransform:'none'}}>(auto-generated)</span>}</label>
                  <input value={form.lot} onChange={e => setForm(f => ({ ...f, lot: e.target.value }))} placeholder="0001002" readOnly={!editingProduct} style={!editingProduct ? { background: '#f0fae8', color: '#5a7a4a' } : {}} />
                </div>
              </div>
              <div className="adm-field">
                <label>Description</label>
                <textarea value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} placeholder="Product description" rows={3} />
              </div>
              <div className="adm-form-row">
                <div className="adm-field">
                  <label>Category</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                    <option>Chemical</option>
                    <option>Organic</option>
                  </select>
                </div>
                <div className="adm-field">
                  <label>Price (₹) *</label>
                  <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="0" />
                </div>
              </div>
              <div className="adm-form-row">
                <div className="adm-field">
                  <label>Icon</label>
                  <select value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}>
                    {Object.keys(ICON_MAP).map(k => <option key={k}>{k}</option>)}
                  </select>
                </div>
                <div className="adm-field">
                  <label>Marketing Label</label>
                  <select value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))}>
                    <option value="">None</option>
                    <option value="new">New</option>
                    <option value="hot">Hot</option>
                    <option value="sale">Sale</option>
                  </select>
                </div>
              </div>
              <div className="adm-form-btns">
                <button className="btn-cancel" onClick={() => setShowForm(false)}><X size={14} style={{ marginRight: 4 }} />Cancel</button>
                <button className="btn-save" onClick={saveProduct} disabled={saving}>
                  <Save size={14} /> {saving ? 'Saving…' : 'Save Product'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {msg && (
          <motion.div className="adm-msg" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}>
            {msg}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
