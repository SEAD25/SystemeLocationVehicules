// Dashboard functionality
class Dashboard {
    constructor() {
        this.currentSection = 'dashboard';
        this.activities = [];
        this.vehicles = [];
        this.reservationsChart = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.initLogout();
        this.loadSampleData();
        this.initCharts();
        this.updateRealTimeData();
    }

    bindEvents() {
        // Navigation entre sections
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.getAttribute('data-section');
                this.switchSection(section);
            });
        });

        // Actions rapides
        document.querySelectorAll('.action-card').forEach(button => {
            button.addEventListener('click', (e) => {
                const action = button.getAttribute('data-action');
                this.handleQuickAction(action);
            });
        });

        // Recherche globale
        const searchInput = document.getElementById('globalSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleGlobalSearch(e.target.value);
            });
        }

        // Rafraîchissement activité
        const refreshBtn = document.getElementById('refreshActivity');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.refreshActivity();
            });
        }

        // Gestion des véhicules
        this.bindVehicleEvents();

        // Initialiser les tooltips
        this.initTooltips();

        // Mettre à jour l'heure en temps réel
        this.startRealTimeClock();
    }

    initLogout() {
        // Bouton de déconnexion sidebar
        const logoutBtn = document.querySelector('.logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showLogoutConfirmation();
            });
        }

        // Bouton de déconnexion header
        const logoutHeaderBtn = document.querySelector('.btn-logout-header');
        if (logoutHeaderBtn) {
            logoutHeaderBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showLogoutConfirmation();
            });
        }
    }

    loadSampleData() {
        // Données d'activité récente
        this.activities = [
            {
                icon: 'fa-car',
                title: 'Nouvelle réservation',
                desc: 'BMW Série 7 - Jean Dupont - 3 jours',
                time: this.getRelativeTime(2),
                type: 'reservation'
            },
            {
                icon: 'fa-user-plus',
                title: 'Nouveau client inscrit',
                desc: 'Marie Martin - Employé - Paris',
                time: this.getRelativeTime(15),
                type: 'client'
            },
            {
                icon: 'fa-exclamation-triangle',
                title: 'Véhicule en retard',
                desc: 'Peugeot 308 - Retour prévu hier',
                time: this.getRelativeTime(60),
                type: 'alert'
            },
            {
                icon: 'fa-euro-sign',
                title: 'Paiement reçu',
                desc: 'Location Mercedes - 285€ - Carte bancaire',
                time: this.getRelativeTime(120),
                type: 'payment'
            },
            {
                icon: 'fa-car',
                title: 'Véhicule ajouté',
                desc: 'Nouvelle Audi A4 - 75€/jour',
                time: this.getRelativeTime(180),
                type: 'vehicle'
            }
        ];

        // Données des véhicules
        this.vehicles = [
            {
                id: 1,
                name: 'BMW Série 7',
                price: '95€/jour',
                status: 'available',
                type: 'Berline Luxe',
                image: 'bmw-series7.jpg'
            },
            {
                id: 2,
                name: 'Mercedes Classe A',
                price: '65€/jour',
                status: 'available',
                type: 'Compact Premium',
                image: 'mercedes-classe-a.jpg'
            },
            {
                id: 3,
                name: 'Audi Q5',
                price: '80€/jour',
                status: 'rented',
                type: 'SUV',
                image: 'audi-q5.jpg'
            },
            {
                id: 4,
                name: 'Peugeot 308',
                price: '45€/jour',
                status: 'maintenance',
                type: 'Berline',
                image: 'peugeot-308.jpg'
            }
        ];

        this.renderActivities();
        this.renderVehicles();
        this.animateStats();
    }

    switchSection(section) {
        // Masquer toutes les sections
        document.querySelectorAll('.content-section').forEach(sec => {
            sec.classList.remove('active');
        });

        // Désactiver tous les items de navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });

        // Activer la section courante
        const targetSection = document.getElementById(section);
        if (targetSection) {
            targetSection.classList.add('active');
        }
        
        const navItem = document.querySelector(`[data-section="${section}"]`);
        if (navItem) {
            navItem.classList.add('active');
        }

        // Mettre à jour le titre de la page
        this.updatePageTitle(section);

        this.currentSection = section;

        // Charger les données spécifiques à la section
        this.loadSectionData(section);
    }

    updatePageTitle(section) {
        const titles = {
            'dashboard': 'Tableau de Bord',
            'vehicles': 'Gestion des Véhicules',
            'reservations': 'Gestion des Réservations',
            'clients': 'Gestion des Clients',
            'users': 'Gestion des Utilisateurs',
            'reports': 'Rapports et Statistiques',
            'settings': 'Paramètres du Système'
        };

        const subtitles = {
            'dashboard': 'Aperçu général du système',
            'vehicles': 'Gérez votre flotte de véhicules',
            'reservations': 'Supervisez les locations en cours',
            'clients': 'Gérez votre base de clients',
            'users': 'Administrez les comptes utilisateurs',
            'reports': 'Analyses et performances',
            'settings': 'Configuration de l\'application'
        };

        const header = document.querySelector('.content-header h1');
        const subtitle = document.querySelector('.content-header p');

        if (header) header.textContent = titles[section] || 'Tableau de Bord';
        if (subtitle) subtitle.textContent = subtitles[section] || 'AutoLocation';
    }

    loadSectionData(section) {
        switch(section) {
            case 'vehicles':
                this.loadVehiclesData();
                break;
            case 'reservations':
                this.loadReservationsData();
                break;
            case 'clients':
                this.loadClientsData();
                break;
            case 'reports':
                this.generateReports();
                break;
        }
    }

    animateStats() {
        const stats = {
            totalVehicles: 48,
            activeReservations: 24,
            totalClients: 89,
            monthlyRevenue: 12458
        };

        this.animateCounter('.stat-card:nth-child(1) .stat-number', stats.totalVehicles);
        this.animateCounter('.stat-card:nth-child(2) .stat-number', stats.activeReservations);
        this.animateCounter('.stat-card:nth-child(3) .stat-number', stats.totalClients);
        this.animateCounter('.stat-card:nth-child(4) .stat-number', stats.monthlyRevenue, true);
    }

    animateCounter(selector, targetValue, isCurrency = false) {
        const element = document.querySelector(selector);
        if (!element) return;

        const currentText = element.textContent;
        let currentValue = 0;

        // Extraire la valeur numérique actuelle
        if (isCurrency) {
            currentValue = parseInt(currentText.replace(/[^\d]/g, '')) || 0;
        } else {
            currentValue = parseInt(currentText.replace(/,/g, '')) || 0;
        }

        const duration = 2000;
        const steps = 60;
        const stepValue = (targetValue - currentValue) / steps;
        const stepTime = duration / steps;

        let currentStep = 0;

        const timer = setInterval(() => {
            currentValue += stepValue;
            currentStep++;

            if (currentStep >= steps) {
                currentValue = targetValue;
                clearInterval(timer);
            }

            if (isCurrency) {
                element.textContent = Math.round(currentValue).toLocaleString('fr-FR') + '€';
            } else {
                element.textContent = Math.round(currentValue).toLocaleString('fr-FR');
            }
        }, stepTime);
    }

    initCharts() {
        // Vérifier si Chart.js est disponible
        if (typeof Chart === 'undefined') {
            console.warn('Chart.js non chargé');
            this.loadChartJS().then(() => this.createCharts());
            return;
        }
        this.createCharts();
    }

    async loadChartJS() {
        // Charger Chart.js dynamiquement
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    createCharts() {
        this.createReservationsChart();
        this.bindChartEvents();
    }

    createReservationsChart() {
        const ctx = document.getElementById('reservationsChart');
        if (!ctx) return;

        // Données simulées pour les 30 derniers jours
        const data = this.generateChartData(30);

        this.reservationsChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Réservations',
                    data: data.values,
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    borderColor: 'rgba(37, 99, 235, 1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: 'rgba(37, 99, 235, 1)',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#1e293b',
                        bodyColor: '#475569',
                        borderColor: '#e2e8f0',
                        borderWidth: 1,
                        padding: 12,
                        boxPadding: 6,
                        usePointStyle: true,
                        callbacks: {
                            label: function(context) {
                                return `Réservations: ${context.parsed.y}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        },
                        ticks: {
                            stepSize: 5,
                            color: '#64748b'
                        },
                        title: {
                            display: true,
                            text: 'Nombre de réservations',
                            color: '#64748b'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#64748b',
                            maxTicksLimit: 10
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'nearest'
                },
                animations: {
                    tension: {
                        duration: 1000,
                        easing: 'linear'
                    }
                }
            }
        });
    }

    generateChartData(days = 30) {
        const labels = [];
        const values = [];
        const today = new Date();
        
        // Générer des données pour les X derniers jours
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(today.getDate() - i);
            
            // Format de date court
            const label = date.toLocaleDateString('fr-FR', { 
                day: '2-digit', 
                month: '2-digit' 
            });
            labels.push(label);
            
            // Générer des valeurs réalistes avec un peu d'aléatoire
            const baseValue = Math.floor(Math.random() * 10) + 8;
            const trend = Math.sin(i * 0.3) * 3;
            const random = (Math.random() - 0.5) * 4;
            const value = Math.max(0, Math.round(baseValue + trend + random));
            
            values.push(value);
        }
        
        return { labels, values };
    }

    bindChartEvents() {
        // Changer la période du graphique
        const periodSelect = document.getElementById('chartPeriod');
        if (periodSelect) {
            periodSelect.addEventListener('change', (e) => {
                this.updateChartPeriod(parseInt(e.target.value));
            });
        }
    }

    updateChartPeriod(days) {
        if (!this.reservationsChart) return;
        
        const newData = this.generateChartData(days);
        
        // Animation de transition
        this.reservationsChart.data.labels = newData.labels;
        this.reservationsChart.data.datasets[0].data = newData.values;
        this.reservationsChart.update('none');
        
        // Mettre à jour les statistiques
        this.updateReservationStats(newData.values);
    }

    updateReservationStats(data) {
        const total = data.reduce((sum, value) => sum + value, 0);
        const average = (total / data.length).toFixed(1);
        
        // Mettre à jour les éléments de statistiques
        const totalElement = document.querySelector('.reservation-stats .stat-item:nth-child(2) .stat-value');
        const averageElement = document.querySelector('.reservation-stats .stat-item:nth-child(4) .stat-value');
        
        if (totalElement) {
            this.animateValue(totalElement, parseInt(totalElement.textContent) || 0, total, 1000);
        }
        
        if (averageElement) {
            const currentAvg = parseFloat(averageElement.textContent) || 0;
            this.animateValue(averageElement, currentAvg, parseFloat(average), 1000, true);
        }
    }

    animateValue(element, start, end, duration, isFloat = false) {
        const startTime = performance.now();
        const change = end - start;
        
        function updateValue(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOut = 1 - Math.pow(1 - progress, 3);
            let value = start + change * easeOut;
            
            if (isFloat) {
                element.textContent = value.toFixed(1) + 'j';
            } else {
                element.textContent = Math.floor(value);
            }
            
            if (progress < 1) {
                requestAnimationFrame(updateValue);
            }
        }
        
        requestAnimationFrame(updateValue);
    }

    renderActivities() {
        const activityList = document.getElementById('activityList');
        if (!activityList) return;

        activityList.innerHTML = '';

        this.activities.forEach(activity => {
            const activityItem = document.createElement('div');
            activityItem.className = 'activity-item';
            activityItem.innerHTML = `
                <div class="activity-icon">
                    <i class="fas ${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-title">${activity.title}</div>
                    <div class="activity-desc">${activity.desc}</div>
                    <div class="activity-time">${activity.time}</div>
                </div>
            `;
            activityList.appendChild(activityItem);
        });
    }

    renderVehicles() {
        const vehiclesList = document.getElementById('vehiclesList');
        if (!vehiclesList) return;

        vehiclesList.innerHTML = '';

        this.vehicles.forEach(vehicle => {
            const vehicleItem = document.createElement('div');
            vehicleItem.className = `vehicle-item ${vehicle.status}`;
            vehicleItem.setAttribute('data-vehicle-id', vehicle.id);
            vehicleItem.innerHTML = `
                <div class="vehicle-info">
                    <div class="vehicle-name">${vehicle.name}</div>
                    <div class="vehicle-details">${vehicle.price} - ${vehicle.type}</div>
                </div>
                <div class="vehicle-status">
                    ${this.getVehicleStatusText(vehicle.status)}
                </div>
            `;
            vehiclesList.appendChild(vehicleItem);
        });

        // Re-bind les événements pour les nouveaux éléments
        this.bindVehicleEvents();
    }

    bindVehicleEvents() {
        document.querySelectorAll('.vehicle-item').forEach(item => {
            item.addEventListener('click', () => {
                this.showVehicleDetails(item);
            });
        });
    }

    getVehicleStatusText(status) {
        const statusMap = {
            'available': 'Disponible',
            'rented': 'Loué',
            'maintenance': 'Maintenance'
        };
        return statusMap[status] || 'Inconnu';
    }

    showVehicleDetails(vehicleElement) {
        const vehicleId = vehicleElement.getAttribute('data-vehicle-id');
        const vehicle = this.vehicles.find(v => v.id == vehicleId);
        
        if (vehicle) {
            this.showModal({
                title: `Détails - ${vehicle.name}`,
                content: `
                    <div class="vehicle-details-modal">
                        <div class="vehicle-image-placeholder">
                            <i class="fas fa-car"></i>
                        </div>
                        <div class="vehicle-info-details">
                            <p><strong>Prix:</strong> ${vehicle.price}</p>
                            <p><strong>Type:</strong> ${vehicle.type}</p>
                            <p><strong>Statut:</strong> ${this.getVehicleStatusText(vehicle.status)}</p>
                            <p><strong>ID:</strong> ${vehicle.id}</p>
                        </div>
                    </div>
                `,
                actions: [
                    {
                        text: 'Fermer',
                        class: 'btn-secondary',
                        action: 'close'
                    },
                    {
                        text: 'Modifier',
                        class: 'btn-primary',
                        action: () => this.editVehicle(vehicleId)
                    }
                ]
            });
        }
    }

    handleQuickAction(action) {
        const actions = {
            'add-vehicle': () => this.showAddVehicleModal(),
            'new-reservation': () => this.showNewReservationModal(),
            'add-client': () => this.showAddClientModal(),
            'generate-report': () => this.generateQuickReport()
        };

        if (actions[action]) {
            actions[action]();
        } else {
            console.warn('Action non reconnue:', action);
        }
    }

    showAddVehicleModal() {
        this.showModal({
            title: 'Ajouter un Véhicule',
            content: `
                <form id="addVehicleForm" class="modal-form">
                    <div class="form-group">
                        <label for="vehicleBrand">Marque *</label>
                        <input type="text" id="vehicleBrand" required>
                    </div>
                    <div class="form-group">
                        <label for="vehicleModel">Modèle *</label>
                        <input type="text" id="vehicleModel" required>
                    </div>
                    <div class="form-group">
                        <label for="vehicleType">Type de véhicule</label>
                        <select id="vehicleType">
                            <option value="berline">Berline</option>
                            <option value="suv">SUV</option>
                            <option value="compact">Compact</option>
                            <option value="luxe">Véhicule de luxe</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="vehiclePrice">Prix par jour (€) *</label>
                        <input type="number" id="vehiclePrice" min="1" required>
                    </div>
                </form>
            `,
            actions: [
                {
                    text: 'Annuler',
                    class: 'btn-secondary',
                    action: 'close'
                },
                {
                    text: 'Ajouter',
                    class: 'btn-primary',
                    action: () => this.addVehicle()
                }
            ]
        });
    }

    showNewReservationModal() {
        this.showModal({
            title: 'Nouvelle Réservation',
            content: `
                <form id="newReservationForm" class="modal-form">
                    <div class="form-group">
                        <label for="reservationClient">Client *</label>
                        <select id="reservationClient" required>
                            <option value="">Sélectionner un client</option>
                            <option value="1">Jean Dupont</option>
                            <option value="2">Marie Martin</option>
                            <option value="3">Pierre Durand</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="reservationVehicle">Véhicule *</label>
                        <select id="reservationVehicle" required>
                            <option value="">Sélectionner un véhicule</option>
                            <option value="1">BMW Série 7</option>
                            <option value="2">Mercedes Classe A</option>
                            <option value="4">Peugeot 308</option>
                        </select>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="reservationStart">Date de début *</label>
                            <input type="date" id="reservationStart" required>
                        </div>
                        <div class="form-group">
                            <label for="reservationEnd">Date de fin *</label>
                            <input type="date" id="reservationEnd" required>
                        </div>
                    </div>
                </form>
            `,
            actions: [
                {
                    text: 'Annuler',
                    class: 'btn-secondary',
                    action: 'close'
                },
                {
                    text: 'Créer Réservation',
                    class: 'btn-primary',
                    action: () => this.createReservation()
                }
            ]
        });
    }

    showAddClientModal() {
        this.showModal({
            title: 'Nouveau Client',
            content: `
                <form id="addClientForm" class="modal-form">
                    <div class="form-group">
                        <label for="clientName">Nom complet *</label>
                        <input type="text" id="clientName" required>
                    </div>
                    <div class="form-group">
                        <label for="clientEmail">Email *</label>
                        <input type="email" id="clientEmail" required>
                    </div>
                    <div class="form-group">
                        <label for="clientPhone">Téléphone</label>
                        <input type="tel" id="clientPhone">
                    </div>
                    <div class="form-group">
                        <label for="clientAddress">Adresse</label>
                        <textarea id="clientAddress" rows="3"></textarea>
                    </div>
                </form>
            `,
            actions: [
                {
                    text: 'Annuler',
                    class: 'btn-secondary',
                    action: 'close'
                },
                {
                    text: 'Ajouter Client',
                    class: 'btn-primary',
                    action: () => this.addClient()
                }
            ]
        });
    }

    showLogoutConfirmation() {
        this.showModal({
            title: 'Déconnexion',
            content: `
                <div class="logout-modal">
                    <div class="logout-icon">
                        <i class="fas fa-sign-out-alt"></i>
                    </div>
                    <div class="logout-message">
                        <h4>Êtes-vous sûr de vouloir vous déconnecter ?</h4>
                        <p>Vous serez redirigé vers la page de connexion.</p>
                    </div>
                </div>
            `,
            actions: [
                {
                    text: 'Annuler',
                    class: 'btn-secondary',
                    action: 'close'
                },
                {
                    text: 'Se déconnecter',
                    class: 'btn-danger',
                    action: () => this.performLogout()
                }
            ]
        });
    }

    showModal(config) {
        // Créer la modal
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'block';
        
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${config.title}</h3>
                    <span class="close">&times;</span>
                </div>
                <div class="modal-body">
                    ${config.content}
                </div>
                <div class="modal-footer">
                    ${config.actions.map(action => 
                        `<button class="btn ${action.class}" data-action="${action.action}">${action.text}</button>`
                    ).join('')}
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Bind events
        const closeBtn = modal.querySelector('.close');
        closeBtn.addEventListener('click', () => {
            modal.remove();
        });

        // Boutons d'action
        modal.querySelectorAll('[data-action]').forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.getAttribute('data-action');
                if (action === 'close') {
                    modal.remove();
                } else {
                    const actionConfig = config.actions.find(a => a.action === action);
                    if (actionConfig && typeof actionConfig.action === 'function') {
                        actionConfig.action();
                    }
                }
            });
        });

        // Fermer en cliquant à l'extérieur
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    addVehicle() {
        const form = document.getElementById('addVehicleForm');
        const brand = document.getElementById('vehicleBrand').value;
        const model = document.getElementById('vehicleModel').value;
        const price = document.getElementById('vehiclePrice').value;

        if (!brand || !model || !price) {
            this.showNotification('Veuillez remplir tous les champs obligatoires', 'error');
            return;
        }

        // Simulation d'ajout
        this.showNotification('Véhicule ajouté avec succès!', 'success');
        
        // Fermer la modal
        document.querySelector('.modal').remove();
        
        // Recharger les données
        this.loadSampleData();
    }

    createReservation() {
        const form = document.getElementById('newReservationForm');
        const client = document.getElementById('reservationClient').value;
        const vehicle = document.getElementById('reservationVehicle').value;
        const startDate = document.getElementById('reservationStart').value;
        const endDate = document.getElementById('reservationEnd').value;

        if (!client || !vehicle || !startDate || !endDate) {
            this.showNotification('Veuillez remplir tous les champs obligatoires', 'error');
            return;
        }

        this.showNotification('Réservation créée avec succès!', 'success');
        document.querySelector('.modal').remove();
    }

    addClient() {
        const form = document.getElementById('addClientForm');
        const name = document.getElementById('clientName').value;
        const email = document.getElementById('clientEmail').value;

        if (!name || !email) {
            this.showNotification('Veuillez remplir tous les champs obligatoires', 'error');
            return;
        }

        this.showNotification('Client ajouté avec succès!', 'success');
        document.querySelector('.modal').remove();
    }

    performLogout() {
        // Afficher un indicateur de chargement
        this.showNotification('Déconnexion en cours...', 'info');
        
        // Simulation de délai de déconnexion
        setTimeout(() => {
            // Nettoyer les données de session
            this.clearSessionData();
            
            // Rediriger vers la page de login
            window.location.href = 'login.html';
        }, 1500);
    }

    clearSessionData() {
        // Nettoyer le localStorage/sessionStorage
        localStorage.removeItem('admin_token');
        sessionStorage.clear();
        
        console.log('Administrateur déconnecté');
    }

    generateQuickReport() {
        this.showNotification('Génération du rapport en cours...', 'info');
        
        // Simulation de génération
        setTimeout(() => {
            this.showNotification('Rapport généré avec succès!', 'success');
            
            // Créer un lien de téléchargement simulé
            const link = document.createElement('a');
            link.href = '#';
            link.download = 'rapport_autolocation.pdf';
            link.click();
        }, 2000);
    }

    handleGlobalSearch(query) {
        if (query.length < 2) {
            this.clearSearchResults();
            return;
        }

        // Simulation de recherche
        const results = this.simulateSearch(query);
        this.displaySearchResults(results, query);
    }

    simulateSearch(query) {
        const searchTerm = query.toLowerCase();
        
        return [
            {
                type: 'vehicle',
                title: 'BMW Série 7',
                description: 'Véhicule disponible - 95€/jour',
                icon: 'fa-car'
            },
            {
                type: 'client',
                title: 'Jean Dupont',
                description: 'Client - 5 réservations',
                icon: 'fa-user'
            },
            {
                type: 'reservation',
                title: 'Réservation #2456',
                description: 'En cours - Mercedes Classe A',
                icon: 'fa-calendar-check'
            }
        ].filter(item => 
            item.title.toLowerCase().includes(searchTerm) || 
            item.description.toLowerCase().includes(searchTerm)
        );
    }

    displaySearchResults(results, query) {
        this.clearSearchResults();

        if (results.length === 0) {
            this.showSearchMessage(`Aucun résultat pour "${query}"`);
            return;
        }

        const searchBox = document.querySelector('.search-box');
        const resultsContainer = document.createElement('div');
        resultsContainer.className = 'search-results';

        results.forEach(result => {
            const resultElement = document.createElement('div');
            resultElement.className = 'search-result-item';
            resultElement.innerHTML = `
                <div class="search-result-icon">
                    <i class="fas ${result.icon}"></i>
                </div>
                <div class="search-result-content">
                    <div class="search-result-title">${result.title}</div>
                    <div class="search-result-desc">${result.description}</div>
                </div>
            `;
            resultElement.addEventListener('click', () => {
                this.handleSearchResultClick(result);
            });
            resultsContainer.appendChild(resultElement);
        });

        searchBox.appendChild(resultsContainer);
    }

    clearSearchResults() {
        const existingResults = document.querySelector('.search-results');
        if (existingResults) {
            existingResults.remove();
        }
    }

    showSearchMessage(message) {
        const searchBox = document.querySelector('.search-box');
        const messageElement = document.createElement('div');
        messageElement.className = 'search-message';
        messageElement.textContent = message;
        
        this.clearSearchResults();
        searchBox.appendChild(messageElement);
        
        setTimeout(() => {
            messageElement.remove();
        }, 3000);
    }

    handleSearchResultClick(result) {
        this.clearSearchResults();
        document.getElementById('globalSearch').value = '';

        // Navigation selon le type de résultat
        switch(result.type) {
            case 'vehicle':
                this.switchSection('vehicles');
                break;
            case 'client':
                this.switchSection('clients');
                break;
            case 'reservation':
                this.switchSection('reservations');
                break;
        }

        this.showNotification(`Navigation vers: ${result.title}`, 'info');
    }

    refreshActivity() {
        const refreshBtn = document.getElementById('refreshActivity');
        if (refreshBtn) {
            refreshBtn.querySelector('i').classList.add('fa-spin');
            
            // Simuler un rafraîchissement
            setTimeout(() => {
                this.loadSampleData();
                refreshBtn.querySelector('i').classList.remove('fa-spin');
                this.showNotification('Activité rafraîchie', 'success');
            }, 1000);
        }
    }

    initTooltips() {
        // Tooltips simples pour les éléments interactifs
        document.querySelectorAll('[title]').forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                this.showTooltip(e.target, e.target.title);
            });
            
            element.addEventListener('mouseleave', () => {
                this.hideTooltip();
            });
        });
    }

    showTooltip(element, text) {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = text;
        
        const rect = element.getBoundingClientRect();
        tooltip.style.left = rect.left + (rect.width / 2) + 'px';
        tooltip.style.top = (rect.top - 10) + 'px';
        
        document.body.appendChild(tooltip);
        
        element._tooltip = tooltip;
    }

    hideTooltip() {
        const tooltip = document.querySelector('.tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    }

    showNotification(message, type = 'info') {
        // Créer la notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">&times;</button>
        `;

        document.body.appendChild(notification);

        // Animation d'entrée
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Fermeture automatique
        setTimeout(() => {
            this.hideNotification(notification);
        }, 5000);

        // Fermeture manuelle
        notification.querySelector('.notification-close').addEventListener('click', () => {
            this.hideNotification(notification);
        });
    }

    hideNotification(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    getNotificationIcon(type) {
        const icons = {
            'success': 'fa-check-circle',
            'error': 'fa-exclamation-circle',
            'warning': 'fa-exclamation-triangle',
            'info': 'fa-info-circle'
        };
        return icons[type] || 'fa-info-circle';
    }

    getRelativeTime(minutesAgo) {
        if (minutesAgo < 1) return 'À l\'instant';
        if (minutesAgo < 60) return `Il y a ${minutesAgo} minute${minutesAgo > 1 ? 's' : ''}`;
        
        const hours = Math.floor(minutesAgo / 60);
        if (hours < 24) return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
        
        const days = Math.floor(hours / 24);
        return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
    }

    startRealTimeClock() {
        this.updateClock();
        setInterval(() => this.updateClock(), 60000);
    }

    updateClock() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('fr-FR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        const clockElement = document.querySelector('.header-time');
        if (clockElement) {
            clockElement.textContent = timeString;
        }
    }

    updateRealTimeData() {
        // Simuler des mises à jour en temps réel
        setInterval(() => {
            this.simulateRealTimeUpdates();
        }, 30000);
    }

    simulateRealTimeUpdates() {
        // Simuler des changements aléatoires dans les données
        const randomChange = Math.random();
        
        if (randomChange > 0.7) {
            // Ajouter une nouvelle activité
            const newActivity = {
                icon: 'fa-bell',
                title: 'Mise à jour système',
                desc: 'Synchronisation des données effectuée',
                time: 'À l\'instant',
                type: 'system'
            };
            
            this.activities.unshift(newActivity);
            if (this.activities.length > 10) {
                this.activities.pop();
            }
            
            this.renderActivities();
        }
    }

    editVehicle(vehicleId) {
        this.showNotification(`Modification du véhicule #${vehicleId}`, 'info');
    }

    loadVehiclesData() {
        console.log('Chargement des données véhicules...');
    }

    loadReservationsData() {
        console.log('Chargement des données réservations...');
    }

    loadClientsData() {
        console.log('Chargement des données clients...');
    }

    generateReports() {
        console.log('Génération des rapports...');
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    new Dashboard();
    
    // Gestion des erreurs globales
    window.addEventListener('error', function(e) {
        console.error('Erreur Dashboard:', e.error);
    });
});

// Exposer la classe Dashboard globalement
window.Dashboard = Dashboard;