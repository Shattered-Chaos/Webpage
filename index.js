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

    // Check if device is mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (!isMobile) {
        // Only initialize cursor on non-mobile devices
        initCursor();
    }

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

    // Add motto to hero observer
    const motto = document.querySelector('.motto');
    if (motto) {
        heroObserver.observe(motto);
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

// Separate cursor initialization into its own function
function initCursor() {
    const cursor = document.querySelector('.cursor-dot');
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;

    function updateCursor() {
        currentX += (targetX - currentX) * 0.7; // Increased from 0.4
        currentY += (targetY - currentY) * 0.7; // Increased from 0.4
        cursor.style.left = `${currentX}px`;
        cursor.style.top = `${currentY}px`;
        requestAnimationFrame(updateCursor);
    }

    document.addEventListener('mousemove', (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
    });

    updateCursor();

    // Cursor hover effect
    const links = document.querySelectorAll('a, button, .project-card, [role="button"]');
    links.forEach(link => {
        link.addEventListener('mouseenter', () => cursor.classList.add('link-hover'));
        link.addEventListener('mouseleave', () => cursor.classList.remove('link-hover'));
    });
    
    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => cursor.style.opacity = '0');
    document.addEventListener('mouseenter', () => cursor.style.opacity = '1');
}

// Add floating animation
const keyframes = `
@keyframes float {
    0% { transform: translateY(0) rotate(0deg); }
    100% { transform: translateY(-100vh) rotate(360deg); }
}`;

const styleSheet = document.createElement("style");
styleSheet.textContent = keyframes;
document.head.appendChild(styleSheet);
