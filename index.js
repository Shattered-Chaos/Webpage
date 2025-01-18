// Add at the start of the file
function hideLoader() {
    const loader = document.querySelector('.loader-wrapper');
    const tl = gsap.timeline();
    
    tl.to(loader, {
        opacity: 0,
        duration: 0.8,
        onComplete: () => {
            loader.remove();
            // Start main animations immediately after loader is gone
            initMainAnimations();
        }
    });
}

// Import GSAP and plugins at the top of your JS file
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

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

// Initial page load animation sequence
function initMainAnimations() {
    // First reset all elements
    gsap.set(['.topbar', '.hero-logo', '.motto', '.nav-links', '.logo-container'], {
        opacity: 0,
        y: 0,
        visibility: 'visible'
    });

    // Create main timeline
    const tl = gsap.timeline({
        defaults: { ease: 'power3.out' }
    });

    tl.to('.topbar', {
        opacity: 1,
        duration: 0.6
    })
    .from('.topbar', {
        y: -50,
        duration: 0.6
    }, '<')
    .to('.logo-container', {
        opacity: 1,
        duration: 0.4
    }, '-=0.3')
    .to('.nav-links', {
        opacity: 1,
        duration: 0.4
    }, '-=0.2')
    .to('.hero-logo', {
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: 'back.out(1.7)'
    })
    .to('.motto', {
        opacity: 1,
        y: 0,
        duration: 0.8
    }, '-=0.5');
}

// Project cards animation
function initProjectAnimations() {
    gsap.set('.project-card', {
        opacity: 0,
        y: 30 
    });

    gsap.utils.toArray('.project-card').forEach((card, i) => {
        ScrollTrigger.create({
            trigger: card,
            start: 'top bottom-=100',
            onEnter: () => {
                gsap.to(card, {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    delay: i * 0.1, 
                    ease: 'back.out(1.2)',
                    onComplete: () => {
                        const badge = card.querySelector('.creator-badge');
                        if (badge) {
                            gsap.to(badge, {
                                opacity: 1,
                                y: 0,
                                duration: 0.3, 
                                ease: 'back.out(1.7)'
                            });
                        }
                    }
                });
            },
            once: true
        });
    });
}

// Team member animations
function initTeamAnimations() {
    const teamMembers = gsap.utils.toArray('.team-member');
    
    teamMembers.forEach((member, i) => {
        gsap.from(member, {
            scrollTrigger: {
                trigger: member,
                start: 'top bottom-=50'
            },
            y: 30,
            opacity: 0,
            duration: 0.4,
            delay: i * 0.05
            ease: 'back.out(1.7)'
        });
    });

    // Enhanced team member click interaction
    teamMembers.forEach(member => {
        member.addEventListener('click', () => {
            const info = createTeamInfo(member);
            
            const tl = gsap.timeline();
            
            tl.to(teamMembers, {
                opacity: 0.3,
                scale: 0.95,
                duration: 0.3,
                ease: 'power2.inOut',
                filter: 'blur(2px)'
            })
            .to(member, {
                opacity: 1,
                scale: 1.1,
                filter: 'blur(0px)',
                duration: 0.3,
                ease: 'power2.inOut'
            }, '<')
            .to(info, {
                opacity: 1,
                scale: 1,
                duration: 0.4,
                ease: 'back.out(1.7)'
            });
        });
    });
}

// Enhanced cursor animation
function initCursor() {
    if (window.matchMedia('(pointer: fine)').matches) {
        const cursor = document.querySelector('.cursor-dot');
        const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        const mouse = { x: pos.x, y: pos.y };
        const speed = 0.1;

        const updateCursor = () => {
            pos.x += (mouse.x - pos.x) * speed;
            pos.y += (mouse.y - pos.y) * speed;
            
            gsap.set(cursor, {
                x: pos.x,
                y: pos.y
            });

            requestAnimationFrame(updateCursor);
        };

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        updateCursor();

        // Cursor hover effects
        const hoverElements = document.querySelectorAll('a, button, .project-card, .team-member');
        
        hoverElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                gsap.to(cursor, {
                    scale: 1.5,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });

            element.addEventListener('mouseleave', () => {
                gsap.to(cursor, {
                    scale: 1,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
        });
    }
}

// Parallax effects
function initParallax() {
    gsap.to('.hero-content', {
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        },
        y: (i, target) => -ScrollTrigger.maxScroll(window) * target.dataset.speed,
        ease: 'none'
    });
}

// Smooth scroll
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                gsap.to(window, {
                    duration: 1,
                    scrollTo: target,
                    ease: 'power3.inOut'
                });
            }
        });
    });
}

// Initialize everything
window.addEventListener('load', () => {
    // Wait for everything to load
    setTimeout(() => {
        hideLoader();
    }, 1500); // Minimum loading time of 1.5 seconds
});

// Update document ready event
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    // Don't initialize animations yet
    initProjectAnimations();
    initTeamAnimations();
    initCursor();
    initParallax();
    initSmoothScroll();
    
    // Refresh ScrollTrigger on page load
    setTimeout(() => {
        ScrollTrigger.refresh();
    }, 100);
});

// Helper function to create team info modal
function createTeamInfo(member) {
    // Remove existing modals first
    document.querySelectorAll('.team-info-container, .team-info-backdrop').forEach(el => el.remove());

    const teamInfoBackdrop = document.createElement('div');
    teamInfoBackdrop.classList.add('team-info-backdrop');
    document.body.appendChild(teamInfoBackdrop);

    const teamInfoContainer = document.createElement('div');
    teamInfoContainer.classList.add('team-info-container');
    document.body.appendChild(teamInfoContainer);

    // Get the avatar src from the clicked member
    const avatarSrc = member.querySelector('.team-avatar').src;

    // Parse social media links
    let socialsHtml = '';
    try {
        const socials = JSON.parse(member.getAttribute('data-socials') || '{}');
        if (Object.keys(socials).length > 0) {
            socialsHtml = `
                <div class="team-info-socials">
                    ${socials.instagram ? `
                        <a href="${socials.instagram}" target="_blank" class="social-link">
                            <img src="images/social/instagram.webp" alt="Instagram">
                            Instagram
                        </a>
                    ` : ''}
                    ${socials.bluesky ? `
                        <a href="${socials.bluesky}" target="_blank" class="social-link">
                            <img src="images/social/bluesky.png" alt="Bluesky">
                            Bluesky
                        </a>
                    ` : ''}
                    ${socials.github ? `
                        <a href="${socials.github}" target="_blank" class="social-link">
                            <img src="images/social/github.png" alt="GitHub">
                            GitHub
                        </a>
                    ` : ''}
                    ${socials.youtube ? `
                        <a href="${socials.youtube}" target="_blank" class="social-link">
                            <img src="images/social/youtube.webp" alt="YouTube">
                            YouTube
                        </a>
                    ` : ''}
                    ${socials.gamebanana ? `
                        <a href="${socials.gamebanana}" target="_blank" class="social-link">
                            <img src="images/social/gamebanana.png" alt="GameBanana">
                            GameBanana
                        </a>
                    ` : ''}
                </div>
            `;
        }
    } catch (e) {
        console.error('Error parsing social links:', e);
    }

    teamInfoContainer.innerHTML = `
        <div class="team-info">
            <img src="${avatarSrc}" alt="${member.getAttribute('data-name')}" class="team-info-avatar">
            <h3>${member.getAttribute('data-name')}</h3>
            <p><strong>${member.getAttribute('data-role')}</strong></p>
            ${socialsHtml}
            <p>${member.getAttribute('data-description')}</p>
            <button class="close-btn" onclick="closeTeamInfo(this)">Close</button>
        </div>
    `;

    // Show the modal with faster avatar animation
    gsap.set(teamInfoContainer, { opacity: 0, scale: 0.9 });
    gsap.set(teamInfoBackdrop, { opacity: 0 });
    gsap.set('.team-info-avatar', { 
        scale: 0.5,
        opacity: 0,
        y: 20  // Reduced from 30
    });

    const tl = gsap.timeline();
    
    tl.to(teamInfoBackdrop, {
        opacity: 1,
        duration: 0.2  // Reduced from 0.3
    })
    .to(teamInfoContainer, {
        opacity: 1,
        scale: 1,
        duration: 0.2,  // Reduced from 0.3
        ease: 'back.out(1.5)'  // Reduced from 1.7 for snappier animation
    }, '-=0.1')
    .to('.team-info-avatar', {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 0.2,  // Reduced from 0.4
        ease: 'back.out(1.5)'  // Reduced from 1.7
    }, '-=0.1');

    // Faster social links animation
    const socialLinks = teamInfoContainer.querySelectorAll('.social-link');
    gsap.set(socialLinks, { 
        opacity: 0, 
        x: -10,  // Reduced from -20
        scale: 0.9  // Increased from 0.8 for less dramatic scale
    });

    socialLinks.forEach((link, index) => {
        gsap.to(link, {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.2,  // Reduced from 0.3
            delay: 0.1 + (index * 0.05),  // Reduced delays
            ease: 'back.out(1.5)'  // Reduced from 1.7
        });

        // Faster hover animations
        link.addEventListener('mouseenter', () => {
            gsap.to(link, {
                scale: 1.05,  // Reduced from 1.1
                y: -3,  // Reduced from -5
                duration: 0.15,  // Reduced from 0.2
                ease: 'power2.out'
            });
        });

        link.addEventListener('mouseleave', () => {
            gsap.to(link, {
                scale: 1,
                y: 0,
                duration: 0.15,  // Reduced from 0.2
                ease: 'power2.out'
            });
        });
    });

    // Make modal visible
    requestAnimationFrame(() => {
        teamInfoBackdrop.classList.add('visible');
        teamInfoContainer.classList.add('visible');
    });

    return teamInfoContainer;
}

// Add this new function
function closeTeamInfo(btn) {
    const container = btn.closest('.team-info-container');
    const backdrop = document.querySelector('.team-info-backdrop');
    
    gsap.to([container, backdrop], {
        opacity: 0,
        duration: 0.15,  // Reduced from 0.2
        ease: 'power2.inOut',
        onComplete: () => {
            container.remove();
            backdrop.remove();
            gsap.to('.team-member', {
                opacity: 1,
                scale: 1,
                filter: 'blur(0px)',
                duration: 0.2  // Reduced from 0.3
            });
        }
    });
}

// Add this to window scope
window.closeTeamInfo = closeTeamInfo;

// Add floating animation
const keyframes = `
@keyframes float {
    0% { transform: translateY(0) rotate(0deg); }
    100% { transform: translateY(-100vh) rotate(360deg); }
}`;

const styleSheet = document.createElement("style");
styleSheet.textContent = keyframes;
document.head.appendChild(styleSheet);
