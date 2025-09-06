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

// =============================================Hovering clickable items

document.querySelectorAll('.logo, a, button, .enter-button, .nav-arrow, #astronaut, .game-card, .carousel img').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.classList.add('hover');
  });
  el.addEventListener("mouseleave", () => {
    cursor.classList.remove("hover");
  });
});

// document.addEventListener("mouseover", (e) => {
//   if (e.target.closest("a, button, input, textarea, select, [role='button'], [onclick], [data-clickable]")) {
//     cursor.classList.add("hover");
//   }
// });
// document.addEventListener("mouseout", (e) => {
//   if (e.target.closest("a, button, input, textarea, select, [role='button'], [onclick], [data-clickable]")) {
//     cursor.classList.remove("hover");
//   }
// });

// document.addEventListener("mouseover", (e) => {
//   if (window.getComputedStyle(e.target).cursor === "pointer") {
//     cursor.classList.add("hover");
//   }
// });
// document.addEventListener("mouseout", () => {
//   cursor.classList.remove("hover");
// });



// =============================================Scroll Progress Bar
window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const docHeight = document.body.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;
  document.querySelector(
    ".scroll-progress-bar"
  ).style.width = `${scrollPercent}%`;
});

// =============================================Navigation Arrow Scroll
const sections = document.querySelectorAll(".section");
function scrollToNextSection() {
  const visibleSections = Array.from(sections).filter(
    (section) => section.getBoundingClientRect().top >= 0
  );
  const next = visibleSections[0] || sections[0];
  next.scrollIntoView({ behavior: "smooth" });
}

const navArrow = document.querySelector(".nav-arrow");
const landingSection = document.getElementById("landing");
const connectSection = document.getElementById("connect");

function checkNavArrowVisibility() {
  const landingRect = landingSection.getBoundingClientRect();
  const connectRect = connectSection.getBoundingClientRect();

  if (
    (landingRect.top <= window.innerHeight && landingRect.bottom >= 0) ||
    (connectRect.top <= window.innerHeight && connectRect.bottom >= 0)
  ) {
    navArrow.style.display = "none";
  } else {
    navArrow.style.display = "block";
  }
}

window.addEventListener("scroll", checkNavArrowVisibility);
window.addEventListener("load", checkNavArrowVisibility);


// ================================================================================================
// ================================================================================================
// ================================================================================================

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(MotionPathPlugin);


// =============================================snap-scroll

gsap.utils.toArray(".snap-section").forEach((el) => {
  ScrollTrigger.create({
    trigger: el,
    start: "top bottom",   // when top of section enters viewport
    end: "top top",  // when bottom of section hits bottom
    snap: {
      snapTo: 1,           // snap to the **end** of section (bottom aligned)
      duration: 0.05,       // faster snap
      ease: "power3.inOut" // snappier easing
    },
    markers: false,        // set true to debug
    scrub: 0,              // no smoothing, instant snap
  });
});




//  ==========================INTRO+CORE BACKGROUND=====================  //
// ----------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------

const canvas = document.getElementById("sci-fi-bg");
const ctx = canvas.getContext("2d");

let width, height, points;

const POINT_COUNT = 200;
const MAX_DISTANCE = 100;

// Initialize canvas size
function resize() {
  width = canvas.clientWidth;
  height = canvas.clientHeight;
  canvas.width = width * devicePixelRatio;
  canvas.height = height * devicePixelRatio;
  ctx.scale(devicePixelRatio, devicePixelRatio);
}
resize();
window.addEventListener("resize", resize);

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
    ctx.fillStyle = "rgba(0, 255, 255, 0.7)";
    ctx.shadowColor = "#0ff";
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
const DISRUPT_RADIUS = 160;

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
  points.forEach((p) => p.update());

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
  points.forEach((p) => p.draw());
});

const landingCore = document.querySelector(".landing-core");

landingCore.addEventListener("mousemove", (e) => {
  const rect = landingCore.getBoundingClientRect();
  disruptX = e.clientX - rect.left;
  disruptY = e.clientY - rect.top;
});

landingCore.addEventListener("mouseleave", () => {
  disruptX = null;
  disruptY = null;
});



//  ---------------------------------------------- LANDING PAGE ----------------------------------------------
//  ----------------------------------------------------------------------------------------------------------
//  ----------------------------------------------------------------------------------------------------------

  console.log("landing - Script loaded!");

// === SELECT DOM ELEMENTS ===
const bgBottom = document.querySelector(".bg-bottom");
const astronaut = document.getElementById("astronaut");
// const landingSection = document.getElementById('landing');
const landingBg = document.getElementById("landing-background");
// const navArrow = document.querySelector('.nav-arrow');

// === FLY-AWAY ANIMATION TRIGGER ===
function triggerFlyAwayAndScroll() {
  astronaut.style.pointerEvents = "none";

  const waveX = gsap.utils.random(-300, 300);
  const waveY = gsap.utils.random(-400, -700);
  const rotate = gsap.utils.random(-200, 200);

  // Create a floaty motion path
  gsap
    .timeline({
      onComplete: () => {
        scrollToSection("core1");
        gsap.set(astronaut, { clearProps: "all" });
        astronaut.style.pointerEvents = "auto";
      },
    })
    .to(astronaut, {
      duration: 1.6,
      ease: "power1.inOut",
      motionPath: {
        path: [
          { x: 0, y: 0 },
          { x: waveX * 0.5, y: waveY * 0.4 },
          { x: waveX, y: waveY },
        ],
        curviness: 1.5,
      },
      rotation: rotate,
      scale: 0.3,
      opacity: 0,
    });
}

// === SCROLL TO SECTION ===
function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({ behavior: "smooth" });
}

// === CLICK TO TRIGGER FLY-AWAY ===
const landingClickableItems = [
  ...document.querySelectorAll("#landing button"),
  ...document.querySelectorAll("#landing .scroll-down-arrow"),
];

// Astronaut click: fly away AND scroll to core1
astronaut?.addEventListener("click", triggerFlyAwayAndScroll);

// Other items trigger fly-away
// landingClickableItems.forEach(item => {
//   item?.addEventListener('click', triggerFlyAway);
// });

// === SCROLL EVENTS ===
window.addEventListener("scroll", () => {
  const rect = landingSection.getBoundingClientRect();
  const windowHeight = window.innerHeight;

  // SCROLL PROGRESS (0 = fully visible, 1 = fully out of view)
  const scrollProgress =
    1 - Math.max(0, Math.min(1, rect.bottom / windowHeight));

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
    astronaut.classList.add("fly-away");
  } else {
    astronaut.classList.remove("fly-away");
  }
});

// Show nav arrow only after scrolling 60%
window.addEventListener("scroll", () => {
  const pct = window.scrollY / window.innerHeight;
  navArrow.classList.toggle("visible", pct > 0.6);
});

//  ---------------------------------------------- CORE ----------------------------------------------
//  ----------------------------------------------------------------------------------------------------------
//  ----------------------------------------------------------------------------------------------------------

  console.log("core - Script loaded!");

//1
const core1 = document.getElementById("core1");
const coreObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        core1.classList.add("fade-in");
        // optional: remove after first load
        // coreObserver.unobserve(core1);
      }
    });
  },
  { threshold: 0.3 }
);

coreObserver.observe(core1);

//2
gsap.utils.toArray(".core-card").forEach((card, index) => {
  gsap.fromTo(
    card,
    {
      y: index === 1 ? 20 : 60,
      opacity: 0,
      rotateY: 30,
      scale: 0.8,
    },
    {
      scrollTrigger: {
        trigger: card,
        start: "top 85%",
        toggleActions: "play none none reset",
      },
      y: 0,
      opacity: 1,
      rotateY: 0,
      scale: 1,
      duration: 1.2,
      ease: "power3.out",
      delay: index * 0.1,
    }
  );
});

// Pin Core 2 while Lab scrolls over
ScrollTrigger.create({
  trigger: "#core2",
  start: "top top",
  endTrigger: "#lab",
  end: "top top",
  pin: true,
  pinSpacing: false, // avoids extra space; keeps canvas & cursor visible
  scrub: true,
  snap: true
});

ScrollTrigger.create({
  trigger: "#core2",
  start: "bottom bottom",
  end: "bottom top",
  toggleClass: { targets: ".card-inner", className: "flipped" },
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



//  ---------------------------------------------- SHARED ----------------------------------------------
//  ----------------------------------------------------------------------------------------------------------
//  ----------------------------------------------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {

  // GSAP: Stars
  const starsContainer = document.getElementById("lab-stars");
  
  const vaultStarsContainer = document.createElement("div");
  vaultStarsContainer.classList.add("lab-stars");
  document.getElementById("game-vault-cards").prepend(vaultStarsContainer);

  const starCount = 120;

  for (let i = 0; i < starCount; i++) {
    const star = document.createElement("div");
    star.classList.add("lab-star");

    const size = Math.random() * 2 + 1;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.left = `${Math.random() * 100}%`;

    starsContainer.appendChild(star);

    gsap.to(star, {
      opacity: Math.random() * 0.6 + 0.2,
      duration: Math.random() * 2 + 1,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: Math.random() * 3,
    });
  }

  // Neon circle animation
  gsap.to(".neon-circle", {
    scale: 1.05,
    opacity: 0.6,
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });

  // Mouse parallax
  document.addEventListener("mousemove", (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 30;
    const y = (e.clientY / window.innerHeight - 0.5) * 30;

    gsap.to(".neon-circle", {
      x,
      y,
      duration: 1,
      ease: "power3.out",
    });

    gsap.to(".lab-stars", {
      x: x * 0.5,
      y: y * 0.5,
      duration: 1,
      ease: "power3.out",
    });
  });


  

  // Select all showcase cards
  const showcaseCards = document.querySelectorAll(".showcase-card");

  // Hover animation for each card
  showcaseCards.forEach(card => {
    card.addEventListener("mouseenter", () => {
      gsap.to(card, { scale: 1.05, duration: 0.3, ease: "power2.out" });
    });
    card.addEventListener("mouseleave", () => {
      gsap.to(card, { scale: 1, duration: 0.3, ease: "power2.out" });
    });
  });

  // Entry animation for Lab section header
  gsap.from(".showcase-header h2", {
    y: -40,
    opacity: 0,
    duration: 1.2,
    ease: "power2.out",
  });

  gsap.from(".showcase-header p", {
    y: 20,
    opacity: 0,
    duration: 1,
    delay: 0.2,
    ease: "power2.out",
  });

  // Animate each card on scroll
  gsap.utils.toArray(".showcase-card").forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: "top 85%",
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      delay: i * 0.1,
      ease: "back.out(1.7)",
    });
  });

  
// gameCards.forEach(card => {
//   // Hover animation with GSAP
//   card.addEventListener("mouseenter", () => {
//     gsap.to(card, { scale: 1.05, duration: 0.3, ease: "power2.out" });
//   });
//   card.addEventListener("mouseleave", () => {
//     gsap.to(card, { scale: 1, duration: 0.3, ease: "power2.out" });
//   });
// });

  
//   // Entry animation
//   gsap.from(".lab-content h2", {
//     y: -40,
//     opacity: 0,
//     duration: 1.2,
//     ease: "power2.out",
//   });

//   gsap.from(".lab-content p", {
//     y: 20,
//     opacity: 0,
//     duration: 1,
//     delay: 0.2,
//     stagger: 0.2,
//     ease: "power2.out",
//   });

//   gsap.from(".project-title", {
//     scrollTrigger: {
//       trigger: ".project-title",
//       start: "top 80%",
//     },
//     y: 30,
//     opacity: 0,
//     duration: 1,
//     ease: "power2.out",
//   });

//   gsap.utils.toArray(".project-card").forEach((card, i) => {
//     gsap.from(card, {
//       scrollTrigger: {
//         trigger: card,
//         start: "top 85%",
//       },
//       y: 50,
//       opacity: 0,
//       duration: 0.8,
//       delay: i * 0.1,
//       ease: "back.out(1.7)",
//     });
//   });

});



//  ---------------------------------------------- THE LABS ----------------------------------------------
//  ----------------------------------------------------------------------------------------------------------
//  ----------------------------------------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {

  console.log("lab - Script loaded!");

  document.querySelectorAll(".project-link-area").forEach((link) => {
    link.addEventListener("click", function (e) {
      console.log("Link clicked:", this);

      if (this.dataset.status === "under-construction") {
        e.preventDefault();
        alert(
          "🚧 This project is currently under construction.\n\nIn the meantime, feel free to explore AstroDrive, which is already available."
        );
      }
    });
  });

});



// ---------------------------------------------- EPC ----------------------------------------------
//  ----------------------------------------------------------------------------------------------------------
//  ----------------------------------------------------------------------------------------------------------




// ---------------------------------------------- ASTRO DRIVE


  console.log("astrodrive - Script loaded!");




//  ---------------------------------------------- GAME VAULT ----------------------------------------------
//  ----------------------------------------------------------------------------------------------------------
//  ----------------------------------------------------------------------------------------------------------


// ------------------ Attach Click Events ------------------

const gameCards = document.querySelectorAll(".game-card");

gameCards.forEach(card => {
  card.addEventListener("click", () => {
    const key = card.getAttribute("data-game-key");
    showGameDetails(key);
  });
});




//  ----------------------------------------------GAME INFO ZONE-----------------------------------------------
//  ----------------------------------------------------------------------------------------------------------
//  ----------------------------------------------------------------------------------------------------------

  console.log("game-vault - Script loaded!");

const gameData = {
  "iiuc-tension-run": {
    title: "IIUC Tension Run",
    description: `
      <p><strong>Genre:</strong> Endless Runner</p> </br>
      <p>Campus-inspired runner game where players dodge exams, chase deadlines, and collect knowledge points.</p>
      </br>
      <p><strong>Status:</strong> Completed</p>
    `,
    image: "assets/games/iiuc-tension-run/iiuc-tension-run-logo.png",
    trailer: "assets/games/iiuc-tension-run/iiuc-tension-run-trailer.mp4",
    images: [
      "assets/games/iiuc-tension-run/1.png",
      "assets/games/iiuc-tension-run/2.png",
      "assets/games/iiuc-tension-run/3.png"
    ]
  }
};

function getImagesForGame(folderPath) {
  const images = [];
  let index = 1;

  while (true) {
    const imgPath = `${folderPath}/${index}.jpg`;
    const img = new Image();
    img.src = imgPath;

    if (img.complete && img.naturalWidth !== 0) {
      images.push(imgPath);
      index++;
    } else break;
  }

  return images;
}

// DOM elements
const gameInfoZone = document.getElementById("game-info-zone");
const gameDetails = document.getElementById("game-details");

// ------------------ Show Game Details ------------------
function showGameDetails(gameKey) {
  const data = gameData[gameKey];
  if (!data) return;

  // const folder = `assets/games/${gameKey}`;
  // const images = getImagesForGame(folder);
  // const imagesHTML = images.map(img => `<img src="${img}" alt="">`).join("");

  // Build image carousel slides
  const imagesHTML = data.images ? data.images.map(img => `<img src="${img}" alt="">`).join("") : "";

  gameDetails.innerHTML = `
    <div class="game-detail-container">
      <div class="game-detail-left">
        <div class="game-logo-title">
          <img src="${data.image}" alt="${data.title}" class="game-detail-logo">
          <h2>${data.title}</h2>
        </div>
        <div class="game-description">${data.description}</div>
      </div>
      <div class="game-detail-right">
        ${data.trailer ? `<video autoplay loop muted controls src="${data.trailer}" class="game-detail-video"></video>` : `<p class="no-trailer">No trailer available yet.</p>`}
        ${data.images ? `
          <div class="carousel">
            <button class="carousel-arrow left">&#8249;</button>
            <div class="carousel-track">${imagesHTML}</div>
            <button class="carousel-arrow right">&#8250;</button>
          </div>` : ""}
      </div>
    </div>
  `;

  
  gameInfoZone.classList.add("active");  

  // Animate in
  gsap.fromTo(gameInfoZone, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" });
  gameInfoZone.scrollIntoView({ behavior: "smooth" });

  // Carousel logic
  const track = gameDetails.querySelector(".carousel-track");
  const leftBtn = gameDetails.querySelector(".carousel-arrow.left");
  const rightBtn = gameDetails.querySelector(".carousel-arrow.right");

  if (track && leftBtn && rightBtn) {
    initCarousel(track, leftBtn, rightBtn);
    enableImagePopup();
  }
}

function initCarousel(track, leftBtn, rightBtn) {
  // const slides = Array.from(track.children);
  // let index = 0;

  // function updateCarousel() {
  //   const offset = -index * (slides[0].offsetWidth + 8); // 8px = gap
  //   track.style.transform = `translateX(${offset}px)`;
  // }

  // leftBtn.addEventListener("click", () => {
  //   index = (index - 1 + slides.length) % slides.length;
  //   updateCarousel();
  // });

  // rightBtn.addEventListener("click", () => {
  //   index = (index + 1) % slides.length;
  //   updateCarousel();
  // });

  // updateCarousel();

  const slides = track.children;
  const total = slides.length;
  let index = 0;

  function updateCarousel() {
    track.style.transform = `translateX(-${index * 110}px)`;
  }

  leftBtn.addEventListener("click", () => {
    index = (index - 1 + total) % total; // loop
    updateCarousel();
  });

  rightBtn.addEventListener("click", () => {
    index = (index + 1) % total; // loop
    updateCarousel();
  });

  updateCarousel();
}

//------------------- Auto Hide on Scroll Down -----------------
// let lastScrollY = window.scrollY;

// window.addEventListener("scroll", () => {
//   if (!gameInfoZone || gameInfoZone.offsetTop === 0) return;

//   if (window.scrollY > lastScrollY) { 
    // Scrolling down
//     const rect = gameInfoZone.getBoundingClientRect();
//     if (rect.top < -200) { // user scrolled past section
//       gsap.to(gameInfoZone, { opacity: 0, y: 50, duration: 0.5 });
//       setTimeout(() => {
//         gameDetails.innerHTML = "";
//         gameInfoZone.classList.remove("active"); // <— hide it fully
//       }, 600);
//     }
//   }
//   lastScrollY = window.scrollY;
// });



// ------------------ Image Popup Logic ------------------
// const imagePopup = document.getElementById("image-popup");
// const popupImg = document.querySelector(".popup-img");
// const closePopup = document.querySelector(".close-popup");

// function enableImagePopup() {
//   const images = document.querySelectorAll(".carousel-track img");
//   images.forEach(img => {
//     img.addEventListener("click", () => {
//       popupImg.src = img.src;
//       imagePopup.classList.add("active");

//       gsap.fromTo(popupImg, 
//         { scale: 0.7, opacity: 0 }, 
//         { scale: 1, opacity: 1, duration: 0.4, ease: "power3.out" }
//       );
//     });
//   });
// }
// Close popup
// closePopup.addEventListener("click", () => {
//   gsap.to(imagePopup, { opacity: 0, scale: 0.9, duration: 0.3, onComplete: () => {
//     imagePopup.classList.remove("active");
//     imagePopup.style.opacity = "1"; // reset
//     popupImg.src = "";
//   }});
// });
// Optional: click outside to close
// imagePopup.addEventListener("click", (e) => {
//   if (e.target === imagePopup) {
//     closePopup.click();
//   }
// });

// ------------------ Image Popup Logic ------------------ temp
// Select elements
const popup = document.getElementById("image-popup");
const popupImg = popup.querySelector(".popup-img");
const closePopup = popup.querySelector(".close-popup");

// Add click event to all carousel images
document.querySelectorAll(".carousel img").forEach(img => {
  img.addEventListener("click", () => {
    popup.style.display = "flex"; // show popup
    popupImg.src = img.src;       // set popup image
  });
});

// Close popup when clicking X
closePopup.addEventListener("click", () => {
  popup.style.display = "none";
});

// Optional: close popup when clicking outside the image
popup.addEventListener("click", e => {
  if(e.target === popup) popup.style.display = "none";
});






// ---------------------------------------------- DEV DIARY ----------------------------------------------
//  ----------------------------------------------------------------------------------------------------------
//  ----------------------------------------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", function () {

  console.log("dev-diary - Script loaded!");

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

  document.addEventListener("DOMContentLoaded", () => {
    const elements = document.querySelectorAll(".autoShow");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
          }
        });
      },
      { threshold: 0.2 }
    );

    elements.forEach((el) => observer.observe(el));
  });

});


//  ---------------------------------------------- THE SERVICES ----------------------------------------------
//  ----------------------------------------------------------------------------------------------------------
//  ----------------------------------------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
  
  console.log("services - Script loaded!");

  const spaceBg = document.getElementById("spaceBg");
  document.addEventListener("DOMContentLoaded", () => {
    // Select the services section and swirl container
    const servicesSection = document.getElementById("services"); // Replace with your actual section ID
    const swirlContainer = document.getElementById("swirl-container");
    const swirlCount = 15;

    // Dynamically position swirl container within the top half of the services section
    const servicesHeight = servicesSection.offsetHeight;
    const topHalfHeight = servicesHeight / 2;

    swirlContainer.style.top = `0`; // Keep it in the top half
    swirlContainer.style.height = `${topHalfHeight}px`; // Limit the container height to the top half of the services section

    // Create and animate the swirls
    for (let i = 0; i < swirlCount; i++) {
      const swirl = document.createElement("div");
      swirl.classList.add("swirl");

      // Random size for each swirl
      const size = 50 + i * 20;
      swirl.style.width = `${size}px`;
      swirl.style.height = `${size}px`;

      // Position the swirl within the top half of the services section
      const positionTop = Math.random() * topHalfHeight;
      swirl.style.top = `${positionTop}px`;

      swirl.style.left = `${-size / 4 + Math.random() * 30}px`;

      // Random opacity and animation
      swirl.style.opacity = 0.1 + Math.random() * 0.3;

      swirlContainer.appendChild(swirl);

      // Animate each swirl with GSAP
      gsap.to(swirl, {
        rotation: 360 * (Math.random() > 0.5 ? 1 : -1),
        duration: 15 + Math.random() * 20,
        repeat: -1,
        ease: "none",
      });

      // Pulse animation for swirl
      gsap.to(swirl, {
        scale: 1 + Math.random() * 0.3,
        opacity: 0.05 + Math.random() * 0.2,
        duration: 2 + Math.random() * 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }

    // Handle resize if needed
    window.addEventListener("resize", () => {
      const servicesHeight = servicesSection.offsetHeight;
      const topHalfHeight = servicesHeight / 2;
      swirlContainer.style.height = `${topHalfHeight}px`;
    });
  });

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

//==================== Animate elements

  // Animate cards into view
  const serviceCards = document.querySelectorAll(".service-card");
  serviceCards.forEach((card, index) => {
    ScrollTrigger.create({
      trigger: card,
      start: "top 80%",
      onEnter: () => {
        gsap.fromTo(
          card,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: "sine.inOut", delay: index * 0.1 }
        );
      },
      onEnterBack: () => {
        gsap.fromTo(
          card,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: "sine.inOut", delay: index * 0.1 }
        );
      },
    });
  });

  // Animate contact button into view
  ScrollTrigger.create({
    trigger: ".contact-btn",
    start: "top 100%",
    onEnter: () => {
      gsap.fromTo(
        ".contact-btn",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.5, ease: "sine.inOut" }
      );
    }, 
    onEnterBack: () => {
      gsap.fromTo(
        ".contact-btn",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.5, ease: "sine.inOut" }
      );
    }, 
  });

  // contact button shines when hovering over cards
  const contactBtn = document.querySelector(".contact-btn");
  const cards = document.querySelectorAll(".service-card");

  cards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      contactBtn.classList.add("shine");
    });

    card.addEventListener("mouseleave", () => {
      contactBtn.classList.remove("shine");
    });
  });



});

//  ---------------------------------------------- CONNECT ----------------------------------------------
//  ----------------------------------------------------------------------------------------------------------
//  ----------------------------------------------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", function () {

  console.log("connect - Script loaded!");

  // Create swirling effect
  const swirlContainer = document.getElementById("swirl-container");
  const swirlCount = 15;

  for (let i = 0; i < swirlCount; i++) {
    const swirl = document.createElement("div");
    swirl.classList.add("swirl");

    // Size increases with index
    const size = 50 + i * 20;
    swirl.style.width = `${size}px`;
    swirl.style.height = `${size}px`;

    // Position near the left side
    swirl.style.left = `${-size / 4 + Math.random() * 30}px`;
    swirl.style.top = `${(100 - size / 3) / 2 + (Math.random() * 50 - 25)}%`;

    // Random opacity
    swirl.style.opacity = 0.1 + Math.random() * 0.3;

    swirlContainer.appendChild(swirl);

    // Animate each swirl with GSAP
    gsap.to(swirl, {
      rotation: 360 * (Math.random() > 0.5 ? 1 : -1),
      duration: 15 + Math.random() * 20,
      repeat: -1,
      ease: "none",
    });

    // Pulse animation
    gsap.to(swirl, {
      scale: 1 + Math.random() * 0.3,
      opacity: 0.05 + Math.random() * 0.2,
      duration: 2 + Math.random() * 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }

  // Create animated background with GSAP
  const background = document.getElementById("connect-background");

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
  stop1.setAttribute("stop-color", "#350842ff");
  gradient.appendChild(stop1);
  
  const stop2 = document.createElementNS(svgNS, "stop");
  stop2.setAttribute("offset", "100%");
  stop2.setAttribute("stop-color", "#0f0014");
  gradient.appendChild(stop2);

  // Create background rect
  const rect = document.createElementNS(svgNS, "rect");
  rect.setAttribute("width", "100%");
  rect.setAttribute("height", "100%");
  rect.setAttribute("fill", "url(#grad1)");
  svg.appendChild(rect);

  // Add some additional swirl effects
  for (let i = 0; i < 5; i++) {
    const smallSwirl = document.createElement("div");
    smallSwirl.classList.add("swirl");

    const size = 10 + i * 5;
    smallSwirl.style.width = `${size}px`;
    smallSwirl.style.height = `${size}px`;
    smallSwirl.style.border = "1px solid #170627d9";

    // Position randomly on the left side
    smallSwirl.style.left = `${10 + Math.random() * 20}%`;
    smallSwirl.style.top = `${Math.random() * 80 + 10}%`;

    swirlContainer.appendChild(smallSwirl);

    // Animate with different timing
    gsap.to(smallSwirl, {
      rotation: 360 * (Math.random() > 0.5 ? 1 : -1),
      duration: 5 + Math.random() * 8,
      repeat: -1,
      ease: "none",
    });

    // Move around slightly
    gsap.to(smallSwirl, {
      x: Math.random() * 30 - 15,
      y: Math.random() * 30 - 15,
      duration: 3 + Math.random() * 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }

  // Create animated particles

  for (let i = 0; i < 50; i++) {
    const particle = document.createElementNS(svgNS, "circle");
    const size = Math.random() * 2 + 1;

    particle.setAttribute("r", size);
    particle.setAttribute(
      "fill",
      "rgba(255, 255, 255, " + Math.random() * 0.5 + ")"
    );

    const xPos = Math.random() * 100;
    const yPos = Math.random() * 50;

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
      ease: "sine.inOut",
    });
  }

  // Animate content elements
  // Main title animation
  gsap.to("#connect-title", {
    opacity: 1,
    duration: 1,
    delay: 0.5,
  });

  // Social icons animation
  gsap.to(".social-icon", {
    opacity: 1,
    y: 0,
    duration: 0.8,
    stagger: 0.2,
    delay: 1,
  });

  // Message box animation
  gsap.to("#message-box", {
    opacity: 1,
    y: 0,
    duration: 0.8,
    delay: 2,
  });

  // Footer text animation
  gsap.to("#footer-text", {
    opacity: 1,
    duration: 1,
    delay: 2.5,
  });

  // Unified message sending logic
  function sendMessage() {
    const email = "paradoxicalparadox.v01@gmail.com";
    const input = document.getElementById("message-input");
    const message = input.value.trim();
    const body = encodeURIComponent(message);

    // Gmail compose URL
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&body=${body}`;
    window.open(gmailUrl, "_blank");

    // Clear input
    input.value = "";

    // Flash effect on button to confirm sending
    gsap.to("#send-button", {
      backgroundColor: "rgba(138, 43, 226, 0.9)",
      duration: 0.3,
      yoyo: true,
      repeat: 1,
    });

    // Temporarily change button text
    const sendBtn = document.getElementById("send-button");
    const originalText = "Send Message";
    sendBtn.innerHTML = 'Message Sent! <i class="fas fa-check"></i>';

    setTimeout(() => {
      sendBtn.innerHTML = originalText + ' <i class="fas fa-paper-plane"></i>';
    }, 2000);
  }

  // Handle button click
  document.getElementById("send-button").addEventListener("click", sendMessage);

  // Handle Enter key
  document.getElementById("message-input").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  });

});
