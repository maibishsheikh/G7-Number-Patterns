// src/components/simulations/SpotTheFalseMarker.jsx
import React, { useState } from 'react';
import './Stations.css';
import { useAudio } from '../../hooks/useAudio.js';

const ERROR_SCENARIOS = [
  {
    id: 0,
    problem: "Rival's Log: 4, 9, 14, 19, … — Find the 10th term",
    steps: [
      { text: 'Common difference = 9 − 4 = 5', isError: false },
      { text: 'General term: nth term = 5n + 4', isError: true, errorReason: 'Using 4 (the first term) directly as the constant is wrong. Checking n = 1: 5(1) + 4 = 9, not 4 — it fails. The correct constant is 4 − 5 = −1, so the general term is 5n − 1.' },
      { text: '10th term = 5(10) + 4 = 54', isError: false },
    ],
    correctSolution: 'nth term = 5n − 1, so the 10th term = 5(10) − 1 = 49',
  },
  {
    id: 1,
    problem: 'Rival\'s Log: nth term = 6n − 2 — Find the 20th term',
    steps: [
      { text: 'Common difference = 6, constant = −2, so nth term = 6n − 2', isError: false },
      { text: 'Substitute n = 20: 6 × 20 = 120', isError: false },
      { text: '20th term = 120', isError: true, errorReason: 'This forgot to apply the constant after multiplying. 6(20) − 2 = 118, not 120.' },
    ],
    correctSolution: '20th term = 6(20) − 2 = 118 (not 120!)',
  },
  {
    id: 2,
    problem: 'Rival\'s Log: nth term = 3n + 2 — Is 51 a term in this sequence?',
    steps: [
      { text: 'Set 3n + 2 = 51', isError: false },
      { text: 'Solve: n = 49 ÷ 3 ≈ 16.33', isError: false },
      { text: "Round to n = 16, so 51 IS a term in the sequence", isError: true, errorReason: 'n must come out as an exact positive whole number — rounding is not allowed. Since 49 ÷ 3 is not a whole number, 51 is NOT a term in this sequence.' },
    ],
    correctSolution: '49 ÷ 3 is not a whole number, so 51 is NOT a term (not "Yes"!)',
  },
];

export default function SpotTheFalseMarker({ onComplete, audioEnabled }) {
  const { narrate, stopAll, sounds } = useAudio(audioEnabled);
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [selectedStep, setSelectedStep] = useState(null);
  const [success, setSuccess] = useState(false);

  const scenario = ERROR_SCENARIOS[scenarioIdx] || ERROR_SCENARIOS[0];

  function handleSelectStep(stepIndex) {
    if (success) return;
    const step = scenario.steps[stepIndex];
    setSelectedStep(stepIndex);

    if (step.isError) {
      setSuccess(true);
      sounds.correct();
      narrate([{ text: 'Spot on! You found the false trail marker!', style: 'celebration' }]);
    } else {
      sounds.wrong();
      narrate([{ text: 'That line checks out! Inspect the other lines carefully.', style: 'encouragement' }]);
    }
  }

  function nextScenario() {
    stopAll();
    setScenarioIdx((s) => (s + 1) % ERROR_SCENARIOS.length);
    setSelectedStep(null);
    setSuccess(false);
  }

  return (
    <div className="station-wrap">
      {/* Header */}
      <div className="station-header">
        <h3 className="station-title">🔎 Station D: Spot the False Trail Marker</h3>
        <div className="station-target-box">
          <span className="station-target-label">Case:</span>
          <span className="station-target-num">{scenario.problem.split('—')[0]}</span>
        </div>
      </div>

      <div className="station-grid-2col">
        {/* Left Column: Worked-solution line steps & actions */}
        <div className="station-col-left">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <p className="station-guide-text" style={{ textAlign: 'left', fontWeight: 700 }}>
              A rival trekker's worked solution has a mistake. Tap the <strong>incorrect line</strong>:
            </p>

            <div className="spot-steps-list">
              {scenario.steps.map((step, idx) => {
                const isSelected = selectedStep === idx;
                return (
                  <div
                    key={idx}
                    className={`spot-step-card ${isSelected && step.isError ? 'selected-error' : ''} ${isSelected && !step.isError ? 'selected-correct-step' : ''}`}
                    onClick={() => handleSelectStep(idx)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Line ${idx + 1}: ${step.text}`}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', flex: 1, minWidth: 0 }}>
                      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--gold)', fontSize: '0.95rem', flexShrink: 0 }}>
                        Line {idx + 1}:
                      </span>
                      <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 'clamp(0.92rem, 1.1vw, 1.05rem)', color: '#ffffff', wordBreak: 'break-word', lineHeight: 1.35 }}>
                        {step.text}
                      </span>
                    </div>
                    {isSelected && step.isError && <span style={{ fontSize: '1.3rem', lineHeight: 1, flexShrink: 0 }}>🎯</span>}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="station-actions">
            <button className="btn-outline" onClick={nextScenario}>
              Next Case
            </button>
          </div>
        </div>

        {/* Right Column: Diagnosis, solution & success panel */}
        <div className="station-col-right">
          {success && selectedStep !== null ? (
            <div className="station-success anim-bounce-in">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="success-icon">💡</span>
                <p className="station-success-msg">
                  <strong>Mistake Found:</strong> {scenario.steps[selectedStep].errorReason}
                </p>
              </div>
              <div style={{ background: 'rgba(34, 197, 94, 0.18)', border: '1.5px solid rgba(34, 197, 94, 0.4)', borderRadius: '12px', padding: '10px 14px', width: '100%' }}>
                <span style={{ color: '#86efac', fontWeight: 800, fontSize: 'clamp(0.92rem, 1.1vw, 1.02rem)' }}>
                  Correct Solution: {scenario.correctSolution}
                </span>
              </div>
              <div className="station-success-actions">
                <button className="btn-primary" onClick={nextScenario}>
                  Try Another Case
                </button>
                <button className="btn-green" onClick={onComplete}>
                  Complete Station ✓
                </button>
              </div>
            </div>
          ) : (
            <div className="station-guide-card" style={{ height: '100%' }}>
              <span style={{ fontSize: '2.2rem', marginBottom: '4px' }}>🧐</span>
              <span className="station-guide-text">
                Inspect each line: verify the common difference, the constant, and the substitution to catch the rival's error!
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
