// src/pages/RegisterPage.js
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { userService } from '../services/api';

function RegisterPage({ onLogin }) {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        if (form.password !== form.confirmPassword) {
            setError('Passwords do not match'); return;
        }
        if (form.password.length < 6) {
            setError('Password must be at least 6 characters'); return;
        }
        setLoading(true);
        userService.register({ name: form.name, email: form.email, password: form.password })
            .then(() => {
                // Auto-login after register
                return userService.login(form.email, form.password);
            })
            .then(res => {
                onLogin(res.data);
                navigate('/');
            })
            .catch(err => {
                setError(err.response?.data?.message || 'Registration failed. Try again.');
            })
            .finally(() => setLoading(false));
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <h2 style={styles.title}>Create Account 🎉</h2>
                <p style={styles.sub}>Join ShopEase today — it's free!</p>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.field}>
                        <label style={styles.label}>Full Name</label>
                        <input name="name" type="text" value={form.name}
                            onChange={handleChange} required placeholder="Yuvraj Ghatekari" style={styles.input} />
                    </div>
                    <div style={styles.field}>
                        <label style={styles.label}>Email</label>
                        <input name="email" type="email" value={form.email}
                            onChange={handleChange} required placeholder="you@example.com" style={styles.input} />
                    </div>
                    <div style={styles.field}>
                        <label style={styles.label}>Password</label>
                        <input name="password" type="password" value={form.password}
                            onChange={handleChange} required placeholder="Min 6 characters" style={styles.input} />
                    </div>
                    <div style={styles.field}>
                        <label style={styles.label}>Confirm Password</label>
                        <input name="confirmPassword" type="password" value={form.confirmPassword}
                            onChange={handleChange} required placeholder="Repeat password" style={styles.input} />
                    </div>
                    {error && <p style={styles.error}>{error}</p>}
                    <button type="submit" disabled={loading} style={loading ? styles.disabledBtn : styles.btn}>
                        {loading ? '⏳ Creating account...' : 'Create Account'}
                    </button>
                </form>

                <p style={styles.footer}>
                    Already have an account? <Link to="/login" style={styles.link}>Login here</Link>
                </p>
            </div>
        </div>
    );
}

const styles = {
    page: { display: 'flex', justifyContent: 'center', alignItems: 'center',
        minHeight: '80vh', background: '#f8f9fa', padding: '20px' },
    card: { background: '#fff', padding: '40px', borderRadius: '14px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)', width: '100%', maxWidth: '400px' },
    title: { fontSize: '26px', fontWeight: '800', color: '#1a1a2e', margin: '0 0 6px' },
    sub: { color: '#888', margin: '0 0 28px', fontSize: '14px' },
    form: { display: 'flex', flexDirection: 'column', gap: '16px' },
    field: { display: 'flex', flexDirection: 'column', gap: '6px' },
    label: { fontSize: '13px', fontWeight: '600', color: '#444' },
    input: { padding: '12px 14px', border: '1px solid #ddd', borderRadius: '8px',
        fontSize: '15px', outline: 'none' },
    error: { color: '#e94560', fontSize: '13px', margin: 0,
        background: '#fff5f5', padding: '10px', borderRadius: '6px' },
    btn: { padding: '13px', background: '#e94560', color: '#fff', border: 'none',
        borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '16px', marginTop: '4px' },
    disabledBtn: { padding: '13px', background: '#ccc', color: '#fff', border: 'none',
        borderRadius: '8px', cursor: 'not-allowed', fontWeight: '700', fontSize: '16px', marginTop: '4px' },
    footer: { textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#666' },
    link: { color: '#e94560', fontWeight: '600', textDecoration: 'none' },
};

export default RegisterPage;
