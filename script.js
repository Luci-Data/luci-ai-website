// COOKIE CONSENT

function closeConsent() {
  const banner = document.getElementById('consentBanner');

  if (banner) {
    banner.classList.remove('show');
  }

  localStorage.setItem('lucihome_cookie_consent', 'true');
}

window.addEventListener('DOMContentLoaded', () => {

  const accepted = localStorage.getItem('lucihome_cookie_consent');

  const banner = document.getElementById('consentBanner');

  if (!accepted && banner) {
    banner.classList.add('show');
  }

  initFadeAnimations();

});

// FADE ANIMATIONS

function initFadeAnimations() {

  const elements = document.querySelectorAll(
    '.problem-card, .step, .benefit-item, .mockup-card'
  );

  const observer = new IntersectionObserver(
    (entries) => {

      entries.forEach(entry => {

        if (entry.isIntersecting) {

          entry.target.style.opacity = '1';

          entry.target.style.transform = 'translateY(0)';

        }

      });

    },
    {
      threshold: 0.15
    }
  );

  elements.forEach((el, index) => {

    el.style.opacity = '0';

    el.style.transform = 'translateY(30px)';

    el.style.transition =
      `opacity 0.7s ease ${index * 0.05}s,
       transform 0.7s ease ${index * 0.05}s`;

    observer.observe(el);

  });

}

// SMOOTH SCROLL

document.querySelectorAll('a[href^="#"]').forEach(anchor => {

  anchor.addEventListener('click', function (e) {

    const targetId = this.getAttribute('href');

    if (targetId === '#') return;

    const target = document.querySelector(targetId);

    if (!target) return;

    e.preventDefault();

    target.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });

  });

});

// NAV SHADOW

window.addEventListener('scroll', () => {

  const nav = document.querySelector('nav');

  if (!nav) return;

  if (window.scrollY > 20) {

    nav.style.background = 'rgba(10,15,30,0.96)';

    nav.style.borderBottom =
      '1px solid rgba(200,169,110,0.18)';

  } else {

    nav.style.background =
      'rgba(10,15,30,0.85)';

    nav.style.borderBottom =
      '1px solid rgba(255,255,255,0.07)';

  }

});

// BUTTON HOVER MICRO ANIMATION

document.querySelectorAll('.btn-primary').forEach(btn => {

  btn.addEventListener('mouseenter', () => {

    btn.style.transform = 'translateY(-2px) scale(1.01)';

  });

  btn.addEventListener('mouseleave', () => {

    btn.style.transform = 'translateY(0) scale(1)';

  });

});

// GLOBE PARALLAX

window.addEventListener('mousemove', (e) => {

  const globe = document.querySelector('.globe-container');

  if (!globe) return;

  const x =
    (window.innerWidth / 2 - e.clientX) / 50;

  const y =
    (window.innerHeight / 2 - e.clientY) / 50;

  globe.style.transform =
    `translate(${x}px, ${y}px)`;

});

// ACTIVE NAV LINK EFFECT

const navButtons = document.querySelectorAll(
  '.nav-cta'
);

navButtons.forEach(btn => {

  btn.addEventListener('mouseenter', () => {

    btn.style.boxShadow =
      '0 10px 30px rgba(200,169,110,0.25)';

  });

  btn.addEventListener('mouseleave', () => {

    btn.style.boxShadow = 'none';

  });

});

// PERFORMANCE SAFE RESIZE

let resizeTimer;

window.addEventListener('resize', () => {

  clearTimeout(resizeTimer);

  resizeTimer = setTimeout(() => {

    document.body.style.height = 'auto';

  }, 200);

});
