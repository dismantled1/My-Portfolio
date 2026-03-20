// --- TOUCH DEVICE DETECTION ---
const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
if (isTouchDevice) {
    document.body.style.cursor = 'auto';
}

// --- CUSTOM CURSOR ---
const cursorDot = document.getElementById('customCursor');
window.addEventListener('mousemove', (e) => {
    cursorDot.style.left = e.clientX + 'px';
    cursorDot.style.top = e.clientY + 'px';
});

// --- BLURRY CLOUD SMOKE EFFECT ---
const canvas = document.getElementById('smokeCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 30 + 15; 
        this.speedX = Math.random() * 1.5 - 0.75;
        this.speedY = Math.random() * -1 - 0.5;
        this.opacity = 0.4;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.size += 0.4; // Expand to look like real smoke
        this.opacity -= 0.007; // 1-2 second fade out
    }
    draw() {
        if (this.opacity <= 0) return;
        let grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        grad.addColorStop(0, `rgba(180, 180, 180, ${this.opacity})`);
        grad.addColorStop(1, `rgba(180, 180, 180, 0)`);
        
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

if (!isTouchDevice) {
    window.addEventListener('mousemove', (e) => {
        if (Math.random() > 0.1) {
            particles.push(new Particle(e.clientX, e.clientY));
        }
    });
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].opacity <= 0) {
            particles.splice(i, 1);
            i--;
        }
    }
    requestAnimationFrame(animate);
}
animate();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// --- FORM SUBMIT VIA EMAILJS ---
document.getElementById('pitStopForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const nameInput = this.querySelector('input[type="text"]');
    const emailInput = this.querySelector('input[type="email"]');
    const messageInput = this.querySelector('textarea');
    const submitButton = this.querySelector('.race-btn');

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    if (!name || !email || !message) {
        alert('Please fill in all fields before launching transmission.');
        return;
    }

    submitButton.disabled = true;
    submitButton.textContent = 'TRANSMITTING...';

    emailjs.send("service_vfai399", "template_o0x3yg7", {
        from_name: name,
        from_email: email,
        message: message
    })

    .then(() => {
        alert('Transmission successful. Message received.');
        this.reset();
    })
    .catch((error) => {
        console.error('EmailJS error:', error);
        alert('Transmission failed. Please try again.');
    })
    .finally(() => {
        submitButton.disabled = false;
        submitButton.textContent = 'INITIATE LAUNCH (SEND)';
    });
});


// --- SCROLL REVEAL OBSERVER ---
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
};

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

// Observe all elements with .reveal class
document.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
});

// --- BACKGROUND PARALLAX EFFECT ---
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrollVal = window.scrollY;
            const bg = document.querySelector('.bg-image');
            if (bg) {
                bg.style.transform = `translateY(${scrollVal * 0.11}px)`;
            }
            ticking = false;
        });
        ticking = true;
    }
});

// --- STAT BOX PULSE EFFECT ---
// Mimics "Live Telemetry" heartbeat
const stats = document.querySelectorAll('.stat-box .value');
if (stats.length > 0) {
    setInterval(() => {
        stats.forEach(stat => {
            stat.style.opacity = '0.7';
            setTimeout(() => stat.style.opacity = '1', 100);
        });
    }, 3000);
}
// --- SMOOTH HERO ENTRANCE ON LOAD ---
window.addEventListener('load', () => {
    setTimeout(() => {
        const heroName = document.querySelector('.highlight-name');
        const heroDesc = document.querySelector('.hero > span');
        
        if (heroDesc) {
            heroDesc.style.animation = 'fadeInUp 0.8s 0.2s cubic-bezier(0.2, 0.8, 0.2, 1) backwards';
        }
    }, 100);
});
// --- NAVBAR SCROLL EFFECT ---
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    const scrollPos = window.scrollY;
    
    if (scrollPos > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
    
    lastScroll = scrollPos;
});
// --- SCROLL PROGRESS INDICATOR ---
window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.body.style.setProperty('--scroll-progress', scrolled + '%');
});
// Add CSS for scroll progress bar
const style = document.createElement('style');
style.textContent = `
    body::after {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        width: var(--scroll-progress, 0%);
        height: 3px;
        background: linear-gradient(90deg, var(--ferrari-red), #E60000);
        z-index: 10001;
        transition: width 0.1s ease;
    }
`;
document.head.appendChild(style);

// --- CARD TILT ON MOUSE MOVE (desktop only) ---
if (!isTouchDevice) { document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 30;
        const rotateY = (centerX - x) / 30;
        
        card.style.transform = `
            translateY(-12px) 
            scale(1.02) 
            perspective(1000px) 
            rotateX(${rotateX}deg) 
            rotateY(${rotateY}deg)
        `;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1) perspective(1000px) rotateX(0deg) rotateY(0deg)';
    });
}); }
// --- ENHANCED CURSOR TRAIL ---
const cursorTrail = [];
const trailLength = 8;

for (let i = 0; i < trailLength; i++) {
    const dot = document.createElement('div');
    dot.className = 'cursor-trail';
    dot.style.cssText = `
        position: fixed;
        width: ${6 - i * 0.5}px;
        height: ${6 - i * 0.5}px;
        background: var(--light-blue);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        opacity: ${1 - i * 0.12};
        transform: translate(-50%, -50%);
        transition: all 0.1s ease;
    `;
    document.body.appendChild(dot);
    cursorTrail.push({ element: dot, x: 0, y: 0 });
}

let mouseX = 0, mouseY = 0;
window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function updateTrail() {
    let currentX = mouseX;
    let currentY = mouseY;
    
    cursorTrail.forEach((trail, index) => {
        trail.x += (currentX - trail.x) * (0.5 - index * 0.05);
        trail.y += (currentY - trail.y) * (0.5 - index * 0.05);
        
        trail.element.style.left = trail.x + 'px';
        trail.element.style.top = trail.y + 'px';
        
        currentX = trail.x;
        currentY = trail.y;
    });
    
    requestAnimationFrame(updateTrail);
}

updateTrail();

// ========== FLOATING RESUME BUTTON & MODAL ==========

// Get elements
const resumeBtn = document.getElementById('resumeBtn');
const resumeModal = document.getElementById('resumeModal');
const modalClose = document.getElementById('modalClose');
const modalOverlay = document.getElementById('modalOverlay');

// Open modal
resumeBtn.addEventListener('click', () => {
    resumeModal.classList.add('active');
    document.body.style.overflow = 'hidden';
});

// Close modal - Close button
modalClose.addEventListener('click', () => {
    resumeModal.classList.remove('active');
    document.body.style.overflow = '';
});

// Close modal - Click outside
modalOverlay.addEventListener('click', () => {
    resumeModal.classList.remove('active');
    document.body.style.overflow = '';
});

// Close modal - ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && resumeModal.classList.contains('active')) {
        resumeModal.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Button hover effect - Cursor interaction
resumeBtn.addEventListener('mouseenter', () => {
    const cursor = document.getElementById('customCursor');
    if (cursor) {
        cursor.style.transform = 'translate(-50%, -50%) scale(2)';
        cursor.style.background = '#130fd0';
    }
});

resumeBtn.addEventListener('mouseleave', () => {
    const cursor = document.getElementById('customCursor');
    if (cursor) {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        cursor.style.background = 'var(--light-blue)';
    }
});

// === STAT COUNTERS ===
function animateCounter(el) {
    const target = +el.dataset.target;
    const duration = 1800;
    const startTime = performance.now();
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = target;
    }
    requestAnimationFrame(update);
}
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });
document.querySelectorAll('.counter-num').forEach(el => counterObserver.observe(el));

// === MAGNETIC BUTTON ===
if (!isTouchDevice) {
    document.querySelectorAll('.magnetic').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });
}

// === PARTICLE BURST ===
document.querySelectorAll('.particle-burst').forEach(btn => {
    btn.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const cx = e.clientX - rect.left;
        const cy = e.clientY - rect.top;
        for (let i = 0; i < 12; i++) {
            const p = document.createElement('div');
            p.className = 'burst-particle';
            const angle = (i / 12) * Math.PI * 2;
            const dist = 35 + Math.random() * 35;
            p.style.cssText = `left:${cx}px; top:${cy}px; --dx:${Math.cos(angle)*dist}px; --dy:${Math.sin(angle)*dist}px;`;
            this.appendChild(p);
            setTimeout(() => p.remove(), 600);
        }
    });
});

