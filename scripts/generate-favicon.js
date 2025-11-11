/**
 * Script to generate favicon.ico from icon.svg
 * 
 * Usage: node scripts/generate-favicon.js
 * 
 * Note: This requires additional packages. For a quick solution, use an online converter:
 * https://convertio.co/svg-ico/ or https://www.icoconverter.com/
 */

const fs = require('fs');
const path = require('path');

console.log('Favicon Generator');
console.log('================');
console.log('');
console.log('To generate favicon.ico, you have two options:');
console.log('');
console.log('Option 1: Use an online converter');
console.log('  1. Visit https://convertio.co/svg-ico/');
console.log('  2. Upload public/icon.svg');
console.log('  3. Download favicon.ico');
console.log('  4. Place it in the app/ directory');
console.log('');
console.log('Option 2: Use ImageMagick (if installed)');
console.log('  magick convert public/icon.svg -resize 32x32 app/favicon.ico');
console.log('');
console.log('After creating favicon.ico, place it in:');
console.log('  - app/favicon.ico (recommended for Next.js 13+)');
console.log('  OR');
console.log('  - public/favicon.ico');
console.log('');
console.log('Then verify it works by visiting: https://expansepi.com/favicon.ico');

