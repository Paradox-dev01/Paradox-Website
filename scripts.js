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
document.querySelectorAll('a, button, .enter-button, .nav-arrow').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.classList.add('hover');
  });
  el.addEventListener('mouseleave', () => {
    cursor.classList.remove('hover');
  });
});


// Scroll Animation Observer
const sections = document.querySelectorAll('.section');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    } else {
      entry.target.classList.remove('visible');
    }
  });
}, {
  threshold: 0.3
});

sections.forEach(section => observer.observe(section));


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
const canvas = document.getElementById('starfield');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let stars = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    stars = Array.from({ length: 200 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.5
    }));
  }

  function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff';
    stars.forEach(star => {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(drawStars);
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  drawStars();
}



gsap.registerPlugin(ScrollTrigger);



//  --- LANDING PAGE --- 

const bgBottom = document.querySelector('.bg-bottom');
const astronaut = document.getElementById('astronaut');
const landingSection = document.getElementById('landing');
const landingBg = document.getElementById('landing-background');

window.addEventListener('scroll', () => {
  const rect = landingSection.getBoundingClientRect();
  const windowHeight = window.innerHeight;

  // Calculate how much of landing section is out of view (0 to 1)
  const scrollProgress = 1 - Math.max(0, Math.min(1, rect.bottom / windowHeight));

  // Apply downward translation to bg-bottom (max ~50px)
  const translateY = Math.min(scrollProgress * 50, 50); // Max 50px movement
  bgBottom.style.transform = `translateY(${translateY}px)`;

  // Fade out landing background normally
  landingBg.style.opacity = 1 - scrollProgress;
});

// Scroll navigation
function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

window.addEventListener('scroll', () => {
  const rect = landingSection.getBoundingClientRect();
  const windowHeight = window.innerHeight;
  // Fade based on scroll progress (0 = top of screen, 1 = fully out of view)
  const fadeProgress = 1 - Math.max(0, Math.min(1, rect.bottom / windowHeight));
  landingBg.style.opacity = 1 - fadeProgress;
  // Trigger fly-away if scrolled past halfway
  if (fadeProgress > 0.1) {
    astronaut.classList.add('fly-away');
  } else {
    astronaut.classList.remove('fly-away');
  }
});

function triggerFlyAway() {
  astronaut.classList.add('fly-away');
}
// Add click listeners to trigger it manually
const landingClickableItems = [
  astronaut,
  ...document.querySelectorAll('#landing button'),
  ...document.querySelectorAll('#landing .scroll-down-arrow')
];
landingClickableItems.forEach(item => {
  item?.addEventListener('click', () => {
    triggerFlyAway();
  });
});

// Show nav arrow only after scrolling 60%
const navArrow = document.querySelector('.nav-arrow');
window.addEventListener('scroll', () => {
  const pct = window.scrollY / window.innerHeight;
  navArrow.style.display = pct > 0.6 ? 'block' : 'none';
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
  // Create stars (fewer on mobile)
  const starsContainer = document.getElementById("astro-stars");
  const isMobile = window.innerWidth < 768;
  const numStars = isMobile ? 100 : 200;

  for (let i = 0; i < numStars; i++) {
    const star = document.createElement("div");
    star.className = "astro-star";
    const size = Math.random() * (isMobile ? 2 : 3) + 1;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    starsContainer.appendChild(astro-star);
  }

  // Title Animation (character by character)
  const titleElement = document.querySelector(".animate-title");
  const titleText = titleElement.textContent;
  titleElement.textContent = "";

  const titleTl = gsap.timeline();
  titleTl.to(titleElement, {
    opacity: 1,
    duration: 0.1,
  });

  // Animate each character of the title
  for (let i = 0; i < titleText.length; i++) {
    const char = document.createElement("span");
    char.textContent = titleText[i];
    char.style.opacity = "0";
    char.style.display = "inline-block";
    titleElement.appendChild(char);

    titleTl.to(char, {
      opacity: 1,
      duration: 0.05,
      ease: "none",
    });
  }

  // Text Lines Animation (sliding)
  const textLines = document.querySelectorAll(".text-line");

  gsap
    .timeline({
      delay: 1, // Start after title animation
    })
    .to(textLines, {
      opacity: 1,
      x: 0,
      duration: 1,
      stagger: 0.2,
      ease: "power2.out",
    })
    .to(
      ".projects-link",
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "back.out",
      },
      "-=0.4"
    );

  // Animate stars
  gsap.to(".astro-star", {
    duration: "random(2, 4)",
    opacity: "random(0.2, 1)",
    repeat: -1,
    yoyo: true,
    ease: "power1.inOut",
    stagger: {
      amount: 4,
      from: "random",
    },
  });

  // Parallax effect - only on desktop
  if (!isMobile) {
    window.addEventListener("mousemove", (e) => {
      const mouseX = e.clientX / window.innerWidth - 0.5;
      const mouseY = e.clientY / window.innerHeight - 0.5;

      gsap.to(".astro-stars", {
        duration: 1,
        x: mouseX * 50,
        y: mouseY * 50,
        ease: "power1.out",
      });
    });
  }

  // Handle window resize
  window.addEventListener("resize", function () {
    const newIsMobile = window.innerWidth < 768;
    if (isMobile !== newIsMobile) {
      // Recreate stars if mobile state changed
      starsContainer.innerHTML = "";
      const newNumStars = newIsMobile ? 100 : 200;

      for (let i = 0; i < newNumStars; i++) {
        const star = document.createElement("div");
        star.className = "astro-star";
        const size = Math.random() * (newIsMobile ? 2 : 3) + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        starsContainer.appendChild(astro-star);
      }
    }
  });
});

// --- DevDiary
// Header animations
gsap.to(".header h1", {
  opacity: 1,
  y: 0,
  duration: 1,
  ease: "power3.out",
});

gsap.to(".header p", {
  opacity: 1,
  y: 0,
  duration: 1,
  delay: 0.3,
  ease: "power3.out",
});

// Section title animation
gsap.to(".section-title", {
  scrollTrigger: {
    trigger: ".section-title",
    start: "top 80%",
    toggleActions: "play none none reverse",
  },
  opacity: 1,
  y: 0,
  duration: 1,
  ease: "power3.out",
});

// Project cards animation
gsap.utils.toArray(".project-card").forEach((card, i) => {
  gsap.to(card, {
    scrollTrigger: {
      trigger: card,
      start: "top 80%",
      toggleActions: "play none none reverse",
    },
    opacity: 1,
    y: 0,
    duration: 1,
    delay: i * 0.2,
    ease: "power3.out",
  });
});


//  --- THE LOGS ---



//  --- CONNECT ---



