// src/components/simulations/GrowingTrailLab.jsx
// Station A: The Gorge Suspension Bridge — Strut Tension Lab (Grade 7 Real-World Engineering)
import React, { useState } from 'react';
import './Stations.css';
import { useAudio } from '../../hooks/useAudio.js';

const BRIDGE_PROJECTS = [
  {
    id: 'echo_gorge',
    name: 'Echo Gorge Cantilever Bridge',
    river: 'Echo River Canyon',
    a1: 5,
    d: 4,
    formulaStr: 'B_n = 4n + 1',
    farBay: 24,
    farCorrect: 97, // 4*24 + 1
    unitName: 'steel struts',
    context: 'Triangular Warren Truss bays over a 360m canyon chasm',
  },
  {
    id: 'glacier_trestle',
    name: 'Glacier Crevasse Viaduct',
    river: 'Icefall Torrent',
    a1: 7,
    d: 3,
    formulaStr: 'B_n = 3n + 4',
    farBay: 30,
    farCorrect: 94, // 3*30 + 4
    unitName: 'reinforced beams',
    context: 'Heavy-timber snow shed framing for high-altitude freight rail',
  },
  {
    id: 'skyline_cableway',
    name: 'Skyline Gondola Pylon Run',
    river: 'Misty Abyss',
    a1: 6,
    d: 5,
    formulaStr: 'B_n = 5n + 1',
    farBay: 20,
    farCorrect: 101, // 5*20 + 1
    unitName: 'cross-bracing cables',
    context: 'Steel lattice tower sections carrying emergency summit cables',
  },
];

export default function GrowingTrailLab({ onComplete, audioEnabled }) {
  const { narrate, stopAll, sounds } = useAudio(audioEnabled);
  const [projectIdx, setProjectIdx] = useState(0);
  const [bayCount, setBayCount] = useState(1);
  const [diffGuess, setDiffGuess] = useState('');
  const [diffVerified, setDiffVerified] = useState(false);
  const [formulaVerified, setFormulaVerified] = useState(false);
  const [farInput, setFarInput] = useState('');
  const [feedback, setFeedback] = useState(null); // { text, type: 'ok'|'err' }
  const [trainCrossing, setTrainCrossing] = useState(false);
  const [success, setSuccess] = useState(false);

  const proj = BRIDGE_PROJECTS[projectIdx];
  const currentStruts = proj.a1 + (bayCount - 1) * proj.d;

  // Render SVG truss bridge representation
  const bayWidth = 70;
  const bayHeight = 65;

  function handleCheckDiff() {
    stopAll();
    const val = parseInt(diffGuess, 10);
    if (val === proj.d) {
      sounds.correct();
      setDiffVerified(true);
      setFeedback({ text: `Spot on! Every new bridge bay requires exactly ${proj.d} additional ${proj.unitName}. Common difference d = +${proj.d}.`, type: 'ok' });
      narrate([{ text: `Spot on! The common difference is ${proj.d}. Each new bay adds ${proj.d} more ${proj.unitName}.`, style: 'celebration' }]);
    } else {
      sounds.wrong();
      setFeedback({ text: `Not quite. Compare Bay 2 (${proj.a1 + proj.d}) with Bay 1 (${proj.a1}): difference = ${(proj.a1 + proj.d) - proj.a1}.`, type: 'err' });
      narrate([{ text: `Compare the total struts in Bay 2 with Bay 1 to find the increase.`, style: 'encouragement' }]);
    }
  }

  function handleCheckFormula() {
    stopAll();
    sounds.correct();
    setFormulaVerified(true);
    setFeedback({ text: `Formula verified! At bay 1: ${proj.d}(1) + ${proj.a1 - proj.d} = ${proj.a1}. The general term is ${proj.formulaStr}.`, type: 'ok' });
    narrate([{ text: `Excellent work! The general term formula is confirmed.`, style: 'celebration' }]);
  }

  function handleCheckFar() {
    stopAll();
    const val = parseInt(farInput, 10);
    if (val === proj.farCorrect) {
      sounds.correct();
      setSuccess(true);
      setTrainCrossing(true);
      setFeedback({ text: `SPAN SECURED! For ${proj.farBay} bays: ${proj.d}(${proj.farBay}) + ${proj.a1 - proj.d} = ${proj.farCorrect} ${proj.unitName}. Train dispatched across canyon!`, type: 'ok' });
      narrate([{ text: `Span secured! All ${proj.farCorrect} struts locked. High-speed supply train safely crossing the gorge!`, style: 'celebration' }]);
      if (sounds.levelUp) setTimeout(() => sounds.levelUp(), 800);
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 3500);
    } else {
      sounds.wrong();
      setFeedback({ text: `Check calculation: substitute n = ${proj.farBay} into ${proj.formulaStr}. Multiply ${proj.d} × ${proj.farBay} first, then add ${proj.a1 - proj.d}.`, type: 'err' });
      narrate([{ text: `Substitute ${proj.farBay} into your formula and recalculate.`, style: 'encouragement' }]);
    }
  }

  function nextProject() {
    stopAll();
    setProjectIdx((p) => (p + 1) % BRIDGE_PROJECTS.length);
    setBayCount(1);
    setDiffGuess('');
    setDiffVerified(false);
    setFormulaVerified(false);
    setFarInput('');
    setFeedback(null);
    setTrainCrossing(false);
    setSuccess(false);
  }

  return (
    <div className="station-container">
      {/* Station Header */}
      <div className="station-top-header">
        <div className="station-badge-group">
          <span className="station-pill-label">STATION A · STRUCTURAL CIVIL ENGINEERING</span>
          <h3 className="station-headline">🌉 {proj.name}</h3>
          <p className="station-subtext">{proj.context}</p>
        </div>
        <div className="station-metric-pill">
          <span className="metric-title">LIVE TELEMETRY</span>
          <span className="metric-val">{currentStruts} {proj.unitName}</span>
        </div>
      </div>

      {/* Main Bridge Simulation Canvas */}
      <div className="bridge-sim-viewport">
        {/* Sky and Gorge Backdrop */}
        <div className="gorge-visualizer">
          {/* Mountain Cliffs */}
          <div className="cliff-left">
            <div className="rock-texture"></div>
            <span className="cliff-marker">WEST BUTTE</span>
          </div>

          <div className="chasm-river">
            <div className="river-water-waves"></div>
            <span className="river-label">🌊 {proj.river} (Depth: 180m)</span>
          </div>

          <div className="cliff-right">
            <div className="rock-texture"></div>
            <span className="cliff-marker">EAST RIM</span>
          </div>

          {/* Interactive Bridge Truss SVG */}
          <div className="bridge-svg-wrap">
            <svg
              className="bridge-svg"
              viewBox="0 0 600 120"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <linearGradient id="beamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#0284c7" />
                </linearGradient>
                <linearGradient id="newBeamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10e5a5" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
                <filter id="glowGreen" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="glow" />
                  <feComposite in="SourceGraphic" in2="glow" operator="over" />
                </filter>
              </defs>

              {/* Base Canyon Abutments */}
              <rect x="0" y="80" width="40" height="40" fill="#334155" />
              <rect x="560" y="80" width="40" height="40" fill="#334155" />

              {/* Render bays up to bayCount */}
              {Array.from({ length: trainCrossing ? 7 : bayCount }).map((_, i) => {
                const startX = 40 + i * bayWidth;
                const isLatest = i === bayCount - 1 && !trainCrossing;
                const strokeColor = isLatest ? 'url(#newBeamGrad)' : 'url(#beamGrad)';
                const strokeW = isLatest ? 3.5 : 2.5;

                return (
                  <g key={i} className={`truss-bay ${isLatest ? 'truss-new-anim' : ''}`}>
                    {/* Bottom Chord */}
                    <line x1={startX} y1="80" x2={startX + bayWidth} y2="80" stroke={strokeColor} strokeWidth={strokeW} />
                    {/* Top Chord */}
                    <line x1={startX} y1={80 - bayHeight} x2={startX + bayWidth} y2={80 - bayHeight} stroke={strokeColor} strokeWidth={strokeW} />
                    {/* Left Vertical Strut (only for first bay) */}
                    {i === 0 && (
                      <line x1={startX} y1="80" x2={startX} y2={80 - bayHeight} stroke={strokeColor} strokeWidth={strokeW} />
                    )}
                    {/* Right Vertical Strut */}
                    <line x1={startX + bayWidth} y1="80" x2={startX + bayWidth} y2={80 - bayHeight} stroke={strokeColor} strokeWidth={strokeW} />
                    {/* Diagonal 1 (X brace or Pratt diagonal) */}
                    <line x1={startX} y1="80" x2={startX + bayWidth} y2={80 - bayHeight} stroke={strokeColor} strokeWidth={strokeW} />
                    {/* Diagonal 2 for 5-strut archetype */}
                    {proj.d >= 4 && (
                      <line x1={startX} y1={80 - bayHeight} x2={startX + bayWidth} y2="80" stroke={strokeColor} strokeWidth={strokeW} opacity="0.8" />
                    )}

                    {/* Nodes / Pins */}
                    <circle cx={startX} cy="80" r="3.5" fill="#f8fafc" />
                    <circle cx={startX} cy={80 - bayHeight} r="3.5" fill="#f8fafc" />
                    <circle cx={startX + bayWidth} cy="80" r="3.5" fill="#f8fafc" />
                    <circle cx={startX + bayWidth} cy={80 - bayHeight} r="3.5" fill="#f8fafc" />

                    {/* Bay label */}
                    <text x={startX + bayWidth / 2} y="98" fill="#94a3b8" fontSize="10" textAnchor="middle" fontWeight="bold">
                      Bay {i + 1}
                    </text>
                  </g>
                );
              })}

              {/* Supply Train Animation on Completion */}
              {trainCrossing && (
                <g className="expedition-train-crossing">
                  <rect x="0" y="60" width="70" height="18" rx="4" fill="#f59e0b" filter="url(#glowGreen)" />
                  <rect x="75" y="64" width="55" height="14" rx="3" fill="#e2e8f0" />
                  <rect x="135" y="64" width="55" height="14" rx="3" fill="#e2e8f0" />
                  <circle cx="20" cy="79" r="4" fill="#0f172a" />
                  <circle cx="50" cy="79" r="4" fill="#0f172a" />
                  <circle cx="90" cy="79" r="4" fill="#0f172a" />
                  <circle cx="120" cy="79" r="4" fill="#0f172a" />
                  <circle cx="150" cy="79" r="4" fill="#0f172a" />
                  <circle cx="180" cy="79" r="4" fill="#0f172a" />
                  {/* Headlight */}
                  <polygon points="70,69 130,55 130,83" fill="rgba(254, 240, 138, 0.45)" />
                </g>
              )}
            </svg>
          </div>
        </div>

        {/* Real-time Telemetry Readout Table */}
        <div className="bridge-telemetry-panel">
          <div className="telemetry-col">
            <span className="telemetry-lbl">CURRENT SPAN BAYS (n)</span>
            <div className="stepper-cluster">
              <button
                className="step-circle-btn"
                onClick={() => setBayCount((b) => Math.max(1, b - 1))}
                disabled={bayCount <= 1 || trainCrossing}
              >
                −
              </button>
              <span className="stepper-val-big">{bayCount}</span>
              <button
                className="step-circle-btn"
                onClick={() => setBayCount((b) => Math.min(5, b + 1))}
                disabled={bayCount >= 5 || trainCrossing}
              >
                +
              </button>
            </div>
            <span className="telemetry-hint">Adjust 1–5 bays</span>
          </div>

          <div className="telemetry-col">
            <span className="telemetry-lbl">TOTAL STRUTS (B_n)</span>
            <span className="telemetry-val-highlight">{currentStruts}</span>
            <span className="telemetry-sub">{bayCount === 1 ? 'Starting Base' : `Adds +${proj.d} from previous`}</span>
          </div>

          <div className="telemetry-col">
            <span className="telemetry-lbl">STAGE EXPANSION LOG</span>
            <div className="sequence-chips-row">
              {[1, 2, 3, 4, 5].map((stg) => {
                const count = proj.a1 + (stg - 1) * proj.d;
                return (
                  <div key={stg} className={`seq-chip ${stg === bayCount ? 'active' : ''}`}>
                    <span className="seq-chip-n">Bay {stg}</span>
                    <span className="seq-chip-val">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Guided Engineering Investigation Controls */}
      <div className="station-interactive-phases">
        {/* Step 1: Find the Common Difference */}
        <div className={`investigation-card ${diffVerified ? 'is-complete' : 'is-active'}`}>
          <div className="inv-header">
            <span className="inv-step-num">1</span>
            <div className="inv-title-wrap">
              <h4 className="inv-title">Telemetry Rate Analysis: Common Difference</h4>
              <p className="inv-desc">Inspect how many struts are added as the bridge grows from Bay 1 to Bay 2, 3, 4.</p>
            </div>
            {diffVerified && <span className="inv-check-badge">✅ VERIFIED</span>}
          </div>

          {!diffVerified ? (
            <div className="inv-action-row">
              <div className="input-with-label">
                <label>Common Difference (d):</label>
                <div className="flex-input-grp">
                  <input
                    type="number"
                    className="telemetry-input"
                    placeholder="Struts added per bay..."
                    value={diffGuess}
                    onChange={(e) => setDiffGuess(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCheckDiff()}
                  />
                  <button className="btn-action-primary" onClick={handleCheckDiff}>Verify d</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="inv-success-pill">
              <span>Common difference locked: <strong>d = +{proj.d}</strong> struts per structural bay.</span>
            </div>
          )}
        </div>

        {/* Step 2: Derive the General Term Formula */}
        {diffVerified && (
          <div className={`investigation-card ${formulaVerified ? 'is-complete' : 'is-active'}`}>
            <div className="inv-header">
              <span className="inv-step-num">2</span>
              <div className="inv-title-wrap">
                <h4 className="inv-title">Calibrate General Term Formula</h4>
                <p className="inv-desc">Verify that B_n = {proj.d}n + {proj.a1 - proj.d} matches the first bay at n = 1: {proj.d}(1) + {proj.a1 - proj.d} = {proj.a1}.</p>
              </div>
              {formulaVerified && <span className="inv-check-badge">✅ FORMULA LOCKED</span>}
            </div>

            {!formulaVerified ? (
              <div className="inv-action-row">
                <div className="formula-match-box">
                  <span className="formula-eq-text">General Term: <strong>{proj.formulaStr}</strong></span>
                  <span className="formula-test-text">At n = 1: {proj.d}(1) + {proj.a1 - proj.d} = {proj.a1} struts</span>
                  <button className="btn-action-primary" onClick={handleCheckFormula}>Lock Formula</button>
                </div>
              </div>
            ) : (
              <div className="inv-success-pill">
                <span>General term confirmed: <strong>{proj.formulaStr}</strong> for any bay n.</span>
              </div>
            )}
          </div>
        )}

        {/* Step 3: High-Order Far-Bay Canyon Span Mission */}
        {formulaVerified && (
          <div className={`investigation-card ${success ? 'is-complete' : 'is-active'}`}>
            <div className="inv-header">
              <span className="inv-step-num">3</span>
              <div className="inv-title-wrap">
                <h4 className="inv-title">Full Canyon Span Mission: Calculate Bay {proj.farBay}</h4>
                <p className="inv-desc">
                  The automated crane needs the exact count for the full <strong>{proj.farBay}-bay</strong> span. Calculate B_{proj.farBay} without building bay-by-bay!
                </p>
              </div>
              {success && <span className="inv-check-badge">🏆 MISSION COMPLETE</span>}
            </div>

            {!success ? (
              <div className="inv-action-row">
                <div className="far-term-solver">
                  <div className="solver-hint-math">
                    <code>B_{proj.farBay} = {proj.d}({proj.farBay}) + {proj.a1 - proj.d} = ?</code>
                  </div>
                  <div className="flex-input-grp">
                    <input
                      type="number"
                      className="telemetry-input large"
                      placeholder={`Total struts for ${proj.farBay} bays...`}
                      value={farInput}
                      onChange={(e) => setFarInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleCheckFar()}
                    />
                    <button className="btn-action-primary glow" onClick={handleCheckFar}>
                      🚀 Deploy Span & Test Train
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="inv-success-pill celebration">
                <span>🌉 Full span assembled with {proj.farCorrect} struts! High-speed train crossing safely!</span>
              </div>
            )}
          </div>
        )}

        {/* Live Feedback Message Box */}
        {feedback && (
          <div className={`station-feedback-alert ${feedback.type === 'ok' ? 'alert-success' : 'alert-error'}`}>
            <span className="alert-icon">{feedback.type === 'ok' ? '✨' : '⚠️'}</span>
            <span className="alert-msg">{feedback.text}</span>
          </div>
        )}

        {/* Alternative Project Switcher */}
        <div className="station-sub-actions">
          <button className="btn-subtle" onClick={nextProject}>
            🔄 Switch Bridge Project ({proj.name})
          </button>
        </div>
      </div>
    </div>
  );
}
