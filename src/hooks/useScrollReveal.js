import { useEffect } from 'react';

export function useScrollReveal(dependencies = []) {
  useEffect(() => {
    const els = document.querySelectorAll(
      '.hero > *, .hero-section > *, section h2, .lead, .card, .it, #contact form'
    );

    const observer =
      'IntersectionObserver' in window
        ? new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting) {
                  entry.target.classList.add('in');
                  observer.unobserve(entry.target);
                }
              });
            },
            { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }
          )
        : null;

    els.forEach((el, i) => {
      el.classList.add('reveal');
      el.style.setProperty('--d', `${(i % 4) * 0.08}s`);
      if (observer) {
        observer.observe(el);
      } else {
        el.classList.add('in');
      }
    });

    // Safety fallback: ensure reveal elements become visible even if mobile scroll momentum skips observer
    const safetyTimer = setTimeout(() => {
      els.forEach((el) => el.classList.add('in'));
    }, 1200);

    return () => {
      clearTimeout(safetyTimer);
      if (observer) {
        els.forEach((el) => observer.unobserve(el));
      }
    };
  }, dependencies);
}

