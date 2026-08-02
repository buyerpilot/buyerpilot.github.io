# Sourcepilot website

Upload all files in this directory to the root of the GitHub Pages repository.

Before upload, replace `apiBaseUrl` in `config.js` with the deployed Cloudflare Worker URL.

Dodo checkout mapping is already corrected:

- Starter: `pdt_0NkTQ8TRw54f8tZi0Z8Sq`
- Pro: `pdt_0NkTT6dP7jmSpOUVS5xou`
- Founder Lifetime: `pdt_0NkTTKNzQFFZrWp9jL04a`

New pages:

- `trial.html` — no-card 7-day / 50-session trial signup.
- `success.html` — displays the Dodo-generated `license_key` from the return URL.
- `manage.html` — creates a secure Dodo customer-portal session through the backend.


All three hosted checkout URLs include `redirect_url=https://sourcepilot-app.github.io/success.html`.
The success page will receive `license_key` only after a License Key entitlement is attached to the corresponding Dodo product.
