import emailjs from '@emailjs/browser';
import { personalInfo } from '../data/portfolioData';

/**
 * Retrieves and validates EmailJS configuration from Vite environment variables.
 * In Vite, import.meta.env variables are statically replaced at build time.
 */
export const getEmailConfig = () => {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID?.trim() || '';
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID?.trim() || '';
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY?.trim() || '';

  const isValid = Boolean(
    serviceId &&
    templateId &&
    publicKey &&
    !serviceId.includes('your_') &&
    !templateId.includes('your_') &&
    !publicKey.includes('your_')
  );

  return { serviceId, templateId, publicKey, isValid };
};

/**
 * Promise wrapper with strict timeout protection (default 15s).
 */
export const withTimeout = (promise, ms = 15000) => {
  let timer;
  const timeoutPromise = new Promise((_, reject) => {
    timer = setTimeout(() => {
      reject(new Error('REQUEST_TIMEOUT: The email service request timed out.'));
    }, ms);
  });

  return Promise.race([
    promise.finally(() => clearTimeout(timer)),
    timeoutPromise
  ]);
};

/**
 * Centralized email sending function for all portfolio forms:
 * - Contact section form
 * - ContactModal
 * - HireModal
 *
 * Ensures consistent template variables, timeout handling, and diagnostic logging.
 */
export const sendPortfolioEmail = async ({
  name = '',
  fromName = '',
  email = '',
  phone = '',
  subject = '',
  message = ''
}) => {
  const config = getEmailConfig();

  if (!config.isValid) {
    const missingKeys = [
      !config.serviceId && 'VITE_EMAILJS_SERVICE_ID',
      !config.templateId && 'VITE_EMAILJS_TEMPLATE_ID',
      !config.publicKey && 'VITE_EMAILJS_PUBLIC_KEY'
    ].filter(Boolean);

    console.error(
      '[EmailJS Configuration Error]: Missing or incomplete environment variables:\n' +
      (missingKeys.length > 0 ? missingKeys.join(', ') : 'Placeholder credentials detected') + '\n\n' +
      'For Vercel Production:\n' +
      '1. Go to Vercel Dashboard -> Project Settings -> Environment Variables.\n' +
      '2. Add VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, and VITE_EMAILJS_PUBLIC_KEY.\n' +
      '3. Redeploy the project so Vite can embed the variables during build.'
    );

    const error = new Error('CONFIG_MISSING');
    error.missingKeys = missingKeys;
    throw error;
  }

  const senderName = (fromName || name || '').trim();
  const senderEmail = (email || '').trim();
  const senderPhone = (phone || '').trim();
  const emailSubject = (subject || '').trim();
  const emailMessage = (message || '').trim();

  // Complete, unified template parameters matching any EmailJS template mapping
  const templateParams = {
    name: senderName,
    from_name: senderName,
    email: senderEmail,
    reply_to: senderEmail,
    phone: senderPhone || 'Not provided',
    subject: emailSubject || 'New Portfolio Contact Message',
    message: emailMessage,
    to_name: 'Kundan Kumar',
    recipient_email: personalInfo.email || 'kundanpatel25052003@gmail.com',
    submission_time: new Date().toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    })
  };

  try {
    const response = await withTimeout(
      emailjs.send(
        config.serviceId,
        config.templateId,
        templateParams,
        { publicKey: config.publicKey }
      ),
      15000
    );

    return response;
  } catch (err) {
    const status = err?.status;
    const text = err?.text || err?.message || String(err);
    const isTimeout = text.includes('REQUEST_TIMEOUT');

    // Diagnostic console logging for debugging without exposing raw credentials
    console.error('[EmailJS Send Failure]:', {
      status: status || 'N/A',
      message: text,
      isTimeout
    });

    if (isTimeout) {
      throw new Error('TIMEOUT_ERROR');
    }

    if (status === 403 || (typeof text === 'string' && text.toLowerCase().includes('origin'))) {
      console.warn(
        '[EmailJS Security Alert]: Request rejected with status 403 (Origin Forbidden).\n' +
        'Please check EmailJS Dashboard -> Account -> Security -> Allowed Origins and verify your domain is allowed.'
      );
      throw new Error('ORIGIN_FORBIDDEN');
    }

    throw err;
  }
};
