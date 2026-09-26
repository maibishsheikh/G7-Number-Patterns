// src/components/simulations/SetTheCheckpoint.jsx
import React, { useState } from 'react';
import './Stations.css';
import { useAudio } from '../../hooks/useAudio.js';

const CHALLENGES = [
  { pos: 5, target: 17, description: 'Tune the formula so it lands exactly on marker 17 at position 5.' },
  { pos: 6, target: 25, description: 'Tune the formula so it lands exactly on marker 25 at position 6.' },
  { pos: 4, target: 3,  description: 'Tune the formula so it lands exactly on marker 3 at position 4.' },
  { pos: 7, target: 34, description: 'Tune the formula so it lands exactly on marker 34 at position 7.' },
];

const COEFF_MIN = 1, COEFF_MAX = 9;
const CONST_MIN = -9, CONST_MAX = 20;

export default function SetTheCheckpoint({ onComplete, audioEnabled }) {
  const { narrate, stopAll, sounds } = useAudio(audioEnabled);
  const [challIdx, setChallIdx] = useState(0);
  const [coefficient, setCoefficient] = useState(1);
  const [constant, setConstant] = useState(0);
  const [success, setSuccess] = useState(false);
  const [shake, setShake] = useState(false);

  const challenge = CHALLENGES[challIdx];
  const computed = coefficient * challenge.pos + constant;
  const isExact = computed === challenge.target;
  const isOver = computed > challenge.target;

  function incCoeff() { if (coefficient < COEFF_MAX && !success) { sounds.click(); setCoefficient((c) => c + 1); } }
  function decCoeff() { if (coefficient > COEFF_MIN && !success) { sounds.click(); setCoefficient((c) => c - 1); } }
  function incConst() { if (constant < CONST_MAX && !success) { sounds.click(); setConstant((c) => c + 1); } }
  function decConst() { if (constant > CONST_MIN && !success) { sounds.click(); setConstant((c) => c - 1); } }

  function handleCheck() {
    if (isExact) {
      setSuccess(true);
      sounds.correct();
      narrate([{ text: `Checkpoint locked in! ${coefficient} times n, ${constant >= 0 ? 'plus' : 'minus'} ${Math.abs(constant)}, lands exactly on ${challenge.target} at position ${challenge.pos}.`, style: 'celebration' }]);
    } else {
      setShake(true);
      sounds.wrong();
      narrate([{ text: isOver ? 'Too high — lower the coefficient or the constant.' : 'Too low — raise the coefficient or the constant.', style: 'encouragement' }]);
      setTimeout(() => setShake(false), 600);
    }
  }

  function newChallenge() {
    stopAll();
    setChallIdx((i) => (i + 1) % CHALLENGES.length);
    setCoefficient(1);
    setConstant(0);
    setSuccess(false);
  }

  return (
    <div className="station-wrap">
      <div className="station-header">
        <h3 className="station-title">🎯 Station B: Set the Checkpoint</h3>
        <div className={`station-target-box ${shake ? 'anim-shake' : ''}`}>
          <span className="station-target-label">Target:</span>
          <span className="station-target-num">Position {challenge.pos} = {challenge.target}</span>
        </div>
      </div>

      <div className="station-grid-2col">
        {/* Left Column: Formula tuner */}
        <div className="station-col-left">
          <p className="station-guide-text" style={{ textAlign: 'left', fontWeight: 700 }}>
            {challenge.description}
          </p>

          <div className="formula-tuner-box">
            <span className="stepper-label">Coefficient (a)</span>
            <div className="stepper-row">
              <button className="stepper-btn" onClick={decCoeff} disabled={success || coefficient <= COEFF_MIN}>−</button>
              <span className="stepper-value">{coefficient}</span>
              <button className="stepper-btn" onClick={incCoeff} disabled={success || coefficient >= COEFF_MAX}>+</button>
            </div>
            <span className="stepper-label">Constant (b)</span>
            <div className="stepper-row">
              <button className="stepper-btn" onClick={decConst} disabled={success || constant <= CONST_MIN}>−</button>
              <span className="stepper-value">{constant}</span>
              <button className="stepper-btn" onClick={incConst} disabled={success || constant >= CONST_MAX}>+</button>
            </div>
            <div className="tuner-preview">
              <span className="coeff">{coefficient}n</span> {constant >= 0 ? '+' : '−'} <span className="const">{Math.abs(constant)}</span>
            </div>
          </div>

          <div className="station-actions">
            <button className="btn-primary" onClick={handleCheck} disabled={success}>Check Checkpoint</button>
            <button className="btn-outline" onClick={newChallenge}>New Target</button>
          </div>
        </div>

        {/* Right Column: Live readout + success panel */}
        <div className="station-col-right">
          <div className="running-ratio-bar">
            <div className={`running-ratio-text ${isExact ? 'exact' : isOver ? 'over' : ''}`}>
              At position {challenge.pos}: {coefficient} × {challenge.pos} {constant >= 0 ? '+' : '−'} {Math.abs(constant)} = {computed}
            </div>
          </div>

          {success ? (
            <div className="station-success anim-bounce-in">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="success-icon">🎉</span>
                <p className="station-success-msg">
                  Checkpoint set! Your formula reaches exactly <strong>{challenge.target}</strong> at position <strong>{challenge.pos}</strong>.
                </p>
              </div>
              <div className="station-success-actions">
                <button className="btn-primary" onClick={newChallenge}>Try Another</button>
                <button className="btn-green" onClick={onComplete}>Complete Station ✓</button>
              </div>
            </div>
          ) : (
            <div className="station-guide-card">
              <span className="station-guide-text">
                Adjust the coefficient and constant with the + / − buttons until the formula lands exactly on the target.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
