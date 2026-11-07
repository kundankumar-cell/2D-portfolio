import React, { useState } from 'react';
import { useTheme } from '../hooks/useTheme';

export default function ThemeToggle() {
  const { toggleTheme } = useTheme();
  const [isPulled, setIsPulled] = useState(false);

  const handleClick = () => {
    setIsPulled(true);
    toggleTheme();
    setTimeout(() => setIsPulled(false), 500);
  };

  return (
    <div
      className={`rope ${isPulled ? 'pulled' : ''}`}
      id="rope"
      title="Pull to toggle theme"
      role="button"
      tabIndex={0}
      aria-label="Toggle light or dark theme"
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <div className="rope-cord"></div>
      <div className="rope-pendant"></div>
    </div>
  );
}
