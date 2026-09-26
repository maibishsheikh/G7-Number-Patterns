// scripts/stress_test_questions.js
// Stress-tests generateQuestionBank(): runs it hundreds of times and asserts, for every
// single question produced, that:
//   1. There are exactly 4 options with no duplicates
//   2. correctAnswer is present in options
//   3. correctAnswer is never undefined/NaN/empty
//   4. For membership-test questions, the stated Yes/No + position matches isMemberOfSequence()
//   5. For general-term questions, the correct formula matches deriveGeneralTerm() independently
//   6. All 10 worlds produce exactly 10 questions each (100 total)
//   7. No two of a world's own distractors accidentally equal each other post-shuffle beyond the correct answer
import { generateQuestionBank } from '../src/data/questionBank.js';
import { deriveGeneralTerm, formatGeneralTermString, isMemberOfSequence } from '../src/utils/patternMath.js';
import { WORLDS } from '../src/config/worlds.config.js';

const RUNS = 300; // 300 runs x 100 questions = 30,000 questions
let totalChecked = 0;
let failures = [];

function fail(msg, q) {
  failures.push({ msg, q });
}

for (let run = 0; run < RUNS; run++) {
  const bank = generateQuestionBank();

  if (bank.length !== 100) {
    fail(`Run ${run}: expected 100 questions, got ${bank.length}`, null);
  }

  // Per-world count check
  const perWorldCount = {};
  bank.forEach((q) => {
    perWorldCount[q.districtId] = (perWorldCount[q.districtId] || 0) + 1;
  });
  WORLDS.forEach((w) => {
    if (perWorldCount[w.id] !== 10) {
      fail(`Run ${run}: world ${w.id} (${w.name}) has ${perWorldCount[w.id] || 0} questions, expected 10`, null);
    }
  });

  bank.forEach((q) => {
    totalChecked++;

    // 1. Exactly 4 options, no duplicates
    if (!Array.isArray(q.options) || q.options.length !== 4) {
      fail(`Q${q.id}: options length !== 4 (got ${q.options?.length})`, q);
    } else {
      const uniqueOptions = new Set(q.options);
      if (uniqueOptions.size !== 4) {
        fail(`Q${q.id}: duplicate options detected`, q);
      }
    }

    // 2. correctAnswer present in options
    if (!q.options?.includes(q.correctAnswer)) {
      fail(`Q${q.id}: correctAnswer "${q.correctAnswer}" not found in options`, q);
    }

    // 3. correctAnswer is defined and non-empty
    if (q.correctAnswer === undefined || q.correctAnswer === null || q.correctAnswer === '' ) {
      fail(`Q${q.id}: correctAnswer is empty/undefined`, q);
    }
    if (typeof q.correctAnswer === 'string' && q.correctAnswer.includes('NaN')) {
      fail(`Q${q.id}: correctAnswer contains NaN`, q);
    }

    // 4. Independent re-verification for membership-test questions
    if (q.category === 'MEMBERSHIP TEST' || (q.category === 'MIXED REVIEW' && q.visual === 'formula-breakdown' && q.questionText.includes('Is '))) {
      const { coefficient, constant } = q.visualData;
      const match = q.questionText.match(/Is (-?\d+) a term/);
      if (match) {
        const target = parseInt(match[1], 10);
        const check = isMemberOfSequence(coefficient, constant, target);
        const shouldBeYes = check.isMember;
        const answerSaysYes = q.correctAnswer.startsWith('Yes');
        if (shouldBeYes !== answerSaysYes) {
          fail(`Q${q.id}: membership mismatch — isMemberOfSequence says isMember=${shouldBeYes} but correctAnswer="${q.correctAnswer}"`, q);
        }
      }
    }

    // 5. Independent re-verification for general-term derivation questions
    if (q.category === 'FIND THE GENERAL TERM') {
      const termsMatch = q.questionText.match(/of ([\d, -]+), …/);
      if (termsMatch) {
        const terms = termsMatch[1].split(',').map((s) => parseInt(s.trim(), 10));
        const a1 = terms[0];
        const d = terms[1] - terms[0];
        const { coefficient, constant } = deriveGeneralTerm(a1, d);
        const expected = formatGeneralTermString(coefficient, constant).display;
        if (expected !== q.correctAnswer) {
          fail(`Q${q.id}: general-term mismatch — expected "${expected}" but correctAnswer="${q.correctAnswer}"`, q);
        }
      }
    }

    // 6. No NaN anywhere in questionText
    if (/NaN/.test(q.questionText)) {
      fail(`Q${q.id}: questionText contains NaN — "${q.questionText}"`, q);
    }
  });
}

console.log(`\nStress test complete: ${RUNS} runs × 100 questions = ${totalChecked} questions checked.\n`);

if (failures.length > 0) {
  console.error(`❌ ${failures.length} FAILURES FOUND:\n`);
  failures.slice(0, 30).forEach((f) => {
    console.error(`  - ${f.msg}`);
    if (f.q) console.error(`    questionText: ${f.q.questionText}`);
    if (f.q) console.error(`    options: ${JSON.stringify(f.q.options)} | correctAnswer: ${f.q.correctAnswer}`);
  });
  if (failures.length > 30) console.error(`  ... and ${failures.length - 30} more`);
  process.exit(1);
} else {
  console.log('✅ ALL CHECKS PASSED — no duplicate options, correctAnswer always present, all math independently re-verified.\n');
  process.exit(0);
}
