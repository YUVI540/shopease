// src/pages/OrdersPage.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../services/api';

const STATUS_COLORS = {
    PENDING:   { bg: '#fff8e1', color: '#f59e0b', label: '⏳ Pending' },
    CONFIRMED: { bg: '#e0f2fe', color: '#0284c7', label: '✅ Confirmed' },
    SHIPPED:   { bg: '#ede9fe', color: '#7c3aed', label: '🚚 Shipped' },
    DELIVERED: { bg: '#dcfce7', color: '#16a34a', label: '📦 Delivered' },
    CANCELLED: { bg: '#fee2e2', color: '#dc2626', label: '❌ Cancelled' },
};

function OrdersPage({ user }) {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [cancellingId, setCancellingId] = useState(null);

    useEffect(() => {
        if (!user) { navigate('/login'); return; }
        orderService.getByUser(user.id)
            .then(res => { setOrders(res.data); setLoading(false); })
            .catch(() => { setError('Failed to load orders.'); setLoading(false); });
    }, [user, navigate]);

    const handleCancel = (orderId) => {
        if (!window.confirm('Are you sure you want to cancel this order?')) return;
        setCancellingId(orderId);
        orderService.cancel(orderId)
            .then(() => {
                setOrders(orders.map(o =>
                    o.id === orderId ? { ...o, status: 'CANCELLED' } : o
                ));
            })
            .catch(err => alert(err.response?.data?.message || 'Cannot cancel this order.'))
            .finally(() => setCancellingId(null));
    };

    if (loading) return <div style={styles.center}>⏳ Loading your orders...</div>;
    if (error)   return <div style={styles.center}><p style={{ color: '#e94560' }}>{error}</p></div>;

    if (orders.length === 0) return (
        <div style={styles.emptyPage}>
            <div style={styles.emptyBox}>
                <div style={{ fontSize: '64px' }}>📋</div>
                <h2>No orders yet</h2>
                <p style={{ color: '#888' }}>Start shopping to see your orders here!</p>
                <button onClick={() => navigate('/')} style={styles.shopBtn}>Browse Products</button>
            </div>
        </div>
    );

    return (
        <div style={styles.page}>
            <h1 style={styles.heading}>My Orders</h1>
            <div style={styles.list}>
                {orders.map(order => {
                    const statusInfo = STATUS_COLORS[order.status] || STATUS_COLORS.PENDING;
                    return (
                        <div key={order.id} style={styles.card}>
                            {/* Order Header */}
                            <div style={styles.cardHeader}>
                                <div>
                                    <p style={styles.orderId}>Order #{order.id}</p>
                                    <p style={styles.orderDate}>
                                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                            day: 'numeric', month: 'long', year: 'numeric'
                                        })}
                                    </p>
                                </div>
                                <div style={styles.headerRight}>
                                    <span style={{ ...styles.statusBadge, background: statusInfo.bg, color: statusInfo.color }}>
                                        {statusInfo.label}
                                    </span>
                                    <p style={styles.totalAmt}>₹{Number(order.totalAmount).toLocaleString()}</p>
                                </div>
                            </div>

                            {/* Order Items */}
                            {order.items && order.items.length > 0 && (
                                <div style={styles.itemsList}>
                                    {order.items.map(item => (
                                        <div key={item.id} style={styles.orderItem}>
                                            <span style={styles.itemName}>{item.product?.name || 'Product'}</span>
                                            <span style={styles.itemMeta}>
                                                × {item.quantity} @ ₹{Number(item.price).toLocaleString()}
                                            </span>
                                            <span style={styles.itemSubtotal}>
                                                ₹{(Number(item.price) * item.quantity).toLocaleString()}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Shipping Address */}
                            {order.shippingAddress && (
                                <p style={styles.address}>📍 {order.shippingAddress}</p>
                            )}

                            {/* Cancel button */}
                            {(order.status === 'PENDING' || order.status === 'CONFIRMED') && (
                                <button
                                    onClick={() => handleCancel(order.id)}
                                    disabled={cancellingId === order.id}
                                    style={cancellingId === order.id ? styles.cancellingBtn : styles.cancelBtn}
                                >
                                    {cancellingId === order.id ? 'Cancelling...' : 'Cancel Order'}
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

const styles = {
    page: { padding: '32px', maxWidth: '800px', margin: '0 auto' },
    heading: { fontSize: '26px', fontWeight: '800', color: '#1a1a2e', marginBottom: '24px' },
    list: { display: 'flex', flexDirection: 'column', gap: '16px' },
    card: { background: '#fff', borderRadius: '12px', padding: '24px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.07)', border: '1px solid #f0f0f0' },
    cardHeader: { display: 'flex', justifyContent: 'space-between',
        alignItems: 'flex-start', marginBottom: '16px' },
    orderId: { fontWeight: '700', color: '#1a1a2e', fontSize: '16px', margin: '0 0 4px' },
    orderDate: { color: '#888', fontSize: '13px', margin: 0 },
    headerRight: { textAlign: 'right' },
    statusBadge: { display: 'inline-block', padding: '4px 12px', borderRadius: '20px',
        fontSize: '12px', fontWeight: '700', marginBottom: '6px' },
    totalAmt: { fontWeight: '800', fontSize: '18px', color: '#1a1a2e', margin: 0 },
    itemsList: { borderTop: '1px solid #f0f0f0', paddingTop: '14px', marginBottom: '14px',
        display: 'flex', flexDirection: 'column', gap: '8px' },
    orderItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontSize: '14px' },
    itemName: { fontWeight: '600', color: '#333', flex: 1 },
    itemMeta: { color: '#888', flex: 1, textAlign: 'center' },
    itemSubtotal: { fontWeight: '600', color: '#1a1a2e' },
    address: { fontSize: '13px', color: '#888', borderTop: '1px solid #f0f0f0',
        paddingTop: '12px', margin: '0 0 12px' },
    cancelBtn: { padding: '8px 18px', background: '#fff', border: '1px solid #e94560',
        color: '#e94560', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' },
    cancellingBtn: { padding: '8px 18px', background: '#fff', border: '1px solid #ccc',
        color: '#ccc', borderRadius: '6px', cursor: 'not-allowed', fontWeight: '600', fontSize: '13px' },
    center: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', fontSize: '18px' },
    emptyPage: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' },
    emptyBox: { textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' },
    shopBtn: { padding: '12px 28px', background: '#e94560', color: '#fff', border: 'none',
        borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '15px', marginTop: '8px' },
};

export default OrdersPage;
