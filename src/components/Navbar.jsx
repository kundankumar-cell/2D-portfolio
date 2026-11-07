import React, { useState, useEffect } from 'react';
import { AnimatedTopDock } from '@designcodeio/threeui';
import '@designcodeio/threeui/style.css';

const PORTFOLIO_DOCK_ITEMS = [
  {
    id: "top",
    label: "HOME",
    icon: (
      <>
        <rect x="2.25" y="2.25" width="4.5" height="4.5" rx=".8" />
        <rect x="9.25" y="2.25" width="4.5" height="4.5" rx=".8" />
        <rect x="2.25" y="9.25" width="4.5" height="4.5" rx=".8" />
        <rect x="9.25" y="9.25" width="4.5" height="4.5" rx=".8" />
      </>
    )
  },
  {
    id: "work",
    label: "SKILLS",
    icon: (
      <>
        <circle cx="3" cy="8" r="1.5" />
        <circle cx="12.5" cy="3.5" r="1.5" />
        <circle cx="12.5" cy="12.5" r="1.5" />
        <path d="M4.5 7.3 11 4.2M4.5 8.7l6.5 3.1" />
      </>
    )
  },
  {
    id: "projects",
    label: "PROJECTS",
    icon: (
      <>
        <rect x="2" y="3" width="12" height="10" rx="1.5" />
        <path d="M2 6h12M5 4.5h.01M7 4.5h.01" />
      </>
    )
  },
  {
    id: "story",
    label: "STORY",
    icon: (
      <>
        <circle cx="5.2" cy="6.2" r="2.7" />
        <path d="m7.2 8.2 5.9 5.1M10.2 10.8l1.5-1.5M12 12.4l1.4-1.4" />
      </>
    )
  },
  {
    id: "contact",
    label: "CONTACT",
    icon: (
      <>
        <path d="M4 2.25h5.4L12 4.85v8.9H4z" />
        <path d="M9.25 2.25V5h2.7M6 8h4M6 10.5h4" />
      </>
    )
  }
];

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('top');

  useEffect(() => {
    const ids = ['top', 'work', 'projects', 'story', 'contact'];
    const handleScroll = () => {
      let current = 'top';
      ids.forEach((id) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.4) {
          current = id;
        }
      });
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleItemClick = (id) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="shader-frame top-dock-wrapper">
      <AnimatedTopDock
        variant="sable"
        proximity={122}
        spring={0.19}
        damping={0.70}
        widthGrowth={17}
        heightGrowth={16}
        drop={3.5}
        items={PORTFOLIO_DOCK_ITEMS}
        activeId={activeSection}
        onItemClick={handleItemClick}
      />
    </header>
  );
}
