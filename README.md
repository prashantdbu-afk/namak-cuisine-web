# Namak Cuisine website

Phase 1 for the independent Namak Indian Restaurant & Bar website at [namakcuisine.com](https://namakcuisine.com). Built with Next.js 16 App Router, strict TypeScript, Tailwind CSS 4, and provider-neutral integrations.

## Local development

Prerequisites: Node.js 24 LTS and pnpm 11.16.0.

```bash
pnpm install
pnpm dev
```

Copy `.env.example` to `.env.local` only when configuring local integrations. Never commit real secrets. The public website functions without environment variables; online form submission and ordering remain unavailable until configured.

## Content and media

Verified address, phone, domain, time zone, and social URLs live in `src/config/site.ts`. Provider and feature switches live in `src/config/integrations.ts`. Editable copy and structured menu/gallery content live in `src/content`. Search for `OWNER_REVIEW_REQUIRED` before release.

Phase 1 uses local CSS art instead of unlicensed photography. Replace each placeholder with responsive `next/image` assets in `public/images`, using owner-provided or properly licensed files, accurate alt text, dimensions, and sensible `sizes`. The owner must also approve the menu, prices, story, bar copy, private-dining details, parking/accessibility facts, and any future reviews.

## Quality checks

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm exec playwright install chromium  # once, for browser tests
pnpm test:e2e
```

## GitHub and Vercel

Create a focused branch (`git switch -c codex/phase-1-foundation`), push it, and open a pull request. `.github/workflows/quality.yml` validates every PR and pushes to `main`. Import the private repository into Vercel with Next.js auto-detection, `main` as production, and previews enabled. Use repository defaults for install/build commands.

After preview approval, add both domain variants in Vercel and keep `https://namakcuisine.com` canonical. In Hostinger, enter only the exact DNS records Vercel displays. Remove only conflicting website records; preserve MX, SPF, DKIM, and DMARC records.

Rollback by reverting the merged pull request in GitHub or promoting a previously verified Vercel deployment. Never patch production outside source control.
