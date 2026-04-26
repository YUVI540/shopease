// src/pages/ProductDetailPage.js
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../services/api';

function ProductDetailPage({ onAddToCart }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [added, setAdded] = useState(false);

    useEffect(() => {
        productService.getById(id)
            .then(res => { setProduct(res.data); setLoading(false); })
            .catch(() => { navigate('/'); });
    }, [id, navigate]);

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) onAddToCart(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    if (loading) return <div style={styles.center}>⏳ Loading...</div>;
    if (!product) return null;

    return (
        <div style={styles.page}>
            <button onClick={() => navigate(-1)} style={styles.backBtn}>← Back</button>
            <div style={styles.container}>
                {/* Image */}
                <div style={styles.imageBox}>
                    {product.imageUrl
                        ? <img src={product.imageUrl} alt={product.name} style={styles.image} />
                        : <div style={styles.placeholder}>📦</div>
                    }
                </div>

                {/* Details */}
                <div style={styles.details}>
                    <p style={styles.category}>{product.category?.name || 'Uncategorized'}</p>
                    <h1 style={styles.name}>{product.name}</h1>
                    <p style={styles.description}>{product.description}</p>

                    <div style={styles.priceRow}>
                        <span style={styles.price}>₹{Number(product.price).toLocaleString()}</span>
                        <span style={product.stockQuantity > 0 ? styles.inStock : styles.outStock}>
                            {product.stockQuantity > 0
                                ? `✅ ${product.stockQuantity} in stock`
                                : '❌ Out of stock'}
                        </span>
                    </div>

                    {product.stockQuantity > 0 && (
                        <div style={styles.qtyRow}>
                            <label style={styles.qtyLabel}>Quantity:</label>
                            <div style={styles.qtyControl}>
                                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} style={styles.qtyBtn}>−</button>
                                <span style={styles.qtyNum}>{quantity}</span>
                                <button onClick={() => setQuantity(q => Math.min(product.stockQuantity, q + 1))} style={styles.qtyBtn}>+</button>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={handleAddToCart}
                        disabled={product.stockQuantity === 0}
                        style={product.stockQuantity > 0 ? (added ? styles.addedBtn : styles.addBtn) : styles.disabledBtn}
                    >
                        {added ? '✅ Added to Cart!' : '🛒 Add to Cart'}
                    </button>
                </div>
            </div>
        </div>
    );
}

const styles = {
    page: { padding: '24px 32px', maxWidth: '900px', margin: '0 auto' },
    backBtn: { background: 'none', border: 'none', color: '#e94560', cursor: 'pointer',
        fontSize: '15px', fontWeight: '600', marginBottom: '20px', padding: 0 },
    container: { display: 'flex', gap: '40px', background: '#fff',
        borderRadius: '12px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' },
    imageBox: { width: '320px', height: '320px', flexShrink: 0, background: '#f5f5f5',
        borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
    image: { width: '100%', height: '100%', objectFit: 'cover' },
    placeholder: { fontSize: '80px' },
    details: { flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' },
    category: { fontSize: '12px', color: '#e94560', textTransform: 'uppercase',
        letterSpacing: '1px', fontWeight: '700', margin: 0 },
    name: { fontSize: '28px', fontWeight: '800', color: '#1a1a2e', margin: 0 },
    description: { fontSize: '15px', color: '#666', lineHeight: '1.7', margin: 0 },
    priceRow: { display: 'flex', alignItems: 'center', gap: '20px', marginTop: '8px' },
    price: { fontSize: '30px', fontWeight: '800', color: '#1a1a2e' },
    inStock: { fontSize: '14px', color: '#22c55e', fontWeight: '600' },
    outStock: { fontSize: '14px', color: '#ef4444', fontWeight: '600' },
    qtyRow: { display: 'flex', alignItems: 'center', gap: '16px' },
    qtyLabel: { fontSize: '15px', fontWeight: '600', color: '#444' },
    qtyControl: { display: 'flex', alignItems: 'center', gap: '12px' },
    qtyBtn: { width: '32px', height: '32px', background: '#f0f0f0', border: 'none',
        borderRadius: '6px', cursor: 'pointer', fontSize: '18px', fontWeight: '700' },
    qtyNum: { fontSize: '18px', fontWeight: '700', minWidth: '24px', textAlign: 'center' },
    addBtn: { padding: '14px 28px', background: '#e94560', color: '#fff', border: 'none',
        borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: '700', marginTop: '8px' },
    addedBtn: { padding: '14px 28px', background: '#22c55e', color: '#fff', border: 'none',
        borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: '700', marginTop: '8px' },
    disabledBtn: { padding: '14px 28px', background: '#ccc', color: '#fff', border: 'none',
        borderRadius: '8px', cursor: 'not-allowed', fontSize: '16px', marginTop: '8px' },
    center: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', fontSize: '18px' },
};

export default ProductDetailPage;
