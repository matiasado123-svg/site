// contact.js — veilige en robuuste contactformulier-handler
(function () {
  'use strict';

  // Helper: veilige query by id
  const $ = (id) => document.getElementById(id);

  const form = $('contactForm');
  const msgSuccess = $('msg-success');
  const messageError = $('messageError');
  const honeypot = $('website'); // hidden field voor bots
  const submitBtnSelector = 'button[type="submit"]';

  // If form doesn't exist, nothing to do (prevents "cannot read properties of null")
  if (!form) return;

  // Optional: function to announce to screen readers (uses existing announceToScreenReader if present)
  function announce(message, priority = 'polite') {
    if (typeof announceToScreenReader === 'function') {
      try { announceToScreenReader(message, priority); return; } catch (e) { /* continue to fallback */ }
    }

    // Fallback simple SR announcement
    const live = document.createElement('div');
    live.setAttribute('role', 'status');
    live.setAttribute('aria-live', priority);
    live.className = 'sr-only-temp';
    live.style.position = 'absolute';
    live.style.width = '1px';
    live.style.height = '1px';
    live.style.overflow = 'hidden';
    live.style.clip = 'rect(0 0 0 0)';
    live.textContent = message;
    document.body.appendChild(live);
    setTimeout(() => document.body.removeChild(live), 1200);
  }

  // Email regex (basic)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Async submit handler (so you can switch to fetch easily)
  form.addEventListener('submit', async function (evt) {
    evt.preventDefault();

    try {
      // Honeypot: silent fail for bots
      if (honeypot && honeypot.value.trim() !== '') {
        return;
      }

      // Safely grab fields by name (works even if some are missing)
      const nameField = form.querySelector('[name="name"]');
      const emailField = form.querySelector('[name="email"]');
      const messageField = form.querySelector('[name="message"]');
      const consentField = form.querySelector('[name="consent"]');

      const name = (nameField && nameField.value) ? nameField.value.trim() : '';
      const email = (emailField && emailField.value) ? emailField.value.trim() : '';
      const message = (messageField && messageField.value) ? messageField.value.trim() : '';
      const consent = !!(consentField && consentField.checked);

      // Clear previous inline message safely
      if (messageError) messageError.textContent = '';

      // Validation
      const errors = [];
      if (!name) errors.push('Vul uw naam in.');
      if (!email || !emailRegex.test(email)) errors.push('Vul een geldig e-mailadres in.');
      if (!message || message.length < 10) errors.push('Voeg een kort bericht toe (minimaal 10 tekens).');
      if (!consent) errors.push('U moet toestemming geven om contact op te nemen.');

      if (errors.length) {
        // aggregated alert + inline hint
        alert('Er ontbreken gegevens:\n– ' + errors.join('\n– '));
        if (messageError && (!message || message.length < 10)) {
          messageError.textContent = 'Uw bericht is te kort (min. 10 tekens).';
          messageError.setAttribute('role', 'alert');
        }
        announce('Formulier bevat fouten. Controleer de gemarkeerde velden.', 'assertive');
        return;
      }

      // Prepare UI for sending
      const submitButton = form.querySelector(submitBtnSelector);
      if (submitButton) {
        submitButton.disabled = true;
        // preserve original text for restoration
        const originalText = submitButton.getAttribute('data-original-text') || submitButton.textContent;
        submitButton.setAttribute('data-original-text', originalText);
        submitButton.textContent = 'Versturen…';
      }

      // ---- Option: real fetch submit (uncomment & configure) ----
      // Example for Formspree:
      // const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
      //   method: 'POST',
      //   body: new FormData(form),
      //   headers: { 'Accept': 'application/json' }
      // });
      // if (!response.ok) throw new Error('Form submission failed');

      // For now: simulate network latency (mock submit)
      await new Promise((resolve) => setTimeout(resolve, 900));

      // On success: reset and show success message (if present)
      form.reset();
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = submitButton.getAttribute('data-original-text') || 'Verstuur bericht';
      }
      if (msgSuccess) {
        msgSuccess.style.display = 'block';
        msgSuccess.setAttribute('role', 'status');
        msgSuccess.setAttribute('aria-live', 'polite');
        msgSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
        announce('Formulier succesvol verzonden', 'assertive');

        // auto-hide after delay
        setTimeout(() => {
          try { msgSuccess.style.display = 'none'; } catch (e) { /* ignore */ }
        }, 7000);
      } else {
        // If no success element, still notify screen reader and via alert
        announce('Formulier succesvol verzonden', 'polite');
        alert('Formulier succesvol verzonden.');
      }

    } catch (err) {
      // Restore submit button and inform user
      const submitButton = form.querySelector(submitBtnSelector);
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = submitButton.getAttribute('data-original-text') || 'Verstuur bericht';
      }
      console.error('Contact form error:', err);
      announce('Er is een fout opgetreden bij het verzenden van het formulier.', 'assertive');
      alert('Er is een fout opgetreden. Probeer het later opnieuw.');
    }
  });

  // Accessibility: remove aria-invalid when user edits a field
  form.addEventListener('input', function (e) {
    const target = e.target;
    if (target && target.hasAttribute && target.hasAttribute('aria-invalid')) {
      target.setAttribute('aria-invalid', 'false');
    }
  });

})();
