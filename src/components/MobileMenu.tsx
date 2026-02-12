"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => setMounted(true), []);

  // Close on navigation
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (open) {
      document.body.classList.add("mobile-menu-open");
    } else {
      document.body.classList.remove("mobile-menu-open");
      window.dispatchEvent(new Event("mobile-menu-close"));
    }
    return () => document.body.classList.remove("mobile-menu-open");
  }, [open]);

  if (!mounted) return null;

  return (
    <>
      {open && (
        <div
          className="mobile-menu-backdrop"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}
      <button
        className="ui-toggle mobile-menu-trigger"
        onClick={() => setOpen(!open)}
        title={open ? "Close tools" : "Tools"}
        aria-label="Toggle tools menu"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          {open ? (
            <>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </>
          ) : (
            <>
              <circle cx="12" cy="5" r="1.5" fill="currentColor" stroke="none" />
              <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
              <circle cx="12" cy="19" r="1.5" fill="currentColor" stroke="none" />
            </>
          )}
        </svg>
      </button>
    </>
  );
}
