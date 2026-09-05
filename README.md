# Rights Chocolate — 3D scroll-story mockup

Static site, no build step. Serve the folder with any static server that supports HTTP Range requests (needed for the scroll-scrubbed video; Python's `http.server` does not support ranges, so the scrub section will freeze there):

```bash
cd rights-3d-mockup && npx http-server -p 8765 -c-1
```

Then visit http://localhost:8765 (add `?lang=en` for English).

## What it is
- **Hero**: looping liquid-chocolate video, "Made Right." lockup, slogan, two CTAs.
- **3D story (pinned, 520 vh of scroll)**: a procedural Three.js chocolate bar. Scrolling drives four beats — cacao beans orbit (Origen), the squares fly in and assemble on the slab (Templado), the bar presents itself under a gold rim light (Manos), then snaps in two and a square breaks toward the viewer (Made Right.). Mouse parallax on desktop. Static single frame under `prefers-reduced-motion`.
- **Origen**: real cacao footage (pods on the tree, open pod, dried beans) with three facts.
- **Proceso (scroll-scrub)**: pinned video scrubbed by scroll — melanger, pour on marble, hand tempering — with three copy beats.
- **Chocolates**: three bars, each a live 3D render (dark / milk / intense) that rotates and speeds up on hover.
- **Maestros**: hands-only tempering footage, inclusion-as-mastery copy.
- **Mayoristas**: email capture.
- **Rita**: floating concierge bubble placeholder (`#concierge-widget`).

ES / EN toggle swaps all copy without reload and remembers the choice in the URL.

## Constants for the team (top of `js/main.js`)
- `PAYMENT_LINK_70`, `PAYMENT_LINK_55`, `PAYMENT_LINK_85` — checkout links per bar.
- `FORM_ENDPOINT` — where the wholesale form POSTs `{ email, source, lang }`.
- `WIDGET_SCRIPT` — concierge embed script URL.

## Footage
Everything is free stock or CC BY; see `assets/video/CREDITS.md`. The Wikimedia cacao footage needs the attribution line kept on the page (it is shown in the Origen and Maestros sections and in the footer link). No AI-generated content.

## Copy
All copy is placeholder written for this mockup to show the story structure. Facts (fermentation days, cacao percentages, prices) are illustrative and need to be confirmed by Rights before anything ships.

## Upload to Hostinger (when the time comes)
1. Upload the whole folder contents (`index.html`, `css/`, `js/`, `vendor/`, `assets/`) to `public_html/`.
2. Nothing to build. Fonts load from Google Fonts; everything else is local.
3. Video total is ~45 MB; the 720p variants are picked automatically on screens ≤ 820 px.

## Swapping footage
Replace any file in `assets/video/` keeping the same filename; the code does not change. For the scrub clip, re-encode with all keyframes:

```bash
ffmpeg -i in.mp4 -an -vf "scale=1920:-2" -c:v libx264 -g 1 -keyint_min 1 -crf 26 -movflags +faststart pour-scrub.mp4
```
