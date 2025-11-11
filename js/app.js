// Données des véhicules pour la page d'accueil
const sampleVehicles = [
    {
        id: 1,
        marque: 'Peugeot 308',
        type: 'Berline',
        prixJour: 45,
        image: 'fas fa-car',
        specs: {
            places: 5,
            portes: 5,
            transmission: 'Manuelle',
            climatisation: true
        }
    },
    {
        id: 2,
        marque: 'Renault Clio',
        type: 'Citadine',
        prixJour: 35,
        image: 'fas fa-car',
        specs: {
            places: 5,
            portes: 5,
            transmission: 'Manuelle',
            climatisation: true
        }
    },
    {
        id: 3,
        marque: 'BMW X5',
        type: 'SUV',
        prixJour: 95,
        image: 'fas fa-car',
        specs: {
            places: 5,
            portes: 5,
            transmission: 'Automatique',
            climatisation: true
        }
    },
    {
        id: 4,
        marque: 'Mercedes Classe A',
        type: 'Compacte',
        prixJour: 65,
        image: 'fas fa-car',
        specs: {
            places: 5,
            portes: 5,
            transmission: 'Automatique',
            climatisation: true
        }
    }
];

class HomePage {
    constructor() {
        this.init();
    }

    init() {
        this.renderVehicles();
        this.attachEventListeners();
        this.animateStats();
    }

    renderVehicles() {
        const container = document.getElementById('vehiclesGrid');
        if (!container) return;

        container.innerHTML = sampleVehicles.map(vehicle => `
            <div class="vehicle-card">
                <div class="vehicle-image">
                    <i class="${vehicle.image}"></i>
                </div>
                <div class="vehicle-content">
                    <div class="vehicle-header">
                        <div class="vehicle-name">${vehicle.marque}</div>
                        <div class="vehicle-price">${vehicle.prixJour}€<small>/jour</small></div>
                    </div>
                    <div class="vehicle-type">${vehicle.type}</div>
                    <div class="vehicle-specs">
                        <div class="vehicle-spec">
                            <i class="fas fa-users"></i>
                            ${vehicle.specs.places} places
                        </div>
                        <div class="vehicle-spec">
                            <i class="fas fa-door-closed"></i>
                            ${vehicle.specs.portes} portes
                        </div>
                        <div class="vehicle-spec">
                            <i class="fas fa-cog"></i>
                            ${vehicle.specs.transmission}
                        </div>
                    </div>
                    <button class="btn btn-primary btn-full" onclick="this.redirectToLogin()">
                        <i class="fas fa-calendar-check"></i>
                        Réserver
                    </button>
                </div>
            </div>
        `).join('');
    }

    redirectToLogin() {
        window.location.href = 'login.html';
    }

    attachEventListeners() {
        // Navigation mobile
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
            });
        }

        // Smooth scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Formulaire de contact
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => this.handleContactForm(e));
        }
    }

    handleContactForm(e) {
        e.preventDefault();
        alert('Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.');
        e.target.reset();
    }

    animateStats() {
        const stats = document.querySelectorAll('.stat-number');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.startCounting(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });

        stats.forEach(stat => observer.observe(stat));
    }

    startCounting(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current) + (element.getAttribute('data-count') === '99' ? '%' : '+');
        }, 16);
    }
}

// Initialiser la page d'accueil
document.addEventListener('DOMContentLoaded', () => {
    new HomePage();
});