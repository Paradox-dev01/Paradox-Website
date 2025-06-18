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
//astrodrive
document.addEventListener("DOMContentLoaded", function () {
  // Create stars (fewer on mobile)
  const starsContainer = document.getElementById("stars");
  const isMobile = window.innerWidth < 768;
  const numStars = isMobile ? 100 : 200;

  for (let i = 0; i < numStars; i++) {
    const star = document.createElement("div");
    star.className = "star";
    const size = Math.random() * (isMobile ? 2 : 3) + 1;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    starsContainer.appendChild(star);
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
  gsap.to(".star", {
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

      gsap.to(".stars", {
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
        star.className = "star";
        const size = Math.random() * (newIsMobile ? 2 : 3) + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        starsContainer.appendChild(star);
      }
    }
  });
});
