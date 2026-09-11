import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, MapPin, Phone, User, Hash, ArrowRight, ShoppingBag, FlaskConical, TestTube, Beaker, Recycle, Atom, Layers, Package } from 'lucide-react';

const ICON_MAP = { FlaskConical, TestTube, Beaker, Recycle, Atom, Layers, Package };
function ProductIcon({ iconName, size = 20 }) {
  const Icon = ICON_MAP[iconName] || Package;
  return <Icon size={size} strokeWidth={1.5} />;
}
import { doc, getDoc, setDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';
import Footer from './Footer';
import './styles.css';

const confettiItems = ['🌾', '🌿', '🎉', '✨', '🌱', '💚', '🎊', '🌻'];

export default function Checkout({ cart, setCart }) {
  const nav = useNavigate();
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const [placed, setPlaced] = useState(false);
  const { user } = useAuth();
  const [form, setForm] = useState({ name: '', phone: '', village: '', mandal: '', district: '', pincode: '', notes: '' });

  useEffect(() => {
    if (!user) return;
    getDoc(doc(db, 'users', user.uid))
      .then(snap => { if (snap.exists() && snap.data().deliveryDetails) setForm(f => ({ ...f, ...snap.data().deliveryDetails })); });
  }, [user]);
  const [errors, setErrors] = useState({});
  const [focused, setFocused] = useState('');

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!/^[6-9]\d{9}$/.test(form.phone)) e.phone = 'Enter a valid 10-digit mobile number';
    if (!form.village.trim()) e.village = 'Village is required';
    if (!form.district.trim()) e.district = 'District is required';
    if (!/^\d{6}$/.test(form.pincode)) e.pincode = 'Enter a valid 6-digit pincode';
    return e;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    if (user) setDoc(doc(db, 'users', user.uid), { deliveryDetails: { name: form.name, phone: form.phone, village: form.village, mandal: form.mandal, district: form.district, pincode: form.pincode } }, { merge: true });
    const orderData = {
      uid: user?.uid || null,
      items: cart.map(i => ({ id: i.id, name: i.name, lot: i.lot, icon: i.icon, qty: i.qty, price: i.price })),
      total: cart.reduce((s, i) => s + i.price * i.qty, 0),
      delivery: { name: form.name, phone: form.phone, village: form.village, mandal: form.mandal, district: form.district, pincode: form.pincode, notes: form.notes },
      status: 'pending',
      createdAt: serverTimestamp(),
    };
    addDoc(collection(db, 'orders'), orderData);
    setPlaced(true);
    setCart([]);
  }

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(er => ({ ...er, [e.target.name]: undefined }));
  }

  if (placed) return (
    <>
      <Navbar cartCount={0} />
      <motion.div style={{ textAlign: 'center', padding: '80px 24px', minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {confettiItems.map((c, i) => (
          <motion.div key={i} style={{ position: 'absolute', fontSize: '1.8rem', top: '-10%', left: `${10 + i * 11}%` }}
            animate={{ y: ['0vh', '110vh'], rotate: [0, 360], opacity: [1, 0.5, 0] }}
            transition={{ duration: 2.5 + i * 0.3, delay: i * 0.15, ease: 'easeIn' }}>
            {c}
          </motion.div>
        ))}
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}>
          <CheckCircle size={96} color="#2d5a1b" strokeWidth={1.5} />
        </motion.div>
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          style={{ fontSize: '2rem', fontWeight: 900, color: '#1a2e0f', margin: '24px 0 12px' }}>
          Order Placed Successfully!
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
          style={{ color: '#5a7a4a', fontSize: '1.05rem', marginBottom: '36px', maxWidth: 480 }}>
          Thank you, <strong>{form.name}</strong>! We'll contact you on <strong>{form.phone}</strong> to confirm your order and arrange delivery.
        </motion.p>
        <motion.button onClick={() => nav('/')}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
          style={{ background: 'linear-gradient(135deg,#2d5a1b,#3d7a25)', color: '#fff', border: 'none', padding: '15px 44px', borderRadius: 50, fontSize: '1rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
          Back to Home <ArrowRight size={16} />
        </motion.button>
      </motion.div>
      <Footer />
    </>
  );

  if (cart.length === 0) return (
    <>
      <Navbar cartCount={0} />
      <motion.div style={{ textAlign: 'center', padding: '100px 24px' }}
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
        <div style={{ fontSize: '4rem', marginBottom: 16 }}>🛒</div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1a2e0f', marginBottom: 12 }}>No items to checkout</h2>
        <motion.button onClick={() => nav('/products')}
          style={{ background: 'linear-gradient(135deg,#2d5a1b,#3d7a25)', color: '#fff', border: 'none', padding: '13px 36px', borderRadius: 50, fontSize: '1rem', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
          <ShoppingBag size={16} /> Browse Products
        </motion.button>
      </motion.div>
      <Footer />
    </>
  );

  return (
    <>
      <style>{`
        .co-hero { position:relative; overflow:hidden; background:linear-gradient(135deg,#0d2e06,#1a4a0a,#2d7a1b); padding:60px 48px 48px; text-align:center; }
        .co-hero h1 { color:#fff; font-size:clamp(1.8rem,4vw,2.8rem); font-weight:900; }
        .co-layout { display:grid; grid-template-columns:1fr 340px; gap:32px; align-items:start; }
        .co-form-card { background:#fff; border-radius:24px; padding:36px; box-shadow:0 4px 24px rgba(0,0,0,.08); border:1px solid #e8f5e0; }
        .co-form-card h2 { font-size:1.15rem; font-weight:800; color:#1a2e0f; margin-bottom:28px; display:flex; align-items:center; gap:8px; }
        .co-row { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
        .co-field { display:flex; flex-direction:column; margin-bottom:20px; }
        .co-field label { font-size:.78rem; font-weight:800; color:#2d5a1b; margin-bottom:7px; letter-spacing:.5px; text-transform:uppercase; display:flex; align-items:center; gap:5px; }
        .co-field input, .co-field textarea { padding:12px 16px; border:2px solid #e0f0d0; border-radius:12px; font-size:.92rem; color:#1a2e0f; outline:none; transition:border .2s,box-shadow .2s; font-family:inherit; background:#fafffe; }
        .co-field input:focus, .co-field textarea:focus { border-color:#2d5a1b; box-shadow:0 0 0 4px rgba(45,90,27,.08); background:#fff; }
        .co-field input.err { border-color:#e53e3e; box-shadow:0 0 0 4px rgba(229,62,62,.08); }
        .co-err { font-size:.75rem; color:#e53e3e; margin-top:5px; display:flex; align-items:center; gap:4px; }
        .co-field textarea { resize:vertical; min-height:80px; }
        .co-summary { background:#fff; border-radius:24px; padding:28px; box-shadow:0 4px 24px rgba(0,0,0,.08); border:1px solid #e8f5e0; position:sticky; top:90px; }
        .co-summary h2 { font-size:1.1rem; font-weight:800; color:#1a2e0f; margin-bottom:20px; padding-bottom:14px; border-bottom:2px solid #f0fae8; }
        .co-sum-item { display:flex; justify-content:space-between; font-size:.88rem; color:#5a7a4a; margin-bottom:12px; align-items:center; }
        .co-sum-item span:first-child { display:flex; align-items:center; gap:8px; }
        .co-sum-divider { border:none; border-top:2px solid #f0fae8; margin:14px 0; }
        .co-sum-total { display:flex; justify-content:space-between; font-weight:800; font-size:1rem; color:#1a2e0f; }
        .co-sum-note { font-size:.75rem; color:#8ab87a; font-style:italic; margin-top:12px; line-height:1.5; }
        .btn-place { width:100%; background:linear-gradient(135deg,#2d5a1b,#3d7a25); color:#fff; border:none; padding:15px; border-radius:16px; font-size:1rem; font-weight:800; cursor:pointer; margin-top:24px; display:flex; align-items:center; justify-content:center; gap:8px; }
        @media(max-width:768px) { .co-layout { grid-template-columns:1fr; } .co-row { grid-template-columns:1fr; } .co-hero { padding:48px 20px 36px; } }
      `}</style>

      <Navbar cartCount={cartCount} />
      <div className="co-hero">
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          📋 Checkout
        </motion.h1>
      </div>

      <svg viewBox="0 0 1440 50" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"
        style={{ display: 'block', background: 'linear-gradient(135deg,#0d2e06,#2d7a1b)', marginBottom: -4 }}>
        <path d="M0,25 C360,50 1080,0 1440,25 L1440,50 L0,50 Z" fill="#f7faf3" />
      </svg>

      <div className="rb-page">
        <div className="co-layout">
          <motion.form className="co-form-card" onSubmit={handleSubmit} noValidate
            initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <h2><MapPin size={18} color="#2d5a1b" /> Delivery Details</h2>

            <div className="co-row">
              {[
                { name: 'name', label: 'Full Name', icon: <User size={12} />, placeholder: 'Your full name', required: true },
                { name: 'phone', label: 'Mobile Number', icon: <Phone size={12} />, placeholder: '10-digit mobile', maxLength: 10, required: true },
              ].map(f => (
                <motion.div className="co-field" key={f.name}
                  animate={focused === f.name ? { scale: 1.01 } : { scale: 1 }}>
                  <label>{f.icon} {f.label} {f.required && '*'}</label>
                  <input name={f.name} value={form[f.name]} onChange={handleChange}
                    onFocus={() => setFocused(f.name)} onBlur={() => setFocused('')}
                    placeholder={f.placeholder} maxLength={f.maxLength}
                    className={errors[f.name] ? 'err' : ''} />
                  <AnimatePresence>
                    {errors[f.name] && (
                      <motion.span className="co-err" initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                        ⚠ {errors[f.name]}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>

            <div className="co-row">
              {[
                { name: 'village', label: 'Village / Town', placeholder: 'Village or town', required: true },
                { name: 'mandal', label: 'Mandal', placeholder: 'Mandal (optional)' },
              ].map(f => (
                <motion.div className="co-field" key={f.name}
                  animate={focused === f.name ? { scale: 1.01 } : { scale: 1 }}>
                  <label><MapPin size={12} /> {f.label} {f.required && '*'}</label>
                  <input name={f.name} value={form[f.name]} onChange={handleChange}
                    onFocus={() => setFocused(f.name)} onBlur={() => setFocused('')}
                    placeholder={f.placeholder} className={errors[f.name] ? 'err' : ''} />
                  <AnimatePresence>
                    {errors[f.name] && (
                      <motion.span className="co-err" initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                        ⚠ {errors[f.name]}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>

            <div className="co-row">
              {[
                { name: 'district', label: 'District', placeholder: 'District', required: true },
                { name: 'pincode', label: 'Pincode', icon: <Hash size={12} />, placeholder: '6-digit pincode', maxLength: 6, required: true },
              ].map(f => (
                <motion.div className="co-field" key={f.name}
                  animate={focused === f.name ? { scale: 1.01 } : { scale: 1 }}>
                  <label>{f.icon || <MapPin size={12} />} {f.label} {f.required && '*'}</label>
                  <input name={f.name} value={form[f.name]} onChange={handleChange}
                    onFocus={() => setFocused(f.name)} onBlur={() => setFocused('')}
                    placeholder={f.placeholder} maxLength={f.maxLength}
                    className={errors[f.name] ? 'err' : ''} />
                  <AnimatePresence>
                    {errors[f.name] && (
                      <motion.span className="co-err" initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                        ⚠ {errors[f.name]}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>

            <div className="co-field">
              <label>📝 Special Instructions</label>
              <textarea name="notes" value={form.notes} onChange={handleChange}
                onFocus={() => setFocused('notes')} onBlur={() => setFocused('')}
                placeholder="Any delivery notes, crop type, or special requirements..." />
            </div>

            <motion.button type="submit" className="btn-place"
              whileHover={{ scale: 1.02, boxShadow: '0 8px 28px rgba(45,90,27,.3)' }}
              whileTap={{ scale: 0.98 }}>
              <CheckCircle size={18} /> Place Order
            </motion.button>
          </motion.form>

          <motion.div className="co-summary"
            initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <h2>🧾 Order Summary</h2>
            {cart.map((item, i) => (
              <motion.div className="co-sum-item" key={item.id}
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}>
                <span><ProductIcon iconName={item.icon} size={16} /> {item.name} <span style={{fontSize:'.72rem',color:'#aaa'}}>({item.lot})</span></span>
                <span>×{item.qty} · ₹{(item.price * item.qty).toLocaleString('en-IN')}</span>
              </motion.div>
            ))}
            <hr className="co-sum-divider" />
            <div className="co-sum-total">
              <span>Total ({cartCount} bag{cartCount > 1 ? 's' : ''})</span>
              <span>₹{cart.reduce((s, i) => s + i.price * i.qty, 0).toLocaleString('en-IN')}</span>
            </div>
            <p className="co-sum-note">* Pricing will be confirmed by our team after order placement.</p>
          </motion.div>
        </div>
      </div>

      <Footer />
    </>
  );
}
