(() => {
  const params = new URLSearchParams(location.search);
  const key = params.get('license_key') || '';
  const statusParam = params.get('status') || '';
  const keyNode = document.querySelector('[data-license-key]');
  const statusNode = document.querySelector('[data-status]');
  const title = document.querySelector('[data-title]');
  const message = document.querySelector('[data-message]');
  const copyButton = document.querySelector('[data-copy]');

  if (key) {
    keyNode.textContent = key.split(',')[0].trim();
    statusNode.textContent = 'Keep this key safe. Dodo Payments also makes it available in the customer portal.';
    statusNode.classList.add('success');
  } else {
    keyNode.textContent = 'License key is being prepared';
    statusNode.textContent = 'No license key was included in the return URL. Check your Dodo receipt or customer portal, or refresh this page after a minute.';
  }

  if (statusParam && !['succeeded', 'active', 'success'].includes(statusParam.toLowerCase())) {
    title.textContent = 'Payment status received';
    message.textContent = `Dodo Payments returned status: ${statusParam}.`;
  }

  copyButton.addEventListener('click', async () => {
    if (!key) return;
    await navigator.clipboard.writeText(keyNode.textContent);
    copyButton.textContent = 'Copied';
    setTimeout(() => (copyButton.textContent = 'Copy license key'), 1800);
  });
})();
