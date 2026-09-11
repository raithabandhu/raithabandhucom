import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, Mail } from 'lucide-react';
import logo from '../assets/LOGO.png';
import './styles.css';

export default function Footer() {
  const nav = useNavigate();
  return (
    <motion.footer className="rb-footer"
      initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
      viewport={{ once: true }} transition={{ duration: 0.6 }}>

      <div className="rb-footer-brand">
        <motion.img src={logo} alt="Raithabandhu"
          whileHover={{ scale: 1.05 }} style={{ cursor: 'pointer' }}
          onClick={() => nav('/')} />
        <p>Your trusted farming partner.</p>
      </div>

      <div className="rb-footer-links">
        {[['Products', '/products'], ['About Us', '/'], ['Cart', '/cart']].map(([label, path], i) => (
          <motion.a key={label} onClick={() => nav(path)}
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: i * 0.1 }}
            whileHover={{ color: '#a8e063', x: 4 }}>
            {label}
          </motion.a>
        ))}
        <motion.a href="tel:+919999999999"
          whileHover={{ color: '#a8e063', x: 4 }}
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Phone size={14} /> +91 99999 99999
        </motion.a>
        <motion.a href="mailto:support@raithabandhu.com"
          whileHover={{ color: '#a8e063', x: 4 }}
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Mail size={14} /> support@raithabandhu.com
        </motion.a>
      </div>

      <div className="rb-footer-copy">
        © 2025 Raithabandhu. All rights reserved. | Made with 💚 for Indian Farmers
      </div>
    </motion.footer>
  );
}
