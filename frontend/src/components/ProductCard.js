// src/components/ProductCard.js
import { Link } from 'react-router-dom';

function ProductCard({ product, onAddToCart }) {
    return (
        <div style={styles.card}>
            <div style={styles.imageBox}>
                {product.imageUrl
                    ? <img src={product.imageUrl} alt={product.name} style={styles.image} />
                    : <div style={styles.placeholder}>📦</div>
                }
            </div>
            <div style={styles.body}>
                <p style={styles.category}>{product.category?.name || 'Uncategorized'}</p>
                <h3 style={styles.name}>{product.name}</h3>
                <p style={styles.desc}>{product.description?.slice(0, 60)}...</p>
                <div style={styles.footer}>
                    <span style={styles.price}>₹{Number(product.price).toLocaleString()}</span>
                    <span style={product.stockQuantity > 0 ? styles.inStock : styles.outStock}>
                        {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Out of stock'}
                    </span>
                </div>
                <div style={styles.actions}>
                    <Link to={`/products/${product.id}`} style={styles.detailBtn}>View Details</Link>
                    <button
                        onClick={() => onAddToCart(product)}
                        disabled={product.stockQuantity === 0}
                        style={product.stockQuantity > 0 ? styles.addBtn : styles.disabledBtn}
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
}

const styles = {
    card: { background: '#fff', borderRadius: '10px', overflow: 'hidden',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)', transition: 'transform 0.2s',
        display: 'flex', flexDirection: 'column' },
    imageBox: { height: '180px', background: '#f5f5f5', display: 'flex',
        alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
    image: { width: '100%', height: '100%', objectFit: 'cover' },
    placeholder: { fontSize: '60px' },
    body: { padding: '16px', display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 },
    category: { fontSize: '11px', color: '#e94560', textTransform: 'uppercase',
        letterSpacing: '1px', fontWeight: '600', margin: 0 },
    name: { fontSize: '16px', fontWeight: '700', color: '#1a1a2e', margin: 0 },
    desc: { fontSize: '13px', color: '#888', margin: 0, lineHeight: '1.5' },
    footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' },
    price: { fontSize: '18px', fontWeight: '700', color: '#1a1a2e' },
    inStock: { fontSize: '12px', color: '#22c55e', fontWeight: '600' },
    outStock: { fontSize: '12px', color: '#ef4444', fontWeight: '600' },
    actions: { display: 'flex', gap: '8px', marginTop: '10px' },
    detailBtn: { flex: 1, padding: '8px', textAlign: 'center', border: '1px solid #e94560',
        color: '#e94560', borderRadius: '6px', textDecoration: 'none', fontSize: '13px', fontWeight: '600' },
    addBtn: { flex: 1, padding: '8px', background: '#e94560', color: '#fff',
        border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' },
    disabledBtn: { flex: 1, padding: '8px', background: '#ccc', color: '#fff',
        border: 'none', borderRadius: '6px', cursor: 'not-allowed', fontSize: '13px' },
};

export default ProductCard;
