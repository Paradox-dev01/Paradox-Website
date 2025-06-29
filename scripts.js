// Cursor
const cursor = document.querySelector(".custom-cursor");
let isMoving = false;

// Move cursor with mouse
let mouseX = 0;
let mouseY = 0;
let rafRequested = false;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  if (!rafRequested) {
    requestAnimationFrame(updateCursor);
    rafRequested = true;
  }

  if (!isMoving) {
    isMoving = true;
    cursor.classList.remove("idle");
    setTimeout(() => (isMoving = false), 100);
  }
});

function updateCursor() {
  cursor.style.left = `${mouseX}px`;
  cursor.style.top = `${mouseY}px`;
  rafRequested = false;
}

// Idle animation trigger after no movement for 1.5s
let idleTimeout;
document.addEventListener("mousemove", () => {
  clearTimeout(idleTimeout);
  idleTimeout = setTimeout(() => {
    cursor.classList.add("idle");
  }, 1500);
});

// Click animation
document.addEventListener("mousedown", () => {
  cursor.classList.add("clicked");
});
document.addEventListener("mouseup", () => {
  cursor.classList.remove("clicked");
});

  // Hovering clickable items
document.querySelectorAll('a, button, .enter-button, .nav-arrow').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.classList.add('hover');
  });
  el.addEventListener('mouseleave', () => {
    cursor.classList.remove('hover');
  });
});

// Scroll Animation Observer
// const sections = document.querySelectorAll('.section');
// const observer = new IntersectionObserver(entries => {
//   entries.forEach(entry => {
//     if (entry.isIntersecting) {
//       entry.target.classList.add('visible');
//     } else {
//       entry.target.classList.remove('visible');
//     }
//   });
// }, {
//   threshold: 0.3
// });

// sections.forEach(section => observer.observe(section));


// Scroll Progress Bar
window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const docHeight = document.body.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;
  document.querySelector(
    ".scroll-progress-bar"
  ).style.width = `${scrollPercent}%`;
});

// Navigation Arrow Scroll
const sections = document.querySelectorAll('.section');
function scrollToNextSection() {
  const visibleSections = Array.from(sections).filter(
    (section) => section.getBoundingClientRect().top >= 0
  );
  const next = visibleSections[0] || sections[0];
  next.scrollIntoView({ behavior: "smooth" });
}
const navArrow = document.querySelector('.nav-arrow');
const landingSection = document.getElementById('landing');
const connectSection = document.getElementById('connect');

function checkNavArrowVisibility() {
  const landingRect = landingSection.getBoundingClientRect();
  const connectRect = connectSection.getBoundingClientRect();

  if (
    (landingRect.top <= window.innerHeight && landingRect.bottom >= 0) ||
    (connectRect.top <= window.innerHeight && connectRect.bottom >= 0)
  ) {
    navArrow.style.display = 'none';
  } else {
    navArrow.style.display = 'block';
  }
}

window.addEventListener('scroll', checkNavArrowVisibility);
window.addEventListener('load', checkNavArrowVisibility);




gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(MotionPathPlugin);


const canvas = document.getElementById('sci-fi-bg');
const ctx = canvas.getContext('2d');

let width, height, points;

const POINT_COUNT = 150; 
const MAX_DISTANCE = 120; 

// Initialize canvas size
function resize() {
  width = canvas.clientWidth;
  height = canvas.clientHeight;
  canvas.width = width * devicePixelRatio;
  canvas.height = height * devicePixelRatio;
  ctx.scale(devicePixelRatio, devicePixelRatio);
}
resize();
window.addEventListener('resize', resize);

// Point class for each moving dot
class Point {
  constructor() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * 0.5; // slow movement
    this.vy = (Math.random() - 0.5) * 0.5;
    this.radius = 1.5;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    // Bounce off edges
    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = 'rgba(0, 255, 255, 0.7)';
    ctx.shadowColor = '#0ff';
    ctx.shadowBlur = 6;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

function distance(p1, p2) {
  return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
}

// The "disruption" effect variables
let disruptX = null;
let disruptY = null;
const DISRUPT_RADIUS = 170;

// Initialize points
function initPoints() {
  points = [];
  for (let i = 0; i < POINT_COUNT; i++) {
    points.push(new Point());
  }
}
initPoints();

// Animation loop using GSAP ticker
gsap.ticker.add(() => {
  ctx.clearRect(0, 0, width, height);

  // Update and draw points
  points.forEach(p => p.update());

  // Draw lines between close points
  for (let i = 0; i < POINT_COUNT; i++) {
    for (let j = i + 1; j < POINT_COUNT; j++) {
      let dist = distance(points[i], points[j]);
      if (dist < MAX_DISTANCE) {
        let opacity = 1 - dist / MAX_DISTANCE;

        // Check disruption: if either point is near cursor, disrupt line opacity and position
        if (
          disruptX !== null &&
          (distance(points[i], { x: disruptX, y: disruptY }) < DISRUPT_RADIUS ||
            distance(points[j], { x: disruptX, y: disruptY }) < DISRUPT_RADIUS)
        ) {
          // Random shake offset for disruption
          const offsetX = (Math.random() - 0.5) * 10;
          const offsetY = (Math.random() - 0.5) * 10;

          ctx.strokeStyle = `rgba(255, 0, 255, ${opacity * 0.6})`; // disrupted line color pinkish
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(points[i].x + offsetX, points[i].y + offsetY);
          ctx.lineTo(points[j].x - offsetX, points[j].y - offsetY);
          ctx.stroke();
        } else {
          ctx.strokeStyle = `rgba(0, 255, 255, ${opacity * 0.3})`; // normal line color cyanish, less opacity
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(points[i].x, points[i].y);
          ctx.lineTo(points[j].x, points[j].y);
          ctx.stroke();
        }
      }
    }
  }

  // Draw points on top
  points.forEach(p => p.draw());
});

const landingCore = document.querySelector('.landing-core');

landingCore.addEventListener('mousemove', (e) => {
  const rect = landingCore.getBoundingClientRect();
  disruptX = e.clientX - rect.left;
  disruptY = e.clientY - rect.top;
});

landingCore.addEventListener('mouseleave', () => {
  disruptX = null;
  disruptY = null;
});




//  --- LANDING PAGE ---

// === SELECT DOM ELEMENTS ===
const bgBottom = document.querySelector('.bg-bottom');
const astronaut = document.getElementById('astronaut');
// const landingSection = document.getElementById('landing');
const landingBg = document.getElementById('landing-background');
// const navArrow = document.querySelector('.nav-arrow');

// === FLY-AWAY ANIMATION TRIGGER ===
function triggerFlyAwayAndScroll() {
  astronaut.style.pointerEvents = 'none';

  const waveX = gsap.utils.random(-300, 300);
  const waveY = gsap.utils.random(-400, -700);
  const rotate = gsap.utils.random(-200, 200);

  // Create a floaty motion path
  gsap.timeline({
    onComplete: () => {
      scrollToSection('core1');
      gsap.set(astronaut, { clearProps: 'all' });
      astronaut.style.pointerEvents = 'auto';
    }
  })
  .to(astronaut, {
    duration: 1.6,
    ease: 'power1.inOut',
    motionPath: {
      path: [
        { x: 0, y: 0 },
        { x: waveX * 0.5, y: waveY * 0.4 },
        { x: waveX, y: waveY }
      ],
      curviness: 1.5
    },
    rotation: rotate,
    scale: 0.3,
    opacity: 0
  });
}

// === SCROLL TO SECTION ===
function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({ behavior: "smooth" });
}

// === CLICK TO TRIGGER FLY-AWAY ===
const landingClickableItems = [
  ...document.querySelectorAll('#landing button'),
  ...document.querySelectorAll('#landing .scroll-down-arrow')
];

// Astronaut click: fly away AND scroll to core1
astronaut?.addEventListener('click', triggerFlyAwayAndScroll);

// Other items trigger fly-away
landingClickableItems.forEach(item => {
  item?.addEventListener('click', triggerFlyAway);
});

// === SCROLL EVENTS ===
window.addEventListener('scroll', () => {
  const rect = landingSection.getBoundingClientRect();
  const windowHeight = window.innerHeight;

  // SCROLL PROGRESS (0 = fully visible, 1 = fully out of view)
  const scrollProgress = 1 - Math.max(0, Math.min(1, rect.bottom / windowHeight));

  // Move bg-bottom (e.g., trapezium effect)
  if (bgBottom) {
    const translateY = Math.min(scrollProgress * 50, 50); // Max 50px
    bgBottom.style.transform = `translateY(${translateY}px)`;
  }

  // Fade out landing background
  if (landingBg) {
    landingBg.style.opacity = 1 - scrollProgress;
  }

  // Trigger astronaut fly-away after slight scroll
  if (scrollProgress > 0.1) {
    astronaut.classList.add('fly-away');
  } else {
    astronaut.classList.remove("fly-away");
  }
});

// Show nav arrow only after scrolling 60%
window.addEventListener('scroll', () => {
  const pct = window.scrollY / window.innerHeight;
  navArrow.classList.toggle('visible', pct > 0.6);
});


//  --- CORE ---

//1
const core1 = document.getElementById('core1');
const coreObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      core1.classList.add('fade-in');
      // optional: remove after first load
      // coreObserver.unobserve(core1); 
    }
  });
}, { threshold: 0.3 });

coreObserver.observe(core1);

//2
gsap.utils.toArray('.core-card').forEach((card, index) => {
    gsap.fromTo(card,
        {
            y: index === 1 ? 20 : 60,
            opacity: 0,
            rotateY: 30,
            scale: 0.8
        },
        {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none reset'
            },
            y: 0,
            opacity: 1,
            rotateY: 0,
            scale: 1,
            duration: 1.2,
            ease: 'power3.out',
            delay: index * 0.1
        }
    );
});

ScrollTrigger.create({
  trigger: '#core2',
  start: 'bottom bottom',
  end: 'bottom top',
  toggleClass: { targets: '.card-inner', className: 'flipped' },
  scrub: true,
});

ScrollTrigger.create({
  trigger: "#core2",
  start: "bottom bottom",
  end: "bottom top",
  onLeave: () => document.querySelector("#core2").classList.add("blurred"),
  onLeaveBack: () =>
    document.querySelector("#core2").classList.remove("blurred"),
});

//  --- THE LABS ---
document.addEventListener("DOMContentLoaded", () => {
// Create stars
const starsContainer = document.getElementById("lab-stars");
const starCount = 200;

for (let i = 0; i < starCount; i++) {
  const star = document.createElement("div");
  star.classList.add("lab-star");

  // Random size between 1 and 3 pixels
  const size = Math.random() * 2 + 1;
  star.style.width = `${size}px`;
  star.style.height = `${size}px`;

  // Random position
  star.style.top = `${Math.random() * 100}%`;
  star.style.left = `${Math.random() * 100}%`;

  starsContainer.appendChild(star);
}

// GSAP Animations

// Animate stars twinkling
gsap.utils.toArray(".lab-star").forEach((labStar) => {
  gsap.to(labStar, {
    opacity: Math.random() * 0.5 + 0.3,
    duration: Math.random() * 3 + 1,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });
});
});

// Animate grid
gsap.to(".grid", {
  backgroundPosition: "0 50px, 50px 0",
  duration: 20,
  repeat: -1,
  ease: "none",
});

// Animate neon circle
gsap.to(".neon-circle", {
  scale: 1.05,
  opacity: 0.6,
  duration: 2,
  repeat: -1,
  yoyo: true,
  ease: "sine.inOut",
});

// Animate content
gsap.from(".lab-content h1", {
  y: -50,
  opacity: 0,
  duration: 1.5,
  ease: "back.out",
});

gsap.from(".lab-content p", {
  y: 30,
  opacity: 0,
  duration: 1,
  stagger: 0.3,
  ease: "power2.out",
});

gsap.from(".cta", {
  y: 30,
  opacity: 0,
  duration: 1,
  delay: 1.5,
  ease: "back.out",
});

// Mouse movement parallax effect
document.addEventListener("mousemove", (e) => {
  const mouseX = e.clientX / window.innerWidth - 0.5;
  const mouseY = e.clientY / window.innerHeight - 0.5;

  gsap.to(".neon-circle", {
    x: mouseX * 20,
    y: mouseY * 20,
    duration: 1,
  });

  gsap.to(".lab-stars", {
    x: mouseX * 10,
    y: mouseY * 10,
    duration: 1,
  });
});


document.addEventListener('DOMContentLoaded', () => {
    // Create grid background
    createGrid();
    
    // Header animation
    gsap.to('.header h1', {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out'
    });

    gsap.to('.header p', {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 0.3,
        ease: 'power3.out'
    });

    // Section title animation
    gsap.to('.section-title', {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 0.6,
        ease: 'power3.out'
    });

    // Project cards animation
    gsap.utils.toArray('.project-card').forEach((card, i) => {
        gsap.to(card, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: 0.9 + (i * 0.15),
            ease: 'back.out'
        });
    });

    // Scroll animations for when user scrolls back up
    gsap.to('.section-title', {
        scrollTrigger: {
            trigger: '.section-title',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out'
    });

    gsap.utils.toArray('.project-card').forEach((card, i) => {
        gsap.to(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'back.out'
        });
    });

    // Responsive grid on resize
    window.addEventListener('resize', () => {
        const gridBg = document.getElementById('gridBg');
        gridBg.innerHTML = '';
        createGrid();
    });
});

function createGrid() {
    const gridBg = document.getElementById('gridBg');
    const gridSize = 50; // distance between grid lines
    const cols = Math.ceil(window.innerWidth / gridSize) + 1;
    const rows = Math.ceil(window.innerHeight / gridSize) + 1;
    
    // Create vertical lines
    for (let i = 0; i < cols; i++) {
        const line = document.createElement('div');
        line.className = 'grid-line vertical';
        line.style.left = `${i * gridSize}px`;
        gridBg.appendChild(line);
        
        // Animate vertical lines
        gsap.from(line, {
            duration: 1.5,
            delay: i * 0.02,
            opacity: 0,
            ease: 'power2.out'
        });
    }
    
    // Create horizontal lines
    for (let i = 0; i < rows; i++) {
        const line = document.createElement('div');
        line.className = 'grid-line horizontal';
        line.style.top = `${i * gridSize}px`;
        gridBg.appendChild(line);
        
        // Animate horizontal lines
        gsap.from(line, {
            duration: 1.5,
            delay: i * 0.02,
            opacity: 0,
            ease: 'power2.out'
        });
    }
    
    // Create grid dots at intersections
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            const dot = document.createElement('div');
            dot.className = 'grid-dot';
            dot.style.left = `${i * gridSize}px`;
            dot.style.top = `${j * gridSize}px`;
            gridBg.appendChild(dot);
            
            // Animate dots with random delays
            gsap.to(dot, {
                duration: 0.8,
                delay: Math.random() * 1.5,
                scale: 1,
                ease: 'elastic.out(1, 0.5)'
            });
        }
    }
    
    // Create pulsing animation for grid lines
    gsap.to('.grid-line', {
        opacity: 0.5,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
    });
    
    // Create floating animation for dots
    gsap.to('.grid-dot', {
        y: () => Math.random() * 10 - 5,
        x: () => Math.random() * 10 - 5,
        duration: () => Math.random() * 3 + 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
    });
}




// --- ASTRO DRIVE
document.addEventListener("DOMContentLoaded", function () {
  // Add animation classes with delays
  const elementsToAnimate = [
    { element: document.querySelector(".content h1"), delay: 0 },
    { element: document.querySelector(".intro-line"), delay: 0.3 },
    {
      element: document.querySelectorAll(".content p:not(.intro-line)")[0],
      delay: 0.6,
    },
    {
      element: document.querySelectorAll(".content p:not(.intro-line)")[1],
      delay: 0.9,
    },
    { element: document.querySelector(".social-links"), delay: 1.2 },
  ];

  elementsToAnimate.forEach((item) => {
    if (item.element) {
      item.element.classList.add("fade-in");
      item.element.style.animationDelay = `${item.delay}s`;
    }
  });

  // Add hover effects for social links
  const socialLinks = document.querySelectorAll(".social-link");
  socialLinks.forEach((link) => {
    link.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-5px)";
      this.style.textShadow = "0 0 15px rgba(100, 149, 237, 0.8)";
    });

    link.addEventListener("mouseleave", function () {
      this.style.transform = "";
      this.style.textShadow = "";
    });
  });

  // Handle window resize
  function handleResize() {
    // Any responsive JS adjustments would go here
  }

  // Debounce resize events
  let resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(handleResize, 250);
  });
});

// --- DevDiary
document.addEventListener("DOMContentLoaded", function () {
  // Create stars
  const galaxyGrid = document.querySelector(".galaxy-grid");
  for (let i = 0; i < 100; i++) {
    const star = document.createElement("div");
    star.className = "star";
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.width = `${Math.random() * 3 + 1}px`;
    star.style.height = star.style.width;
    star.style.animationDelay = `${Math.random() * 5}s`;
    galaxyGrid.appendChild(star);
  }

  // Animation for elements - now with bounce effect
  gsap.from(".robot-image", {
    duration: 1.5,
    opacity: 0,
    x: -100,
    ease: "bounce.out", // Changed to bounce easing
  });

  // Rest of the JavaScript remains the same
  gsap.from(".title", {
    duration: 1,
    opacity: 0,
    y: 50,
    delay: 0.5,
    ease: "back.out",
  });

  gsap.from(".subtitle", {
    duration: 1,
    opacity: 0,
    y: 50,
    delay: 0.8,
    ease: "back.out",
  });

  gsap.from(".cta-button", {
    duration: 1,
    opacity: 0,
    y: 50,

    ease: "back.out",
  });

  // Handle button click
  const letsGoBtn = document.getElementById("letsGoBtn");
  if (letsGoBtn) {
    letsGoBtn.addEventListener("click", function () {
      gsap.to(this, {
        scale: 0.9,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        onComplete: function () {
          window.location.href = "next-page.html";
        },
      });
    });
  }
});

//  --- THE SERVICES ---
document.addEventListener("DOMContentLoaded", function () {
  const spaceBg = document.getElementById("spaceBg");

  // Create stars
  for (let i = 0; i < 200; i++) {
    const star = document.createElement("div");
    star.classList.add("star");

    // Random size between 1px and 3px
    const size = Math.random() * 2 + 1;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;

    // Random position
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;

    // Random opacity
    star.style.opacity = Math.random() * 0.8 + 0.2;

    spaceBg.appendChild(star);

    // Animate twinkling
    gsap.to(star, {
      duration: Math.random() * 3 + 1,
      opacity: Math.random() * 0.5,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    });
  }

  // Create shooting stars occasionally
  function createShootingStar() {
    const shootingStar = document.createElement("div");
    shootingStar.classList.add("shooting-star");

    // Start position (off screen to top-left)
    shootingStar.style.left = `${Math.random() * 20}%`;
    shootingStar.style.top = `${Math.random() * 20}%`;

    spaceBg.appendChild(shootingStar);

    // Animate shooting star
    gsap.fromTo(
      shootingStar,
      {
        opacity: 0,
        x: 0,
        y: 0,
      },
      {
        opacity: 1,
        x: "100vw",
        y: "100vh",
        duration: 1.5,
        ease: "power1.out",
        onComplete: () => {
          spaceBg.removeChild(shootingStar);
        },
      }
    );

    // Schedule next shooting star
    setTimeout(createShootingStar, Math.random() * 5000 + 3000);
  }

  // Start shooting stars
  setTimeout(createShootingStar, 2000);

  // Create some planets in the background
  for (let i = 0; i < 3; i++) {
    const planet = document.createElement("div");
    planet.classList.add("planet");

    // Random size between 100px and 300px
    const size = Math.random() * 200 + 100;
    planet.style.width = `${size}px`;
    planet.style.height = `${size}px`;

    // Random position (off to sides)
    planet.style.left = `${Math.random() > 0.5 ? -size / 2 : 100 - size / 2}%`;
    planet.style.top = `${Math.random() * 70 + 15}%`;

    // Random color
    const colors = ["#4facfe", "#00f2fe", "#7928ca", "#ff0080"];
    planet.style.backgroundColor =
      colors[Math.floor(Math.random() * colors.length)];

    spaceBg.appendChild(planet);

    // Make them visible
    gsap.to(planet, {
      duration: 2,
      opacity: 0.1,
      ease: "power1.out",
    });
  }

  // Animate service cards on scroll into view
  const serviceCards = document.querySelectorAll(".service-card");

  serviceCards.forEach((card, index) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: "top 80%",
        toggleActions: "play none none none",
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      delay: index * 0.1,
      ease: "back.out(1.7)",
    });
  });

  // Animate contact button
  gsap.from(".contact-btn", {
    scrollTrigger: {
      trigger: ".contact-btn",
      start: "top 80%",
      toggleActions: "play none none none",
    },
    y: 30,
    opacity: 0,
    duration: 1,
    ease: "power2.out",
  });
});


//  --- CONNECT ---

document.addEventListener('DOMContentLoaded', function() {    
    // Create swirling effect
    const swirlContainer = document.getElementById('swirl-container');
    const swirlCount = 15;
    
    for (let i = 0; i < swirlCount; i++) {
        const swirl = document.createElement('div');
        swirl.classList.add('swirl');
        
        // Size increases with index
        const size = 50 + (i * 20);
        swirl.style.width = `${size}px`;
        swirl.style.height = `${size}px`;
        
        // Position near the left side
        swirl.style.left = `${-size/4 + Math.random() * 30}px`;
        swirl.style.top = `${(100 - size/3)/2 + (Math.random() * 50 - 25)}%`;
        
        // Random opacity
        swirl.style.opacity = 0.1 + (Math.random() * 0.3);
        
        swirlContainer.appendChild(swirl);
        
        // Animate each swirl with GSAP
        gsap.to(swirl, {
            rotation: 360 * (Math.random() > 0.5 ? 1 : -1),
            duration: 15 + (Math.random() * 20),
            repeat: -1,
            ease: "none"
        });
        
        // Pulse animation
        gsap.to(swirl, {
            scale: 1 + (Math.random() * 0.3),
            opacity: 0.05 + (Math.random() * 0.2),
            duration: 2 + (Math.random() * 3),
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }
    
    // Create animated background with GSAP
    const background = document.getElementById('connect-background');
    
    // Create SVG for background
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    background.appendChild(svg);
    
    // Create gradient
    const defs = document.createElementNS(svgNS, "defs");
    svg.appendChild(defs);
    
    const gradient = document.createElementNS(svgNS, "linearGradient");
    gradient.setAttribute("id", "grad1");
    gradient.setAttribute("x1", "0%");
    gradient.setAttribute("y1", "0%");
    gradient.setAttribute("x2", "100%");
    gradient.setAttribute("y2", "100%");
    defs.appendChild(gradient);
    
    const stop1 = document.createElementNS(svgNS, "stop");
    stop1.setAttribute("offset", "0%");
    stop1.setAttribute("stop-color", "#1a0029");
    gradient.appendChild(stop1);
    
    const stop2 = document.createElementNS(svgNS, "stop");
    stop2.setAttribute("offset", "100%");
    stop2.setAttribute("stop-color", "#3a0068");
    gradient.appendChild(stop2);
    
    // Create background rect
    const rect = document.createElementNS(svgNS, "rect");
    rect.setAttribute("width", "100%");
    rect.setAttribute("height", "100%");
    rect.setAttribute("fill", "url(#grad1)");
    svg.appendChild(rect);
    
    // Add some additional swirl effects
    for (let i = 0; i < 5; i++) {
        const smallSwirl = document.createElement('div');
        smallSwirl.classList.add('swirl');
        
        const size = 10 + (i * 5);
        smallSwirl.style.width = `${size}px`;
        smallSwirl.style.height = `${size}px`;
        smallSwirl.style.border = '1px solid rgba(138, 43, 226, 0.8)';
        
        // Position randomly on the left side
        smallSwirl.style.left = `${10 + Math.random() * 20}%`;
        smallSwirl.style.top = `${Math.random() * 80 + 10}%`;
        
        swirlContainer.appendChild(smallSwirl);
        
        // Animate with different timing
        gsap.to(smallSwirl, {
            rotation: 360 * (Math.random() > 0.5 ? 1 : -1),
            duration: 5 + (Math.random() * 8),
            repeat: -1,
            ease: "none"
        });
        
        // Move around slightly
        gsap.to(smallSwirl, {
            x: Math.random() * 30 - 15,
            y: Math.random() * 30 - 15,
            duration: 3 + (Math.random() * 2),
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }
    
    // Create animated particles
    for (let i = 0; i < 50; i++) {
        const particle = document.createElementNS(svgNS, "circle");
        const size = Math.random() * 2 + 1;
        
        particle.setAttribute("r", size);
        particle.setAttribute("fill", "rgba(255, 255, 255, " + (Math.random() * 0.5) + ")");
        
        const xPos = Math.random() * 100;
        const yPos = Math.random() * 100;
        
        particle.setAttribute("cx", xPos + "%");
        particle.setAttribute("cy", yPos + "%");
        
        svg.appendChild(particle);
        
        // Animate each particle
        gsap.to(particle, {
            cx: xPos + (Math.random() * 10 - 5) + "%",
            cy: yPos + (Math.random() * 10 - 5) + "%",
            opacity: Math.random() * 0.7 + 0.3,
            duration: Math.random() * 5 + 3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }

    // Animate content elements
    // Main title animation
    gsap.to("#connect-title", {
        opacity: 1,
        duration: 1,
        delay: 0.5
    });
    
    // Social icons animation
    gsap.to(".social-icon", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        delay: 1
    });
    
    // Message box animation
    gsap.to("#message-box", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: 2
    });
    
    // Footer text animation
    gsap.to("#footer-text", {
        opacity: 1,
        duration: 1,
        delay: 2.5
    });
    
    // Add message sending functionality
    document.getElementById('send-button').addEventListener('click', sendMessage);
    
    // Also allow sending with Enter key
    document.getElementById('message-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    function sendMessage() {
        const messageInput = document.getElementById('message-input');
        const message = messageInput.value.trim();
        
        if (message) {
            // Here you would typically send the message to a server
            // For now, we'll just clear the input and show a brief animation
            messageInput.value = '';
            
            // Flash effect on button to confirm sending
            gsap.to('#send-button', {
                backgroundColor: 'rgba(138, 43, 226, 0.9)',
                duration: 0.3,
                yoyo: true,
                repeat: 1
            });
            
            // Show a confirmation message
            const sendBtn = document.getElementById('send-button');
            const originalText = sendBtn.textContent;
            sendBtn.innerHTML = 'Message Sent! <i class="fas fa-check"></i>';
            setTimeout(() => {
                sendBtn.innerHTML = originalText + ' <i class="fas fa-paper-plane"></i>';
            }, 2000);

            document.getElementById('send-button').innerHTML = 'Message Sent! <i class="fas fa-check"></i>';
            
            setTimeout(() => {
                document.getElementById('send-button').innerHTML = currentText;
            }, 2000);
        }
    }

    // Handle window resize
    window.addEventListener('resize', function() {
        // You could add responsive adjustments here if needed
    });
});