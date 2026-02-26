# LoveSpark Link Cleaner

Strips tracking parameters from URLs automatically. Clean links, no trackers.

Part of the [LoveSpark Suite](https://github.com/Joona-t) — free, open-source browser extensions for a calmer internet.

## What It Does

Two-layer protection:

1. **Network level** — declarativeNetRequest rules strip tracking parameters before requests reach the server
2. **URL bar + links** — content script cleans your URL bar and all `<a>` links on the page

## Tracking Parameters Stripped (80+)

- **Google Analytics/Ads:** utm_source, utm_medium, utm_campaign, gclid, dclid, gbraid, wbraid, and more
- **Facebook/Meta:** fbclid, fb_action_ids, fb_source, fb_ref
- **Microsoft/Bing:** msclkid
- **Social:** twclid (Twitter), li_fat_id (LinkedIn), igshid (Instagram), pin_unauth (Pinterest)
- **Email marketing:** Mailchimp, Bronto, Vero, Omnisend, MailerLite, Klaviyo, Brevo
- **Analytics:** HubSpot, Marketo, Drip, Openstat, Yandex, Wicked Reports
- **Affiliate:** Impact Radius, CJ, and generic campaign/partner IDs

## Permissions

Only two permissions requested:

- `declarativeNetRequest` — strip tracking params at the network level
- `storage` — save your stats and preferences locally

## Install

- [Chrome Web Store](#)
- [Firefox Add-ons](#)

## Privacy

- Zero data collection
- No analytics or telemetry
- All processing happens locally
- Open source (MIT)

## License

MIT
