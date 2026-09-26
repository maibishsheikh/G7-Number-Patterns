// src/components/shared/PatternVisual.jsx
import React from 'react';

const KIND_ICON = {
  even: '➗',
  odd: '➕',
  square: '⬛',
  triangular: '🔺',
  cube: '🧊',
};

export default function PatternVisual({ type, data, compact = false }) {
  if (!data) return null;

  // ── A sequence of terms shown left-to-right with their position numbers ──
  if (type === 'sequence-strip') {
    const { terms, startPosition = 1 } = data;
    return (
      <div style={{ display: 'flex', gap: compact ? '6px' : '10px', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'flex-end', padding: '10px 14px', background: 'rgba(255,255,255,0.06)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.12)' }}>
        {terms.map((term, i) => {
          const isMystery = term === '?';
          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <span
                style={{
                  minWidth: compact ? '38px' : '48px',
                  padding: compact ? '6px 8px' : '8px 12px',
                  textAlign: 'center',
                  fontWeight: 800,
                  fontSize: compact ? '0.95rem' : '1.15rem',
                  fontFamily: 'var(--font-display)',
                  color: isMystery ? 'var(--gold)' : '#fff',
                  background: isMystery ? 'rgba(255,193,7,0.18)' : 'rgba(255,255,255,0.1)',
                  border: isMystery ? '2px dashed var(--gold)' : '1.5px solid rgba(255,255,255,0.25)',
                  borderRadius: '10px',
                }}
              >
                {term}
              </span>
              <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', fontWeight: 700 }}>
                #{startPosition + i}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  // ── A growing figure/diagram pattern, stage by stage ──
  if (type === 'figure-grid') {
    const { stages, dotEmoji = '⛺' } = data;
    return (
      <div style={{ display: 'flex', gap: compact ? '8px' : '14px', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'flex-start', padding: '10px 14px', background: 'rgba(255,255,255,0.06)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.12)' }}>
        {stages.map((s) => (
          <div key={s.stage} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', minWidth: '64px' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${Math.min(5, Math.ceil(Math.sqrt(s.count)))}, 1fr)`,
                gap: '2px',
                padding: '6px',
                background: 'rgba(255,255,255,0.08)',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.15)',
              }}
            >
              {Array.from({ length: s.count }).map((_, i) => (
                <span key={i} style={{ fontSize: compact ? '0.7rem' : '0.85rem', lineHeight: 1 }}>{dotEmoji}</span>
              ))}
            </div>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--gold)' }}>Stage {s.stage}</span>
            <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>{s.count} total</span>
          </div>
        ))}
      </div>
    );
  }

  // ── The coefficient/constant of "an + b", color-coded ──
  if (type === 'formula-breakdown') {
    const { coefficient, constant } = data;
    return (
      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', alignItems: 'center', padding: '10px 16px', background: 'rgba(255,255,255,0.06)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.12)', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: compact ? '1.05rem' : '1.3rem' }}>
        <span style={{ padding: '4px 10px', borderRadius: '8px', background: 'rgba(76,175,80,0.2)', border: '1.5px solid var(--green)', color: 'var(--green)' }}>
          {coefficient === 1 ? 'n' : coefficient === -1 ? '−n' : `${coefficient}n`}
        </span>
        <span style={{ color: 'var(--color-text-muted)' }}>{constant >= 0 ? '+' : '−'}</span>
        <span style={{ padding: '4px 10px', borderRadius: '8px', background: 'rgba(124,92,191,0.25)', border: '1.5px solid var(--purple)', color: '#d9c8ff' }}>
          {Math.abs(constant)}
        </span>
      </div>
    );
  }

  // ── A named sequence (even/odd/square/triangular/cube) with its first few terms ──
  if (type === 'named-sequence-icon') {
    const { kind, terms } = data;
    return (
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center', padding: '10px 14px', background: 'rgba(255,255,255,0.06)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.12)', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '1.5rem' }}>{KIND_ICON[kind] || '🔢'}</span>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {terms.map((t, i) => (
            <span key={i} style={{ padding: '4px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', border: '1.5px solid rgba(255,255,255,0.25)', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
              {t}
            </span>
          ))}
          <span style={{ padding: '4px 6px', color: 'var(--color-text-muted)', fontWeight: 800 }}>…</span>
        </div>
      </div>
    );
  }

  return null;
}
