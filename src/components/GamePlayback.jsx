// src/components/GamePlayback.jsx
import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, RotateCcw, Play, Pause, AlertTriangle } from 'lucide-react';

export default function GamePlayback() {
  const [currentMove, setCurrentMove] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const moves = [
    {
      step: 0,
      title: "Initial Game Setup",
      p1: { question: "Initial Pool", answer: "", n: 20, pool: Array.from({ length: 20 }, (_, i) => i + 1) },
      p2: { question: "Initial Pool", answer: "", m: 20, pool: Array.from({ length: 20 }, (_, i) => i + 1) },
      comment: "Both players start with 20 candidate faces.",
    },
    {
      step: 1,
      title: "Turn 1: Opening Questions",
      p1: { question: "[1..9]?", answer: "YES", n: 9, pool: [1, 2, 3, 4, 5, 6, 7, 8, 9] },
      p2: { question: "[1..8]?", answer: "NO", m: 12, pool: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20] },
      comment: "P1 narrows candidates to 9; P2 eliminates 8 candidates.",
    },
    {
      step: 2,
      title: "Turn 2: Mid-Game Narrowing",
      p1: { question: "[1..5]?", answer: "YES", n: 5, pool: [1, 2, 3, 4, 5] },
      p2: { question: "[9..12]?", answer: "NO", m: 8, pool: [13, 14, 15, 16, 17, 18, 19, 20] },
      comment: "P1 reduces pool to 5 candidates; P2 has 8 candidates.",
    },
    {
      step: 3,
      title: "Turn 3: Approaching Deduction",
      p1: { question: "[1..3]?", answer: "NO", n: 2, pool: [4, 5] },
      p2: { question: "[13..13]?", answer: "NO", m: 7, pool: [14, 15, 16, 17, 18, 19, 20] },
      comment: "P1 reaches n=2 candidates ({4, 5}). P2 has 7 candidates.",
    },
    {
      step: 4,
      title: "Turn 4: The Critical Discrepancy",
      p1: { question: "[4..4]?", answer: "NO", n: 1, pool: [5], winner: true },
      p2: { question: "—", answer: "", m: 7, pool: [14, 15, 16, 17, 18, 19, 20], skipped: true },
      comment: "P1 asks '[4]?' and gets NO, leaving pool {5} (n=1). In Dr. Nica's Race-to-1 model, P1 wins instantly! In real Guess Who, P1's turn ENDS, entering Death Valley while P2 gets their turn to guess!",
    },
  ];

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentMove((prev) => {
          if (prev >= moves.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2500);
    }
    return () => clearInterval(timer);
  }, [isPlaying, moves.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        if (currentMove < moves.length - 1) setCurrentMove((m) => m + 1);
      } else if (e.key === 'ArrowLeft') {
        if (currentMove > 0) setCurrentMove((m) => m - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentMove, moves.length]);

  const state = moves[currentMove];
  const isLast = currentMove === moves.length - 1;

  return (
    <div className="game-playback-container">
      <div className="playback-controls-bar">
        <div className="playback-btns">
          <button
            onClick={() => setCurrentMove((m) => Math.max(0, m - 1))}
            className="ctrl-btn"
            disabled={currentMove === 0}
          >
            <ChevronLeft size={18} /> Prev
          </button>

          <button onClick={() => setIsPlaying(!isPlaying)} className="ctrl-btn highlight">
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            {isPlaying ? 'Pause' : 'Auto Play'}
          </button>

          <button
            onClick={() => setCurrentMove((m) => Math.min(moves.length - 1, m + 1))}
            className="ctrl-btn"
            disabled={isLast}
          >
            Next <ChevronRight size={18} />
          </button>

          <button onClick={() => setCurrentMove(0)} className="ctrl-btn">
            <RotateCcw size={18} /> Reset
          </button>
        </div>

        <div className="step-indicator">
          Move {currentMove} of {moves.length - 1}: <strong>{state.title}</strong>
        </div>
      </div>

      {/* Commentary Banner */}
      <div className="playback-commentary">
        <span className="comment-tag">Analysis</span>
        <span className="comment-text">{state.comment}</span>
      </div>

      {/* Side by side state */}
      <div className="playback-grid">
        {/* P1 */}
        <div className={`playback-card ${state.p1.winner ? 'winner-glow' : ''}`}>
          <div className="p-header">
            <h4>Player 1 (Me)</h4>
            <span className="pool-badge">Pool n = {state.p1.n}</span>
          </div>

          {state.p1.question && (
            <div className="move-box">
              <span className="q-label">Question:</span>
              <span className="q-val">{state.p1.question}</span>
              {state.p1.answer && (
                <span className={`ans-pill ${state.p1.answer === 'YES' ? 'yes' : 'no'}`}>
                  {state.p1.answer}
                </span>
              )}
            </div>
          )}

          <div className="candidates-flex">
            {state.p1.pool.map((num) => (
              <span key={num} className={`num-pill ${state.p1.n === 1 ? 'last-one' : ''}`}>
                {num}
              </span>
            ))}
          </div>

          {state.p1.winner && (
            <div className="discrepancy-alert">
              <AlertTriangle size={18} />
              <span>Race-to-1 Model: Declares P1 instant winner at n=1.</span>
            </div>
          )}
        </div>

        {/* P2 */}
        <div className={`playback-card ${state.p2.skipped ? 'skipped-glow' : ''}`}>
          <div className="p-header">
            <h4>Player 2 (Simulator)</h4>
            <span className="pool-badge">Pool m = {state.p2.m}</span>
          </div>

          {state.p2.question && (
            <div className="move-box">
              <span className="q-label">Question:</span>
              <span className="q-val">{state.p2.question}</span>
              {state.p2.answer && (
                <span className={`ans-pill ${state.p2.answer === 'YES' ? 'yes' : 'no'}`}>
                  {state.p2.answer}
                </span>
              )}
            </div>
          )}

          <div className="candidates-flex">
            {state.p2.pool.map((num) => (
              <span key={num} className="num-pill opponent">
                {num}
              </span>
            ))}
          </div>

          {state.p2.skipped && (
            <div className="skipped-alert">
              <AlertTriangle size={18} />
              <span>Real Game Rules: P2 should get their final turn to guess here!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
