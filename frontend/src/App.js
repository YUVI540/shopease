// src/App.js
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OrdersPage from './pages/OrdersPage';

function App() {
    const [cart, setCart] = useState([]);
    const [user, setUser] = useState(null);

    // Add product to cart (merge if already exists)
    const handleAddToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    // Update quantity (delta: +1 or -1), remove if hits 0
    const handleUpdateCart = (productId, delta) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === productId);
            if (!existing) return prev;
            const newQty = existing.quantity + delta;
            if (newQty <= 0) return prev.filter(item => item.id !== productId);
            return prev.map(item =>
                item.id === productId ? { ...item, quantity: newQty } : item
            );
        });
    };

    const handleClearCart = () => setCart([]);

    const handleLogin = (userData) => setUser(userData);

    const handleLogout = () => {
        setUser(null);
        setCart([]);
    };

    return (
        <Router>
            <div style={{ minHeight: '100vh', background: '#f8f9fa', fontFamily: "'Segoe UI', sans-serif" }}>
                <Navbar cart={cart} user={user} onLogout={handleLogout} />
                <Routes>
                    <Route path="/" element={<HomePage onAddToCart={handleAddToCart} />} />
                    <Route path="/products/:id" element={<ProductDetailPage onAddToCart={handleAddToCart} />} />
                    <Route path="/cart" element={
                        <CartPage
                            cart={cart}
                            onUpdateCart={handleUpdateCart}
                            onClearCart={handleClearCart}
                            user={user}
                        />}
                    />
                    <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
                    <Route path="/register" element={<RegisterPage onLogin={handleLogin} />} />
                    <Route path="/orders" element={<OrdersPage user={user} />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
