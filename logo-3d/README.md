# 3D logo loop

The Zilpah "Z" as a glossy black 3D object on a transparent background. The letter holds still while sand flows the infinity loop it already draws: along the top bar, down the diagonal through the crossing, along the bottom bar and back up through the crossing. One loop is 6 seconds and repeats seamlessly.

| File | Use |
|---|---|
| `zilpah-z-loop.webp` | Animated WebP with transparency (720px, 2.7 MB). Works as a plain `<img>` in every current browser, Safari included. Easiest for the site. |
| `zilpah-z-loop.webm` | VP9 video with alpha (720px, 0.8 MB). Smallest; transparent in Chrome, Edge and Firefox, but Safari shows it on black. |
| `zilpah-z.js` + `vendor/` | Live WebGL version that renders at any size and resolution. Needs `vendor/three.module.min.js` (Three.js r170, MIT, 690 KB / ~170 KB gzipped). |
| `index.html` | Demo page for the live version. |

A 1080px ProRes 4444 `.mov` with alpha (for Premiere, Final Cut, After Effects, Keynote) is kept in the project files rather than in git because of its size.

## Embed

```html
<!-- image, no JavaScript -->
<img src="logo-3d/zilpah-z-loop.webp" width="360" height="360" alt="Zilpah">

<!-- live -->
<canvas data-zilpah-z role="img" aria-label="Zilpah logo" style="width:360px;aspect-ratio:1"></canvas>
<script type="module" src="logo-3d/zilpah-z.js"></script>
```

The live version holds a still frame when the visitor prefers reduced motion.

## Re-rendering the video

Frames come from the live version: open `index.html` from a local server, set `canvas.dataset.manual = 1`, call `canvas.zilpahZ.render(t)` for `t = 0, 1/30, … 6` and save `canvas.toDataURL()`. Then:

```sh
ffmpeg -framerate 30 -i f%04d.png -vf scale=720:720 -c:v libvpx-vp9 -pix_fmt yuva420p -b:v 0 -crf 32 zilpah-z-loop.webm
ffmpeg -framerate 30 -i f%04d.png -vf scale=720:720 -c:v libwebp_anim -q:v 80 -loop 0 zilpah-z-loop.webp
ffmpeg -framerate 30 -i f%04d.png -c:v prores_ks -profile:v 4444 -pix_fmt yuva444p10le zilpah-z-loop-1080.mov
```

The outline in `zilpah-z.js` was traced from the uploaded logo with potrace.
