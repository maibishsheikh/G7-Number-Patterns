// src/components/gamification/KingdomMap.jsx
import React from 'react';
import './KingdomMap.css';
import StarRating from './StarRating.jsx';
import { calcStars } from '../../utils/scoring.js';
import { DISTRICTS } from '../../data/questionBank.js';

export default function KingdomMap({
  districtScores = [],
  districtCorrect = [],
  currentDistrict = 0,
  onSelectDistrict,
}) {
  return (
    <div className="worlds-grid">
      {DISTRICTS.map((dist, idx) => {
        const isCurrent = idx === currentDistrict;
        const isCompleted = districtScores?.[idx] !== null && districtScores?.[idx] !== undefined;
        // Need 4/10 correct in previous world to unlock, or world 0 is always unlocked
        const prevCompleted =
          idx === 0 ||
          (districtScores?.[idx - 1] !== null && (districtScores?.[idx - 1] ?? 0) >= 4) ||
          (districtCorrect?.[idx - 1] ?? 0) >= 4;
        const isUnlocked = idx <= currentDistrict || isCompleted || prevCompleted;
        const correct = districtCorrect?.[idx] || (districtScores?.[idx] ?? 0);
        const stars = isCompleted ? calcStars(districtScores[idx]) : 0;
        const startQ = idx * 10 + 1;
        const endQ = (idx + 1) * 10;

        return (
          <div
            key={dist.id}
            className={`world-card ${isCurrent ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${!isUnlocked ? 'locked' : ''}`}
            onClick={() => isUnlocked && onSelectDistrict && onSelectDistrict(idx)}
            role="button"
            tabIndex={isUnlocked ? 0 : -1}
          >
            {/* Top row: W1 and Q1-10 */}
            <div className="world-card-top">
              <span className="world-num-badge">W{idx + 1}</span>
              <span className="world-q-range">Q{startQ}–{endQ}</span>
            </div>

            {/* Center icon */}
            <div className="world-card-center">
              {isUnlocked ? (
                isCurrent ? (
                  <div className="world-target-ring-icon">
                    <svg width="42" height="42" viewBox="0 0 42 42">
                      <circle cx="21" cy="21" r="19" fill="none" stroke="#00f2a9" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.45" />
                      <circle cx="21" cy="21" r="13" fill="none" stroke="#00f2a9" strokeWidth="2.2" opacity="0.8" />
                      <circle cx="21" cy="21" r="6.5" fill="none" stroke="#00f2a9" strokeWidth="2.8" />
                      <circle cx="21" cy="21" r="2.2" fill="#00f2a9" />
                    </svg>
                  </div>
                ) : isCompleted ? (
                  <div className="world-completed-stars">
                    <StarRating stars={stars} size="sm" />
                  </div>
                ) : (
                  <div className="world-unlocked-icon">
                    <span className="world-emoji-glyph">{dist.icon}</span>
                  </div>
                )
              ) : (
                <div className="world-lock-icon">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="3" ry="3" fill="rgba(245, 158, 11, 0.2)" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
              )}
            </div>

            {/* Bottom info */}
            <div className="world-card-bottom">
              <span className="world-name-title" title={dist.name}>{dist.name}</span>
              {isUnlocked ? (
                isCurrent ? (
                  <span className="world-play-action">Play →</span>
                ) : isCompleted ? (
                  <span className="world-replay-action">{correct}/10 · Replay</span>
                ) : (
                  <span className="world-play-action">Play →</span>
                )
              ) : (
                <span className="world-locked-label">Locked</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
