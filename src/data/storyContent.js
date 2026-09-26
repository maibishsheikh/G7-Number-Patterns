// src/data/storyContent.js
// 4 Story Panels for PatternQuest

export const STORY_PANELS = [
  {
    panel: 0,
    title: 'The Missing Markers 🌫️',
    text: "Farhan and Mei Lin met Tally the Owl at the start of a long mountain trail. Numbered posts marked the way — 3, 7, 11, 15 — but the trail curved off into the mist, and half the markers ahead were missing or worn away. \u201cWe need to reach marker fifty before sundown,\u201d said Mei Lin, squinting down the path. \u201cWe can't walk the whole trail counting every post.\u201d Tally the Owl tilted her head. \u201cThen don't count. Find the rule.\u201d",
    highlight: '🌫️ 3, 7, 11, 15, … — what comes next, and how far to marker 50?',
    character: 'Tally the Owl',
    characterEmoji: '🦉',
    imageBg: 'radial-gradient(circle, #8D99AE 0%, #4a5568 100%)',
    imageEmoji: '🌫️',
  },
  {
    panel: 1,
    title: 'Naming the Rule 🗣️',
    text: "Farhan spotted it fast: \u201cEach marker is four more than the last — 3, then 7, then 11.\u201d \u201cThat's the term-to-term rule,\u201d Tally explained, perching on the signpost. \u201cIt tells you what to do to get from one marker to the next. But if I asked you for marker fifty, would you really add four, forty-nine times?\u201d Mei Lin shook her head. \u201cThere has to be a shortcut — a formula that works for any position at once.\u201d \u201cExactly,\u201d said Tally. \u201cThat's the position-to-term rule — the general term.\u201d",
    highlight: '🗣️ Term-to-term rule (add 4 each time) vs. position-to-term rule (a formula for any marker)',
    character: 'Tally the Owl',
    characterEmoji: '🦉',
    imageBg: 'radial-gradient(circle, #4C956C 0%, #2f5f45 100%)',
    imageEmoji: '🗣️',
  },
  {
    panel: 2,
    title: 'The Shortcut Formula 🗺️',
    text: "At the map table, Farhan scribbled fast: \u201cWe add 4 each time, and we started at 3 — so the formula must be 4n plus 3!\u201d Mei Lin frowned and checked it against marker one. \u201cHold on. Put n equals 1 into your formula: 4 times 1 plus 3 is 7 — but the very first marker was 3, not 7.\u201d Farhan paused. \u201cThe common difference gives you the 4 — the times-n part. But the plus-3 isn't the difference, it's whatever makes the formula land on marker one exactly.\u201d Checking against n = 1 caught the mistake before it went any further.",
    highlight: '🗺️ 4n + 3 fails at n = 1 (gives 7, not 3) — always check the constant against the first marker',
    character: 'Mei Lin',
    characterEmoji: '👧🏻',
    imageBg: 'radial-gradient(circle, #2A9D8F 0%, #1c6f65 100%)',
    imageEmoji: '🗺️',
  },
  {
    panel: 3,
    title: 'Finding Marker Fifty ⛰️',
    text: "With the corrected formula, nth term equals 4n minus 1, the trio put it to the test. \u201cMarker fifty,\u201d said Farhan, \u201cis 4 times 50, minus 1 — one hundred and ninety-nine.\u201d Mei Lin checked it against the early markers one more time, and it matched every single one. Tally the Owl swooped ahead and landed right beside a weathered post reading 199. \u201cThe expedition can push on,\u201d she called back. \u201cYou didn't need to count a single step past marker four.\u201d",
    highlight: '⛰️ nth term = 4n − 1 → marker 50 = 4(50) − 1 = 199, verified and confirmed',
    character: 'Farhan & Mei Lin',
    characterEmoji: '🌟',
    imageBg: 'radial-gradient(circle, #588157 0%, #33502f 100%)',
    imageEmoji: '⛰️',
  },
];
