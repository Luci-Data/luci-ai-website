// script.js

function closeConsent() {
  const banner = document.getElementById("consentBanner");

  if (banner) {
    banner.classList.remove("show");
  }

  localStorage.setItem("lucihome_cookie_consent", "true");
}

document.addEventListener("DOMContentLoaded", () => {
  initConsentBanner();
  initRevealAnimations();
  initCounters();
  initSmoothScroll();
  initNavScroll();
  initGlobeParallax();
});

function initConsentBanner() {
  const accepted = localStorage.getItem("lucihome_cookie_consent");
  const banner = document.getElementById("consentBanner");

  if (!accepted && banner) {
    banner.classList.add("show");
  }
}

function initRevealAnimations() {
  const elements = document.querySelectorAll(
    ".hero-content, .hero-visual, .section-tag, h2, .section-sub, .problem-card, .step, .benefit-item, .mockup-card, .mockup-listing"
  );

  elements.forEach((el, index) => {
    el.classList.add("reveal");
    el.style.transitionDelay = `${Math.min(index * 0.045, 0.32)}s`;
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -35px 0px"
    }
  );

  elements.forEach((el) => observer.observe(el));
}

function initCounters() {
  const counters = document.querySelectorAll(".stat-num, .mockup-stat-num");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        animateCounter(entry.target);
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.55
    }
  );

  counters.forEach((counter) => observer.observe(counter));
}

function animateCounter(element) {
  const originalText = element.textContent.trim();
  const numberMatch = originalText.match(/\d+/);

  if (!numberMatch) return;

  const target = Number(numberMatch[0]);
  const prefix = originalText.slice(0, numberMatch.index);
  const suffix = originalText.slice(numberMatch.index + numberMatch[0].length);

  let startTime = null;
  const duration = 1400;

  function tick(timestamp) {
    if (!startTime) startTime = timestamp;

    const progress = Math.min((timestamp - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);

    element.textContent = `${prefix}${current}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      element.textContent = originalText;
    }
  }

  requestAnimationFrame(tick);
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (event) {
      const targetId = this.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  });
}

function initNavScroll() {
  const nav = document.querySelector("nav");

  if (!nav) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 24) {
      nav.style.background = "rgba(255,255,255,0.92)";
      nav.style.boxShadow = "0 14px 40px rgba(13,27,61,0.08)";
      nav.style.borderBottom = "1px solid rgba(13,27,61,0.08)";
    } else {
      nav.style.background = "rgba(255,255,255,0.72)";
      nav.style.boxShadow = "none";
      nav.style.borderBottom = "1px solid rgba(13,27,61,0.06)";
    }
  });
}

function initGlobeParallax() {
  const globe = document.querySelector(".globe-container");

  if (!globe) return;

  window.addEventListener("mousemove", (event) => {
    const x = (window.innerWidth / 2 - event.clientX) / 70;
    const y = (window.innerHeight / 2 - event.clientY) / 70;

    globe.style.transform = `translate(${x}px, ${y}px)`;
  });
}
