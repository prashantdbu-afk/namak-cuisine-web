# Google Search Console setup

## Recommended verification

1. Add `namakcuisine.com` as a **Domain property** in Google Search Console.
2. Copy Google’s TXT verification value.
3. Add the TXT record at the authoritative DNS provider for `namakcuisine.com`.
4. Keep the TXT record in DNS after verification; removing it can break ownership checks.
5. Optionally set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` in Vercel when Google provides an HTML-tag token. DNS remains the preferred durable method.

## Submit the sitemap

After the production domain is live and publicly crawlable:

1. Open **Indexing → Sitemaps**.
2. Submit `https://namakcuisine.com/sitemap.xml`.
3. Confirm Google reports the sitemap as readable and monitor discovered URLs.

## Request indexing

Use URL Inspection for the homepage, Menu, Bar, Catering, Visit, Gallery, About, and Contact pages. Test the live URL, confirm the canonical is correct, then request indexing. Do not request indexing for Vercel previews, review tools, `/admin/marketing-dashboard`, or `/private-dining`.

## Ongoing checks

- Review indexing, Core Web Vitals, HTTPS, enhancements, and manual actions monthly.
- Reinspect pages after major metadata, URL, schema, or content changes.
- Compare Search Console clicks and impressions with GA4 landing-page activity.
