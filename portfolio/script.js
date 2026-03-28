
const navMenu = document.getElementById("navMenu");
const navToggle = document.getElementById("navToggle");
const navLinks = document.querySelectorAll(".nav-link");
const revealItems = document.querySelectorAll(".reveal");
const sections = document.querySelectorAll("main section[id]");
const backToTop = document.getElementById("backToTop");
const typingText = document.getElementById("typingText");
const filterButtons = document.querySelectorAll(".filter-button");
const projectCards = document.querySelectorAll(".project-card");
const counters = document.querySelectorAll(".counter");
const progressBars = document.querySelectorAll(".progress span");
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const particleCanvas = document.getElementById("particle-canvas");
const cursorDot = document.querySelector(".cursor-dot");
const cursorRing = document.querySelector(".cursor-ring");

const heroRoles = [
  "AI Engineer",
  "Machine Learning Engineer",
  "Python Developer",
  "NLP Systems Builder",
  "LLM Product Engineer",
];

let roleIndex = 0;
let letterIndex = 0;
let isDeleting = false;

function toggleNavigation() {
  if (!navMenu || !navToggle) return;
  const expanded = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!expanded));
  navMenu.classList.toggle("is-open");
}

function closeNavigation() {
  if (!navMenu || !navToggle) return;
  navToggle.setAttribute("aria-expanded", "false");
  navMenu.classList.remove("is-open");
}

function runTypingEffect() {
  if (!typingText) return;

  const currentRole = heroRoles[roleIndex];
  const visibleText = isDeleting
    ? currentRole.slice(0, letterIndex--)
    : currentRole.slice(0, letterIndex++);

  typingText.textContent = visibleText;

  let delay = isDeleting ? 48 : 88;

  if (!isDeleting && letterIndex === currentRole.length + 1) {
    isDeleting = true;
    delay = 1450;
  } else if (isDeleting && letterIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % heroRoles.length;
    delay = 260;
  }

  window.setTimeout(runTypingEffect, delay);
}

function initRevealObserver() {
  if (!revealItems.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.18, rootMargin: "0px 0px -40px 0px" }
  );

  revealItems.forEach((item) => observer.observe(item));
}

function initSectionTracking() {
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const sectionId = entry.target.getAttribute("id");
        navLinks.forEach((link) => {
          const isActive = link.getAttribute("href") === `#${sectionId}`;
          link.classList.toggle("is-active", isActive);
        });
      });
    },
    { threshold: 0.18, rootMargin: "-38% 0px -45% 0px" }
  );

  sections.forEach((section) => observer.observe(section));
}

function initProjectFilters() {
  if (!filterButtons.length || !projectCards.length) return;

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter || "all";
      filterButtons.forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");

      projectCards.forEach((card) => {
        const category = card.dataset.category || "";
        const matches = filter === "all" || category === filter;
        card.classList.toggle("is-hidden", !matches);
      });
    });
  });
}

function initCounters() {
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const element = entry.target;
        const target = Number(element.dataset.target || 0);
        const duration = 1400;
        const startTime = performance.now();

        function animateCounter(timestamp) {
          const progress = Math.min((timestamp - startTime) / duration, 1);
          const value = Math.floor(target * progress);
          element.textContent = String(value);

          if (progress < 1) {
            requestAnimationFrame(animateCounter);
          } else {
            element.textContent = String(target);
          }
        }

        requestAnimationFrame(animateCounter);
        observer.unobserve(element);
      });
    },
    { threshold: 0.45 }
  );

  counters.forEach((counter) => observer.observe(counter));
}

function initProgressBars() {
  if (!progressBars.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const bar = entry.target;
        const progress = Number(bar.dataset.progress || 0);
        bar.style.width = `${progress}%`;
        observer.unobserve(bar);
      });
    },
    { threshold: 0.45 }
  );

  progressBars.forEach((bar) => observer.observe(bar));
}

function initBackToTop() {
  if (!backToTop) return;

  function updateBackToTopState() {
    backToTop.classList.toggle("is-visible", window.scrollY > 520);
  }

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  window.addEventListener("scroll", updateBackToTopState, { passive: true });
  updateBackToTopState();
}

function initCustomCursor() {
  if (!cursorDot || !cursorRing) return;
  if (window.matchMedia("(pointer: coarse)").matches) return;

  let pointerX = window.innerWidth / 2;
  let pointerY = window.innerHeight / 2;
  let ringX = pointerX;
  let ringY = pointerY;

  document.addEventListener("mousemove", (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;
    cursorDot.style.transform = `translate(${pointerX}px, ${pointerY}px)`;
  });

  function animateRing() {
    ringX += (pointerX - ringX) * 0.18;
    ringY += (pointerY - ringY) * 0.18;
    cursorRing.style.transform = `translate(${ringX}px, ${ringY}px)`;
    requestAnimationFrame(animateRing);
  }

  document.querySelectorAll("a, button, .glass-card").forEach((element) => {
    element.addEventListener("mouseenter", () => {
      cursorRing.style.width = "54px";
      cursorRing.style.height = "54px";
      cursorRing.style.borderColor = "rgba(157, 125, 255, 0.58)";
    });

    element.addEventListener("mouseleave", () => {
      cursorRing.style.width = "36px";
      cursorRing.style.height = "36px";
      cursorRing.style.borderColor = "rgba(94, 230, 255, 0.4)";
    });
  });

  animateRing();
}

function initParticleCanvas() {
  if (!particleCanvas) return;
  const context = particleCanvas.getContext("2d");
  if (!context) return;

  const particles = [];
  const particleCount = window.innerWidth < 768 ? 36 : 74;

  function resizeCanvas() {
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
  }

  function buildParticle() {
    return {
      x: Math.random() * particleCanvas.width,
      y: Math.random() * particleCanvas.height,
      vx: (Math.random() - 0.5) * 0.34,
      vy: (Math.random() - 0.5) * 0.34,
      radius: Math.random() * 1.8 + 0.7,
    };
  }

  function seedParticles() {
    particles.length = 0;
    for (let index = 0; index < particleCount; index += 1) {
      particles.push(buildParticle());
    }
  }

  function renderFrame() {
    context.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

    particles.forEach((particle, index) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x < 0 || particle.x > particleCanvas.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > particleCanvas.height) particle.vy *= -1;

      context.beginPath();
      context.fillStyle = "rgba(94, 230, 255, 0.72)";
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fill();

      for (let inner = index + 1; inner < particles.length; inner += 1) {
        const peer = particles[inner];
        const dx = particle.x - peer.x;
        const dy = particle.y - peer.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 122) {
          context.beginPath();
          context.strokeStyle = `rgba(91, 140, 255, ${0.22 - distance / 820})`;
          context.lineWidth = 1;
          context.moveTo(particle.x, particle.y);
          context.lineTo(peer.x, peer.y);
          context.stroke();
        }
      }
    });

    requestAnimationFrame(renderFrame);
  }

  resizeCanvas();
  seedParticles();
  renderFrame();

  window.addEventListener("resize", () => {
    resizeCanvas();
    seedParticles();
  });
}

function initContactForm() {
  if (!contactForm || !formStatus) return;

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    formStatus.textContent =
      "Message prepared successfully. Reach out via email or LinkedIn to continue the conversation.";
    contactForm.reset();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  runTypingEffect();
  initRevealObserver();
  initSectionTracking();
  initProjectFilters();
  initCounters();
  initProgressBars();
  initBackToTop();
  initCustomCursor();
  initParticleCanvas();
  initContactForm();

  if (navToggle) {
    navToggle.addEventListener("click", toggleNavigation);
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", closeNavigation);
  });
});
