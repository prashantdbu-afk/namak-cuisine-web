# Google Analytics 4 setup

## Vercel production environment

Configure these variables for the **Production** environment in Vercel:

```text
NEXT_PUBLIC_ANALYTICS_PROVIDER=google
NEXT_PUBLIC_ANALYTICS_ID=G-YYFJJQGY6T
```

The integration also requires Vercel's built-in `VERCEL_ENV` value to be
`production`. Preview and local deployments do not load Google Analytics and do
not send events to the production GA4 property.

## GA4 property

The Namak production web data stream uses measurement ID `G-YYFJJQGY6T`.

Keep **Enhanced Measurement** enabled in GA4. In the web stream settings,
confirm that page views include **Page changes based on browser history
events**. Next.js and the official Google Analytics component then track route
pageviews automatically; the application intentionally does not send manual
`page_view` events.

## Tracked events

| Event              | When it fires                             | Parameters                    |
| ------------------ | ----------------------------------------- | ----------------------------- |
| `click_call`       | A visitor follows any phone link          | `source_page`, `cta_location` |
| `click_directions` | A visitor follows the Get Directions link | `source_page`, `cta_location` |
| `view_menu`        | The `/menu` route is viewed               | None                          |
| `view_bar`         | The `/bar` route is viewed                | None                          |
| `view_catering`    | The `/catering` route is viewed           | None                          |
| `click_instagram`  | The Namak Instagram link is followed      | `source_page`                 |
| `click_facebook`   | The Namak Facebook link is followed       | `source_page`                 |

The typed event catalog also reserves `click_reserve`, `click_order`, and
`submit_catering_inquiry` for future integrations. They are not currently
fired.

Event payloads contain route paths and general CTA locations only. Names,
emails, phone numbers, inquiry notes, form contents, and URL query strings are
not sent.

## Verify in Realtime

1. Deploy the change to production with both environment variables configured.
2. In GA4, open **Reports → Realtime**.
3. Open the production Namak website in a separate browser window.
4. Visit Menu, Bar, and Catering, then test a call, directions, or social link.
5. Confirm the relevant event names appear in the Realtime event list. Realtime
   reporting can take a short time to update.

Preview deployments are intentionally unsuitable for this verification because
analytics is disabled there.

## Mark important actions as Key Events

In GA4, open **Admin → Events**, locate an event after GA4 has received it, and
turn on **Mark as key event**. Recommended candidates include `click_call` and
`click_directions`. Mark only events the owner wants to treat as meaningful
business outcomes; future event names should not be marked until their actual
integrations are enabled.
