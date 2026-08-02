# Sourcepilot website

A complete static website for GitHub Pages, Cloudflare Pages, Netlify or any basic web host.

## Mandatory changes before publishing

Open `config.js` and set:

- `supportEmail`
- `chromeWebStoreUrl`
- `trialCheckoutUrl`
- `starterCheckoutUrl`
- `proCheckoutUrl` (the existing Lemon Squeezy URL is already inserted)
- `lifetimeCheckoutUrl`
- `siteUrl` if your final domain changes

Also update the canonical URL, Open Graph URLs, `robots.txt` and `sitemap.xml` if the domain changes.

## Legal review required

The Privacy Policy, Terms of Service and Refund Policy are practical launch templates, not jurisdiction-specific legal advice. Before launch:

1. Add your legal business identity and location.
2. Confirm the governing law and dispute forum in `terms.html`.
3. Confirm the seven-day refund policy and configure it in Lemon Squeezy.
4. Verify the privacy language against the final extension, backend, analytics and licensing implementation.
5. Confirm all plan limits and lifetime terms match the checkout products.

## Files

- `index.html` — sales website
- `styles.css` — responsive visual design
- `config.js` — checkout, store and email configuration
- `script.js` — navigation, demo tabs and configured links
- `privacy.html` — privacy policy
- `terms.html` — terms of service
- `refund.html` — refund policy
- `assets/` — product screenshots, favicon and social card

## Publish on GitHub Pages

Use a repository named exactly `sourcepilot-app.github.io` for the root address:

`https://sourcepilot-app.github.io/`

Upload every file and folder from this package to the repository root. In GitHub, open **Settings → Pages**, select **Deploy from a branch**, choose `main` and `/ (root)`.

## Product screenshots

The demo uses actual screenshots supplied during development. Replace them later with clean production screenshots after the Chrome Web Store build and final visual branding are ready.
