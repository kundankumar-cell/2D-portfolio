import React, { useState, useEffect, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { personalInfo } from '../data/portfolioData';

// Helper for strict request timeout to prevent endless loading (15 seconds)
const withTimeout = (promise, ms = 15000) => {
  let timer;
  const timeoutPromise = new Promise((_, reject) => {
    timer = setTimeout(() => {
      reject(new Error('REQUEST_TIMEOUT: The email service request timed out.'));
    }, ms);
  });

  return Promise.race([
    promise.then((res) => {
      clearTimeout(timer);
      return res;
    }),
    timeoutPromise
  ]);
};

export default function HireModal({ isOpen, onClose }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [work, setWork] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [statusMessage, setStatusMessage] = useState('');
  const nameInputRef = useRef(null);
  const closeTimerRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const timer = setTimeout(() => {
        if (nameInputRef.current) nameInputRef.current.focus();
      }, 350);

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        clearTimeout(timer);
        if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
        window.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
      };
    } else {
      document.body.style.overflow = '';
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    }
  }, [isOpen, onClose]);

  const handleInputChange = (field, value) => {
    if (field === 'name') setName(value);
    if (field === 'email') setEmail(value);
    if (field === 'phone') setPhone(value);
    if (field === 'work') setWork(value);

    // Clear error as soon as user types
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }

    if (status !== 'idle') {
      setStatus('idle');
      setStatusMessage('');
    }
  };

  const validate = () => {
    const newErrors = {};
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();
    const trimmedWork = work.trim();

    // Name validation
    if (!trimmedName) {
      newErrors.name = 'Please enter your name.';
    } else if (trimmedName.length < 2) {
      newErrors.name = 'Name must be at least 2 characters.';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail) {
      newErrors.email = 'Please enter your email address.';
    } else if (!emailRegex.test(trimmedEmail)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    // Phone validation (validate if provided)
    const phoneRegex = /^[+]?[\d\s\-.()]{7,20}$/;
    if (trimmedPhone && !phoneRegex.test(trimmedPhone)) {
      newErrors.phone = 'Please enter a valid phone number (at least 7 digits).';
    }

    // What do you need? validation
    if (!trimmedWork) {
      newErrors.work = 'Please describe what you need built.';
    } else if (trimmedWork.length < 5) {
      newErrors.work = 'Please provide a bit more detail (at least 5 characters).';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent duplicate submissions
    if (isSubmitting) return;

    const formErrors = validate();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      // Focus the first invalid field
      const firstErrorField = Object.keys(formErrors)[0];
      const el = document.getElementById(
        firstErrorField === 'name' ? 'hn' :
        firstErrorField === 'email' ? 'he' :
        firstErrorField === 'phone' ? 'hp' : 'hw'
      );
      if (el) el.focus();
      return;
    }

    setErrors({});
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();
    const trimmedWork = work.trim();

    // Dynamically retrieve environment variables on submit
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID?.trim() || '';
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID?.trim() || '';
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY?.trim() || '';

    const hasValidConfig = Boolean(
      serviceId && 
      templateId && 
      publicKey &&
      !serviceId.includes('your_') &&
      !templateId.includes('your_') &&
      !publicKey.includes('your_')
    );

    // Disable submit button and activate loading state
    setIsSubmitting(true);
    setStatus('loading');
    setStatusMessage('');

    if (!hasValidConfig) {
      console.error(
        '[EmailJS Configuration]: Required environment variables are missing or incomplete. ' +
        'Please check VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, and VITE_EMAILJS_PUBLIC_KEY in your .env file.'
      );
      setIsSubmitting(false);
      setStatus('error');
      setStatusMessage('Unable to send your message right now. Please try again.');
      return;
    }

    try {
      // Format message body including phone if provided
      const formattedMessage = trimmedPhone
        ? `${trimmedWork}\n\n[Contact Phone: ${trimmedPhone}]`
        : trimmedWork;

      // Exact EmailJS template parameters matching user's template configuration
      const templateParams = {
        from_name: trimmedName,
        email: trimmedEmail,
        reply_to: trimmedEmail,
        phone: trimmedPhone || 'Not provided',
        message: formattedMessage,
        to_name: 'Kundan Kumar',
        recipient_email: personalInfo.email || 'kundanpatel25052003@gmail.com',
        submission_time: new Date().toLocaleString('en-US', {
          dateStyle: 'medium',
          timeStyle: 'short'
        })
      };

      // Execute send request with timeout protection (15 seconds)
      await withTimeout(
        emailjs.send(serviceId, templateId, templateParams, publicKey),
        15000
      );

      // On successful submission: show success message, clear form
      setStatus('success');
      setStatusMessage("Message sent successfully! I'll get back to you soon.");
      setName('');
      setEmail('');
      setPhone('');
      setWork('');
      setErrors({});

      // Auto-close modal after successful send
      closeTimerRef.current = setTimeout(() => {
        onClose();
        setStatus('idle');
        setStatusMessage('');
      }, 2400);
    } catch (err) {
      console.error('[EmailJS Hire Modal Failure]:', err?.text || err?.message || err);
      setStatus('error');
      setStatusMessage('Unable to send your message right now. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="hm"
      className={`hm ${isOpen ? 'show' : ''}`}
      aria-hidden={!isOpen}
      onClick={(e) => {
        if (e.target.id === 'hm') onClose();
      }}
    >
      <div className="hc" role="dialog" aria-modal="true" aria-labelledby="hmt">
        <button className="hx" id="hx" type="button" aria-label="Close" onClick={onClose}>
          &times;
        </button>

        <span className="hl2">
          <i></i> Hire me
        </span>

        <h2 id="hmt">Tell me what you need built.</h2>

        <form id="hf" className="hire-form" onSubmit={handleSubmit} noValidate>
          <div className="hire-form-grid">
            {/* Name Field: Half-width on desktop */}
            <div className="hire-field hire-field-name">
              <label htmlFor="hn" className="hire-label">
                Name <span className="hire-req-mark">*</span>
              </label>
              <input
                id="hn"
                ref={nameInputRef}
                type="text"
                className={`hire-input ${errors.name ? 'has-error' : ''}`}
                placeholder="Your name"
                value={name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                disabled={isSubmitting}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'hn-error' : undefined}
              />
              {errors.name && (
                <span id="hn-error" className="hire-error-msg" role="alert">
                  {errors.name}
                </span>
              )}
            </div>

            {/* Email Field: Half-width on desktop */}
            <div className="hire-field hire-field-email">
              <label htmlFor="he" className="hire-label">
                Email <span className="hire-req-mark">*</span>
              </label>
              <input
                id="he"
                type="email"
                className={`hire-input ${errors.email ? 'has-error' : ''}`}
                placeholder="you@company.com"
                value={email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={isSubmitting}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'he-error' : undefined}
              />
              {errors.email && (
                <span id="he-error" className="hire-error-msg" role="alert">
                  {errors.email}
                </span>
              )}
            </div>

            {/* Phone Field: Half-width on desktop */}
            <div className="hire-field hire-field-phone">
              <label htmlFor="hp" className="hire-label">
                Phone <span className="hire-opt-mark">(Optional)</span>
              </label>
              <input
                id="hp"
                type="tel"
                className={`hire-input ${errors.phone ? 'has-error' : ''}`}
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                disabled={isSubmitting}
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? 'hp-error' : undefined}
              />
              {errors.phone && (
                <span id="hp-error" className="hire-error-msg" role="alert">
                  {errors.phone}
                </span>
              )}
            </div>

            {/* What do you need? Field: Full-width row */}
            <div className="hire-field hire-field-message">
              <label htmlFor="hw" className="hire-label">
                What do you need? <span className="hire-req-mark">*</span>
              </label>
              <textarea
                id="hw"
                rows="4"
                className={`hire-textarea ${errors.work ? 'has-error' : ''}`}
                placeholder="Describe the work you’d like done — scope, timeline and budget."
                value={work}
                onChange={(e) => handleInputChange('work', e.target.value)}
                disabled={isSubmitting}
                aria-invalid={!!errors.work}
                aria-describedby={errors.work ? 'hw-error' : undefined}
              ></textarea>
              {errors.work && (
                <span id="hw-error" className="hire-error-msg" role="alert">
                  {errors.work}
                </span>
              )}
            </div>

            {/* Footer row with status note and submit CTA */}
            <div className="hrow hire-form-footer">
              <div id="hs" className="hire-status-text" aria-live="polite">
                {status === 'loading' && (
                  <span className="hire-status-inline">
                    <Loader2 size={14} className="btn-spinner" aria-hidden="true" />
                    <span>Sending your enquiry...</span>
                  </span>
                )}
                {status === 'success' && (
                  <span className="hire-status-inline text-success">
                    <CheckCircle2 size={14} aria-hidden="true" />
                    <span>{statusMessage}</span>
                  </span>
                )}
                {status === 'error' && (
                  <span className="hire-status-inline text-error">
                    <AlertCircle size={14} aria-hidden="true" />
                    <span>{statusMessage}</span>
                  </span>
                )}
                {status === 'idle' && (
                  <span>I reply within one business day.</span>
                )}
              </div>

              <button
                className="btn dark hire-submit-btn"
                type="submit"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="btn-spinner" aria-hidden="true" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <span>Send message</span>
                    <span className="arr" aria-hidden="true">&rarr;</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

