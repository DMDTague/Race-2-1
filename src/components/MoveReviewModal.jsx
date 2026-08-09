// src/components/MoveReviewModal.jsx
import React, { useState } from 'react';
import {
  X,
  Trophy,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
  BarChart2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  Award,
} from 'lucide-react';
import { calculateGameAccuracy } from '../utils/mathEngine';

const QualityBadgeInline = ({ quality }) => {
  if (!quality) return null;
  return (
    <span className={`inline-quality quality-${quality.category}`}>
      <span className="quality-icon-inline">{quality.icon}</span>
      <span className="quality-label-inline">{quality.label}</span>
    </span>
  );
};

export default function MoveReviewModal({
  isOpen,
  onClose,
  moveHistory = [],
  winOddsTimeline = [],
  gameModel = 'soft',
  winner = null,
  characters = [],
}) {
  const [selectedMoveIdx, setSelectedMoveIdx] = useState(0);
  const [filterActor, setFilterActor] = useState('all'); // 'all' | 'player' | 'computer'

  if (!isOpen) return null;

  const playerAccuracy = calculateGameAccuracy(moveHistory, 'player');
  const computerAccuracy = calculateGameAccuracy(moveHistory, 'computer');

  // Count qualities
  const countQuality = (actor, cat) =>
    moveHistory.filter((m) => m.actor === actor && m.quality?.category === cat).length;

  const qualityCategories = [
    { key: 'brilliant', label: 'Brilliant', icon: '‼' },
    { key: 'best', label: 'Best', icon: '!!' },
    { key: 'great', label: 'Great', icon: '★' },
    { key: 'good', label: 'Good', icon: '✓' },
    { key: 'inaccuracy', label: 'Inaccuracy', icon: '⚠️' },
    { key: 'mistake', label: 'Mistake', icon: '?' },
    { key: 'blunder', label: 'Blunder', icon: '??' },
  ];

  const filteredMoves = moveHistory.filter((m) => {
    if (filterActor === 'player') return m.actor === 'player';
    if (filterActor === 'computer') return m.actor === 'computer';
    return true;
  });

  const activeMove = moveHistory[selectedMoveIdx] || null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content move-review-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <Award className="modal-icon" size={24} />
            <h3>Comprehensive Game & Move Review</h3>
            <span className="model-badge">Ruleset: {gameModel.toUpperCase()}</span>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Top Performance Overview Card */}
          <div className="review-overview-card">
            <div className="accuracy-side player-acc">
              <div className="acc-label">Your Move Accuracy</div>
              <div className="acc-value">{playerAccuracy}%</div>
              {winner === 'player' && <div className="winner-tag">🏆 Game Winner</div>}
            </div>

            <div className="vs-divider">
              <span>VS</span>
            </div>

            <div className="accuracy-side computer-acc">
              <div className="acc-label">Engine Accuracy</div>
              <div className="acc-value">{computerAccuracy}%</div>
              {winner === 'computer' && <div className="winner-tag">💻 Game Winner</div>}
            </div>
          </div>

          {/* Quality Distribution Table */}
          <div className="quality-matrix-container">
            <h4>Move Classification Breakdown</h4>
            <div className="quality-grid">
              {qualityCategories.map((cat) => {
                const pCount = countQuality('player', cat.key);
                const cCount = countQuality('computer', cat.key);
                if (pCount === 0 && cCount === 0) return null;

                return (
                  <div key={cat.key} className={`quality-chip category-${cat.key}`}>
                    <span className="chip-icon">{cat.icon}</span>
                    <span className="chip-label">{cat.label}</span>
                    <span className="chip-counts">
                      <span className="p-cnt">You: {pCount}</span> | <span className="c-cnt">Bot: {cCount}</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Win Odds Timeline Graph */}
          {winOddsTimeline.length > 1 && (
            <div className="timeline-graph-container">
              <div className="graph-header">
                <h4>
                  <TrendingUp size={18} /> Win Odds Timeline (Time-Sequenced)
                </h4>
                <span className="graph-hint">Click point to view move state</span>
              </div>

              <div className="graph-canvas-box">
                <svg className="odds-svg" viewBox={`0 0 ${Math.max(400, winOddsTimeline.length * 70)} 160`}>
                  {/* Grid lines */}
                  <line x1="0" y1="30" x2="100%" y2="30" stroke="#334155" strokeDasharray="3 3" />
                  <line x1="0" y1="80" x2="100%" y2="80" stroke="#475569" strokeDasharray="2 2" />
                  <line x1="0" y1="130" x2="100%" y2="130" stroke="#334155" strokeDasharray="3 3" />

                  <text x="5" y="25" fill="#94a3b8" fontSize="10">100%</text>
                  <text x="5" y="75" fill="#94a3b8" fontSize="10">50%</text>
                  <text x="5" y="125" fill="#94a3b8" fontSize="10">0%</text>

                  {/* Draw timeline path */}
                  {(() => {
                    const width = Math.max(400, winOddsTimeline.length * 70);
                    const stepX = width / (winOddsTimeline.length - 1 || 1);

                    const points = winOddsTimeline.map((pt, idx) => {
                      const x = idx * stepX;
                      const y = 140 - (pt.playerWinProb * 110);
                      return `${x},${y}`;
                    });

                    const pathD = `M ${points.join(' L ')}`;

                    return (
                      <>
                        <path d={pathD} fill="none" stroke="#3b82f6" strokeWidth="3" />

                        {winOddsTimeline.map((pt, idx) => {
                          const x = idx * stepX;
                          const y = 140 - (pt.playerWinProb * 110);
                          const isSelected = selectedMoveIdx === idx - 1 || (idx === 0 && selectedMoveIdx === 0);

                          return (
                            <g
                              key={idx}
                              className={`graph-node ${isSelected ? 'selected' : ''}`}
                              onClick={() => idx > 0 && setSelectedMoveIdx(idx - 1)}
                            >
                              <circle
                                cx={x}
                                cy={y}
                                r={isSelected ? "7" : "5"}
                                fill={pt.actor === 'player' ? "#22c55e" : "#ef4444"}
                                stroke="#ffffff"
                                strokeWidth="2"
                              />
                              <text x={x} y={y - 12} fill="#e2e8f0" fontSize="10" textAnchor="middle">
                                {(pt.playerWinProb * 100).toFixed(0)}%
                              </text>
                              <text x={x} y="155" fill="#64748b" fontSize="10" textAnchor="middle">
                                T{idx}
                              </text>
                            </g>
                          );
                        })}
                      </>
                    );
                  })()}
                </svg>
              </div>
            </div>
          )}

          {/* Stepper Navigation */}
          <div className="move-stepper-bar">
            <button
              disabled={selectedMoveIdx <= 0}
              onClick={() => setSelectedMoveIdx((i) => Math.max(0, i - 1))}
              className="step-btn"
            >
              <ChevronLeft size={16} /> Prev Move
            </button>

            <span className="step-counter">
              Move <strong>{selectedMoveIdx + 1}</strong> of <strong>{moveHistory.length}</strong>
            </span>

            <button
              disabled={selectedMoveIdx >= moveHistory.length - 1}
              onClick={() => setSelectedMoveIdx((i) => Math.min(moveHistory.length - 1, i + 1))}
              className="step-btn"
            >
              Next Move <ChevronRight size={16} />
            </button>
          </div>

          {/* Active Move Detail Card */}
          {activeMove && (
            <div className="active-move-detail-panel">
              <div className="detail-header">
                <div className="actor-title">
                  <span className={`actor-badge ${activeMove.actor}`}>
                    {activeMove.actor === 'player' ? '👤 Player Move' : '🤖 Engine Move'}
                  </span>
                  <h4>{activeMove.actionText}</h4>
                </div>
                <QualityBadgeInline quality={activeMove.quality} />
              </div>

              {/* State Transition Stats */}
              <div className="transition-stats-grid">
                <div className="tr-card">
                  <div className="tr-label">Before State</div>
                  <div className="tr-val">
                    Pools: ({activeMove.nBefore}, {activeMove.mBefore})
                  </div>
                  <div className="tr-sub">Win Chance: {(activeMove.preWin * 100).toFixed(1)}%</div>
                </div>

                <div className="tr-arrow">➔</div>

                <div className="tr-card">
                  <div className="tr-label">Outcome</div>
                  <div className="tr-val highlight">{activeMove.outcomeText}</div>
                  <div className="tr-sub">Answer: {activeMove.answer}</div>
                </div>

                <div className="tr-arrow">➔</div>

                <div className="tr-card">
                  <div className="tr-label">After State</div>
                  <div className="tr-val">
                    Pools: ({activeMove.nAfter}, {activeMove.mAfter})
                  </div>
                  <div className="tr-sub">
                    Win Chance: {(activeMove.postWin * 100).toFixed(1)}% ({activeMove.equitySwing >= 0 ? '+' : ''}
                    {(activeMove.equitySwing * 100).toFixed(1)}%)
                  </div>
                </div>
              </div>

              {/* Move Analysis Commentary */}
              <div className="commentary-box">
                <Sparkles size={16} className="sparkle-icon" />
                <div className="commentary-text">
                  <strong>Analysis: </strong>
                  {activeMove.quality?.description || 'Move executed clean.'}
                  {activeMove.decisionError > 0.005 && (
                    <div className="suboptimal-note">
                      Optimal DP choice was <strong>{activeMove.optimalActionText}</strong> with EV{' '}
                      <strong>{(activeMove.optimalEV * 100).toFixed(1)}%</strong> (EV loss:{' '}
                      <strong>{(activeMove.decisionError * 100).toFixed(1)}%</strong>).
                    </div>
                  )}
                </div>
              </div>

              {/* Full EV Candidate Comparison Table */}
              {activeMove.evBreakdown && activeMove.evBreakdown.length > 0 && (
                <div className="ev-table-container">
                  <h5>Expected Value (EV) Choices at State ({activeMove.nBefore}, {activeMove.mBefore})</h5>
                  <table className="ev-matrix-table">
                    <thead>
                      <tr>
                        <th>Option</th>
                        <th>Action Description</th>
                        <th>Expected Win EV</th>
                        <th>Diff from Best</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeMove.evBreakdown.map((row, i) => {
                        const isPlayed =
                          (row.type === 'guess' && activeMove.actionType === 'guess') ||
                          (row.type === 'question' && activeMove.actionType === 'question' && row.b === activeMove.b);

                        return (
                          <tr
                            key={i}
                            className={`${row.isOptimal ? 'optimal-row' : ''} ${isPlayed ? 'played-row' : ''}`}
                          >
                            <td>{row.type === 'guess' ? '🎯 Guess' : `❓ Bid b=${row.b}`}</td>
                            <td>{row.label}</td>
                            <td>
                              <strong>{row.evPct}</strong>
                            </td>
                            <td className={row.diffFromOptimal > 0.01 ? 'ev-loss' : 'ev-best'}>
                              {row.diffFromOptimal < 1e-6
                                ? '0.0%'
                                : `-${(row.diffFromOptimal * 100).toFixed(1)}%`}
                            </td>
                            <td>
                              {row.isOptimal && <span className="pill-badge best">★ Optimal</span>}
                              {isPlayed && <span className="pill-badge played">Played</span>}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
