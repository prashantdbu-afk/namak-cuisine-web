# Google Maps setup

The Visit experience uses two optional Google Maps services:

- `GOOGLE_MAPS_SERVER_API_KEY`: Maps Static API only. This key is read only by the server-side proxy at `/api/map/static` and is never sent to page components.
- `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY`: Maps Embed API only. The embed is requested only after a visitor deliberately chooses **View Interactive Map**.

Configure both values in Vercel project environment variables. Never commit a real key to GitHub or place one in `.env.example`.

## Restrictions

Create separate keys and restrict each to only its required API. Restrict browser use to:

- `https://namakcuisine.com/*`
- `https://www.namakcuisine.com/*`
- the specific Vercel preview domain only when preview testing is explicitly required

Do not use an unrestricted wildcard for all Vercel domains. Restrict the server key according to the production hosting configuration supported by Google Cloud and Vercel, and monitor its quota.

No Place ID or coordinates are currently owner-verified. The implementation therefore uses the exact centralized address from `src/config/site.ts`. Add a Place ID only after it is independently verified.

## No-key behavior

When neither key is configured, the site renders a compact location card with the complete address, current opening status, published hours, phone number, and verified Google directions link. It does not render a broken image, iframe, or decorative map substitute.
