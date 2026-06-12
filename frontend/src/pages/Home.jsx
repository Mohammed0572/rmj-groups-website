import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <main>
            {/* ============ HERO SECTION ============ */}
            <section className="hero-container">
                <div className="hero-text">
                    <span className="section-label">Welcome to RMJ Groups</span>
                    <h2>Grand Vision,<br/><span className="gold-text">Global Reach</span></h2>
                    <p>Excellence in Construction, Digital Innovation, Real Estate, Sports Events & Social Media.</p>
                    <a href="#services" className="hero-cta">
                        Explore Our Services <i className="fa-solid fa-arrow-right"></i>
                    </a>
                </div>
                <div className="scroll-indicator">
                    <span>Scroll</span>
                    <i className="fa-solid fa-chevron-down"></i>
                </div>
            </section>

            {/* ============ SERVICES ============ */}
            <section className="section section--alt" id="services">
                <div className="text-center">
                    <span className="section-label">What We Do</span>
                    <h2 className="section-title">Our Services</h2>
                    <p className="section-subtitle">A diversified portfolio of businesses built on trust, innovation, and excellence.</p>
                </div>

                <div className="cards-wrapper">
                    {/* 1. Digital Marketing */}
                    <Link to="/digital-marketing" className="card">
                        <div className="card-bg-color" style={{ background: "url('/assets/images/digital-bg.jpg') center/cover" }}></div>
                        <div className="card-content">
                            <h3>RMJ Digital</h3>
                            <p>Marketing</p>
                        </div>
                    </Link>

                    {/* 2. Sports & Event */}
                    <Link to="/sports-event" className="card">
                        <div className="card-bg-color" style={{ background: "url('/assets/images/sports-event-bg.jpg') center/cover" }}></div>
                        <div className="card-content">
                            <h3>Sports & Event</h3>
                            <p>Management</p>
                        </div>
                    </Link>

                    {/* 3. Construction */}
                    <Link to="/construction" className="card">
                        <div className="card-bg-color" style={{ background: "url('/assets/images/construction-bg.jpg') center/cover" }}></div>
                        <div className="card-content">
                            <h3>RMJ Construction</h3>
                            <p>Development</p>
                        </div>
                    </Link>

                    {/* 4. Real Estate */}
                    <Link to="/real-estate" className="card">
                        <div className="card-bg-color" style={{ background: "url('/assets/images/realestate-bg.jpg') center/cover" }}></div>
                        <div className="card-content">
                            <h3>Real Estate</h3>
                            <p>Properties</p>
                        </div>
                    </Link>

                    {/* 5. Social Media */}
                    <Link to="/social-media" className="card">
                        <div className="card-bg-color" style={{ background: "url('/assets/images/social-bg.png') center/cover" }}></div>
                        <div className="card-content">
                            <h3>Social Media</h3>
                            <p>Branding & Growth</p>
                        </div>
                    </Link>
                </div>
            </section>

            {/* ============ STATS ============ */}
            <section className="section">
                <div className="stats-bar">
                    <div className="stat-item">
                        <h3>100+</h3>
                        <p>Homes Built</p>
                    </div>
                    <div className="stat-item">
                        <h3>500+</h3>
                        <p>Events Managed</p>
                    </div>
                    <div className="stat-item">
                        <h3>200+</h3>
                        <p>Clients Served</p>
                    </div>
                    <div className="stat-item">
                        <h3>98%</h3>
                        <p>Satisfaction Rate</p>
                    </div>
                </div>
            </section>

            {/* ============ WHY US ============ */}
            <section className="section section--alt">
                <div className="text-center">
                    <span className="section-label">Why Choose Us</span>
                    <h2 className="section-title">Built on Trust & Excellence</h2>
                    <p className="section-subtitle">Three pillars that define every project we deliver.</p>
                </div>

                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon"><i className="fa-solid fa-award"></i></div>
                        <h3>Proven Experience</h3>
                        <p>Years of expertise across construction, digital marketing, real estate, and event management — delivering results that matter.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon"><i className="fa-solid fa-lightbulb"></i></div>
                        <h3>Innovation First</h3>
                        <p>We leverage technology and modern strategies to bring creative, efficient solutions to every business challenge.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon"><i className="fa-solid fa-handshake"></i></div>
                        <h3>Client-Centric</h3>
                        <p>Transparent communication, on-time delivery, and personalized service — because your success is our reputation.</p>
                    </div>
                </div>
            </section>

            {/* ============ CTA ============ */}
            <section className="cta-section">
                <span className="section-label">Get Started</span>
                <h2 className="section-title">Ready to Build<br/>Your <span className="gold-text">Vision</span>?</h2>
                <p className="section-subtitle">Let's discuss your next project. Reach out to us today.</p>
                <div className="cta-buttons">
                    <a href="https://wa.me/917338445987" target="_blank" className="cta-button">
                        <i className="fa-brands fa-whatsapp"></i> Chat on WhatsApp
                    </a>
                    <a href="mailto:rohithmj@rmjgroups.in" className="cta-button cta-button--outline">
                        <i className="fa-regular fa-envelope"></i> Email Us
                    </a>
                </div>
            </section>
        </main>
    );
}
