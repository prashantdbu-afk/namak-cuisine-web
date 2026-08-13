# WCAG 2.2 Level AA Accessibility Audit

Audit date: August 12, 2026  
Target: WCAG 2.2 Level A and AA  
Scope: `/`, `/menu`, `/bar`, `/about`, `/catering`, `/gallery`, `/visit`, `/contact`, `/privacy`, and `/accessibility`

Automated and manual testing has been performed against applicable WCAG 2.2 Level A and AA success criteria. This report describes a technical accessibility posture; it is not a legal certification or a guarantee of compliance.

## Methods and evidence

- Axe-core runs against every scoped route at desktop, 768px tablet, and Pixel 7 mobile sizes, plus the open mobile navigation state.
- Keyboard review covers Tab, Shift+Tab, Enter, Space, and Escape across global navigation, skip navigation, menu/category links, gallery filters, calls to action, phone/social/footer links, and sticky mobile actions. There are no modal or lightbox states in Version 1.
- Semantic review uses rendered accessibility-tree output for page titles, headings, landmarks, link/button roles, image alternatives, navigation labels, and hidden/decorative content.
- Reflow is tested at 320, 390, and 430 CSS pixels. Desktop review covers 200% zoom (equivalent 640 CSS px at a 1280px viewport) and practical 400% zoom (320 CSS px).
- Text-spacing tests apply line height 1.5, paragraph spacing 2em, letter spacing 0.12em, and word spacing 0.16em.
- Contrast values were calculated from sRGB relative luminance, not visual estimation. Representative pairs: body `#1e2522`/`#f8f4ec` 14.08:1; muted `#626d67`/`#f8f4ec` 5.03:1; primary `#1f5a4a`/`#f8f4ec` 7.31:1; light focus `#b8484f`/`#f8f4ec` 4.69:1; dark-section focus `#f4c86b`/`#152c27` 9.37:1; Bar body `#e4e5df`/`#152c27` 11.66:1; Bar eyebrow `#ddbd78`/`#152c27` 8.18:1.
- Retained Catering form code is covered by component/schema tests for labels, required/error associations, accessible status handling, and autocomplete. The launch flag prevents that form and the empty Kitchen gallery category from rendering publicly.

## Success-criterion matrix

| Success criterion                   | Level | Applicability                             | Method              | Result | Evidence / remediation                                                         | Final status |
| ----------------------------------- | ----- | ----------------------------------------- | ------------------- | ------ | ------------------------------------------------------------------------------ | ------------ |
| 1.1.1 Non-text Content              | A     | Images                                    | Automated + manual  | Pass   | Production image alternatives audited; decorative motifs hidden                | Pass         |
| 1.2.1–1.2.3 Time-based Media        | A     | Hero video poster/fallback                | Manual              | Pass   | Decorative video is hidden; equivalent meaningful poster context remains       | Pass         |
| 1.2.4 Captions (Live)               | AA    | No live media                             | Manual              | N/A    | No live synchronized media                                                     | N/A          |
| 1.2.5 Audio Description             | AA    | No meaningful prerecorded video narrative | Manual              | N/A    | Decorative ambience conveys no essential information                           | N/A          |
| 1.3.1 Info and Relationships        | A     | All pages                                 | Axe + tree          | Pass   | One main, semantic header/nav/footer, logical headings and labels              | Pass         |
| 1.3.2 Meaningful Sequence           | A     | All pages                                 | Keyboard + tree     | Pass   | DOM, reading, and focus order follow visual order                              | Pass         |
| 1.3.3 Sensory Characteristics       | A     | All pages                                 | Manual              | Pass   | Instructions do not depend on shape, position, or sound                        | Pass         |
| 1.3.4 Orientation                   | AA    | Responsive UI                             | Manual              | Pass   | No orientation lock; portrait and landscape reflow                             | Pass         |
| 1.3.5 Identify Input Purpose        | AA    | Retained future form                      | Code + tests        | Pass   | Appropriate input types/autocomplete; form hidden in launch mode               | Pass         |
| 1.4.1 Use of Color                  | A     | States and links                          | Manual              | Pass   | Focus and error states do not rely on color alone                              | Pass         |
| 1.4.2 Audio Control                 | A     | No autoplay audio                         | Manual              | N/A    | No audio starts automatically                                                  | N/A          |
| 1.4.3 Contrast (Minimum)            | AA    | Text                                      | Calculated          | Pass   | Representative minimum pairs recorded above; muted token hardened              | Pass         |
| 1.4.4 Resize Text                   | AA    | All pages                                 | Zoom/reflow         | Pass   | Content remains usable at 200%                                                 | Pass         |
| 1.4.5 Images of Text                | AA    | Production media                          | Manual              | Pass   | No essential text rendered as images                                           | Pass         |
| 1.4.10 Reflow                       | AA    | All pages                                 | Automated + manual  | Pass   | No ordinary-page horizontal overflow at 320 CSS px                             | Pass         |
| 1.4.11 Non-text Contrast            | AA    | Controls/focus                            | Calculated + visual | Pass   | 3px high-contrast focus ring; controls retain boundaries                       | Pass         |
| 1.4.12 Text Spacing                 | AA    | All pages                                 | Automated           | Pass   | Required overrides produce no clipping or page overflow                        | Pass         |
| 1.4.13 Content on Hover or Focus    | AA    | All pages                                 | Manual              | Pass   | No essential hover-only disclosures                                            | Pass         |
| 2.1.1 Keyboard                      | A     | All controls                              | Manual + automated  | Pass   | Links/buttons/categories/filters usable with keyboard                          | Pass         |
| 2.1.2 No Keyboard Trap              | A     | Navigation/overlays                       | Manual              | Pass   | No traps; Escape closes mobile navigation and returns focus                    | Pass         |
| 2.1.4 Character Key Shortcuts       | A     | No shortcuts                              | Manual              | N/A    | Site defines no single-character shortcuts                                     | N/A          |
| 2.2.1 Timing Adjustable             | A     | No time limits                            | Manual              | N/A    | No timed tasks                                                                 | N/A          |
| 2.2.2 Pause, Stop, Hide             | A     | Motion                                    | Code + manual       | Pass   | No essential auto-updating content; reduced motion removes animation           | Pass         |
| 2.3.1 Three Flashes                 | A     | All pages                                 | Manual              | Pass   | No flashing content                                                            | Pass         |
| 2.4.1 Bypass Blocks                 | A     | Global layout                             | Automated           | Pass   | Visible-on-focus skip link targets focusable main                              | Pass         |
| 2.4.2 Page Titled                   | A     | All routes                                | Automated + manual  | Pass   | Every route has a unique descriptive title                                     | Pass         |
| 2.4.3 Focus Order                   | A     | All pages                                 | Keyboard            | Pass   | Logical order; focus returns to mobile-menu trigger                            | Pass         |
| 2.4.4 Link Purpose (In Context)     | A     | All links                                 | Tree + manual       | Pass   | Purposeful link labels; repeated labels have sufficient context                | Pass         |
| 2.4.5 Multiple Ways                 | AA    | Public content                            | Manual              | Pass   | Header, footer, and contextual navigation provide multiple paths               | Pass         |
| 2.4.6 Headings and Labels           | AA    | All pages                                 | Tree + tests        | Pass   | Descriptive headings/labels and one H1 per page                                | Pass         |
| 2.4.7 Focus Visible                 | AA    | All controls                              | Automated + visual  | Pass   | 3px outline with 4px offset on light/dark surfaces                             | Pass         |
| 2.4.11 Focus Not Obscured (Minimum) | AA    | Sticky UI                                 | Automated + manual  | Pass   | Scroll padding/margins account for header; mobile actions do not obscure focus | Pass         |
| 2.5.1 Pointer Gestures              | A     | All controls                              | Manual              | N/A    | No multipoint/path gesture required                                            | N/A          |
| 2.5.2 Pointer Cancellation          | A     | Native controls                           | Manual              | Pass   | Activation uses standard link/button behavior                                  | Pass         |
| 2.5.3 Label in Name                 | A     | Controls                                  | Axe + tree          | Pass   | Accessible names include visible labels                                        | Pass         |
| 2.5.4 Motion Actuation              | A     | No motion input                           | Manual              | N/A    | No device-motion functions                                                     | N/A          |
| 2.5.7 Dragging Movements            | AA    | All pages                                 | Manual              | N/A    | No dragging interaction                                                        | N/A          |
| 2.5.8 Target Size (Minimum)         | AA    | Interactive controls                      | Automated           | Pass   | Key controls meet 24px minimum; primary mobile controls target 44px            | Pass         |
| 3.1.1 Language of Page              | A     | Document                                  | DOM review          | Pass   | Root document declares `lang="en"`                                             | Pass         |
| 3.1.2 Language of Parts             | AA    | Dish names                                | Manual              | N/A    | No passage requires a language change; transliterated dish names retained      | N/A          |
| 3.2.1 On Focus                      | A     | Controls                                  | Keyboard            | Pass   | Focus alone causes no unexpected context change                                | Pass         |
| 3.2.2 On Input                      | A     | Filters/navigation                        | Manual              | Pass   | Activation is explicit; no surprising automatic navigation                     | Pass         |
| 3.2.3 Consistent Navigation         | AA    | Global UI                                 | Manual              | Pass   | Header/footer navigation remains consistent                                    | Pass         |
| 3.2.4 Consistent Identification     | AA    | Repeated controls                         | Manual              | Pass   | Repeated actions use consistent names and roles                                | Pass         |
| 3.3.1 Error Identification          | A     | Retained form                             | Code + tests        | Pass   | Errors identify affected fields; form not public in Version 1                  | Pass         |
| 3.3.2 Labels or Instructions        | A     | Retained form                             | Code + tests        | Pass   | Inputs/groups have labels and preceding instructions                           | Pass         |
| 3.3.3 Error Suggestion              | AA    | Retained form                             | Code + tests        | Pass   | Understandable corrective error messages                                       | Pass         |
| 3.3.4 Error Prevention              | AA    | No legal/financial submission             | Manual              | N/A    | No covered transaction                                                         | N/A          |
| 3.3.7 Redundant Entry               | A     | Public experience                         | Manual              | N/A    | No multi-step public data entry                                                | N/A          |
| 3.3.8 Accessible Authentication     | AA    | No authentication                         | Manual              | N/A    | Public site has no authentication flow                                         | N/A          |
| 4.1.2 Name, Role, Value             | A     | Controls                                  | Axe + tree          | Pass   | Native semantics; expanded state and labeled navigation exposed                | Pass         |
| 4.1.3 Status Messages               | AA    | Hours/future form                         | Manual + code       | Pass   | Static hours need no live region; retained form uses targeted status semantics | Pass         |

## Manual findings

- Keyboard: all scoped interactions are reachable in logical order. Shift+Tab reverses without a trap. Enter activates links/buttons; Space activates the menu button; Escape closes the open mobile menu and restores focus. Menu and gallery controls are ordinary in-page links and require no custom arrow-key pattern.
- Screen-reader semantics: the rendered tree exposes one main landmark, labeled primary/footer/quick-action navigation, one H1, meaningful section headings, link/button roles, phone purpose, figure labels, and concise image alternatives. Decorative motifs and video layers are hidden.
- Fixed UI: the sticky header and mobile action bar remain keyboard operable. Explicit scroll padding and target margins keep anchored/focused content clear of the header.
- Forms: no public form is rendered for Version 1. Retained code has labels, required/error associations, focusable status handling, and autocomplete attributes.
- Motion/pointer: reduced-motion preferences disable animation, transitions, image movement, and smooth scrolling. No function requires hover, precision movement, multipoint gesture, or drag.

## Exceptions and final status

No unresolved WCAG 2.2 Level A or AA issue was found within the stated scope. Browser/assistive-technology combinations can vary, so accessibility remains an ongoing maintenance responsibility and feedback path rather than a one-time certification.

**Final technical status: ready for owner review against the stated WCAG 2.2 Level AA target.**
