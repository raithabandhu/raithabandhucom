import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Products from './components/Products';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import AdminRoute from './components/AdminRoute';
import AuthProvider from './context/AuthContext';
// import SoilAnalysisPage from './components/soilAnalysis/SoilAnalysisPage';
import Orders from './components/Orders';

export default function App() {
  const [cart, setCart] = useState([]);

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home cart={cart} setCart={setCart} />} />
          <Route path="/products" element={<Products cart={cart} setCart={setCart} />} />
          <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />
          <Route path="/checkout" element={<Checkout cart={cart} setCart={setCart} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
{/*           <Route path="/soil-analysis" element={<SoilAnalysisPage cartCount={cart.length} />} /> */}
          <Route path="/orders" element={<Orders />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
