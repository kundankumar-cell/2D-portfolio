import React, { useState, useEffect, useRef } from 'react';
import { storyMilestones } from '../data/portfolioData';
import { TypographyVortexCanvas } from '../shaders/typography-vortex/TypographyVortexCanvas';
import { useTheme } from '../hooks/useTheme';
import ShinyText from '../components/ShinyText';
import '../shaders/threeui.css';

export default function StoryTimeline() {
  const { theme } = useTheme();
  const isDarkMode = theme !== 'light';
  const [activeIndex, setActiveIndex] = useState(0);
  const [isRolling, setIsRolling] = useState(false);
  const itemRefs = useRef([]);
  const yrRef = useRef(null);
  const activeIndexRef = useRef(0);
  const rollTimeoutRef = useRef(null);

  const activateIndex = (index) => {
    if (index === activeIndexRef.current) return;
    activeIndexRef.current = index;
    setActiveIndex(index);
    setIsRolling(false);
    if (rollTimeoutRef.current) clearTimeout(rollTimeoutRef.current);
    requestAnimationFrame(() => {
      setIsRolling(true);
      rollTimeoutRef.current = setTimeout(() => {
        setIsRolling(false);
      }, 650);
    });
  };

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    const isMobileView = () => window.innerWidth <= 767;

    // --- MOBILE SCROLL SYNCHRONIZATION (<= 767px) ---
    let rafId = null;

    const handleMobileScroll = () => {
      if (!isMobileView()) return;

      const storyEl = document.getElementById('story');
      if (!storyEl) return;
      const storyRect = storyEl.getBoundingClientRect();

      // Skip calculation if the story section is outside the viewport
      if (storyRect.bottom < 0 || storyRect.top > window.innerHeight) {
        return;
      }

      if (rafId) return;

      rafId = requestAnimationFrame(() => {
        rafId = null;
        // Activation line for scrolling milestones into reading zone below sticky header
        const activationY = Math.min(360, window.innerHeight * 0.5);
        let targetIndex = 0;

        for (let i = 0; i < itemRefs.current.length; i++) {
          const el = itemRefs.current[i];
          if (!el) continue;
          const rect = el.getBoundingClientRect();
          if (rect.top <= activationY) {
            targetIndex = i;
          } else {
            break;
          }
        }

        if (targetIndex !== activeIndexRef.current) {
          activateIndex(targetIndex);
        }
      });
    };

    // --- DESKTOP & TABLET INTERSECTION OBSERVER (> 767px) ---
    let observer = null;

    const setupDesktopObserver = () => {
      if (observer) {
        observer.disconnect();
        observer = null;
      }

      if (!isMobileView() && 'IntersectionObserver' in window) {
        observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                const index = itemRefs.current.indexOf(entry.target);
                if (index !== -1) {
                  activateIndex(index);
                }
              }
            });
          },
          { rootMargin: '-45% 0px -50% 0px' }
        );

        itemRefs.current.forEach((el) => {
          if (el) observer.observe(el);
        });
      }
    };

    const handleResize = () => {
      if (isMobileView()) {
        if (observer) {
          observer.disconnect();
          observer = null;
        }
        handleMobileScroll();
      } else {
        setupDesktopObserver();
      }
    };

    window.addEventListener('scroll', handleMobileScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    if (isMobileView()) {
      handleMobileScroll();
    } else {
      setupDesktopObserver();
    }

    return () => {
      window.removeEventListener('scroll', handleMobileScroll);
      window.removeEventListener('resize', handleResize);
      if (rafId) cancelAnimationFrame(rafId);
      if (observer) observer.disconnect();
      if (rollTimeoutRef.current) clearTimeout(rollTimeoutRef.current);
    };
  }, []);

  const activeMilestone = storyMilestones[activeIndex] || storyMilestones[0];
  const progressPercent = ((activeIndex + 1) / storyMilestones.length) * 100;
  const indexFormatted = String(activeIndex + 1).padStart(2, '0');
  const totalFormatted = String(storyMilestones.length).padStart(2, '0');

  return (
    <section id="story" className="story">
      <div className="orb o1"></div>
      <div className="orb o2"></div>
      <div className="sl">
        <div className="story-vortex-bg-wrap" aria-hidden="true">
          <TypographyVortexCanvas
            mode={theme === 'light' ? 'light' : 'dark'}
            speed={1.00}
            ringGrowth={1.21}
            opacity={1.00}
            dissolveRadius={1.00}
            particleAmount={1.00}
            suctionDuration={920}
          />
        </div>
        <span className="tiny">
          <i></i> My story
        </span>
        <h2>
          <ShinyText
            text="Let’s go back in time."
            color={isDarkMode ? "#F5F1EC" : "#171717"}
            shineColor={isDarkMode ? "#FF8A4C" : "#FF6B35"}
            speed={2.2}
            delay={0.4}
            shineWidth={35}
            softness={0.85}
            bands={1}
            glow={0.08}
            trigger="loop"
            direction="left"
            easing="smooth"
          />
        </h2>
        <div
          ref={yrRef}
          className={`yr ${isRolling ? 'roll' : ''}`}
          id="yr"
        >
          {activeMilestone.year}
        </div>
        <div className="mono" id="yd">
          {activeMilestone.period}
        </div>
        <div className="cn">
          <b id="sn">{indexFormatted}</b>
          <span>/ {totalFormatted}</span>
          <u>
            <i id="sp" style={{ width: `${progressPercent}%` }}></i>
          </u>
        </div>
      </div>
      <div className="tl2">
        {storyMilestones.map((item, index) => {
          const isActive = index === activeIndex;
          return (
            <div
              key={index}
              ref={(el) => (itemRefs.current[index] = el)}
              className={`it ${isActive ? 'on' : ''}`}
              data-y={item.year}
              data-d={item.period}
              onClick={() => activateIndex(index)}
              style={{ cursor: 'pointer' }}
            >
              <small>{item.originTag || item.period}</small>
              <h3>{item.role}</h3>
              <p className="sub2">{item.organization}</p>
              <ul>
                {item.highlights.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}

