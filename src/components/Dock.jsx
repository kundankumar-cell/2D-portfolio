import React, { useEffect, useRef, useState } from 'react';
import { navLinks } from '../data/portfolioData';

export default function Dock() {
  const dockRef = useRef(null);
  const [activeId, setActiveId] = useState('top');

  useEffect(() => {
    const dockEl = dockRef.current;
    if (!dockEl) return;

    const links = Array.from(dockEl.querySelectorAll('a'));
    const DP = 122;
    const DS = 0.19;
    const DD = 0.70;
    const WG = 17;
    const HG = 16;
    const DR = 3.5;
    let BW = window.innerWidth < 520 ? 58 : 76;
    const BH = 36;
    let mx = -9999;
    let my = -9999;
    let run = false;
    let animationFrameId = null;

    const ds = links.map(() => ({ g: 0, v: 0 }));

    const updateBaseWidth = () => {
      BW = window.innerWidth < 520 ? 58 : 76;
      links.forEach((a) => {
        a.style.width = `${BW}px`;
        a.style.height = `${BH}px`;
      });
    };
    updateBaseWidth();

    function tick() {
      let moving = false;
      links.forEach((a, i) => {
        const r = a.getBoundingClientRect();
        const dist = Math.hypot(mx - (r.left + r.width / 2), my - (r.top + r.height / 2));
        const target = Math.max(0, 1 - dist / DP);
        const s = ds[i];
        s.v = (s.v + (target - s.g) * DS) * DD;
        s.g += s.v;
        if (Math.abs(s.v) > 0.001 || Math.abs(target - s.g) > 0.001) {
          moving = true;
        }
        a.style.width = `${BW + WG * s.g}px`;
        a.style.height = `${BH + HG * s.g}px`;
        a.style.transform = `translateY(${DR * s.g}px)`;
      });

      if (moving) {
        animationFrameId = requestAnimationFrame(tick);
      } else {
        run = false;
      }
    }

    function kick() {
      if (!run) {
        run = true;
        animationFrameId = requestAnimationFrame(tick);
      }
    }

    const handleMouseMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      kick();
    };

    const handleMouseLeave = () => {
      mx = -9999;
      my = -9999;
      kick();
    };

    const handleResize = () => {
      updateBaseWidth();
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', handleResize);

    // Scroll spy
    const ids = ['top', 'work', 'projects', 'story', 'contact'];
    const handleScroll = () => {
      let cur = 'top';
      ids.forEach((id) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.4) {
          cur = id;
        }
      });
      setActiveId(cur);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleLinkClick = (e, id) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div id="dock" ref={dockRef} role="navigation" aria-label="Sections">
      {navLinks.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className={activeId === item.id ? 'on' : ''}
          onClick={(e) => handleLinkClick(e, item.id)}
        >
          {item.dockLabel || item.label}
        </a>
      ))}
    </div>
  );
}

