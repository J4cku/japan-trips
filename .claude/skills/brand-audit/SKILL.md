---
name: brand-audit
description: Audit a running TripMag page against the branding guide. Checks fonts, colors, spacing, and component styles match the Cinematic Nomad design system.
allowed-tools: Bash, Read, Grep, Glob
argument-hint: "[url-or-section]"
---

# Brand Audit

Audit the TripMag landing page (or a specific section) against the branding guide.

## What to check

Read the branding reference at `branding/brand-guide.html` and `branding/04-DESIGN-TOKENS.md` for the source of truth.

### 1. Typography
Verify computed `font-family` on key elements:
- **Headlines (h1, h2)**: Must render Playfair Display serif, NOT Inter
- **Labels / tech callouts**: Must render Space Mono monospace
- **Body text / buttons**: Must render Inter sans-serif
- **Logo "TRIPMAG"**: Must render Playfair Display, with "MAG" in `#BC002D`

Use the Chrome MCP tools to check `getComputedStyle(el).fontFamily` on:
- `.lp-hero__headline` (Playfair Display)
- `.lp-hero__label` (Space Mono)
- `.lp-hero__sub` (Inter)
- `.lp-nav__logo` (Playfair Display)
- `.lp-section-header h2` (Playfair Display)
- `.lp-step__time` (Space Mono)
- `.lp-pricing__price` (Playfair Display)

### 2. Colors
Check these key color tokens are applied correctly:
- Hero background: `#0A0E27` (--lp-dark)
- Primary CTA: `#BC002D` background
- Secondary CTA: `#BC002D` border, transparent background
- Cyan accent: `#00D9FF` for AI/tech signals
- Gold accent: `#C9A96E` for luxury touches
- Section headings on light bg: `#0A0E27`
- Body text: `#6B7280` (muted gray)

### 3. Spacing & Layout
- Hero: full viewport height, 60/40 grid split (desktop)
- Section padding: 80px vertical
- Cards: 16px border-radius, hover lift (-4px translateY)
- Buttons: min 44px height touch target
- Container max-width: 1200px

### 4. Responsive
Check at 1024px and 640px breakpoints:
- 1024px: Hero map hidden, features 2-col, demo single column
- 640px: Everything single column, nav links hidden, CTAs stacked

## Process

1. If no URL provided as $ARGUMENTS, default to `http://localhost:3099`
2. Start a dev/prod server if needed (`npx next build && npx next start -p 3099`)
3. Use Chrome MCP tools to navigate and inspect
4. Use `javascript_tool` to check computed styles programmatically
5. Take screenshots at desktop (1440px) and mobile (480px) widths
6. Report findings as a checklist: PASS / FAIL with details

## Output format

```
BRAND AUDIT — [date]
URL: [url]

TYPOGRAPHY
  [PASS] Headlines: Playfair Display
  [FAIL] Labels: Expected Space Mono, got Inter
  ...

COLORS
  [PASS] Hero bg: #0A0E27
  ...

SPACING
  [PASS] Section padding: 80px
  ...

RESPONSIVE (1024px)
  [PASS] Hero map hidden
  ...

ISSUES FOUND: N
[detailed description of each failure with CSS selector and fix suggestion]
```
