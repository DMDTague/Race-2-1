// src/components/DpHeatmapExplorer.jsx
import React, { useState } from 'react';
import { getDpMatrix, getEvBreakdown, getWinValue } from '../utils/mathEngine';
import { Info, Sparkles, Sliders, ChevronDown } from 'lucide-react';

export default function DpHeatmapExplorer() {
  const [selectedModel, setSelectedModel] = useState('soft'); // 'soft' | 'hard' | 'race'
  const [selectedCell, setSelectedCell] = useState({ n: 20, m: 20 });
  const [hoveredCell, setHoveredCell] = useState(null);

  const matrix = getDpMatrix(selectedModel);
  const activeState = hoveredCell || selectedCell;
  const evBreakdown = getEvBreakdown(activeState.n, activeState.m, selectedModel);

  const modelDescriptions = {
    soft: 'Real Turn-Based Soft Guess: Wrong guess eliminates candidate and passes turn. Preserves Death Valley.',
    hard: 'Real Turn-Based Hard Guess: Wrong guess loses game immediately. Maximum risk on exact guesses.',
    race: "Dr. Mihai Nica's Race-to-1: Reaching n=1 wins instantly even on opponent's turn. No Death Valley.",
  };

  const getHeatmapBg = (val) => {
    // val is 0.0 to 1.0
    // 0.5 is neutral blue/slate, >0.5 is green, <0.5 is red/amber
    if (val >= 0.5) {
      return `rgba(34, 197, 94, ${0.15 + (val - 0.5) * 0.9})`;
    } else {
      return `rgba(239, 68, 68, ${0.15 + (0.5 - val) * 0.9})`;
    }
  };

  return (
    <div className="dp-heatmap-container">
      <div className="dp-header">
        <div className="dp-header-title">
          <Sparkles className="dp-icon" size={24} />
          <div>
            <h3>Interactive DP Matrix & Win Probability Explorer</h3>
            <p className="dp-subtitle">
              Explore $V(n,m)$ and optimal move choices $b^*(n,m)$ across $20 \times 20 = 400$ game states.
            </p>
          </div>
        </div>

        {/* Model Selector Tabs */}
        <div className="model-tabs">
          <button
            className={`model-tab ${selectedModel === 'soft' ? 'active' : ''}`}
            onClick={() => setSelectedModel('soft')}
          >
            Soft Guess (Real Game)
          </button>
          <button
            className={`model-tab ${selectedModel === 'hard' ? 'active' : ''}`}
            onClick={() => setSelectedModel('hard')}
          >
            Hard Guess (Strict)
          </button>
          <button
            className={`model-tab ${selectedModel === 'race' ? 'active' : ''}`}
            onClick={() => setSelectedModel('race')}
          >
            Race-to-1 (Nica Model)
          </button>
        </div>
      </div>

      <div className="model-description-banner">
        <Info size={18} className="banner-icon" />
        <span>{modelDescriptions[selectedModel]}</span>
      </div>

      <div className="dp-layout">
        {/* Heatmap Grid */}
        <div className="heatmap-wrapper">
          <div className="heatmap-y-label">Your Candidates (n) ↓</div>
          <div className="heatmap-x-label">Opponent Candidates (m) →</div>

          <div className="heatmap-grid">
            {/* Header row for m */}
            <div className="grid-header-cell corner-cell">n \ m</div>
            {Array.from({ length: 20 }, (_, i) => i + 1).map((m) => (
              <div key={m} className="grid-header-cell">
                {m}
              </div>
            ))}

            {/* Grid rows */}
            {matrix.map((row, nIdx) => (
              <React.Fragment key={nIdx}>
                <div className="grid-header-cell row-header">{nIdx + 1}</div>
                {row.map((cell) => {
                  const isSelected = selectedCell.n === cell.n && selectedCell.m === cell.m;
                  const isHovered = hoveredCell && hoveredCell.n === cell.n && hoveredCell.m === cell.m;
                  return (
                    <div
                      key={cell.m}
                      className={`heatmap-cell ${isSelected ? 'selected' : ''} ${isHovered ? 'hovered' : ''}`}
                      style={{ backgroundColor: getHeatmapBg(cell.val) }}
                      onClick={() => setSelectedCell({ n: cell.n, m: cell.m })}
                      onMouseEnter={() => setHoveredCell({ n: cell.n, m: cell.m })}
                      onMouseLeave={() => setHoveredCell(null)}
                      title={`State (${cell.n}, ${cell.m}): V = ${cell.valPct}%, Best: ${cell.actionText}`}
                    >
                      <span className="cell-val">{cell.valPct}%</span>
                      <span className="cell-action">{cell.actionText}</span>
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* State Inspector Panel */}
        <div className="inspector-panel">
          <div className="inspector-header">
            <h4>State Inspector: ({activeState.n}, {activeState.m})</h4>
            <span className="inspector-badge">
              Active: n={activeState.n} | Opponent: m={activeState.m}
            </span>
          </div>

          <div className="inspector-metric-card">
            <div className="metric-title">Win Probability V({activeState.n}, {activeState.m})</div>
            <div className="metric-value">
              {(getWinValue(activeState.n, activeState.m, selectedModel) * 100).toFixed(1)}%
            </div>
            <div className="metric-bar-bg">
              <div
                className="metric-bar-fill"
                style={{
                  width: `${getWinValue(activeState.n, activeState.m, selectedModel) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Model Comparison Table for this State */}
          <div className="state-model-comparison">
            <h5>Model Comparison for State ({activeState.n}, {activeState.m})</h5>
            <div className="comp-grid">
              <div className="comp-item">
                <span className="comp-label">Soft-Guess (Real):</span>
                <span className="comp-val">
                  {(getWinValue(activeState.n, activeState.m, 'soft') * 100).toFixed(1)}%
                </span>
              </div>
              <div className="comp-item">
                <span className="comp-label">Hard-Guess (Strict):</span>
                <span className="comp-val">
                  {(getWinValue(activeState.n, activeState.m, 'hard') * 100).toFixed(1)}%
                </span>
              </div>
              <div className="comp-item">
                <span className="comp-label">Race-to-1 (Nica):</span>
                <span className="comp-val">
                  {(getWinValue(activeState.n, activeState.m, 'race') * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* EV Breakdown Ranking */}
          <div className="ev-ranking-container">
            <h5>Available Choice EV Breakdown</h5>
            <div className="ev-ranking-list">
              {evBreakdown.map((item, idx) => (
                <div key={idx} className={`ev-item ${item.isOptimal ? 'optimal' : ''}`}>
                  <div className="ev-item-header">
                    <span className="ev-label">
                      {item.isOptimal ? '★ ' : ''}{item.label}
                    </span>
                    <span className="ev-val">{item.evPct}</span>
                  </div>
                  {item.detail && <div className="ev-detail">{item.detail}</div>}
                  <div className="ev-mini-bar-bg">
                    <div
                      className={`ev-mini-bar-fill ${item.isOptimal ? 'optimal' : ''}`}
                      style={{ width: `${Math.max(0, item.ev * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
