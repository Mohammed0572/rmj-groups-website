/* =========================================
   SIMPLIFIED AUTHENTICATION SYSTEM
   Email-based with Random OTP
   ========================================= */

let authMode = 'login';

// === SEND EMAIL OTP (Generates Random 6-Digit Code) ===
function sendEmailOTP() {
    const emailInput = document.getElementById('signupEmail');
    const otpBtn = document.getElementById('otpBtn');
    const otpGroup = document.getElementById('otpGroup');

    const email = emailInput.value;

    if (!email || !email.includes('@')) {
        alert("Please enter a valid email address.");
        return;
    }

    otpBtn.innerText = "Generating...";
    otpBtn.disabled = true;

    // Generate random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP in sessionStorage
    sessionStorage.setItem('signupOTP', otp);
    sessionStorage.setItem('signupEmail', email);

    // Simulate sending delay
    setTimeout(() => {
        alert(`Your verification code is: ${otp}\n\n(In production, this would be sent to your email)`);
        otpBtn.innerText = "Resend OTP";
        otpBtn.disabled = false;
        otpGroup.style.display = 'block';
        document.getElementById('userOTP').focus();
    }, 500);
}

// === HANDLE AUTH (Simplified - Local Storage) ===
async function handleAuth(event) {
    event.preventDefault();
    const btn = document.getElementById('submitBtn');
    const originalText = btn.innerText;
    btn.innerText = "Processing...";

    const email = document.getElementById('userEmail').value;
    const password = document.getElementById('userPassword').value;

    if (authMode === 'login') {
        // Simple login - check if user exists in localStorage
        const users = JSON.parse(localStorage.getItem('rmjUsers') || '[]');
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            localStorage.setItem('rmjUserLoggedIn', 'true');
            localStorage.setItem('rmjCurrentUser', JSON.stringify(user));
            alert(`Welcome back, ${user.name}!`);
            window.location.href = localStorage.getItem('redirectAfterLogin') || 'index.html';
        } else {
            alert("Invalid email or password.");
            btn.innerText = originalText;
        }
    }
    else if (authMode === 'signup') {
        const name = document.getElementById('userName').value;
        const otp = document.getElementById('userOTP').value;
        const signupEmailInput = document.getElementById('signupEmail').value;

        if (!otp) {
            alert("Please enter the OTP sent to your email.");
            btn.innerText = originalText;
            return;
        }

        // Validate OTP
        const storedOTP = sessionStorage.getItem('signupOTP');
        const storedEmail = sessionStorage.getItem('signupEmail');

        if (otp !== storedOTP || signupEmailInput !== storedEmail) {
            alert("Invalid OTP. Please try again.");
            btn.innerText = originalText;
            return;
        }

        // Check if user already exists
        const users = JSON.parse(localStorage.getItem('rmjUsers') || '[]');
        if (users.find(u => u.email === signupEmailInput)) {
            alert("An account with this email already exists.");
            btn.innerText = originalText;
            return;
        }

        // Create new user
        const newUser = {
            name: name,
            email: signupEmailInput,
            password: password,
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem('rmjUsers', JSON.stringify(users));

        // Clear OTP from session
        sessionStorage.removeItem('signupOTP');
        sessionStorage.removeItem('signupEmail');

        // Send notification email (optional)
        const fsData = new FormData();
        fsData.append('name', name);
        fsData.append('email', signupEmailInput);
        fsData.append('Subject', 'New User Signup - RMJ Groups');
        fetch('https://formspree.io/f/xovyawpo', { method: 'POST', body: fsData, headers: { 'Accept': 'application/json' } })
            .catch(() => { });

        alert(`Account created successfully! Welcome, ${name}!`);

        // Auto login
        localStorage.setItem('rmjUserLoggedIn', 'true');
        localStorage.setItem('rmjCurrentUser', JSON.stringify(newUser));
        window.location.href = localStorage.getItem('redirectAfterLogin') || 'index.html';
    }
}

// === TOGGLE AUTH MODE ===
function toggleAuthMode() {
    authMode = (authMode === 'login') ? 'signup' : 'login';
    updateModalUI();
}

// === UPDATE MODAL UI ===
function updateModalUI() {
    const title = document.getElementById('modalTitle');
    const signupFields = document.getElementById('signupFields');
    const passGroup = document.getElementById('passGroup');
    const btn = document.getElementById('submitBtn');
    const toggleText = document.getElementById('toggleText');
    const link = toggleText ? toggleText.nextElementSibling : null;
    const otpGroup = document.getElementById('otpGroup');

    // Reset fields
    if (signupFields) signupFields.style.display = 'none';
    if (passGroup) passGroup.style.display = 'block';
    if (otpGroup) otpGroup.style.display = 'none';

    if (authMode === 'signup') {
        if (title) title.innerText = "Create Account";
        if (signupFields) signupFields.style.display = 'block';
        if (passGroup) passGroup.style.display = 'block';
        if (btn) btn.innerText = "Create Account";
        if (toggleText) toggleText.innerText = "Already have an account? ";
        if (link) link.innerText = "Login";
    } else {
        if (title) title.innerText = "Sign In";
        if (btn) btn.innerText = "Login";
        if (toggleText) toggleText.innerText = "New here? ";
        if (link) link.innerText = "Create Account";
    }
}

// === OPEN/CLOSE MODAL ===
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

// === LOGOUT ===
function logout() {
    localStorage.removeItem('rmjUserLoggedIn');
    localStorage.removeItem('rmjCurrentUser');
    alert("Logged out successfully.");
    location.reload();
}





// === CLOSE MODAL ON OUTSIDE CLICK ===
window.onclick = function (event) {
    const modal = document.getElementById('loginModal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
