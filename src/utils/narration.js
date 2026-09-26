// src/utils/narration.js
// Narration script builder for PatternQuest
// Follows PRD §11 audio rules: "nth term" always spoken in full as "the en-th term";
// general term formulas read left-to-right as "[coefficient] times n, plus [constant]";
// "common difference" always spoken in full; named sequences always spoken in full;
// sequence terms read with a clear pause between each; term-to-term vs. position-to-term
// rules always named explicitly, never conflated.

export const say       = (text) => ({ text, style: 'statement' });
export const ask       = (text) => ({ text, style: 'question' });
export const cheer     = (text) => ({ text, style: 'celebration' });
export const emphasize = (text) => ({ text, style: 'emphasis' });
export const think     = (text) => ({ text, style: 'thinking' });
export const instruct  = (text) => ({ text, style: 'instruction' });
export const encourage = (text) => ({ text, style: 'encouragement' });

export function wonderNarration() {
  return [
    say("Welcome to PatternQuest! A trail has numbered markers: three... seven... eleven... fifteen..."),
    say("The trail keeps going, but the expedition needs to know where marker fifty is — right now, without walking there."),
    ask("Can you crack the rule?"),
    cheer("Let's investigate how number patterns work!"),
  ];
}

export function storyNarration(panel) {
  const scripts = [
    [
      say("Farhan, Mei Lin, and Chief Engineer Tally stood at the edge of the roaring Echo Gorge."),
      say("An automated cantilever crane was assembling a modular steel truss bridge — 5 struts in the first bay, 9 in the second, 13 in the third, and 17 in the fourth."),
      think("We have to span the full gorge before nightfall, said Farhan. Should we walk onto the beams and count every strut?"),
      say("Tally tapped her tablet. Never count one by one. Find the constant rate of growth — the common difference. Once you have that, the computer can calculate the beams for any span instantly."),
    ],
    [
      say("Down at the reservoir, water surged through a stepped penstock aqueduct powering the valley turbines."),
      say("Pressure sensors along the checkpoints registered climbing PSI: 14 PSI at Station 1, 20 PSI at Station 2, 26 PSI at Station 3, and 32 PSI at Station 4."),
      think("Farhan typed P equals 6n plus 14 into the valve controller. But Mei Lin checked Station 1: 6 times 1 plus 14 is 20 — but the sensor reads 14!"),
      emphasize("The constant must be the zero-term: 14 minus 6 equals positive 8. The true general term is P equals 6n plus 8."),
    ],
    [
      say("At basecamp on the snowy plateau, emergency alarms sounded: a blizzard was inbound."),
      say("To power the thermal defense shield, the automated 3D fabricator had to manufacture expanding hexagonal solar arrays: 6 panels in Tier 1, 11 in Tier 2, 16 in Tier 3, and 21 in Tier 4."),
      emphasize("Mei Lin opened the engineering ledger: We need 241 kilowatts for Tier 48. Let's derive the algebraic formula T sub n equals 5n plus 1 to fabricate the exact solar grid."),
    ],
    [
      say("At the summit radar tower, an emergency radio beacon crackled through the blizzard static."),
      say("The lost mountaineers' transponder transmitted strictly on an arithmetic channel frequency: f sub n equals 7n plus 15 megahertz."),
      instruct("Tally issued the final directive: Use sequence membership testing! If 7n plus 15 equals f yields an exact positive whole number, it's a real distress signal. Audit the rival's false log, solve for n, and lock the rescue channel!"),
    ],
  ];

  return scripts[panel] || scripts[0];
}

export function simStationIntro(stationIdx) {
  const intros = [
    [
      instruct("Welcome to Station A: The Gorge Suspension Bridge Strut Lab!"),
      instruct("Inspect the cantilever bridge expansion and observe the rate of increase. Find the common difference in steel struts and engineer the full gorge span!"),
    ],
    [
      instruct("Welcome to Station B: The Hydro-Pressure Aqueduct Governor!"),
      instruct("Inspect the water pressure across descending checkpoints. Calibrate the rate and zero-term offset to prevent a pressure blowout at Station 35!"),
    ],
    [
      instruct("Welcome to Station C: The Solar Power Matrix Expedition!"),
      instruct("Construct the engineering ledger table, synthesize the algebraic general term, and calculate the exact panel count needed for blizzard survival at Tier 48!"),
    ],
    [
      instruct("Welcome to Station D: The Summit Radar Distress Lock!"),
      instruct("Audit the rival's corrupted telemetry log and use sequence membership testing to identify the true emergency channel among atmospheric static!"),
    ],
  ];

  return intros[stationIdx] || intros[0];
}

export function playQuestionNarration(questionText) {
  return [
    ask(questionText)
  ];
}

export function playCorrectNarration(streak = 1) {
  if (streak >= 5) {
    return [cheer("Incredible streak! You are unstoppable! 🔥")];
  }
  if (streak >= 3) {
    return [cheer("Awesome! Three in a row! ⭐")];
  }
  return [cheer("Spot on! That's correct! 🎉")];
}

export function playWrongNarration() {
  return [
    think("Not quite — check the hint, and try again! 💡")
  ];
}

export function playHint1Narration() {
  return [
    encourage("Here's your first hint! Look for the common difference first.")
  ];
}

export function playHint2Narration() {
  return [
    encourage("Here's your final clue! Check your formula against the first term before trusting it.")
  ];
}

export function districtCompleteNarration() {
  return [
    cheer("World Complete! Spectacular job on this stretch of trail! 🌟")
  ];
}

export function bossStartNarration() {
  return [
    emphasize("The Boss Battle begins! Answer correctly to defeat the boss and claim your badge!")
  ];
}

export function bossWinNarration() {
  return [
    cheer("Victory! You defeated the boss and claimed the World Badge! 👑")
  ];
}

export function reflectNarration() {
  return [
    say("Welcome to the Reflect Phase! Let's review the key pattern concepts and check your scorecard! 📓")
  ];
}

export function reflectCompleteNarration() {
  return [
    cheer("Outstanding! You have mastered number patterns, the term-to-term rule, and the general term! You are a true Expedition Champion! 🏆")
  ];
}
