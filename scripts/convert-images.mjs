import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagesDir = path.resolve(__dirname, '..', 'public', 'images');

/**
 * Target max width (px) per source file. `null` keeps the original width.
 *
 * Book covers render at ~270px wide in the 4-up grid (and ~224px in list view),
 * so 600px covers them at 2x without shipping a 1.8MB original.
 * The Library banner is full-bleed on large screens, so posters stay uncapped.
 */
const maxWidthMap = {
  'book1.jpg': 600,
  'book2.jpg': 600,
  'book3.jpg': 600,
  'logo.png': 512,
  'admin.png': 600,
  'poster_adewale.jpg': null,
  'poster_falana.png': null,
  'poster_morounkeji.jpg': null,
};

const SOURCE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png']);

/**
 * Raster sources in public/images are converted to .webp and then the source is
 * deleted (see README / AGENTS.md). This script therefore discovers whatever
 * sources remain rather than reading a hardcoded list that goes stale.
 */
function findSources() {
  if (!fs.existsSync(imagesDir)) return [];
  return fs
    .readdirSync(imagesDir)
    .filter((name) => SOURCE_EXTENSIONS.has(path.extname(name).toLowerCase()))
    .sort();
}

async function convertImage(fileName) {
  const inputPath = path.join(imagesDir, fileName);
  const basename = path.basename(fileName, path.extname(fileName));
  const outputPath = path.join(imagesDir, `${basename}.webp`);

  const origSize = fs.statSync(inputPath).size;
  const metadata = await sharp(inputPath).metadata();
  const { width: origWidth, height: origHeight } = metadata;

  const targetMaxWidth = maxWidthMap[fileName] ?? null;
  let newWidth = origWidth;
  let newHeight = origHeight;

  const pipeline = sharp(inputPath);
  if (targetMaxWidth !== null && origWidth > targetMaxWidth) {
    newWidth = targetMaxWidth;
    newHeight = Math.round(origHeight * (targetMaxWidth / origWidth));
    pipeline.resize({ width: targetMaxWidth, withoutEnlargement: true });
  }

  await pipeline.webp({ quality: 85 }).toFile(outputPath);

  const webpSize = fs.statSync(outputPath).size;
  return {
    fileName,
    origSize,
    webpSize,
    compressionRatio: ((1 - webpSize / origSize) * 100).toFixed(1),
    origWidth,
    origHeight,
    newWidth,
    newHeight,
  };
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

async function main() {
  const sources = findSources();

  if (sources.length === 0) {
    console.log(
      `No .jpg/.png sources in ${imagesDir}.\n` +
        'Drop new originals in there and re-run to convert them to .webp.'
    );
    return;
  }

  console.log(`Converting ${sources.length} image(s) to WebP...\n`);

  const results = [];
  for (const file of sources) {
    try {
      results.push(await convertImage(file));
    } catch (err) {
      console.error(`✖ ${file}: ${err.message}`);
      process.exitCode = 1;
    }
  }

  if (results.length === 0) return;

  const header =
    'Image'.padEnd(25) +
    'Original'.padEnd(14) +
    'WebP'.padEnd(14) +
    'Res'.padEnd(18) +
    'Saved';
  console.log(`\n${header}`);
  console.log('-'.repeat(80));

  let totalOrig = 0;
  let totalWebP = 0;
  for (const r of results) {
    console.log(
      r.fileName.padEnd(25) +
        formatBytes(r.origSize).padEnd(14) +
        formatBytes(r.webpSize).padEnd(14) +
        `${r.newWidth}×${r.newHeight}`.padEnd(18) +
        `${r.compressionRatio}%`
    );
    totalOrig += r.origSize;
    totalWebP += r.webpSize;
  }

  console.log('-'.repeat(80));
  console.log(
    'TOTAL'.padEnd(25) +
      formatBytes(totalOrig).padEnd(14) +
      formatBytes(totalWebP).padEnd(14) +
      ''.padEnd(18) +
      `${((1 - totalWebP / totalOrig) * 100).toFixed(1)}%`
  );
  console.log('\nSources are left in place; delete them once you have checked the .webp output.');
}

main().catch((err) => {
  console.error('Conversion failed:', err);
  process.exit(1);
});
