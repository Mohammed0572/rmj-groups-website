import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="modern-footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h3 className="gold-text">RMJ Groups</h3>
                    <p>Your trusted partner for Digital Marketing, Sports Events, Construction, Real Estate, and Social Media solutions.</p>
                    <div className="social-links">
                        <a href="https://wa.me/917338445987" target="_blank" title="WhatsApp">
                            <i className="fa-brands fa-whatsapp"></i>
                        </a>
                        <a href="https://www.instagram.com/rmj_groups" target="_blank" title="Instagram">
                            <i className="fa-brands fa-instagram"></i>
                        </a>
                        <a href="#" target="_blank" title="Facebook">
                            <i className="fa-brands fa-facebook"></i>
                        </a>
                        <a href="https://www.linkedin.com/in/rmj-groups" target="_blank" title="LinkedIn">
                            <i className="fa-brands fa-linkedin-in"></i>
                        </a>
                    </div>
                </div>
                <div className="footer-section">
                    <h4>Quick Links</h4>
                    <ul className="footer-links">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/digital-marketing">Digital Marketing</Link></li>
                        <li><Link to="/sports-event">Sports & Events</Link></li>
                        <li><Link to="/construction">Construction</Link></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h4>Contact Us</h4>
                    <p>📧 rohithmj@rmjgroups.in</p>
                    <p>📱 +91 733 844 5987</p>
                    <p>📍 Bengaluru, Karnataka</p>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2026 RMJ Groups. All Rights Reserved.</p>
                <p className="footer-tagline">Building Excellence, Creating Opportunities</p>
            </div>
            
            <a href="https://wa.me/917338445987" className="float-whatsapp" target="_blank">
                <i className="fa-brands fa-whatsapp"></i>
            </a>
        </footer>
    );
}
