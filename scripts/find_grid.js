import sharp from 'sharp';
import fs from 'fs';

async function findGrid() {
  const image = sharp('public/isl_alphabet_chart.png');
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const width = info.width;
  const height = info.height;
  const channels = info.channels;

  // Let's compute average brightness per row and per column
  const rowBrightness = new Float64Array(height);
  for (let y = 0; y < height; y++) {
    let sum = 0;
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * channels;
      sum += (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
    }
    rowBrightness[y] = sum / width;
  }

  const colBrightness = new Float64Array(width);
  for (let x = 0; x < width; x++) {
    let sum = 0;
    for (let y = 0; y < height; y++) {
      const idx = (y * width + x) * channels;
      sum += (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
    }
    colBrightness[x] = sum / height;
  }

  // Print sample brightness profile
  console.log('Sample Row Brightness (every 20px):');
  for (let y = 0; y < height; y += 30) {
    console.log(`y=${y}: ${rowBrightness[y].toFixed(1)}`);
  }
}

findGrid().catch(console.error);
