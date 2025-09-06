function hideLoader() {
    const loader = document.querySelector('.loader-wrapper');
    const tl = gsap.timeline();
    
    tl.to(loader, {
        opacity: 0,
        duration: 0.8,
        onComplete: () => {
            loader.remove();
            initMainAnimations();
            // Affiche le modal après le chargement et l'animation principale
            setTimeout(() => {
                showWelcomeModal();
            }, 400); // petit délai pour la transition
        }
    });
}

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

function createParticles() {
    const container = document.querySelector('.floating-particles');
    const particleCount = 60;

    if (container) container.innerHTML = '';

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        // Taille aléatoire (petit pour effet étoile)
        const size = Math.random() < 0.7
            ? Math.random() * 1.5 + 1.2 // petites étoiles
            : Math.random() * 4 + 2;    // quelques plus grosses
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Position aléatoire
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        // Animation aléatoire
        const duration = Math.random() * 3 + 4.5;
        const delay = Math.random() * 3;
        particle.style.animation = `particle-float ${duration}s linear ${delay}s infinite`;
        
        // Opacité et blur aléatoire (pour effet étoile)
        const op = Math.random() * 0.3 + 0.18;
        particle.style.opacity = op.toFixed(2);
        particle.style.filter = `blur(${Math.random() * 1.2 + 0.2}px)`;

        container.appendChild(particle);
    }
}

function typewriterLoop(element, texts, typingSpeed = 55, pause = 1200, eraseSpeed = 30, erasePause = 600) {
    let idx = 0;
    let charIdx = 0;
    let isErasing = false;

    function type() {
        const text = texts[idx];
        if (!isErasing) {
            element.textContent = text.slice(0, charIdx + 1);
            charIdx++;
            if (charIdx < text.length) {
                setTimeout(type, typingSpeed);
            } else {
                setTimeout(() => {
                    isErasing = true;
                    setTimeout(type, erasePause);
                }, pause);
            }
        } else {
            element.textContent = text.slice(0, charIdx - 1);
            charIdx--;
            if (charIdx > 0) {
                setTimeout(type, eraseSpeed);
            } else {
                isErasing = false;
                idx = (idx + 1) % texts.length;
                setTimeout(type, 400);
            }
        }
    }
    type();
}

function initMainAnimations() {
    gsap.set(['.topbar', '.hero-logo', '.motto', '.nav-links', '.logo-container'], {
        opacity: 0,
        visibility: 'visible'
    });

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
        duration: 0.8,
        onComplete: () => {
            // Animation texte typewriter
            const motto = document.querySelector('.motto');
            if (motto) {
                typewriterLoop(motto, [
                    'Nothing is "too ambitious"',
                    'Small team of 9 silly French guys',
                    'We make projects, with videos games',
                    '#FuckTomtombook'
                ]);
            }
        }
    }, '-=0.5');
}

function initProjectAnimations() {
    gsap.set('.project-card', {
        opacity: 0,
        y: 30
    });

    gsap.utils.toArray('.project-card').forEach((card, i) => {
        ScrollTrigger.create({
            trigger: card,
            start: 'top bottom-=1',
            onEnter: () => {
                gsap.to(card, {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    delay: i * 0.1,
                    ease: 'power4.in(2)',
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

function initTeamAnimations() {
    const teamMembers = gsap.utils.toArray('.team-member');
    
    teamMembers.forEach((member, i) => {
        gsap.from(member, {
            scrollTrigger: {
                trigger: member,
            },
            y: 30,
            opacity: 0,
            duration: 0.3,
            delay: i * 0.03,
            ease: 'back.out(2.2)'
        });
    });

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
                    ease: 'power4.inOut'
                });
            }
        });
    });
}

window.addEventListener('load', () => {
    setTimeout(() => {
        hideLoader();
    }, 1500);
});

document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    initProjectAnimations();
    initTeamAnimations();
    initCursor();
    initParallax();
    initSmoothScroll();

    
    setTimeout(() => {
        ScrollTrigger.refresh();
    }, 100);
});

function createTeamInfo(member) {
    document.querySelectorAll('.team-info-container, .team-info-backdrop').forEach(el => el.remove());

    const teamInfoBackdrop = document.createElement('div');
    teamInfoBackdrop.classList.add('team-info-backdrop');
    document.body.appendChild(teamInfoBackdrop);

    const teamInfoContainer = document.createElement('div');
    teamInfoContainer.classList.add('team-info-container');
    document.body.appendChild(teamInfoContainer);

    const avatarSrc = member.querySelector('.team-avatar').src;

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

    gsap.set(teamInfoContainer, { opacity: 0, scale: 0.9 });
    gsap.set(teamInfoBackdrop, { opacity: 0 });
    gsap.set('.team-info-avatar', { 
        scale: 0.5,
        opacity: 0,
        y: 20
    });

    const tl = gsap.timeline();
    
    tl.to(teamInfoBackdrop, {
        opacity: 1,
        duration: 0.2
    })
    .to(teamInfoContainer, {
        opacity: 1,
        scale: 1,
        duration: 0.2,
        ease: 'back.out(1.5)'  
    }, '-=0.1')
    .to('.team-info-avatar', {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 0.2,
        ease: 'back.out(1.5)'
    }, '-=0.1');

    const socialLinks = teamInfoContainer.querySelectorAll('.social-link');
    gsap.set(socialLinks, { 
        opacity: 0, 
        x: -10,  
        scale: 0.9  
    });

    socialLinks.forEach((link, index) => {
        gsap.to(link, {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.2,  
            delay: 0.1 + (index * 0.05),  
            ease: 'back.out(1.5)'  
        });

        link.addEventListener('mouseenter', () => {
            gsap.to(link, {
                scale: 1.05,
                y: -3,
                duration: 0.15,
                ease: 'power2.out'
            });
        });

        link.addEventListener('mouseleave', () => {
            gsap.to(link, {
                scale: 1,
                y: 0,
                duration: 0.15,
                ease: 'power2.out'
            });
        });
    });

    requestAnimationFrame(() => {
        teamInfoBackdrop.classList.add('visible');
        teamInfoContainer.classList.add('visible');
    });

    return teamInfoContainer;
}

function closeTeamInfo(btn) {
    const container = btn.closest('.team-info-container');
    const backdrop = document.querySelector('.team-info-backdrop');
    
    gsap.to([container, backdrop], {
        opacity: 0,
        duration: 0.15,
        ease: 'power2.inOut',
        onComplete: () => {
            container.remove();
            backdrop.remove();
            gsap.to('.team-member', {
                opacity: 1,
                scale: 1,
                filter: 'blur(0px)',
                duration: 0.2
            });
        }
    });
}

window.closeTeamInfo = closeTeamInfo;

const keyframes = `
@keyframes float {
    0% { transform: translateY(0) rotate(0deg); }
    100% { transform: translateY(-100vh) rotate(360deg); }
}`;

const styleSheet = document.createElement("style");
styleSheet.textContent = keyframes;
document.head.appendChild(styleSheet);

// Modal logic
function showWelcomeModal() {
    const backdrop = document.querySelector('.welcome-modal-backdrop');
    const modal = document.querySelector('.welcome-modal');
    if (backdrop && modal) {
        backdrop.classList.add('visible');
        modal.classList.add('visible');
        document.body.style.overflow = 'hidden';
        // Reset modal style for re-show
        gsap.set(modal, { y: 40, opacity: 0, scale: 0.95 });
        gsap.set(backdrop, { opacity: 0 });
        // Animation GSAP pour l'apparition
        gsap.to(backdrop, { opacity: 1, duration: 0.4, ease: "power1.out" });
        gsap.to(modal, { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: "power2.out" });
    }
}

function closeWelcomeModal() {
    const backdrop = document.querySelector('.welcome-modal-backdrop');
    const modal = document.querySelector('.welcome-modal');
    if (backdrop && modal) {
        // Animation GSAP pour la disparition
        gsap.to(modal, {
            y: 40,
            opacity: 0,
            scale: 0.95,
            duration: 0.5,
            ease: "power2.in",
            onComplete: () => {
                modal.classList.remove('visible');
                document.body.style.overflow = '';
            }
        });
        gsap.to(backdrop, {
            opacity: 0,
            duration: 0.4,
            ease: "power1.in",
            onComplete: () => {
                backdrop.classList.remove('visible');
            }
        });
    }
}

// Close modal on button click or backdrop click
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('welcome-modal-close') ||
        e.target.classList.contains('welcome-modal-backdrop')) {
        closeWelcomeModal();
    }
});

// Optional: close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeWelcomeModal();
});
