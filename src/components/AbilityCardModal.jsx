import React, { useEffect, useState } from 'react';
import Lanyard from './Lanyard';
import { X } from 'lucide-react';
import { generateCardTextures } from '../utils/cardTextureGenerator';
import './Lanyard.css';

export default function AbilityCardModal({ isOpen, onClose }) {
  const [textures, setTextures] = useState({ front: null, back: null });

  useEffect(() => {
    let active = true;
    generateCardTextures('/images/Screenshot 2026-08-12 004208.png').then((res) => {
      if (active && res) {
        setTextures(res);
      }
    });

    return () => {
      active = false;
    };
  }, []);

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
      className="lanyard-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="My ID Card"
      onClick={(e) => {
        if (
          e.target.classList.contains('lanyard-modal-overlay') ||
          e.target.classList.contains('lanyard-modal-backdrop')
        ) {
          onClose();
        }
      }}
    >
      <div className="lanyard-modal-backdrop" onClick={onClose} />

      <div className="lanyard-modal-content">
        {/* Close Button - View-Only Experience */}
        <button
          type="button"
          className="lanyard-modal-close"
          onClick={onClose}
          aria-label="Close My ID Card"
          title="Close (Esc)"
        >
          <X size={20} />
        </button>

        {/* Hanging Lanyard Card Stage */}
        <div className="lanyard-stage-container">
          <Lanyard
            frontImage={textures.front}
            backImage={textures.back}
            cardColor="#0a1426"
            strapColor="#070e1c"
            orientation="portrait"
            finish="metallic"
            metal="gold"
            size={0.78}
            interactive={true}
            intro={true}
          />
        </div>

        {/* Minimal interaction instructions at bottom */}
        <div className="lanyard-hint">
          <span>Drag to swing</span>
          <span style={{ opacity: 0.5 }}>•</span>
          <span>Click to flip card</span>
        </div>
      </div>
    </div>
  );
}
