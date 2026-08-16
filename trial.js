(() => {
  const config = window.SOURCEPILOT_CONFIG || {};
  const form = document.querySelector('[data-trial-form]');
  const status = document.querySelector('[data-status]');
  const result = document.querySelector('[data-result]');
  const emailConfirmation = document.querySelector('[data-email-confirmation]');
  const submit = document.querySelector('[data-submit]');

  function setStatus(message, type = '') {
    status.textContent = message;
    status.className = `inline-status ${type}`.trim();
  }

  function maskEmail(value) {
    const email = String(value || '').trim();
    const at = email.lastIndexOf('@');
    if (at <= 0) return 'your email address';
    const local = email.slice(0, at);
    const domain = email.slice(at + 1);
    const visibleCount = Math.min(2, local.length);
    const visible = local.slice(0, visibleCount);
    const hiddenCount = Math.max(3, Math.min(8, local.length - visibleCount));
    return `${visible}${'•'.repeat(hiddenCount)}@${domain}`;
  }

  async function readResponse(response) {
    const text = await response.text();
    if (!text) return {};
    try {
      return JSON.parse(text);
    } catch {
      throw new Error('The trial server returned an invalid response. Please try again.');
    }
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.whatsappConsent.checked) {
      setStatus('Please accept the communication consent to start the trial.', 'error');
      return;
    }

    const apiBaseUrl = String(config.apiBaseUrl || '').replace(/\/$/, '');
    if (!apiBaseUrl) {
      setStatus('The BuyerPilot trial service is not configured.', 'error');
      return;
    }

    const turnstileToken = form.querySelector('[name="cf-turnstile-response"]')?.value || '';
    if (!turnstileToken) {
      setStatus('Complete the security verification before starting the trial.', 'error');
      return;
    }

    const enteredEmail = form.email.value.trim();
    submit.disabled = true;
    setStatus('Starting your trial…');

    try {
      /*
       * A string request body uses the CORS-safelisted text/plain content type.
       * This avoids an unnecessary browser preflight while the Worker still
       * parses the JSON text normally.
       */
      const response = await fetch(`${apiBaseUrl}/trial/start`, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-store',
        body: JSON.stringify({
          email: enteredEmail,
          phone_number: form.phone.value.trim(),
          whatsapp_consent: form.whatsappConsent.checked,
          turnstile_token: turnstileToken
        })
      });

      const data = await readResponse(response);
      if (!response.ok) throw new Error(data.error || 'Could not start trial.');
      if (data.email_sent !== true) {
        throw new Error('Your trial was created, but the licence email could not be confirmed. Please contact BuyerPilot support.');
      }

      const maskedEmail = maskEmail(enteredEmail);
      emailConfirmation.textContent = `We sent your BuyerPilot trial licence key to ${maskedEmail}.`;
      result.classList.remove('hidden');

      const expiry = data.expires_at ? new Date(data.expires_at).toLocaleString() : '';
      setStatus(
        expiry
          ? `Trial active until ${expiry}. Check your email for the licence key.`
          : 'Trial created successfully. Check your email for the licence key.',
        'success'
      );

      submit.disabled = true;
      submit.textContent = 'Trial email sent';
    } catch (error) {
      const message = error instanceof TypeError && /fetch/i.test(error.message)
        ? 'Could not reach the BuyerPilot trial server. Refresh this page and try again.'
        : error.message;
      setStatus(message || 'Could not start trial.', 'error');
      if (window.turnstile) window.turnstile.reset();
      submit.disabled = false;
    }
  });
})();
