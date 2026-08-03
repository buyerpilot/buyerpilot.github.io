(() => {
  const config = window.SOURCEPILOT_CONFIG || {};
  const form = document.querySelector('[data-trial-form]');
  const status = document.querySelector('[data-status]');
  const result = document.querySelector('[data-result]');
  const keyNode = document.querySelector('[data-license-key]');
  const copyButton = document.querySelector('[data-copy]');
  const submit = document.querySelector('[data-submit]');

  function setStatus(message, type = '') {
    status.textContent = message;
    status.className = `inline-status ${type}`.trim();
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
      setStatus('Please accept the WhatsApp communication consent to start the trial.', 'error');
      return;
    }

    const apiBaseUrl = String(config.apiBaseUrl || '').replace(/\/$/, '');
    if (!apiBaseUrl) {
      setStatus('The Sourcepilot trial service is not configured.', 'error');
      return;
    }

    const turnstileToken = form.querySelector('[name="cf-turnstile-response"]')?.value || '';
    if (!turnstileToken) {
      setStatus('Complete the security verification before starting the trial.', 'error');
      return;
    }

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
          email: form.email.value.trim(),
          phone_number: form.phone.value.trim(),
          whatsapp_consent: form.whatsappConsent.checked,
          turnstile_token: turnstileToken
        })
      });

      const data = await readResponse(response);
      if (!response.ok) throw new Error(data.error || 'Could not start trial.');

      keyNode.textContent = data.license_key;
      result.classList.remove('hidden');
      setStatus(`Trial active until ${new Date(data.expires_at).toLocaleString()}.`, 'success');
    } catch (error) {
      const message = error instanceof TypeError && /fetch/i.test(error.message)
        ? 'Could not reach the Sourcepilot trial server. Refresh this page and try again.'
        : error.message;
      setStatus(message || 'Could not start trial.', 'error');
      if (window.turnstile) window.turnstile.reset();
    } finally {
      submit.disabled = false;
    }
  });

  copyButton.addEventListener('click', async () => {
    await navigator.clipboard.writeText(keyNode.textContent);
    copyButton.textContent = 'Copied';
    setTimeout(() => (copyButton.textContent = 'Copy license key'), 1800);
  });
})();
