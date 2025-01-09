function createParticles() {
    const container = document.querySelector('.floating-particles');
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 4 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        const duration = Math.random() * 3 + 2;
        particle.style.animation = `float ${duration}s infinite linear`;
        
        container.appendChild(particle);
    }
}

// Add parallax effect
function updateParallax() {
    const scrolled = window.pageYOffset;
    document.body.style.setProperty(
        '--scroll',
        `${scrolled * 0.15}px`
    );
    document.body.style.backgroundPositionY = `${scrolled * 0.5}px`;
}

// Initialize animations when page loads
document.addEventListener('DOMContentLoaded', () => {
    createParticles();

    // Create observers for different elements
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px'
    };

    // Hero logo observer
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                heroObserver.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    // Observe hero logo
    const heroLogo = document.querySelector('.hero-logo');
    if (heroLogo) {
        heroObserver.observe(heroLogo);
    }

    // Project cards observer
    const contentObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                contentObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe only project cards
    document.querySelectorAll('.reveal-card').forEach(card => {
        contentObserver.observe(card);
    });

    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Initialize parallax
    window.addEventListener('scroll', () => {
        requestAnimationFrame(updateParallax);
    });

    // Add intersection observer for project cards
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1
    });

    // Observe all reveal cards
    document.querySelectorAll('.reveal-card').forEach(card => {
        observer.observe(card);
    });
});

// Add floating animation
const keyframes = `
@keyframes float {
    0% { transform: translateY(0) rotate(0deg); }
    100% { transform: translateY(-100vh) rotate(360deg); }
}`;

const styleSheet = document.createElement("style");
styleSheet.textContent = keyframes;
document.head.appendChild(styleSheet);
