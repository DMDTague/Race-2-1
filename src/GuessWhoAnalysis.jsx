// src/GuessWhoAnalysis.jsx
import React from 'react';
import Navbar from './components/Navbar';
import DpHeatmapExplorer from './components/DpHeatmapExplorer';
import CorrectedGame from './components/CorrectedGame';
import GamePlayback from './components/GamePlayback';
import DeathValleyViz from './components/DeathValleyViz';
import StateTree from './components/StateTree';
import {
  ExternalLink,
  ChevronRight,
  Sparkles,
  AlertTriangle,
  Mail,
} from 'lucide-react';

export default function GuessWhoAnalysis() {
  return (
    <div className="analysis-app-root">
      <Navbar />

      {/* Hero Section */}
      <header className="hero-header">
        <div className="hero-glow-overlay" />
        <div className="hero-container">
          <div className="hero-badge">
            <Sparkles size={16} /> Game Theory & Code-Level Audit
          </div>

          <h1 className="hero-title">
            Race to 1 vs. Real Guess Who
          </h1>

          <h2 className="hero-subtitle">
            A Code-Level Audit of Dr. Mihai Nica&apos;s Optimal Strategy Simulation
          </h2>

          <p className="hero-lead">
            How Dr. Mihai Nica&apos;s Python implementation introduced a <em>Race-to-1</em> win condition that diverges from the actual rules of Guess Who — and how I uncovered the discrepancy, formalized it, and built a corrected dynamic programming model that reflects the real turn-based game.
          </p>

          <div className="hero-action-row">
            <a href="#corrected-game" className="btn-primary">
              Play Corrected Game <ChevronRight size={18} />
            </a>
            <a href="#dp-matrix" className="btn-secondary">
              Inspect DP Heatmap
            </a>
          </div>

          {/* Quick Metrics Bar */}
          <div className="hero-stats-grid">
            <div className="stat-card">
              <div className="stat-num">V(20,20) = 63.2%</div>
              <div className="stat-desc">First-Mover Win Rate (Soft Guess)</div>
            </div>
            <div className="stat-card">
              <div className="stat-num">b* = 8</div>
              <div className="stat-desc">Optimal First Question Size</div>
            </div>
            <div className="stat-card">
              <div className="stat-num">400 States</div>
              <div className="stat-desc">Full DP Matrix Solved</div>
            </div>
            <div className="stat-card">
              <div className="stat-num">Death Valley</div>
              <div className="stat-desc">Preserved Limbo State (n=1)</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="main-content">
        {/* Section 1: Viral Strategy (Mark Rober) */}
        <section id="viral-strategy" className="content-section">
          <div className="section-container">
            <div className="section-label">01 / The Context</div>
            <h2 className="section-title">The Viral Strategy: Binary Search Framing</h2>

            <p className="paragraph">
              On November 17, 2015, Mark Rober—former NASA engineer, Apple product designer, and YouTube creator—released a video claiming to have discovered a dominant strategy for Guess Who.
            </p>

            <div className="media-card">
              <a
                href="https://youtu.be/FRlbNOno5VA?si=o6gN1jFEMXZcqEa-"
                target="_blank"
                rel="noopener noreferrer"
                className="media-link"
              >
                <div className="media-icon">📺</div>
                <div className="media-info">
                  <div className="media-title">Mark Rober&apos;s Original Video: &quot;How to Win Guess Who&quot;</div>
                  <div className="media-sub">November 17, 2015 • 155M+ Combined Views</div>
                </div>
                <ExternalLink size={18} className="media-ext" />
              </a>
            </div>

            <p className="paragraph">
              Rober&apos;s premise was simple: play Guess Who like a computer binary search. Ask questions that cut the remaining set of candidate faces in half (&lfloor;n/2&rfloor;), rather than traditional feature questions (&quot;Does your person have glasses?&quot;).
            </p>

            <div className="stat-highlights flex-grid">
              <div className="highlight-card">
                <span className="hl-val">80%</span>
                <span className="hl-lbl">Claimed Single Game Win Rate</span>
              </div>
              <div className="highlight-card">
                <span className="hl-val">96%</span>
                <span className="hl-lbl">First-to-Five Match Win Rate</span>
              </div>
              <div className="highlight-card">
                <span className="hl-val">n / 2</span>
                <span className="hl-lbl">Equal Half-Split Question Size</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Enter Dr. Nica */}
        <section id="nica-model" className="content-section alt-bg">
          <div className="section-container">
            <div className="section-label">02 / Mathematical Modeling</div>
            <h2 className="section-title">Enter Dr. Mihai Nica: Beyond Binary Search</h2>

            <p className="paragraph">
              Months before Rober&apos;s video, Dr. Mihai Nica released his academic paper <em>&quot;Optimal Strategy in Guess Who?: Beyond Binary Search&quot;</em>, proving that dynamic programming yields an optimal strategy superior to naive half-splitting.
            </p>

            <div className="media-card">
              <div className="media-icon">📄</div>
              <div className="media-info">
                <div className="media-title">&quot;Optimal Strategy in &apos;Guess Who?&apos;: Beyond Binary Search&quot;</div>
                <div className="media-sub">Version 1: Sept 2015 | Version 2: Jan 2016</div>
              </div>
            </div>

            <p className="paragraph">
              In November 2025, Dr. Nica published a marimo-based Python <em>&quot;Guess Who Simulator&quot;</em> that abstracted the physical board game into interval questions on numbers {'{1, …, N}'}.
            </p>

            <div className="math-callout-box">
              <h4>Dr. Nica&apos;s Number Abstraction</h4>
              <ul>
                <li>Each player secretly picks a secret integer in {'{1, …, 20}'}.</li>
                <li>Moves consist of interval questions [a, b]? with binary YES/NO answers.</li>
                <li>When a player asks [a, b]?, the candidate set shrinks to size b on YES, or n−b on NO.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 3: Audit & Discovery */}
        <section id="audit-findings" className="content-section">
          <div className="section-container">
            <div className="section-label">03 / Code Audit</div>
            <h2 className="section-title">The Discovery: The Race-to-1 Discrepancy</h2>

            <p className="paragraph">
              When auditing Dr. Nica&apos;s open-source simulation code, I identified a fundamental structural bug:
            </p>

            <div className="bug-alert-box">
              <AlertTriangle className="alert-icon" size={24} />
              <div>
                <h4>Absorbing Win Condition Bug</h4>
                <p>
                  The Python simulation declared Player 1 the instant winner the moment Player 1&apos;s candidate pool reached size n = 1—even if that state was reached during a question, before Player 1 got a turn to declare their guess.
                </p>
              </div>
            </div>

            <p className="paragraph">
              In actual Hasbro / Milton Bradley Guess Who, candidate pool size n = 1 does <strong>NOT</strong> end the game. You must wait for your turn, declare your guess, and pass control to your opponent—who receives a full final turn to guess!
            </p>
          </div>
        </section>

        {/* Section 4: Game Playback Example */}
        <section id="example-playback" className="content-section alt-bg">
          <div className="section-container">
            <div className="section-label">04 / Step-by-step Trace</div>
            <h2 className="section-title">Example Game: Where the Model Breaks</h2>

            <p className="paragraph">
              Use the interactive player below to step through the sequence of moves where Dr. Nica&apos;s simulator prematurely terminates the game:
            </p>

            <GamePlayback />
          </div>
        </section>

        {/* Section 5: Death Valley */}
        <section id="death-valley" className="content-section">
          <div className="section-container">
            <div className="section-label">05 / The Core Concept</div>
            <h2 className="section-title">Death Valley: Knowing But Not Winning</h2>

            <p className="paragraph">
              I term this critical state <strong>Death Valley</strong>: the state where you logically deduce the opponent&apos;s secret candidate (n = 1), but must pass your turn and survive the opponent&apos;s final attempt.
            </p>

            <DeathValleyViz />

            <div className="formal-definition-card">
              <h3>Definition: Death Valley State</h3>
              <p>
                A game state (n = 1, m) on your opponent&apos;s turn where active candidate count is 1, but victory is not guaranteed because the opponent has pool size m and acts before your declaration turn.
              </p>
            </div>
          </div>
        </section>

        {/* Section 6: Formal Math & DP Equations */}
        <section id="formal-math" className="content-section alt-bg">
          <div className="section-container">
            <div className="section-label">06 / Formal Mathematics</div>
            <h2 className="section-title">Optimal Death Valley Strategy V(n,m)</h2>

            <p className="paragraph">
              We define V(n,m) as the win probability for the player to move, given active pool n and opponent pool m, under turn-based soft-guess rules:
            </p>

            {/* Formatted Math Cards */}
            <div className="formula-cards-grid">
              <div className="formula-card">
                <h4>1. Soft-Guess Recurrence V(n,m)</h4>
                <div className="latex-box">
                  V(n,m) = max &#123; (1/n) + ((n-1)/n) &middot; (1 - V(m, n-1)), max<sub>1 &le; b &le; n-1</sub> [ (b/n)(1 - V(m,b)) + (1 - b/n)(1 - V(m, n-b)) ] &#125;
                </div>
                <p className="formula-caption">
                  Accounts for soft guesses (miss removes candidate leaving pool n-1) and optimal interval question bids b*.
                </p>
              </div>

              <div className="formula-card">
                <h4>2. Race-to-1 Recurrence V_race(n,m)</h4>
                <div className="latex-box">
                  V_race(n,m) = max<sub>1 &le; b &le; n-1</sub> [ (b/n)(1 - V_race(m,b)) + (1 - b/n)(1 - V_race(m, n-b)) ] with V_race(1,m) = 1.0
                </div>
                <p className="formula-caption">
                  Treats n = 1 as an instant absorbing win state.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 7: Turn Structure Comparison Tree */}
        <section id="state-tree" className="content-section">
          <div className="section-container">
            <div className="section-label">07 / Structure Comparison</div>
            <h2 className="section-title">Turn Structure: Race-to-1 vs. Real Guess Who</h2>

            <StateTree />
          </div>
        </section>

        {/* Section 8: Interactive DP Matrix Explorer */}
        <section id="dp-matrix" className="content-section alt-bg">
          <div className="section-container">
            <div className="section-label">08 / Interactive DP Matrix</div>
            <h2 className="section-title">2D DP Heatmap & Expected Value Inspector</h2>

            <DpHeatmapExplorer />
          </div>
        </section>

        {/* Section 9: Playable Corrected Game Simulator */}
        <section id="corrected-game" className="content-section">
          <div className="section-container">
            <div className="section-label">09 / Interactive Simulator</div>
            <h2 className="section-title">Play the Corrected Game vs. Optimal DP Bot</h2>

            <p className="paragraph">
              Play Guess Who using candidate numbers or character cards against the optimal Death Valley DP Engine. Watch real-time move evaluations (&quot;!! Best&quot;, &quot;★ Great&quot;, &quot;✓ Good&quot;, &quot;?? Blunder&quot;) as you play!
            </p>

            <CorrectedGame />
          </div>
        </section>

        {/* Section 10: Reflection & Conversation with Dr. Nica */}
        <section id="reflection" className="content-section alt-bg">
          <div className="section-container">
            <div className="section-label">10 / Academic Exchange</div>
            <h2 className="section-title">Conversation with Dr. Mihai Nica</h2>

            <div className="chat-dialogue">
              <div className="chat-bubble dylan">
                <div className="chat-author">Dylan Tague</div>
                <p>
                  &quot;I pointed out that the marimo simulator treats reducing to one candidate as an immediate win. In standard Guess Who rules, you still must declare your guess on a later turn, so a player can know the answer and still lose if it isn&apos;t their turn.&quot;
                </p>
              </div>

              <div className="chat-bubble nica">
                <div className="chat-author">Dr. Mihai Nica</div>
                <p>
                  &quot;Clarified that treating n = 1 as an auto-win was an intentional modeling choice: one among several rulesets simulated, and the one found most mathematically elegant.&quot;
                </p>
              </div>

              <div className="chat-bubble dylan">
                <div className="chat-author">Dylan Tague</div>
                <p>
                  &quot;My concern wasn&apos;t that the model is &apos;wrong&apos; but that it changes the game-theoretic structure compared to standard MB / Hasbro rules. Under physical rules, the extra turn shifts victory percentages, enabling players to escape seemingly lost positions.&quot;
                </p>
              </div>
            </div>

            <div className="reflection-card">
              <h3>Final Synthesis</h3>
              <p>
                Both models are mathematically valid; they solve different games. Dr. Nica&apos;s model solves a pure deduction race. My corrected model solves the actual turn-based game where Death Valley exists and &quot;knowing&quot; is not identical to &quot;winning.&quot;
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-container">
          <div className="footer-contact">
            <Mail size={18} />
            <span>Contact: dylantague7704@gmail.com</span>
          </div>
          <div className="footer-text">
            © {new Date().getFullYear()} Dylan Tague • Race-to-1 vs. Guess Who Game Theory Audit
          </div>
        </div>
      </footer>
    </div>
  );
}
