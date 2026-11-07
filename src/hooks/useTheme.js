import { useState, useEffect } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    if (typeof document !== 'undefined') {
      const current = document.documentElement.getAttribute('data-theme');
      if (current) return current;
      const saved = localStorage.getItem('portfolio-theme');
      if (saved) return saved;
      return 'dark';
    }
    return 'dark';
  });

  const toggleTheme = () => {
    const root = document.documentElement;
    const currentAttr = root.getAttribute('data-theme') || theme;
    const isDark = currentAttr === 'dark';
    const nextTheme = isDark ? 'light' : 'dark';
    root.setAttribute('data-theme', nextTheme);
    try {
      localStorage.setItem('portfolio-theme', nextTheme);
    } catch (e) {}
    setTheme(nextTheme);
    window.dispatchEvent(new CustomEvent('portfolio-theme-change', { detail: nextTheme }));
  };

  useEffect(() => {
    const root = document.documentElement;
    if (theme) {
      root.setAttribute('data-theme', theme);
      try {
        localStorage.setItem('portfolio-theme', theme);
      } catch (e) {}
    }

    const observer = new MutationObserver(() => {
      const current = root.getAttribute('data-theme');
      if (current && (current === 'light' || current === 'dark')) {
        setTheme(current);
      }
    });
    observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] });

    const handleThemeChange = (e) => {
      if (e.detail) setTheme(e.detail);
    };
    window.addEventListener('portfolio-theme-change', handleThemeChange);

    return () => {
      observer.disconnect();
      window.removeEventListener('portfolio-theme-change', handleThemeChange);
    };
  }, []);

  return { theme, toggleTheme };
}

