// src/components/simulations/SpotTheFalseMarker.jsx
// Station D: The Summit Radar Distress Lock (Grade 7 Sequence Membership & Error Auditing)
import React, { useState } from 'react';
import './Stations.css';
import { useAudio } from '../../hooks/useAudio.js';

const RADAR_SCENARIOS = [
  {
    id: 'summit_sar',
    name: 'Summit Search-and-Rescue Transponder',
    formulaStr: 'f_n = 7n + 15 MHz',
    d: 7,
    c: 15,
    unit: 'MHz',
    logEntries: [
      { id: 1, channel: 1, freq: 22, isCorrupted: false },
      { id: 2, channel: 2, freq: 29, isCorrupted: false },
      { id: 3, channel: 3, freq: 38, isCorrupted: true, correctFreq: 36, reason: 'Common difference must be +7 MHz. 29 + 7 = 36 MHz (not 38 MHz).' },
      { id: 4, channel: 4, freq: 43, isCorrupted: false },
    ],
    beacons: [
      { id: 'alpha', label: 'Beacon Alpha', freq: 158, calc: '(158 − 15) ÷ 7 = 20.43 (Fraction)', isReal: false },
      { id: 'bravo', label: 'Beacon Bravo', freq: 162, calc: '(162 − 15) ÷ 7 = 21 (Whole Number)', channelNum: 21, isReal: true },
      { id: 'charlie', label: 'Beacon Charlie', freq: 175, calc: '(175 − 15) ÷ 7 = 22.86 (Fraction)', isReal: false },
    ],
    context: 'High-altitude radar listening for lost expedition climbers in zero-visibility whiteout',
  },
  {
    id: 'weather_drone',
    name: 'Autonomous Weather Drone Flight Beacon',
    formulaStr: 'f_n = 6n + 11 MHz',
    d: 6,
    c: 11,
    unit: 'MHz',
    logEntries: [
      { id: 1, channel: 1, freq: 17, isCorrupted: false },
      { id: 2, channel: 2, freq: 25, isCorrupted: true, correctFreq: 23, reason: 'Common difference is +6 MHz. 17 + 6 = 23 MHz (not 25 MHz).' },
      { id: 3, channel: 3, freq: 29, isCorrupted: false },
      { id: 4, channel: 4, freq: 35, isCorrupted: false },
    ],
    beacons: [
      { id: 'alpha', label: 'Drone Echo 1', freq: 152, calc: '(152 − 11) ÷ 6 = 23.5 (Fraction)', isReal: false },
      { id: 'bravo', label: 'Drone Echo 2', freq: 161, calc: '(161 − 11) ÷ 6 = 25 (Whole Number)', channelNum: 25, isReal: true },
      { id: 'charlie', label: 'Drone Echo 3', freq: 170, calc: '(170 − 11) ÷ 6 = 26.5 (Fraction)', isReal: false },
    ],
    context: 'Robotic atmospheric probes tracking summit wind shear and barometric drops',
  },
  {
    id: 'seismic_array',
    name: 'Glacial Crevasse Seismic Sensor Grid',
    formulaStr: 'f_n = 9n + 4 Hz',
    d: 9,
    c: 4,
    unit: 'Hz',
    logEntries: [
      { id: 1, channel: 1, freq: 13, isCorrupted: false },
      { id: 2, channel: 2, freq: 22, isCorrupted: false },
      { id: 3, channel: 3, freq: 31, isCorrupted: false },
      { id: 4, channel: 4, freq: 42, isCorrupted: true, correctFreq: 40, reason: 'Step is +9 Hz. 31 + 9 = 40 Hz (not 42 Hz).' },
    ],
    beacons: [
      { id: 'alpha', label: 'Seismic Ping X', freq: 175, calc: '(175 − 4) ÷ 9 = 19 (Whole Number)', channelNum: 19, isReal: true },
      { id: 'bravo', label: 'Seismic Ping Y', freq: 180, calc: '(180 − 4) ÷ 9 = 19.55 (Fraction)', isReal: false },
      { id: 'charlie', label: 'Seismic Ping Z', freq: 192, calc: '(192 − 4) ÷ 9 = 20.88 (Fraction)', isReal: false },
    ],
    context: 'Sub-surface acoustic array warning of imminent ice shelf calving',
  },
];

export default function SpotTheFalseMarker({ onComplete, audioEnabled }) {
  const { narrate, stopAll, sounds } = useAudio(audioEnabled);
  const [scenIdx, setScenIdx] = useState(0);
  const [activeStep, setActiveStep] = useState(1); // 1 or 2
  const [selectedLogId, setSelectedLogId] = useState(null);
  const [correctLogInput, setCorrectLogInput] = useState('');
  const [logAuditDone, setLogAuditDone] = useState(false);
  const [selectedBeaconId, setSelectedBeaconId] = useState(null);
  const [channelInput, setChannelInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [radarLocked, setRadarLocked] = useState(false);
  const [success, setSuccess] = useState(false);

  const scen = RADAR_SCENARIOS[scenIdx];
  const corruptedItem = scen.logEntries.find((e) => e.isCorrupted);
  const realBeacon = scen.beacons.find((b) => b.isReal);

  function handleSelectLogEntry(id) {
    if (logAuditDone) return;
    stopAll();
    setSelectedLogId(id);
    const entry = scen.logEntries.find((e) => e.id === id);

    if (entry.isCorrupted) {
      sounds.correct();
      setFeedback({
        type: 'ok',
        text: `CORRUPTED ENTRY FOUND! Entry ${id} (${entry.freq} ${scen.unit}) violates common difference (+${scen.d} ${scen.unit}). Enter correct value to repair!`,
      });
      narrate([{
        text: `Corrupted entry identified! Enter the correct frequency to repair the transmission log.`,
        style: 'celebration',
      }]);
    } else {
      sounds.wrong();
      setFeedback({
        type: 'err',
        text: `Entry ${id} is mathematically correct (${entry.freq} ${scen.unit}). Check consecutive differences.`,
      });
      narrate([{
        text: `That entry is valid. Check the difference between other consecutive entries.`,
        style: 'encouragement',
      }]);
    }
  }

  function handleRepairLog() {
    stopAll();
    const val = parseInt(correctLogInput, 10);
    if (val === corruptedItem.correctFreq) {
      sounds.correct();
      setLogAuditDone(true);
      setActiveStep(2);
      setFeedback({
        type: 'ok',
        text: `LOG REPAIRED! Entry ${corruptedItem.id} restored to ${corruptedItem.correctFreq} ${scen.unit}. Sequence consistent with ${scen.formulaStr}!`,
      });
      narrate([{
        text: `Log repaired! Telemetry restored. Now analyze the 3 incoming signals using sequence membership testing.`,
        style: 'celebration',
      }]);
    } else {
      sounds.wrong();
      setFeedback({
        type: 'err',
        text: `Incorrect repair value: previous frequency + ${scen.d} = ?`,
      });
      narrate([{
        text: `Add ${scen.d} to the previous channel frequency.`,
        style: 'encouragement',
      }]);
    }
  }

  function handleLockBeacon() {
    stopAll();
    if (!selectedBeaconId) {
      setFeedback({ type: 'err', text: 'Select an incoming beacon from the options below!' });
      return;
    }

    const beacon = scen.beacons.find((b) => b.id === selectedBeaconId);
    const chanVal = parseInt(channelInput, 10);

    if (beacon.isReal && chanVal === realBeacon.channelNum) {
      sounds.correct();
      setSuccess(true);
      setRadarLocked(true);
      setFeedback({
        type: 'ok',
        text: `HOMING LOCK ESTABLISHED! ${beacon.label} (${beacon.freq} ${scen.unit}) is confirmed on Channel ${realBeacon.channelNum}! Rescue team dispatched!`,
      });
      narrate([{
        text: `Homing lock established! Channel ${realBeacon.channelNum} verified. Rescue team dispatched to the peak!`,
        style: 'celebration',
      }]);
      if (sounds.levelUp) setTimeout(() => sounds.levelUp(), 800);
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 3500);
    } else if (!beacon.isReal) {
      sounds.wrong();
      setFeedback({
        type: 'err',
        text: `FALSE PULSE! (${beacon.freq} − ${scen.c}) ÷ ${scen.d} is not a whole number. It violates sequence membership!`,
      });
      narrate([{
        text: `That signal is atmospheric static. Channel number must be an exact positive whole number.`,
        style: 'emphasis',
      }]);
    } else {
      sounds.wrong();
      setFeedback({
        type: 'err',
        text: `Correct beacon, but wrong channel n. Solve: (${beacon.freq} − ${scen.c}) ÷ ${scen.d} = ?`,
      });
      narrate([{
        text: `Subtract ${scen.c} from the frequency, then divide by ${scen.d} to find channel n.`,
        style: 'encouragement',
      }]);
    }
  }

  function nextScenario() {
    stopAll();
    setScenIdx((s) => (s + 1) % RADAR_SCENARIOS.length);
    setActiveStep(1);
    setSelectedLogId(null);
    setCorrectLogInput('');
    setLogAuditDone(false);
    setSelectedBeaconId(null);
    setChannelInput('');
    setFeedback(null);
    setRadarLocked(false);
    setSuccess(false);
  }

  return (
    <div className="station-container">
      {/* Compact Top Header */}
      <div className="station-top-header">
        <div className="station-badge-group">
          <span className="station-pill-label">STATION D · SEQUENCE MEMBERSHIP &amp; AUDITING</span>
          <h3 className="station-headline">📡 {scen.name}</h3>
        </div>
        <div className="station-metric-pill">
          <span className="metric-title">CARRIER FREQUENCY RULE</span>
          <span className="metric-val">{scen.formulaStr}</span>
        </div>
      </div>

      {/* Main 2-Column Body: Fits in 1 Screen with No Scroll */}
      <div className="station-split-body">
        {/* Left Column: Phosphor Radar Display */}
        <div className="station-left-sim">
          <div className="radar-screen-box">
            <svg className="radar-svg" viewBox="0 0 190 190">
              <defs>
                <radialGradient id="radarSweepGradD">
                  <stop offset="0%" stopColor="#10e5a5" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#10e5a5" stopOpacity="0" />
                </radialGradient>
              </defs>

              <circle cx="95" cy="95" r="85" fill="#031510" stroke="#059669" strokeWidth="1.5" />
              <circle cx="95" cy="95" r="64" fill="none" stroke="#047857" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="95" cy="95" r="42" fill="none" stroke="#047857" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="95" cy="95" r="21" fill="none" stroke="#047857" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="95" y1="10" x2="95" y2="180" stroke="#047857" strokeWidth="0.8" opacity="0.6" />
              <line x1="10" y1="95" x2="180" y2="95" stroke="#047857" strokeWidth="0.8" opacity="0.6" />

              <g className="radar-rotating-beam">
                <line x1="95" y1="95" x2="180" y2="95" stroke="#10e5a5" strokeWidth="2" />
                <path d="M 95 95 L 180 95 A 85 85 0 0 0 155 35 Z" fill="url(#radarSweepGradD)" />
              </g>

              {scen.beacons.map((b, idx) => {
                const angles = [45, 140, 290];
                const radii = [55, 68, 45];
                const rad = (angles[idx] * Math.PI) / 180;
                const bx = 95 + radii[idx] * Math.cos(rad);
                const by = 95 + radii[idx] * Math.sin(rad);
                const isSelected = selectedBeaconId === b.id;

                return (
                  <g key={b.id} className="radar-blip-group" onClick={() => logAuditDone && setSelectedBeaconId(b.id)}>
                    <circle
                      cx={bx}
                      cy={by}
                      r={isSelected ? 5.5 : 3.5}
                      fill={radarLocked && b.isReal ? '#f59e0b' : isSelected ? '#38bdf8' : '#10e5a5'}
                      className="blip-pulse"
                    />
                    {isSelected && (
                      <circle cx={bx} cy={by} r="9" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="2 2" />
                    )}
                    <text x={bx} y={by - 7} fill="#f8fafc" fontSize="7" textAnchor="middle" fontWeight="bold">
                      {b.freq} {scen.unit}
                    </text>
                  </g>
                );
              })}

              <circle cx="95" cy="95" r="3" fill="#f8fafc" />
            </svg>
          </div>
        </div>

        {/* Right Column: Guided Active Investigation */}
        <div className="station-right-guided">
          {/* Step Switcher */}
          <div className="guided-step-tabs">
            <button
              className={`step-tab-btn ${activeStep === 1 ? 'active' : ''} ${logAuditDone ? 'done' : ''}`}
              onClick={() => setActiveStep(1)}
            >
              {logAuditDone ? '✓' : '1'} Audit Log
            </button>
            <button
              className={`step-tab-btn ${activeStep === 2 ? 'active' : ''} ${success ? 'done' : ''}`}
              onClick={() => logAuditDone && setActiveStep(2)}
              disabled={!logAuditDone}
            >
              {success ? '✓' : '2'} Rescue Channel Lock
            </button>
          </div>

          {/* Active Step Content */}
          <div className="active-investigation-box">
            {activeStep === 1 && (
              <div className="step-pane">
                <h4 className="step-pane-title">1. Audit Surveyor Transmission Log</h4>
                <p className="step-pane-desc">Tap the corrupted entry violating common difference (+{scen.d} {scen.unit}):</p>
                <div className="log-entries-list compact">
                  {scen.logEntries.map((entry) => {
                    const isSelected = selectedLogId === entry.id;
                    const isRepaired = logAuditDone && entry.isCorrupted;
                    return (
                      <div
                        key={entry.id}
                        className={`log-row-item ${isSelected ? (entry.isCorrupted ? 'row-corrupted' : 'row-nominal') : ''} ${isRepaired ? 'row-repaired' : ''}`}
                        onClick={() => handleSelectLogEntry(entry.id)}
                      >
                        <span className="log-col-ch">Ch {entry.channel}</span>
                        <span className="log-col-freq">
                          {isRepaired ? `${entry.correctFreq} ${scen.unit} (Fixed)` : `${entry.freq} ${scen.unit}`}
                        </span>
                        <span className="log-col-status">
                          {isRepaired ? '✅ OK' : isSelected ? (entry.isCorrupted ? '⚠️ CORRUPTED' : '✓ OK') : 'Tap'}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {selectedLogId === corruptedItem.id && !logAuditDone && (
                  <div className="repair-input-box">
                    <span className="repair-lbl">
                      Correct Ch {corruptedItem.channel} ({scen.d} × {corruptedItem.channel} + {scen.c}):
                    </span>
                    <div className="flex-input-grp">
                      <input
                        type="number"
                        className="telemetry-input"
                        placeholder="Correct frequency..."
                        value={correctLogInput}
                        onChange={(e) => setCorrectLogInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleRepairLog()}
                      />
                      <button className="btn-action-primary" onClick={handleRepairLog}>
                        Repair Log
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeStep === 2 && (
              <div className="step-pane">
                <h4 className="step-pane-title">2. Sequence Membership: Lock Emergency Channel</h4>
                <p className="step-pane-desc">Which incoming beacon yields an integer channel n in ({scen.d}n + {scen.c} = f)?</p>

                <div className="beacons-choice-grid compact">
                  {scen.beacons.map((b) => {
                    const isSelected = selectedBeaconId === b.id;
                    return (
                      <div
                        key={b.id}
                        className={`beacon-card ${isSelected ? 'selected' : ''}`}
                        onClick={() => setSelectedBeaconId(b.id)}
                      >
                        <span className="beacon-name">{b.label}</span>
                        <span className="beacon-freq">{b.freq} {scen.unit}</span>
                        <span className="beacon-sel-btn">{isSelected ? 'Selected ✓' : 'Select'}</span>
                      </div>
                    );
                  })}
                </div>

                {selectedBeaconId && (
                  <div className="channel-solver-row">
                    <span className="channel-solver-lbl">
                      Channel n = ({scen.beacons.find((b) => b.id === selectedBeaconId)?.freq} − {scen.c}) ÷ {scen.d}:
                    </span>
                    <div className="flex-input-grp">
                      <input
                        type="number"
                        className="telemetry-input large"
                        placeholder="Enter whole number n..."
                        value={channelInput}
                        onChange={(e) => setChannelInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleLockBeacon()}
                        disabled={success}
                      />
                      <button className="btn-action-primary glow" onClick={handleLockBeacon} disabled={success}>
                        {success ? 'Locked 🏆' : 'Lock Frequency 📡'}
                      </button>
                    </div>
                  </div>
                )}
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

          {/* Scenario Switcher */}
          <div className="station-sub-actions">
            <button className="btn-subtle" onClick={nextScenario}>
              🔄 Switch Radar Frequency ({scen.name})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
