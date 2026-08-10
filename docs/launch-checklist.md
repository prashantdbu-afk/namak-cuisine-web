# SEO and growth launch checklist

## Domain and crawlability

- [ ] Production deployment promoted only after owner approval
- [ ] `namakcuisine.com` DNS points to the approved Vercel production project
- [ ] HTTPS certificate active and HTTP redirects to HTTPS
- [ ] Preferred hostname redirects consistently
- [ ] Production `robots.txt` allows crawling and lists the sitemap
- [ ] Preview deployments return `X-Robots-Tag: noindex, nofollow, noarchive`
- [ ] Canonicals resolve to `https://namakcuisine.com`
- [ ] Sitemap returns 200 and contains only indexable canonical URLs

## Google systems

- [ ] Search Console Domain property verified by DNS
- [ ] Sitemap submitted
- [ ] Priority pages inspected and indexing requested
- [ ] Google Business Profile claimed and reconciled with website NAP
- [ ] Google Maps address, pin, phone, hours, and directions verified by owner
- [ ] GA4 property created and `NEXT_PUBLIC_GA4_ID` configured
- [ ] Optional GTM container created and `NEXT_PUBLIC_GTM_ID` configured
- [ ] Realtime and DebugView confirm page and conversion events
- [ ] Internal/developer traffic filter considered

## Restaurant operations

- [ ] Current hours and holiday hours confirmed
- [ ] Menu and prices owner-approved
- [ ] Reservation destination owner-approved
- [ ] Catering form delivery tested end to end
- [ ] Reviews workflow assigned to an owner/team member
- [ ] Facebook and Instagram profile links verified
- [ ] Directory and delivery-platform duplicates resolved

## Quality and measurement

- [ ] Production Lighthouse: Performance 95+, Accessibility 100, Best Practices 100, SEO 100
- [ ] CLS below 0.05
- [ ] Automated tests and GitHub checks pass
- [ ] No broken internal links
- [ ] Structured data passes Google Rich Results Test and Schema.org Validator
- [ ] `page_view`, menu, bar, gallery, visit, call, directions, reservation, catering, and social events verified
- [ ] Launch annotation recorded in GA4 and business change log
