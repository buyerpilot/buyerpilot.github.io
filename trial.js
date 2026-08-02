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

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.whatsappConsent.checked) {
      setStatus('Please accept the WhatsApp communication consent to start the trial.', 'error');
      return;
    }
    submit.disabled = true;
    setStatus('Starting your trial…');
    try {
      const response = await fetch(`${config.apiBaseUrl.replace(/\/$/, '')}/trial/start`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          email: form.email.value.trim(),
          phone_number: form.phone.value.trim(),
          whatsapp_consent: form.whatsappConsent.checked
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not start trial.');
      keyNode.textContent = data.license_key;
      result.classList.remove('hidden');
      setStatus(`Trial active until ${new Date(data.expires_at).toLocaleString()}.`, 'success');
    } catch (error) {
      setStatus(error.message, 'error');
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
