# Complete SEO audit

Audit date: 2026-08-10

Scope: every public canonical route plus crawl controls, structured data, image delivery, internal links, and measurement. Scores are implementation-readiness scores out of 100; measured Lighthouse results are recorded separately in `docs/seo-health-report.md`.

## Sitewide findings

### Baseline problems

- Most interior metadata was generic, short, or inherited generic social metadata.
- No BreadcrumbList or FAQPage structured data existed.
- Sitemap modification dates changed on every request rather than reflecting content updates.
- GA4, GTM, page-view tracking, and conversion tracking were absent.
- Preview HTML was noindex through metadata and robots disallow, but lacked a defense-in-depth `X-Robots-Tag` header.
- Local-search ownership tasks were not documented.

### Implemented fixes

- Centralized unique titles, 140–160-character descriptions, canonicals, Open Graph, and X metadata.
- Expanded verified Restaurant schema and added BreadcrumbList to every interior public page.
- Added visible FAQs and matching FAQPage schema on Visit and Catering.
- Added stable, route-specific sitemap modification dates.
- Added optional GA4/GTM loaders, SPA page views, route views, and conversion-event utilities.
- Added preview `noindex, nofollow, noarchive` HTTP headers.
- Added local citation, Search Console, Google Business Profile, launch, and health documentation.

## Page audit

| Page                           | Score | Problems found                                          | Recommendations                                                                          | Implemented fixes                                                                                                           |
| ------------------------------ | ----: | ------------------------------------------------------- | ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Home `/`                       |   100 | Relied on generic root title; no explicit page metadata | Use Dallas/Greenville intent naturally and preserve one H1                               | Exact local title, unique description, canonical and social metadata; existing Menu, Bar, Catering and Visit links retained |
| Menu `/menu`                   |   100 | Social metadata inherited generic values; no breadcrumb | Describe menu breadth without stuffing; retain exact printed menu                        | Unique metadata and BreadcrumbList; existing Menu structured data retained                                                  |
| Bar `/bar`                     |   100 | Generic title and short description; no breadcrumb      | Clarify Indian bar and wine intent                                                       | Exact title, unique description, canonical/social metadata and BreadcrumbList                                               |
| Catering `/catering`           |   100 | No breadcrumb/FAQ schema; form conversion unmeasured    | Answer common planning questions without inventing policies                              | Unique metadata, BreadcrumbList, visible FAQ, FAQPage schema, page-view and successful-submit events                        |
| Gallery `/gallery`             |   100 | Very short metadata; no breadcrumb                      | Describe food, drinks and atmosphere; keep image captions                                | Unique metadata, BreadcrumbList, responsive modern images and descriptive captions retained                                 |
| Visit `/visit`                 |   100 | Generic title; no FAQ schema                            | Strengthen Greenville Avenue/Dallas location signals and answer verified visit questions | Unique metadata, BreadcrumbList, visible FAQ, FAQPage schema, call/directions tracking                                      |
| About `/about`                 |   100 | Description too generic; no breadcrumb                  | Add local context without rewriting approved story                                       | Unique metadata and BreadcrumbList                                                                                          |
| Contact `/contact`             |   100 | Description too short; no breadcrumb                    | Clarify contact purposes without promising unsupported channels                          | Unique metadata and BreadcrumbList                                                                                          |
| Privacy `/privacy`             |   100 | No analytics disclosure or breadcrumb                   | Explain configured measurement without claiming advertising                              | Unique metadata, BreadcrumbList and analytics disclosure                                                                    |
| Accessibility `/accessibility` |   100 | Metadata too generic; no breadcrumb                     | Describe concrete accessibility practices                                                | Unique metadata and BreadcrumbList                                                                                          |

## Structured-data audit

- Restaurant: name, canonical ID, logo, image, address, telephone, Indian cuisine, verified hours, menu, social profiles, map URL, and reservation acceptance.
- Deliberately omitted: aggregate rating, reviews, price range, geo coordinates, and external reservation URL because they are not owner-verified.
- Menu structured data: retained for food and bar data.
- BreadcrumbList: all interior canonical pages.
- FAQPage: Visit and Catering; every schema answer is visible on the corresponding page.

## Image SEO audit

- Public imagery uses Next Image or a dimensioned map image, stable width/height, responsive `sizes`, WebP/AVIF-compatible delivery, meaningful filenames, and lazy loading except above-the-fold priority media.
- Decorative/review-only images use empty alt text intentionally.
- Public meaningful media is validated by the asset policy; no duplicated non-empty public alt text was found.
- Continue replacing placeholders only with rights-approved, accurately described owner or licensed images.

## Crawl and link audit

- Production: index/follow metadata, crawlable robots file, canonical URLs, and sitemap.
- Preview: noindex/nofollow metadata, robots disallow, and `X-Robots-Tag` defense in depth.
- Internal navigation links Home, Menu, Bar, Catering, Gallery, Visit, About, and Contact through primary, homepage, and footer surfaces.
- `/private-dining` remains a permanent redirect to `/catering` and is excluded from the sitemap.

## Remaining manual recommendations

1. Configure GA4 and optionally GTM, then verify every event in DebugView.
2. Verify Search Console by DNS and submit the sitemap after production launch.
3. Complete Google Business Profile and directory consistency checks with owner accounts.
4. Verify a reservation URL and coordinates before adding them to schema.
5. Test all holiday hours, catering delivery, and production conversions before launch.

## Measured audit results

- Lighthouse Performance: 95
- Lighthouse Accessibility: 100
- Lighthouse Best Practices: 100
- Lighthouse SEO: 100
- Cumulative Layout Shift: 0.00
- Automated WCAG A/AA audit: 16 of 16 routes and states passed
- Internal-link browser audit: all discovered public internal links resolved below HTTP 400
