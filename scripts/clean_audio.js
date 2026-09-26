// scripts/clean_audio.js
import fs from 'fs';
import path from 'path';
import { audioMap } from '../src/utils/audioMap.js';

const audioDir = './public/assets/audio';

if (!fs.existsSync(audioDir)) {
  console.log("Audio directory does not exist.");
  process.exit(0);
}

const activeFiles = new Set(Object.values(audioMap).map(p => path.basename(p)));

const files = fs.readdirSync(audioDir);
let deletedCount = 0;

for (const file of files) {
  if (file.endsWith('.mp3') && !activeFiles.has(file)) {
    console.log(`Deleting orphan audio file: ${file}`);
    fs.unlinkSync(path.join(audioDir, file));
    deletedCount++;
  }
}

console.log(`Cleaned up. Deleted ${deletedCount} orphan audio files.`);
