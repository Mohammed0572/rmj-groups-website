/* =========================================
   CONFIGURATION
   ========================================= */

const BACKEND_URL = 'https://rmj-backend-r2jv.onrender.com';

// EmailJS Configuration
const EMAILJS_CONFIG = {
    publicKey: 'vDcpd9HDuIOKsUlGP',
    serviceId: 'service_cwzmjz5',
    signupTemplateId: 'template_nzt64d6',
    resetTemplateId: 'template_p4knsqh'
};

// Local OTP storage (for verification)
let localOtpStore = {};

/* =========================================
   1. UI LOGIC (NAVBAR & SPLASH SCREEN)
   ========================================= */

window.addEventListener('load', () => {
    updateNavbar();
    const intro = document.getElementById('intro');
    if (intro) {
        setTimeout(() => {
            intro.style.transform = 'translateY(-100%)';

            // Show event popup after loading screen
            setTimeout(() => {
                showEventPopup();
            }, 500);
        }, 800); // Reduced from 2500ms to 800ms for faster loading
    }
});

const navbar = document.querySelector('.navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
    });
}

function updateNavbar() {
    const isLoggedIn = localStorage.getItem('rmjUserLoggedIn');
    const loginBtn = document.getElementById('nav-login-btn');
    const logoutBtn = document.getElementById('nav-logout-btn');

    if (loginBtn && logoutBtn) {
        if (isLoggedIn === 'true') {
            loginBtn.style.display = 'none';
            logoutBtn.style.display = 'block';
        } else {
            loginBtn.style.display = 'block';
            logoutBtn.style.display = 'none';
        }
    }
}

/* =========================================
   EVENT POPUP FUNCTIONS
   ========================================= */

function showEventPopup() {
    const popup = document.getElementById('eventPopup');
    if (popup) {
        popup.style.display = 'flex';
        sessionStorage.setItem('eventPopupShown', 'true');
    }
}

function closeEventPopup() {
    const popup = document.getElementById('eventPopup');
    if (popup) {
        popup.style.display = 'none';
    }
}

/* =========================================
   2. AUTHENTICATION SYSTEM (Email OTP)
   ========================================= */

let authMode = 'login';
let otpVerified = false; // Track if OTP has been verified for signup/forgot

function checkLogin(destinationPage) {
    const isLoggedIn = localStorage.getItem('rmjUserLoggedIn');
    if (isLoggedIn === 'true') {
        window.location.href = destinationPage;
    } else {
        localStorage.setItem('redirectAfterLogin', destinationPage);
        openLoginModal();
    }
}

function openLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.style.display = 'flex';
        authMode = 'login';
        otpVerified = false;
        updateModalUI();
    }
}

function closeLogin() {
    const modal = document.getElementById('loginModal');
    if (modal) modal.style.display = 'none';
    otpVerified = false;
}

function logout() {
    localStorage.removeItem('rmjUserLoggedIn');
    localStorage.removeItem('rmjCurrentUser');
    alert("Logged out successfully.");
    location.reload();
}

function toggleAuthMode() {
    authMode = (authMode === 'login') ? 'signup' : 'login';
    otpVerified = false;
    updateModalUI();
}

function toggleForgotMode() {
    authMode = 'forgot';
    otpVerified = false;
    updateModalUI();
}

function updateModalUI() {
    const title = document.getElementById('modalTitle');
    const subtitle = document.getElementById('modalSubtitle');
    const signupFields = document.getElementById('signupFields');
    const passGroup = document.getElementById('passGroup');
    const newPassGroup = document.getElementById('newPassGroup');
    const otpBtnGroup = document.getElementById('otpBtnGroup');
    const otpGroup = document.getElementById('otpGroup');
    const btn = document.getElementById('submitBtn');
    const forgotLink = document.getElementById('forgotLink');
    const toggleText = document.getElementById('toggleText');
    const link = toggleText ? toggleText.nextElementSibling : null;
    const otpBtn = document.getElementById('otpBtn');

    // Reset all fields
    if (signupFields) signupFields.style.display = 'none';
    if (passGroup) passGroup.style.display = 'block';
    if (newPassGroup) newPassGroup.style.display = 'none';
    if (otpBtnGroup) otpBtnGroup.style.display = 'none';
    if (otpGroup) otpGroup.style.display = 'none';
    if (forgotLink) forgotLink.style.display = 'block';
    if (otpBtn) {
        otpBtn.innerText = '📧 Send OTP to Email';
        otpBtn.disabled = false;
    }

    if (authMode === 'signup') {
        if (title) title.innerText = "Create Account";
        if (subtitle) subtitle.innerText = "Join RMJ Groups today";
        if (signupFields) signupFields.style.display = 'block';
        if (otpBtnGroup) otpBtnGroup.style.display = 'block';
        if (passGroup) passGroup.style.display = otpVerified ? 'block' : 'none';
        if (btn) btn.innerText = otpVerified ? "Create Account" : "Verify OTP & Continue";
        if (forgotLink) forgotLink.style.display = 'none';
        if (toggleText) toggleText.innerText = "Already have an account? ";
        if (link) link.innerText = "Login";
    }
    else if (authMode === 'forgot') {
        if (title) title.innerText = "Reset Password";
        if (subtitle) subtitle.innerText = "We'll send you a verification code";
        if (otpBtnGroup) otpBtnGroup.style.display = 'block';
        if (passGroup) passGroup.style.display = 'none';
        if (newPassGroup) newPassGroup.style.display = otpVerified ? 'block' : 'none';
        if (btn) btn.innerText = otpVerified ? "Reset Password" : "Verify OTP & Continue";
        if (forgotLink) forgotLink.style.display = 'none';
        if (toggleText) toggleText.innerText = "Remembered password? ";
        if (link) link.innerText = "Login";
    }
    else { // login
        if (title) title.innerText = "Sign In";
        if (subtitle) subtitle.innerText = "Welcome back to RMJ Groups";
        if (btn) btn.innerText = "Login";
        if (toggleText) toggleText.innerText = "New here? ";
        if (link) link.innerText = "Create Account";
    }
}

// === SEND EMAIL OTP via EmailJS (For Signup & Forgot Password) ===
async function sendEmailOTP() {
    const emailInput = document.getElementById('userEmail');
    const otpBtn = document.getElementById('otpBtn');
    const otpGroup = document.getElementById('otpGroup');

    const email = emailInput.value.trim();

    if (!email || !email.includes('@')) {
        alert("Please enter a valid email address.");
        return;
    }

    otpBtn.innerText = "Sending...";
    otpBtn.disabled = true;

    const purpose = authMode === 'signup' ? 'signup' : 'forgot';
    const purposeText = purpose === 'signup' ? 'Verify Your Email' : 'Reset Your Password';

    // Generate 6-digit OTP locally
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP locally with expiry (10 minutes)
    localOtpStore[email] = {
        otp: otp,
        purpose: purpose,
        expiresAt: Date.now() + 10 * 60 * 1000
    };

    // Choose template based on purpose
    const templateId = purpose === 'signup'
        ? EMAILJS_CONFIG.signupTemplateId
        : EMAILJS_CONFIG.resetTemplateId;

    try {
        // Send email via EmailJS
        await emailjs.send(EMAILJS_CONFIG.serviceId, templateId, {
            to_email: email,
            otp: otp,
            purpose: purposeText
        });

        alert("📧 OTP sent to your email!");
        otpBtn.innerText = "📧 Resend OTP";
        otpBtn.disabled = false;
        otpGroup.style.display = 'block';
        document.getElementById('userOTP').focus();

    } catch (err) {
        // Fallback: Show OTP in alert if email fails
        alert(`📧 Your OTP Code is: ${otp}\n\n(Email delivery issue - use this code)`);
        otpBtn.innerText = "📧 Resend OTP";
        otpBtn.disabled = false;
        otpGroup.style.display = 'block';
        document.getElementById('userOTP').focus();
    }
}

// === VERIFY OTP LOCALLY ===
function verifyLocalOTP(email, otp) {
    const storedData = localOtpStore[email];

    if (!storedData) {
        return { success: false, message: "No OTP found. Please request a new one." };
    }

    if (Date.now() > storedData.expiresAt) {
        delete localOtpStore[email];
        return { success: false, message: "OTP expired. Please request a new one." };
    }

    if (storedData.otp !== otp) {
        return { success: false, message: "Invalid OTP. Please try again." };
    }

    return { success: true, message: "OTP verified!", purpose: storedData.purpose };
}

// === HANDLE AUTH (Login with Password, Signup/Forgot with Local OTP Verification) ===
async function handleAuth(event) {
    event.preventDefault();
    const btn = document.getElementById('submitBtn');
    const originalText = btn.innerText;
    btn.innerText = "Processing...";

    const email = document.getElementById('userEmail').value.trim();
    const password = document.getElementById('userPassword')?.value || '';
    const otp = document.getElementById('userOTP')?.value || '';

    try {
        if (authMode === 'login') {
            // Login with email + password (using backend)
            const response = await fetch(`${BACKEND_URL}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const result = await response.json();

            if (result.success) {
                localStorage.setItem('rmjUserLoggedIn', 'true');
                localStorage.setItem('rmjCurrentUser', JSON.stringify(result.user));
                alert(`Welcome back, ${result.user.name}!`);
                closeLogin();
                const redirect = localStorage.getItem('redirectAfterLogin');
                if (redirect) {
                    localStorage.removeItem('redirectAfterLogin');
                    window.location.href = redirect;
                } else {
                    location.reload();
                }
            } else {
                alert(result.message || "Invalid email or password.");
                btn.innerText = originalText;
            }
        }
        else if (authMode === 'signup') {
            const name = document.getElementById('userName')?.value.trim() || '';

            if (!otp) {
                alert("Please get an OTP first and enter it.");
                btn.innerText = originalText;
                return;
            }

            if (!otpVerified) {
                // Verify OTP locally
                const verifyResult = verifyLocalOTP(email, otp);

                if (verifyResult.success) {
                    otpVerified = true;
                    alert("Email verified! Now set your password.");
                    document.getElementById('passGroup').style.display = 'block';
                    document.getElementById('submitBtn').innerText = "Create Account";
                    document.getElementById('userPassword').focus();
                } else {
                    alert(verifyResult.message);
                }
                btn.innerText = originalText;
                return;
            }

            // OTP already verified, now create account via backend
            if (!name || !password) {
                alert("Please enter your name and password.");
                btn.innerText = originalText;
                return;
            }

            const response = await fetch(`${BACKEND_URL}/api/signup-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, otp })
            });

            const result = await response.json();

            if (result.success) {
                delete localOtpStore[email]; // Clean up local OTP
                alert(`Account created successfully! Welcome, ${name}!`);
                localStorage.setItem('rmjUserLoggedIn', 'true');
                localStorage.setItem('rmjCurrentUser', JSON.stringify({ name, email }));
                closeLogin();
                const redirect = localStorage.getItem('redirectAfterLogin');
                if (redirect) {
                    localStorage.removeItem('redirectAfterLogin');
                    window.location.href = redirect;
                } else {
                    location.reload();
                }
            } else {
                alert(result.message || "Failed to create account.");
                btn.innerText = originalText;
            }
        }
        else if (authMode === 'forgot') {
            const newPassword = document.getElementById('newPassword')?.value || '';

            if (!otp) {
                alert("Please get an OTP first and enter it.");
                btn.innerText = originalText;
                return;
            }

            if (!otpVerified) {
                // Verify OTP locally
                const verifyResult = verifyLocalOTP(email, otp);

                if (verifyResult.success) {
                    otpVerified = true;
                    alert("OTP verified! Now set your new password.");
                    document.getElementById('newPassGroup').style.display = 'block';
                    document.getElementById('submitBtn').innerText = "Reset Password";
                    document.getElementById('newPassword').focus();
                } else {
                    alert(verifyResult.message);
                }
                btn.innerText = originalText;
                return;
            }

            // OTP verified, now reset password via backend
            if (!newPassword) {
                alert("Please enter a new password.");
                btn.innerText = originalText;
                return;
            }

            const response = await fetch(`${BACKEND_URL}/api/reset-password-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp, newPassword })
            });

            const result = await response.json();

            if (result.success) {
                delete localOtpStore[email]; // Clean up local OTP
                alert("Password reset successfully! Please login.");
                authMode = 'login';
                otpVerified = false;
                updateModalUI();
            } else {
                alert(result.message || "Failed to reset password.");
            }
            btn.innerText = originalText;
        }
    } catch (err) {
        alert("Connection Error. Make sure the backend server is running.");
        btn.innerText = originalText;
    }
}

/* =========================================
   2.1 LOCKED CARDS SYSTEM
   ========================================= */

function initLockedCards() {
    const isLoggedIn = localStorage.getItem('rmjUserLoggedIn') === 'true';
    const cards = document.querySelectorAll('.locked-card');

    cards.forEach(card => {
        const overlay = card.querySelector('.card-lock-overlay');
        const destination = card.dataset.destination;

        if (isLoggedIn) {
            // Unlocked - hide overlay and enable click
            if (overlay) overlay.style.display = 'none';
            card.style.cursor = 'pointer';
            card.onclick = () => window.location.href = destination;
        } else {
            // Locked - show overlay and prompt login on click
            if (overlay) overlay.style.display = 'flex';
            card.style.cursor = 'pointer';
            card.onclick = () => {
                localStorage.setItem('redirectAfterLogin', destination);
                openLoginModal();
            };
        }
    });
}

// Initialize locked cards when page loads
document.addEventListener('DOMContentLoaded', initLockedCards);

/* =========================================
   3. CONSTRUCTION PAGE TOOLS
   ========================================= */

function estimate() {
    const areaInput = document.getElementById('areaInput');
    const typeInput = document.getElementById('typeInput');
    const resultBox = document.getElementById('resultBox');
    const amountText = document.getElementById('amountText');
    const breakdownText = document.getElementById('breakdownText');

    if (!areaInput || !typeInput) return;

    const area = parseFloat(areaInput.value);
    const rate = parseFloat(typeInput.value);

    if (!area || area <= 0) {
        alert('Please enter a valid area.');
        return;
    }

    const total = area * rate;

    amountText.textContent = 'Estimated Cost: ₹' + total.toLocaleString('en-IN');
    if (breakdownText) breakdownText.textContent = `Rate: ₹${rate} x ${area} sq.ft`;

    resultBox.style.display = 'block';
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.floor-grid')) {
        filterSelection('all');
    }
});

function filterSelection(c) {
    const cards = document.querySelectorAll('.column');
    const btns = document.querySelectorAll('.floor-filter-btn');

    if (cards.length === 0) return;
    if (c === 'all') c = '';

    btns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.innerText.toLowerCase().includes(c) || (c === '' && btn.innerText === 'All')) {
            btn.classList.add('active');
        }
    });

    cards.forEach(card => {
        w3RemoveClass(card, "show");
        if (card.className.indexOf(c) > -1) w3AddClass(card, "show");
    });
}

function w3AddClass(element, name) {
    var i, arr1, arr2;
    arr1 = element.className.split(" ");
    arr2 = name.split(" ");
    for (i = 0; i < arr2.length; i++) {
        if (arr1.indexOf(arr2[i]) == -1) { element.className += " " + arr2[i]; }
    }
}

function w3RemoveClass(element, name) {
    var i, arr1, arr2;
    arr1 = element.className.split(" ");
    arr2 = name.split(" ");
    for (i = 0; i < arr2.length; i++) {
        while (arr1.indexOf(arr2[i]) > -1) {
            arr1.splice(arr1.indexOf(arr2[i]), 1);
        }
    }
    element.className = arr1.join(" ");
}

const styleSheet = document.createElement("style");
styleSheet.innerText = `
    .column { display: none; }
    .show { display: block; animation: fadeIn 0.5s; }
    @keyframes fadeIn { from { opacity:0; transform: translateY(10px); } to { opacity:1; transform: translateY(0); } }
`;
document.head.appendChild(styleSheet);

window.onclick = function (event) {
    const modal = document.getElementById('loginModal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

/* =========================================
   4. SCROLL-TRIGGERED ANIMATIONS (All Pages)
   ========================================= */

// Initialize scroll animations after page loads
window.addEventListener('load', () => {
    // Wait for intro animation to finish (matches the 800ms delay in intro)
    setTimeout(initScrollAnimations, 1000);
});

function initScrollAnimations() {
    // Select elements to animate on ALL pages
    const elementsToAnimate = [
        // Home page
        '.hero-text',
        '.hero-container h1',
        '.hero-container p',
        '.cards-wrapper .card',
        // Common elements across all pages
        '.content-section h1',
        '.content-section h2',
        '.content-section h3',
        '.content-section p',
        '.content-section ul',
        // About page
        '.about-hero',
        '.about-hero h1',
        '.about-hero p',
        '.team-card',
        '.team-grid',
        '.section-divider',
        '.team-section h2',
        // Digital marketing page
        '.benefit-card',
        '.service-row',
        '.service-text',
        '.cta-box',
        // Sports & Events page
        '.event-card',
        '.sport-card',
        // Construction page
        '.project-card',
        '.floor-card',
        '.column',
        // Real Estate page
        '.property-card',
        '.listing-card',
        // Social Media page
        '.platform-card',
        '.social-feature',
        // Footer sections
        '.footer-section',
        '.glass-footer',
        '.modern-footer'
    ];

    // Add scroll-animate class to all matching elements
    elementsToAnimate.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            // Don't add to elements that already have it
            if (!el.classList.contains('scroll-animate')) {
                el.classList.add('scroll-animate');
            }
        });
    });

    // Create Intersection Observer for scroll animations
    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px 0px -50px 0px', // Trigger slightly before element enters
        threshold: 0.1 // Trigger when 10% visible
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add animation class when element enters viewport
                entry.target.classList.add('animate-in');
                // Stop observing - element stays visible permanently
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all scroll-animate elements
    const animatedElements = document.querySelectorAll('.scroll-animate');
    animatedElements.forEach(el => {
        scrollObserver.observe(el);
    });

    // Manually trigger for elements already in viewport on load
    setTimeout(() => {
        animatedElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;
            if (rect.top < windowHeight && rect.bottom >= 0) {
                el.classList.add('animate-in');
            }
        });
    }, 100);
}