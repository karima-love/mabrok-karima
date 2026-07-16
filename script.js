// تعريف إضافات GSAP
gsap.registerPlugin(ScrollTrigger);

// ظبط توسيط الجمل الأخيرة لضمان عدم حدوث أي تكسير
gsap.set(".final-message", { xPercent: -50, yPercent: -50, top: "50%", left: "50%" });

// ==========================================
// 1. السكرول الناعم (Lenis)
// ==========================================
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// ==========================================
// 2. حركة الماوس المخصصة
// ==========================================
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
let mouseX = 0, mouseY = 0;
let posX = 0, posY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    gsap.to(cursor, {
        x: mouseX,
        y: mouseY,
        duration: 0
    });
});

gsap.ticker.add(() => {
    posX += (mouseX - posX) * 0.1;
    posY += (mouseY - posY) * 0.1;
    gsap.set(follower, {
        x: posX,
        y: posY
    });
});

document.querySelectorAll('button, input, .card-hover').forEach(el => {
    el.addEventListener('mouseenter', () => {
        gsap.to(follower, { scale: 1.5, backgroundColor: 'rgba(183, 110, 121, 0.1)', duration: 0.3 });
    });
    el.addEventListener('mouseleave', () => {
        gsap.to(follower, { scale: 1, backgroundColor: 'transparent', duration: 0.3 });
    });
});

// ==========================================
// 3. مشغل الموسيقى
// ==========================================
const audio = document.getElementById('bg-audio');
const toggleBtn = document.getElementById('toggle-music');
const playIcon = document.querySelector('.play-icon');
const pauseIcon = document.querySelector('.pause-icon');
let isPlaying = false;

function playMusic() {
    audio.play().then(() => {
        isPlaying = true;
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
    }).catch(err => console.log("المتصفح منع التشغيل التلقائي", err));
}

toggleBtn.addEventListener('click', () => {
    if (isPlaying) {
        audio.pause();
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
    } else {
        audio.play();
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
    }
    isPlaying = !isPlaying;
});

// ==========================================
// 4. منطق الباسورد (تاريخ انتهاء الامتحانات)
// ==========================================
const pwdInput = document.getElementById('password-input');
const errorMsg = document.getElementById('error-msg');
const TARGET_DATE = "16/07/2026";

pwdInput.addEventListener('input', function(e) {
    let val = e.target.value.replace(/\D/g, '');
    let formatted = '';
    
    if (val.length > 0) formatted += val.substring(0, 2);
    if (val.length > 2) formatted += '/' + val.substring(2, 4);
    if (val.length > 4) formatted += '/' + val.substring(4, 8);
    
    e.target.value = formatted;

    if (formatted.length === 10) {
        if (formatted === TARGET_DATE) {
            unlockExperience();
        } else {
            errorMsg.style.opacity = 1;
            gsap.to(".lock-container", { x: 10, duration: 0.1, yoyo: true, repeat: 3 });
            setTimeout(() => {
                errorMsg.style.opacity = 0;
                e.target.value = '';
            }, 2000);
        }
    }
});

// ==========================================
// 5. المقدمة السينمائية
// ==========================================
function unlockExperience() {
    lenis.stop();
    playMusic();

    const tl = gsap.timeline();

    tl.to("#lock-screen", {
        opacity: 0,
        duration: 1,
        onComplete: () => document.getElementById('lock-screen').classList.add('hidden')
    })
    
    .call(() => {
        const intro = document.getElementById('intro-screen');
        intro.classList.remove('hidden');
        intro.style.display = 'flex';
        intro.style.opacity = 1;
    })
    
    .to(".intro-phrase:nth-child(1)", { opacity: 1, duration: 2, ease: "power2.inOut" })
    .to(".intro-phrase:nth-child(1)", { opacity: 0, duration: 1.5, delay: 1 })
    
    .to(".intro-phrase:nth-child(2)", { opacity: 1, duration: 2, ease: "power2.inOut" })
    .to(".intro-phrase:nth-child(2)", { opacity: 0, duration: 1.5, delay: 1 })
    
    .to(".intro-phrase:nth-child(3)", { opacity: 1, duration: 2, ease: "power2.inOut", scale: 1.1 })
    .to(".intro-phrase:nth-child(3)", { opacity: 0, duration: 1.5, delay: 1.5 })
    
    .to("#intro-screen", {
        backgroundColor: "#FAF9F6",
        duration: 1.5,
        ease: "power2.inOut",
        onComplete: () => {
            document.getElementById('intro-screen').classList.add('hidden');
            document.getElementById('main-content').classList.remove('hidden');
            gsap.to(".music-player", { opacity: 1, duration: 1 });
            lenis.start(); 
            initScrollAnimations();
        }
    })
    
    .fromTo(".hero-headline", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1.5, ease: "power3.out" })
    .fromTo(".hero-paragraph", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1.5, ease: "power3.out" }, "-=1");
}

// ==========================================
// 6. حركات السكرول (ScrollTrigger)
// ==========================================
function initScrollAnimations() {
    gsap.from(".timeline-item", {
        scrollTrigger: {
            trigger: ".journey",
            start: "top 70%",
        },
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out"
    });

    gsap.from(".letter-container", {
        scrollTrigger: {
            trigger: ".letter",
            start: "top 75%",
        },
        scale: 0.95,
        opacity: 0,
        duration: 1.5,
        ease: "power2.out"
    });
}

// ==========================================
// 7. المفاجأة الأخيرة والرجوع للصفحة
// ==========================================
const finalBtn = document.getElementById('final-btn');
const closeBtn = document.getElementById('close-surprise');

finalBtn.addEventListener('click', () => {
    lenis.stop(); 
    
    const surpriseScreen = document.getElementById('surprise-screen');
    surpriseScreen.classList.remove('hidden');
    surpriseScreen.style.display = 'flex';
    
    const tl = gsap.timeline();
    
    tl.to("#main-content", { opacity: 0, duration: 1 })
      .to(surpriseScreen, { opacity: 1, duration: 1 }, "-=0.5")
      .to(".stars-bg", { opacity: 1, duration: 2 })
      
      .fromTo(".msg-1", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 2, ease: "power2.out" })
      .to(".msg-1", { opacity: 0, duration: 1.5, delay: 2 })
      
      .fromTo(".msg-2", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 2, ease: "power2.out" })
      .to(".msg-2", { opacity: 0, duration: 1.5, delay: 2 })

      .fromTo(".msg-3", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 2, ease: "power2.out" })
      .to(".msg-3", { opacity: 0, duration: 1.5, delay: 2 })
      
      .fromTo(".msg-4", { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 2.5, ease: "power2.out" })

      .to(closeBtn, { opacity: 1, duration: 1, onComplete: () => closeBtn.classList.add('active') });
});

finalBtn.addEventListener('mousemove', (e) => {
    const rect = finalBtn.getBoundingClientRect();
    const h = rect.width / 2;
    const x = e.clientX - rect.left - h;
    const y = e.clientY - rect.top - h;
    gsap.to(finalBtn, { x: x * 0.3, y: y * 0.3, duration: 0.3, ease: 'power2.out' });
});
finalBtn.addEventListener('mouseleave', () => {
    gsap.to(finalBtn, { x: 0, y: 0, duration: 0.3, ease: 'power2.out' });
});

// ==========================================
// منطق زرار الرجوع للصفحة الرئيسية
// ==========================================
closeBtn.addEventListener('click', () => {
    const surpriseScreen = document.getElementById('surprise-screen');
    const tl = gsap.timeline();
    
    closeBtn.classList.remove('active');

    tl.to([closeBtn, ".msg-4", ".stars-bg"], { opacity: 0, duration: 1 })
      .to(surpriseScreen, { opacity: 0, duration: 1, onComplete: () => {
          surpriseScreen.classList.add('hidden');
          surpriseScreen.style.display = 'none';
      }})
      .to("#main-content", { opacity: 1, duration: 1, onComplete: () => {
          lenis.start(); 
      }});
});

closeBtn.addEventListener('mousemove', (e) => {
    const rect = closeBtn.getBoundingClientRect();
    const w = rect.width / 2;
    const h = rect.height / 2;
    const x = e.clientX - rect.left - w;
    const y = e.clientY - rect.top - h;
    gsap.to(closeBtn, { x: x * 0.3, y: y * 0.3, duration: 0.3, ease: 'power2.out' });
});
closeBtn.addEventListener('mouseleave', () => {
    gsap.to(closeBtn, { x: 0, y: 0, duration: 0.3, ease: 'power2.out' });
});

// ==========================================
// 8. جزيئات الخلفية (Fireflies Effect)
// ==========================================
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * -0.5 - 0.2; 
        this.opacity = Math.random() * 0.5 + 0.1;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.y < 0) {
            this.y = canvas.height;
            this.x = Math.random() * canvas.width;
        }
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(183, 110, 121, ${this.opacity})`; 
        ctx.fill();
    }
}

function initParticles() {
    for (let i = 0; i < 70; i++) {
        particles.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();