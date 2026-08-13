# Homepage hero media quality

## Final composition

The homepage hero uses one wide venue photograph above two smaller food photographs. This replaces the previous mosaic where a 1000×600 menu image occupied the dominant 55%-viewport slot and inherited the menu-card `sizes` declaration `(max-width: 359px) 100vw, (max-width: 760px) 132px, 210px`.

| Placement     | Selected media               |    Source | Display ratio | Maximum rendered width | Responsive `sizes`                                                                  | Encoding quality |
| ------------- | ---------------------------- | --------: | ------------: | ---------------------: | ----------------------------------------------------------------------------------- | ---------------: |
| Primary venue | `venue-dining-wide-02`       | 1600×1200 |         16:10 |                  860px | `(max-width: 900px) 100vw, (max-width: 1440px) 55vw, 860px`                         |               90 |
| Food support  | `food-buratta-bomb`          |  1000×600 |           5:3 |            about 425px | `(max-width: 600px) 50vw, (max-width: 900px) 50vw, (max-width: 1440px) 27vw, 425px` |               85 |
| Food support  | `food-classic-chicken-tikka` |  1000×600 |           5:3 |            about 425px | `(max-width: 600px) 50vw, (max-width: 900px) 50vw, (max-width: 1440px) 27vw, 425px` |               85 |

The primary venue image is the only hero asset with high fetch priority. The two food supports use normal loading priority. The media panel is capped at 860 CSS pixels, so none of the selected sources is enlarged beyond its recorded source width. At the maximum layout width, the venue source provides about 1.86 source pixels per CSS pixel and each food source provides about 2.35 source pixels per CSS pixel.

## Selection rationale

`venue-dining-wide-02` was selected by visual review from the approved dining-room candidates. Its foreground seating, middle-ground tables, and background bar create natural depth; its balanced lighting and wide perspective tolerate a 16:10 crop without severe loss. It is approved, production-ready, free of unapproved people and sensitive information, and has a reviewed focal point. The immediately following homepage experience section uses `venue-dining-wide-07` to avoid repeating the same photograph.

Buratta Bomb and Classic Chicken Tikka were selected from the existing approved homepage food set. Both retain clear food form and shadow at a roughly 425-pixel tile width, provide complementary color and subject matter, and require no crop beyond their native 5:3 composition.

## Processing and authenticity

No selected asset was upscaled, generatively reconstructed, aggressively sharpened, blurred, given fake steam or bokeh, or processed with HDR-style effects. Existing approved prepared files and reviewed focal points are used unchanged. Visual depth comes from the venue perspective, stable crops, restrained framing, and the layering of restaurant atmosphere with food.

## Original-master policy

Original camera files are preferred for future hero work. The current 1000×600 food files are prepared delivery assets and must not be described as original masters; WhatsApp-, marketplace-, or delivery-platform-compressed files are not masters. If original food camera files become available, replace the supporting derivatives from those originals while preserving the same placement contract. The current files remain suitable only because their rendered width is capped near 425 CSS pixels.
