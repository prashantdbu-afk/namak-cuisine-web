# Menu image audit

Reviewed 2026-08-08. No dish-level image could be confidently attributed from the accessible exact-address source output, and listing presence alone would not establish publication rights.

| Menu item ID | Display name                    | Platform observed                                         | Source page                | Candidate status | Owner original required | Rights confirmation required |
| ------------ | ------------------------------- | --------------------------------------------------------- | -------------------------- | ---------------- | ----------------------- | ---------------------------- |
| None         | No attributable dish candidates | Toast and Uber Eats exposed restaurant-level imagery only | See `menu-source-audit.md` | Not eligible     | Yes                     | Yes                          |

No third-party CDN URL is stored in the menu dataset. When the owner supplies original files or written rights confirmation, approved records must be added through `src/media/manifest.json`, delivered through the provider abstraction, and rendered with `ResponsiveImage`.
