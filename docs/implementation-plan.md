# Phase 1 implementation plan

## Architecture

- Next.js 16 App Router with strict TypeScript, React Server Components by default, and isolated client islands for navigation, hours status, map consent, and validated form UI.
- Typed verified configuration in `src/config`, editable copy in `src/content`, provider-neutral reservation/ordering helpers in `src/lib`, and reusable site/home components.
- Routes: home, menu, bar, about, private dining, gallery, visit, contact, privacy, accessibility, plus robots, sitemap, and not-found.

## Experience and accessibility

“Aroma in Motion” uses obsidian, ivory, copper, pomegranate, peacock, and brass tokens, editorial typography, generous spacing, CSS-only media placeholders, visible focus, semantic landmarks, a skip link, 44px targets, reduced-motion support, and a mobile action bar.

## Content, forms, and integrations

Business truth is centralized. Draft dishes and stories are explicitly owner-review content internally and avoid unsupported factual claims. Ordering is hidden while its URL is unset. Reservations currently resolve to phone. Forms validate locally but remain visibly disabled until a provider is configured; submissions are never discarded.

## SEO and performance

Each route has unique canonical metadata. Restaurant JSON-LD contains verified facts only. Robots, sitemap, crawlable HTML menu, and social metadata are included. No third-party images, map scripts, analytics, or web fonts load in Phase 1.

## Tests and delivery

Vitest covers Dallas hours (including midnight and overrides), integration switches, form validation, and navigation data. Playwright covers home, menu, visit, primary CTAs, and mobile navigation. GitHub Actions runs frozen install, lint, typecheck, unit tests, and production build on pull requests and `main`. Vercel is expected to import the Git repository and deploy previews from branches.

## Owner inputs

Approved logo, menu and prices, original photography, story/chef biography, bar content, private dining details, parking/accessibility facts, form provider, ordering URL, reservation provider decision, approved testimonials, and optional geographic coordinates.
