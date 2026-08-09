// src/components/DeathValleyViz.jsx
import React, { useState, useEffect } from 'react';
import { CheckCircle2, ShieldAlert, Clock } from 'lucide-react';

export default function DeathValleyViz() {
  const [phase, setPhase] = useState(0);
  const [autoAdvance, setAutoAdvance] = useState(true);

  useEffect(() => {
    let timer;
    if (autoAdvance) {
      timer = setInterval(() => {
        setPhase((p) => (p + 1) % 4);
      }, 3500);
    }
    return () => clearInterval(timer);
  }, [autoAdvance]);

  const phases = [
    {
      title: '1. Safe Zone',
      desc: 'Pool size n ≥ 3',
      status: 'safe',
      icon: <CheckCircle2 className="phase-icon safe" size={24} />,
      pool: [3, 4, 5, 6, 7],
      text: 'Multiple candidates remain. You ask interval questions to narrow your pool without immediate risk.',
    },
    {
      title: '2. Approaching Danger',
      desc: 'Pool size n = 2',
      status: 'warning',
      icon: <Clock className="phase-icon warning" size={24} />,
      pool: [4, 5],
      text: 'You have 2 candidates left. An interval question or exact guess narrows your pool to 1.',
    },
    {
      title: '3. DEATH VALLEY',
      desc: 'Pool size n = 1 (Opponent Turn)',
      status: 'critical',
      icon: <ShieldAlert className="phase-icon critical" size={24} />,
      pool: [5],
      text: '⚠️ You deduced the exact answer (#5)! But your turn is OVER. You must pass control to the opponent, who gets a free turn to guess before you can act!',
    },
    {
      title: '4. Declaration Turn',
      desc: 'Your Next Turn Arrives',
      status: 'declared',
      icon: <CheckCircle2 className="phase-icon declared" size={24} />,
      pool: [5],
      text: '✓ If the opponent missed their turn, you can now declare "Is your candidate #5?" and win the game!',
    },
  ];

  const current = phases[phase];

  return (
    <div className="death-valley-wrapper">
      <div className="dv-controls-row">
        <div className="dv-tabs">
          {phases.map((p, idx) => (
            <button
              key={idx}
              className={`dv-tab ${phase === idx ? 'active' : ''}`}
              onClick={() => {
                setPhase(idx);
                setAutoAdvance(false);
              }}
            >
              {p.title}
            </button>
          ))}
        </div>
        <button
          className="auto-toggle-btn"
          onClick={() => setAutoAdvance(!autoAdvance)}
        >
          {autoAdvance ? 'Pause Animation' : 'Auto Play Animation'}
        </button>
      </div>

      {/* Active Phase Display */}
      <div className={`dv-card-box status-${current.status}`}>
        <div className="dv-card-header">
          {current.icon}
          <div>
            <h4>{current.title}</h4>
            <span className="dv-sub">{current.desc}</span>
          </div>
        </div>

        <div className="dv-pool-cards">
          {current.pool.map((num) => (
            <div key={num} className={`dv-num-card ${current.status === 'critical' ? 'pulse-danger' : ''}`}>
              #{num}
            </div>
          ))}
        </div>

        <p className="dv-explanation-text">{current.text}</p>
      </div>
    </div>
  );
}
