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
//AstroDrive
document.addEventListener("DOMContentLoaded", function () {
  // Add animation classes with delays
  const elementsToAnimate = [
    { element: document.querySelector("h1"), delay: 0 },
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
