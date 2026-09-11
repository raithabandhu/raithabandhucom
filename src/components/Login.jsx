import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import logo from '../assets/LOGO.png';

export default function Login() {
  const nav = useNavigate();
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  async function saveUser(user) {
    await setDoc(doc(db, 'users', user.uid), {
      name: user.displayName || form.name,
      email: user.email,
      photoURL: user.photoURL || '',
      createdAt: serverTimestamp(),
    }, { merge: true });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      if (mode === 'signup') {
        const { user } = await createUserWithEmailAndPassword(auth, form.email, form.password);
        await updateProfile(user, { displayName: form.name });
        await saveUser(user);
      } else {
        await signInWithEmailAndPassword(auth, form.email, form.password);
      }
      nav('/');
    } catch (err) {
      setError(err.message.replace('Firebase: ', '').replace(/\(.*\)/, '').trim());
    }
    setLoading(false);
  }

  async function handleGoogle() {
    setError(''); setLoading(true);
    try {
      const { user } = await signInWithPopup(auth, googleProvider);
      await saveUser(user);
      nav('/');
    } catch (err) {
      setError(err.message.replace('Firebase: ', '').replace(/\(.*\)/, '').trim());
    }
    setLoading(false);
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0d2e06,#1a4a0a,#2d7a1b)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        style={{ background: '#fff', borderRadius: 24, padding: '40px 36px', width: '100%', maxWidth: 420, boxShadow: '0 20px 60px rgba(0,0,0,.25)' }}>

        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <img src={logo} alt="Raithabandhu" style={{ height: 56, marginBottom: 12 }} />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#1a2e0f', margin: 0 }}>
            {mode === 'login' ? 'Welcome Back!' : 'Create Account'}
          </h2>
          <p style={{ color: '#8ab87a', fontSize: '.85rem', marginTop: 4 }}>
            {mode === 'login' ? 'Sign in to continue' : 'Join Raithabandhu today'}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <AnimatePresence>
            {mode === 'signup' && (
              <motion.div key="name" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ marginBottom: 16 }}>
                <Field icon={<User size={16} />} name="name" type="text" placeholder="Full Name" value={form.name} onChange={handle} required />
              </motion.div>
            )}
          </AnimatePresence>

          <div style={{ marginBottom: 16 }}>
            <Field icon={<Mail size={16} />} name="email" type="email" placeholder="Email Address" value={form.email} onChange={handle} required />
          </div>
          <div style={{ marginBottom: 8, position: 'relative' }}>
            <Field icon={<Lock size={16} />} name="password" type={showPwd ? 'text' : 'password'} placeholder="Password" value={form.password} onChange={handle} required />
            <button type="button" onClick={() => setShowPwd(v => !v)}
              style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#8ab87a' }}>
              {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {error && <p style={{ color: '#e53e3e', fontSize: '.8rem', margin: '8px 0', textAlign: 'center' }}>{error}</p>}

          <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            style={{ width: '100%', background: 'linear-gradient(135deg,#2d5a1b,#3d7a25)', color: '#fff', border: 'none', padding: '13px', borderRadius: 12, fontSize: '1rem', fontWeight: 800, cursor: 'pointer', marginTop: 12 }}>
            {loading ? '...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </motion.button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '20px 0' }}>
          <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #e0f0d0' }} />
          <span style={{ color: '#8ab87a', fontSize: '.8rem' }}>or</span>
          <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #e0f0d0' }} />
        </div>

        <motion.button onClick={handleGoogle} disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          style={{ width: '100%', background: '#fff', color: '#1a2e0f', border: '2px solid #e0f0d0', padding: '12px', borderRadius: 12, fontSize: '.95rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
          Continue with Google
        </motion.button>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: '.85rem', color: '#5a7a4a' }}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => { setMode(m => m === 'login' ? 'signup' : 'login'); setError(''); }}
            style={{ background: 'none', border: 'none', color: '#2d5a1b', fontWeight: 800, cursor: 'pointer', fontSize: '.85rem' }}>
            {mode === 'login' ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </motion.div>
    </div>
  );
}

function Field({ icon, ...props }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', border: '2px solid #e0f0d0', borderRadius: 12, padding: '0 14px', background: '#fafffe', gap: 10 }}>
      <span style={{ color: '#8ab87a', display: 'flex' }}>{icon}</span>
      <input {...props} style={{ flex: 1, border: 'none', outline: 'none', padding: '12px 0', fontSize: '.92rem', background: 'transparent', color: '#1a2e0f' }} />
    </div>
  );
}
