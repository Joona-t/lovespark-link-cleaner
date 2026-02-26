# LoveSpark Link Cleaner — Chrome Web Store Submission

---

## Store Listing Tab

**Name:** LoveSpark Link Cleaner
**Category:** Privacy & Security

### Short Description (132 chars max)

Strips tracking parameters from URLs automatically. Clean links, no data collection, no tracking.

### Detailed Description

Every link you click is loaded with hidden tracking parameters — fbclid, gclid, utm_source, and dozens more. These let companies follow you across the internet, track which emails you opened, and build a profile of your browsing habits.

LoveSpark Link Cleaner removes them automatically.

HOW IT WORKS

When you click a link or visit a page, tracking parameters are stripped before the request reaches the server. Your URL bar stays clean, your browsing history stays clean, and your copied links stay clean.

Two layers of protection:
1. Network-level: Tracking parameters are removed from requests before they leave your browser — the server never sees your tracking ID.
2. URL bar + links: Your address bar and all links on the page are cleaned so your history, bookmarks, and copied links are tracker-free.

WHAT IT STRIPS (90+ parameters)

Google Analytics & Ads — utm_source, utm_medium, utm_campaign, utm_term, utm_content, gclid, gclsrc, dclid, gbraid, wbraid, and more
Facebook / Meta — fbclid, fb_action_ids, fb_action_types, fb_source, fb_ref
Microsoft / Bing — msclkid
Twitter / X — twclid
LinkedIn — li_fat_id
Instagram — igshid
TikTok — tt_medium, tt_content
Pinterest — pin_unauth
HubSpot — _hsenc, _hsmi, __hssc, __hstc, __hsfp, hubspotutk
Mailchimp — mc_eid, mc_cid
Marketo — mkt_tok
Klaviyo — _ke, _kx
MailerLite — ml_subscriber, ml_subscriber_hash
Brevo (SendinBlue) — sb_referer_host
Drip — __s
Yandex — yclid, ymclid
Adobe — s_cid, s_kwcid
Impact Radius — irclickid, irgwc
CJ Affiliate — cjevent, cjdata
Matomo/Piwik — pk_campaign, pk_kwd, pk_source, pk_medium, pk_content
...and 40+ more tracking parameters from other analytics and affiliate platforms.

WHAT IT DOESN'T DO

- Does not block ads or content
- Does not break any websites
- Does not collect your data
- Does not modify page content (only cleans link URLs)
- Does not require any special permissions beyond what's needed to clean URLs

PRIVACY

- Zero data collection — we don't collect, transmit, or store any user data
- No accounts, no API keys, no tracking
- No analytics or telemetry
- All processing happens 100% locally in your browser
- Open source under MIT license

Part of the LoveSpark Suite — free, open-source tools that respect your attention and privacy.

---

## Single Purpose Description

(Chrome Web Store requires a single-purpose justification)

This extension has a single purpose: removing tracking parameters from URLs. It strips known tracking query parameters (such as utm_source, fbclid, gclid, and 90+ others) from web requests and page URLs to protect user privacy. It does not block content, modify page appearance, or perform any function beyond URL parameter cleaning.

---

## Privacy Practices Tab

### Single Purpose

This extension removes tracking parameters from URLs to protect user privacy.

### Permission Justifications

**declarativeNetRequest**
Used to create URL redirect rules that strip tracking query parameters (utm_source, fbclid, gclid, etc.) from web requests before they reach the server. This is the core functionality of the extension. The rules only remove query parameters — they do not block, modify, or redirect requests to different URLs.

**storage**
Used to store the user's preferences (enabled/disabled toggle) and a local counter of how many tracking parameters have been stripped. All data is stored locally using chrome.storage.local. No data is transmitted externally.

**Host permissions: <all_urls>**
Required by the declarativeNetRequest API to apply URL-cleaning redirect rules across all websites. Tracking parameters appear on URLs from any domain, so the extension must operate on all URLs to be effective. The extension only modifies URL query parameters — it does not read, collect, or transmit any page content or browsing data.

**Content scripts: <all_urls>**
A content script runs on all pages to clean the browser URL bar (using history.replaceState) and to clean tracking parameters from link elements on the page. This ensures that your browsing history, bookmarks, and copied links are free of tracking parameters. The content script does not read or collect any page content, form data, or personal information.

### Data Usage Disclosures

Check "No" for all of the following:
- Does your extension collect personally identifiable information? **No**
- Does your extension collect health information? **No**
- Does your extension collect financial and payment information? **No**
- Does your extension collect authentication information? **No**
- Does your extension collect personal communications? **No**
- Does your extension collect location data? **No**
- Does your extension collect web history? **No**
- Does your extension collect user activity? **No**
- Does your extension collect website content? **No**

### Data Usage Certification

Certify all of the following:
- I do not sell user data to third parties ✓
- I do not use or transfer user data for purposes unrelated to the extension's core functionality ✓
- I do not use or transfer user data to determine creditworthiness or for lending purposes ✓

### Remote Code

Does this extension execute remote code? **No**
All code is bundled locally within the extension package. No external scripts, APIs, or remote resources are loaded at runtime.

### Privacy Policy URL

https://github.com/Joona-t/lovespark-link-cleaner/blob/main/README.md
