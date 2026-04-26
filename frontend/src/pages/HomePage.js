// src/pages/HomePage.js
import { useState, useEffect } from 'react';
import { productService, categoryService } from '../services/api';
import ProductCard from '../components/ProductCard';

function HomePage({ onAddToCart }) {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Load products and categories on page load
    useEffect(() => {
        Promise.all([productService.getAll(), categoryService.getAll()])
            .then(([productsRes, categoriesRes]) => {
                setProducts(productsRes.data);
                setCategories(categoriesRes.data);
                setLoading(false);
            })
            .catch(() => {
                setError('Failed to load products. Make sure the backend is running.');
                setLoading(false);
            });
    }, []);

    // Search handler
    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchKeyword.trim()) {
            productService.getAll().then(res => setProducts(res.data));
            return;
        }
        productService.search(searchKeyword)
            .then(res => setProducts(res.data))
            .catch(() => setError('Search failed'));
    };

    // Category filter
    const handleCategoryFilter = (categoryId) => {
        setSelectedCategory(categoryId);
        setSearchKeyword('');
        if (categoryId === 'all') {
            productService.getAll().then(res => setProducts(res.data));
        } else {
            productService.getByCategory(categoryId).then(res => setProducts(res.data));
        }
    };

    if (loading) return <div style={styles.center}><div style={styles.spinner}>⏳ Loading products...</div></div>;
    if (error) return <div style={styles.center}><div style={styles.error}>{error}</div></div>;

    return (
        <div style={styles.page}>
            {/* Hero Banner */}
            <div style={styles.hero}>
                <h1 style={styles.heroTitle}>Welcome to ShopEase 🛍️</h1>
                <p style={styles.heroSub}>Find the best products at great prices</p>

                {/* Search Bar */}
                <form onSubmit={handleSearch} style={styles.searchForm}>
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        style={styles.searchInput}
                    />
                    <button type="submit" style={styles.searchBtn}>Search</button>
                    {searchKeyword && (
                        <button type="button" style={styles.clearBtn}
                            onClick={() => { setSearchKeyword(''); productService.getAll().then(res => setProducts(res.data)); }}>
                            ✕ Clear
                        </button>
                    )}
                </form>
            </div>

            <div style={styles.main}>
                {/* Category Sidebar */}
                <div style={styles.sidebar}>
                    <h3 style={styles.sidebarTitle}>Categories</h3>
                    <button
                        style={selectedCategory === 'all' ? styles.catBtnActive : styles.catBtn}
                        onClick={() => handleCategoryFilter('all')}
                    >All Products</button>
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            style={selectedCategory === cat.id ? styles.catBtnActive : styles.catBtn}
                            onClick={() => handleCategoryFilter(cat.id)}
                        >{cat.name}</button>
                    ))}
                </div>

                {/* Product Grid */}
                <div style={styles.content}>
                    <p style={styles.resultCount}>{products.length} product{products.length !== 1 ? 's' : ''} found</p>
                    {products.length === 0 ? (
                        <div style={styles.empty}>😕 No products found</div>
                    ) : (
                        <div style={styles.grid}>
                            {products.map(product => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onAddToCart={onAddToCart}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const styles = {
    page: { minHeight: '100vh', background: '#f8f9fa' },
    hero: { background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        padding: '48px 32px', textAlign: 'center' },
    heroTitle: { color: '#fff', fontSize: '36px', fontWeight: '800', margin: '0 0 8px' },
    heroSub: { color: '#aaa', fontSize: '16px', margin: '0 0 24px' },
    searchForm: { display: 'flex', justifyContent: 'center', gap: '8px', maxWidth: '500px', margin: '0 auto' },
    searchInput: { flex: 1, padding: '12px 16px', borderRadius: '8px', border: 'none',
        fontSize: '15px', outline: 'none' },
    searchBtn: { padding: '12px 24px', background: '#e94560', color: '#fff',
        border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '15px' },
    clearBtn: { padding: '12px 16px', background: '#555', color: '#fff',
        border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' },
    main: { display: 'flex', gap: '24px', padding: '24px 32px', maxWidth: '1200px', margin: '0 auto' },
    sidebar: { width: '200px', flexShrink: 0 },
    sidebarTitle: { fontSize: '14px', fontWeight: '700', color: '#888',
        textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' },
    catBtn: { display: 'block', width: '100%', padding: '10px 14px', marginBottom: '6px',
        background: '#fff', border: '1px solid #eee', borderRadius: '8px', cursor: 'pointer',
        textAlign: 'left', fontSize: '14px', color: '#444' },
    catBtnActive: { display: 'block', width: '100%', padding: '10px 14px', marginBottom: '6px',
        background: '#e94560', border: '1px solid #e94560', borderRadius: '8px', cursor: 'pointer',
        textAlign: 'left', fontSize: '14px', color: '#fff', fontWeight: '700' },
    content: { flex: 1 },
    resultCount: { fontSize: '13px', color: '#888', marginBottom: '16px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' },
    empty: { textAlign: 'center', padding: '60px', fontSize: '18px', color: '#888' },
    center: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' },
    spinner: { fontSize: '18px', color: '#888' },
    error: { background: '#fee', color: '#e94560', padding: '20px', borderRadius: '8px',
        border: '1px solid #fcc', fontSize: '15px' },
};

export default HomePage;
