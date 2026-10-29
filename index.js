gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, Flip);

const TEAM_FLIP_DURATION = 0.5;
const TEAM_CLOSE_DURATION = 0.36;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let activeTeamInfo = null;

const SOCIALS = [
    { key: 'instagram', label: 'Instagram', icon: 'images/social/instagram.webp' },
    { key: 'bluesky', label: 'Bluesky', icon: 'images/social/bluesky.png' },
    { key: 'github', label: 'GitHub', icon: 'images/social/github.png' },
    { key: 'youtube', label: 'YouTube', icon: 'images/social/youtube.webp' },
    { key: 'gamebanana', label: 'GameBanana', icon: 'images/social/gamebanana.png' }
];

function hideLoader() {
    const loader = document.querySelector('.loader-wrapper');
    gsap.to(loader, {
        opacity: 0,
        duration: 0.8,
        onComplete: () => {
            loader.remove();
            initMainAnimations();
        }
    });
}

function createParticles() {
    const container = document.querySelector('.floating-particles');
    if (!container) return;

    for (let i = 0; i < 60; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        // 70% small stars, a few bigger ones
        const size = Math.random() < 0.7
            ? Math.random() * 1.5 + 1.2
            : Math.random() * 4 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;

        const duration = Math.random() * 3 + 4.5;
        const delay = Math.random() * 3;
        particle.style.animation = `particle-float ${duration}s linear ${delay}s infinite`;
        particle.style.opacity = (Math.random() * 0.3 + 0.18).toFixed(2);
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
        // Start typing as the fade begins, or the full HTML text flashes before being erased
        onStart: () => {
            typewriterLoop(document.querySelector('.motto'), [
                'Nothing is "too ambitious"',
                'Small team of 6 silly French guys',
                'We make projects, with videos games'
            ]);
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
            once: true,
            onEnter: () => {
                gsap.to(card, {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    delay: i * 0.1,
                    ease: 'power4.in(2)',
                    onComplete: () => {
                        gsap.to(card.querySelector('.creator-badge'), {
                            opacity: 1,
                            y: 0,
                            duration: 0.3,
                            ease: 'back.out(1.7)'
                        });
                    }
                });
            }
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

        member.addEventListener('click', () => {
            if (!activeTeamInfo) createTeamInfo(member);
        });
    });
}

function initCursor() {
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const cursor = document.querySelector('.cursor-dot');
    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const mouse = { x: pos.x, y: pos.y };
    const speed = 0.1;

    const updateCursor = () => {
        pos.x += (mouse.x - pos.x) * speed;
        pos.y += (mouse.y - pos.y) * speed;
        gsap.set(cursor, { x: pos.x, y: pos.y });
        requestAnimationFrame(updateCursor);
    };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    updateCursor();

    document.querySelectorAll('a, button, .project-card, .team-member').forEach(element => {
        element.addEventListener('mouseenter', () => {
            gsap.to(cursor, { scale: 1.5, duration: 0.3, ease: 'power2.out' });
        });
        element.addEventListener('mouseleave', () => {
            gsap.to(cursor, { scale: 1, duration: 0.3, ease: 'power2.out' });
        });
    });
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
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

function initMobileNav() {
    const topbar = document.querySelector('.topbar');
    const toggle = document.querySelector('.menu-toggle');
    const links = document.getElementById('nav-links');
    if (!topbar || !toggle || !links) return;

    const setExpanded = (open) => {
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        topbar.classList.toggle('nav-open', open);
        document.body.classList.toggle('no-scroll', open);
    };

    const isOpen = () => topbar.classList.contains('nav-open');

    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        setExpanded(!isOpen());
    });

    links.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => setExpanded(false));
    });

    document.addEventListener('click', (e) => {
        if (isOpen() && !topbar.contains(e.target)) setExpanded(false);
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && isOpen()) setExpanded(false);
    });
}

window.addEventListener('load', () => {
    setTimeout(hideLoader, 1500);
});

document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    initProjectAnimations();
    initTeamAnimations();
    initCursor();
    initSmoothScroll();
    initMobileNav();

    setTimeout(() => {
        ScrollTrigger.refresh();
    }, 100);
});

function setTeamMembersFocus(activeMember) {
    const otherMembers = gsap.utils.toArray('.team-member').filter(member => member !== activeMember);
    const duration = prefersReducedMotion.matches ? 0 : 0.25;

    gsap.to(otherMembers, {
        opacity: 0.3,
        scale: 0.95,
        filter: 'blur(2px)',
        duration,
        ease: 'power2.inOut',
        overwrite: 'auto'
    });

    gsap.to(activeMember, {
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
        duration,
        ease: 'power2.inOut',
        overwrite: 'auto'
    });
}

function resetTeamMembersFocus(immediate = false) {
    const vars = {
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
        overwrite: 'auto'
    };

    if (immediate || prefersReducedMotion.matches) {
        gsap.set('.team-member', vars);
        return;
    }

    gsap.to('.team-member', {
        ...vars,
        duration: 0.25,
        ease: 'power2.inOut'
    });
}

function createFloatingAvatar(avatar, rect) {
    const floatingAvatar = avatar.cloneNode(true);
    floatingAvatar.classList.remove('team-avatar-hidden');
    floatingAvatar.classList.add('team-avatar-floating');
    floatingAvatar.removeAttribute('style');

    gsap.set(floatingAvatar, {
        position: 'fixed',
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        margin: 0,
        x: 0,
        y: 0
    });

    document.body.appendChild(floatingAvatar);
    return floatingAvatar;
}

function normalizeAvatarLayout(avatar) {
    avatar.removeAttribute('style');
    gsap.set(avatar, { clearProps: 'all' });
}

function activateAvatarContour(avatar) {
    if (prefersReducedMotion.matches) {
        avatar.classList.add('team-avatar-modal-active');
        return;
    }

    // Wait a frame so the contour animation starts after the avatar has moved
    requestAnimationFrame(() => {
        void avatar.offsetWidth;
        avatar.classList.add('team-avatar-modal-active');
    });
}

function stopTeamInfoAnimations(teamInfo) {
    teamInfo.openTimeline?.kill();
    teamInfo.closeTimeline?.kill();
    teamInfo.flipAnimation?.kill();
    teamInfo.closeAvatarTween?.kill();

    gsap.killTweensOf([teamInfo.backdrop, teamInfo.panel, teamInfo.avatar, ...teamInfo.socialLinks]);

    teamInfo.floatingAvatar?.remove();
    teamInfo.avatar.classList.remove('team-avatar-hidden', 'team-avatar-modal-active');
    document.body.classList.remove('team-closing');
}

function cleanupTeamInfo(teamInfo) {
    if (teamInfo.cleanedUp) return;

    teamInfo.cleanedUp = true;
    stopTeamInfoAnimations(teamInfo);
    document.removeEventListener('keydown', teamInfo.escHandler);

    teamInfo.member.classList.remove('team-member-active');
    teamInfo.avatar.classList.remove('team-avatar-modal');
    normalizeAvatarLayout(teamInfo.avatar);
    teamInfo.placeholder.remove();
    teamInfo.container.remove();
    teamInfo.backdrop.remove();

    resetTeamMembersFocus();

    if (activeTeamInfo === teamInfo) {
        activeTeamInfo = null;
    }
}

function createTeamInfo(member) {
    const avatar = member.querySelector('.team-avatar');
    if (!avatar) return;

    const teamInfoBackdrop = document.createElement('div');
    teamInfoBackdrop.classList.add('team-info-backdrop');
    document.body.appendChild(teamInfoBackdrop);

    const teamInfoContainer = document.createElement('div');
    teamInfoContainer.classList.add('team-info-container');
    document.body.appendChild(teamInfoContainer);

    const socials = JSON.parse(member.dataset.socials || '{}');
    const socialLinksHtml = SOCIALS
        .filter(({ key }) => socials[key])
        .map(({ key, label, icon }) => `
            <a href="${socials[key]}" target="_blank" class="social-link">
                <img src="${icon}" alt="">
                ${label}
            </a>`)
        .join('');

    teamInfoContainer.innerHTML = `
        <div class="team-info-panel">
            <button class="team-info-close" aria-label="Close" title="Close">×</button>
            <div class="team-info">
                <div class="team-info-body">
                    <h3>${member.dataset.name}</h3>
                    <p><strong>${member.dataset.role}</strong></p>
                    ${socialLinksHtml ? `<div class="team-info-socials">${socialLinksHtml}</div>` : ''}
                    <p>${member.dataset.description}</p>
                    <button class="close-btn">Close</button>
                </div>
            </div>
        </div>
        <div class="team-info-avatar-anchor" aria-hidden="true"></div>
    `;

    const teamInfoPanel = teamInfoContainer.querySelector('.team-info-panel');
    const avatarAnchor = teamInfoContainer.querySelector('.team-info-avatar-anchor');
    const socialLinks = teamInfoContainer.querySelectorAll('.social-link');
    const placeholder = document.createElement('span');
    placeholder.classList.add('team-avatar-placeholder');
    placeholder.setAttribute('aria-hidden', 'true');

    teamInfoBackdrop.classList.add('visible');
    teamInfoContainer.classList.add('visible');

    gsap.set(teamInfoBackdrop, { opacity: 0 });
    gsap.set(teamInfoPanel, { opacity: 0, y: 22, scale: 0.97 });
    gsap.set(socialLinks, {
        opacity: 0,
        x: -10,
        scale: 0.96
    });

    const avatarState = prefersReducedMotion.matches ? null : Flip.getState(avatar);

    member.classList.add('team-member-active');
    member.replaceChild(placeholder, avatar);
    avatar.classList.add('team-avatar-modal');
    avatarAnchor.appendChild(avatar);

    const escHandler = (e) => {
        if (e.key === 'Escape') closeTeamInfo();
    };

    activeTeamInfo = {
        member,
        avatar,
        placeholder,
        backdrop: teamInfoBackdrop,
        container: teamInfoContainer,
        panel: teamInfoPanel,
        socialLinks,
        escHandler,
        cleanedUp: false
    };

    socialLinks.forEach((link, index) => {
        gsap.to(link, {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: prefersReducedMotion.matches ? 0 : 0.18,
            delay: prefersReducedMotion.matches ? 0 : 0.16 + (index * 0.04),
            ease: 'power2.out'
        });

        link.addEventListener('mouseenter', () => {
            gsap.to(link, { scale: 1.05, y: -3, duration: 0.15, ease: 'power2.out' });
        });
        link.addEventListener('mouseleave', () => {
            gsap.to(link, { scale: 1, y: 0, duration: 0.15, ease: 'power2.out' });
        });
    });

    setTeamMembersFocus(member);
    activateAvatarContour(avatar);

    if (prefersReducedMotion.matches) {
        gsap.set(teamInfoBackdrop, { opacity: 1 });
        gsap.set(teamInfoPanel, { opacity: 1, y: 0, scale: 1 });
    } else {
        const openTimeline = gsap.timeline();

        openTimeline.to(teamInfoBackdrop, {
            opacity: 1,
            duration: 0.22,
            ease: 'power2.out'
        }, 0);

        openTimeline.to(teamInfoPanel, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.32,
            ease: 'power2.out'
        }, 0.04);

        activeTeamInfo.openTimeline = openTimeline;
        activeTeamInfo.flipAnimation = Flip.from(avatarState, {
            duration: TEAM_FLIP_DURATION,
            ease: 'power2.inOut',
            absolute: true,
            nested: true,
            scale: true,
            simple: true
        });
    }

    teamInfoBackdrop.addEventListener('click', closeTeamInfo);
    teamInfoContainer.querySelectorAll('.team-info-close, .close-btn').forEach(btn => {
        btn.addEventListener('click', closeTeamInfo);
    });
    document.addEventListener('keydown', escHandler);
}

function closeTeamInfo() {
    const teamInfo = activeTeamInfo;
    if (!teamInfo || teamInfo.cleanedUp) return;

    stopTeamInfoAnimations(teamInfo);
    const startRect = teamInfo.avatar.getBoundingClientRect();

    teamInfo.placeholder.replaceWith(teamInfo.avatar);
    document.body.classList.add('team-closing');
    teamInfo.avatar.classList.remove('team-avatar-modal');
    resetTeamMembersFocus(true);
    normalizeAvatarLayout(teamInfo.avatar);
    void teamInfo.member.offsetWidth;

    if (prefersReducedMotion.matches) {
        cleanupTeamInfo(teamInfo);
        return;
    }

    const targetRect = teamInfo.avatar.getBoundingClientRect();

    teamInfo.avatar.classList.add('team-avatar-hidden');
    teamInfo.floatingAvatar = createFloatingAvatar(teamInfo.avatar, startRect);

    teamInfo.closeTimeline = gsap.timeline({
        defaults: { ease: 'power2.inOut' }
    });

    teamInfo.closeTimeline.to(teamInfo.panel, {
        opacity: 0,
        y: 20,
        scale: 0.97,
        duration: 0.22
    }, 0);

    teamInfo.closeTimeline.to(teamInfo.backdrop, {
        opacity: 0,
        duration: 0.2
    }, 0.02);

    teamInfo.closeAvatarTween = gsap.to(teamInfo.floatingAvatar, {
        x: targetRect.left - startRect.left,
        y: targetRect.top - startRect.top,
        width: targetRect.width,
        height: targetRect.height,
        duration: TEAM_CLOSE_DURATION,
        ease: 'power2.inOut',
        onComplete: () => cleanupTeamInfo(teamInfo)
    });
}
