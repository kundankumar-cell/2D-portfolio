import React from 'react';
import { Download } from 'lucide-react';
import { personalInfo } from '../data/portfolioData';
import NotebookCard from '../components/NotebookCard';

export default function Hero({ onOpenHire, onOpenAbilityCard }) {
  const handleScrollTo = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero-section" id="top">
      <div className="hero-content-grid">
        {/* Left Column: Heading, Role Notebook, Buttons */}
        <div className="hero-left-column">
          <h1 className="hero-title">
            Hi, I’m {personalInfo.shortName}.
          </h1>
          <div className="hero-subtitle">I am a</div>

          {/* Spiral Notebook Role Card */}
          <div className="hero-notebook-wrapper">
            <NotebookCard />
          </div>

          {/* Action Buttons */}
          <div className="hero-buttons-row">
            <a
              href="#contact"
              className="hero-btn-hire"
              onClick={(e) => {
                e.preventDefault();
                onOpenHire();
              }}
            >
              <span>Hire me</span>
              <span className="hero-btn-arrow" aria-hidden="true">&rarr;</span>
            </a>

            <a
              href="#projects"
              className="hero-btn-work"
              onClick={(e) => handleScrollTo(e, 'projects')}
            >
              See my work
            </a>

            <a
              href={personalInfo.resumeUrl || '/file/Kundan_Kumar_CV.pdf'}
              download={personalInfo.resumeFilename || 'Kundan_Kumar_CV.pdf'}
              target="_blank"
              rel="noopener noreferrer"
              className="hero-btn-cv"
              aria-label="Download CV"
            >
              <Download size={16} className="hero-btn-cv-icon" aria-hidden="true" />
              <span>Download CV</span>
            </a>
          </div>
        </div>

        {/* Right Column: Portrait Photo & Floating Ability Card */}
        <div className="hero-right-column">
          <div className="portrait-container">
            <img
              src={personalInfo.profileImage}
              alt={personalInfo.name}
              className="portrait-image"
              loading="eager"
            />

            {/* Floating Ability Card Button */}
            <button
              type="button"
              className="floating-ability-card"
              onClick={(e) => {
                e.preventDefault();
                if (onOpenAbilityCard) onOpenAbilityCard();
              }}
              aria-label="Open My ID Card"
            >
              My ID Card
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Metadata Bar */}
      <div className="hero-bottom-bar">
        <div className="hero-meta-item">AVAILABLE FOR WORK</div>
        <div className="hero-meta-item">REMOTE-FIRST, WORLDWIDE</div>
        <a
          href="#work"
          className="hero-meta-item hero-meta-scroll"
          onClick={(e) => handleScrollTo(e, 'work')}
        >
          SCROLL TO EXPLORE &darr;
        </a>
      </div>
    </section>
  );
}
