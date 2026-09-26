// src/components/simulations/BuildTheExpeditionLog.jsx
import React, { useState } from 'react';
import './Stations.css';
import { useAudio } from '../../hooks/useAudio.js';

const ROUNDS = [
  { a1: 3, d: 5, farStage: 12, context: 'Trail marker count' },
  { a1: 7, d: 4, farStage: 15, context: 'Tents pitched' },
  { a1: 2, d: 6, farStage: 10, context: 'Signal flags planted' },
];

export default function BuildTheExpeditionLog({ onComplete, audioEnabled }) {
  const { narrate, stopAll, sounds } = useAudio(audioEnabled);
  const [roundIdx, setRoundIdx] = useState(0);
  const [step, setStep] = useState(1); // 1: table, 2: formula, 3: apply
  const [stage4Input, setStage4Input] = useState('');
  const [coeffInput, setCoeffInput] = useState('');
  const [constInput, setConstInput] = useState('');
  const [farInput, setFarInput] = useState('');
  const [feedback, setFeedback] = useState(null); // { field, ok }
  const [success, setSuccess] = useState(false);

  const round = ROUNDS[roundIdx];
  const stage1 = round.a1;
  const stage2 = round.a1 + round.d;
  const stage3 = round.a1 + 2 * round.d;
  const stage4Correct = round.a1 + 3 * round.d;
  const coeffCorrect = round.d;
  const constCorrect = round.a1 - round.d;
  const farCorrect = coeffCorrect * round.farStage + constCorrect;

  function checkStage4() {
    if (parseInt(stage4Input, 10) === stage4Correct) {
      sounds.correct();
      setFeedback({ field: 'stage4', ok: true });
      narrate([{ text: `Correct! Stage 4 is ${stage4Correct}.`, style: 'celebration' }]);
      setTimeout(() => { setStep(2); setFeedback(null); }, 700);
    } else {
      sounds.wrong();
      setFeedback({ field: 'stage4', ok: false });
      narrate([{ text: 'Not quite — check the common difference between the stages shown.', style: 'encouragement' }]);
    }
  }

  function checkFormula() {
    if (parseInt(coeffInput, 10) === coeffCorrect && parseInt(constInput, 10) === constCorrect) {
      sounds.correct();
      setFeedback({ field: 'formula', ok: true });
      narrate([{ text: 'General term assembled correctly!', style: 'celebration' }]);
      setTimeout(() => { setStep(3); setFeedback(null); }, 700);
    } else {
      sounds.wrong();
      setFeedback({ field: 'formula', ok: false });
      narrate([{ text: 'Check your formula against Stage 1 before moving on — does it land exactly on the first stage?', style: 'encouragement' }]);
    }
  }

  function checkFar() {
    if (parseInt(farInput, 10) === farCorrect) {
      sounds.correct();
      setSuccess(true);
      narrate([{ text: `Expedition log complete! Stage ${round.farStage} is ${farCorrect}.`, style: 'celebration' }]);
    } else {
      sounds.wrong();
      setFeedback({ field: 'far', ok: false });
      narrate([{ text: 'Substitute the far stage number directly into your formula.', style: 'encouragement' }]);
    }
  }

  function newRound() {
    stopAll();
    setRoundIdx((i) => (i + 1) % ROUNDS.length);
    setStep(1);
    setStage4Input('');
    setCoeffInput('');
    setConstInput('');
    setFarInput('');
    setFeedback(null);
    setSuccess(false);
  }

  return (
    <div className="station-wrap">
      <div className="station-header">
        <h3 className="station-title">📓 Station C: Build the Expedition Log</h3>
        <div className="station-target-box">
          <span className="station-target-label">Step</span>
          <span className="station-target-num">{step} / 3</span>
        </div>
      </div>

      <div className="station-grid-2col">
        {/* Left Column: Position-to-term table */}
        <div className="station-col-left">
          <p className="station-guide-text" style={{ textAlign: 'left', fontWeight: 700 }}>
            {round.context}: {stage1}, {stage2}, {stage3}, …
          </p>

          <div className="log-table">
            <div className="log-row"><span className="log-cell">Stage 1</span><span className="log-cell">{stage1}</span></div>
            <div className="log-row"><span className="log-cell">Stage 2</span><span className="log-cell">{stage2}</span></div>
            <div className="log-row"><span className="log-cell">Stage 3</span><span className="log-cell">{stage3}</span></div>
            <div className="log-row">
              <span className="log-cell">Stage 4</span>
              <input
                className={`log-input ${feedback?.field === 'stage4' ? (feedback.ok ? 'correct-input' : 'wrong-input') : ''}`}
                type="number"
                inputMode="numeric"
                value={stage4Input}
                onChange={(e) => setStage4Input(e.target.value)}
                disabled={step > 1}
                placeholder="?"
                aria-label="Stage 4 value"
              />
            </div>
          </div>

          {step === 1 && (
            <div className="station-actions">
              <button className="btn-primary" onClick={checkStage4} disabled={stage4Input === ''}>Check Stage 4</button>
            </div>
          )}
          {step > 1 && (
            <div className="station-actions">
              <button className="btn-outline" onClick={newRound}>New Log</button>
            </div>
          )}
        </div>

        {/* Right Column: Formula assembly + far-stage application */}
        <div className="station-col-right">
          {step === 1 && (
            <div className="station-guide-card">
              <span className="station-guide-text">Find the pattern in the stages shown, then fill in Stage 4.</span>
            </div>
          )}

          {step >= 2 && !success && (
            <div className="formula-tuner-box">
              <span className="stepper-label">Assemble the general term: coefficient × n + constant</span>
              <div className="tuner-line">
                <input
                  className={`log-input ${feedback?.field === 'formula' ? (feedback.ok ? 'correct-input' : 'wrong-input') : ''}`}
                  style={{ maxWidth: '70px' }}
                  type="number"
                  inputMode="numeric"
                  value={coeffInput}
                  onChange={(e) => setCoeffInput(e.target.value)}
                  placeholder="a"
                  disabled={step > 2}
                  aria-label="Coefficient"
                />
                <span className="stepper-value" style={{ fontSize: '1rem' }}>n +</span>
                <input
                  className={`log-input ${feedback?.field === 'formula' ? (feedback.ok ? 'correct-input' : 'wrong-input') : ''}`}
                  style={{ maxWidth: '70px' }}
                  type="number"
                  inputMode="numeric"
                  value={constInput}
                  onChange={(e) => setConstInput(e.target.value)}
                  placeholder="b"
                  disabled={step > 2}
                  aria-label="Constant"
                />
              </div>
              {step === 2 && (
                <div className="station-actions">
                  <button className="btn-primary" onClick={checkFormula} disabled={coeffInput === '' || constInput === ''}>Check Formula</button>
                </div>
              )}
            </div>
          )}

          {step >= 3 && !success && (
            <div className="formula-tuner-box">
              <span className="stepper-label">Apply it: how many at Stage {round.farStage}?</span>
              <input
                className={`log-input ${feedback?.field === 'far' ? (feedback.ok ? 'correct-input' : 'wrong-input') : ''}`}
                type="number"
                inputMode="numeric"
                value={farInput}
                onChange={(e) => setFarInput(e.target.value)}
                placeholder="?"
                aria-label="Value at far stage"
              />
              <div className="station-actions">
                <button className="btn-primary" onClick={checkFar} disabled={farInput === ''}>Check Final Answer</button>
              </div>
            </div>
          )}

          {success && (
            <div className="station-success anim-bounce-in">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="success-icon">🎉</span>
                <p className="station-success-msg">
                  Log complete! General term: {coeffCorrect}n {constCorrect >= 0 ? '+' : '−'} {Math.abs(constCorrect)}. Stage {round.farStage} = {farCorrect}.
                </p>
              </div>
              <div className="station-success-actions">
                <button className="btn-primary" onClick={newRound}>Try Another</button>
                <button className="btn-green" onClick={onComplete}>Complete Station ✓</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
