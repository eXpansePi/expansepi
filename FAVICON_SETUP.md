# Favicon Setup Instructions

To fix the favicon issue in Google search results, you need to create a `favicon.ico` file.

## Quick Fix

1. **Convert SVG to ICO**: Use an online tool like:
   - https://convertio.co/svg-ico/
   - https://www.icoconverter.com/
   - Or use ImageMagick: `magick convert public/icon.svg -resize 32x32 public/favicon.ico`

2. **Place the file**: 
   - Option A: Place `favicon.ico` in the `app/` directory (Next.js will auto-serve it)
   - Option B: Place `favicon.ico` in the `public/` directory

3. **Verify**: Visit `https://expansepi.com/favicon.ico` to ensure it loads correctly

4. **Clear Google Cache**:
   - Submit your sitemap in Google Search Console
   - Request a recrawl of your homepage
   - It may take a few days for Google to update the favicon in search results

## Current Setup

The metadata is already configured to reference `/favicon.ico`. Once you add the file, it will be automatically used.

