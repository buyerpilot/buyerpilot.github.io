(() => {
  const config = window.SOURCEPILOT_CONFIG || {};
  const toast = document.querySelector('[data-toast]');
  let toastTimer;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 4200);
  }

  const checkoutMap = {
    trial: config.trialCheckoutUrl,
    starter: config.starterCheckoutUrl,
    pro: config.proCheckoutUrl,
    lifetime: config.lifetimeCheckoutUrl
  };

  document.querySelectorAll('[data-checkout]').forEach((link) => {
    const plan = link.dataset.checkout;
    const url = checkoutMap[plan];
    if (url) {
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    } else {
      link.href = '#pricing';
      link.addEventListener('click', (event) => {
        event.preventDefault();
        showToast(`${plan.charAt(0).toUpperCase() + plan.slice(1)} checkout is not configured yet. Add the URL in config.js before publishing.`);
        document.querySelector('#pricing')?.scrollIntoView({ behavior: 'smooth' });
      });
    }
  });

  document.querySelectorAll('[data-chrome-store]').forEach((link) => {
    if (config.chromeWebStoreUrl) {
      link.href = config.chromeWebStoreUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    } else {
      link.href = '#pricing';
      link.addEventListener('click', (event) => {
        event.preventDefault();
        showToast('Chrome Web Store URL is not configured yet. Add it in config.js before publishing.');
      });
    }
  });

  document.querySelectorAll('[data-support-email]').forEach((link) => {
    if (config.supportEmail) {
      link.href = `mailto:${config.supportEmail}`;
      link.textContent = config.supportEmail;
    } else {
      link.href = '#';
      link.textContent = 'Support email not configured';
      link.addEventListener('click', (event) => {
        event.preventDefault();
        showToast('Add your support email in config.js before publishing.');
      });
    }
  });

  const menuButton = document.querySelector('[data-menu-button]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');
  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(open));
      document.body.classList.toggle('menu-open', open);
    });
    mobileMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
    }));
  }

  const tabs = [...document.querySelectorAll('[data-demo-tab]')];
  const panels = [...document.querySelectorAll('[data-demo-panel]')];
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.demoTab;
      tabs.forEach((item) => {
        const active = item === tab;
        item.classList.toggle('active', active);
        item.setAttribute('aria-selected', String(active));
      });
      panels.forEach((panel) => panel.classList.toggle('active', panel.dataset.demoPanel === target));
    });
  });

  document.querySelectorAll('[data-current-year]').forEach((node) => {
    node.textContent = new Date().getFullYear();
  });
})();
