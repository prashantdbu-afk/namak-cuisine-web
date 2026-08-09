"use client";
import Link from "next/link";
import { useState } from "react";
import { navigation, site } from "@/config/site";
import { getReservationAction } from "@/lib/reservations";
export function Header() {
  const [open, setOpen] = useState(false); const reserve = getReservationAction();
  return <header className="site-header"><div className="nav-shell">
    <Link className="wordmark" href="/" aria-label={`${site.name} home`}><span>N</span> NAMAK</Link>
    <button className="menu-toggle" aria-expanded={open} aria-controls="site-nav" onClick={() => setOpen(!open)}>{open ? "Close" : "Menu"}</button>
    <nav id="site-nav" aria-label="Primary" data-open={open}>{navigation.map((item) => <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>{item.label}</Link>)}
      {reserve.available && <a className="button button-small" href={reserve.href}>{reserve.label}</a>}</nav>
  </div></header>;
}
