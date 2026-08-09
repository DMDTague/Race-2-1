// src/components/StateTree.jsx
import React from 'react';
import { ArrowDown, Check, X, ShieldAlert } from 'lucide-react';

export default function StateTree() {
  return (
    <div className="state-tree-container">
      <div className="tree-columns-wrapper">
        {/* Left Column: Race-to-1 */}
        <div className="tree-column race-model">
          <div className="column-header">
            <h4>Race-to-1 Model (Dr. Mihai Nica)</h4>
            <span className="col-tag">Deduction Abstraction</span>
          </div>

          <div className="tree-nodes-list">
            <div className="tree-node">
              <span className="node-state">(n = 20, m = 20)</span>
              <span className="node-desc">Game Start</span>
            </div>
            <ArrowDown className="tree-arrow" size={16} />

            <div className="tree-node">
              <span className="node-state">(n = 9, m = 12)</span>
              <span className="node-desc">Turn 1</span>
            </div>
            <ArrowDown className="tree-arrow" size={16} />

            <div className="tree-node">
              <span className="node-state">(n = 5, m = 8)</span>
              <span className="node-desc">Turn 2</span>
            </div>
            <ArrowDown className="tree-arrow" size={16} />

            <div className="tree-node">
              <span className="node-state">(n = 2, m = 7)</span>
              <span className="node-desc">Turn 3</span>
            </div>
            <ArrowDown className="tree-arrow" size={16} />

            <div className="tree-node winner-node">
              <span className="node-state">n = 1 → P1 Wins Instantly</span>
              <span className="node-desc">Absorbing Win State</span>
            </div>

            <div className="tree-node skipped-node">
              <span className="node-state">P2's Last Turn REMOVED</span>
              <span className="node-desc">Opponent loses chance to guess</span>
            </div>
          </div>
        </div>

        {/* Right Column: Real Guess Who */}
        <div className="tree-column real-model">
          <div className="column-header">
            <h4>Real Guess Who (Turn-Based)</h4>
            <span className="col-tag">Corrected Game Rules</span>
          </div>

          <div className="tree-nodes-list">
            <div className="tree-node">
              <span className="node-state">(n = 20, m = 20)</span>
              <span className="node-desc">Game Start</span>
            </div>
            <ArrowDown className="tree-arrow" size={16} />

            <div className="tree-node">
              <span className="node-state">(n = 9, m = 12)</span>
              <span className="node-desc">Turn 1</span>
            </div>
            <ArrowDown className="tree-arrow" size={16} />

            <div className="tree-node">
              <span className="node-state">(n = 5, m = 8)</span>
              <span className="node-desc">Turn 2</span>
            </div>
            <ArrowDown className="tree-arrow" size={16} />

            <div className="tree-node">
              <span className="node-state">(n = 2, m = 7)</span>
              <span className="node-desc">Turn 3</span>
            </div>
            <ArrowDown className="tree-arrow" size={16} />

            <div className="tree-node death-valley-node">
              <span className="node-state">n = 1, m = 7 (Death Valley)</span>
              <span className="node-desc">P1 turn ends. Must survive P2 turn!</span>
            </div>
            <ArrowDown className="tree-arrow" size={16} />

            <div className="tree-node p2-turn-node">
              <span className="node-state">P2 gets 1 final turn to guess</span>
              <span className="node-desc">P2 can steal win if guess is right!</span>
            </div>
            <ArrowDown className="tree-arrow" size={16} />

            <div className="tree-node winner-node">
              <span className="node-state">P1 Declares candidate → P1 Wins</span>
              <span className="node-desc">Victory after surviving opponent turn</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
