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
    targetKW: 723,
    formulaStr: 'P_n = 5n + 1',
    context: 'Concentric hexagonal solar array rings surrounding emergency thermal biodome',
  },
  {
    id: 'avalanche_barrier',
    name: 'Permafrost Avalanche Retaining Wall',
    unitName: 'reinforced steel ribs',
    hazard: 'Summit Snowpack Rupture',
    a1: 8,
    d: 6,
    kwPerUnit: 5,
    targetTier: 35,
    targetPanels: 212, // 6*35 + 2
    targetKW: 1060,
    formulaStr: 'R_n = 6n + 2',
    context: 'Interlocking structural rib barriers deflecting high-velocity snow slides',
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
    targetKW: 406,
    formulaStr: 'M_n = 4n + 3',
    context: 'High-frequency communication mesh linking remote mountain rescue shelters',
  },
];

export default function BuildTheExpeditionLog({ onComplete, audioEnabled }) {
  const { narrate, stopAll, sounds } = useAudio(audioEnabled);
  const [projIdx, setProjIdx] = useState(0);
  const [activeTier, setActiveTier] = useState(1);
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
      setFeedback({
        type: 'ok',
        text: `TABLE VERIFIED! Tier 4 = ${t4Correct} ${proj.unitName}. Telemetry confirms constant difference d = +${proj.d}.`,
      });
      narrate([{
        text: `Table verified! Tier 4 confirmed at ${t4Correct} panels. Now assemble the general term formula.`,
        style: 'celebration',
      }]);
    } else {
      sounds.wrong();
      setFeedback({
        type: 'err',
        text: `Check Tier 4: Tier 3 has ${t3}. Add the common difference (+${proj.d}) to get Tier 4.`,
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
      setFeedback({
        type: 'ok',
        text: `GENERAL TERM ASSEMBLED! T_n = ${proj.d}n + ${zeroTerm}. Checked at n = 1: ${proj.d}(1) + ${zeroTerm} = ${proj.a1}. Matches Tier 1!`,
      });
      narrate([{
        text: `General term assembled correctly! Now calculate the requirement for Tier ${proj.targetTier} to survive the storm.`,
        style: 'celebration',
      }]);
    } else {
      sounds.wrong();
      setFeedback({
        type: 'err',
        text: `Formula mismatch. The multiplier is the common difference (${proj.d}), and the constant is Tier 1 minus d (${proj.a1} − ${proj.d} = ${zeroTerm}).`,
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
        text: `STORM DEFENSE SHIELD ACTIVATED! 3D printer produced all ${proj.targetPanels} ${proj.unitName} for Tier ${proj.targetTier}! Basecamp fully powered through ${proj.hazard}!`,
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
        text: `Calculation error: For Tier ${proj.targetTier}, compute ${proj.d}(${proj.targetTier}) + ${zeroTerm}. Multiply ${proj.d} × ${proj.targetTier} first!`,
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
      {/* Station Header */}
      <div className="station-top-header">
        <div className="station-badge-group">
          <span className="station-pill-label">STATION C · EXPEDITION POWER LEDGER</span>
          <h3 className="station-headline">☀️ {proj.name}</h3>
          <p className="station-subtext">{proj.context}</p>
        </div>
        <div className="station-metric-pill warning-pill">
          <span className="metric-title">ENVIRONMENTAL HAZARD</span>
          <span className="metric-val">⚠️ {proj.hazard}</span>
        </div>
      </div>

      {/* Interactive Blueprint Viewport */}
      <div className="solar-matrix-viewport">
        {/* Visual Hexagonal Basecamp Blueprint */}
        <div className="basecamp-blueprint">
          <svg className="blueprint-svg" viewBox="0 0 280 200">
            <defs>
              <radialGradient id="domeGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                <stop offset="70%" stopColor="#f59e0b" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
              </radialGradient>
              <filter id="neonShield">
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Snow Ground Grid */}
            <circle cx="140" cy="100" r="95" fill="none" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
            <circle cx="140" cy="100" r="75" fill="none" stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
            <circle cx="140" cy="100" r="50" fill="none" stroke="rgba(255,255,255,0.1)" strokeDasharray="3 3" />
            <circle cx="140" cy="100" r="28" fill="none" stroke="rgba(255,255,255,0.12)" strokeDasharray="3 3" />

            {/* Concentric Hexagonal Arrays for current active tier */}
            {Array.from({ length: fabricating ? 5 : activeTier }).map((_, tierI) => {
              const radius = 28 + tierI * 16;
              const count = proj.a1 + tierI * proj.d;
              const isOuter = tierI === (activeTier - 1) && !fabricating;

              return (
                <g key={tierI} className={isOuter ? 'tier-ring-pulse' : ''}>
                  {Array.from({ length: Math.min(count, 18) }).map((_, pI) => {
                    const angle = (pI / Math.min(count, 18)) * 2 * Math.PI;
                    const px = 140 + radius * Math.cos(angle);
                    const py = 100 + radius * Math.sin(angle);
                    return (
                      <rect
                        key={pI}
                        x={px - 4}
                        y={py - 3}
                        width="8"
                        height="6"
                        rx="1"
                        fill={isOuter ? '#10e5a5' : '#38bdf8'}
                        stroke="#0f172a"
                        strokeWidth="0.8"
                        transform={`rotate(${(angle * 180) / Math.PI + 90}, ${px}, ${py})`}
                      />
                    );
                  })}
                </g>
              );
            })}

            {/* Central Biodome Core */}
            <circle cx="140" cy="100" r="14" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
            <circle cx="140" cy="100" r="10" fill="url(#domeGlow)" />
            <text x="140" y="103" fill="#f8fafc" fontSize="8" textAnchor="middle" fontWeight="bold">CORE</text>

            {/* 3D Fabricator Laser & Forcefield on Success */}
            {fabricating && (
              <g className="shield-active" filter="url(#neonShield)">
                <circle cx="140" cy="100" r="92" fill="rgba(16, 229, 165, 0.15)" stroke="#10e5a5" strokeWidth="3" />
                <line x1="0" y1="0" x2="140" y2="100" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 2" />
                <line x1="280" y1="0" x2="140" y2="100" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 2" />
              </g>
            )}
          </svg>

          {/* Tier preview stepper */}
          <div className="tier-selector-mini">
            <span className="tier-sel-lbl">PREVIEW TIER:</span>
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

        {/* Live Expedition Ledger Table */}
        <div className="expedition-ledger-box">
          <div className="ledger-header">
            <span className="ledger-title">📓 EXPEDITION ENGINEERING LEDGER</span>
            <span className="ledger-delta-badge">Δ = +{proj.d} {proj.unitName}/tier</span>
          </div>

          <table className="ledger-table">
            <thead>
              <tr>
                <th>Tier (n)</th>
                <th>Units Required</th>
                <th>Step Increase (Δ)</th>
                <th>Power Output</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Tier 1</strong></td>
                <td><span className="unit-highlight">{t1}</span></td>
                <td><span className="base-badge">First Term</span></td>
                <td>{t1 * proj.kwPerUnit} kW</td>
              </tr>
              <tr>
                <td><strong>Tier 2</strong></td>
                <td><span className="unit-highlight">{t2}</span></td>
                <td><span className="delta-badge">+{proj.d}</span></td>
                <td>{t2 * proj.kwPerUnit} kW</td>
              </tr>
              <tr>
                <td><strong>Tier 3</strong></td>
                <td><span className="unit-highlight">{t3}</span></td>
                <td><span className="delta-badge">+{proj.d}</span></td>
                <td>{t3 * proj.kwPerUnit} kW</td>
              </tr>
              <tr className="active-target-row">
                <td><strong>Tier 4</strong></td>
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
                <td>{t4Correct * proj.kwPerUnit} kW</td>
              </tr>
            </tbody>
          </table>

          {!tableDone && (
            <div className="table-action-footer">
              <button className="btn-action-primary" onClick={handleCheckTable}>
                Verify Tier 4 Entry
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Guided Engineering Investigation Controls */}
      <div className="station-interactive-phases">
        {/* Step 1: Complete Table Status */}
        <div className={`investigation-card ${tableDone ? 'is-complete' : 'is-active'}`}>
          <div className="inv-header">
            <span className="inv-step-num">1</span>
            <div className="inv-title-wrap">
              <h4 className="inv-title">Fill Expedition Telemetry Table</h4>
              <p className="inv-desc">Identify the pattern in the table and calculate Tier 4.</p>
            </div>
            {tableDone && <span className="inv-check-badge">✅ LEDGER VALIDATED</span>}
          </div>
          {tableDone && (
            <div className="inv-success-pill">
              <span>Ledger validated: <strong>{t1}, {t2}, {t3}, {t4Correct}</strong>. Common difference <strong>d = +{proj.d}</strong>.</span>
            </div>
          )}
        </div>

        {/* Step 2: Assemble General Term Formula */}
        {tableDone && (
          <div className={`investigation-card ${formulaDone ? 'is-complete' : 'is-active'}`}>
            <div className="inv-header">
              <span className="inv-step-num">2</span>
              <div className="inv-title-wrap">
                <h4 className="inv-title">Assemble Algebraic General Term</h4>
                <p className="inv-desc">
                  Write the formula T_n = dn + c. Multiplier is d, constant is (Tier 1 − d).
                </p>
              </div>
              {formulaDone && <span className="inv-check-badge">✅ FORMULA SYNTHESIZED</span>}
            </div>

            {!formulaDone ? (
              <div className="inv-action-row">
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
                  <button className="btn-action-primary" onClick={handleCheckFormula}>
                    Verify General Term
                  </button>
                </div>
              </div>
            ) : (
              <div className="inv-success-pill">
                <span>General term confirmed: <strong>{proj.formulaStr}</strong>. Zero-term constant: {t1} − {proj.d} = +{zeroTerm}.</span>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Storm Survival Mission */}
        {formulaDone && (
          <div className={`investigation-card ${success ? 'is-complete' : 'is-active'}`}>
            <div className="inv-header">
              <span className="inv-step-num">3</span>
              <div className="inv-title-wrap">
                <h4 className="inv-title">Blizzard Defense Target: Manufacture Tier {proj.targetTier}</h4>
                <p className="inv-desc">
                  Basecamp heaters require <strong>Tier {proj.targetTier}</strong>. Use your formula to calculate total units needed.
                </p>
              </div>
              {success && <span className="inv-check-badge">🏆 SHIELD OPERATIONAL</span>}
            </div>

            {!success ? (
              <div className="inv-action-row">
                <div className="far-term-solver">
                  <div className="solver-hint-math">
                    <code>Units for Tier {proj.targetTier} = {proj.d}({proj.targetTier}) + {zeroTerm} = ?</code>
                  </div>
                  <div className="flex-input-grp">
                    <input
                      type="number"
                      className="telemetry-input large"
                      placeholder={`Total units for Tier ${proj.targetTier}...`}
                      value={targetInput}
                      onChange={(e) => setTargetInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleCheckTarget()}
                    />
                    <button className="btn-action-primary glow" onClick={handleCheckTarget}>
                      ⚡ 3D Print Grid & Power Shield
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="inv-success-pill celebration">
                <span>☀️ {proj.targetPanels} panels deployed! Basecamp thermal shield fully online through the storm!</span>
              </div>
            )}
          </div>
        )}

        {/* Live Feedback Alert */}
        {feedback && (
          <div className={`station-feedback-alert ${feedback.type === 'ok' ? 'alert-success' : 'alert-error'}`}>
            <span className="alert-icon">{feedback.type === 'ok' ? '✨' : '⚠️'}</span>
            <span className="alert-msg">{feedback.text}</span>
          </div>
        )}

        {/* Project Switcher */}
        <div className="station-sub-actions">
          <button className="btn-subtle" onClick={nextProject}>
            🔄 Switch Power Project ({proj.name})
          </button>
        </div>
      </div>
    </div>
  );
}
