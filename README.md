# PatternQuest 🧭

**Number Patterns & Sequences — Secondary 1 (Singapore MOE Mathematics syllabus)**

An interactive, gamified learning module built on Intellia's five-phase framework
(**Wonder → Story → Simulate → Play → Reflect**), teaching Secondary 1 students to
continue number patterns, describe rules in words, recognise special sequences
(even/odd/square/triangular/cube), derive and apply the **general term (nth term)**
of a linear sequence, and test sequence membership.

Follow Farhan, Mei Lin, and their mentor **Tally the Owl** on a mountain trail of
numbered markers as they learn to read term-to-term rules and derive position-to-term
formulas.

## Quick start

```bash
npm install
npm run dev       # local dev server
npm run build     # production build → dist/
```

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Vite dev server |
| `npm run build` | Production build |
| `npm run stress-test` | Runs `scripts/stress_test_questions.js` — generates 300 × 100 = 30,000 questions and asserts no duplicate options, `correctAnswer` always present, and independently re-verifies the math (general-term derivation and membership tests) against `patternMath.js`. Run this after touching anything in `src/data/questionBank.js` or `src/utils/patternMath.js`. |
| `npm run generate-audio` | Pre-generates all fixed narration audio via ElevenLabs (see **Audio** below) |
| `npm run clean-audio` | Removes orphaned `.mp3` files no longer referenced in `audioMap.js` |
| `npm run lint` | Oxlint |

## Structure

- **`src/utils/patternMath.js`** — the math core. Every correct answer in the app is
  derived here, never hardcoded. `deriveGeneralTerm(a1, d)` is the single place the
  coefficient/constant pair is computed — see the comment at the top of that function
  for why this matters (it's the fix for the headline "coefficient-vs-constant"
  misconception, see below).
- **`src/data/questionBank.js`** — procedurally generates 100 questions (10 worlds ×
  10 questions) fresh every session, using curated "clean number" draws from
  `patternMath.js` rather than a fixed hardcoded bank.
- **`src/config/worlds.config.js`** — the 10 themed worlds, each mapped to one concept
  focus (continue-the-pattern, special sequences, general-term derivation, far-term
  application, membership testing, figure patterns ×2, multi-step prediction, mixed
  review).
- **`src/components/simulations/`** — the 4 Simulate-phase stations: **The Growing
  Trail** (concept discovery), **Set the Checkpoint** (build-to-target), **Build the
  Expedition Log** (3-step table → formula → far-stage application), and **Spot the
  False Trail Marker** (error-detective).
- **`src/components/shared/PatternVisual.jsx`** — renders the 4 visual types used
  across the question bank (sequence strips, growing figure/dot grids, formula
  breakdowns, and named-sequence icons).

## The headline misconception

Students very commonly derive the general term of a sequence starting at 6 and
climbing by 5 as `5n + 6` instead of the correct `5n + 1` — using the first term
directly as the constant, instead of checking the formula against *n = 1*.
`patternMath.js`'s `firstTermAsConstantMistake()` generates exactly this distractor,
and it appears in **100%** of "Find the General Term" questions (verified via
`scripts/stress_test_questions.js`'s companion audit) — deliberately, since it's the
research-confirmed highest-value misconception for this topic.

## Story art

No illustrated artwork has been produced yet. Each of the 4 Story panels currently
renders a CSS-framed placeholder (gradient + emoji + title) instead of a raster
image, so real art can be dropped in later without touching any component. See
**`src/assets/story/ART_BRIEF.md`** for the full panel-by-panel brief.

## Audio

Follows an ElevenLabs-only narration pipeline (voice: Alice,
`Xb7hH8MSUJpSbSDYk0k2`) with **no browser TTS fallback** — see
`audio_generation_pipeline.md` for the full pipeline design.

`src/utils/audioMap.js` ships **empty** in this delivery (no ElevenLabs API key was
available in the build environment). To pre-generate narration audio:

1. Copy `.env.local.example` to `.env.local` and add your own `VITE_ELEVENLABS_API_KEY`.
2. Run `npm run generate-audio`.

Until then, the app still runs fine — narration simply falls through to the dynamic
per-request ElevenLabs path (or is skipped silently client-side if no key is present).
Every fixed narration string in `src/utils/narration.js` has an exact-match entry
in `scripts/generate_audio.js`'s `phrases` array; per-question text is intentionally
*not* pre-generated since it's procedurally generated fresh each session.

## Accessibility notes

- Figure-pattern visuals (growing dot/tile diagrams) always carry a numeric count
  label alongside the diagram — never dot-counting-only.
- The two stations that might otherwise use sliders (The Growing Trail, Set the
  Checkpoint) use `<button>`-based +/− steppers instead, which are keyboard-operable
  by default.
- `src/styles/secondary-calibration.css` dials back a handful of the most
  Primary-grade oversized decorative emoji sizes inherited from the reference
  architecture, to sit toward the platform's more restrained end for a Secondary 1
  (ages 12–13) audience, per the product spec. It's a small, clearly-scoped override
  sheet — not a rewrite of the inherited component CSS — so it's easy to tune further
  or remove.

## Known follow-ups

- Story panel illustrations (see art brief above).
- A first-playable design/tone review against the Secondary 1 audience is still
  recommended, as with any new module at this grade band.
