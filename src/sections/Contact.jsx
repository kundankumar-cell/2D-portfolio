import React, { useState } from 'react';
import ShinyText from '../components/ShinyText';
import { useTheme } from '../hooks/useTheme';
import { 
  Mail, 
  Phone, 
  Send, 
  Copy, 
  Check, 
  CheckCircle2, 
  AlertCircle, 
  Loader2
} from 'lucide-react';
import { personalInfo } from '../data/portfolioData';
import { sendPortfolioEmail } from '../utils/emailService';

export default function Contact({ onOpenContactModal }) {
  const { theme } = useTheme();
  const isDarkMode = theme !== 'light';
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [statusMessage, setStatusMessage] = useState('');
  const [copiedItem, setCopiedItem] = useState(null); // 'email' | 'phone' | null

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear field-level error immediately when user begins correcting
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }

    if (status !== 'idle') {
      setStatus('idle');
      setStatusMessage('');
    }
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(type);
    setTimeout(() => {
      setCopiedItem(null);
    }, 2200);
  };

  const validateForm = () => {
    const newErrors = {};
    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedMessage = formData.message.trim();

    if (!trimmedName) {
      newErrors.name = 'Name cannot be empty.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail) {
      newErrors.email = 'Email cannot be empty.';
    } else if (!emailRegex.test(trimmedEmail)) {
      newErrors.email = 'Please enter a valid email format.';
    }

    if (!trimmedMessage) {
      newErrors.message = 'Message cannot be empty.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent duplicate submissions
    if (isSubmitting) return;

    // Validate inputs
    const isValid = validateForm();
    if (!isValid) return;

    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedMessage = formData.message.trim();

    // Immediately disable submit button and activate loading state
    setIsSubmitting(true);
    setStatus('loading');
    setStatusMessage('');

    try {
      // Execute send request via unified email service
      await sendPortfolioEmail({
        name: trimmedName,
        fromName: trimmedName,
        email: trimmedEmail,
        message: trimmedMessage
      });

      // On successful submission: stop loading immediately, show success message, clear form
      setStatus('success');
      setStatusMessage("Message sent successfully! I'll get back to you soon.");
      setFormData({
        name: '',
        email: '',
        message: ''
      });
      setErrors({});
    } catch (err) {
      // Log diagnostic info without leaking credentials
      console.error('[EmailJS Send Failure]:', err?.text || err?.message || err);
      // On failure or timeout: stop loading immediately, preserve form inputs, show error
      setStatus('error');
      if (err?.message === 'TIMEOUT_ERROR') {
        setStatusMessage('Request timed out. Please check your connection and try again.');
      } else {
        setStatusMessage('Unable to send your message right now. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="contact-section">
      <div className="contact-heading-wrap">
        <h2>
          <ShinyText
            text="Let's Start a Conversation"
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
          Have an opportunity, project idea, or just want to connect? I'd love to hear from you.
        </p>
      </div>

      <div className="contact-grid">
        {/* LEFT COLUMN: Contact Form Card */}
        <div className="contact-form-card">
          <div className="contact-card-top">
            <h3>Send a Message</h3>
            <p className="contact-form-intro">
              Fill out the form below and I'll get back to you within one business day.
            </p>
          </div>

          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            {/* Field 1: Name */}
            <div className="contact-field-group">
              <label htmlFor="contact-name">
                Name
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                disabled={isSubmitting}
                className={errors.name ? 'input-error' : ''}
                aria-invalid={Boolean(errors.name)}
              />
              {errors.name && (
                <span className="field-error" role="alert">
                  <AlertCircle size={13} />
                  {errors.name}
                </span>
              )}
            </div>

            {/* Field 2: Email */}
            <div className="contact-field-group">
              <label htmlFor="contact-email">
                Email
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
                disabled={isSubmitting}
                className={errors.email ? 'input-error' : ''}
                aria-invalid={Boolean(errors.email)}
              />
              {errors.email && (
                <span className="field-error" role="alert">
                  <AlertCircle size={13} />
                  {errors.email}
                </span>
              )}
            </div>

            {/* Field 3: Message */}
            <div className="contact-field-group">
              <label htmlFor="contact-message">
                Message
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows="5"
                placeholder="Write your message here..."
                value={formData.message}
                onChange={handleChange}
                disabled={isSubmitting}
                className={errors.message ? 'input-error' : ''}
                aria-invalid={Boolean(errors.message)}
              />
              {errors.message && (
                <span className="field-error" role="alert">
                  <AlertCircle size={13} />
                  {errors.message}
                </span>
              )}
            </div>

            {/* Overall status alerts */}
            {status === 'success' && (
              <div className="contact-alert success" role="alert">
                <CheckCircle2 size={18} className="alert-icon" />
                <span>{statusMessage}</span>
              </div>
            )}

            {status === 'error' && (
              <div className="contact-alert error" role="alert">
                <AlertCircle size={18} className="alert-icon" />
                <span>{statusMessage}</span>
              </div>
            )}

            <button
              type="submit"
              className="contact-submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={17} className="btn-spinner" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <span>Send Message</span>
                  <Send size={16} className="btn-send-icon" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: Contact Information & Availability */}
        <div className="contact-sidebar">
          {/* Card 1: Contact Information */}
          <div className="contact-info-card">
            <div className="info-card-header">
              <h3>Contact Information</h3>
              <p className="info-card-desc">
                Feel free to reach out directly through email or phone.
              </p>
            </div>

            <div className="contact-items-list">
              {/* Email item */}
              <div className="contact-item">
                <div className="contact-item-icon-wrap" aria-hidden="true">
                  <Mail size={19} />
                </div>
                <div className="contact-item-content">
                  <span className="contact-item-label">Email Address</span>
                  <a
                    href={`mailto:${personalInfo.email}`}
                    className="contact-item-link"
                    title={`Send email to ${personalInfo.email}`}
                    onClick={(e) => {
                      if (onOpenContactModal) {
                        e.preventDefault();
                        onOpenContactModal('General Enquiry');
                      }
                    }}
                  >
                    {personalInfo.email}
                  </a>
                </div>
                <button
                  type="button"
                  className={`contact-copy-btn ${copiedItem === 'email' ? 'copied' : ''}`}
                  onClick={() => copyToClipboard(personalInfo.email, 'email')}
                  aria-label="Copy email address"
                  title={copiedItem === 'email' ? 'Copied!' : 'Copy to clipboard'}
                >
                  {copiedItem === 'email' ? (
                    <>
                      <Check size={14} />
                      <span className="copy-label">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span className="copy-label">Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Phone item */}
              <div className="contact-item">
                <div className="contact-item-icon-wrap" aria-hidden="true">
                  <Phone size={19} />
                </div>
                <div className="contact-item-content">
                  <span className="contact-item-label">Phone Number</span>
                  <a
                    href={`tel:${personalInfo.phone.replace(/\s+/g, '')}`}
                    className="contact-item-link"
                    title={`Call ${personalInfo.phone}`}
                    onClick={(e) => {
                      if (onOpenContactModal) {
                        e.preventDefault();
                        onOpenContactModal('Phone / WhatsApp Enquiry');
                      }
                    }}
                  >
                    {personalInfo.phone}
                  </a>
                </div>
                <button
                  type="button"
                  className={`contact-copy-btn ${copiedItem === 'phone' ? 'copied' : ''}`}
                  onClick={() => copyToClipboard(personalInfo.phone, 'phone')}
                  aria-label="Copy phone number"
                  title={copiedItem === 'phone' ? 'Copied!' : 'Copy to clipboard'}
                >
                  {copiedItem === 'phone' ? (
                    <>
                      <Check size={14} />
                      <span className="copy-label">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span className="copy-label">Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Availability */}
          <div className="contact-availability-card">
            <div className="avail-header">
              <span className="avail-pulse-dot" aria-hidden="true" />
              <span className="avail-badge-text">Available Now</span>
            </div>
            <h4 className="avail-title">Available for Opportunities</h4>
            <p className="avail-desc">
              Open to exciting projects, collaborations, and career opportunities. Feel free to get in touch!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
