// scripts/generate_audio.js
// Offline pre-generation script for ElevenLabs narration audio files.
// Strictly follows audio_generation_pipeline (5).md specifications.
//
// Every phrase below is copied verbatim from src/utils/narration.js — if you add or
// change a narration line there, mirror the exact same string here (see TRD Build/QA
// note: "every string passed to a narration helper has an exact match in audioMap.js,
// or is intentionally dynamic"). Per-question text (questionText, hints as rendered
// on-screen) is intentionally NOT pre-generated — it's procedurally generated and
// different every session, so it always falls through to the dynamic ElevenLabs path
// at runtime (or is skipped silently if no API key is present).

import fs from 'fs';
import path from 'path';

// Helper to read environment variables without external dependencies
function loadEnv() {
  const envFiles = ['.env.local', '.env'];
  for (const file of envFiles) {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf-8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const [key, ...rest] = trimmed.split('=');
          const val = rest.join('=').replace(/^["']|["']$/g, '').trim();
          if (!process.env[key.trim()]) {
            process.env[key.trim()] = val;
          }
        }
      }
    }
  }
}

loadEnv();

const apiKey = process.env.VITE_ELEVENLABS_API_KEY || process.env.ELEVENLABS_API_KEY;
if (!apiKey) {
  console.error("\n❌ Error: VITE_ELEVENLABS_API_KEY is not defined in .env.local or .env.");
  console.log("Please create a .env.local file with: VITE_ELEVENLABS_API_KEY=your_key_here\n");
  process.exit(1);
}

const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2'; // Alice — Clear, Engaging Educator
const VOICE_MODEL = 'eleven_multilingual_v2';

const VOICE_SETTINGS = {
  statement:     { stability: 0.65, similarity_boost: 0.80, style: 0.30, use_speaker_boost: true },
  instruction:   { stability: 0.65, similarity_boost: 0.80, style: 0.30, use_speaker_boost: true },
  question:      { stability: 0.55, similarity_boost: 0.75, style: 0.50, use_speaker_boost: true },
  encouragement: { stability: 0.50, similarity_boost: 0.85, style: 0.60, use_speaker_boost: true },
  emphasis:      { stability: 0.75, similarity_boost: 0.90, style: 0.20, use_speaker_boost: true },
  thinking:      { stability: 0.70, similarity_boost: 0.78, style: 0.40, use_speaker_boost: true },
  celebration:   { stability: 0.45, similarity_boost: 0.85, style: 0.80, use_speaker_boost: true },
};

const phrases = [
  // ─── WONDER PHASE ────────────────────────────────────────────────────────
  { text: "Welcome to PatternQuest! A trail has numbered markers: three... seven... eleven... fifteen...", style: 'statement' },
  { text: "The trail keeps going, but the expedition needs to know where marker fifty is — right now, without walking there.", style: 'statement' },
  { text: "Can you crack the rule?", style: 'question' },
  { text: "Let's investigate how number patterns work!", style: 'celebration' },

  // ─── STORY PHASE: PANEL 1 ────────────────────────────────────────────────
  { text: "Farhan and Mei Lin met Tally the Owl at the start of a long mountain trail.", style: 'statement' },
  { text: "Numbered posts marked the way — three... seven... eleven... fifteen — but the trail curved off into the mist, and half the markers ahead were missing.", style: 'statement' },
  { text: "We need to reach marker fifty before sundown, said Mei Lin. We can't walk the whole trail counting every post.", style: 'thinking' },
  { text: "Tally the Owl tilted her head. Then don't count. Find the rule.", style: 'statement' },

  // ─── STORY PHASE: PANEL 2 ────────────────────────────────────────────────
  { text: "Farhan spotted it fast: each marker is four more than the last — three, then seven, then eleven.", style: 'statement' },
  { text: "That's the term-to-term rule, Tally explained. It tells you what to do to get from one marker to the next.", style: 'statement' },
  { text: "But if I asked you for marker fifty, would you really add four, forty-nine times?", style: 'question' },
  { text: "Mei Lin shook her head. There has to be a shortcut — a formula that works for any position at once.", style: 'statement' },
  { text: "Exactly, said Tally. That's the position-to-term rule — the general term.", style: 'emphasis' },

  // ─── STORY PHASE: PANEL 3 ────────────────────────────────────────────────
  { text: "At the map table, Farhan scribbled fast: we add four each time, and we started at three — so the formula must be four times n, plus three!", style: 'statement' },
  { text: "Mei Lin frowned and checked it against marker one. Hold on. Put n equals one into your formula: four times one, plus three, is seven — but the very first marker was three, not seven.", style: 'statement' },
  { text: "Farhan paused. The common difference gives you the four — the times-n part. But the plus-three isn't the common difference, it's whatever makes the formula land on marker one exactly.", style: 'thinking' },
  { text: "Checking against n equals one caught the mistake before it went any further.", style: 'emphasis' },

  // ─── STORY PHASE: PANEL 4 ────────────────────────────────────────────────
  { text: "With the corrected formula, the en-th term equals four times n, minus one, the trio put it to the test.", style: 'statement' },
  { text: "Marker fifty, said Farhan, is four times fifty, minus one — one hundred and ninety-nine.", style: 'statement' },
  { text: "Mei Lin checked it against the early markers one more time, and it matched every single one.", style: 'statement' },
  { text: "Tally the Owl swooped ahead and landed right beside a weathered post reading one hundred and ninety-nine. The expedition can push on, she called back. You didn't need to count a single step past marker four.", style: 'celebration' },

  // ─── SIMULATE STATION INTROS ─────────────────────────────────────────────
  { text: "Welcome to The Growing Trail — a Concept Discovery Lab!", style: 'instruction' },
  { text: "Step the position forward and watch the trail pattern grow. Notice the constant amount added between each step — that's the common difference.", style: 'instruction' },
  { text: "Welcome to Set the Checkpoint — a Build-to-Target Challenge!", style: 'instruction' },
  { text: "Tune the coefficient and the constant until your formula, a times n plus b, lands exactly on the target value at the target position.", style: 'instruction' },
  { text: "Welcome to Build the Expedition Log — a Multi-Step Construction!", style: 'instruction' },
  { text: "Fill in the position-to-term table for the growing figure, assemble the general term from the coefficient and constant, then apply it to a far stage.", style: 'instruction' },
  { text: "Welcome to Spot the False Trail Marker — an Error Detective challenge!", style: 'instruction' },
  { text: "A rival trekker's worked solution contains one mistake. Tap the line that's wrong, then supply the correction.", style: 'instruction' },

  // ─── FEEDBACK & HINTS ────────────────────────────────────────────────────
  { text: "Spot on! That's correct! 🎉", style: 'celebration' },
  { text: "Awesome! Three in a row! ⭐", style: 'celebration' },
  { text: "Incredible streak! You are unstoppable! 🔥", style: 'celebration' },
  { text: "Not quite — check the hint, and try again! 💡", style: 'thinking' },
  { text: "Here's your first hint! Look for the common difference first.", style: 'encouragement' },
  { text: "Here's your final clue! Check your formula against the first term before trusting it.", style: 'encouragement' },

  // ─── WORLD & BOSS BATTLES ────────────────────────────────────────────────
  { text: "World Complete! Spectacular job on this stretch of trail! 🌟", style: 'celebration' },
  { text: "The Boss Battle begins! Answer correctly to defeat the boss and claim your badge!", style: 'emphasis' },
  { text: "Victory! You defeated the boss and claimed the World Badge! 👑", style: 'celebration' },

  // ─── REFLECT PHASE ───────────────────────────────────────────────────────
  { text: "Welcome to the Reflect Phase! Let's review the key pattern concepts and check your scorecard! 📓", style: 'statement' },
  { text: "Outstanding! You have mastered number patterns, the term-to-term rule, and the general term! You are a true Expedition Champion! 🏆", style: 'celebration' },
];

const outputDir = './public/assets/audio';
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function cleanString(str) {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 45).replace(/_+/g, '_').replace(/^_|_$/g, '');
}

async function main() {
  console.log(`\n🎙️ Starting ElevenLabs Audio Generation Pipeline`);
  console.log(`Voice ID: ${VOICE_ID} | Model: ${VOICE_MODEL}`);
  console.log(`Total phrases to process: ${phrases.length}\n`);

  const mapping = {};

  for (let i = 0; i < phrases.length; i++) {
    const { text, style } = phrases[i];
    const cleanText = cleanString(text);
    const fileName = `audio_${cleanText}_${i}.mp3`;
    const destPath = path.join(outputDir, fileName);

    const relativeWebPath = `/assets/audio/${fileName}`;
    mapping[text] = relativeWebPath;

    if (fs.existsSync(destPath)) {
      console.log(`[${i + 1}/${phrases.length}] ⏩ Skipped (already exists): ${fileName}`);
      continue;
    }

    console.log(`[${i + 1}/${phrases.length}] 🔊 Generating: "${text.substring(0, 40)}..." -> ${fileName}`);

    const settings = VOICE_SETTINGS[style] || VOICE_SETTINGS.statement;

    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          model_id: VOICE_MODEL,
          voice_settings: settings,
        }),
      });

      if (!response.ok) {
        const errBody = await response.text();
        throw new Error(`HTTP ${response.status}: ${errBody}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      fs.writeFileSync(destPath, buffer);
      console.log(`   ✅ Saved: ${destPath}`);
    } catch (e) {
      console.error(`   ❌ Failed to generate phrase "${text}":`, e.message);
    }
  }

  // Write mapping to src/utils/audioMap.js
  const mapContent = `// Auto-generated by generate_audio.js\n// Static asset mapping for offline generated narration phrases in PatternQuest\n\nexport const audioMap = ${JSON.stringify(mapping, null, 2)};\n\nexport default audioMap;\n`;
  fs.writeFileSync('./src/utils/audioMap.js', mapContent);
  console.log("\n✨ Audio mapping updated in src/utils/audioMap.js!");
  console.log("🎉 Audio generation completed successfully!\n");
}

main().catch(console.error);
