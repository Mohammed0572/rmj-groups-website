import { useState } from 'react';
import axios from 'axios';

export default function LoginModal({ isOpen, onClose }) {
    const [mode, setMode] = useState('login'); // 'login', 'signup'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSendOtp = async () => {
        if (!email) return alert("Please enter your email first");
        setLoading(true);
        try {
            await axios.post('/api/auth/generate-otp', { email });
            alert('OTP generated! Please check the backend server console (mock email).');
            setOtpSent(true);
        } catch (error) {
            alert(error.response?.data?.message || 'Error generating OTP');
        }
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (mode === 'login') {
                const res = await axios.post('/api/auth/login', { email, password });
                alert(`Welcome back, ${res.data.user.name}!`);
                onClose();
            } else {
                if (!otpSent) return alert("Please generate and verify OTP first");
                const res = await axios.post('/api/auth/signup', { name, email, password });
                alert(`Account created successfully! Welcome, ${res.data.user.name}!`);
                onClose();
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Authentication failed');
        }
        setLoading(false);
    };

    return (
        <div className="modal-overlay" style={{ display: 'flex' }} onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <span className="close-modal" onClick={onClose}>&times;</span>
                <h2 className="gold-text">{mode === 'login' ? 'Sign In' : 'Create Account'}</h2>
                <p>{mode === 'login' ? 'Welcome back to RMJ Groups' : 'Join RMJ Groups today'}</p>

                <form onSubmit={handleSubmit}>
                    {mode === 'signup' && (
                        <div className="input-group">
                            <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required />
                        </div>
                    )}
                    
                    <div className="input-group">
                        <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>

                    {mode === 'signup' && !otpSent && (
                        <button type="button" onClick={handleSendOtp} className="cta-button cta-button--outline" style={{ width: '100%', marginBottom: 15 }} disabled={loading}>
                            {loading ? 'Sending...' : '📧 Send OTP to Email'}
                        </button>
                    )}

                    {mode === 'signup' && otpSent && (
                        <div className="input-group">
                            <input type="text" placeholder="Enter 6-digit OTP (check server console)" value={otp} onChange={e => setOtp(e.target.value)} required style={{ textAlign: 'center', letterSpacing: '2px' }} />
                        </div>
                    )}

                    <div className="input-group">
                        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
                    </div>

                    <button type="submit" className="cta-button" style={{ width: '100%' }} disabled={loading}>
                        {loading ? 'Processing...' : (mode === 'login' ? 'Login' : 'Create Account')}
                    </button>
                </form>

                <div style={{ marginTop: '20px', fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between' }}>
                    <a href="#" style={{ color: 'var(--text-muted)' }}>Forgot Password?</a>
                    <span>
                        <span style={{ color: 'black' }}>{mode === 'login' ? 'New here? ' : 'Already have an account? '}</span>
                        <a href="#" onClick={(e) => { e.preventDefault(); setMode(mode === 'login' ? 'signup' : 'login'); }} style={{ color: 'var(--gold)', fontWeight: 600 }}>
                            {mode === 'login' ? 'Create Account' : 'Sign In'}
                        </a>
                    </span>
                </div>
            </div>
        </div>
    );
}
