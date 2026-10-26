(() => {
  const CONTACT_EMAIL = 'muneebrajpoot41@gmail.com';

  // Mobile navigation
  const header = document.querySelector('.header');
  const toggle = header.querySelector('.menu-toggle');
  const nav = document.getElementById('navigation');
  const setMenu = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    nav.classList.toggle('is-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  // Scroll reveal
  const revealables = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.setAttribute('data-revealed', '');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
    revealables.forEach((el) => io.observe(el));
  } else {
    revealables.forEach((el) => el.setAttribute('data-revealed', ''));
  }

  // Seamless marquee: duplicate each group so the -50% loop has no gap
  document.querySelectorAll('.marqueeTrack').forEach((track) => {
    const group = track.querySelector('.marqueeGroup');
    const clone = group.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    clone.removeAttribute('aria-label');
    track.appendChild(clone);
  });

  // Header: frosted background after scrolling, inverted over dark sections
  const darkSections = document.querySelectorAll('[data-header-dark]');
  const updateHeader = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 40);
    const y = header.offsetHeight / 2;
    const overDark = [...darkSections].some((s) => {
      const r = s.getBoundingClientRect();
      return r.top <= y && r.bottom >= y;
    });
    if (overDark) header.dataset.theme = 'dark';
    else delete header.dataset.theme;
  };
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  // Contact form: opens the visitor's email app with the message filled in
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    status.className = 'formStatus';
    if (!data.name.trim() || !data.message.trim()) {
      status.className = 'formStatus error';
      status.textContent = 'Please add your name and some project details.';
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      status.className = 'formStatus error';
      status.textContent = 'Please enter a valid email address.';
      return;
    }
    const subject = `New project enquiry from ${data.name}`;
    const body = `${data.message}\n\n${data.name}\n${data.email}`;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    status.textContent = 'Opening your email app…';
  });

  document.getElementById('year').textContent = new Date().getFullYear();
})();
