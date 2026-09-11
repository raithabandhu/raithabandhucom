import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => onAuthStateChanged(auth, async u => {
    setUser(u);
    if (u) {
      const snap = await getDoc(doc(db, 'users', u.uid));
      setRole(snap.exists() ? (snap.data().role || null) : null);
    } else {
      setRole(null);
    }
    setLoading(false);
  }), []);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f7faf3' }}>
      <div style={{ width: 40, height: 40, border: '4px solid #e0f0d0', borderTop: '4px solid #2d5a1b', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
  return <AuthContext.Provider value={{ user, role }}>{children}</AuthContext.Provider>;
}
