// src/components/IntroScreen.jsx
import React from 'react';
import './IntroScreen.css';
import { generateSessionQuestions } from '../utils/shuffle.js';
import questionBank from '../data/questionBank.js';

const JOURNEY = [
  { num: '01', icon: '🔍', label: 'Wonder',   desc: 'Pattern puzzle' },
  { num: '02', icon: '📖', label: 'Story',    desc: "Alpine expedition" },
  { num: '03', icon: '✏️', label: 'Simulate', desc: '4 engineering labs' },
  { num: '04', icon: '🎮', label: 'Practice', desc: '10 themed worlds' },
  { num: '05', icon: '📓', label: 'Reflect',  desc: 'Trophy & scorecard' },
];

export default function IntroScreen({ state, dispatch }) {
  const hasSaved = state?.phaseComplete && Object.values(state.phaseComplete).some(Boolean);

  function startFresh() {
    dispatch({ type: 'LOAD_QUESTIONS', payload: generateSessionQuestions(questionBank) });
    dispatch({ type: 'SET_PHASE', payload: 'wonder' });
  }

  function resumeSession() {
    dispatch({ type: 'SET_PHASE', payload: state.savedPhase || 'wonder' });
  }

  return (
    <div className="intro-wrap">
      {/* Top Badge */}
      <div className="intro-top-badge">
        ✨ Curriculum · Number Patterns &amp; Sequences · Grade 7 / Secondary 1
      </div>

      {/* Main Title */}
      <h1 className="intro-title">
        <span className="text-orange">Pattern</span> <span className="text-white">Quest</span>
      </h1>
      <h2 className="intro-subtitle">Master Linear Patterns, Common Differences &amp; the General Term</h2>

      {/* Mascot Row */}
      <div className="intro-mascot-row">
        <div className="intro-mascot-circle">🦉</div>
        <div className="intro-speech-bubble">
          Hoo-hoo! I'm Chief Engineer Tally. Ready to bridge the gorge, calibrate the hydro turbines, and find the general term? 🧭🗺️
        </div>
      </div>

      {/* Description */}
      <p className="intro-desc">
        Investigate growing figure patterns, discover the common difference, master the zero-term offset, and derive the algebraic general term ($T_n = dn + c$) to conquer real-world expedition challenges!
      </p>

      {/* Journey Card (Single Sleek Row) */}
      <div className="journey-card">
        <div className="journey-card-title">YOUR LEARNING EXPEDITION · CLICK ANY PHASE TO JUMP IN</div>

        <div className="journey-steps-container">
          {JOURNEY.map((j, i) => (
            <React.Fragment key={j.num}>
              <div
                className="journey-step-item clickable-step"
                onClick={() => dispatch({ type: 'SET_PHASE', payload: j.label.toLowerCase() === 'practice' ? 'play' : j.label.toLowerCase() })}
                role="button"
                tabIndex={0}
                title={`Click to open ${j.label} phase`}
              >
                <span className="journey-icon-circle">{j.icon}</span>
                <div className="journey-text-col">
                  <span className="journey-item-title">{j.label}</span>
                  <span className="journey-item-desc">{j.desc}</span>
                </div>
              </div>
              {i < JOURNEY.length - 1 && <span className="journey-arrow">→</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Primary Actions */}
      <div className="intro-ctas">
        <button className="btn-primary intro-cta-main" onClick={startFresh}>
          🚀 Begin Your Expedition!
        </button>
        {hasSaved && (
          <button className="btn-outline intro-cta-resume" onClick={resumeSession}>
            ↩ Resume Session
          </button>
        )}
      </div>

      {/* Bottom Feature Badges */}
      <div className="intro-bottom-cards">
        <div className="bottom-card">
          <span className="bottom-card-icon">🎯</span>
          <span>100 Quest Challenges</span>
        </div>
        <div className="bottom-card">
          <span className="bottom-card-icon">🌉</span>
          <span>4 Engineering Simulations</span>
        </div>
        <div className="bottom-card">
          <span className="bottom-card-icon">👑</span>
          <span>10 World Boss Battles</span>
        </div>
      </div>
    </div>
  );
}
