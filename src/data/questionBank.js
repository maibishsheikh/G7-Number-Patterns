// src/data/questionBank.js
// 100 Procedurally Generated Questions for PatternQuest across 10 Themed Worlds (Grade 7 / Secondary 1)
// Each world's questions are generated fresh from data/patternMath.js's curated "clean number" helpers —
// never hardcoded — so every session sees a different, mathematically-verified set of trail challenges.

import { WORLDS } from '../config/worlds.config.js';
import {
  randInt,
  ordinal,
  pickCleanCommonDifference,
  pickCleanFirstTerm,
  generateLinearSequence,
  deriveGeneralTerm,
  findTermAtPosition,
  isMemberOfSequence,
  firstTermAsConstantMistake,
  SPECIAL_SEQUENCE_KINDS,
  generateSpecialSequence,
  specialSequenceTermAt,
  pickFigureArchetype,
  generateFigurePattern,
  formatGeneralTermString,
  buildOptions,
  buildOptionsFromValues,
} from '../utils/patternMath.js';

export const DISTRICTS = WORLDS.map((w) => ({
  id: w.id,
  name: w.name,
  icon: w.emoji,
  boss: w.boss,
}));

// Sequences most commonly confused with each other (used to build realistic distractors)
const CONFUSABLE_KIND = {
  square: ['triangular', 'cube'],
  triangular: ['square', 'cube'],
  cube: ['square', 'triangular'],
  even: ['odd'],
  odd: ['even'],
};

// ───────────────────────── World 0 — Continue the Pattern ─────────────────────────
function genContinuePattern() {
  const a1 = pickCleanFirstTerm(1, 25);
  const d = pickCleanCommonDifference(false);
  const shown = generateLinearSequence(a1, d, 4);
  const correct = shown[3] + d;
  const candidates = [correct - 1, correct + 1, shown[3] + d - 2, shown[3] + d + 2, shown[3]];
  const { options, correctAnswer } = buildOptions(correct, candidates, String);

  return {
    category: 'CONTINUE PATTERN',
    visual: 'sequence-strip',
    questionText: `Continue the pattern: ${shown.join(', ')}, ___`,
    options,
    correctAnswer,
    explanation: `The common difference is ${d} — each term is ${d} more than the one before it. ${shown[3]} + ${d} = ${correct}.`,
    hint1: `Look at how much each marker increases from the one before it.`,
    hint2: `Each step adds ${d}. The last marker shown is ${shown[3]}, so add ${d} once more: ${shown[3]} + ${d} = ?`,
    visualData: { terms: [...shown, '?'], startPosition: 1 },
  };
}

// ───────────────────────── World 1 — Describe the Rule in Words ───────────────────
function genDescribeRuleWords() {
  const allowNeg = Math.random() < 0.35;
  const a1 = pickCleanFirstTerm(3, 30);
  const d = pickCleanCommonDifference(allowNeg);
  const shown = generateLinearSequence(a1, d, 4);
  const verb = d >= 0 ? 'Add' : 'Subtract';
  const mag = Math.abs(d);
  const correct = `${verb} ${mag} each time`;

  const wrongMag1 = mag === 1 ? mag + 1 : mag - 1;
  const wrongMag2 = mag + 2;
  const oppositeVerb = d >= 0 ? 'Subtract' : 'Add';
  const distractors = [
    `${verb} ${wrongMag1} each time`,
    `${verb} ${wrongMag2} each time`,
    `${oppositeVerb} ${mag} each time`,
    `Multiply by ${Math.max(2, mag)} each time`,
  ];
  const { options, correctAnswer } = buildOptionsFromValues(correct, distractors, String);

  return {
    category: 'DESCRIBE THE RULE',
    visual: 'sequence-strip',
    questionText: `Which describes the term-to-term rule for ${shown.join(', ')}, …?`,
    options,
    correctAnswer,
    explanation: `Each term is ${mag} ${d >= 0 ? 'more' : 'less'} than the one before it, so the rule is "${correct}." This is the term-to-term rule — what you do to get from one marker to the next, not a formula for any position.`,
    hint1: `Compare each term to the one right before it — is the trail climbing or dropping, and by how much?`,
    hint2: `${shown[0]} to ${shown[1]} changes by ${d}. That's the amount added (or subtracted) every single step.`,
    visualData: { terms: shown, startPosition: 1 },
  };
}

// ───────────────────────── World 2 — Special Landmarks (named sequences) ──────────
function genSpecialSequence() {
  const kind = SPECIAL_SEQUENCE_KINDS[randInt(0, SPECIAL_SEQUENCE_KINDS.length - 1)];
  const maxN = kind === 'cube' ? 8 : kind === 'square' || kind === 'triangular' ? 12 : 20;
  const n = randInt(4, maxN);
  const correct = specialSequenceTermAt(kind, n);
  const { terms: firstFew } = generateSpecialSequence(kind, 5);

  const candidates = [
    ...CONFUSABLE_KIND[kind].map((k) => specialSequenceTermAt(k, n)),
    specialSequenceTermAt(kind, n - 1),
    specialSequenceTermAt(kind, n + 1),
  ];
  const { options, correctAnswer } = buildOptions(correct, candidates, String);

  const FORMULA_EXPLAIN = {
    even: `Even numbers follow 2n. 2 × ${n} = ${correct}.`,
    odd: `Odd numbers follow 2n − 1. 2 × ${n} − 1 = ${correct}.`,
    square: `Square numbers follow n². ${n}² = ${correct}.`,
    triangular: `Triangular numbers follow n(n + 1) ÷ 2. ${n} × ${n + 1} ÷ 2 = ${correct}.`,
    cube: `Cube numbers follow n³. ${n}³ = ${correct}.`,
  };

  return {
    category: 'SPECIAL SEQUENCE',
    visual: 'named-sequence-icon',
    questionText: `What is the ${ordinal(n)} ${kind} number?`,
    options,
    correctAnswer,
    explanation: FORMULA_EXPLAIN[kind],
    hint1: `List the first few ${kind} numbers: ${firstFew.join(', ')}, … and see the pattern.`,
    hint2: FORMULA_EXPLAIN[kind],
    visualData: { kind, n, terms: firstFew },
  };
}

// ───────────────────────── World 3 — Mapping the Rule (derive general term) ───────
function genDeriveGeneralTerm() {
  const a1 = pickCleanFirstTerm(1, 20);
  const d = pickCleanCommonDifference(false);
  const shown = generateLinearSequence(a1, d, 4);
  const { coefficient, constant } = deriveGeneralTerm(a1, d);
  const correctStr = formatGeneralTermString(coefficient, constant).display;

  const mistake = firstTermAsConstantMistake(a1, d);
  const mistakeStr = formatGeneralTermString(mistake.coefficient, mistake.constant).display;
  // Avoid the constant-offset distractor accidentally landing on the same value as the
  // "used a1 directly as constant" mistake above (only possible when d === 1, since
  // mistake.constant = a1 = constant + d).
  let deltaConst = Math.random() < 0.5 ? 1 : -1;
  if (d === 1 && deltaConst === 1) deltaConst = -1;
  const offConst = formatGeneralTermString(coefficient, constant + deltaConst).display;
  // Always +1 (never -1) so this never produces a coefficient of 0 ("0n"), which isn't
  // a meaningful distractor and can't happen here since coefficient (= d) is always >= 1.
  const offCoeff = formatGeneralTermString(coefficient + 1, constant).display;

  const { options, correctAnswer } = buildOptionsFromValues(correctStr, [mistakeStr, offConst, offCoeff], String);

  return {
    category: 'FIND THE GENERAL TERM',
    visual: 'sequence-strip',
    questionText: `Find the nth term of ${shown.join(', ')}, …`,
    options,
    correctAnswer,
    explanation: `The common difference is ${d}, so the coefficient of n is ${d}. Checking against n = 1: it must give exactly the first term, ${a1} — not just use ${a1} directly as the constant. So the constant is ${constant}, and the nth term is ${correctAnswer}.`,
    hint1: `Find the common difference first — that becomes the coefficient of n.`,
    hint2: `Check your formula against n = 1. If it doesn't land exactly on the first term (${a1}), your constant is wrong.`,
    visualData: { terms: shown, startPosition: 1 },
  };
}

// ───────────────────────── World 4 — The Far Checkpoint (apply general term) ──────
function genFarCheckpoint() {
  const d = pickCleanCommonDifference(false);
  const a1 = pickCleanFirstTerm(1, 15);
  const { coefficient, constant } = deriveGeneralTerm(a1, d);
  const n = randInt(40, 99);
  const correct = findTermAtPosition(coefficient, constant, n);
  const formula = formatGeneralTermString(coefficient, constant).display;

  const candidates = [
    coefficient * n,
    findTermAtPosition(coefficient, constant, n - 1),
    findTermAtPosition(coefficient, constant, n + 1),
  ];
  const { options, correctAnswer } = buildOptions(correct, candidates, String);

  return {
    category: 'FAR CHECKPOINT',
    visual: 'formula-breakdown',
    questionText: `A sequence has nth term ${formula}. Find the ${ordinal(n)} term.`,
    options,
    correctAnswer,
    explanation: `Substitute n = ${n} into the formula: ${coefficient} × ${n} ${constant >= 0 ? '+' : '−'} ${Math.abs(constant)} = ${correct}.`,
    hint1: `Substitute n = ${n} directly into the formula — no need to list every term in between.`,
    hint2: `${coefficient} × ${n} = ${coefficient * n}, then ${constant >= 0 ? `add ${constant}` : `subtract ${Math.abs(constant)}`}.`,
    visualData: { coefficient, constant },
  };
}

// ───────────────────────── World 5 — Is It on the Trail? (membership test) ────────
function genMembershipTest() {
  const d = pickCleanCommonDifference(false);
  const a1 = pickCleanFirstTerm(1, 15);
  const { coefficient, constant } = deriveGeneralTerm(a1, d);
  const formula = formatGeneralTermString(coefficient, constant).display;
  const isMemberCase = coefficient === 1 ? true : Math.random() < 0.5;

  let target, correct, distractorPool;
  if (isMemberCase) {
    const n = randInt(5, 25);
    target = findTermAtPosition(coefficient, constant, n);
    correct = `Yes — it's the ${ordinal(n)} term`;
    distractorPool = [
      'No — it is not a term in this sequence',
      `Yes — it's the ${ordinal(n + 1)} term`,
      `Yes — it's the ${ordinal(Math.max(1, n - 1))} term`,
    ];
  } else {
    // Deterministically guaranteed non-member (coefficient > 1 here, so this is safe):
    // pick a real term at stage k, then add a remainder in [1, coefficient - 1] so
    // (target - constant) is never evenly divisible by coefficient.
    const k = randInt(5, 20);
    const remainder = randInt(1, coefficient - 1);
    target = findTermAtPosition(coefficient, constant, k) + remainder;
    correct = 'No — it is not a term in this sequence';
    let n1 = randInt(5, 20);
    let n2 = randInt(5, 20);
    while (n2 === n1) n2 = randInt(5, 20);
    distractorPool = [
      `Yes — it's the ${ordinal(n1)} term`,
      `Yes — it's the ${ordinal(n2)} term`,
      'Yes — it is a term in this sequence',
    ];
  }

  const { options, correctAnswer } = buildOptionsFromValues(correct, distractorPool, String);
  const check = isMemberOfSequence(coefficient, constant, target);

  return {
    category: 'MEMBERSHIP TEST',
    visual: 'formula-breakdown',
    questionText: `A sequence has nth term ${formula}. Is ${target} a term in this sequence?`,
    options,
    correctAnswer,
    explanation: check.isMember
      ? `Solve ${formula} = ${target} for n: n = ${check.position}, a positive whole number — so yes, it's the ${ordinal(check.position)} term.`
      : `Solving ${formula} = ${target} for n does not give a positive whole number, so ${target} is not a term in this sequence.`,
    hint1: `Set the formula equal to ${target} and solve for n.`,
    hint2: `n must come out as a positive whole number for ${target} to actually be a term on the trail.`,
    visualData: { coefficient, constant },
  };
}

// ───────────────────────── World 6 — Building the Campsite (figure → apply) ───────
function genFigurePatternLinear() {
  const archetype = pickFigureArchetype();
  const pattern = generateFigurePattern(archetype, 3);
  const { coefficient, constant } = pattern;
  const targetStage = randInt(8, 15);
  const correct = findTermAtPosition(coefficient, constant, targetStage);

  const candidates = [
    coefficient * targetStage,
    findTermAtPosition(coefficient, constant, targetStage - 1),
    findTermAtPosition(coefficient, constant, targetStage + 1),
  ];
  const { options, correctAnswer } = buildOptions(correct, candidates, String);

  const stagesText = pattern.stages.map((s) => `Stage ${s.stage} has ${s.count}`).join(', ');

  return {
    category: 'FIGURE PATTERN',
    visual: 'figure-grid',
    questionText: `A campsite grows: ${stagesText} ${archetype.label}. How many ${archetype.label} are there at Stage ${targetStage}?`,
    options,
    correctAnswer,
    explanation: `The pattern's nth term is ${formatGeneralTermString(coefficient, constant).display}. At Stage ${targetStage}: ${coefficient} × ${targetStage} ${constant >= 0 ? '+' : '−'} ${Math.abs(constant)} = ${correct}.`,
    hint1: `Find the general term from the stages shown first.`,
    hint2: `Once you have the formula, substitute Stage ${targetStage} directly — don't count stage by stage.`,
    visualData: { stages: pattern.stages, dotEmoji: archetype.dotEmoji, label: archetype.label },
  };
}

// ───────────────────────── World 7 — The Growing Staircase (figure → derive) ──────
function genFigurePatternApplied() {
  const archetype = pickFigureArchetype();
  const pattern = generateFigurePattern(archetype, 4);
  const { coefficient, constant } = pattern;
  const correctStr = formatGeneralTermString(coefficient, constant).display;

  const mistake = firstTermAsConstantMistake(pattern.a1, pattern.d);
  const mistakeStr = formatGeneralTermString(mistake.coefficient, mistake.constant).display;
  let deltaConst = Math.random() < 0.5 ? 1 : -1;
  if (pattern.d === 1 && deltaConst === 1) deltaConst = -1;
  const offConst = formatGeneralTermString(coefficient, constant + deltaConst).display;
  const offCoeff = formatGeneralTermString(coefficient + 1, constant).display;

  const { options, correctAnswer } = buildOptionsFromValues(correctStr, [mistakeStr, offConst, offCoeff], String);
  const stagesText = pattern.stages.map((s) => `Stage ${s.stage}: ${s.count}`).join(', ');

  return {
    category: 'FIGURE PATTERN',
    visual: 'figure-grid',
    questionText: `A staircase pattern grows — ${stagesText} (${archetype.label}). Find its general term.`,
    options,
    correctAnswer,
    explanation: `The common difference between stages is ${pattern.d}, so the coefficient is ${pattern.d}. Checking against Stage 1 (${pattern.a1}) — not just using it directly — gives the constant ${constant}. The general term is ${correctAnswer}.`,
    hint1: `Find how much the count grows by each stage — that's the coefficient.`,
    hint2: `Check your formula against Stage 1 exactly, rather than using Stage 1's count directly as the constant.`,
    visualData: { stages: pattern.stages, dotEmoji: archetype.dotEmoji, label: archetype.label },
  };
}

// ───────────────────────── World 8 — Expedition Countdown (multi-step) ────────────
function genMultiStepPrediction() {
  const a1 = pickCleanFirstTerm(2, 15);
  const d = pickCleanCommonDifference(false);
  const n = randInt(6, 15);
  const { coefficient, constant } = deriveGeneralTerm(a1, d);
  const target = findTermAtPosition(coefficient, constant, n);

  const candidates = [n - 1, n + 1, Math.round(target / d), Math.round((target - a1) / d) || n + 2];
  const { options, correctAnswer } = buildOptions(n, candidates, (v) => `Day ${v}`);

  return {
    category: 'MULTI-STEP PREDICTION',
    visual: 'sequence-strip',
    questionText: `Trail checkpoints start at marker ${a1} and increase by ${d} markers per day of hiking. On which day does the expedition reach marker ${target}?`,
    options,
    correctAnswer,
    explanation: `The nth term is ${formatGeneralTermString(coefficient, constant).display}. Solve ${coefficient}n ${constant >= 0 ? '+' : '−'} ${Math.abs(constant)} = ${target} for n: n = ${n}, so it's Day ${n}.`,
    hint1: `Write the general term for the checkpoint markers first.`,
    hint2: `Set the formula equal to ${target} and solve for n — that's the day number.`,
    visualData: { terms: generateLinearSequence(a1, d, 4), startPosition: 1 },
  };
}

// ───────────────────────── World 9 — The Summit Challenge (mixed review) ──────────
const ALL_GENERATORS = [
  genContinuePattern,
  genDescribeRuleWords,
  genSpecialSequence,
  genDeriveGeneralTerm,
  genFarCheckpoint,
  genMembershipTest,
  genFigurePatternLinear,
  genFigurePatternApplied,
  genMultiStepPrediction,
];

function genMixedReview(indexInWorld) {
  const generator = ALL_GENERATORS[indexInWorld % ALL_GENERATORS.length];
  const q = generator();
  return { ...q, category: 'MIXED REVIEW' };
}

// ───────────────────────── Assembly ─────────────────────────

const WORLD_GENERATORS = {
  'continue-pattern': genContinuePattern,
  'describe-rule-words': genDescribeRuleWords,
  'special-sequences': genSpecialSequence,
  'derive-general-term': genDeriveGeneralTerm,
  'apply-general-term-find-term': genFarCheckpoint,
  'test-membership': genMembershipTest,
  'figure-pattern-linear': genFigurePatternLinear,
  'figure-pattern-applied': genFigurePatternApplied,
  'multi-step-applied-prediction': genMultiStepPrediction,
};

/** Generates a fresh, fully randomized 100-question bank (10 worlds × 10 questions). Pure —
 * safe to call repeatedly (used by the stress-test script to generate thousands of runs). */
export function generateQuestionBank() {
  const questions = [];
  let id = 1;
  WORLDS.forEach((world) => {
    for (let i = 0; i < 10; i++) {
      const q =
        world.conceptFocus === 'mixed-review' ? genMixedReview(i) : WORLD_GENERATORS[world.conceptFocus]();
      questions.push({ id, districtId: world.id, ...q });
      id++;
    }
  });
  return questions;
}

const questionBank = generateQuestionBank();
export default questionBank;
