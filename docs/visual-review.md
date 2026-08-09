# Visual review

This document supports temporary review of pull request #1. The preview is not
the production website and must not use `namakcuisine.com`.

## Vercel project settings

- Git repository: `prashantdbu-afk/namak-cuisine-web`
- Framework preset: Next.js
- Root directory: repository root
- Install command: `pnpm install --frozen-lockfile`
- Build command: `pnpm build`
- Output directory: leave blank (Next.js default)
- Node.js version: 24.x, matching `package.json`
- Production branch: `main`
- Preview branch for this review: `codex/phase-1-foundation`
- Preview deployments: enabled for pull requests and non-production branches
- Custom domains: none for the preview
- Environment variables: none required; do not add production secrets

Vercel supplies `VERCEL_ENV=preview` automatically. The application uses that
value to emit `noindex, nofollow`, an `X-Robots-Tag` response header, and a
robots rule that disallows crawling. Canonical URLs continue to point to
`https://namakcuisine.com`.

## Screenshot artifact

The Quality workflow captures all public review routes at 1440 × 1000, 1280 ×
800, 390 × 844, and 430 × 932. It also captures homepage sections and menu
search states. GitHub retains the `namak-visual-review-1` workflow artifact for
14 days; generated PNGs remain excluded from source control.

## Current visual limitations

- The header and footer use a generated text-and-monogram wordmark because the
  final restaurant logo files have not been supplied.
- Homepage atmosphere, dish, bar, gallery, and map treatments are CSS artwork.
- The hero uses a local poster illustration; the optional hero video is off.
- The media manifest includes local fallback and test-only artwork, not approved
  restaurant photography.
- Menu items intentionally appear without image frames because no attributable,
  approved dish photography is available.
- Open Graph and Twitter previews use temporary generated artwork.

Final logo files, licensed restaurant and dish photography, and an optional
approved hero video remain restaurant-supplied inputs for a later phase.
