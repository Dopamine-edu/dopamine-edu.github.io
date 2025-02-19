// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBXXaWWoFqn6MpH6IWSm6CGaqUJzAmzbzA",
    authDomain: "dopamine-quiz.firebaseapp.com",
    projectId: "dopamine-quiz",
    storageBucket: "dopamine-quiz.firebasestorage.app",
    messagingSenderId: "822531459966",
    appId: "1:822531459966:web:8e7d2385090e997eb1c12f"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Theme Toggle
let isDark = false;
function toggleTheme() {
    isDark = !isDark;
    document.body.setAttribute('data-theme', isDark ? 'dark' : 'light');
    document.getElementById('themeIcon').textContent = isDark ? 'brightness_7' : 'brightness_4';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'light';
document.body.setAttribute('data-theme', savedTheme);
isDark = savedTheme === 'dark';
document.getElementById('themeIcon').textContent = isDark ? 'brightness_7' : 'brightness_4';

// Menu Toggle
function toggleMenu(event) {
    event.stopPropagation();
    const menu = document.getElementById('menuDropdown');
    menu.classList.toggle('show');
}

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.menu-container')) {
        document.getElementById('menuDropdown').classList.remove('show');
    }
});

// User Data Handling
auth.onAuthStateChanged(user => {
    if (user) {
        db.collection('users').doc(user.uid).get()
            .then(doc => {
                if (doc.exists) {
                    const fullName = doc.data().fullName || 'User';
                    const lastName = fullName.split(' ').pop();
                    document.getElementById('lastName').textContent = lastName;
                }
            })
            .catch(error => console.error('Error fetching user data:', error));
    } else {
        window.location.href = 'auth.html';
    }
});

// Logout Function
function logout() {
    auth.signOut().then(() => {
        window.location.href = 'auth.html';
    }).catch(error => alert(error.message));
}

// Ripple Effect
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', (e) => {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            background: rgba(255,255,255,0.4);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
        `;
        
        const rect = card.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = e.clientX - rect.left - size/2 + 'px';
        ripple.style.top = e.clientY - rect.top - size/2 + 'px';
        
        card.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add Ripple Animation
const style = document.createElement('style');
style.textContent = `@keyframes ripple { to { transform: scale(2); opacity: 0; } }`;
document.head.appendChild(style);
