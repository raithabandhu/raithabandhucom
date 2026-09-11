import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { ShoppingBag, Settings, LogOut, ChevronDown, UserCircle } from 'lucide-react';

export default function ProfileMenu({ user }) {
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const items = [
    { icon: <ShoppingBag size={15} />, label: 'Your Orders', action: () => nav('/orders') },
    { icon: <Settings size={15} />, label: 'Settings', action: () => nav('/settings') },
    { icon: <LogOut size={15} />, label: 'Logout', action: () => { signOut(auth); nav('/login'); } },
  ];

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <motion.button onClick={() => setOpen(o => !o)} whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.03 }}
        style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg,#2d5a1b,#3d7a25)', border: 'none', borderRadius: 50, padding: '7px 14px 7px 8px', cursor: 'pointer', color: '#fff', boxShadow: '0 2px 10px rgba(45,90,27,.35)' }}>
        <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <UserCircle size={22} strokeWidth={1.8} color="#fff" />
        </div>
        <span style={{ fontSize: '.85rem', fontWeight: 700, maxWidth: 90, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {user.displayName?.split(' ')[0] || 'Account'}
        </span>
        <ChevronDown size={14} color="#fff" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: .95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: .95 }}
            transition={{ duration: .15 }}
            style={{ position: 'absolute', right: 0, top: 'calc(100% + 10px)', background: '#fff', borderRadius: 16, boxShadow: '0 8px 32px rgba(0,0,0,.15)', border: '1px solid #e8f5e0', minWidth: 180, overflow: 'hidden', zIndex: 999 }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0fae8' }}>
              <p style={{ margin: 0, fontSize: '.8rem', fontWeight: 800, color: '#1a2e0f' }}>{user.displayName || 'User'}</p>
              <p style={{ margin: 0, fontSize: '.72rem', color: '#8ab87a', marginTop: 2 }}>{user.email}</p>
            </div>
            {items.map(item => (
              <motion.button key={item.label} onClick={() => { item.action(); setOpen(false); }}
                whileHover={{ background: '#f7faf3' }}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '11px 16px', background: 'none', border: 'none', cursor: 'pointer', color: item.label === 'Logout' ? '#e53e3e' : '#1a2e0f', fontSize: '.88rem', fontWeight: 600, textAlign: 'left' }}>
                <span style={{ color: item.label === 'Logout' ? '#e53e3e' : '#2d5a1b' }}>{item.icon}</span>
                {item.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
