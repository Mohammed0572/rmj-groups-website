import { Link } from 'react-router-dom';

export default function Navbar({ onOpenLogin }) {
    return (
        <header className="navbar" id="mainNavbar">
            <Link to="/" className="logo-link">
                <img src="/assets/images/rmj-main-logo.jpg" alt="RMJ Logo" className="nav-logo-img" />
            </Link>
            <button className="menu-toggle" id="menuToggle" aria-label="Toggle navigation">
                <span></span>
                <span></span>
                <span></span>
            </button>
            <nav>
                <ul className="nav-links" id="navLinks">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/digital-marketing">Digital</Link></li>
                    <li><Link to="/sports-event">Sports & Event</Link></li>
                    <li><Link to="/construction">Construction</Link></li>
                    <li><Link to="/real-estate">Real Estate</Link></li>
                    <li><Link to="/social-media">Social Media</Link></li>
                    <li><Link to="/about-us">About Us</Link></li>
                    <li>
                        <button onClick={onOpenLogin} style={{ background: 'none', border: 'none', color: "var(--gold)", cursor: 'pointer', fontSize: '1rem', fontWeight: 600 }}>Login</button>
                    </li>
                </ul>
            </nav>
        </header>
    );
}
