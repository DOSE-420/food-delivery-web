// ====================================================================================
// AUTHENTICATION MANAGER
// Handles user login, signup, session management like Uber Eats/Zomato
// ====================================================================================

class AuthManager {
  constructor() {
    this.currentUser = this.loadUser();
    this.authModal = document.getElementById('authModal');
    this.guestPromptModal = document.getElementById('guestPromptModal');
    this.loginFormContainer = document.getElementById('loginFormContainer');
    this.signupFormContainer = document.getElementById('signupFormContainer');
    this.init();
  }

  init() {
    // Initialize UI based on login state
    this.updateUI();
    
    // Modal controls
    document.getElementById('loginBtn')?.addEventListener('click', () => this.showLogin());
    document.getElementById('authModalClose')?.addEventListener('click', () => this.closeAuthModal());
    document.getElementById('guestPromptClose')?.addEventListener('click', () => this.closeGuestPrompt());
    
    // Form switching
    document.getElementById('showSignupForm')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.showSignupForm();
    });
    document.getElementById('showLoginForm')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.showLoginForm();
    });
    
    // Guest prompt buttons
    document.getElementById('guestLoginBtn')?.addEventListener('click', () => {
      this.closeGuestPrompt();
      this.showLogin();
    });
    document.getElementById('guestSignupBtn')?.addEventListener('click', () => {
      this.closeGuestPrompt();
      this.showSignup();
    });
    
    // Form submissions
    document.getElementById('loginForm')?.addEventListener('submit', (e) => this.handleLogin(e));
    document.getElementById('signupForm')?.addEventListener('submit', (e) => this.handleSignup(e));
    
    // User menu
    document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.logout();
    });
    
    // Password toggle
    document.querySelectorAll('.toggle-password').forEach(btn => {
      btn.addEventListener('click', () => this.togglePassword(btn));
    });
    
    // Close modals on outside click
    window.addEventListener('click', (e) => {
      if (e.target === this.authModal) this.closeAuthModal();
      if (e.target === this.guestPromptModal) this.closeGuestPrompt();
    });
  }

  // ==================== USER DATA MANAGEMENT ====================
  
  loadUser() {
    const userJson = localStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
  }

  saveUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUser = user;
  }

  getAllUsers() {
    const usersJson = localStorage.getItem('users');
    return usersJson ? JSON.parse(usersJson) : [];
  }

  saveAllUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
  }

  // ==================== AUTH LOGIC ====================
  
  handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // Get all registered users
    const users = this.getAllUsers();
    
    // Find user by email or phone
    const user = users.find(u => 
      u.email.toLowerCase() === email.toLowerCase() || 
      u.phone === email
    );
    
    if (!user) {
      this.showError('loginForm', 'No account found with this email or phone');
      return;
    }
    
    if (user.password !== password) {
      this.showError('loginForm', 'Incorrect password');
      return;
    }
    
    // Successful login
    this.saveUser({
      name: user.name,
      email: user.email,
      phone: user.phone,
      rememberMe: rememberMe
    });
    
    this.closeAuthModal();
    this.updateUI();
    this.showSuccess('Welcome back, ' + user.name.split(' ')[0] + '!');
    
    // If there was a redirect intention, handle it
    if (sessionStorage.getItem('redirectAfterLogin')) {
      const redirect = sessionStorage.getItem('redirectAfterLogin');
      sessionStorage.removeItem('redirectAfterLogin');
      window.location.href = redirect;
    }
  }

  handleSignup(e) {
    e.preventDefault();
    
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const phone = document.getElementById('signupPhone').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    const acceptTerms = document.getElementById('acceptTerms').checked;
    
    // Validation
    if (!acceptTerms) {
      this.showError('signupForm', 'You must accept the terms and conditions');
      return;
    }
    
    if (password !== confirmPassword) {
      this.showError('signupForm', 'Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      this.showError('signupForm', 'Password must be at least 6 characters');
      return;
    }
    
    // Check if user already exists
    const users = this.getAllUsers();
    const existingUser = users.find(u => 
      u.email.toLowerCase() === email.toLowerCase() || 
      u.phone === phone
    );
    
    if (existingUser) {
      this.showError('signupForm', 'An account with this email or phone already exists');
      return;
    }
    
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      phone,
      password,
      createdAt: new Date().toISOString(),
      savedAddresses: [],
      orders: []
    };
    
    users.push(newUser);
    this.saveAllUsers(users);
    
    // Auto-login after signup
    this.saveUser({
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      rememberMe: true
    });
    
    this.closeAuthModal();
    this.updateUI();
    this.showSuccess('Account created successfully! Welcome, ' + name.split(' ')[0] + '!');
    
    // If there was a redirect intention, handle it
    if (sessionStorage.getItem('redirectAfterLogin')) {
      const redirect = sessionStorage.getItem('redirectAfterLogin');
      sessionStorage.removeItem('redirectAfterLogin');
      window.location.href = redirect;
    }
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUser = null;
    this.updateUI();
    this.showSuccess('Logged out successfully');
    
    // Redirect to home if on protected page
    const protectedPages = ['checkout.html', 'my-orders.html', 'profile.html'];
    const currentPage = window.location.pathname.split('/').pop();
    if (protectedPages.includes(currentPage)) {
      window.location.href = 'index.html';
    }
  }

  // ==================== UI MANAGEMENT ====================
  
  updateUI() {
    const loginBtn = document.getElementById('loginBtn');
    const userMenu = document.getElementById('userMenu');
    const userDisplayName = document.getElementById('userDisplayName');
    const userDisplayEmail = document.getElementById('userDisplayEmail');
    
    if (this.currentUser) {
      // Show user menu, hide login button
      if (loginBtn) loginBtn.style.display = 'none';
      if (userMenu) userMenu.style.display = 'block';
      
      // Update user display info
      if (userDisplayName) userDisplayName.textContent = this.currentUser.name;
      if (userDisplayEmail) userDisplayEmail.textContent = this.currentUser.email;
    } else {
      // Show login button, hide user menu
      if (loginBtn) loginBtn.style.display = 'flex';
      if (userMenu) userMenu.style.display = 'none';
    }
  }

  // ==================== MODAL CONTROLS ====================
  
  showLogin() {
    this.showAuthModal();
    this.showLoginForm();
  }

  showSignup() {
    this.showAuthModal();
    this.showSignupForm();
  }

  showAuthModal() {
    if (this.authModal) {
      this.authModal.classList.add('show');
      document.body.style.overflow = 'hidden';
    }
  }

  closeAuthModal() {
    if (this.authModal) {
      this.authModal.classList.remove('show');
      document.body.style.overflow = '';
      this.clearForms();
    }
  }

  showLoginForm() {
    if (this.loginFormContainer) this.loginFormContainer.style.display = 'block';
    if (this.signupFormContainer) this.signupFormContainer.style.display = 'none';
  }

  showSignupForm() {
    if (this.loginFormContainer) this.loginFormContainer.style.display = 'none';
    if (this.signupFormContainer) this.signupFormContainer.style.display = 'block';
  }

  showGuestPrompt() {
    if (this.guestPromptModal) {
      this.guestPromptModal.classList.add('show');
      document.body.style.overflow = 'hidden';
    }
  }

  closeGuestPrompt() {
    if (this.guestPromptModal) {
      this.guestPromptModal.classList.remove('show');
      document.body.style.overflow = '';
    }
  }

  // ==================== CHECKOUT GUARD ====================
  
  requireAuth(redirectUrl = 'checkout.html') {
    if (!this.isLoggedIn()) {
      // Store intended destination
      sessionStorage.setItem('redirectAfterLogin', redirectUrl);
      this.showGuestPrompt();
      return false;
    }
    return true;
  }

  isLoggedIn() {
    return this.currentUser !== null;
  }

  // ==================== UTILITY ====================
  
  togglePassword(btn) {
    const targetId = btn.dataset.target;
    const input = document.getElementById(targetId);
    const icon = btn.querySelector('i');
    
    if (input.type === 'password') {
      input.type = 'text';
      icon.classList.remove('fa-eye');
      icon.classList.add('fa-eye-slash');
    } else {
      input.type = 'password';
      icon.classList.remove('fa-eye-slash');
      icon.classList.add('fa-eye');
    }
  }

  clearForms() {
    document.getElementById('loginForm')?.reset();
    document.getElementById('signupForm')?.reset();
    this.clearErrors();
  }

  showError(formId, message) {
    const form = document.getElementById(formId);
    if (!form) return;
    
    // Remove existing error
    const existingError = form.querySelector('.form-error');
    if (existingError) existingError.remove();
    
    // Create error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    form.insertBefore(errorDiv, form.firstChild);
    
    // Auto-remove after 5 seconds
    setTimeout(() => errorDiv.remove(), 5000);
  }

  clearErrors() {
    document.querySelectorAll('.form-error').forEach(el => el.remove());
  }

  showSuccess(message) {
    // Create success notification
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    document.body.appendChild(notification);
    
    // Show with animation
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}

// ==================== INITIALIZE AUTH MANAGER ====================
let authManager;

document.addEventListener('DOMContentLoaded', () => {
  authManager = new AuthManager();
});

// ==================== CHECKOUT INTEGRATION ====================
// This function should be called before allowing checkout

function proceedToCheckout() {
  const cart = JSON.parse(localStorage.getItem('cart')) || {};
  
  // Check if cart is empty
  if (Object.keys(cart).length === 0) {
    alert('Your cart is empty!');
    return;
  }
  
  // Check if user is logged in
  if (!authManager.isLoggedIn()) {
    authManager.showGuestPrompt();
    return;
  }
  
  // Proceed to checkout
  window.location.href = 'checkout.html';
}

// Add this CSS dynamically for error and success notifications
const style = document.createElement('style');
style.textContent = `
  .form-error {
    background: #FEE;
    color: #C00;
    padding: 12px 16px;
    border-radius: 8px;
    margin-bottom: 16px;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 10px;
    animation: shake 0.3s ease;
  }
  
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    75% { transform: translateX(10px); }
  }
  
  .success-notification {
    position: fixed;
    top: 100px;
    right: 24px;
    background: var(--success);
    color: white;
    padding: 16px 24px;
    border-radius: 10px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.2);
    font-weight: 600;
    font-size: 15px;
    z-index: 30000;
    display: flex;
    align-items: center;
    gap: 12px;
    transform: translateX(400px);
    opacity: 0;
    transition: all 0.3s ease;
  }
  
  .success-notification.show {
    transform: translateX(0);
    opacity: 1;
  }
  
  .success-notification i {
    font-size: 20px;
  }
`;
document.head.appendChild(style);
