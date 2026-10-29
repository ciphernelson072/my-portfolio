(() => {
  const root = document.documentElement;
  const themeBtn = document.getElementById('themeToggle');
  const themeLabel = themeBtn?.querySelector('.theme-label');
  const menuBtn = document.getElementById('mobileMenu');
  const sidebar = document.getElementById('sidebar');
  const scrim = document.getElementById('sidebarScrim');
  const toTop = document.getElementById('toTop');

  // Theme
  function setTheme(theme) {
    root.dataset.theme = theme;
    const isLight = theme === 'light';
    if (themeLabel) themeLabel.textContent = isLight ? 'Light Mode' : 'Dark Mode';
    themeBtn?.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      'content',
      isLight ? '#e8eef8' : '#060a12'
    );
    try {
      localStorage.setItem('obicho-theme', theme);
    } catch (_) {}
  }
  setTheme(root.dataset.theme || 'dark');
  themeBtn?.addEventListener('click', () => {
    setTheme(root.dataset.theme === 'light' ? 'dark' : 'light');
  });

  // Mobile nav
  function closeMenu() {
    sidebar?.classList.remove('open');
    scrim?.classList.remove('visible');
    menuBtn?.setAttribute('aria-expanded', 'false');
    menuBtn?.setAttribute('aria-label', 'Open menu');
  }
  menuBtn?.addEventListener('click', () => {
    const open = sidebar?.classList.toggle('open');
    scrim?.classList.toggle('visible', Boolean(open));
    menuBtn.setAttribute('aria-expanded', String(Boolean(open)));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  scrim?.addEventListener('click', closeMenu);
  sidebar?.querySelectorAll('a[href^="#"]').forEach((a) =>
    a.addEventListener('click', closeMenu)
  );

  // Active section highlight
  const navLinks = [...document.querySelectorAll('.nav-link')];
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navLinks.forEach((link) =>
              link.classList.toggle(
                'active',
                link.getAttribute('href') === `#${entry.target.id}`
              )
            );
          }
        });
      },
      { rootMargin: '-25% 0px -55% 0px', threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
  }

  // Year
  const year = new Date().getFullYear();
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = year;

  // Back to top
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const updateTop = () => toTop?.classList.toggle('visible', window.scrollY > 400);
  window.addEventListener('scroll', updateTop, { passive: true });
  updateTop();
  toTop?.addEventListener('click', () =>
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
  );

  // Contact form → mailto fallback
  const form = document.getElementById('contactForm');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = data.get('name') || '';
    const email = data.get('email') || '';
    const subject = data.get('subject') || 'Portfolio inquiry';
    const message = data.get('message') || '';
    const subjectMap = {
      opportunity: 'Job / internship opportunity',
      freelance: 'Freelance project',
      support: 'IT support inquiry',
      other: 'Portfolio inquiry'
    };
    const subjectText = subjectMap[subject] || subject;
    const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
    const mailto = `mailto:your.email@example.com?subject=${encodeURIComponent(subjectText + ' — ' + name)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  });
})();
