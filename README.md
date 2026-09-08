# Johnny Artiaga — Portfolio

A single-page portfolio for an Information Technology student. No build step, no
dependencies, no framework — open `index.html` in a browser and it works.

Not published yet. To put it online, go to this repo's **Settings → Pages**,
set the source to `main` and the folder to `/ (root)`, and it will be live at
https://jjart05.github.io/portfolio within a minute or two.

## Making changes

Everything you need to edit lives in one file: **`content.js`**. Open it, change
the text, refresh the browser. You never need to touch the HTML, CSS, or JS.

The content was filled in from my real GitHub repositories. A few facts I still
need to add myself — they're marked with `[square brackets]`:

- my city and country
- my school name
- my year level and expected graduation years

Search `content.js` for `[` to find all of them.

### How the file is organised

| Section | What it controls |
| --- | --- |
| `identity` | Name, role, hero text, photo, CV link |
| `contact` | Email and social links |
| `sections` | Every section heading on the page |
| `stats` | The four animated numbers next to the bio |
| `marquee` | The scrolling technology banner |
| `services` | The three "what I do" cards |
| `skills` | The grouped toolkit chips |
| `projects` | The project cards |
| `experience` | The learning-journey timeline |
| `education` | Degree and certifications |
| `testimonials` | Quotes — currently empty, so the section is hidden |
| `settings` | Theme default, background animation, live URL |

### Behaviours that are automatic

- **Empty lists hide their section.** `testimonials` is empty, so that section
  isn't on the page. Add one quote and it appears.
- **Sections renumber themselves.** The `01 —`, `02 —` labels count only visible
  sections, so hiding one never leaves a gap in the numbering.
- **Project filters build themselves** from the `tags` on each project. Add a new
  tag and a matching filter button appears.
- **`featured: true`** gives a project a full-width card with its screenshot
  beside it. Spotibai and Leaf & Bloom are featured.

## The highest-value things left to do

1. **Add screenshots.** Take a screenshot of Spotibai and Leaf & Bloom, save them
   as `assets/spotibai.png` and `assets/leaf-and-bloom.png`, then set the `image`
   field on those projects. This is the single biggest improvement available —
   right now those cards show a generated gradient instead of the real thing.
2. **Fill in the bracketed facts** listed above.
3. **Add a LinkedIn profile.** For internship applications it matters. There's a
   commented-out line ready for it in `contact.socials`.
4. **Add a CV.** Drop `assets/cv.pdf` in and set `identity.resume` to
   `"assets/cv.pdf"` — a Download CV button appears in the hero automatically.
5. **Keep `stats` honest.** Anyone can check the repo count in ten seconds.

## Images

Put files in `assets/` and reference them with a relative path:

| What | Field in `content.js` | Example |
| --- | --- | --- |
| Photo | `identity.photo` | `"assets/me.jpg"` |
| CV | `identity.resume` | `"assets/cv.pdf"` |
| Project shot | `projects[n].image` | `"assets/spotibai.png"` |

The photo currently points at the GitHub avatar
(`https://github.com/jjart05.png`), so it updates whenever the GitHub picture
changes. Screenshots look best around 1200px wide at a 16:11 ratio — compress
them before committing.

## Deploying

The site is plain static files, so any host works.

- **GitHub Pages** — Settings → Pages → deploy from `main`, root folder.
- **Vercel or Netlify** — import the repo, leave the build command empty.

After deploying, set `settings.siteUrl` in `content.js` to the live URL so link
previews on LinkedIn and Facebook resolve properly.

## Files

```
index.html               Page structure, meta tags, SVG icon sprite
content.js               ← the only file to edit
assets/css/styles.css    Design tokens, both themes, layout, animations
assets/js/app.js         Renders content.js into the page; all interactions
assets/js/background.js  The animated constellation behind the hero
assets/favicon.svg       Browser tab icon
```

## Details worth knowing

- **Dark and light themes.** The header toggle persists the choice in
  `localStorage`; `settings.defaultTheme` sets the first-visit default.
- **Reduced motion is respected.** Visitors with `prefers-reduced-motion` get the
  full content with animations off, static hero text instead of the typewriter,
  and one still frame instead of the animated canvas.
- **Accessibility** was built in: a skip link, visible focus rings,
  `aria-current` on the active nav item, labelled icon buttons, and an
  `aria-live` region for the rotating hero text.
- **It prints cleanly.** `Ctrl+P` strips the decorative layers, which makes a
  usable one-page summary.
- **Performance.** The canvas caps its node count, clamps device pixel ratio to
  2, and stops animating when scrolled out of view or when the tab is hidden.
- **SEO.** Page title, description, Open Graph tags, and JSON-LD `Person`
  structured data are all generated from `content.js`.

Contact links use `mailto:` and a clipboard copy rather than a form, so there's
no backend to maintain and nothing to fail silently.
