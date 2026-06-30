# Aqua Nord — Frontend Design System

## Brand

Aqua Nord is a fictional Scandinavian premium water purification company.
Aesthetic: dark, minimal, clean, premium. Think Linear + Vercel but for water.

## Color Tokens

```css
--color-bg:         #0a0d0f;    /* near-black background */
--color-surface:    #111518;    /* card/panel surface */
--color-border:     #1e2529;    /* subtle borders */
--color-text:       #e8edf0;    /* primary text */
--color-muted:      #6b7a85;    /* secondary/muted text */
--color-accent:     #3a9ed9;    /* primary accent — Nordic blue */
--color-accent-dim: #1a4a6a;    /* accent at low intensity */
--color-success:    #2dd4a4;    /* green/teal for purity indicators */
```

## Typography

- **Font family:** `'Inter', system-ui, sans-serif` — load Inter from Google Fonts
- **Scale:**
  - Display: 64–80px, weight 600–700, tight letter-spacing (-0.03em)
  - Heading 1: 48px, weight 600
  - Heading 2: 32px, weight 500
  - Heading 3: 22px, weight 500
  - Body: 16–18px, weight 400, line-height 1.65
  - Label/caption: 12–14px, weight 500, letter-spacing 0.06em, uppercase
- **Rule:** never smaller than 14px for body text

## Spacing System

8px base grid: 8, 16, 24, 32, 48, 64, 96, 128px

## Layout

- Max content width: 1200px, centered
- Page padding: 24px mobile → 48px desktop
- Section padding: 96px vertical

## Component Style

- **Buttons (primary):** accent background, 10px radius, 14px font, 500 weight, 44px min height
- **Buttons (ghost):** transparent with border, same sizing
- **Cards:** surface color, border-color border, 12px radius, 32px padding
- **Badges:** small, uppercase, 11px, letter-spacing 0.1em, teal/accent color

## Animation Rules (Framer Motion)

- Use `fadeInUp` entrance for text sections: `y: 30 → 0, opacity: 0 → 1, duration: 0.6`
- Stagger children by 0.1s in feature grids
- Smooth hover on cards: `scale: 1.02, duration: 0.2`
- Sticky nav blur: backdrop-filter on scroll
- Respect `prefers-reduced-motion`

## Anti-Slop Rules

- NO glassmorphism
- NO rainbow gradients — max one subtle blue glow
- NO emoji in UI
- NO generic SaaS "rocket ship" illustrations
- NO fake dashboard screenshots
- Whitespace is intentional — don't fill it
- Every section has ONE key message

## Sections to Build

1. **Sticky nav** — logo left, links right, CTA button, blur on scroll
2. **Hero** — large headline, subtext, two CTAs, animated water particle or subtle gradient orb
3. **Stats bar** — 3 numbers (e.g. "99.97% purity", "120+ countries", "25 years")
4. **Features** — 3 cards with icon, title, description
5. **How it works** — 3 steps, horizontal layout
6. **Testimonials** — 2–3 quotes, minimal style
7. **CTA section** — dark card, big headline, button
8. **Footer** — logo, links, copyright

## Rules

1. All animations via Framer Motion
2. Mobile-first, fully responsive
3. Semantic HTML
4. Dark theme only
5. Real focus states
6. No placeholder images — use CSS gradients or SVG shapes instead
