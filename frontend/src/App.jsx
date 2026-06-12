import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';
import Home from './pages/Home';

// Placeholder for other pages
const PlaceholderPage = ({ title }) => (
    <div className="section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h2 className="section-title">{title}</h2>
    </div>
);

function App() {
    const [isLoginOpen, setIsLoginOpen] = useState(false);

    return (
        <Router>
            <Navbar onOpenLogin={() => setIsLoginOpen(true)} />
            <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/digital-marketing" element={<PlaceholderPage title="Digital Marketing" />} />
                <Route path="/sports-event" element={<PlaceholderPage title="Sports & Event" />} />
                <Route path="/construction" element={<PlaceholderPage title="Construction" />} />
                <Route path="/real-estate" element={<PlaceholderPage title="Real Estate" />} />
                <Route path="/social-media" element={<PlaceholderPage title="Social Media" />} />
                <Route path="/about-us" element={<PlaceholderPage title="About Us" />} />
            </Routes>
            <Footer />
        </Router>
    );
}

export default App;
