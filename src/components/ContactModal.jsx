import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  Mail, 
  MessageSquare 
} from 'lucide-react';
import { personalInfo } from '../data/portfolioData';
import { sendPortfolioEmail } from '../utils/emailService';

export default function ContactModal({ isOpen, onClose, initialSubject = '', isEmbedded = false }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: initialSubject,
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [statusMessage, setStatusMessage] = useState('');

  const nameInputRef = useRef(null);
  const closeTimerRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      if (!isEmbedded) {
        document.body.style.overflow = 'hidden';
      }
      const timer = setTimeout(() => {
        if (nameInputRef.current) nameInputRef.current.focus();
      }, 300);

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          e.stopPropagation();
          onClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown, true);

      return () => {
        clearTimeout(timer);
        if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
        window.removeEventListener('keydown', handleKeyDown, true);
        if (!isEmbedded) {
          document.body.style.overflow = '';
        }
      };
    } else {
      if (!isEmbedded) {
        document.body.style.overflow = '';
      }
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    }
  }, [isOpen, onClose, isEmbedded]);

  useEffect(() => {
    if (initialSubject && !formData.subject) {
      setFormData((prev) => ({ ...prev, subject: initialSubject }));
    }
  }, [initialSubject]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error immediately when user begins correcting
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
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
    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedPhone = formData.phone.trim();
    const trimmedMessage = formData.message.trim();

    // Full Name (required)
    if (!trimmedName) {
      newErrors.name = 'Please enter your full name.';
    } else if (trimmedName.length < 2) {
      newErrors.name = 'Name must be at least 2 characters.';
    }

    // Email Address (required)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail) {
      newErrors.email = 'Please enter your email address.';
    } else if (!emailRegex.test(trimmedEmail)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    // Phone Number (optional, validates if entered)
    const phoneRegex = /^[+]?[\d\s\-.()]{7,20}$/;
    if (trimmedPhone && !phoneRegex.test(trimmedPhone)) {
      newErrors.phone = 'Please enter a valid phone number (at least 7 digits).';
    }

    // Message (required)
    if (!trimmedMessage) {
      newErrors.message = 'Please enter your message.';
    } else if (trimmedMessage.length < 5) {
      newErrors.message = 'Message must be at least 5 characters.';
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
      // Focus first error field
      const firstField = Object.keys(formErrors)[0];
      const el = document.getElementById(`cm-${firstField}`);
      if (el) el.focus();
      return;
    }

    setErrors({});
    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedPhone = formData.phone.trim();
    const trimmedSubject = formData.subject.trim();
    const trimmedMessage = formData.message.trim();

    // Disable button & activate loading state
    setIsSubmitting(true);
    setStatus('loading');
    setStatusMessage('');

    try {
      // Format message body to ensure Subject & Phone are prominent
      const formattedMessage = [
        trimmedSubject ? `Subject: ${trimmedSubject}` : null,
        trimmedPhone ? `Phone: ${trimmedPhone}` : null,
        (trimmedPhone || trimmedSubject) ? '----------------------------------------' : null,
        trimmedMessage
      ].filter(Boolean).join('\n\n');

      // Send via unified email service
      await sendPortfolioEmail({
        name: trimmedName,
        fromName: trimmedName,
        email: trimmedEmail,
        phone: trimmedPhone,
        subject: trimmedSubject || 'New Contact Enquiry',
        message: formattedMessage
      });

      // Success
      setStatus('success');
      setStatusMessage("Message sent successfully! I'll get back to you soon.");
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      setErrors({});

      // Auto-close after brief delay to let user see confirmation
      closeTimerRef.current = setTimeout(() => {
        onClose();
        setStatus('idle');
        setStatusMessage('');
      }, 2400);

    } catch (err) {
      console.error('[EmailJS Send Failure]:', err?.text || err?.message || err);
      setStatus('error');
      if (err?.message === 'TIMEOUT_ERROR') {
        setStatusMessage('Request timed out. Please check your connection and try again.');
      } else {
        setStatusMessage('Unable to send your message right now. Please try again.');
      }
      // Form inputs are preserved
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`contact-modal-backdrop ${isEmbedded ? 'is-embedded' : ''}`}
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className={`contact-modal-dialog ${isEmbedded ? 'is-embedded' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title"
      >
        {/* Header Close Button */}
        <button
          type="button"
          className="contact-modal-close"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={19} />
        </button>

        {/* Modal Header */}
        <div className="contact-modal-header">
          <div className="contact-modal-badge">
            <MessageSquare size={14} className="badge-icon" />
            <span>Get in Touch</span>
          </div>
          <h2 id="contact-modal-title" className="contact-modal-title">
            Send an Enquiry
          </h2>
          <p className="contact-modal-subtitle">
            Have a project, opportunity, or question? Send a message and I'll respond directly to your inbox.
          </p>
        </div>

        {/* Modal Body / Form */}
        <form className="contact-modal-form" onSubmit={handleSubmit} noValidate>
          <div className="contact-modal-grid">
            {/* Full Name (required) */}
            <div className="cm-field cm-field-name">
              <label htmlFor="cm-name" className="cm-label">
                Full Name <span className="cm-req">*</span>
              </label>
              <input
                id="cm-name"
                ref={nameInputRef}
                name="name"
                type="text"
                placeholder="e.g. John Doe"
                className={`cm-input ${errors.name ? 'has-error' : ''}`}
                value={formData.name}
                onChange={handleChange}
                disabled={isSubmitting}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? 'cm-name-error' : undefined}
              />
              {errors.name && (
                <span id="cm-name-error" className="cm-error" role="alert">
                  <AlertCircle size={13} />
                  {errors.name}
                </span>
              )}
            </div>

            {/* Email Address (required) */}
            <div className="cm-field cm-field-email">
              <label htmlFor="cm-email" className="cm-label">
                Email Address <span className="cm-req">*</span>
              </label>
              <input
                id="cm-email"
                name="email"
                type="email"
                placeholder="e.g. john@example.com"
                className={`cm-input ${errors.email ? 'has-error' : ''}`}
                value={formData.email}
                onChange={handleChange}
                disabled={isSubmitting}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'cm-email-error' : undefined}
              />
              {errors.email && (
                <span id="cm-email-error" className="cm-error" role="alert">
                  <AlertCircle size={13} />
                  {errors.email}
                </span>
              )}
            </div>

            {/* Phone Number (optional) */}
            <div className="cm-field cm-field-phone">
              <label htmlFor="cm-phone" className="cm-label">
                Phone Number <span className="cm-opt">(optional)</span>
              </label>
              <input
                id="cm-phone"
                name="phone"
                type="tel"
                placeholder="e.g. +91 98765 43210"
                className={`cm-input ${errors.phone ? 'has-error' : ''}`}
                value={formData.phone}
                onChange={handleChange}
                disabled={isSubmitting}
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={errors.phone ? 'cm-phone-error' : undefined}
              />
              {errors.phone && (
                <span id="cm-phone-error" className="cm-error" role="alert">
                  <AlertCircle size={13} />
                  {errors.phone}
                </span>
              )}
            </div>

            {/* Subject (optional) */}
            <div className="cm-field cm-field-subject">
              <label htmlFor="cm-subject" className="cm-label">
                Subject <span className="cm-opt">(optional)</span>
              </label>
              <input
                id="cm-subject"
                name="subject"
                type="text"
                placeholder="e.g. Project Consultation / Opportunity"
                className="cm-input"
                value={formData.subject}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>

            {/* Message (required) */}
            <div className="cm-field cm-field-message">
              <label htmlFor="cm-message" className="cm-label">
                Message <span className="cm-req">*</span>
              </label>
              <textarea
                id="cm-message"
                name="message"
                rows="4"
                placeholder="Tell me about your requirements or enquiry..."
                className={`cm-textarea ${errors.message ? 'has-error' : ''}`}
                value={formData.message}
                onChange={handleChange}
                disabled={isSubmitting}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? 'cm-message-error' : undefined}
              />
              {errors.message && (
                <span id="cm-message-error" className="cm-error" role="alert">
                  <AlertCircle size={13} />
                  {errors.message}
                </span>
              )}
            </div>
          </div>

          {/* Status Alerts */}
          {status === 'success' && (
            <div className="cm-alert success" role="alert">
              <CheckCircle2 size={18} className="cm-alert-icon" />
              <span>{statusMessage}</span>
            </div>
          )}

          {status === 'error' && (
            <div className="cm-alert error" role="alert">
              <AlertCircle size={18} className="cm-alert-icon" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Modal Actions */}
          <div className="contact-modal-actions">
            <button
              type="button"
              className="cm-btn cm-btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Close
            </button>

            <button
              type="submit"
              className="cm-btn cm-btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="cm-btn-spinner" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <span>Send Message</span>
                  <Send size={15} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

