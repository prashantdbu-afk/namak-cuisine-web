# Phase 1 implementation plan

## Architecture

- Next.js 16 App Router with strict TypeScript, React Server Components by default, and isolated client islands for navigation, hours status, map consent, and validated form UI.
- Typed verified configuration in `src/config`, editable copy in `src/content`, provider-neutral reservation/ordering helpers in `src/lib`, and reusable site/home components.
- Routes: home, menu, bar, about, private dining, gallery, visit, contact, privacy, accessibility, plus robots, sitemap, and not-found.
- A typed media manifest supports local and future Cloudinary delivery behind a resolver boundary. Responsive images preserve dimensions and focal points; poster-first hero video is deferred, controllable, network-aware, and feature flagged.
- Centralized publication states drive navigation and sitemap visibility. Metadata and response headers block indexing outside Vercel production and for any hidden/noindex route.

## Experience and accessibility

“Aroma in Motion” uses obsidian, ivory, copper, pomegranate, peacock, and brass tokens, editorial typography, generous spacing, CSS-only media placeholders, visible focus, semantic landmarks, a skip link, 44px targets, reduced-motion support, and a mobile action bar.

## Content, forms, and integrations

Business truth is centralized. Draft notes remain internal and public pages contain no development language or invented dishes. Ordering is hidden while its URL is unset. Reservations currently resolve to one combined phone action. Contact mode is typed and disabled; editable fields are not rendered until a real delivery adapter exists.

## SEO and performance

Each route has unique canonical metadata. Restaurant JSON-LD contains verified facts only. Robots, sitemap, crawlable HTML menu, and social metadata are included. No third-party images, map scripts, analytics, or web fonts load in Phase 1.

## Tests and delivery

Vitest covers Dallas hours, integration switches, media rules, publication state, disabled forms, and mobile actions. Playwright covers the production build, key routes, mobile navigation, Axe WCAG checks, and unexpected third-party requests. Asset policy and Lighthouse CI add media and performance budgets. GitHub Actions runs every gate on pull requests and `main`.

## Owner inputs

Approved logo, menu and prices, original photography, story/chef biography, bar content, private dining details, parking/accessibility facts, form provider, ordering URL, reservation provider decision, approved testimonials, and optional geographic coordinates.
