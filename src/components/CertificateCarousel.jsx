import React, { useState, useEffect, useCallback, useRef } from 'react';
import { certificatesList } from '../data/portfolioData';
import { 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  X, 
  ExternalLink,
  Award
} from 'lucide-react';

export default function CertificateCarousel({ items, certificates, itemLabel = "CERTIFICATE" }) {
  const dataList = items || certificates || certificatesList;
  const [activeIndex, setActiveIndex] = useState(0);
  const [inspectingCert, setInspectingCert] = useState(null);
  const [touchStartX, setTouchStartX] = useState(null);
  const total = dataList.length;

  const nextCert = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevCert = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (inspectingCert) {
        if (e.key === 'Escape') {
          setInspectingCert(null);
        } else if (e.key === 'ArrowRight') {
          const nextIdx = (dataList.findIndex(c => c.id === inspectingCert.id) + 1) % total;
          setInspectingCert(dataList[nextIdx]);
          setActiveIndex(nextIdx);
        } else if (e.key === 'ArrowLeft') {
          const prevIdx = (dataList.findIndex(c => c.id === inspectingCert.id) - 1 + total) % total;
          setInspectingCert(dataList[prevIdx]);
          setActiveIndex(prevIdx);
        }
        return;
      }

      if (e.key === 'ArrowRight') {
        nextCert();
      } else if (e.key === 'ArrowLeft') {
        prevCert();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inspectingCert, dataList, nextCert, prevCert, total]);

  // Touch Swipe handlers
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > 45) {
      if (diff > 0) {
        nextCert();
      } else {
        prevCert();
      }
    }
    setTouchStartX(null);
  };

  return (
    <div 
      className="cert-filmstrip-container"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* 3D Stage Background with Subtle Grid Texture */}
      <div className="cert-filmstrip-stage">
        <div className="cert-filmstrip-deck">
          {dataList.map((cert, index) => {
            // Calculate wrapped offset around the center (0 = center, -1 = left, +1 = right)
            let offset = index - activeIndex;
            if (offset > total / 2) offset -= total;
            if (offset < -total / 2) offset += total;

            const isCenter = offset === 0;
            const absOffset = Math.abs(offset);

            // Hide cards beyond 2 steps on either side for a clean filmstrip
            const isVisible = absOffset <= 2;
            if (!isVisible) return null;

            // 3D positioning matching ThreeUI CharacterCarousel Filmstrip
            const x = offset * 240;
            const z = -absOffset * 95;
            const rotateY = -offset * 16;
            const scale = Math.max(0.68, 1 - absOffset * 0.14);
            const opacity = Math.max(0.28, 1 - absOffset * 0.36);
            const zIndex = 20 - absOffset;

            return (
              <div
                key={cert.id}
                className={`cert-filmstrip-card ${isCenter ? 'is-center' : ''}`}
                style={{
                  transform: `translate(-50%, -50%) translate3d(${x}px, 0px, ${z}px) rotateY(${rotateY}deg) scale(${scale})`,
                  opacity,
                  zIndex,
                  pointerEvents: isCenter || absOffset === 1 ? 'auto' : 'none',
                }}
                onClick={() => {
                  if (isCenter) {
                    setInspectingCert(cert);
                  } else {
                    setActiveIndex(index);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label={`${cert.title} - ${cert.issuer}. ${isCenter ? 'Click to inspect full certificate' : 'Click to center'}`}
              >
                <div className="cert-card-inner">
                  {/* Certificate Image Frame */}
                  <div className="cert-card-image-box">
                    <img 
                      src={cert.image} 
                      alt={cert.title}
                      className="cert-card-img"
                      loading="eager"
                    />
                    {isCenter && (
                      <div className="cert-card-hover-overlay">
                        <span className="inspect-pill">
                          <Maximize2 size={14} />
                          <span>View Full</span>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Bottom Plaque Banner (CharacterCarousel style) */}
                  <div className="cert-card-plaque">
                    <div className="plaque-top-row">
                      <span className="plaque-number">{cert.number}</span>
                      <span className="plaque-category">{cert.category}</span>
                    </div>
                    <h4 className="plaque-title">{cert.title}</h4>
                    <span className="plaque-issuer">{cert.issuer}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        type="button"
        className="cert-stage-nav-arrow arrow-left"
        onClick={prevCert}
        aria-label="Previous certificate"
        title="Previous certificate (ArrowLeft)"
      >
        <ChevronLeft size={22} />
      </button>

      <button
        type="button"
        className="cert-stage-nav-arrow arrow-right"
        onClick={nextCert}
        aria-label="Next certificate"
        title="Next certificate (ArrowRight)"
      >
        <ChevronRight size={22} />
      </button>

      {/* Bottom Dots Indicator */}
      <div className="cert-stage-pagination" role="tablist">
        {dataList.map((cert, idx) => (
          <button
            key={cert.id}
            type="button"
            className={`cert-pagination-dot ${idx === activeIndex ? 'is-active' : ''}`}
            onClick={() => setActiveIndex(idx)}
            aria-label={`Jump to ${cert.title}`}
            role="tab"
            aria-selected={idx === activeIndex}
          />
        ))}
      </div>

      {/* ==============================================================
          LIGHTBOX MODAL: Full-Resolution Inspection View
          ============================================================== */}
      {inspectingCert && (
        <div 
          className="cert-lightbox-modal"
          role="dialog"
          aria-modal="true"
          aria-label={inspectingCert.title}
          onClick={(e) => {
            if (e.target.classList.contains('cert-lightbox-modal')) {
              setInspectingCert(null);
            }
          }}
        >
          <div className="cert-lightbox-backdrop" />

          <div className="cert-lightbox-content">
            {/* Lightbox Topbar */}
            <div className="cert-lightbox-header">
              <div className="lightbox-title-wrap">
                <span className="lightbox-number">{itemLabel} {inspectingCert.number}</span>
                <h3 className="lightbox-title">{inspectingCert.title}</h3>
                <span className="lightbox-issuer">{inspectingCert.issuer}</span>
              </div>

              <div className="lightbox-header-actions">
                <a 
                  href={inspectingCert.image} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="lightbox-action-btn"
                  title="Open original image in new tab"
                >
                  <ExternalLink size={16} />
                  <span>Open Full Image</span>
                </a>

                <button
                  type="button"
                  className="lightbox-close-btn"
                  onClick={() => setInspectingCert(null)}
                  aria-label="Close certificate inspection view"
                  title="Close (Esc)"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Lightbox Certificate Image Container (Uncropped, Proportional) */}
            <div className="cert-lightbox-image-container">
              <img 
                src={inspectingCert.image} 
                alt={inspectingCert.title}
                className="cert-lightbox-full-img"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

