// src/data/storyContent.js
// 4 Real-World Aligned Story Panels for PatternQuest (Grade 7)

export const STORY_PANELS = [
  {
    panel: 0,
    title: 'The Gorge Suspension Bridge 🌉',
    text: "Farhan, Mei Lin, and Chief Engineer Tally stood at the edge of the roaring Echo Gorge. To connect the high-altitude weather station, an automated cantilever crane was assembling a modular steel truss bridge. Each structural bay added interlocking triangular steel beams in a strict linear pattern — 5 struts in the first bay, 9 in the second, 13 in the third, and 17 in the fourth. \u201cWe have to span the full gorge before nightfall,\u201d said Farhan. \u201cShould we walk onto the beams and count every strut?\u201d Tally tapped her telemetry tablet. \u201cNever count one by one. Find the rate of growth — the common difference. Once you have that, the computer can calculate the beams for any span instantly.\u201d",
    highlight: '🌉 5, 9, 13, 17, … steel struts — find the constant difference (d = +4) to predict any bridge span length instantly.',
    character: 'Chief Engineer Tally',
    characterEmoji: '🦉',
    imageBg: 'radial-gradient(circle, #3b82f6 0%, #1e3a8a 100%)',
    imageEmoji: '🌉',
  },
  {
    panel: 1,
    title: 'The Hydro-Pressure Aqueduct 💧',
    text: "Down at the mountain reservoir, water surged through a stepped penstock aqueduct powering the valley turbines. Pressure sensors along the 45 descent checkpoints registered climbing PSI: 14 PSI at Station 1, 20 PSI at Station 2, 26 PSI at Station 3, and 32 PSI at Station 4. Farhan quickly typed into the automated governor valve: \u201cIt starts at 14 and climbs by 6 each time, so the formula is obviously P = 6n + 14!\u201d Mei Lin grabbed his hand before he activated the valve: \u201cWait! Check it against Station 1. If n = 1, your formula gives 6(1) + 14 = 20 PSI — but the actual sensor reads 14 PSI! The formula must match the zero-position: 14 minus 6 = +8. The true general term is P = 6n + 8.\u201d Checking against n = 1 prevented a catastrophic pressure blowout.",
    highlight: '💧 P = 6n + 14 fails at Station 1 (gives 20 PSI, not 14) — the constant is the zero-term (14 − 6 = +8), so P = 6n + 8.',
    character: 'Mei Lin',
    characterEmoji: '👧🏻',
    imageBg: 'radial-gradient(circle, #06b6d4 0%, #0e7490 100%)',
    imageEmoji: '💧',
  },
  {
    panel: 2,
    title: 'The Solar Power Matrix ☀️',
    text: "At basecamp on the snowy plateau, emergency alarms sounded: a Category 4 blizzard was inbound. To keep life-support heaters active, the automated 3D fabricator had to construct expanding hexagonal solar panel rings surrounding the core power battery. Tier 1 used 6 solar panels (18 kW). Tier 2 used 11 panels (33 kW). Tier 3 used 16 panels (48 kW). Tier 4 used 21 panels (63 kW). Mei Lin opened the Expedition Engineering Ledger: \u201cWe need 241 kW of power for the blizzard defense shield, which requires Tier 48. Let's derive the algebraic formula T_n = dn + c so the automated printer manufactures the exact panels without wasting precious titanium!\u201d",
    highlight: '☀️ 6, 11, 16, 21, … panels — derive T_n = 5n + 1 to calculate far-stage power and panel requirements for Tier 48.',
    character: 'Mei Lin & Farhan',
    characterEmoji: '🌟',
    imageBg: 'radial-gradient(circle, #f59e0b 0%, #b45309 100%)',
    imageEmoji: '☀️',
  },
  {
    panel: 3,
    title: 'The Summit Distress Radar 📡',
    text: "At the peak radar observatory, an emergency radio beacon crackled through the blizzard static. The lost mountaineers' transponder transmitted strictly on an arithmetic channel frequency: f_n = 7n + 15 MHz for integer channels n = 1, 2, 3… But a rival surveyor's corrupted log had error-ridden lines, and rogue atmospheric pulses at 162 MHz, 172 MHz, and 195 MHz were flooding the antenna. Tally turned to the crew: \u201cUse sequence membership testing! If 7n + 15 = f yields an exact positive whole number, it's a real human distress signal. If it yields a fraction, it's rogue static. Audit the false log, solve for n, and lock the rescue channel!\u201d",
    highlight: '📡 f_n = 7n + 15 MHz — solve 7n + 15 = f for integer n to verify sequence membership and filter out false signals.',
    character: 'Tally the Owl',
    characterEmoji: '🦉',
    imageBg: 'radial-gradient(circle, #10b981 0%, #047857 100%)',
    imageEmoji: '📡',
  },
];
