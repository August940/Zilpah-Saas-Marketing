# Zilpah design guide

The visual system behind zilpah.io. The tokens below are the ones the site uses (`:root` in `zilpah-site/index.html` and `brief.html`); change them there first, then update this file.

## Character

Calm, warm and confident. A dark moss-green page with cream type, broken up by small accents of bright colour. The tone is a capable partner, not a flashy tool: plenty of space, short sentences, one clear action per section.

## Colour

| Token | Value | Use |
|---|---|---|
| `--canvas` | `#3a4232` | Page background |
| `--surface-soft` | `#424a39` | Quiet bands, footer |
| `--surface-card` | `#4a5340` | Cards and panels |
| `--surface-strong` | `#56604b` | Raised or pressed surfaces |
| `--hairline` | `#5f694f` | Borders and dividers |
| `--ink` | `#f6f0dc` | Headings, links |
| `--body` | `#d6d0ba` | Body text |
| `--body-strong` | `#ece6d1` | Lead paragraphs |
| `--muted` | `#bcb6a1` | Labels, hints, captions |
| `--primary` / `--primary-active` | `#f6f0dc` / `#e4dcc3` | Primary button and its hover |
| `--on-primary`, `--card-ink` | `#0a0a0a` | Text on cream or bright accents |

Accents: `--pink #ff4d8b`, `--teal #1a3a3a`, `--lavender #b8a4ed`, `--peach #ffb084`, `--ochre #e8b94a`, `--mint #a4d4c5`, `--coral #ff6b5a`.

- Use accents in small doses: number dots on cards, the focus ring (pink), the flip-card button (ochre), the flip-card back (teal).
- Body text on any surface must meet WCAG AA. When text sits over a photo, put the moss overlay (`rgba(42,48,36,.8)`) between them.

## Type

- One family: **Inter**, self-hosted from `zilpah-site/fonts/` (SIL Open Font License, see `fonts/OFL.txt`). No third-party font requests.
- Headings: weight 500, letter-spacing `-0.04em`, tight line-height. `h1` scales `40–72px`, `h2` `32–56px`, `h3` is `18px` weight 600.
- Body `16px / 1.55`; lead paragraphs `18px`, capped at about 60 characters per line.
- Section labels: `12px`, weight 600, uppercase, `1.5px` letter-spacing, muted colour.

## Space and shape

- Section padding `96px` (`--section`); content width `1280px` with `24px` side gutters.
- Radii: `12px` buttons and inputs (`--r-md`), `16px` cards (`--r-lg`), `24px` large panels (`--r-xl`), pills for small round buttons.
- No heavy shadows. Depth comes from the step between canvas and card surfaces.

## Components

- **Buttons**: minimum height 44px. Primary is cream on dark ink; secondary is canvas with a hairline border that turns to ink on hover.
- **Navigation**: a sticky glass bar with a Menu button that opens a panel of cards for each section.
- **Hero**: centred headline and lead, two buttons, and the particle cursor effect behind it.
- **Service cards**: three-column grid, numbered accent dot, optional background photo under the moss overlay.
- **Steps**: four columns, each topped by a 2px ink rule and a two-digit counter.
- **Flip card**: pilot offer on the front, details on a teal back, flipped by click.
- **FAQ**: native `details` elements with hairline dividers and a rotating plus sign.
- **Brief form** (`brief.html`): labelled fields with inline error messages; the summary is sent as a pre-filled email until a form endpoint exists.

## Motion

- Fade and rise on scroll, staggered within groups.
- Every animation is wrapped in `prefers-reduced-motion: no-preference`; with reduced motion the content is shown as is.

## Accessibility

- Visible focus ring on every interactive element (3px pink).
- Skip link to main content.
- Touch targets at least 44px.
