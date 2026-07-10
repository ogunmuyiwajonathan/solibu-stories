import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imagesDir = path.resolve(__dirname, '..', 'public', 'images');

// Define target max widths per image (based on usage table)
const maxWidthMap = {
  'book1.jpg': 300,
  'book2.jpg': 300,
  'book3.jpg': 300,
  'book4.jpg': null,  // keep original
  'book5.jpg': null,
  'book6.jpg': null,
  'book7.jpg': null,
  'book8.jpg': null,
  'logo.png': null,   // keep original (already small)
  'admin.png': 600,
  'poster_adewale.jpg': null,
  'poster_falana.png': null,
  'poster_morounkeji.jpg': null,
};

async function convertImage(fileName) {
  const inputPath = path.join(imagesDir, fileName);
  const ext = path.extname(fileName);
  const basename = path.basename(fileName, ext);
  const outputPath = path.join(imagesDir, `${basename}.webp`);

  if (!fs.existsSync(inputPath)) {
    console.log(`⚠  Skipping ${fileName} — file not found`);
    return null;
  }

  const origSize = fs.statSync(inputPath).size;

  // Read image and get metadata
  const image = sharp(inputPath);
  const metadata = await image.metadata();

  const origWidth = metadata.width;
  const origHeight = metadata.height;

  // Build the sharp pipeline
  let pipeline = sharp(inputPath);

  const targetMaxWidth = maxWidthMap[fileName];
  let newWidth = origWidth;
  let newHeight = origHeight;

  if (targetMaxWidth !== null && origWidth > targetMaxWidth) {
    const ratio = targetMaxWidth / origWidth;
    newWidth = targetMaxWidth;
    newHeight = Math.round(origHeight * ratio);
    pipeline = pipeline.resize({ width: targetMaxWidth, withoutEnlargement: true });
  }

  // Convert to WebP with quality 85
  pipeline = pipeline.webp({ quality: 85 });

  await pipeline.toFile(outputPath);

  const webpSize = fs.statSync(outputPath).size;
  const compressionRatio = ((1 - webpSize / origSize) * 100).toFixed(1);

  return {
    fileName,
    origSize,
    webpSize,
    compressionRatio,
    origWidth,
    origHeight,
    newWidth,
    newHeight,
  };
}

async function main() {
  const imageFiles = [
    'book1.jpg', 'book2.jpg', 'book3.jpg',
    'book4.jpg', 'book5.jpg', 'book6.jpg', 'book7.jpg', 'book8.jpg',
    'logo.png', 'admin.png',
    'poster_adewale.jpg', 'poster_falana.png', 'poster_morounkeji.jpg',
  ];

  console.log('Converting images to WebP...\n');

  const results = [];
  for (const file of imageFiles) {
    const result = await convertImage(file);
    if (result) results.push(result);
  }

  console.log('\n📊 Results:\n');
  console.log('Image'.padEnd(25) + 'Original'.padEnd(14) + 'WebP'.padEnd(14) + 'Res'.padEnd(18) + 'Saved');
  console.log('-'.repeat(80));

  let totalOrig = 0;
  let totalWebP = 0;

  for (const r of results) {
    const origStr = formatBytes(r.origSize);
    const webpStr = formatBytes(r.webpSize);
    const resStr = `${r.newWidth}×${r.newHeight}`;
    const savedStr = `${r.compressionRatio}%`;
    console.log(
      r.fileName.padEnd(25) +
      origStr.padEnd(14) +
      webpStr.padEnd(14) +
      resStr.padEnd(18) +
      savedStr
    );
    totalOrig += r.origSize;
    totalWebP += r.webpSize;
  }

  console.log('-'.repeat(80));
  const totalSaved = ((1 - totalWebP / totalOrig) * 100).toFixed(1);
  console.log(
    'TOTAL'.padEnd(25) +
    formatBytes(totalOrig).padEnd(14) +
    formatBytes(totalWebP).padEnd(14) +
    ''.padEnd(18) +
    `${totalSaved}%`
  );
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

main().catch((err) => {
  console.error('Conversion failed:', err);
  process.exit(1);
});
