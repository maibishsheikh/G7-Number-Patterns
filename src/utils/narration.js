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
      say("Farhan and Mei Lin met Tally the Owl at the start of a long mountain trail."),
      say("Numbered posts marked the way — three... seven... eleven... fifteen — but the trail curved off into the mist, and half the markers ahead were missing."),
      think("We need to reach marker fifty before sundown, said Mei Lin. We can't walk the whole trail counting every post."),
      say("Tally the Owl tilted her head. Then don't count. Find the rule."),
    ],
    [
      say("Farhan spotted it fast: each marker is four more than the last — three, then seven, then eleven."),
      say("That's the term-to-term rule, Tally explained. It tells you what to do to get from one marker to the next."),
      ask("But if I asked you for marker fifty, would you really add four, forty-nine times?"),
      say("Mei Lin shook her head. There has to be a shortcut — a formula that works for any position at once."),
      emphasize("Exactly, said Tally. That's the position-to-term rule — the general term."),
    ],
    [
      say("At the map table, Farhan scribbled fast: we add four each time, and we started at three — so the formula must be four times n, plus three!"),
      say("Mei Lin frowned and checked it against marker one. Hold on. Put n equals one into your formula: four times one, plus three, is seven — but the very first marker was three, not seven."),
      think("Farhan paused. The common difference gives you the four — the times-n part. But the plus-three isn't the common difference, it's whatever makes the formula land on marker one exactly."),
      emphasize("Checking against n equals one caught the mistake before it went any further."),
    ],
    [
      say("With the corrected formula, the en-th term equals four times n, minus one, the trio put it to the test."),
      say("Marker fifty, said Farhan, is four times fifty, minus one — one hundred and ninety-nine."),
      say("Mei Lin checked it against the early markers one more time, and it matched every single one."),
      cheer("Tally the Owl swooped ahead and landed right beside a weathered post reading one hundred and ninety-nine. The expedition can push on, she called back. You didn't need to count a single step past marker four."),
    ],
  ];

  return scripts[panel] || scripts[0];
}

export function simStationIntro(stationIdx) {
  const intros = [
    [
      instruct("Welcome to The Growing Trail — a Concept Discovery Lab!"),
      instruct("Step the position forward and watch the trail pattern grow. Notice the constant amount added between each step — that's the common difference."),
    ],
    [
      instruct("Welcome to Set the Checkpoint — a Build-to-Target Challenge!"),
      instruct("Tune the coefficient and the constant until your formula, a times n plus b, lands exactly on the target value at the target position."),
    ],
    [
      instruct("Welcome to Build the Expedition Log — a Multi-Step Construction!"),
      instruct("Fill in the position-to-term table for the growing figure, assemble the general term from the coefficient and constant, then apply it to a far stage."),
    ],
    [
      instruct("Welcome to Spot the False Trail Marker — an Error Detective challenge!"),
      instruct("A rival trekker's worked solution contains one mistake. Tap the line that's wrong, then supply the correction."),
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
