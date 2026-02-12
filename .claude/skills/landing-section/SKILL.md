---
name: landing-section
description: Scaffold a new landing page section for TripMag. Creates the component, CSS, and wires it into page.tsx following existing patterns.
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
argument-hint: "[section-name] [description]"
---

# Landing Section Scaffolder

Create a new landing page section following TripMag's established patterns.

## Input

$ARGUMENTS: `[SectionName] [brief description]`
Example: `Testimonials Video testimonials from real travelers`

## Process

### 1. Study existing patterns

Read these files to match conventions:
- `src/app/page.tsx` — how sections are imported and ordered
- `src/components/landing/Features.tsx` — example server component section
- `src/components/landing/FAQ.tsx` — example client component (if interactive)
- `src/components/landing/Reveal.tsx` — scroll reveal wrapper
- `src/app/globals.css` — search for `/* ═══ LP` to see CSS section markers

### 2. Create the component

Create `src/components/landing/{SectionName}.tsx`:

```tsx
// Server component (default) — add "use client" only if it needs interactivity
import { Reveal } from "./Reveal";

export function {SectionName}() {
  return (
    <section className="lp-{kebab-name}" id="{kebab-name}">
      <div className="lp-container">
        <Reveal>
          <div className="lp-section-header">
            <h2>{Title}</h2>
            <p>{Subtitle}</p>
          </div>
        </Reveal>
        <Reveal delay={100}>
          {/* Section content */}
        </Reveal>
      </div>
    </section>
  );
}
```

Conventions to follow:
- Wrap in `<section>` with `className="lp-{name}"` and `id="{name}"`
- Use `<div className="lp-container">` for max-width constraint
- Wrap content blocks in `<Reveal>` for scroll animation
- Use Playfair Display for headings: handled by `.lp-section-header h2` CSS
- Use Space Mono for labels/tech callouts
- Keep data (arrays, objects) as `const` above the component

### 3. Add CSS

Append styles to `src/app/globals.css` BEFORE the `/* ═══ LANDING RESPONSIVE ═══ */` section.

Follow the naming pattern:
```css
/* ═══ LP {SECTION_NAME} ═══ */
.lp-{kebab-name} {
  padding: 80px 0;
  background: var(--lp-light);  /* or --lp-dark for dark sections */
}

.lp-{kebab-name}__grid { ... }
.lp-{kebab-name}__card { ... }
```

Color reference:
- Light sections: `background: var(--lp-light)` or `#F8F9FA`
- Dark sections: `background: var(--lp-dark)` or `#0A0E27`
- Headings: `color: var(--lp-text-primary)` (light bg) or `var(--lp-light)` (dark bg)
- Body text: `color: var(--lp-text-muted)`
- Cards: `border: 1px solid var(--lp-border)`, `border-radius: 16px`

Font usage — use the var() with fallback pattern:
```css
font-family: var(--font-display, 'Playfair Display'), Georgia, serif;  /* headings */
font-family: var(--font-mono, 'Space Mono'), 'Courier New', monospace;  /* labels */
/* body text inherits Inter from body */
```

### 4. Add responsive rules

Add breakpoints inside the existing `/* ═══ LANDING RESPONSIVE ═══ */` media queries:

```css
@media (max-width: 1024px) {
  .lp-{kebab-name}__grid { grid-template-columns: 1fr; }
}
@media (max-width: 640px) {
  .lp-{kebab-name} { padding: 60px 0; }
}
```

### 5. Wire into page.tsx

Edit `src/app/page.tsx`:
1. Add import: `import { {SectionName} } from "@/components/landing/{SectionName}";`
2. Add `<{SectionName} />` in the desired position within `<main>`

### 6. Add nav link (optional)

If the section should be in the navigation, edit `src/components/landing/Nav.tsx`:
- Add `<a href="#{kebab-name}">{Display Name}</a>` to the nav links

## Output

- New component file
- CSS appended to globals.css
- page.tsx updated with import and usage
- (Optional) Nav.tsx updated
