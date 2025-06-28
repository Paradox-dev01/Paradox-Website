// Cursor
const cursor = document.querySelector('.custom-cursor');
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
    cursor.classList.remove('idle');
    setTimeout(() => isMoving = false, 100);
  }
});

function updateCursor() {
  cursor.style.left = `${mouseX}px`;
  cursor.style.top = `${mouseY}px`;
  rafRequested = false;
}

  // Idle animation trigger after no movement for 1.5s
let idleTimeout;
document.addEventListener('mousemove', () => {
  clearTimeout(idleTimeout);
  idleTimeout = setTimeout(() => {
    cursor.classList.add('idle');
  }, 1500);
});

  // Click animation
document.addEventListener('mousedown', () => {
  cursor.classList.add('clicked');
});
document.addEventListener('mouseup', () => {
  cursor.classList.remove('clicked');
});

  // Hovering clickable items
document.querySelectorAll('a, button, .enter-button, .nav-arrow, #astronaut').forEach(el => {
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
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.body.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;
  document.querySelector('.scroll-progress-bar').style.width = `${scrollPercent}%`;
});

// Navigation Arrow Scroll
function scrollToNextSection() {
  const visibleSections = Array.from(sections).filter(section =>
    section.getBoundingClientRect().top >= 0
  );
  const next = visibleSections[0] || sections[0];
  next.scrollIntoView({ behavior: 'smooth' });
}

// Optional Starfield Canvas (can remove if not needed)
// const canvas = document.getElementById('starfield');
// if (canvas) {
//   const ctx = canvas.getContext('2d');
//   let stars = [];

//   function resizeCanvas() {
//     canvas.width = window.innerWidth;
//     canvas.height = window.innerHeight;
//     stars = Array.from({ length: 200 }, () => ({
//       x: Math.random() * canvas.width,
//       y: Math.random() * canvas.height,
//       r: Math.random() * 1.5 + 0.5
//     }));
//   }

//   function drawStars() {
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     ctx.fillStyle = '#fff';
//     stars.forEach(star => {
//       ctx.beginPath();
//       ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
//       ctx.fill();
//     });
//     requestAnimationFrame(drawStars);
//   }

//   window.addEventListener('resize', resizeCanvas);
//   resizeCanvas();
//   drawStars();
// }



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
const landingSection = document.getElementById('landing');
const landingBg = document.getElementById('landing-background');
const navArrow = document.querySelector('.nav-arrow');

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
  document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
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
    astronaut.classList.remove('fly-away');
  }

  // Show nav arrow after scrolling 60% of viewport height
  navArrow.style.display = window.scrollY > window.innerHeight * 0.6 ? 'block' : 'none';
});



//  --- CORE ---

//1
gsap.fromTo(
  '.core1-content',
  { x: '150vw' },
  {
    // x: 'calc(50vw - 400px)',
    x: '-50vw',
    // x: '0vw',
    ease: 'none',
    scrollTrigger: {
      trigger: '#core1',
      start: 'top 80%',
      end: 'bottom 20%',
      scrub: true,
    }
  }
);

//2
gsap.utils.toArray('.core-card').forEach((card, index) => {
  const cardInner = card.querySelector('.card-inner');

  // Entrance animation
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

  // Flip when scrolling away from #core2
  ScrollTrigger.create({
    trigger: '#core2',
    start: 'bottom 90%',
    end: 'bottom top',
    onUpdate: (self) => {
      if (self.progress > 0.1 && self.direction === 1) {
        gsap.to(cardInner, {
          rotateY: 180,
          duration: 1,
          ease: 'power2.out'
        });
      } else if (self.progress < 0.1 && self.direction === -1) {
        gsap.to(cardInner, {
          rotateY: 0,
          duration: 1,
          ease: 'power2.inOut'
        });
      }
    }
  });
});

// Optional blur effect when leaving section
ScrollTrigger.create({
  trigger: '#core2',
  start: 'bottom bottom',
  end: 'bottom top',
  onLeave: () => document.querySelector('#core2').classList.add('blurred'),
  onLeaveBack: () => document.querySelector('#core2').classList.remove('blurred'),
});


//  --- THE LABS ---

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

  starsContainer.appendChild(lab-star);
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
  })
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
// gsap.from("h1", {
//   y: -50,
//   opacity: 0,
//   duration: 1.5,
//   ease: "back.out",
// });

// gsap.from("p", {
//   y: 30,
//   opacity: 0,
//   duration: 1,
//   stagger: 0.3,
//   ease: "power2.out",
// });

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


//  --- THE LOGS ---



//  --- CONNECT ---



