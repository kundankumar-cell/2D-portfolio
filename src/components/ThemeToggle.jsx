import React, { useState, useRef } from 'react';
import { useTheme } from '../hooks/useTheme';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme !== 'light';
  const [isPulled, setIsPulled] = useState(false);
  const isPullingRef = useRef(false);

  const handlePull = () => {
    if (isPullingRef.current) return;
    isPullingRef.current = true;
    setIsPulled(true);
    toggleTheme();
    setTimeout(() => {
      setIsPulled(false);
      isPullingRef.current = false;
    }, 550);
  };

  return (
    <div
      className={`rope ${isPulled ? 'pulled' : ''} ${isDarkMode ? 'theme-dark' : 'theme-light'}`}
      id="rope"
      title={`Current: ${isDarkMode ? 'Dark Mode' : 'Light Mode'} — Pull to toggle theme`}
      role="button"
      tabIndex={0}
      aria-label={`Toggle theme (currently ${isDarkMode ? 'Dark' : 'Light'} mode)`}
      onClick={handlePull}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handlePull();
        }
      }}
    >
      {/* Ceiling Mount Bracket */}
      <div className="rope-mount" aria-hidden="true"></div>

      {/* Animated Celestial Sky Capsule (Sun & Moon Scenes) */}
      <div className="celestial-badge" aria-hidden="true">
        {/* Daylight Sun Scene */}
        <div className={`celestial-scene scene-sun ${!isDarkMode ? 'active' : ''}`}>
          <div className="sun-halo"></div>
          <svg className="sun-svg" viewBox="0 0 32 32">
            {/* Ambient Rotating Sun Rays */}
            <g className="sun-rays">
              <line x1="16" y1="2" x2="16" y2="5" />
              <line x1="16" y1="27" x2="16" y2="30" />
              <line x1="2" y1="16" x2="5" y2="16" />
              <line x1="27" y1="16" x2="30" y2="16" />
              <line x1="6.1" y1="6.1" x2="8.3" y2="8.3" />
              <line x1="23.7" y1="23.7" x2="25.9" y2="25.9" />
              <line x1="6.1" y1="25.9" x2="8.3" y2="23.7" />
              <line x1="23.7" y1="8.3" x2="25.9" y2="6.1" />
            </g>
            {/* Glowing Golden Sun Core */}
            <circle cx="16" cy="16" r="6.5" className="sun-core-circle" fill="url(#sunCoreGradient)" />
            <defs>
              <radialGradient id="sunCoreGradient" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="40%" stopColor="#FEF08A" />
                <stop offset="85%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#D97706" />
              </radialGradient>
            </defs>
          </svg>
        </div>

        {/* Midnight Moon Scene */}
        <div className={`celestial-scene scene-moon ${isDarkMode ? 'active' : ''}`}>
          <div className="moon-halo"></div>
          {/* Subtle Twinkling Stars */}
          <span className="celestial-star star-1">
            <svg viewBox="0 0 10 10">
              <path d="M5 0 Q5 5 10 5 Q5 5 5 10 Q5 5 0 5 Q5 5 5 0 Z" fill="#FFFBEB" />
            </svg>
          </span>
          <span className="celestial-star star-2">
            <svg viewBox="0 0 10 10">
              <path d="M5 0 Q5 5 10 5 Q5 5 5 10 Q5 5 0 5 Q5 5 5 0 Z" fill="#FEF08A" />
            </svg>
          </span>
          <span className="celestial-star star-3">
            <svg viewBox="0 0 10 10">
              <path d="M5 0 Q5 5 10 5 Q5 5 5 10 Q5 5 0 5 Q5 5 5 0 Z" fill="#FDE68A" />
            </svg>
          </span>
          <span className="celestial-star star-4">
            <svg viewBox="0 0 10 10">
              <path d="M5 0 Q5 5 10 5 Q5 5 5 10 Q5 5 0 5 Q5 5 5 0 Z" fill="#FFFBEB" />
            </svg>
          </span>
          {/* Luminous Crescent Moon */}
          <div className="moon-crescent-wrap">
            <svg viewBox="0 0 24 24" className="moon-svg">
              <path
                d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                fill="url(#crescentMoonGradient)"
              />
              <defs>
                <linearGradient id="crescentMoonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="35%" stopColor="#FEF08A" />
                  <stop offset="85%" stopColor="#FBBF24" />
                  <stop offset="100%" stopColor="#F59E0B" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>

      {/* Hanging Pull Cord Assembly */}
      <div className="rope-assembly" aria-hidden="true">
        {/* Cord Top Brass Eyelet */}
        <div className="rope-eyelet"></div>

        {/* Vertical Hanging Braided Cord */}
        <div className="rope-cord"></div>

        {/* Rounded Pull Handle (Pendant) */}
        <div className="rope-pendant">
          <div className="rope-pendant-ring"></div>
          <div className="rope-pendant-body"></div>
        </div>
      </div>
    </div>
  );
}
