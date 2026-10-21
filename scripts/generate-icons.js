const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateAllIcons() {
  const masterSource = path.join(__dirname, '../public/images/logo_master_inner_balanced.png');
  console.log('Loading master image:', masterSource);

  // 1. Trim outer transparent margins so logo cleanly fills the frame
  const trimmedBuffer = await sharp(masterSource)
    .trim()
    .toBuffer();

  const trimmedMeta = await sharp(trimmedBuffer).metadata();
  console.log(`Trimmed master dimensions: ${trimmedMeta.width}x${trimmedMeta.height}`);

  // Helper to create a perfectly centered square icon with slight breathing room (~5% padding)
  async function createSquareIcon(size) {
    const innerSize = Math.round(size * 0.92);
    const resized = await sharp(trimmedBuffer)
      .resize(innerSize, innerSize, { fit: 'inside' })
      .toBuffer();

    return sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      }
    })
      .composite([{ input: resized, gravity: 'centre' }])
      .png({ compressionLevel: 9 })
      .toBuffer();
  }

  // 2. Generate 512x512 icon.png
  console.log('Generating 512x512 icon.png...');
  const icon512 = await createSquareIcon(512);
  fs.writeFileSync(path.join(__dirname, '../public/icon.png'), icon512);
  fs.writeFileSync(path.join(__dirname, '../app/icon.png'), icon512);
  console.log('✅ Wrote public/icon.png and app/icon.png (512x512)');

  // 3. Generate 192x192 favicon.png (multiple of 48px: 48 * 4 = 192, optimal for Googlebot)
  console.log('Generating 192x192 favicon.png...');
  const icon192 = await createSquareIcon(192);
  fs.writeFileSync(path.join(__dirname, '../public/favicon.png'), icon192);
  console.log('✅ Wrote public/favicon.png (192x192)');

  // 4. Generate 180x180 apple-icon.png
  console.log('Generating 180x180 apple-icon.png...');
  const icon180 = await createSquareIcon(180);
  fs.writeFileSync(path.join(__dirname, '../public/apple-icon.png'), icon180);
  fs.writeFileSync(path.join(__dirname, '../app/apple-icon.png'), icon180);
  console.log('✅ Wrote public/apple-icon.png and app/apple-icon.png (180x180)');

  // 5. Generate 48x48, 32x32, 16x16 PNGs for ICO
  const icon48 = await createSquareIcon(48);
  const icon32 = await createSquareIcon(32);
  const icon16 = await createSquareIcon(16);

  // 6. Generate valid multi-resolution ICO file (16, 32, 48)
  console.log('Generating valid multi-resolution ICO file...');
  const sizes = [16, 32, 48];
  const pngBuffers = [icon16, icon32, icon48];

  // ICO header: 6 bytes (Reserved: 2, Type: 2, ImageCount: 2)
  const icoHeader = Buffer.alloc(6);
  icoHeader.writeUInt16LE(0, 0); // Reserved
  icoHeader.writeUInt16LE(1, 2); // 1 = ICO
  icoHeader.writeUInt16LE(sizes.length, 4);

  let offset = 6 + sizes.length * 16;
  const entries = [];
  for (let i = 0; i < sizes.length; i++) {
    const entry = Buffer.alloc(16);
    const s = sizes[i];
    entry.writeUInt8(s === 256 ? 0 : s, 0); // width
    entry.writeUInt8(s === 256 ? 0 : s, 1); // height
    entry.writeUInt8(0, 2); // color count
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(pngBuffers[i].length, 8); // image size
    entry.writeUInt32LE(offset, 12); // image offset
    entries.push(entry);
    offset += pngBuffers[i].length;
  }

  const icoBuffer = Buffer.concat([icoHeader, ...entries, ...pngBuffers]);
  fs.writeFileSync(path.join(__dirname, '../public/favicon.ico'), icoBuffer);
  fs.writeFileSync(path.join(__dirname, '../app/favicon.ico'), icoBuffer);
  console.log('✅ Wrote public/favicon.ico and app/favicon.ico (Multi-size ICO: 16x16, 32x32, 48x48)');

  // 7. Verify all files exist
  console.log('\n--- VERIFICATION OF GENERATED ASSETS ---');
  [
    '../public/icon.png',
    '../app/icon.png',
    '../public/favicon.png',
    '../public/favicon.ico',
    '../app/favicon.ico',
    '../public/apple-icon.png',
    '../app/apple-icon.png',
  ].forEach(relPath => {
    const absPath = path.join(__dirname, relPath);
    const stat = fs.statSync(absPath);
    console.log(`${relPath}: ${stat.size} bytes`);
  });
}

generateAllIcons().catch(console.error);
