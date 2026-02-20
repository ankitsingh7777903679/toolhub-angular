import sharp from 'sharp';
import path from 'node:path';

const assetsDir = path.resolve('public/assets');

const tasks = [
  { input: '2olhub-instant-processing.webp', outputs: [{ suffix: '-640', width: 640 }, { suffix: '-480', width: 480 }] },
  { input: '2olhub-all-tools-dashboard.webp', outputs: [{ suffix: '-640', width: 640 }, { suffix: '-480', width: 480 }] },
  { input: '2olhub-drag-drop-interface.webp', outputs: [{ suffix: '-640', width: 640 }, { suffix: '-480', width: 480 }] },
  { input: '2olhub-download-result.webp', outputs: [{ suffix: '-640', width: 640 }, { suffix: '-480', width: 480 }] },
  { input: 'tool-chain-workflow-merge-compress-watermark-pdf.webp', outputs: [{ suffix: '-640', width: 640 }, { suffix: '-480', width: 480 }] },
  { input: '2olhub-showcase-1.webp', outputs: [{ suffix: '-350', width: 350 }] },
  { input: '2olhub-showcase-2.webp', outputs: [{ suffix: '-350', width: 350 }] },
  { input: '2olhub-showcase-3.webp', outputs: [{ suffix: '-350', width: 350 }] },
  { input: '2olhub-showcase-4.webp', outputs: [{ suffix: '-350', width: 350 }] },
  { input: '2olhub-showcase-5.webp', outputs: [{ suffix: '-350', width: 350 }] },
  { input: 'logo.webp', outputs: [{ suffix: '-200', width: 200 }, { suffix: '-96', width: 96 }] }
];

for (const task of tasks) {
  const inputPath = path.join(assetsDir, task.input);
  const extIndex = task.input.lastIndexOf('.');
  const baseName = task.input.slice(0, extIndex);

  for (const output of task.outputs) {
    const outputPath = path.join(assetsDir, `${baseName}${output.suffix}.webp`);
    await sharp(inputPath)
      .resize({ width: output.width, withoutEnlargement: true })
      .webp({ quality: 72, effort: 5 })
      .toFile(outputPath);

    console.log(`Created ${path.basename(outputPath)}`);
  }
}

console.log('Home image optimization complete.');
