import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mkdirSync, existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sizes = [16, 48, 128];
const inputSvg = join(__dirname, '../src/assets/icon.svg');
const outputDir = join(__dirname, '../dist');

async function generateIcons() {
  // Create dist directory if it doesn't exist
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  for (const size of sizes) {
    await sharp(inputSvg)
      .resize(size, size)
      .png()
      .toFile(join(outputDir, `icon${size}.png`));
  }
}

generateIcons().catch(console.error); 