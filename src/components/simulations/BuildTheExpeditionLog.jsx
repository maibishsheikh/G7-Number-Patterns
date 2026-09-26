// src/components/simulations/BuildTheExpeditionLog.jsx
// Station C: The Solar Power Matrix Expedition (Grade 7 Real-World Microgrid Engineering)
import React, { useState } from 'react';
import './Stations.css';
import { useAudio } from '../../hooks/useAudio.js';

const MATRIX_PROJECTS = [
  {
    id: 'solar_hex',
    name: 'Basecamp Hexagonal Solar Grid',
    unitName: 'photovoltaic panels',
    hazard: 'Category 4 Blizzard',
    a1: 6,
    d: 5,
    kwPerUnit: 3,
    targetTier: 48,
    targetPanels: 241, // 5*48 + 1
    formulaStr: 'P_n = 5n + 1',
    context: 'Concentric hexagonal solar rings surrounding thermal biodome',
  },
  {
    id: 'avalanche_barrier',
    name: 'Permafrost Avalanche Retaining Wall',
    unitName: 'steel ribs',
    hazard: 'Summit Snowpack Rupture',
    a1: 8,
    d: 6,
    kwPerUnit: 5,
    targetTier: 35,
    targetPanels: 212, // 6*35 + 2
    formulaStr: 'R_n = 6n + 2',
    context: 'Structural rib barriers deflecting high-velocity snow slides',
  },
  {
    id: 'microwave_mesh',
    name: 'Glacier Radio Relay Microwave Mesh',
    unitName: 'repeater nodes',
    hazard: 'Atmospheric Ion Storm',
    a1: 7,
    d: 4,
    kwPerUnit: 2,
    targetTier: 50,
    targetPanels: 203, // 4*50 + 3
    formulaStr: 'M_n = 4n + 3',
    context: 'High-frequency communication mesh linking summit shelters',
  },
];

export default function BuildTheExpeditionLog({ onComplete, audioEnabled }) {
  const { narrate, stopAll, sounds } = useAudio(audioEnabled);
  const [projIdx, setProjIdx] = useState(0);
  const [activeTier, setActiveTier] = useState(1);
  const [activeStep, setActiveStep] = useState(1); // 1, 2, or 3
  const [tier4Input, setTier4Input] = useState('');
  const [tableDone, setTableDone] = useState(false);
  const [dInput, setDInput] = useState('');
  const [cInput, setCInput] = useState('');
  const [formulaDone, setFormulaDone] = useState(false);
  const [targetInput, setTargetInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [fabricating, setFabricating] = useState(false);
  const [success, setSuccess] = useState(false);

  const proj = MATRIX_PROJECTS[projIdx];
  const t1 = proj.a1;
  const t2 = proj.a1 + proj.d;
  const t3 = proj.a1 + 2 * proj.d;
  const t4Correct = proj.a1 + 3 * proj.d;
  const zeroTerm = proj.a1 - proj.d;

  function handleCheckTable() {
    stopAll();
    const val = parseInt(tier4Input, 10);
    if (val === t4Correct) {
      sounds.correct();
      setTableDone(true);
      setActiveStep(2);
      setFeedback({
        type: 'ok',
        text: `TABLE VERIFIED! Tier 4 = ${t4Correct} ${proj.unitName}. Common difference confirmed at d = +${proj.d}.`,
      });
      narrate([{
        text: `Table verified! Tier 4 confirmed at ${t4Correct} panels. Now assemble the general term formula.`,
        style: 'celebration',
      }]);
    } else {
      sounds.wrong();
      setFeedback({
        type: 'err',
        text: `Check Tier 4: Tier 3 has ${t3}. Add the common difference (+${proj.d}).`,
      });
      narrate([{
        text: `Add the common difference to Tier 3 to find Tier 4.`,
        style: 'encouragement',
      }]);
    }
  }

  function handleCheckFormula() {
    stopAll();
    const dVal = parseInt(dInput, 10);
    const cVal = parseInt(cInput, 10);

    if (dVal === proj.d && cVal === zeroTerm) {
      sounds.correct();
      setFormulaDone(true);
      setActiveStep(3);
      setFeedback({
        type: 'ok',
        text: `GENERAL TERM ASSEMBLED! T_n = ${proj.d}n + ${zeroTerm}. Matches Tier 1: ${proj.d}(1) + ${zeroTerm} = ${proj.a1}!`,
      });
      narrate([{
        text: `General term assembled correctly! Now calculate the requirement for Tier ${proj.targetTier} to survive the storm.`,
        style: 'celebration',
      }]);
    } else {
      sounds.wrong();
      setFeedback({
        type: 'err',
        text: `Multiplier is common difference (${proj.d}), constant is Tier 1 minus d (${proj.a1} − ${proj.d} = ${zeroTerm}).`,
      });
      narrate([{
        text: `Check your coefficient and zero-term constant.`,
        style: 'encouragement',
      }]);
    }
  }

  function handleCheckTarget() {
    stopAll();
    const val = parseInt(targetInput, 10);
    if (val === proj.targetPanels) {
      sounds.correct();
      setSuccess(true);
      setFabricating(true);
      setFeedback({
        type: 'ok',
        text: `SHIELD ONLINE! 3D printer manufactured all ${proj.targetPanels} ${proj.unitName} for Tier ${proj.targetTier}! Basecamp protected through ${proj.hazard}!`,
      });
      narrate([{
        text: `Storm defense shield activated! Exactly ${proj.targetPanels} units manufactured. Basecamp safe from the blizzard!`,
        style: 'celebration',
      }]);
      if (sounds.levelUp) setTimeout(() => sounds.levelUp(), 800);
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 3500);
    } else {
      sounds.wrong();
      setFeedback({
        type: 'err',
        text: `Calculate: ${proj.d}(${proj.targetTier}) + ${zeroTerm} = ? Multiply first, then add!`,
      });
      narrate([{
        text: `Multiply ${proj.d} by ${proj.targetTier}, then add ${zeroTerm}.`,
        style: 'encouragement',
      }]);
    }
  }

  function nextProject() {
    stopAll();
    setProjIdx((p) => (p + 1) % MATRIX_PROJECTS.length);
    setActiveTier(1);
    setActiveStep(1);
    setTier4Input('');
    setTableDone(false);
    setDInput('');
    setCInput('');
    setFormulaDone(false);
    setTargetInput('');
    setFeedback(null);
    setFabricating(false);
    setSuccess(false);
  }

  return (
    <div className="station-container">
      {/* Compact Top Header */}
      <div className="station-top-header">
        <div className="station-badge-group">
          <span className="station-pill-label">STATION C · EXPEDITION POWER LEDGER</span>
          <h3 className="station-headline">☀️ {proj.name}</h3>
        </div>
        <div className="station-metric-pill warning-pill">
          <span className="metric-title">HAZARD DEFENSE</span>
          <span className="metric-val">⚠️ {proj.hazard}</span>
        </div>
      </div>

      {/* Main 2-Column Body: Fits in 1 Screen with No Scroll */}
      <div className="station-split-body">
        {/* Left Column: Blueprint Schematic + Preview */}
        <div className="station-left-sim">
          <div className="basecamp-blueprint">
            <svg className="blueprint-svg" viewBox="0 0 260 170">
              <defs>
                <radialGradient id="domeGlowC" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                  <stop offset="70%" stopColor="#f59e0b" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
                </radialGradient>
                <filter id="neonShieldC">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <circle cx="130" cy="85" r="80" fill="none" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
              <circle cx="130" cy="85" r="60" fill="none" stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
              <circle cx="130" cy="85" r="40" fill="none" stroke="rgba(255,255,255,0.1)" strokeDasharray="3 3" />

              {Array.from({ length: fabricating ? 5 : activeTier }).map((_, tierI) => {
                const radius = 24 + tierI * 14;
                const count = proj.a1 + tierI * proj.d;
                const isOuter = tierI === (activeTier - 1) && !fabricating;

                return (
                  <g key={tierI} className={isOuter ? 'tier-ring-pulse' : ''}>
                    {Array.from({ length: Math.min(count, 16) }).map((_, pI) => {
                      const angle = (pI / Math.min(count, 16)) * 2 * Math.PI;
                      const px = 130 + radius * Math.cos(angle);
                      const py = 85 + radius * Math.sin(angle);
                      return (
                        <rect
                          key={pI}
                          x={px - 3.5}
                          y={py - 2.5}
                          width="7"
                          height="5"
                          rx="1"
                          fill={isOuter ? '#10e5a5' : '#38bdf8'}
                          stroke="#0f172a"
                          strokeWidth="0.7"
                          transform={`rotate(${(angle * 180) / Math.PI + 90}, ${px}, ${py})`}
                        />
                      );
                    })}
                  </g>
                );
              })}

              <circle cx="130" cy="85" r="12" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
              <circle cx="130" cy="85" r="8" fill="url(#domeGlowC)" />
              <text x="130" y="88" fill="#f8fafc" fontSize="7" textAnchor="middle" fontWeight="bold">CORE</text>

              {fabricating && (
                <g className="shield-active" filter="url(#neonShieldC)">
                  <circle cx="130" cy="85" r="78" fill="rgba(16, 229, 165, 0.15)" stroke="#10e5a5" strokeWidth="2.5" />
                  <line x1="0" y1="0" x2="130" y2="85" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 2" />
                  <line x1="260" y1="0" x2="130" y2="85" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 2" />
                </g>
              )}
            </svg>

            <div className="tier-selector-mini">
              <span className="tier-sel-lbl">PREVIEW:</span>
              {[1, 2, 3, 4].map((t) => (
                <button
                  key={t}
                  className={`tier-chip-btn ${activeTier === t ? 'active' : ''}`}
                  onClick={() => setActiveTier(t)}
                  disabled={fabricating}
                >
                  Tier {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Guided Active Investigation */}
        <div className="station-right-guided">
          {/* Step Switcher */}
          <div className="guided-step-tabs">
            <button
              className={`step-tab-btn ${activeStep === 1 ? 'active' : ''} ${tableDone ? 'done' : ''}`}
              onClick={() => setActiveStep(1)}
            >
              {tableDone ? '✓' : '1'} Ledger Table
            </button>
            <button
              className={`step-tab-btn ${activeStep === 2 ? 'active' : ''} ${formulaDone ? 'done' : ''}`}
              onClick={() => tableDone && setActiveStep(2)}
              disabled={!tableDone}
            >
              {formulaDone ? '✓' : '2'} General Term
            </button>
            <button
              className={`step-tab-btn ${activeStep === 3 ? 'active' : ''} ${success ? 'done' : ''}`}
              onClick={() => formulaDone && setActiveStep(3)}
              disabled={!formulaDone}
            >
              {success ? '✓' : '3'} Tier {proj.targetTier} Mission
            </button>
          </div>

          {/* Active Step Content */}
          <div className="active-investigation-box">
            {activeStep === 1 && (
              <div className="step-pane">
                <h4 className="step-pane-title">1. Complete Ledger Table for Tier 4</h4>
                <div className="compact-table-wrap">
                  <table className="ledger-table compact">
                    <thead>
                      <tr>
                        <th>Tier</th>
                        <th>Units</th>
                        <th>Step (Δ)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Tier 1</td>
                        <td><strong>{t1}</strong></td>
                        <td><span className="base-badge">Base</span></td>
                      </tr>
                      <tr>
                        <td>Tier 2</td>
                        <td><strong>{t2}</strong></td>
                        <td><span className="delta-badge">+{proj.d}</span></td>
                      </tr>
                      <tr>
                        <td>Tier 3</td>
                        <td><strong>{t3}</strong></td>
                        <td><span className="delta-badge">+{proj.d}</span></td>
                      </tr>
                      <tr className="active-target-row">
                        <td>Tier 4</td>
                        <td>
                          {!tableDone ? (
                            <input
                              type="number"
                              className="table-input-cell"
                              placeholder="?"
                              value={tier4Input}
                              onChange={(e) => setTier4Input(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleCheckTable()}
                            />
                          ) : (
                            <strong className="unit-highlight correct">{t4Correct}</strong>
                          )}
                        </td>
                        <td><span className="delta-badge">+{proj.d}</span></td>
                      </tr>
                    </tbody>
                  </table>
                  {!tableDone && (
                    <button className="btn-action-primary" onClick={handleCheckTable} style={{ marginTop: '8px' }}>
                      Verify Tier 4 Entry
                    </button>
                  )}
                </div>
              </div>
            )}

            {activeStep === 2 && (
              <div className="step-pane">
                <h4 className="step-pane-title">2. Assemble General Term Formula</h4>
                <p className="step-pane-desc">Formula: T_n = dn + c. Multiplier is d, constant is (Tier 1 − d).</p>
                <div className="formula-composer-box">
                  <span className="composer-lead">T_n = </span>
                  <input
                    type="number"
                    className="composer-input"
                    placeholder="d"
                    value={dInput}
                    onChange={(e) => setDInput(e.target.value)}
                  />
                  <span className="composer-var">n +</span>
                  <input
                    type="number"
                    className="composer-input"
                    placeholder="c"
                    value={cInput}
                    onChange={(e) => setCInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCheckFormula()}
                  />
                  <button className="btn-action-primary glow" onClick={handleCheckFormula}>
                    {formulaDone ? 'Locked ✓' : 'Lock Formula'}
                  </button>
                </div>
              </div>
            )}

            {activeStep === 3 && (
              <div className="step-pane">
                <h4 className="step-pane-title">3. Blizzard Survival Mission: Tier {proj.targetTier}</h4>
                <p className="step-pane-desc">Calculate total units needed for Tier {proj.targetTier}:</p>
                <div className="solver-hint-math">
                  <code>Units = {proj.d}({proj.targetTier}) + {zeroTerm} = ?</code>
                </div>
                <div className="flex-input-grp">
                  <input
                    type="number"
                    className="telemetry-input large"
                    placeholder={`Units for Tier ${proj.targetTier}...`}
                    value={targetInput}
                    onChange={(e) => setTargetInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCheckTarget()}
                    disabled={success}
                  />
                  <button className="btn-action-primary glow" onClick={handleCheckTarget} disabled={success}>
                    {success ? 'Shield Online 🏆' : 'Deploy Grid ⚡'}
                  </button>
                </div>
              </div>
            )}

            {/* Instant Feedback Alert */}
            {feedback && (
              <div className={`station-feedback-alert ${feedback.type === 'ok' ? 'alert-success' : 'alert-error'}`}>
                <span className="alert-icon">{feedback.type === 'ok' ? '✨' : '⚠️'}</span>
                <span className="alert-msg">{feedback.text}</span>
              </div>
            )}
          </div>

          {/* Project Switcher */}
          <div className="station-sub-actions">
            <button className="btn-subtle" onClick={nextProject}>
              🔄 Switch Power Project ({proj.name})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
