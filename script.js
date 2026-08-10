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
    trial: config.trialPageUrl || 'trial.html',
    starter: config.starterCheckoutUrl,
    pro: config.proCheckoutUrl,
    lifetime: config.lifetimeCheckoutUrl
  };

  document.querySelectorAll('[data-checkout]').forEach((link) => {
    const plan = link.dataset.checkout;
    const url = checkoutMap[plan];
    if (url) {
      link.href = url;
      if (plan !== 'trial') {
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
      }
    } else {
      link.href = '#pricing';
      link.addEventListener('click', (event) => {
        event.preventDefault();
        showToast(`${plan.charAt(0).toUpperCase() + plan.slice(1)} is not configured yet.`);
        document.querySelector('#pricing')?.scrollIntoView({ behavior: 'smooth' });
      });
    }
  });

  const browserStoreUrls = {
    chrome: config.chromeWebStoreUrl,
    edge: config.edgeAddonsUrl,
    firefox: config.firefoxAddonsUrl
  };

  document.querySelectorAll('[data-browser-store]').forEach((link) => {
    const browser = link.dataset.browserStore;
    const url = browserStoreUrls[browser];
    const statusNode = link.querySelector('[data-store-status]');
    if (url) {
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.classList.remove('store-link-pending');
      if (statusNode) statusNode.textContent = 'Open store listing';
    } else {
      link.href = '#browser-support';
      link.classList.add('store-link-pending');
      if (statusNode) statusNode.textContent = 'Store link coming soon';
      link.addEventListener('click', (event) => {
        event.preventDefault();
        showToast(`${browser.charAt(0).toUpperCase() + browser.slice(1)} store link will be added after publication.`);
        document.querySelector('#browser-support')?.scrollIntoView({ behavior: 'smooth' });
      });
    }
  });

  document.querySelectorAll('[data-chrome-store]').forEach((link) => {
    const url = config.chromeWebStoreUrl;
    if (url) {
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    } else {
      link.href = '#browser-support';
      link.addEventListener('click', (event) => {
        event.preventDefault();
        document.querySelector('#browser-support')?.scrollIntoView({ behavior: 'smooth' });
      });
    }
  });

  const supportEmail = config.supportEmail || 'hellobuyerpilot@gmail.com';
  document.querySelectorAll('[data-support-email]').forEach((link) => {
    link.href = `mailto:${supportEmail}`;
    link.textContent = supportEmail;
  });  const telegramUrl = config.telegramUrl || 'https://t.me/buyerpilot';
  document.querySelectorAll('[data-telegram-link]').forEach((link) => {
    link.href = telegramUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
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
