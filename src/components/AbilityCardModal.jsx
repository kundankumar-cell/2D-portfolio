import React, { useEffect } from 'react';
import { DarkSoulsHoloCard } from '../shaders/dark-souls-holo-card/DarkSoulsHoloCard';
import '../shaders/threeui.css';
import { X, Sparkles } from 'lucide-react';

export default function AbilityCardModal({ isOpen, onClose }) {
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="ability-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Interactive Legendary Developer Holographic Identity Card"
      onClick={(e) => {
        if (e.target.classList.contains('ability-modal-overlay')) {
          onClose();
        }
      }}
    >
      <div className="ability-modal-backdrop" />

      <div className="ability-modal-content">
        {/* Close Button */}
        <button
          type="button"
          className="ability-modal-close"
          onClick={onClose}
          aria-label="Close ID Card"
          title="Close (Esc)"
        >
          <X size={20} />
        </button>

        {/* 3D Holo Card Canvas / Frame */}
        <div className="ability-card-frame">
          <DarkSoulsHoloCard variant="cindermane" />
        </div>

        {/* Bottom Interactive Hint */}
        <div className="ability-card-pill">
          <Sparkles size={14} className="pill-icon" aria-hidden="true" />
          <span>Click & drag to rotate • Double-click or press F to flip • Hover for foil</span>
        </div>
      </div>
    </div>
  );
}

