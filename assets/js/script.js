/* =========================================
   CONFIGURATION (PASTE YOUR URL HERE)
   ========================================= */

const BACKEND_URL = 'https://shaky-mice-stop.loca.lt'; 

/* =========================================
   1. UI LOGIC (NAVBAR & SPLASH SCREEN)
   ========================================= */

window.addEventListener('load', () => {
    updateNavbar(); 
    const intro = document.getElementById('intro');
    if (intro) {
        setTimeout(() => {
            intro.style.transform = 'translateY(-100%)';
        }, 2500);
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
   2. AUTHENTICATION SYSTEM
   ========================================= */

let authMode = 'login'; 

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
        updateModalUI();
    }
}

function closeLogin() {
    const modal = document.getElementById('loginModal');
    if (modal) modal.style.display = 'none';
}

function logout() {
    localStorage.removeItem('rmjUserLoggedIn');
    alert("Logged out successfully.");
    location.reload();
}

function toggleAuthMode() {
    authMode = (authMode === 'login') ? 'signup' : 'login';
    updateModalUI();
}

function toggleForgotMode() {
    authMode = 'forgot';
    updateModalUI();
}

function updateModalUI() {
    const title = document.getElementById('modalTitle');
    const signupFields = document.getElementById('signupFields');
    const passGroup = document.getElementById('passGroup');
    const newPassGroup = document.getElementById('newPassGroup');
    const btn = document.getElementById('submitBtn');
    const forgotLink = document.getElementById('forgotLink');
    const toggleText = document.getElementById('toggleText');
    const link = toggleText.nextElementSibling;
    const userName = document.getElementById('userName');

    signupFields.style.display = 'none';
    passGroup.style.display = 'block';
    newPassGroup.style.display = 'none';
    forgotLink.style.display = 'block';
    userName.style.display = 'block'; 

    if (authMode === 'signup') {
        title.innerText = "Create Account";
        signupFields.style.display = 'block'; 
        passGroup.style.display = 'block';
        btn.innerText = "Verify & Sign Up";
        forgotLink.style.display = 'none';
        toggleText.innerText = "Already have an account? ";
        link.innerText = "Login";
    } 
    else if (authMode === 'forgot') {
        title.innerText = "Reset Password";
        signupFields.style.display = 'block'; 
        userName.style.display = 'none'; 
        passGroup.style.display = 'none'; 
        newPassGroup.style.display = 'block'; 
        btn.innerText = "Reset Password";
        forgotLink.style.display = 'none';
        toggleText.innerText = "Remembered password? ";
        link.innerText = "Login";
    } 
    else {
        title.innerText = "Sign In";
        btn.innerText = "Login";
        toggleText.innerText = "New here? ";
        link.innerText = "Create Account";
    }
}

// === SEND OTP (Uses BACKEND_URL) ===
async function sendOTP() {
    const phoneInput = document.getElementById('userPhone');
    const emailInput = document.getElementById('userEmail');
    const otpBtn = document.getElementById('otpBtn');
    const otpGroup = document.getElementById('otpGroup');
    
    let phone = phoneInput.value;

    if (authMode === 'forgot') {
        if (!emailInput.value) return alert("Please enter your registered Email first.");
        
        otpBtn.innerText = "Finding...";
        try {
            // Using the Variable here
            const res = await fetch(`${BACKEND_URL}/api/get-phone`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: emailInput.value })
            });
            const data = await res.json();
            
            if (!data.success) {
                otpBtn.innerText = "Get OTP";
                return alert(data.message);
            }
            phone = data.phone;
            phoneInput.value = phone;
            alert("Found registered number: " + phone);
        } catch (e) {
            otpBtn.innerText = "Get OTP";
            return alert("Connection Error: Check URL in script.js");
        }
    }

    if (!phone || phone.length < 10) {
        alert("Please enter a valid WhatsApp number.");
        return;
    }

    otpBtn.innerText = "Sending...";
    otpBtn.disabled = true;

    try {
        // Using the Variable here
        const response = await fetch(`${BACKEND_URL}/api/send-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone })
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert(result.message); 
            otpBtn.innerText = "Resend";
            otpBtn.disabled = false;
            otpGroup.style.display = 'block';
            document.getElementById('userOTP').focus();
        } else {
            alert(result.message);
            otpBtn.innerText = "Get OTP";
            otpBtn.disabled = false;
        }
    } catch (err) {
        console.error(err);
        alert("Connection Error. Did you update the BACKEND_URL?");
        otpBtn.innerText = "Get OTP";
        otpBtn.disabled = false;
    }
}

// === HANDLE AUTH (Uses BACKEND_URL) ===
async function handleAuth(event) {
    event.preventDefault();
    const btn = document.getElementById('submitBtn');
    const originalText = btn.innerText;
    btn.innerText = "Processing...";

    const email = document.getElementById('userEmail').value;
    const password = document.getElementById('userPassword').value;
    const name = document.getElementById('userName').value;
    const phone = document.getElementById('userPhone').value;
    const otp = document.getElementById('userOTP').value;
    const newPass = document.getElementById('newPassword').value;

    let endpoint = '', data = {};

    if (authMode === 'login') {
        endpoint = '/api/login';
        data = { email, password };
    } 
    else if (authMode === 'signup') {
        if (!otp) { alert("Please enter OTP"); btn.innerText = originalText; return; }
        endpoint = '/api/signup';
        data = { name, email, phone, password, otp };

        const fsData = new FormData();
        fsData.append('name', name);
        fsData.append('email', email);
        fsData.append('phone', phone);
        fsData.append('Subject', 'New Secured User Signup');
        fetch('https://formspree.io/f/xovyawpo', { method: 'POST', body: fsData, headers: {'Accept':'application/json'} })
            .catch(e => console.log("Email skipped"));
    } 
    else if (authMode === 'forgot') {
        if (!otp || !newPass) { alert("Please enter OTP and New Password"); btn.innerText = originalText; return; }
        endpoint = '/api/reset-password';
        data = { email, otp, newPassword: newPass };
    }

    try {
        // Using the Variable here
        const res = await fetch(`${BACKEND_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await res.json();

        if (result.success) {
            alert(result.message);
            
            if (authMode === 'forgot') {
                toggleAuthMode();
            } else {
                localStorage.setItem('rmjUserLoggedIn', 'true');
                window.location.href = localStorage.getItem('redirectAfterLogin') || 'index.html';
            }
        } else {
            alert(result.message);
            btn.innerText = originalText;
        }
    } catch (e) {
        console.error(e);
        alert("Connection Error. Check URL in script.js");
        btn.innerText = originalText;
    }
}

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
        if (arr1.indexOf(arr2[i]) == -1) {element.className += " " + arr2[i];}
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

window.onclick = function(event) {
    const modal = document.getElementById('loginModal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}