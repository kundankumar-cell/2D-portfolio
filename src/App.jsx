import React, { useState } from 'react';
import './styles/portfolio.css';

import Loader from './components/Loader';
import ScrollProgress from './components/ScrollProgress';
import CursorGlow from './components/CursorGlow';
import ThemeToggle from './components/ThemeToggle';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import HireModal from './components/HireModal';
import AbilityCardModal from './components/AbilityCardModal';
import ContactModal from './components/ContactModal';

import Hero from './sections/Hero';
import Marquee from './sections/Marquee';
import SkillsDoors from './sections/SkillsDoors';
import Projects from './sections/Projects';
import StoryTimeline from './sections/StoryTimeline';
import Contact from './sections/Contact';
import Footer from './sections/Footer';

import { useScrollReveal } from './hooks/useScrollReveal';

export default function App() {
  const [isHireOpen, setIsHireOpen] = useState(false);
  const [isAbilityOpen, setIsAbilityOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactSubject, setContactSubject] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  const handleOpenContactModal = (subject = '') => {
    setContactSubject(subject);
    setIsContactModalOpen(true);
  };

  // Trigger scroll reveal animations once loader is done
  useScrollReveal([isLoaded]);

  return (
    <>
      <Loader onComplete={() => setIsLoaded(true)} />
      <ScrollProgress />
      <CursorGlow />
      <ThemeToggle />

      <Navbar />

      <main>
        <Hero 
          onOpenHire={() => setIsHireOpen(true)} 
          onOpenAbilityCard={() => setIsAbilityOpen(true)}
        />
        <Marquee />
        <SkillsDoors onOpenContactModal={handleOpenContactModal} />
        <Projects />
        <StoryTimeline />
        <Contact onOpenContactModal={handleOpenContactModal} />
      </main>

      <HireModal isOpen={isHireOpen} onClose={() => setIsHireOpen(false)} />
      <AbilityCardModal isOpen={isAbilityOpen} onClose={() => setIsAbilityOpen(false)} />
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        initialSubject={contactSubject}
      />
      <ScrollToTop />
      <Footer />
    </>
  );
}
