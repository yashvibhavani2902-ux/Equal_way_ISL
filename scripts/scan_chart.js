import sharp from 'sharp';
import fs from 'fs';

async function scanChart() {
  const image = sharp('public/isl_alphabet_chart.png');
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const width = info.width;
  const height = info.height;
  const channels = info.channels;

  // Let's find non-white bounding box
  let minX = width, maxX = 0, minY = height, maxY = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * channels;
      const r = data[idx], g = data[idx+1], b = data[idx+2];
      if (r < 245 || g < 245 || b < 245) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  console.log(`Bounding box of non-white: x=${minX}..${maxX} (w=${maxX-minX+1}), y=${minY}..${maxY} (h=${maxY-minY+1})`);
}

scanChart().catch(console.error);
