import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AdminRoute({ children }) {
  const { user, role } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    if (user === null || (user && role !== null && role !== 'admin')) {
      nav('/');
    }
  }, [user, role, nav]);

  if (!user || role !== 'admin') return null;
  return children;
}
