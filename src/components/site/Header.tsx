"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { navigation } from "@/config/site";
import { getReservationAction } from "@/lib/reservations";
export function Header() {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const reserve = getReservationAction();

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [open]);
  return (
    <header className="site-header">
      <div className="nav-shell">
        <Link className="wordmark" href="/">
          <span>N</span> NAMAK<span className="sr-only"> home</span>
        </Link>
        <button
          ref={toggleRef}
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen(!open)}
        >
          {open ? "Close" : "Menu"}
        </button>
        <nav id="site-nav" aria-label="Primary" data-open={open}>
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          {reserve.available && (
            <a className="button button-small" href={reserve.href}>
              {reserve.label}
            </a>
          )}
        </nav>
      </div>
    </header>
  );
}
