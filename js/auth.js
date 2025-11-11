// class AuthSystem {
//     constructor() {
//         this.currentUser = null;
//         this.authToken = null;
//         this.init();
//     }

//     init() {
//         this.attachEventListeners();
//         this.checkExistingSession();
//     }

//     attachEventListeners() {
//         // Formulaire de connexion
//         const loginForm = document.getElementById('loginForm');
//         if (loginForm) {
//             loginForm.addEventListener('submit', (e) => this.handleLogin(e));
//         }

//         // Toggle mot de passe
//         const passwordToggle = document.querySelector('.password-toggle');
//         if (passwordToggle) {
//             passwordToggle.addEventListener('click', () => this.togglePasswordVisibility());
//         }

//         // Modal
//         const closeButtons = document.querySelectorAll('.close, #modalClose');
//         closeButtons.forEach(btn => {
//             btn.addEventListener('click', () => this.closeModal());
//         });

//         // Fermer modal en cliquant à l'extérieur
//         window.addEventListener('click', (e) => {
//             const modal = document.getElementById('errorModal');
//             if (e.target === modal) {
//                 this.closeModal();
//             }
//         });
//     }

//     togglePasswordVisibility() {
//         const passwordInput = document.getElementById('password');
//         const toggleIcon = document.querySelector('.password-toggle i');
        
//         if (passwordInput.type === 'password') {
//             passwordInput.type = 'text';
//             toggleIcon.className = 'fas fa-eye-slash';
//         } else {
//             passwordInput.type = 'password';
//             toggleIcon.className = 'fas fa-eye';
//         }
//     }

//     async handleLogin(e) {
//         e.preventDefault();
        
//         const formData = new FormData(e.target);
//         const email = formData.get('email');
//         const password = formData.get('password');
//         const remember = formData.get('remember');

//         // Afficher le loading
//         const submitBtn = e.target.querySelector('button[type="submit"]');
//         const originalText = submitBtn.innerHTML;
//         submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connexion...';
//         submitBtn.disabled = true;

//         // Validation basique
//         if (!this.validateEmail(email)) {
//             this.showError('Veuillez entrer une adresse email valide.');
//             submitBtn.innerHTML = originalText;
//             submitBtn.disabled = false;
//             return;
//         }

//         if (password.length < 6) {
//             this.showError('Le mot de passe doit contenir au moins 6 caractères.');
//             submitBtn.innerHTML = originalText;
//             submitBtn.disabled = false;
//             return;
//         }

//         // Authentification via API
//         const user = await this.authenticateUser(email, password);
        
//         if (user) {
//             this.loginSuccess(user, remember);
//         } else {
//             this.showError('Email ou mot de passe incorrect.');
//             submitBtn.innerHTML = originalText;
//             submitBtn.disabled = false;
//         }
//     }

//     validateEmail(email) {
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         return emailRegex.test(email);
//     }

//     async authenticateUser(email, password) {
//         try {
//             const response = await fetch('php/auth.php', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     action: 'login',
//                     email: email,
//                     password: password
//                 })
//             });

//             const result = await response.json();
            
//             if (result.success) {
//                 return result.user;
//             } else {
//                 this.showError(result.message || 'Erreur de connexion');
//                 return null;
//             }
//         } catch (error) {
//             console.error('Erreur de connexion:', error);
//             this.showError('Erreur de connexion au serveur');
//             return null;
//         }
//     }

//     async verifyToken() {
//         const token = localStorage.getItem('auth_token');
//         if (!token) return null;

//         try {
//             const response = await fetch('php/auth.php', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${token}`
//                 },
//                 body: JSON.stringify({
//                     action: 'verify'
//                 })
//             });

//             const result = await response.json();
            
//             if (result.authenticated && result.user) {
//                 this.currentUser = result.user;
//                 this.authToken = token;
//                 return result.user;
//             } else {
//                 // Token invalide, nettoyer le localStorage
//                 this.clearAuthData();
//                 return null;
//             }
//         } catch (error) {
//             console.error('Erreur de vérification du token:', error);
//             return null;
//         }
//     }

//     async logout() {
//         const token = localStorage.getItem('auth_token');
        
//         if (token) {
//             try {
//                 await fetch('php/auth.php', {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                         'Authorization': `Bearer ${token}`
//                     },
//                     body: JSON.stringify({
//                         action: 'logout'
//                     })
//                 });
//             } catch (error) {
//                 console.error('Erreur lors de la déconnexion:', error);
//             }
//         }

//         this.clearAuthData();
//         window.location.href = 'login.html';
//     }

//     clearAuthData() {
//         localStorage.removeItem('auth_token');
//         localStorage.removeItem('user_data');
//         localStorage.removeItem('remember_me');
//         this.currentUser = null;
//         this.authToken = null;
//     }

//     loginSuccess(user, remember) {
//         this.currentUser = user;
//         this.authToken = user.token;
        
//         // Stocker les données d'authentification
//         localStorage.setItem('auth_token', user.token);
//         localStorage.setItem('user_data', JSON.stringify(user));
        
//         if (remember) {
//             localStorage.setItem('remember_me', 'true');
//         }

//         // Rediriger vers le dashboard
//         window.location.href = 'dashboard.html';
//     }

//     async checkExistingSession() {
//         // Si on est déjà sur la page de login, vérifier si l'utilisateur est déjà connecté
//         if (window.location.pathname.includes('login.html')) {
//             const user = await this.verifyToken();
//             if (user) {
//                 // Rediriger vers le dashboard si déjà connecté
//                 window.location.href = 'dashboard.html';
//             }
//         }
        
//         // Si on est sur une page protégée, vérifier l'authentification
//         if (this.isProtectedPage() && !window.location.pathname.includes('login.html')) {
//             const user = await this.verifyToken();
//             if (!user) {
//                 window.location.href = 'login.html';
//             } else {
//                 this.currentUser = user;
//                 this.updateUIWithUserInfo();
//             }
//         }
//     }

//     isProtectedPage() {
//         // Liste des pages qui nécessitent une authentification
//         const protectedPages = ['dashboard.html', 'vehicles.html', 'clients.html', 'rentals.html'];
//         const currentPage = window.location.pathname.split('/').pop();
//         return protectedPages.includes(currentPage);
//     }

//     updateUIWithUserInfo() {
//         // Mettre à jour l'UI avec les informations de l'utilisateur connecté
//         const userElements = document.querySelectorAll('[data-user-info]');
//         userElements.forEach(element => {
//             const field = element.getAttribute('data-user-info');
//             if (this.currentUser[field]) {
//                 element.textContent = this.currentUser[field];
//             }
//         });

//         // Mettre à jour le menu de navigation
//         const userMenu = document.getElementById('userMenu');
//         if (userMenu && this.currentUser) {
//             userMenu.innerHTML = `
//                 <div class="user-info">
//                     <span class="user-name">${this.currentUser.prenom} ${this.currentUser.nom}</span>
//                     <span class="user-role">${this.getRoleText(this.currentUser.role)}</span>
//                 </div>
//                 <button onclick="auth.logout()" class="btn-logout">
//                     <i class="fas fa-sign-out-alt"></i>
//                     Déconnexion
//                 </button>
//             `;
//         }
//     }

//     getRoleText(role) {
//         const roles = {
//             'admin': 'Administrateur',
//             'manager': 'Gestionnaire',
//             'employe': 'Employé'
//         };
//         return roles[role] || role;
//     }

//     getAuthHeaders() {
//         return {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${this.authToken || localStorage.getItem('auth_token')}`
//         };
//     }

//     async makeAuthenticatedRequest(url, options = {}) {
//         const headers = this.getAuthHeaders();
        
//         const config = {
//             ...options,
//             headers: {
//                 ...headers,
//                 ...options.headers
//             }
//         };

//         try {
//             const response = await fetch(url, config);
            
//             // Si non autorisé, rediriger vers login
//             if (response.status === 401) {
//                 this.clearAuthData();
//                 window.location.href = 'login.html';
//                 return null;
//             }

//             return response;
//         } catch (error) {
//             console.error('Erreur de requête:', error);
//             throw error;
//         }
//     }

//     showError(message) {
//         const modal = document.getElementById('errorModal');
//         const errorMessage = document.getElementById('errorMessage');
        
//         if (modal && errorMessage) {
//             errorMessage.textContent = message;
//             modal.style.display = 'block';
//         } else {
//             // Fallback si le modal n'existe pas
//             alert(message);
//         }
//     }

//     closeModal() {
//         const modal = document.getElementById('errorModal');
//         if (modal) {
//             modal.style.display = 'none';
//         }
//     }

//     // Méthode pour vérifier les permissions
//     hasPermission(permission) {
//         if (!this.currentUser) return false;
        
//         const permissions = {
//             'admin': [
//                 'vehicles.view', 'vehicles.manage', 
//                 'clients.view', 'clients.manage',
//                 'rentals.view', 'rentals.manage',
//                 'reports.view', 'users.manage'
//             ],
//             'manager': [
//                 'vehicles.view', 'vehicles.manage',
//                 'clients.view', 'clients.manage',
//                 'rentals.view', 'rentals.manage',
//                 'reports.view'
//             ],
//             'employe': [
//                 'vehicles.view',
//                 'clients.view',
//                 'rentals.view'
//             ]
//         };

//         return permissions[this.currentUser.role]?.includes(permission) || false;
//     }

//     // Méthode pour protéger les routes selon les permissions
//     protectRoute(requiredPermission) {
//         if (!this.hasPermission(requiredPermission)) {
//             this.showError('Vous n\'avez pas les permissions nécessaires pour accéder à cette page.');
//             setTimeout(() => {
//                 window.location.href = 'dashboard.html';
//             }, 3000);
//             return false;
//         }
//         return true;
//     }
// }

// // Initialiser le système d'authentification
// const auth = new AuthSystem();

// // Exposer la méthode de déconnexion globalement
// window.logoutUser = function() {
//     auth.logout();
// };

// // Exposer la méthode de vérification des permissions
// window.hasPermission = function(permission) {
//     return auth.hasPermission(permission);
// };

// // Exposer la méthode de protection des routes
// window.protectRoute = function(permission) {
//     return auth.protectRoute(permission);
// };

// // Gérer le chargement de la page
// document.addEventListener('DOMContentLoaded', function() {
//     // Si on est sur une page protégée, vérifier l'authentification
//     if (auth.isProtectedPage()) {
//         auth.checkExistingSession();
//     }
// });

// // Intercepter les liens pour les pages protégées
// document.addEventListener('click', function(e) {
//     if (e.target.matches('a[href]')) {
//         const href = e.target.getAttribute('href');
//         const protectedPages = ['dashboard.html', 'vehicles.html', 'clients.html', 'rentals.html'];
        
//         if (protectedPages.some(page => href.includes(page))) {
//             if (!auth.currentUser && !localStorage.getItem('auth_token')) {
//                 e.preventDefault();
//                 window.location.href = 'login.html';
//             }
//         }
//     }
// });