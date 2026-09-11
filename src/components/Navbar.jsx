import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Menu, X, Shield } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import logo from '../assets/LOGO.png';
import { useAuth } from '../context/AuthContext';
import ProfileMenu from './ProfileMenu';
import './styles.css';

export default function Navbar({ cartCount = 0 }) {
  const { user, role } = useAuth();
  const nav = useNavigate();
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [prevCount, setPrevCount] = useState(cartCount);
  const [cartBounce, setCartBounce] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (cartCount > prevCount) { setCartBounce(true); setTimeout(() => setCartBounce(false), 600); }
    setPrevCount(cartCount);
  }, [cartCount]);

  const links = [
    { label: 'Home', path: '/' },
    { label: 'Products', path: '/products' },
    { label: 'Why Us', path: '/#features' },
  ];

  return (
    <>
      <motion.nav
        className={`rb-nav${scrolled ? ' rb-nav-scrolled' : ''}`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => nav('/')}>
          <motion.img src={logo} alt="Raithabandhu"
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} />
          <motion.h1
            style={{ color: 'green', margin: 0, fontSize: '1.1rem', letterSpacing: '0.08em', fontWeight: 700 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}>
            RAITHABANDHU KRISHI SOLUTIONS LLP
          </motion.h1>
        </div>

        <ul className="rb-nav-links rb-nav-desktop">
          {links.map((l, i) => (
            <motion.li key={l.path}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i + 0.3 }}>
              <a onClick={() => nav(l.path)}
                className={pathname === l.path ? 'rb-nav-active' : ''}>
                {l.label}
                {pathname === l.path && (
                  <motion.span className="rb-nav-underline" layoutId="underline" />
                )}
              </a>
            </motion.li>
          ))}

          <motion.li initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
            <motion.a onClick={() => nav('/cart')} className="rb-cart-icon"
              animate={cartBounce ? { scale: [1, 1.4, 0.9, 1.1, 1] } : {}}
              transition={{ duration: 0.5 }}>
              <ShoppingCart size={22} />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span className="rb-cart-badge"
                    initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    transition={{ type: 'spring', stiffness: 500 }}>
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.a>
          </motion.li>

          <motion.li initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
            {user
              ? <ProfileMenu user={user} />
              : <motion.a onClick={() => nav('/login')} className="rb-nav-cta"
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  Login
                </motion.a>
            }
          </motion.li>
          {role === 'admin' && (
            <motion.li initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
              <motion.a onClick={() => nav('/admin')} style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#2d5a1b', fontWeight: 700, fontSize: '.85rem', cursor: 'pointer' }}
                whileHover={{ scale: 1.05 }}>
                <Shield size={15} /> Admin
              </motion.a>
            </motion.li>
          )}
        </ul>

        <motion.button className="rb-hamburger" onClick={() => setMenuOpen(o => !o)}
          whileTap={{ scale: 0.9 }}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.button>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div className="rb-mobile-menu"
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}>
            {links.map(l => (
              <a key={l.path} onClick={() => { nav(l.path); setMenuOpen(false); }}
                className={pathname === l.path ? 'rb-nav-active' : ''}>
                {l.label}
              </a>
            ))}
            <a onClick={() => { nav('/cart'); setMenuOpen(false); }}>
              🛒 Cart {cartCount > 0 && `(${cartCount})`}
            </a>
            {user
              ? <>
                  <a onClick={() => { nav('/orders'); setMenuOpen(false); }}>📦 Your Orders</a>
                  <a onClick={() => { nav('/settings'); setMenuOpen(false); }}>⚙️ Settings</a>
                  {role === 'admin' && (
                    <a onClick={() => { nav('/admin'); setMenuOpen(false); }}>🛡️ Admin</a>
                  )}
                  <a onClick={() => { signOut(auth); nav('/login'); setMenuOpen(false); }} style={{ color: '#e53e3e' }}>🚪 Logout</a>
                </>
              : <a onClick={() => { nav('/login'); setMenuOpen(false); }} className="rb-nav-cta" style={{ textAlign: 'center', borderRadius: 24, padding: '10px 0' }}>Login / Sign Up</a>
            }
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
