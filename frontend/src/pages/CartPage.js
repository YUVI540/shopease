// src/pages/CartPage.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../services/api';

function CartPage({ cart, onUpdateCart, onClearCart, user }) {
    const navigate = useNavigate();
    const [address, setAddress] = useState('');
    const [placing, setPlacing] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const updateQty = (productId, delta) => {
        onUpdateCart(productId, delta);
    };

    const removeItem = (productId) => {
        onUpdateCart(productId, -999); // large negative removes item
    };

    const handlePlaceOrder = () => {
        if (!user) { navigate('/login'); return; }
        if (!address.trim()) { setError('Please enter a shipping address'); return; }

        setPlacing(true);
        setError('');

        const items = cart.map(item => ({ productId: item.id, quantity: item.quantity }));

        orderService.place(user.id, items, address)
            .then(() => {
                setSuccess(true);
                onClearCart();
            })
            .catch(err => {
                setError(err.response?.data?.message || 'Failed to place order. Try again.');
            })
            .finally(() => setPlacing(false));
    };

    if (success) return (
        <div style={styles.successPage}>
            <div style={styles.successBox}>
                <div style={styles.successIcon}>🎉</div>
                <h2 style={styles.successTitle}>Order Placed Successfully!</h2>
                <p style={styles.successMsg}>Your order has been received and is being processed.</p>
                <div style={styles.successActions}>
                    <button onClick={() => navigate('/orders')} style={styles.viewOrdersBtn}>View My Orders</button>
                    <button onClick={() => navigate('/')} style={styles.shopMoreBtn}>Continue Shopping</button>
                </div>
            </div>
        </div>
    );

    if (cart.length === 0) return (
        <div style={styles.emptyPage}>
            <div style={styles.emptyBox}>
                <div style={{ fontSize: '64px' }}>🛒</div>
                <h2>Your cart is empty</h2>
                <p style={{ color: '#888' }}>Add some products to get started!</p>
                <button onClick={() => navigate('/')} style={styles.shopBtn}>Browse Products</button>
            </div>
        </div>
    );

    return (
        <div style={styles.page}>
            <h1 style={styles.heading}>Your Cart ({cart.length} item{cart.length > 1 ? 's' : ''})</h1>
            <div style={styles.layout}>
                {/* Cart Items */}
                <div style={styles.items}>
                    {cart.map(item => (
                        <div key={item.id} style={styles.item}>
                            <div style={styles.itemImage}>
                                {item.imageUrl
                                    ? <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    : <span style={{ fontSize: '32px' }}>📦</span>}
                            </div>
                            <div style={styles.itemInfo}>
                                <p style={styles.itemName}>{item.name}</p>
                                <p style={styles.itemPrice}>₹{Number(item.price).toLocaleString()} each</p>
                            </div>
                            <div style={styles.itemQty}>
                                <button onClick={() => updateQty(item.id, -1)} style={styles.qtyBtn}>−</button>
                                <span style={styles.qtyNum}>{item.quantity}</span>
                                <button onClick={() => updateQty(item.id, 1)} style={styles.qtyBtn}>+</button>
                            </div>
                            <div style={styles.itemTotal}>
                                ₹{(Number(item.price) * item.quantity).toLocaleString()}
                            </div>
                            <button onClick={() => removeItem(item.id)} style={styles.removeBtn}>✕</button>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div style={styles.summary}>
                    <h3 style={styles.summaryTitle}>Order Summary</h3>
                    {cart.map(item => (
                        <div key={item.id} style={styles.summaryRow}>
                            <span>{item.name} × {item.quantity}</span>
                            <span>₹{(Number(item.price) * item.quantity).toLocaleString()}</span>
                        </div>
                    ))}
                    <div style={styles.divider} />
                    <div style={styles.totalRow}>
                        <strong>Total</strong>
                        <strong style={styles.totalAmount}>₹{Number(total).toLocaleString()}</strong>
                    </div>

                    <div style={styles.addressBox}>
                        <label style={styles.addressLabel}>Shipping Address</label>
                        <textarea
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Enter your full shipping address..."
                            style={styles.addressInput}
                            rows={3}
                        />
                    </div>

                    {error && <p style={styles.error}>{error}</p>}

                    <button
                        onClick={handlePlaceOrder}
                        disabled={placing}
                        style={placing ? styles.disabledOrderBtn : styles.orderBtn}
                    >
                        {placing ? '⏳ Placing Order...' : '🛒 Place Order'}
                    </button>

                    {!user && (
                        <p style={styles.loginNote}>
                            You need to <span onClick={() => navigate('/login')} style={styles.loginLink}>login</span> to place an order
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

const styles = {
    page: { padding: '32px', maxWidth: '1100px', margin: '0 auto' },
    heading: { fontSize: '26px', fontWeight: '800', color: '#1a1a2e', marginBottom: '24px' },
    layout: { display: 'flex', gap: '28px', alignItems: 'flex-start' },
    items: { flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' },
    item: { display: 'flex', alignItems: 'center', gap: '16px', background: '#fff',
        padding: '16px', borderRadius: '10px', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' },
    itemImage: { width: '64px', height: '64px', background: '#f5f5f5', borderRadius: '8px',
        display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 },
    itemInfo: { flex: 1 },
    itemName: { fontWeight: '700', color: '#1a1a2e', margin: '0 0 4px', fontSize: '15px' },
    itemPrice: { color: '#888', margin: 0, fontSize: '13px' },
    itemQty: { display: 'flex', alignItems: 'center', gap: '10px' },
    qtyBtn: { width: '28px', height: '28px', background: '#f0f0f0', border: 'none',
        borderRadius: '6px', cursor: 'pointer', fontWeight: '700', fontSize: '16px' },
    qtyNum: { fontWeight: '700', fontSize: '16px', minWidth: '20px', textAlign: 'center' },
    itemTotal: { fontWeight: '700', fontSize: '16px', color: '#1a1a2e', minWidth: '80px', textAlign: 'right' },
    removeBtn: { background: 'none', border: 'none', color: '#ccc', cursor: 'pointer',
        fontSize: '18px', padding: '4px 8px', borderRadius: '4px' },
    summary: { width: '320px', flexShrink: 0, background: '#fff', padding: '24px',
        borderRadius: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', position: 'sticky', top: '80px' },
    summaryTitle: { fontSize: '18px', fontWeight: '800', color: '#1a1a2e', marginBottom: '16px', marginTop: 0 },
    summaryRow: { display: 'flex', justifyContent: 'space-between', fontSize: '13px',
        color: '#666', marginBottom: '8px' },
    divider: { height: '1px', background: '#eee', margin: '16px 0' },
    totalRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '16px' },
    totalAmount: { color: '#e94560', fontSize: '20px' },
    addressBox: { marginBottom: '16px' },
    addressLabel: { display: 'block', fontSize: '13px', fontWeight: '600', color: '#444', marginBottom: '6px' },
    addressInput: { width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px',
        fontSize: '13px', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' },
    error: { color: '#e94560', fontSize: '13px', margin: '0 0 12px' },
    orderBtn: { width: '100%', padding: '14px', background: '#e94560', color: '#fff', border: 'none',
        borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '16px' },
    disabledOrderBtn: { width: '100%', padding: '14px', background: '#ccc', color: '#fff', border: 'none',
        borderRadius: '8px', cursor: 'not-allowed', fontWeight: '700', fontSize: '16px' },
    loginNote: { textAlign: 'center', fontSize: '13px', color: '#888', marginTop: '12px' },
    loginLink: { color: '#e94560', cursor: 'pointer', fontWeight: '600' },
    emptyPage: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' },
    emptyBox: { textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' },
    shopBtn: { padding: '12px 28px', background: '#e94560', color: '#fff', border: 'none',
        borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '15px', marginTop: '8px' },
    successPage: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' },
    successBox: { textAlign: 'center', background: '#fff', padding: '48px', borderRadius: '16px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.1)', maxWidth: '400px' },
    successIcon: { fontSize: '64px', marginBottom: '16px' },
    successTitle: { fontSize: '24px', fontWeight: '800', color: '#1a1a2e', margin: '0 0 8px' },
    successMsg: { color: '#888', marginBottom: '24px' },
    successActions: { display: 'flex', gap: '12px', justifyContent: 'center' },
    viewOrdersBtn: { padding: '12px 20px', background: '#e94560', color: '#fff', border: 'none',
        borderRadius: '8px', cursor: 'pointer', fontWeight: '700' },
    shopMoreBtn: { padding: '12px 20px', background: '#fff', color: '#1a1a2e',
        border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' },
};

export default CartPage;
