// Cursor
const cursor = document.querySelector('.custom-cursor');
let isMoving = false;

  // Move cursor with mouse
document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';

  if (!isMoving) {
    isMoving = true;
    cursor.classList.remove('idle');
    setTimeout(() => isMoving = false, 100); // Reset movement status
  }
});

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


// CORE

//1
const core1 = document.getElementById('core1');
const coreObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      core1.classList.add('fade-in');
      coreObserver.unobserve(core1); // optional: remove after first load
    }
  });
}, { threshold: 0.3 });

coreObserver.observe(core1);


//2
gsap.registerPlugin(ScrollTrigger);

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
