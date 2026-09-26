// src/utils/patternMath.js
// Pure math helpers for PatternQuest — number patterns & linear sequences (Grade 7 / Secondary 1).
// Shared by data/questionBank.js (procedural generation) and the Simulate stations.
//
// IMPORTANT (see TRD §11 Risks): deriveGeneralTerm() is the ONE place the correct
// coefficient/constant pair is computed. Every question generator MUST call this
// function to obtain the correct answer, so the headline "coefficient-as-constant"
// misconception (writing 5n + 6 instead of 5n + 1 for a sequence starting at 6 that
// climbs by 5) can never accidentally leak into a correct-answer key.

// ── Random helpers ──────────────────────────────────────────────────────────

export function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Renders 1 -> "1st", 2 -> "2nd", 3 -> "3rd", 4 -> "4th", 11 -> "11th", etc. */
export function ordinal(n) {
  const rem100 = n % 100;
  if (rem100 >= 11 && rem100 <= 13) return `${n}th`;
  switch (n % 10) {
    case 1: return `${n}st`;
    case 2: return `${n}nd`;
    case 3: return `${n}rd`;
    default: return `${n}th`;
  }
}

export function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Picks `count` unique random items from `pool`
export function pickUnique(pool, count) {
  return shuffleArray(pool).slice(0, count);
}

// ── "Clean number" curated draws (TRD §4.4 hard requirements) ──────────────

// Curated nonzero common-difference pool: never zero (would degrade to a constant,
// non-pattern sequence) and never an unconstrained random integer.
const DIFFERENCE_POOL = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

/**
 * Draws a nonzero common difference from the curated pool.
 * @param {boolean} allowNegative - if true, may also return a negative value (descending trail).
 */
export function pickCleanCommonDifference(allowNegative = false) {
  const magnitude = DIFFERENCE_POOL[randInt(0, DIFFERENCE_POOL.length - 1)];
  if (allowNegative && Math.random() < 0.3) return -magnitude;
  return magnitude;
}

/**
 * Draws a first term from a curated, display-friendly range so early terms are
 * never awkwardly large or negative for a Secondary 1 reader.
 * @param {number} min
 * @param {number} max
 */
export function pickCleanFirstTerm(min = 1, max = 30) {
  return randInt(min, max);
}

// ── Linear (arithmetic) sequences ───────────────────────────────────────────

/** Produces `length` terms of an arithmetic sequence from a first term and common difference. */
export function generateLinearSequence(a1, d, length) {
  return Array.from({ length }, (_, i) => a1 + i * d);
}

/**
 * Returns { coefficient, constant } — the correct "an + b" pair for an arithmetic
 * sequence with first term a1 and common difference d.
 * nth term = a1 + (n-1)d = d·n + (a1 - d)
 * This is the ONLY place this should be computed (TRD §11).
 */
export function deriveGeneralTerm(a1, d) {
  return { coefficient: d, constant: a1 - d };
}

/** Evaluates an + b at a given position n. */
export function findTermAtPosition(a, b, n) {
  return a * n + b;
}

/**
 * Solves an + b = target for n. Rejects non-integer or non-positive n.
 * Returns { isMember, position }.
 */
export function isMemberOfSequence(a, b, target) {
  if (a === 0) return { isMember: false, position: null };
  const n = (target - b) / a;
  if (!Number.isInteger(n) || n < 1) return { isMember: false, position: null };
  return { isMember: true, position: n };
}

/** The headline misconception (PRD §3, TRD §10/§11): using the first term itself as
 * the constant, instead of checking the formula against n = 1 and correctly deriving
 * (a1 - d). e.g. a sequence starting at 6 climbing by 5 gets mis-written as 5n + 6
 * instead of the correct 5n + 1. */
export function firstTermAsConstantMistake(a1, d) {
  return { coefficient: d, constant: a1 };
}

// ── Named special sequences — canonical closed-form formulas ONLY ─────────

const SPECIAL_SEQUENCES = {
  even:       { label: 'even numbers',       formula: '2n',            term: (n) => 2 * n },
  odd:        { label: 'odd numbers',        formula: '2n − 1',        term: (n) => 2 * n - 1 },
  square:     { label: 'square numbers',     formula: 'n²',            term: (n) => n * n },
  triangular: { label: 'triangular numbers', formula: 'n(n + 1) ÷ 2',  term: (n) => (n * (n + 1)) / 2 },
  cube:       { label: 'cube numbers',       formula: 'n³',            term: (n) => n * n * n },
};

export const SPECIAL_SEQUENCE_KINDS = Object.keys(SPECIAL_SEQUENCES);

/** Returns { terms, label, formula } for a named sequence — never an invented near-formula. */
export function generateSpecialSequence(kind, length) {
  const def = SPECIAL_SEQUENCES[kind] || SPECIAL_SEQUENCES.even;
  const terms = Array.from({ length }, (_, i) => def.term(i + 1));
  return { terms, label: def.label, formula: def.formula };
}

/** The Nth term of a named special sequence (used for "what is the Nth ___ number" worlds). */
export function specialSequenceTermAt(kind, n) {
  const def = SPECIAL_SEQUENCES[kind] || SPECIAL_SEQUENCES.even;
  return def.term(n);
}

// ── Growing figure/diagram patterns (Worlds 6 & 7) ──────────────────────────

const FIGURE_ARCHETYPES = [
  { kind: 'campsite-tents',     label: 'tents at the campsite',      dotEmoji: '⛺' },
  { kind: 'trail-flags',        label: 'flags along the trail',      dotEmoji: '🚩' },
  { kind: 'staircase-steps',    label: 'stones in the staircase',    dotEmoji: '🟫' },
  { kind: 'signpost-markers',   label: 'markers at the signpost',    dotEmoji: '📍' },
];

export function pickFigureArchetype() {
  return FIGURE_ARCHETYPES[randInt(0, FIGURE_ARCHETYPES.length - 1)];
}

/**
 * Produces a growing figure/diagram pattern: a linear (arithmetic) count of dots/tiles
 * per stage. Capped so the first 3–4 stages stay within a renderable dot count
 * (<= ~20 dots per stage) for PatternVisual.jsx's figure-grid view.
 * @param {object} archetype - from pickFigureArchetype() (or a { kind, label, dotEmoji } shape)
 * @param {number} stages - how many stages to generate (default 4)
 */
export function generateFigurePattern(archetype, stages = 4) {
  // Keep first-stage count small and the difference modest so stage `stages`
  // still fits comfortably under the ~20-dot display ceiling.
  const a1 = pickCleanFirstTerm(2, 6);
  const d = pickCleanCommonDifference(false) % 5 || 1; // keep growth gentle: 1-4 per stage
  const counts = generateLinearSequence(a1, d, stages);
  const { coefficient, constant } = deriveGeneralTerm(a1, d);
  return {
    kind: archetype.kind,
    label: archetype.label,
    dotEmoji: archetype.dotEmoji,
    a1,
    d,
    coefficient,
    constant,
    stages: counts.map((count, i) => ({ stage: i + 1, count })),
  };
}

// ── Display / narration formatting (PRD §11 audio rules) ───────────────────

/**
 * Renders "an + b" to a display string, e.g. (3, 4) -> "3n + 4", (1, -2) -> "n − 2",
 * (5, 0) -> "5n". Also returns the narration-ready spoken form, e.g.
 * "3 times n, plus 4" per PRD §11 (coefficient always spoken, "times" never silent).
 */
export function formatGeneralTermString(a, b) {
  const coeffPart = a === 1 ? 'n' : a === -1 ? '−n' : `${a}n`;
  let display;
  if (b === 0) {
    display = coeffPart;
  } else if (b > 0) {
    display = `${coeffPart} + ${b}`;
  } else {
    display = `${coeffPart} − ${Math.abs(b)}`;
  }

  let spoken = a === 1 ? 'n' : a === -1 ? 'negative n' : `${a} times n`;
  if (b > 0) spoken += `, plus ${b}`;
  else if (b < 0) spoken += `, minus ${Math.abs(b)}`;

  return { display, spoken };
}

/** Reads a list of sequence terms with a narration-friendly pause marker between each. */
export function formatSequenceForSpeech(terms) {
  return terms.join('... ');
}

// ── Multiple-choice option assembly ─────────────────────────────────────────

/**
 * Builds a 4-option multiple-choice set (1 correct + 3 unique distractors) from a
 * pool of candidate distractor values, formatting each through `formatter`.
 * Falls back to nearby numeric offsets if the candidate pool doesn't yield 3 unique values.
 */
export function buildOptions(correct, candidates, formatter = (v) => String(v)) {
  const seen = new Set([correct]);
  const distractors = [];
  for (const c of shuffleArray(candidates)) {
    if (distractors.length >= 3) break;
    if (seen.has(c)) continue;
    seen.add(c);
    distractors.push(c);
  }
  let fallbackOffset = 1;
  let guard = 0;
  while (distractors.length < 3 && guard < 50) {
    guard++;
    const candidate = correct + fallbackOffset;
    if (!seen.has(candidate) && typeof candidate === 'number') {
      seen.add(candidate);
      distractors.push(candidate);
    }
    fallbackOffset = fallbackOffset > 0 ? -fallbackOffset : -fallbackOffset + 1;
  }
  const all = shuffleArray([correct, ...distractors]);
  return { options: all.map(formatter), correctAnswer: formatter(correct) };
}

/** Builds a 4-option multiple-choice set from already-distinct string/value options
 * (used where the "distractors" are qualitatively different statements, not nearby numbers). */
export function buildOptionsFromValues(correct, distractorValues, formatter = (v) => String(v)) {
  const uniqueDistractors = [];
  const seen = new Set([formatter(correct)]);
  for (const d of shuffleArray(distractorValues)) {
    const f = formatter(d);
    if (seen.has(f)) continue;
    seen.add(f);
    uniqueDistractors.push(d);
    if (uniqueDistractors.length >= 3) break;
  }
  const all = shuffleArray([correct, ...uniqueDistractors]);
  return { options: all.map(formatter), correctAnswer: formatter(correct) };
}
