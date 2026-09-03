import sharp from 'sharp';
import fs from 'fs';

async function analyze() {
  const metadata = await sharp('public/isl_alphabet_chart.png').metadata();
  console.log('Image dimensions:', metadata.width, metadata.height);

  // Let's create public/signs directory if not exists
  if (!fs.existsSync('public/signs')) {
    fs.mkdirSync('public/signs', { recursive: true });
  }

  // Get raw pixels
  const { data, info } = await sharp('public/isl_alphabet_chart.png').raw().toBuffer({ resolveWithObject: true });
  console.log('Channels:', info.channels, 'Width:', info.width, 'Height:', info.height);
}

analyze().catch(console.error);
