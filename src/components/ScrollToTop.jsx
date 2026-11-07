import React, { useState, useEffect } from 'react';

export default function ScrollToTop() {
  const [dashOffset, setDashOffset] = useState(100.5);

  useEffect(() => {
    const handleScroll = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - window.innerHeight;
      const progress = total > 0 ? window.scrollY / total : 0;
      setDashOffset(100.5 * (1 - progress));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <a id="up" href="#top" aria-label="Back to top" onClick={handleClick}>
      <svg viewBox="0 0 36 36">
        <circle
          id="ring"
          cx="18"
          cy="18"
          r="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="100.5"
          strokeDashoffset={dashOffset}
          transform="rotate(-90 18 18)"
        />
      </svg>
      &uarr;
    </a>
  );
}

