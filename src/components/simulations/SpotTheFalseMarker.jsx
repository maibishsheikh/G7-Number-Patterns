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
    context: 'High-altitude radar listening for lost expedition climbers during zero-visibility whiteout',
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
    context: 'Monitoring robotic atmospheric probes tracking summit wind shear and barometric drops',
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
        text: `CORRUPTED ENTRY IDENTIFIED! Entry ${id} (${entry.freq} ${scen.unit}) violates common difference (+${scen.d} ${scen.unit}). Enter the correct frequency to repair the log!`,
      });
      narrate([{
        text: `Corrupted entry identified! Enter the correct frequency to repair the transmission log.`,
        style: 'celebration',
      }]);
    } else {
      sounds.wrong();
      setFeedback({
        type: 'err',
        text: `Entry ${id} is mathematically correct (${entry.freq} ${scen.unit}). Check the difference between other consecutive entries.`,
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
      setFeedback({
        type: 'ok',
        text: `LOG REPAIRED! Entry ${corruptedItem.id} restored to ${corruptedItem.correctFreq} ${scen.unit}. Sequence now consistent with rule ${scen.formulaStr}!`,
      });
      narrate([{
        text: `Log repaired! Telemetry restored. Now analyze the 3 incoming signals using sequence membership testing.`,
        style: 'celebration',
      }]);
    } else {
      sounds.wrong();
      setFeedback({
        type: 'err',
        text: `Incorrect repair value. Calculate: previous frequency + ${scen.d} = ?`,
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
      setFeedback({ type: 'err', text: 'Select an incoming beacon from the radar screen first!' });
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
        text: `HOMING LOCK ESTABLISHED! ${beacon.label} (${beacon.freq} ${scen.unit}) is confirmed on Channel ${realBeacon.channelNum}! Audio connection active: "Expedition rescued!"`,
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
        text: `FALSE PULSE! For ${beacon.label}: (${beacon.freq} − ${scen.c}) ÷ ${scen.d} is not a whole number. It violates sequence membership!`,
      });
      narrate([{
        text: `That signal is atmospheric static. Channel number must be an exact positive whole number.`,
        style: 'emphasis',
      }]);
    } else {
      sounds.wrong();
      setFeedback({
        type: 'err',
        text: `Correct beacon selected, but channel number is wrong. Solve: (${beacon.freq} − ${scen.c}) ÷ ${scen.d} = ?`,
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
      {/* Station Header */}
      <div className="station-top-header">
        <div className="station-badge-group">
          <span className="station-pill-label">STATION D · SEQUENCE MEMBERSHIP & TELEMETRY AUDIT</span>
          <h3 className="station-headline">📡 {scen.name}</h3>
          <p className="station-subtext">{scen.context}</p>
        </div>
        <div className="station-metric-pill">
          <span className="metric-title">CARRIER FREQUENCY RULE</span>
          <span className="metric-val">{scen.formulaStr}</span>
        </div>
      </div>

      {/* Main Radar Screen & Incoming Signals Display */}
      <div className="radar-sim-viewport">
        {/* Phosphor Green Radar Screen */}
        <div className="radar-screen-box">
          <svg className="radar-svg" viewBox="0 0 200 200">
            <defs>
              <radialGradient id="radarSweepGrad">
                <stop offset="0%" stopColor="#10e5a5" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#10e5a5" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Radar Scope Rings */}
            <circle cx="100" cy="100" r="90" fill="#031510" stroke="#059669" strokeWidth="1.5" />
            <circle cx="100" cy="100" r="68" fill="none" stroke="#047857" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="100" cy="100" r="45" fill="none" stroke="#047857" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="100" cy="100" r="22" fill="none" stroke="#047857" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="100" y1="10" x2="100" y2="190" stroke="#047857" strokeWidth="0.8" opacity="0.6" />
            <line x1="10" y1="100" x2="190" y2="100" stroke="#047857" strokeWidth="0.8" opacity="0.6" />

            {/* Rotating Radar Sweep Line */}
            <g className="radar-rotating-beam">
              <line x1="100" y1="100" x2="190" y2="100" stroke="#10e5a5" strokeWidth="2" />
              <path d="M 100 100 L 190 100 A 90 90 0 0 0 163 36 Z" fill="url(#radarSweepGrad)" />
            </g>

            {/* Radar Target Blips */}
            {scen.beacons.map((b, idx) => {
              const angles = [45, 140, 290];
              const radii = [60, 75, 50];
              const rad = (angles[idx] * Math.PI) / 180;
              const bx = 100 + radii[idx] * Math.cos(rad);
              const by = 100 + radii[idx] * Math.sin(rad);
              const isSelected = selectedBeaconId === b.id;

              return (
                <g key={b.id} className="radar-blip-group" onClick={() => logAuditDone && setSelectedBeaconId(b.id)}>
                  <circle
                    cx={bx}
                    cy={by}
                    r={isSelected ? 6 : 4}
                    fill={radarLocked && b.isReal ? '#f59e0b' : isSelected ? '#38bdf8' : '#10e5a5'}
                    className="blip-pulse"
                  />
                  {isSelected && (
                    <circle cx={bx} cy={by} r="10" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="2 2" />
                  )}
                  <text x={bx} y={by - 8} fill="#f8fafc" fontSize="7" textAnchor="middle" fontWeight="bold">
                    {b.freq} {scen.unit}
                  </text>
                </g>
              );
            })}

            {/* Center Observatory Icon */}
            <circle cx="100" cy="100" r="3" fill="#f8fafc" />
          </svg>
        </div>

        {/* Telemetry Log Audit Console */}
        <div className="radar-telemetry-console">
          <div className="console-header">
            <span className="console-title">📜 SURVEYOR TELEMETRY LOG AUDIT</span>
            <span className="console-formula-tag">Rule: {scen.formulaStr}</span>
          </div>

          <p className="console-prompt">
            {!logAuditDone
              ? 'Tap the line that contains a mathematical error in the common difference:'
              : '✅ Telemetry log repaired! All channels verified.'}
          </p>

          <div className="log-entries-list">
            {scen.logEntries.map((entry) => {
              const isSelected = selectedLogId === entry.id;
              const isRepaired = logAuditDone && entry.isCorrupted;

              return (
                <div
                  key={entry.id}
                  className={`log-row-item ${isSelected ? (entry.isCorrupted ? 'row-corrupted' : 'row-nominal') : ''} ${isRepaired ? 'row-repaired' : ''}`}
                  onClick={() => handleSelectLogEntry(entry.id)}
                >
                  <span className="log-col-ch">Channel {entry.channel}</span>
                  <span className="log-col-freq">
                    {isRepaired ? (
                      <strong className="repaired-freq">{entry.correctFreq} {scen.unit} (Fixed)</strong>
                    ) : (
                      `${entry.freq} ${scen.unit}`
                    )}
                  </span>
                  <span className="log-col-status">
                    {isRepaired
                      ? '✅ Restored'
                      : isSelected
                      ? entry.isCorrupted
                        ? '⚠️ CORRUPTED'
                        : '✓ Nominal'
                      : 'Audit Line'}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Repair Input Form when corrupted item is selected */}
          {selectedLogId === corruptedItem.id && !logAuditDone && (
            <div className="repair-input-box">
              <span className="repair-lbl">
                Correct frequency for Channel {corruptedItem.channel} ({scen.d} × {corruptedItem.channel} + {scen.c}):
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
      </div>

      {/* Guided Engineering Investigation Controls */}
      <div className="station-interactive-phases">
        {/* Step 1: Telemetry Log Status */}
        <div className={`investigation-card ${logAuditDone ? 'is-complete' : 'is-active'}`}>
          <div className="inv-header">
            <span className="inv-step-num">1</span>
            <div className="inv-title-wrap">
              <h4 className="inv-title">Audit Transmission Log & Fix Step Error</h4>
              <p className="inv-desc">Identify the corrupted line violating the common difference of +{scen.d} {scen.unit}.</p>
            </div>
            {logAuditDone && <span className="inv-check-badge">✅ LOG REPAIRED</span>}
          </div>
          {logAuditDone && (
            <div className="inv-success-pill">
              <span>Telemetry restored! Channel {corruptedItem.channel} corrected to <strong>{corruptedItem.correctFreq} {scen.unit}</strong>.</span>
            </div>
          )}
        </div>

        {/* Step 2: Sequence Membership Emergency Lock */}
        {logAuditDone && (
          <div className={`investigation-card ${success ? 'is-complete' : 'is-active'}`}>
            <div className="inv-header">
              <span className="inv-step-num">2</span>
              <div className="inv-title-wrap">
                <h4 className="inv-title">Sequence Membership Test: Lock Real Emergency Beacon</h4>
                <p className="inv-desc">
                  To be an authentic beacon, solving <strong>{scen.d}n + {scen.c} = frequency</strong> must yield an exact <strong>positive whole number n</strong>!
                </p>
              </div>
              {success && <span className="inv-check-badge">🏆 RESCUE CHANNEL SECURED</span>}
            </div>

            {!success ? (
              <div className="membership-test-box">
                {/* 3 Beacon Candidate Cards */}
                <div className="beacons-choice-grid">
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
                        <div className="beacon-test-math">
                          <code>({b.freq} − {scen.c}) ÷ {scen.d} = ?</code>
                        </div>
                        <span className="beacon-sel-btn">{isSelected ? 'Selected' : 'Test This Signal'}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Solving input when beacon is selected */}
                {selectedBeaconId && (
                  <div className="channel-solver-row">
                    <span className="channel-solver-lbl">
                      Channel Number n for {scen.beacons.find((b) => b.id === selectedBeaconId)?.label}:
                    </span>
                    <div className="flex-input-grp">
                      <input
                        type="number"
                        className="telemetry-input large"
                        placeholder="Enter whole number n..."
                        value={channelInput}
                        onChange={(e) => setChannelInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleLockBeacon()}
                      />
                      <button className="btn-action-primary glow" onClick={handleLockBeacon}>
                        📡 Lock Rescue Frequency
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="inv-success-pill celebration">
                <span>📡 Beacon Bravo locked at Channel {realBeacon.channelNum}! Sequence membership verified (n = 21 is a positive integer). Rescue team dispatched!</span>
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

        {/* Scenario Switcher */}
        <div className="station-sub-actions">
          <button className="btn-subtle" onClick={nextScenario}>
            🔄 Switch Radar Frequency ({scen.name})
          </button>
        </div>
      </div>
    </div>
  );
}
