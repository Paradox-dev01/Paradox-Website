// Cursor
const cursor = document.querySelector(".custom-cursor");
let isMoving = false;

// Move cursor with mouse
document.addEventListener("mousemove", (e) => {
  cursor.style.left = e.clientX + "px";
  cursor.style.top = e.clientY + "px";

  if (!isMoving) {
    isMoving = true;
    cursor.classList.remove("idle");
    setTimeout(() => (isMoving = false), 100); // Reset movement status
  }
});

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
document
  .querySelectorAll("a, button, .enter-button, .nav-arrow")
  .forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursor.classList.add("hover");
    });
    el.addEventListener("mouseleave", () => {
      cursor.classList.remove("hover");
    });
  });

// Scroll Animation Observer
const sections = document.querySelectorAll(".section");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      } else {
        entry.target.classList.remove("visible");
      }
    });
  },
  {
    threshold: 0.3,
  }
);

sections.forEach((section) => observer.observe(section));

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
function scrollToNextSection() {
  const visibleSections = Array.from(sections).filter(
    (section) => section.getBoundingClientRect().top >= 0
  );
  const next = visibleSections[0] || sections[0];
  next.scrollIntoView({ behavior: "smooth" });
}

// Optional Starfield Canvas (can remove if not needed)
const canvas = document.getElementById("starfield");
if (canvas) {
  const ctx = canvas.getContext("2d");
  let stars = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    stars = Array.from({ length: 200 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.5,
    }));
  }

  function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#fff";
    stars.forEach((star) => {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(drawStars);
  }

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();
  drawStars();
}
//DevDiary
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
