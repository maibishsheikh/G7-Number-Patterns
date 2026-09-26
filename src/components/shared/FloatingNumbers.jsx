// src/components/shared/FloatingNumbers.jsx
import React, { useMemo } from 'react';
import './FloatingNumbers.css';

const TRAIL_SYMBOLS = [
  '3, 7, 11…',
  'T_n = 4n − 1',
  'a + (n − 1)d',
  'd = +4',
  'n²',
  '2n + 1',
  'T₅₀ = 199',
  '5n − 2',
  'Δ = 5',
  'n³',
  'P_n = 6n + 8',
  'f_n = 7n + 15',
  'T_n = dn + c',
  'B_n = 4n + 1',
  'n = 21',
  '2, 5, 8, 11…',
  'T₁ = 14',
  'Δ = +6',
];

export default function FloatingNumbers() {
  const items = useMemo(() => {
    return Array.from({ length: 18 }, (_, i) => ({
      id: i,
      symbol: TRAIL_SYMBOLS[i % TRAIL_SYMBOLS.length],
      left: `${(i * 5.6 + 3) % 94}%`,
      delay: `${(i * 1.3) % 15}s`,
      duration: `${18 + (i % 5) * 4}s`,
      size: `${1.1 + (i % 4) * 0.4}rem`,
    }));
  }, []);

  return (
    <div className="floating-symbols-container" aria-hidden="true">
      {items.map((item) => (
        <span
          key={item.id}
          className="floating-money-symbol"
          style={{
            left: item.left,
            animationDelay: item.delay,
            animationDuration: item.duration,
            fontSize: item.size,
          }}
        >
          {item.symbol}
        </span>
      ))}
    </div>
  );
}
