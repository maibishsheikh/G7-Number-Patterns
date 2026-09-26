// src/components/simulations/GrowingTrailLab.jsx
import React, { useState } from 'react';
import './Stations.css';
import { useAudio } from '../../hooks/useAudio.js';

const ROUNDS = [
  { a1: 2, d: 3, label: 'Ranger Trail',  description: 'Step forward along the Ranger Trail and watch the markers grow. Find the common difference!' },
  { a1: 5, d: 4, label: 'River Trail',   description: 'Step forward along the River Trail and watch the markers grow. Find the common difference!' },
  { a1: 1, d: 6, label: 'Peak Trail',    description: 'Step forward along the Peak Trail and watch the markers grow. Find the common difference!' },
  { a1: 8, d: 2, label: 'Valley Trail',  description: 'Step forward along the Valley Trail and watch the markers grow. Find the common difference!' },
];

const MAX_STAGE = 6;

export default function GrowingTrailLab({ onComplete, audioEnabled }) {
  const { narrate, stopAll, sounds } = useAudio(audioEnabled);
  const [roundIdx, setRoundIdx] = useState(0);
  const [stage, setStage] = useState(1);
  const [guess, setGuess] = useState(1);
  const [success, setSuccess] = useState(false);
  const [shake, setShake] = useState(false);

  const round = ROUNDS[roundIdx];
  const terms = Array.from({ length: stage }, (_, i) => round.a1 + i * round.d);

  function stepForward() {
    if (stage >= MAX_STAGE) return;
    sounds.click();
    setStage((s) => s + 1);
  }

  function stepBack() {
    if (stage <= 1) return;
    sounds.click();
    setStage((s) => s - 1);
  }

  function incGuess() {
    if (guess >= 15 || success) return;
    sounds.click();
    setGuess((g) => g + 1);
  }

  function decGuess() {
    if (guess <= 1 || success) return;
    sounds.click();
    setGuess((g) => g - 1);
  }

  function handleCheck() {
    if (guess === round.d) {
      setSuccess(true);
      sounds.correct();
      narrate([{ text: `Exactly right! The common difference is ${round.d} — each marker is ${round.d} more than the last.`, style: 'celebration' }]);
    } else {
      setShake(true);
      sounds.wrong();
      narrate([{ text: 'Not quite — step through a few more markers and compare each one to the marker right before it.', style: 'encouragement' }]);
      setTimeout(() => setShake(false), 600);
    }
  }

  function newRound() {
    stopAll();
    setRoundIdx((i) => (i + 1) % ROUNDS.length);
    setStage(1);
    setGuess(1);
    setSuccess(false);
  }

  return (
    <div className="station-wrap">
      <div className="station-header">
        <h3 className="station-title">🧭 Station A: The Growing Trail</h3>
        <div className={`station-target-box ${shake ? 'anim-shake' : ''}`}>
          <span className="station-target-label">Find:</span>
          <span className="station-target-num">Common Difference</span>
        </div>
      </div>

      <div className="station-grid-2col">
        {/* Left Column: Stepper controls */}
        <div className="station-col-left">
          <p className="station-guide-text" style={{ textAlign: 'left', fontWeight: 700 }}>
            {round.description}
          </p>

          <div className="stepper-row">
            <button className="stepper-btn" onClick={stepBack} disabled={stage <= 1} aria-label="Show one fewer marker">−</button>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span className="stepper-value">{stage}</span>
              <span className="stepper-label">markers shown</span>
            </div>
            <button className="stepper-btn" onClick={stepForward} disabled={stage >= MAX_STAGE} aria-label="Show one more marker">+</button>
          </div>

          <div className="station-actions">
            <button className="btn-outline" onClick={newRound}>New Trail</button>
          </div>
        </div>

        {/* Right Column: Growing marker strip + answer stepper */}
        <div className="station-col-right">
          <div className="trail-marker-strip">
            {terms.map((t, i) => (
              <div key={i} className="trail-marker-chip">
                <span className={`trail-marker-post ${i === terms.length - 1 ? 'current' : ''}`}>{t}</span>
                <span className="trail-marker-pos">#{i + 1}</span>
              </div>
            ))}
          </div>

          {success ? (
            <div className="station-success anim-bounce-in">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="success-icon">🎉</span>
                <p className="station-success-msg">
                  The {round.label} climbs by <strong>{round.d}</strong> every step — that's the common difference!
                </p>
              </div>
              <div className="station-success-actions">
                <button className="btn-primary" onClick={newRound}>Try Another</button>
                <button className="btn-green" onClick={onComplete}>Complete Station ✓</button>
              </div>
            </div>
          ) : (
            <>
              <div className="stepper-row">
                <button className="stepper-btn" onClick={decGuess} disabled={guess <= 1}>−</button>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span className="stepper-value">{guess}</span>
                  <span className="stepper-label">your guess</span>
                </div>
                <button className="stepper-btn" onClick={incGuess} disabled={guess >= 15}>+</button>
              </div>
              <div className="station-actions">
                <button className="btn-primary" onClick={handleCheck}>Check Difference</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
