// src/utils/badgeEngine.js
// Badge definitions and unlock triggers for PatternQuest

export const BADGES = [
  { id: 'first_coin',    icon: '🚩', label: 'First Marker Found',   description: 'Answered your very first trail question correctly!' },
  { id: 'hot_streak',     icon: '🥾', label: 'On the Right Trail',   description: 'Achieved a streak of 5 correct answers!' },
  { id: 'super_streak',   icon: '🔥', label: 'Trailblazing Streak',  description: 'Achieved a 10-question winning streak!' },
  { id: 'change_champ',   icon: '🎒', label: 'Full Gear Pack',       description: 'Completed all 4 interactive simulation stations!' },
  { id: 'district_champ', icon: '⭐', label: 'Basecamp Cleared',     description: 'Scored 3 stars in a Practice World!' },
  { id: 'boss_slayer',    icon: '🏕️', label: 'Obstacle Overcome',    description: 'Defeated a World Boss in battle!' },
  { id: 'century_scorer', icon: '🧭', label: 'Seasoned Trekker',     description: 'Answered over 20 questions in Practice!' },
  { id: 'money_master',   icon: '🏔️', label: 'Summit Reached',       description: 'Completed the full 5-phase PatternQuest journey!' },
];

export function checkBadges(state) {
  const unlocked = [];

  // First correct answer
  const totalCorrect = state.districtCorrect?.reduce((s, c) => s + (c || 0), 0) || 0;
  if (totalCorrect >= 1) unlocked.push('first_coin');

  // Streak checks
  if (state.maxStreak >= 5) unlocked.push('hot_streak');
  if (state.maxStreak >= 10) unlocked.push('super_streak');

  // Simulation completion
  if (state.simStationsComplete && state.simStationsComplete.every(Boolean)) {
    unlocked.push('change_champ');
  }

  // 3-star district check
  if (state.districtScores && state.districtScores.some(score => score !== null && score >= 9)) {
    unlocked.push('district_champ');
  }

  // Seasoned Trekker
  if (state.currentQuestion >= 20 || totalCorrect >= 20) {
    unlocked.push('century_scorer');
  }

  // Boss slayer
  if (state.bossDefeated) {
    unlocked.push('boss_slayer');
  }

  // Full journey
  if (state.phaseComplete && Object.values(state.phaseComplete).every(Boolean)) {
    unlocked.push('money_master');
  }

  return unlocked;
}
