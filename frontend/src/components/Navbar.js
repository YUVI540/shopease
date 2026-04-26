// src/components/Navbar.js
import { Link, useNavigate } from 'react-router-dom';

function Navbar({ cart, user, onLogout }) {
    const navigate = useNavigate();
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <nav style={styles.nav}>
            <Link to="/" style={styles.brand}>🛒 ShopEase</Link>

            <div style={styles.links}>
                <Link to="/" style={styles.link}>Products</Link>
                {user ? (
                    <>
                        <Link to="/orders" style={styles.link}>My Orders</Link>
                        <span style={styles.username}>👤 {user.name}</span>
                        <button onClick={onLogout} style={styles.logoutBtn}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={styles.link}>Login</Link>
                        <Link to="/register" style={styles.link}>Register</Link>
                    </>
                )}
                <Link to="/cart" style={styles.cartBtn}>
                    🛍️ Cart {cartCount > 0 && <span style={styles.badge}>{cartCount}</span>}
                </Link>
            </div>
        </nav>
    );
}

const styles = {
    nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '14px 32px', background: '#1a1a2e', color: '#fff', boxShadow: '0 2px 10px rgba(0,0,0,0.3)' },
    brand: { fontSize: '22px', fontWeight: '700', color: '#e94560', textDecoration: 'none' },
    links: { display: 'flex', alignItems: 'center', gap: '20px' },
    link: { color: '#ccc', textDecoration: 'none', fontSize: '14px' },
    username: { color: '#e94560', fontSize: '14px' },
    logoutBtn: { background: 'none', border: '1px solid #e94560', color: '#e94560',
        padding: '4px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' },
    cartBtn: { background: '#e94560', color: '#fff', padding: '6px 16px',
        borderRadius: '20px', textDecoration: 'none', fontSize: '14px', fontWeight: '600', position: 'relative' },
    badge: { background: '#fff', color: '#e94560', borderRadius: '50%', padding: '1px 6px',
        fontSize: '11px', fontWeight: '700', marginLeft: '6px' },
};

export default Navbar;
