// src/components/simulations/SetTheCheckpoint.jsx
// Station B: The Hydro-Pressure Aqueduct Governor (Grade 7 Real-World Hydraulic Engineering)
import React, { useState } from 'react';
import './Stations.css';
import { useAudio } from '../../hooks/useAudio.js';

const AQUEDUCT_SYSTEMS = [
  {
    id: 'alpine_hydro',
    name: 'Alpine Penstock Hydro-Electric Aqueduct',
    unit: 'PSI',
    a1: 14,
    d: 6,
    zeroTerm: 8,
    targetStation: 35,
    targetCorrect: 218,
    farhanMistake: 'P_n = 6n + 14',
    context: 'Stepped mountain descent pipe powering high-altitude turbines',
  },
  {
    id: 'geothermal_well',
    name: 'Sub-Glacial Geothermal Borehole',
    unit: '°C',
    a1: 23,
    d: 8,
    zeroTerm: 15,
    targetStation: 25,
    targetCorrect: 215,
    farhanMistake: 'T_n = 8n + 23',
    context: 'Deep thermal exploration sensor shaft through volcanic strata',
  },
  {
    id: 'hyperbaric_tunnel',
    name: 'Glacier Deep Rail Tunnel Ventilation',
    unit: 'kPa',
    a1: 19,
    d: 5,
    zeroTerm: 14,
    targetStation: 40,
    targetCorrect: 214,
    farhanMistake: 'D_n = 5n + 19',
    context: 'Underground pneumatic tunnel maintaining crew oxygen pressure',
  },
];

export default function SetTheCheckpoint({ onComplete, audioEnabled }) {
  const { narrate, stopAll, sounds } = useAudio(audioEnabled);
  const [sysIdx, setSysIdx] = useState(0);
  const [activeStep, setActiveStep] = useState(1); // 1 or 2
  const [rateSlider, setRateSlider] = useState(4);
  const [offsetSlider, setOffsetSlider] = useState(14);
  const [testedFarhan, setTestedFarhan] = useState(false);
  const [governorLocked, setGovernorLocked] = useState(false);
  const [deepInput, setDeepInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [turbineSpinning, setTurbineSpinning] = useState(false);
  const [success, setSuccess] = useState(false);

  const sys = AQUEDUCT_SYSTEMS[sysIdx];
  const currentFormula = `${rateSlider}n ${offsetSlider >= 0 ? '+' : '−'} ${Math.abs(offsetSlider)}`;
  const predictedAt1 = rateSlider * 1 + offsetSlider;
  const isPerfectMatch = rateSlider === sys.d && offsetSlider === sys.zeroTerm;

  function testFarhanFormula() {
    stopAll();
    sounds.wrong();
    setTestedFarhan(true);
    setRateSlider(sys.d);
    setOffsetSlider(sys.a1);
    setFeedback({
      type: 'err',
      text: `PRESSURE BLOWOUT! At Station 1, formula gives ${sys.d + sys.a1} ${sys.unit}, but sensor reads ${sys.a1} ${sys.unit}! Use sliders to calibrate the zero-term offset.`,
    });
    narrate([{
      text: `Pressure blowout warning! Formula predicts ${sys.d + sys.a1} ${sys.unit} at Station 1, but the real sensor reads ${sys.a1}. The constant must be adjusted!`,
      style: 'emphasis',
    }]);
  }

  function handleLockGovernor() {
    stopAll();
    if (isPerfectMatch) {
      sounds.correct();
      setGovernorLocked(true);
      setActiveStep(2);
      setFeedback({
        type: 'ok',
        text: `GOVERNOR SYNCHRONIZED! Zero-term c = ${sys.a1} − ${sys.d} = +${sys.zeroTerm}. Formula P_n = ${sys.d}n + ${sys.zeroTerm} confirmed!`,
      });
      narrate([{
        text: `Governor synchronized! Formula matches all sensor stations. Ready for deep turbine calibration!`,
        style: 'celebration',
      }]);
    } else {
      sounds.wrong();
      setFeedback({
        type: 'err',
        text: `Rate must equal common difference (${sys.d}), and offset must equal the zero-term (${sys.a1} − ${sys.d} = ${sys.zeroTerm}).`,
      });
      narrate([{
        text: `Adjust the rate and zero-term offset to match the telemetry.`,
        style: 'encouragement',
      }]);
    }
  }

  function handleCheckDeepTarget() {
    stopAll();
    const val = parseInt(deepInput, 10);
    if (val === sys.targetCorrect) {
      sounds.correct();
      setSuccess(true);
      setTurbineSpinning(true);
      setFeedback({
        type: 'ok',
        text: `GENERATORS ONLINE! Station ${sys.targetStation} stabilized at exact ${sys.targetCorrect} ${sys.unit}! Turbines operating at 100%!`,
      });
      narrate([{
        text: `Hydro generators online! Exactly ${sys.targetCorrect} ${sys.unit} confirmed at Station ${sys.targetStation}. Turbine running smoothly!`,
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
        text: `Calculate: ${sys.d}(${sys.targetStation}) + ${sys.zeroTerm} = ? Multiply first, then add!`,
      });
      narrate([{
        text: `Multiply ${sys.d} by ${sys.targetStation}, then add ${sys.zeroTerm}.`,
        style: 'encouragement',
      }]);
    }
  }

  function nextSystem() {
    stopAll();
    setSysIdx((i) => (i + 1) % AQUEDUCT_SYSTEMS.length);
    setActiveStep(1);
    setRateSlider(4);
    setOffsetSlider(14);
    setTestedFarhan(false);
    setGovernorLocked(false);
    setDeepInput('');
    setFeedback(null);
    setTurbineSpinning(false);
    setSuccess(false);
  }

  return (
    <div className="station-container">
      {/* Compact Top Header */}
      <div className="station-top-header">
        <div className="station-badge-group">
          <span className="station-pill-label">STATION B · HYDRAULIC PRESSURE REGULATION</span>
          <h3 className="station-headline">💧 {sys.name}</h3>
        </div>
        <div className="station-metric-pill">
          <span className="metric-title">TARGET CHECKPOINT</span>
          <span className="metric-val">Station {sys.targetStation}</span>
        </div>
      </div>

      {/* Main 2-Column Body: Fits in 1 Screen with No Scroll */}
      <div className="station-split-body">
        {/* Left Column: Aqueduct Schematic + Coordinate Oscilloscope */}
        <div className="station-left-sim">
          <div className="aqueduct-pipe-schematic">
            <div className="reservoir-dam">
              <span className="dam-label">DAM HEADWATER</span>
            </div>

            <div className="stepped-pipe-flow">
              {[1, 2, 3, 4].map((stn) => {
                const actualPSI = sys.a1 + (stn - 1) * sys.d;
                const formulaPSI = rateSlider * stn + offsetSlider;
                const isDiff = testedFarhan && formulaPSI !== actualPSI;

                return (
                  <div key={stn} className={`pipe-checkpoint-node ${isDiff ? 'sensor-warning' : 'sensor-nominal'}`}>
                    <div className="gauge-dial">
                      <div
                        className="gauge-needle"
                        style={{
                          transform: `rotate(${Math.min(130, Math.max(-130, (actualPSI - 20) * 4))}deg)`,
                        }}
                      />
                    </div>
                    <div className="sensor-info">
                      <span className="sensor-stn">Stn {stn}</span>
                      <span className="sensor-psi">{actualPSI} {sys.unit}</span>
                    </div>
                    {testedFarhan && (
                      <span className={`formula-predicted-tag ${isDiff ? 'tag-error' : 'tag-ok'}`}>
                        {formulaPSI}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Generator Turbine */}
            <div className={`turbine-station ${turbineSpinning ? 'turbine-active' : ''}`}>
              <div className="turbine-wheel">
                <svg width="34" height="34" viewBox="0 0 44 44">
                  <circle cx="22" cy="22" r="18" fill="none" stroke="#38bdf8" strokeWidth="3" />
                  <path d="M22 4 L22 40 M4 22 L40 22 M9 9 L35 35 M9 35 L35 9" stroke="#38bdf8" strokeWidth="2.5" />
                </svg>
              </div>
              <span className="turbine-status-lbl">
                {turbineSpinning ? '⚡ TURBINE ONLINE' : 'TURBINE IDLE'}
              </span>
            </div>
          </div>

          {/* Coordinate Oscilloscope */}
          <div className="hydro-oscilloscope">
            <div className="osc-header">
              <span className="osc-title">📈 COORDINATE TELEMETRY (P vs n)</span>
              <span className="osc-formula">P = {currentFormula}</span>
            </div>
            <svg className="osc-graph-svg" viewBox="0 0 320 85">
              <line x1="25" y1="70" x2="310" y2="70" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
              <line x1="25" y1="8" x2="25" y2="70" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />

              {[1, 2, 3, 4].map((stn) => {
                const x = 25 + stn * 60;
                const actualPSI = sys.a1 + (stn - 1) * sys.d;
                const y = 70 - (actualPSI / 40) * 58;
                return (
                  <g key={stn}>
                    <circle cx={x} cy={y} r="3.5" fill="#38bdf8" />
                    <text x={x} y={y - 6} fill="#94a3b8" fontSize="8" textAnchor="middle">
                      ({stn}, {actualPSI})
                    </text>
                  </g>
                );
              })}

              {(() => {
                const x1 = 25 + 1 * 60;
                const y1 = 70 - ((rateSlider * 1 + offsetSlider) / 40) * 58;
                const x4 = 25 + 4 * 60;
                const y4 = 70 - ((rateSlider * 4 + offsetSlider) / 40) * 58;
                return (
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x4}
                    y2={y4}
                    stroke={isPerfectMatch ? '#10e5a5' : '#f59e0b'}
                    strokeWidth="2.5"
                    strokeDasharray={isPerfectMatch ? 'none' : '4 3'}
                  />
                );
              })()}
            </svg>
          </div>
        </div>

        {/* Right Column: Guided Active Investigation */}
        <div className="station-right-guided">
          {/* Step Switcher */}
          <div className="guided-step-tabs">
            <button
              className={`step-tab-btn ${activeStep === 1 ? 'active' : ''} ${governorLocked ? 'done' : ''}`}
              onClick={() => setActiveStep(1)}
            >
              {governorLocked ? '✓' : '1'} Tune Governor
            </button>
            <button
              className={`step-tab-btn ${activeStep === 2 ? 'active' : ''} ${success ? 'done' : ''}`}
              onClick={() => governorLocked && setActiveStep(2)}
              disabled={!governorLocked}
            >
              {success ? '✓' : '2'} Station {sys.targetStation} Mission
            </button>
          </div>

          {/* Active Step Content */}
          <div className="active-investigation-box">
            {activeStep === 1 && (
              <div className="step-pane">
                <h4 className="step-pane-title">1. Audit &amp; Calibrate Governor</h4>
                <p className="step-pane-desc">Farhan suggests {sys.farhanMistake}. Test it, then calibrate the zero-term offset!</p>

                {!testedFarhan ? (
                  <button className="btn-action-warning" onClick={testFarhanFormula}>
                    ⚠️ Test Farhan's Formula in Simulator
                  </button>
                ) : (
                  <div className="tuner-manifold-box">
                    <div className="tuner-sliders-grid">
                      <div className="tuner-col">
                        <div className="tuner-label-row">
                          <span>Rate (d):</span>
                          <strong className="tuner-val-bold">{rateSlider} {sys.unit}</strong>
                        </div>
                        <input
                          type="range"
                          min="2"
                          max="10"
                          value={rateSlider}
                          onChange={(e) => setRateSlider(parseInt(e.target.value, 10))}
                          className="slider-range"
                        />
                      </div>
                      <div className="tuner-col">
                        <div className="tuner-label-row">
                          <span>Zero-Term (c):</span>
                          <strong className={`tuner-val-bold ${offsetSlider === sys.zeroTerm ? 'highlight-correct' : ''}`}>
                            {offsetSlider} {sys.unit}
                          </strong>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="25"
                          value={offsetSlider}
                          onChange={(e) => setOffsetSlider(parseInt(e.target.value, 10))}
                          className="slider-range"
                        />
                      </div>
                    </div>

                    <div className="formula-eval-bar">
                      <span className="eval-eq">Stn 1: {rateSlider}(1) + {offsetSlider} = <strong>{predictedAt1} {sys.unit}</strong></span>
                      <button
                        className="btn-action-primary"
                        onClick={handleLockGovernor}
                        disabled={!isPerfectMatch}
                      >
                        {governorLocked ? 'Locked ✓' : 'Lock Governor'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeStep === 2 && (
              <div className="step-pane">
                <h4 className="step-pane-title">2. Turbine Mission: Calculate Station {sys.targetStation}</h4>
                <p className="step-pane-desc">Pre-pressurize hydraulic line for Station {sys.targetStation}:</p>
                <div className="solver-hint-math">
                  <code>P_{sys.targetStation} = {sys.d}({sys.targetStation}) + {sys.zeroTerm} = ? {sys.unit}</code>
                </div>
                <div className="flex-input-grp">
                  <input
                    type="number"
                    className="telemetry-input large"
                    placeholder={`Pressure for Stn ${sys.targetStation}...`}
                    value={deepInput}
                    onChange={(e) => setDeepInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCheckDeepTarget()}
                    disabled={success}
                  />
                  <button className="btn-action-primary glow" onClick={handleCheckDeepTarget} disabled={success}>
                    {success ? 'Online 🏆' : 'Engage Governor ⚡'}
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

          {/* System Switcher */}
          <div className="station-sub-actions">
            <button className="btn-subtle" onClick={nextSystem}>
              🔄 Switch Hydraulic System ({sys.name})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
