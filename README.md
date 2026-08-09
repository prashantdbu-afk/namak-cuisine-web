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

Media records live in `src/media/manifest.json` and are resolved through provider adapters in `src/media`. Components never construct provider URLs. Cloudinary's public cloud name may be configured with `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`; upload credentials and API secrets must remain server-only and must never be committed or exposed as `NEXT_PUBLIC_*` values.

Recommended production targets are approximately 180 KB or less for the mobile hero poster, 300 KB or less for the desktop poster, 3 MB or less for the mobile decorative loop, and 6 MB or less for the desktop loop. The repository gate is intentionally stricter for committed files: no raster image above 1 MB and no video above 5 MB. Production media masters belong in the approved media provider, not GitHub. Video remains outside the initial critical transfer, and each route may have only one priority/LCP image.

## Quality checks

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm format:check
pnpm check:assets
pnpm build
pnpm exec playwright install chromium  # once, for browser tests
pnpm test:e2e
pnpm test:a11y
pnpm test:performance
```

## GitHub and Vercel

Create a focused branch (`git switch -c codex/phase-1-foundation`), push it, and open a pull request. `.github/workflows/quality.yml` validates every PR and pushes to `main`. Import the private repository into Vercel with Next.js auto-detection, `main` as production, and previews enabled. Use repository defaults for install/build commands.

After preview approval, add both domain variants in Vercel and keep `https://namakcuisine.com` canonical. In Hostinger, enter only the exact DNS records Vercel displays. Remove only conflicting website records; preserve MX, SPF, DKIM, and DMARC records.

Rollback by reverting the merged pull request in GitHub or promoting a previously verified Vercel deployment. Never patch production outside source control.
