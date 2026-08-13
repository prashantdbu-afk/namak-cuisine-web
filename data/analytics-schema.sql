create table if not exists analytics_events (
  id bigint generated always as identity primary key,
  occurred_at timestamptz not null default now(),
  event_name text not null check (event_name in (
    'page_view', 'click_call', 'click_directions', 'view_menu', 'view_bar',
    'view_catering', 'click_instagram', 'click_facebook'
  )),
  visitor_id uuid not null,
  session_id uuid not null,
  source_page varchar(120) not null,
  cta_location varchar(40)
);
create index if not exists analytics_events_occurred_at_idx on analytics_events (occurred_at);
create index if not exists analytics_events_visitor_idx on analytics_events (visitor_id, occurred_at);
