const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const toIco = require('to-ico');

async function generateFavicon() {
  try {
    const svgPath = path.join(__dirname, '../public/icon.svg');
    const outputPath = path.join(__dirname, '../app/favicon.ico');
    
    console.log('Generating favicon.ico from icon.svg...');
    
    // Read the SVG file
    const svgBuffer = fs.readFileSync(svgPath);
    
    // Convert SVG to PNG at multiple sizes (16x16, 32x32, 48x48)
    const sizes = [16, 32, 48];
    const pngBuffers = await Promise.all(
      sizes.map(size => 
        sharp(svgBuffer)
          .resize(size, size)
          .png()
          .toBuffer()
      )
    );
    
    // Convert PNGs to ICO format
    const icoBuffer = await toIco(pngBuffers);
    
    // Write the ICO file
    fs.writeFileSync(outputPath, icoBuffer);
    
    console.log(`✅ Successfully created favicon.ico at ${outputPath}`);
    console.log('The favicon is ready to use!');
  } catch (error) {
    console.error('Error generating favicon:', error);
    process.exit(1);
  }
}

generateFavicon();
