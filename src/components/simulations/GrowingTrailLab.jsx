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
    context: 'Warren Truss cantilever over 360m chasm',
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
    context: 'Heavy snow shed framing for freight rail',
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
    context: 'Lattice tower carrying summit emergency cables',
  },
];

export default function GrowingTrailLab({ onComplete, audioEnabled }) {
  const { narrate, stopAll, sounds } = useAudio(audioEnabled);
  const [projectIdx, setProjectIdx] = useState(0);
  const [bayCount, setBayCount] = useState(1);
  const [activeStep, setActiveStep] = useState(1); // 1, 2, or 3
  const [diffGuess, setDiffGuess] = useState('');
  const [diffVerified, setDiffVerified] = useState(false);
  const [formulaVerified, setFormulaVerified] = useState(false);
  const [farInput, setFarInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [trainCrossing, setTrainCrossing] = useState(false);
  const [success, setSuccess] = useState(false);

  const proj = BRIDGE_PROJECTS[projectIdx];
  const currentStruts = proj.a1 + (bayCount - 1) * proj.d;
  const bayWidth = 65;
  const bayHeight = 55;

  function handleCheckDiff() {
    stopAll();
    const val = parseInt(diffGuess, 10);
    if (val === proj.d) {
      sounds.correct();
      setDiffVerified(true);
      setActiveStep(2);
      setFeedback({ text: `Spot on! Each new bay adds ${proj.d} ${proj.unitName}. Common difference d = +${proj.d}.`, type: 'ok' });
      narrate([{ text: `Spot on! The common difference is ${proj.d}. Each new bay adds ${proj.d} more ${proj.unitName}.`, style: 'celebration' }]);
    } else {
      sounds.wrong();
      setFeedback({ text: `Compare Bay 2 (${proj.a1 + proj.d}) with Bay 1 (${proj.a1}): difference is ${(proj.a1 + proj.d) - proj.a1}.`, type: 'err' });
      narrate([{ text: `Compare the total struts in Bay 2 with Bay 1 to find the increase.`, style: 'encouragement' }]);
    }
  }

  function handleCheckFormula() {
    stopAll();
    sounds.correct();
    setFormulaVerified(true);
    setActiveStep(3);
    setFeedback({ text: `Formula verified! At bay 1: ${proj.d}(1) + ${proj.a1 - proj.d} = ${proj.a1}. General term: ${proj.formulaStr}.`, type: 'ok' });
    narrate([{ text: `Formula confirmed! Now calculate the requirement for the full canyon span.`, style: 'celebration' }]);
  }

  function handleCheckFar() {
    stopAll();
    const val = parseInt(farInput, 10);
    if (val === proj.farCorrect) {
      sounds.correct();
      setSuccess(true);
      setTrainCrossing(true);
      setFeedback({ text: `SPAN SECURED! ${proj.farBay} bays require ${proj.farCorrect} ${proj.unitName}. High-speed train safely crossing!`, type: 'ok' });
      narrate([{ text: `Span secured! All ${proj.farCorrect} struts locked. Supply train safely crossing the gorge!`, style: 'celebration' }]);
      if (sounds.levelUp) setTimeout(() => sounds.levelUp(), 800);
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 3500);
    } else {
      sounds.wrong();
      setFeedback({ text: `Calculate: ${proj.d} × ${proj.farBay} + ${proj.a1 - proj.d} = ? Multiply first, then add!`, type: 'err' });
      narrate([{ text: `Multiply ${proj.d} by ${proj.farBay}, then add ${proj.a1 - proj.d}.`, style: 'encouragement' }]);
    }
  }

  function nextProject() {
    stopAll();
    setProjectIdx((p) => (p + 1) % BRIDGE_PROJECTS.length);
    setBayCount(1);
    setActiveStep(1);
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
      {/* Compact Top Header */}
      <div className="station-top-header">
        <div className="station-badge-group">
          <span className="station-pill-label">STATION A · STRUCTURAL CIVIL ENGINEERING</span>
          <h3 className="station-headline">🌉 {proj.name}</h3>
        </div>
        <div className="station-metric-pill">
          <span className="metric-title">LIVE STRUT TELEMETRY</span>
          <span className="metric-val">{currentStruts} {proj.unitName}</span>
        </div>
      </div>

      {/* Main 2-Column Body: Fits in 1 Screen with No Scroll */}
      <div className="station-split-body">
        {/* Left Column: Interactive Simulation & Stepper */}
        <div className="station-left-sim">
          <div className="gorge-visualizer">
            <div className="cliff-left"><span className="cliff-marker">WEST</span></div>
            <div className="chasm-river"><span className="river-label">🌊 {proj.river}</span></div>
            <div className="cliff-right"><span className="cliff-marker">EAST</span></div>

            <div className="bridge-svg-wrap">
              <svg className="bridge-svg" viewBox="0 0 540 110" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <linearGradient id="beamGradA" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#0284c7" />
                  </linearGradient>
                  <linearGradient id="newBeamGradA" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10e5a5" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                  <filter id="glowGreenA" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="glow" />
                    <feComposite in="SourceGraphic" in2="glow" operator="over" />
                  </filter>
                </defs>

                <rect x="0" y="70" width="35" height="40" fill="#334155" />
                <rect x="505" y="70" width="35" height="40" fill="#334155" />

                {Array.from({ length: trainCrossing ? 7 : bayCount }).map((_, i) => {
                  const startX = 35 + i * bayWidth;
                  const isLatest = i === bayCount - 1 && !trainCrossing;
                  const strokeColor = isLatest ? 'url(#newBeamGradA)' : 'url(#beamGradA)';
                  const strokeW = isLatest ? 3.2 : 2.4;

                  return (
                    <g key={i} className={`truss-bay ${isLatest ? 'truss-new-anim' : ''}`}>
                      <line x1={startX} y1="70" x2={startX + bayWidth} y2="70" stroke={strokeColor} strokeWidth={strokeW} />
                      <line x1={startX} y1={70 - bayHeight} x2={startX + bayWidth} y2={70 - bayHeight} stroke={strokeColor} strokeWidth={strokeW} />
                      {i === 0 && <line x1={startX} y1="70" x2={startX} y2={70 - bayHeight} stroke={strokeColor} strokeWidth={strokeW} />}
                      <line x1={startX + bayWidth} y1="70" x2={startX + bayWidth} y2={70 - bayHeight} stroke={strokeColor} strokeWidth={strokeW} />
                      <line x1={startX} y1="70" x2={startX + bayWidth} y2={70 - bayHeight} stroke={strokeColor} strokeWidth={strokeW} />
                      {proj.d >= 4 && <line x1={startX} y1={70 - bayHeight} x2={startX + bayWidth} y2="70" stroke={strokeColor} strokeWidth={strokeW} opacity="0.8" />}

                      <circle cx={startX} cy="70" r="3" fill="#f8fafc" />
                      <circle cx={startX} cy={70 - bayHeight} r="3" fill="#f8fafc" />
                      <circle cx={startX + bayWidth} cy="70" r="3" fill="#f8fafc" />
                      <circle cx={startX + bayWidth} cy={70 - bayHeight} r="3" fill="#f8fafc" />

                      <text x={startX + bayWidth / 2} y="86" fill="#94a3b8" fontSize="9" textAnchor="middle" fontWeight="bold">
                        B{i + 1}
                      </text>
                    </g>
                  );
                })}

                {trainCrossing && (
                  <g className="expedition-train-crossing">
                    <rect x="0" y="52" width="65" height="16" rx="4" fill="#f59e0b" filter="url(#glowGreenA)" />
                    <rect x="70" y="56" width="50" height="12" rx="3" fill="#e2e8f0" />
                    <rect x="125" y="56" width="50" height="12" rx="3" fill="#e2e8f0" />
                    <circle cx="18" cy="69" r="3.5" fill="#0f172a" />
                    <circle cx="48" cy="69" r="3.5" fill="#0f172a" />
                    <circle cx="85" cy="69" r="3.5" fill="#0f172a" />
                    <circle cx="112" cy="69" r="3.5" fill="#0f172a" />
                    <circle cx="140" cy="69" r="3.5" fill="#0f172a" />
                    <polygon points="65,60 115,48 115,72" fill="rgba(254, 240, 138, 0.45)" />
                  </g>
                )}
              </svg>
            </div>
          </div>

          {/* Telemetry Stepper + Log */}
          <div className="bridge-telemetry-panel">
            <div className="telemetry-col">
              <span className="telemetry-lbl">SPAN BAYS (n)</span>
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
            </div>

            <div className="telemetry-col">
              <span className="telemetry-lbl">TOTAL STRUTS</span>
              <span className="telemetry-val-highlight">{currentStruts}</span>
            </div>

            <div className="telemetry-col">
              <span className="telemetry-lbl">STAGE SEQUENCE</span>
              <div className="sequence-chips-row">
                {[1, 2, 3, 4, 5].map((stg) => {
                  const count = proj.a1 + (stg - 1) * proj.d;
                  return (
                    <div key={stg} className={`seq-chip ${stg === bayCount ? 'active' : ''}`}>
                      <span className="seq-chip-n">B{stg}</span>
                      <span className="seq-chip-val">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Guided Active Investigation */}
        <div className="station-right-guided">
          {/* Mini Step Switcher */}
          <div className="guided-step-tabs">
            <button
              className={`step-tab-btn ${activeStep === 1 ? 'active' : ''} ${diffVerified ? 'done' : ''}`}
              onClick={() => setActiveStep(1)}
            >
              {diffVerified ? '✓' : '1'} Difference
            </button>
            <button
              className={`step-tab-btn ${activeStep === 2 ? 'active' : ''} ${formulaVerified ? 'done' : ''}`}
              onClick={() => diffVerified && setActiveStep(2)}
              disabled={!diffVerified}
            >
              {formulaVerified ? '✓' : '2'} Formula
            </button>
            <button
              className={`step-tab-btn ${activeStep === 3 ? 'active' : ''} ${success ? 'done' : ''}`}
              onClick={() => formulaVerified && setActiveStep(3)}
              disabled={!formulaVerified}
            >
              {success ? '✓' : '3'} Canyon Mission
            </button>
          </div>

          {/* Active Step Content */}
          <div className="active-investigation-box">
            {activeStep === 1 && (
              <div className="step-pane">
                <h4 className="step-pane-title">1. Telemetry Rate Analysis</h4>
                <p className="step-pane-desc">How many steel struts are added for each new bridge bay?</p>
                <div className="flex-input-grp">
                  <input
                    type="number"
                    className="telemetry-input large"
                    placeholder="Struts added per bay..."
                    value={diffGuess}
                    onChange={(e) => setDiffGuess(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCheckDiff()}
                    disabled={diffVerified}
                  />
                  <button className="btn-action-primary" onClick={handleCheckDiff} disabled={diffVerified}>
                    {diffVerified ? 'Verified ✓' : 'Verify d'}
                  </button>
                </div>
              </div>
            )}

            {activeStep === 2 && (
              <div className="step-pane">
                <h4 className="step-pane-title">2. Lock General Term Formula</h4>
                <p className="step-pane-desc">
                  Confirm formula matching Bay 1: {proj.d}(1) + {proj.a1 - proj.d} = {proj.a1}.
                </p>
                <div className="formula-match-box">
                  <span className="formula-eq-text">General Term: <strong>{proj.formulaStr}</strong></span>
                  <button className="btn-action-primary glow" onClick={handleCheckFormula} disabled={formulaVerified}>
                    {formulaVerified ? 'Formula Locked ✓' : 'Lock Formula'}
                  </button>
                </div>
              </div>
            )}

            {activeStep === 3 && (
              <div className="step-pane">
                <h4 className="step-pane-title">3. Canyon Span Mission: Calculate Bay {proj.farBay}</h4>
                <p className="step-pane-desc">Calculate total struts for {proj.farBay} bays:</p>
                <div className="solver-hint-math">
                  <code>B_{proj.farBay} = {proj.d}({proj.farBay}) + {proj.a1 - proj.d} = ?</code>
                </div>
                <div className="flex-input-grp">
                  <input
                    type="number"
                    className="telemetry-input large"
                    placeholder={`Struts for ${proj.farBay} bays...`}
                    value={farInput}
                    onChange={(e) => setFarInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCheckFar()}
                    disabled={success}
                  />
                  <button className="btn-action-primary glow" onClick={handleCheckFar} disabled={success}>
                    {success ? 'Span Secured 🏆' : 'Deploy Span 🚀'}
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
              🔄 Switch Bridge Project ({proj.name})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
