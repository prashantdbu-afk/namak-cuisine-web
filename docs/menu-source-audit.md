# Menu source audit

Reviewed 2026-08-08 for the exact Namak address at 5500 Greenville Ave #600, Dallas, TX 75206. This audit records names and availability signals only. No prices, platform ratings, reviews, popularity labels, fees, delivery claims, descriptions, or media URLs were imported.

## Sources reviewed

| Source                          | Access result                                                                                 |                                        Categories visible |           Item names visible |
| ------------------------------- | --------------------------------------------------------------------------------------------- | --------------------------------------------------------: | ---------------------------: |
| Toast exact-address listing     | Accessible; primary draft source                                                              | 17 source categories, normalized to 16 website categories |                          128 |
| Uber Eats exact-address listing | Accessible in part; category bodies after the first sections were collapsed                   |                                       11 headings visible | 20 unique item names visible |
| Grubhub exact-address listing   | Menu requires client-side JavaScript and was not readable through the available source reader |                                                0 verified |                   0 verified |
| DoorDash exact-address listing  | Fetch returned a cache/access error; no bypass attempted                                      |                                                0 verified |                   0 verified |

The provided Toast deep link contains `solkadhi` in its URL, but Solkadhi did not appear in the visible primary menu. It is not in the dataset. Third-party operating hours were ignored.

## Category reconciliation

Toast exposed Acqua Panna as a one-item category. It is placed under Beverages. Source labels were normalized as follows: `SOUP` to Soups, `EMBERS VEG` to Embers — Vegetarian, `EMBERS NON-VEG` to Embers — Non-Vegetarian, `VEG ENTRESS` to Vegetarian Entrées, `NON-VEG ENTRESS` to Non-Vegetarian Entrées, `BIRYANI AND PULAO` to Biryani & Pulao, `DESSERT` to Desserts, `BEVERAGE` to Beverages, and `LUNCH SPECIAL` to Lunch Specials.

Five categories have at least one item visibly corroborated by Uber Eats and are published: Soups, Amuse-Bouche, Embers — Vegetarian, Vegetarian Entrées, and Non-Vegetarian Entrées. The remaining category records are retained but hidden until another exact-address source or the owner confirms items.

## Publication reconciliation

- 20 high-confidence items appear in Toast and the accessible portion of Uber Eats; these are published.
- 106 active Toast-only items remain in review.
- 2 Toast items marked out of stock remain hidden: `RAJ KACHORI CHAT` and `VEG THALI`.
- 108 items are single-source records in total, including those two hidden out-of-stock items.
- Suspicious unrelated Grubhub examples named in the task were excluded and are not in the Toast-derived dataset.

## Cross-source naming conflicts

- Toast `MURGHA BADAMI SHORBA`; Uber Eats `Murgh Badami Shorba`. Proposed display spelling: Murgha Badami Shorba pending owner preference.
- Toast `JHOL MOMO CHICKEN`; Uber Eats `Jhol Momo Non-Veg`. Proposed display spelling: Jhol Momo Chicken, retaining the primary name.
- Toast `PAPDI CHAT`; Uber Eats `Papdi Chaat`. Proposed display spelling: Papdi Chaat.
- Toast `DAL MAKHANI`; Uber Eats `Dal Makhni`. Proposed display spelling: Dal Makhani.
- Toast and Uber Eats both show the likely misspelling `Buratta Bomb`; proposed display spelling: Burrata Bomb.

## Proposed spelling normalization

The exact source spellings remain in `sourceName`; only `displayName` is normalized.

| Primary source spelling | Proposed display spelling |
| ----------------------- | ------------------------- |
| BURATTA BOMB            | Burrata Bomb              |
| PAPDI CHAT              | Papdi Chaat               |
| BHARWAN PANNER TIKKA    | Bharwan Paneer Tikka      |
| BURRATA CHAT            | Burrata Chaat             |
| TANDOORI PANNER MAKHANI | Tandoori Paneer Makhani   |
| BAIGAN BHARTA           | Baingan Bharta            |
| PANNER TIKKA MASALA     | Paneer Tikka Masala       |
| KADHAI PANNER           | Kadhai Paneer             |
| SAAG PANNER             | Saag Paneer               |
| MATAR PANNER            | Matar Paneer              |
| FISH MOLIEE             | Fish Moilee               |
| KADAI SHMRIP            | Kadai Shrimp              |
| LUCKNOWNI GOAT BIRYANI  | Lucknowi Goat Biryani     |
| MASALA PAPD             | Masala Papad              |
| BURANI RATIA            | Burani Raita              |
| BREADBASKET             | Bread Basket              |
| THUMSUP                 | Thums Up                  |
| WATER`                  | Water                     |
| NON- VEG THALI          | Non-Veg Thali             |

## Images

Toast and Uber Eats exposed restaurant-level imagery, but the accessible source output did not establish a reliable dish-to-image mapping or independent publication rights. Zero dish image candidates were added. No image was downloaded, copied, hotlinked, or placed in application data.

## Owner confirmation required

- Approve all proposed spelling normalizations and resolve the cross-source naming conflicts.
- Confirm which of the 106 active Toast-only items should be published.
- Confirm whether the two out-of-stock items are returning.
- Confirm final category names and placement, especially Amuse-Bouche, vegetarian/non-vegetarian divisions, beverages, and lunch specials.
- Supply the current menu directly so source activity can be reconciled beyond third-party snapshots.
- Supply original dish photography and written confirmation of publication rights before any menu image is enabled.
