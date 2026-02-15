const fs = require('fs').promises;
const path = require('path');

// This script expects 'node-fetch' to be available for commonjs (or dynamic import)
// Since we are running in an environment where node-fetch might be ESM,
// let's use the local API client if possible, or just build a fetch request.
// However, I can just use `require('node-fetch')` if installed, or dynamic import.
// Or I can use the agent directly if I can import it.

// Let's use the API endpoint since the server is running.
const API_URL = 'http://localhost:3000/api/rembg/remove';

async function removeBackgroundFromFile(inputPath, outputPath) {
    try {
        console.log(`Processing ${inputPath}...`);
        const fileBuffer = await fs.readFile(inputPath);
        const base64Image = fileBuffer.toString('base64');
        const dataUrl = `data:image/jpeg;base64,${base64Image}`; // Assume jpeg for now

        const { default: fetch } = await import('node-fetch');

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                image: dataUrl,
                model: 'birefnet-massive' // Use our default model
            })
        });

        const result = await response.json();

        if (result.success && result.processed) {
            const outputBase64 = result.processed.replace(/^data:image\/\w+;base64,/, '');
            const outputBuffer = Buffer.from(outputBase64, 'base64');
            await fs.writeFile(outputPath, outputBuffer);
            console.log(`Saved result to ${outputPath}`);
        } else {
            console.error('Failed:', result.error || 'Unknown error');
        }

    } catch (error) {
        console.error('Error processing file:', error);
    }
}

(async () => {
    const examplesDir = path.join(__dirname, '../public/assets/examples');

    // Process product image
    await removeBackgroundFromFile(
        path.join(examplesDir, 'product.jpg'),
        path.join(examplesDir, 'product-nobg.png')
    );

    // Process portrait image
    await removeBackgroundFromFile(
        path.join(examplesDir, 'portrait.jpg'),
        path.join(examplesDir, 'portrait-nobg.png')
    );
})();
