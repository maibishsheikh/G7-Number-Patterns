// src/components/phases/StoryPhase.jsx
import React, { useEffect, useState } from 'react';
import './StoryPhase.css';
import { STORY_PANELS } from '../../data/storyContent.js';
import { useAudio } from '../../hooks/useAudio.js';
import { storyNarration } from '../../utils/narration.js';

import story1 from '../../assets/story/1.png';
import story2 from '../../assets/story/2.png';
import story3 from '../../assets/story/3.png';
import story4 from '../../assets/story/4.png';

// These 4 files are placeholder art (see src/assets/story/ART_BRIEF.md) — no
// illustrated art has been produced for this module yet. Each is a simple
// dashed-frame placeholder at the reference architecture's exact image
// dimensions (1376×768) so a real illustration can be dropped in later by
// simply replacing the file — no component code changes needed. If an image
// ever fails to load, the CSS-framed gradient/emoji fallback below takes over.
const STORY_IMAGES = [story1, story2, story3, story4];

function StoryImage({ panel }) {
  const [imgError, setImgError] = useState(false);
  const imageSrc = STORY_IMAGES[panel.panel] || STORY_IMAGES[0];

  useEffect(() => {
    setImgError(false);
  }, [panel.panel]);

  return (
    <div className="story-image-container">
      {!imgError && imageSrc ? (
        <>
          <img
            key={panel.panel}
            src={imageSrc}
            alt={panel.title}
            onError={() => setImgError(true)}
            className="story-full-img"
          />
          <div className="story-image-overlay" />
        </>
      ) : (
        <div className="story-img-fallback" style={{ background: panel.imageBg }}>
          <span className="fallback-emoji">{panel.imageEmoji}</span>
          <span className="fallback-title">{panel.title}</span>
          <span className="fallback-highlight">{panel.highlight}</span>
        </div>
      )}
    </div>
  );
}

export default function StoryPhase({ state, dispatch }) {
  const panel = STORY_PANELS[state?.storyPanel || 0] || STORY_PANELS[0];
  const { narrate, stopAll } = useAudio(state?.audioEnabled ?? true);
  const totalPanels = STORY_PANELS.length;
  const isLastPanel = (state?.storyPanel || 0) >= totalPanels - 1;

  useEffect(() => {
    stopAll();
    const timer = setTimeout(() => narrate(storyNarration(state?.storyPanel || 0)), 300);
    return () => { clearTimeout(timer); stopAll(); };
  }, [state?.storyPanel, narrate, stopAll]);

  function handleNext() {
    stopAll();
    dispatch({ type: 'NEXT_STORY_PANEL' });
  }

  function handlePrev() {
    stopAll();
    dispatch({ type: 'PREV_STORY_PANEL' });
  }

  return (
    <div className="story-wrap">
      <div className="story-container anim-slide-up" key={state?.storyPanel || 0}>
        {/* Top Progress Bar Row */}
        <div className="story-progress-bar-row">
          <div className="story-track">
            <div
              className="story-fill"
              style={{ width: `${(((state?.storyPanel || 0) + 1) / totalPanels) * 100}%` }}
            />
          </div>
          <span className="story-counter-text">{(state?.storyPanel || 0) + 1} / {totalPanels}</span>
        </div>

        {/* Main Horizontal Story Card */}
        <div className="story-main-card">
          {/* Left: Complete Image in full original frame */}
          <div className="story-image-section">
            <StoryImage panel={panel} />
          </div>

          {/* Right: Story Content */}
          <div className="story-content-section">
            <h2 className="story-title">{panel.title}</h2>
            <p className="story-text">{panel.text}</p>

            {panel.highlight && (
              <div className="story-prompt-pill">
                <span className="prompt-icon">💡</span>
                <span className="prompt-text">{panel.highlight}</span>
              </div>
            )}

            {/* Character Badge */}
            <div className="story-character-badge">
              <div className="character-avatar-circle">
                <span className="character-emoji">{panel.characterEmoji || '👦'}</span>
              </div>
              <span className="character-name">{panel.character || 'Farhan'}</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Centered Dots + Action Buttons */}
        <div className="story-footer-nav">
          <div className="story-dots-center">
            {STORY_PANELS.map((_, i) => (
              <span
                key={i}
                className={`story-nav-dot ${i === (state?.storyPanel || 0) ? 'active' : ''} ${i < (state?.storyPanel || 0) ? 'done' : ''}`}
              />
            ))}
          </div>

          <div className="story-nav-actions">
            {(state?.storyPanel || 0) > 0 && (
              <button
                type="button"
                id="story-prev-btn"
                className="btn btn-outline btn-sm story-prev-btn"
                onClick={handlePrev}
                aria-label="Previous story"
              >
                ← Back
              </button>
            )}
            <button
              type="button"
              id="story-next-btn"
              className="btn btn-primary btn-sm story-next-btn"
              onClick={handleNext}
              aria-label={isLastPanel ? 'Start Simulating' : 'Next story'}
            >
              {!isLastPanel ? 'Next →' : 'Simulate! 🧪'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
