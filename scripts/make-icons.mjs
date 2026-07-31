/**
 * Generate the PWA icon PNGs from public/icon.svg.
 *
 *   node scripts/make-icons.mjs
 *
 * Outputs (bump the -vN suffix when the ART changes — phones only re-download
 * icons when the manifest text changes):
 *   icon-192-v3.png / icon-512-v3.png  — full-frame art (purpose "any")
 *   icon-maskable-v3.png               — art scaled to the maskable safe zone
 *                                        (inner ~80% circle) on the brand navy,
 *                                        so Android's circle/squircle crop
 *                                        doesn't clip the reels
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import sharp from 'sharp';

const root = fileURLToPath(new URL('..', import.meta.url));
const svg = readFileSync(`${root}public/icon.svg`);
const BG = '#20244A'; // must match the SVG background
const SVG_SIZE = 100; // viewBox units

/** Rasterize the SVG at an exact pixel size (density trick for viewBox-only SVGs). */
function raster(px) {
  return sharp(svg, { density: 72 * (px / SVG_SIZE) }).resize(px, px);
}

await raster(192).png().toFile(`${root}public/icon-192-v3.png`);
await raster(512).png().toFile(`${root}public/icon-512-v3.png`);

// Maskable: art at 72% of the canvas, centered, padded with the background.
const inner = Math.round(512 * 0.72); // 368
const pad = Math.round((512 - inner) / 2);
await raster(inner)
  .extend({ top: pad, bottom: pad, left: pad, right: pad, background: BG })
  .png()
  .toFile(`${root}public/icon-maskable-v3.png`);

console.log('icons written: icon-192-v3.png, icon-512-v3.png, icon-maskable-v3.png');
