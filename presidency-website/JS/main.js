/* ══════════════════════════════════════════════════════════
   PRESIDENCY UNIVERSITY — JAVASCRIPT
   script.js
   ══════════════════════════════════════════════════════════ */

'use strict';

/* ──────────────────────────────────────────────
   1. NAVBAR — shrink on scroll + active link
────────────────────────────────────────────── */

const navbar    = document.getElementById('navbar');
const navLinks  = document.querySelectorAll('.nav-links a');
const sections  = document.querySelectorAll('section[id]');

function handleNavScroll() {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Highlight active nav link based on scroll position
  let currentSection = '';

  sections.forEach(section => {
    const sectionTop    = section.offsetTop - 120;
    const sectionBottom = sectionTop + section.offsetHeight;

    if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
      currentSection = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSection}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', handleNavScroll, { passive: true });


/* ──────────────────────────────────────────────
   2. HAMBURGER MENU (mobile)
────────────────────────────────────────────── */

const hamburger = document.getElementById('hamburger');
const navLinksEl = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  navLinksEl.classList.toggle('mobile-open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
});

// Close menu when a link is clicked
navLinksEl.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinksEl.classList.remove('mobile-open');
    hamburger.setAttribute('aria-expanded', false);
  });
});


/* ──────────────────────────────────────────────
   3. SCROLL REVEAL — fade elements in on scroll
────────────────────────────────────────────── */

// Add js-ready so CSS hides elements only when JS is running
document.body.classList.add('js-ready');

const scrollRevealElements = document.querySelectorAll('.scroll-reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.08,
    rootMargin: '0px 0px -30px 0px'
  }
);

scrollRevealElements.forEach(el => revealObserver.observe(el));


/* ──────────────────────────────────────────────
   4. ANIMATED STAT COUNTERS
────────────────────────────────────────────── */

const statNumbers = document.querySelectorAll('.stat-num[data-target]');

function animateCounter(el) {
  const target   = parseInt(el.getAttribute('data-target'), 10);
  const duration = 1600; // ms
  const start    = performance.now();

  function update(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);

    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(eased * target);

    el.textContent = value + (target >= 65 ? '+' : '');

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target + '+';
    }
  }

  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

statNumbers.forEach(el => counterObserver.observe(el));


/* ──────────────────────────────────────────────
   5. ENQUIRY FORM — validation + submission
────────────────────────────────────────────── */

const enquiryForm = document.getElementById('enquiryForm');
const submitBtn   = document.getElementById('submitBtn');
const formSuccess = document.getElementById('formSuccess');

/* Helper: show an error message below a field */
function showError(fieldId, message) {
  const errorEl = document.getElementById(`${fieldId}Error`);
  const inputEl = document.getElementById(fieldId);
  if (errorEl) errorEl.textContent = message;
  if (inputEl) inputEl.style.borderColor = '#f87171';
}

/* Helper: clear error on a field */
function clearError(fieldId) {
  const errorEl = document.getElementById(`${fieldId}Error`);
  const inputEl = document.getElementById(fieldId);
  if (errorEl) errorEl.textContent = '';
  if (inputEl) inputEl.style.borderColor = '';
}

/* Live clear on input */
['firstName', 'lastName', 'email', 'phone', 'programme'].forEach(id => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener('input', () => clearError(id));
    el.addEventListener('change', () => clearError(id));
  }
});

/* Validate all fields */
function validateForm() {
  let valid = true;

  const firstName = document.getElementById('firstName').value.trim();
  const lastName  = document.getElementById('lastName').value.trim();
  const email     = document.getElementById('email').value.trim();
  const phone     = document.getElementById('phone').value.trim();
  const programme = document.getElementById('programme').value;

  if (!firstName) {
    showError('firstName', 'First name is required.');
    valid = false;
  }

  if (!lastName) {
    showError('lastName', 'Last name is required.');
    valid = false;
  }

  if (!email) {
    showError('email', 'Email address is required.');
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showError('email', 'Please enter a valid email address.');
    valid = false;
  }

  if (!phone) {
    showError('phone', 'Phone number is required.');
    valid = false;
  } else if (!/^[\d\s\+\-\(\)]{7,15}$/.test(phone)) {
    showError('phone', 'Please enter a valid phone number.');
    valid = false;
  }

  if (!programme) {
    showError('programme', 'Please select a programme.');
    valid = false;
  }

  return valid;
}

enquiryForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Clear previous errors
  ['firstName', 'lastName', 'email', 'phone', 'programme'].forEach(clearError);

  if (!validateForm()) return;

  // Simulate async submission
  submitBtn.disabled  = true;
  submitBtn.textContent = 'Submitting…';

  setTimeout(() => {
    submitBtn.style.display = 'none';
    formSuccess.classList.add('show');
    enquiryForm.reset();
  }, 1200);
});


/* ──────────────────────────────────────────────
   6. SMOOTH ACTIVE NAV HIGHLIGHT (CSS)
   Inject dynamic style rule for .active links
────────────────────────────────────────────── */

(function injectActiveStyle() {
  const style = document.createElement('style');
  style.textContent = `
    .nav-links a.active {
      color: var(--gold) !important;
    }
    .nav-links a.active::after {
      transform: scaleX(1) !important;
    }
  `;
  document.head.appendChild(style);
})();


/* ──────────────────────────────────────────────
   7. COURSE CARD — subtle tilt on hover (desktop)
────────────────────────────────────────────── */

const courseCards = document.querySelectorAll('.course-card');

if (window.matchMedia('(hover: hover)').matches) {
  courseCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const cx     = rect.width / 2;
      const cy     = rect.height / 2;
      const rotateX = ((y - cy) / cy) * -4;
      const rotateY = ((x - cx) / cx) *  4;

      card.style.transform = `translateY(-7px) perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}


/* ──────────────────────────────────────────────
   8. INITIALISE
────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  handleNavScroll(); // Set correct navbar state on load
});