import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { 
  skillDoors, 
  doorDetails, 
  personalInfo,
  certificatesList,
  achievementsList
} from '../data/portfolioData';
import CertificateCarousel from '../components/CertificateCarousel';
import ContactModal from '../components/ContactModal';
import ShinyText from '../components/ShinyText';
import { useTheme } from '../hooks/useTheme';
import '../shaders/threeui.css';
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  X,
  ExternalLink,
  Award,
  Trophy,
  Briefcase,
  GraduationCap,
  Mail,
  Phone,
  FileText,
  Copy,
  Check,
  Sparkles,
  Users,
  Clock,
  Compass,
  Linkedin
} from 'lucide-react';

export default function SkillsDoors({ onOpenContactModal }) {
  const { theme } = useTheme();
  const isDarkMode = theme !== 'light';

  // Phase state: 'idle' | 'preview' | 'opening' | 'entering' | 'interior' | 'exiting'
  const [phase, setPhase] = useState('idle');
  const [previewDoorId, setPreviewDoorId] = useState(null);
  const [openingDoorId, setOpeningDoorId] = useState(null);
  const [activeInteriorId, setActiveInteriorId] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);
  const [isDoorContactOpen, setIsDoorContactOpen] = useState(false);
  const [doorContactSubject, setDoorContactSubject] = useState('');
  const isTransitioningRef = useRef(false);

  // Track desktop vs mobile viewport (desktop breakpoint: > 980px)
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth <= 980;
    }
    return false;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 980);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // References for full-screen sequential horizontal gate scroll
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const [activeGateIndex, setActiveGateIndex] = useState(0);

  // Full-Screen Horizontal Gate Scroll on mobile (controlled by vertical scroll)
  useEffect(() => {
    let rafId = null;

    const updateScrollProgress = () => {
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track) return;

      // On desktop (> 980px), preserve standard layout
      if (window.innerWidth > 980) {
        track.style.transform = '';
        return;
      }

      const rect = section.getBoundingClientRect();
      const totalScrollable = section.offsetHeight - window.innerHeight;
      if (totalScrollable <= 0) return;

      // Scrolled progress: 0 when top enters viewport, 1 when bottom hits viewport bottom
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / totalScrollable));

      // Calculate active gate index (0 to 3)
      const numGates = skillDoors.length;
      const currentIdx = Math.min(numGates - 1, Math.floor(progress * (numGates - 0.001)));
      setActiveGateIndex(currentIdx);

      // Distance to translate:
      // There are 4 gates. Total travel is (numGates - 1) * slide width (100vw).
      // At progress = 0: Gate 1 is centered.
      // At progress = 1: Gate 4 is centered.
      const slideWidth = window.innerWidth;
      const maxTranslate = (numGates - 1) * slideWidth;
      const currentTranslate = -progress * maxTranslate;

      track.style.transform = `translate3d(${currentTranslate}px, 0, 0)`;
    };

    const handleScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateScrollProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    updateScrollProgress();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const handleOpenDoorContact = useCallback((subject = 'General Enquiry') => {
    setDoorContactSubject(subject);
    setIsDoorContactOpen(true);
  }, []);

  // Read motion preference
  const prefersReducedMotion = typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Handle door hover (desktop) or tap (mobile preview)
  const handleDoorHover = useCallback((id) => {
    if (isTransitioningRef.current) return;
    if (phase === 'opening' || phase === 'entering' || phase === 'interior' || phase === 'exiting') return;

    setPreviewDoorId(id);
    setPhase('preview');
  }, [phase]);

  // Handle mouse leave on the doors container
  const handleWallMouseLeave = useCallback(() => {
    if (isTransitioningRef.current) return;
    if (phase === 'preview') {
      setPreviewDoorId(null);
      setPhase('idle');
    }
  }, [phase]);

  // Enter the door sequence
  const handleEnterDoor = useCallback((id) => {
    if (isTransitioningRef.current) return;
    if (phase === 'interior' || phase === 'entering' || phase === 'opening' || phase === 'exiting') return;

    isTransitioningRef.current = true;
    const targetId = id || previewDoorId || 'certifications';
    setOpeningDoorId(targetId);
    setPreviewDoorId(targetId);

    if (prefersReducedMotion) {
      setPhase('interior');
      setActiveInteriorId(targetId);
      isTransitioningRef.current = false;
      return;
    }

    // Step 1: Door Opening (swing leaf to ~86deg)
    setPhase('opening');

    // Step 2: Camera moves forward through doorway
    const enterTimer = setTimeout(() => {
      setPhase('entering');
    }, 400);

    // Step 3: Interior content is revealed
    const interiorTimer = setTimeout(() => {
      setActiveInteriorId(targetId);
      setPhase('interior');
      isTransitioningRef.current = false;
    }, 850);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(interiorTimer);
    };
  }, [previewDoorId, phase, prefersReducedMotion]);

  // Exit the room back to doors scene
  const handleExitRoom = useCallback(() => {
    if (isTransitioningRef.current) return;
    setIsDoorContactOpen(false);
    isTransitioningRef.current = true;

    if (prefersReducedMotion) {
      setActiveInteriorId(null);
      setOpeningDoorId(null);
      setPreviewDoorId(null);
      setPhase('idle');
      isTransitioningRef.current = false;
      return;
    }

    // Step 1: Exit camera pullback
    setPhase('exiting');

    // Step 2: Smoothly close door and restore scene
    const exitTimer = setTimeout(() => {
      setActiveInteriorId(null);
      setOpeningDoorId(null);
      setPreviewDoorId(null);
      setPhase('idle');
      isTransitioningRef.current = false;
    }, 550);

    return () => clearTimeout(exitTimer);
  }, [prefersReducedMotion]);

  // Keyboard navigation & Esc key to exit
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && phase === 'interior') {
        if (isDoorContactOpen) {
          setIsDoorContactOpen(false);
          return;
        }
        e.preventDefault();
        handleExitRoom();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, handleExitRoom, isDoorContactOpen]);

  // Lock body scroll whenever an interior room is active to prevent page scrolling behind
  useEffect(() => {
    if (activeInteriorId) {
      const scrollY = window.scrollY;
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
        window.scrollTo(0, scrollY);
      };
    }
  }, [activeInteriorId]);

  // Copy helper for contact interior
  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const activeTargetId = openingDoorId || previewDoorId || (isMobile ? skillDoors[activeGateIndex]?.id : null);
  const activeDoorData = previewDoorId ? doorDetails[previewDoorId] : (isMobile ? doorDetails[skillDoors[activeGateIndex]?.id] : null);
  const currentInteriorData = activeInteriorId ? doorDetails[activeInteriorId] : null;
  const previewDoorIndex = skillDoors.findIndex(d => d.id === previewDoorId);
  const activeTargetIndex = activeTargetId ? skillDoors.findIndex(d => d.id === activeTargetId) : (isMobile ? activeGateIndex : -1);

  return (
    <section id="work" className="doors-section" ref={sectionRef}>
      <div className="doors-sticky-viewport">
        {/* Section Header */}
        <div className="doors-header-wrap">
          <h2>
            <ShinyText
              text="Discover What Truly Defines Me"
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
          <p className="lead">
            Explore the achievements, certifications, experience, and connections that shape my journey.
          </p>

          {/* Mobile Gate Step Indicator */}
          <div className="mobile-gate-indicator" aria-live="polite">
            <div className="mobile-gate-step">
              <span className="gate-step-badge">
                GATE 0{activeGateIndex + 1} / 04
              </span>
              <span className="gate-step-name">
                {doorDetails[skillDoors[activeGateIndex]?.id]?.name || skillDoors[activeGateIndex]?.title}
              </span>
            </div>
            <div className="gate-progress-pills">
              {skillDoors.map((d, i) => (
                <span
                  key={d.id}
                  className={`gate-progress-pill ${i === activeGateIndex ? 'active' : ''}`}
                  style={{ '--door-accent': d.color }}
                  aria-hidden="true"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Main 3D Doors Scene Container */}
        <div 
          className={`doors-stage ${phase !== 'idle' ? `phase-${phase}` : ''} ${activeInteriorId ? 'is-inside' : ''}`}
          onMouseLeave={handleWallMouseLeave}
          style={{
            '--target-door-idx': activeTargetIndex >= 0 ? activeTargetIndex : (isMobile ? activeGateIndex : 0),
            '--door-color': activeTargetId ? (doorDetails[activeTargetId]?.color || '#ff7a45') : '#ff7a45'
          }}
        >
          {/* Wall & Doors container / Horizontal Track on mobile */}
          <div 
            ref={trackRef}
            className={`wall doors-horizontal-track ${previewDoorId ? 'wall-has-active' : ''}`}
          >
            {/* Render 4 Doors */}
            {skillDoors.map((door, index) => {
              const isTargetOpening = (phase === 'opening' || phase === 'entering') && openingDoorId === door.id;
              const isHovered = isMobile 
                ? (activeGateIndex === index) 
                : (openingDoorId ? openingDoorId === door.id : previewDoorId === door.id);
              const isOtherDimmed = isMobile 
                ? false 
                : Boolean(
                    (openingDoorId && openingDoorId !== door.id) || 
                    (!openingDoorId && previewDoorId && previewDoorId !== door.id)
                  );
              const isCert = door.id === 'certifications';
              const doorInfo = doorDetails[door.id];

              return (
                <div key={door.id} className="gate-slide">
                  <div
                    className={`dr ${isHovered ? 'is-hovered' : ''} ${isOtherDimmed ? 'is-dimmed' : ''} ${isTargetOpening ? 'is-opening' : ''} ${isCert ? 'dr-cert' : ''}`}
                    style={{ '--c': door.color }}
                    tabIndex={0}
                    role="button"
                    aria-label={`${door.title} door. Click to enter.`}
                    aria-expanded={isHovered}
                    onMouseEnter={() => !isMobile && handleDoorHover(door.id)}
                    onClick={() => handleEnterDoor(door.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleEnterDoor(door.id);
                      }
                    }}
                  >
                    <div className="frame">
                      {/* Subtle interior peek behind door */}
                      <div className="back">
                        <div className="door-peek-glow" style={{ background: door.color }} />
                        <span className="door-peek-label">Enter</span>
                      </div>

                      {/* Door leaf with fluted texture, plaque, handle, keyhole */}
                      <div className="leaf">
                        <div className="plaque">
                          {door.plaque.split('\n').map((line, idx) => (
                            <React.Fragment key={idx}>
                              {idx > 0 && <br />}
                              {line}
                            </React.Fragment>
                          ))}
                        </div>
                        <i className="hd" aria-hidden="true" />
                        <i className="ky" aria-hidden="true" />
                      </div>

                      {/* Floating "Click to enter" pill badge */}
                      <button
                        type="button"
                        className="click-to-enter-pill"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEnterDoor(door.id);
                        }}
                        aria-label={`Click to enter ${door.title}`}
                      >
                        <span>Click to enter</span>
                        <ArrowRight size={13} aria-hidden="true" />
                      </button>
                    </div>
                  </div>

                  {/* Mobile Gate Detail Card below the gate */}
                  <div className="gate-mobile-card">
                    <span className="gate-mobile-tagline">{doorInfo?.tagline || door.title}</span>
                    <h3 className="gate-mobile-title">{doorInfo?.name || door.title}</h3>
                    <button
                      type="button"
                      className="gate-mobile-enter-btn"
                      onClick={() => handleEnterDoor(door.id)}
                      aria-label={`Step inside ${doorInfo?.name || door.title}`}
                    >
                      <span>Step inside this room</span>
                      <ArrowRight size={14} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop Side Information Preview Panel (Screenshot 2 Match) */}
          {activeDoorData && !isMobile && (phase === 'preview' || phase === 'opening') && (
            <div 
              className={`door-preview-panel ${previewDoorIndex >= 2 ? 'panel-left' : 'panel-right'}`}
              role="region"
              aria-live="polite"
              aria-label={`${activeDoorData.name} preview`}
            >
              <div className="preview-panel-inner">
                <span className="preview-tagline">{activeDoorData.tagline}</span>
                <h3 className="preview-title">{activeDoorData.name}</h3>

                <ul className="preview-points-list">
                  {activeDoorData.previewPoints.map((point, idx) => (
                    <li key={idx} className="preview-point-item">
                      <span className="point-icon-wrap" aria-hidden="true">
                        <CheckCircle2 size={16} />
                      </span>
                      <span className="point-text">{point}</span>
                    </li>
                  ))}
                </ul>

                <div className="preview-action-row">
                  <button 
                    type="button"
                    className="preview-enter-cta-btn"
                    onClick={() => handleEnterDoor(previewDoorId)}
                    aria-label={`Enter ${activeDoorData.name} room`}
                  >
                    <span>Step inside this room</span>
                    <ArrowRight size={15} />
                  </button>
                  <span className="preview-hint-text">Click door or button to enter</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Gate Scroll Hint */}
        <div className="mobile-gate-scroll-hint" aria-hidden="true">
          {activeGateIndex < skillDoors.length - 1 ? (
            <span>Scroll down for next gate &rarr;</span>
          ) : (
            <span className="hint-complete">Scroll down to explore Projects &darr;</span>
          )}
        </div>
      </div>

        {/* ==============================================================
            CARD SHOWCASE (CERTIFICATIONS & ACHIEVEMENTS): Dedicated Isolated Fullscreen Experience
            ============================================================== */}
        {(activeInteriorId === 'certifications' || activeInteriorId === 'achievements') && (phase === 'interior' || phase === 'entering' || phase === 'exiting') && createPortal(
          <div 
            className={`cert-fullscreen-showcase ${phase === 'exiting' ? 'is-exiting' : ''}`}
            role="dialog"
            aria-modal="true"
            aria-label={activeInteriorId === 'achievements' ? 'Achievements Showcase' : 'Certifications Showcase'}
          >
            {/* Ambient Lighting */}
            <div className="cert-showcase-atmosphere" />

            {/* Topbar: Return to Doors + Skip on Left, Category Badge on Right */}
            <div className="cert-showcase-topbar">
              <div className="cert-topbar-controls">
                <button
                  type="button"
                  className="cert-nav-btn cert-return-btn"
                  onClick={handleExitRoom}
                  aria-label="Return to doors view"
                  title="Return to doors (Esc)"
                >
                  <ArrowLeft size={16} />
                  <span>Return to Doors</span>
                  <kbd className="key-hint">ESC</kbd>
                </button>

                <button
                  type="button"
                  className="cert-nav-btn cert-skip-btn"
                  onClick={handleExitRoom}
                  aria-label="Skip showcase and return to doors"
                  title="Skip showcase"
                >
                  <span>Skip</span>
                </button>
              </div>

              <div className="interior-badge">
                <span 
                  className="door-dot" 
                  style={{ background: skillDoors.find(d => d.id === activeInteriorId)?.color || '#ff7a45' }}
                />
                <span className="badge-text">
                  {activeInteriorId === 'achievements' ? 'Achievements & Impact' : 'Certifications & Credentials'}
                </span>
              </div>
            </div>

            {/* Central Stage: Strictly ONLY the animated Filmstrip Carousel */}
            <div className="cert-showcase-stage">
              <div className="cert-stage-card-frame">
                <CertificateCarousel 
                  items={activeInteriorId === 'achievements' ? achievementsList : certificatesList}
                  itemLabel={activeInteriorId === 'achievements' ? 'ACHIEVEMENT' : 'CERTIFICATE'}
                />
              </div>
            </div>
          </div>,
          document.body
        )}

        {/* ==============================================================
            INTERIOR VIEW: Other Categories (Connect, Experience)
            ============================================================== */}
        {activeInteriorId && activeInteriorId !== 'certifications' && activeInteriorId !== 'achievements' && (phase === 'interior' || phase === 'entering' || phase === 'exiting') && currentInteriorData && createPortal(
          <div 
            className={`door-interior-room ${phase === 'exiting' ? 'phase-exiting' : ''}`}
            role="dialog"
            aria-modal="true"
            aria-label={`${currentInteriorData.name} Interior`}
          >
            {/* Ambient Background & Atmospheric Lighting */}
            <div 
              className="interior-atmosphere" 
              style={{ '--accent-door': skillDoors.find(d => d.id === activeInteriorId)?.color || '#ff7a45' }}
            />

            {/* Top Navigation Bar with Return to Doors Control */}
            <div className="interior-topbar">
              <div className="cert-topbar-controls">
                <button
                  type="button"
                  className="interior-back-btn"
                  onClick={handleExitRoom}
                  aria-label="Return to doors view"
                  title="Return to doors (Esc)"
                >
                  <ArrowLeft size={18} />
                  <span>Return to Doors</span>
                  <kbd className="key-hint">Esc</kbd>
                </button>

                <button
                  type="button"
                  className="cert-nav-btn cert-skip-btn"
                  onClick={handleExitRoom}
                  aria-label="Skip and return to doors"
                  title="Skip"
                >
                  <span>Skip</span>
                </button>
              </div>

              <div className="interior-badge">
                <span 
                  className="door-dot" 
                  style={{ background: skillDoors.find(d => d.id === activeInteriorId)?.color }}
                />
                <span className="badge-text">{currentInteriorData.name}</span>
              </div>
            </div>

            {/* Interior Main Content Frame */}
            <div className={`interior-content-scroll ${isDoorContactOpen ? 'modal-active' : ''}`}>
              <div className="interior-content-container">

                {/* 3. CONNECT WITH ME INTERIOR */}
                {activeInteriorId === 'connect' && (
                  <div className="interior-connect-view">
                    <div className="interior-hero">
                      <span className="interior-eyebrow">OPEN FOR OPPORTUNITIES</span>
                      <h3 className="interior-main-title">Let's Build Something Great Together</h3>
                      <p className="interior-subtitle">
                        Actively seeking Salesforce Developer Trainee and Full Stack Engineering positions. Reach out directly through any preferred channel.
                      </p>
                    </div>

                    <div className="connect-channels-grid">
                      {currentInteriorData.channels?.map((channel, idx) => {
                        const isCopied = copiedKey === channel.label;
                        const isEmailOrPhone = channel.label.includes('Email') || channel.label.includes('Phone');
                        const isLink = channel.href.startsWith('http') || channel.href.startsWith('mailto') || channel.href.startsWith('tel') || channel.href.endsWith('.pdf');
                        const isExternal = channel.href.startsWith('http') || channel.href.endsWith('.pdf');

                        const handleCardClick = (e) => {
                          if (e.target.closest('.channel-copy-btn')) return;
                          
                          if (isEmailOrPhone) {
                            handleOpenDoorContact(channel.label.includes('Phone') ? 'Phone / WhatsApp Enquiry' : 'General Enquiry');
                            return;
                          }

                          if (isLink && !e.target.closest('a') && !e.target.closest('button')) {
                            if (isExternal) {
                              window.open(channel.href, '_blank', 'noopener,noreferrer');
                            } else {
                              window.location.href = channel.href;
                            }
                          }
                        };

                        return (
                          <div 
                            key={idx} 
                            className="connect-channel-card"
                            onClick={handleCardClick}
                            style={{ cursor: (isEmailOrPhone || isLink) ? 'pointer' : 'default' }}
                          >
                            <div className="channel-top">
                              <div className="channel-icon-wrap">
                                {channel.label.includes('Email') ? <Mail size={20} /> :
                                 channel.label.includes('Phone') ? <Phone size={20} /> :
                                 channel.label.includes('Curriculum') ? <FileText size={20} /> :
                                 channel.label.includes('LinkedIn') ? <Linkedin size={20} /> : <Sparkles size={20} />}
                              </div>
                              <span className="channel-label">{channel.label}</span>
                            </div>

                            <div className="channel-body">
                              <span className="channel-value">{channel.value}</span>
                            </div>

                            <div className="channel-actions">
                              {isEmailOrPhone ? (
                                <button
                                  type="button"
                                  className="channel-cta-btn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenDoorContact(channel.label.includes('Phone') ? 'Phone / WhatsApp Enquiry' : 'General Enquiry');
                                  }}
                                >
                                  <span>{channel.action}</span>
                                  <ExternalLink size={14} />
                                </button>
                              ) : isLink ? (
                                <a 
                                  href={channel.href}
                                  target={isExternal ? '_blank' : undefined}
                                  rel={isExternal ? 'noopener noreferrer' : undefined}
                                  className="channel-cta-btn"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <span>{channel.action}</span>
                                  <ExternalLink size={14} />
                                </a>
                              ) : null}

                              {(channel.label.includes('Email') || channel.label.includes('Phone')) && (
                                <button
                                  type="button"
                                  className={`channel-copy-btn ${isCopied ? 'copied' : ''}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCopy(channel.value, channel.label);
                                  }}
                                  aria-label={`Copy ${channel.label}`}
                                >
                                  {isCopied ? <Check size={14} /> : <Copy size={14} />}
                                  <span>{isCopied ? 'Copied' : 'Copy'}</span>
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 4. EXPERIENCE INTERIOR */}
                {activeInteriorId === 'experience' && (
                  <div className="interior-experience-view">
                    <div className="interior-hero">
                      <span className="interior-eyebrow">CAREER & MILESTONES</span>
                      <h3 className="interior-main-title">Engineering Journey & Milestones</h3>
                      <p className="interior-subtitle">
                        From foundational computer science education to shipping production web applications and modern AI tooling.
                      </p>
                    </div>

                    <div className="experience-timeline-container">
                      {currentInteriorData.timeline?.map((item, idx) => (
                        <div key={idx} className="timeline-node-card">
                          <div className="timeline-dot-track">
                            <div className="timeline-badge-dot" />
                            {idx < currentInteriorData.timeline.length - 1 && (
                              <div className="timeline-line-connector" />
                            )}
                          </div>
                          <div className="timeline-card-content">
                            <div className="timeline-period-badge">{item.period}</div>
                            <h4 className="timeline-role-title">{item.role}</h4>
                            <span className="timeline-org-name">{item.organization}</span>
                            <ul className="timeline-highlights-list">
                              {item.highlights.map((hl, hIdx) => (
                                <li key={hIdx}>{hl}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* In-Door Contact Form Modal (Contained within door) */}
            <ContactModal
              isOpen={isDoorContactOpen}
              onClose={() => setIsDoorContactOpen(false)}
              initialSubject={doorContactSubject}
              isEmbedded={true}
            />
          </div>,
          document.body
        )}
    </section>
  );
}
