// src/GuessWhoAnalysis.jsx
import React, { useState, useEffect } from "react";
import { ChevronRight, RotateCcw, Mail, ExternalLink } from "lucide-react";

// =======================
// Main Analysis Page
// =======================
export default function GuessWhoAnalysis() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(maxScroll > 0 ? (scrolled / maxScroll) * 100 : 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="analysis-container">
      <div
        className="scroll-progress"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Hero */}
      <header className="hero">
        <div className="hero-content">
          <h1>Race to 1 vs. Real Guess Who</h1>
          <h2>A Code-Level Audit of Dr. Mihai Nica&apos;s Optimal Strategy Simulation</h2>
          <p className="subtitle">
            How Dr. Mihai Nica&apos;s Python implementation introduced a
            Race-to-1 win condition that diverges from the actual rules of
            Guess Who—and how I uncovered the discrepancy, formalized it, and
            built a corrected model that reflects the real, turn-based game.
          </p>
        </div>
      </header>

      {/* Mark Rober Section */}
      <section className="section">
        <div className="content">
          <h2>The Viral Strategy</h2>
          <p>
            On November 17, 2015, Mark Rober—former NASA engineer, Apple
            product designer, and now one of the most-subscribed YouTubers with
            over 71 million followers—released a video claiming a dominant
            strategy for <em>Guess Who?</em>
          </p>

          <div className="video-card">
            <a
              href="https://youtu.be/FRlbNOno5VA?si=o6gN1jFEMXZcqEa-"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="video-icon">📺</div>
              <div className="video-info">
                <div className="video-title">Mark Rober&apos;s Original Video</div>
                <div className="video-date">November 17, 2015</div>
              </div>
              <ExternalLink size={20} />
            </a>
          </div>

          <div className="video-card">
            <a
              href="https://www.youtube.com/shorts/l9tOJy-IAvM"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="video-icon">⚡</div>
              <div className="video-info">
                <div className="video-title">
                  IShowSpeed x Guess Who (YouTube Short)
                </div>
                <div className="video-date">Companion Short</div>
              </div>
              <ExternalLink size={20} />
            </a>
          </div>

          <p>
            Rober&apos;s strategy is simple and powerful: ask broad, almost
            binary questions that eliminate roughly half the board each turn,
            instead of narrow questions about specific facial features.
          </p>

          <div className="stat-grid">
            <div className="stat">
              <div className="stat-value">80%</div>
              <div className="stat-label">Reported win rate (single games)</div>
            </div>
            <div className="stat">
              <div className="stat-value">96%</div>
              <div className="stat-label">
                Reported win rate (first-to-five series)
              </div>
            </div>
            <div className="stat">
              <div className="stat-value">155M+</div>
              <div className="stat-label">
                Combined views (video + IShowSpeed short)
              </div>
            </div>
          </div>

          <p>
            Together with the IShowSpeed short, the video became widely
            circulated—over 155 million combined views—and was widely treated as
            the de facto optimal strategy for the game.
          </p>
        </div>
      </section>

      {/* Dr. Nica Section */}
      <section className="section alt">
        <div className="content">
          <h2>Enter Dr. Mihai Nica</h2>

          <p>
            Just before Rober&apos;s video went live, Dr. Mihai Nica (now an
            Assistant Professor in the Math &amp; Statistics Department at the
            University of Guelph) published a formal mathematical analysis:
          </p>

          <div className="paper-card">
            <div className="paper-title">
              &quot;Optimal Strategy in &apos;Guess Who?&apos;: Beyond Binary
              Search&quot;
            </div>
            <div className="paper-versions">
              <span>Version 1: September 8, 2015</span>
              <span>Version 2: January 16, 2016</span>
            </div>
          </div>

          <p>
            Nearly a decade later, on November 21, 2025, he released a
            full-length YouTube lecture revisiting this work and presenting a
            dynamic-programming solution that identifies an optimal strategy
            which, in his model, beats naïve binary search.
          </p>

          <div className="video-card">
            <a
              href="https://www.youtube.com/watch?v=_3RNB8eOSx0"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="video-icon">📺</div>
              <div className="video-info">
                <div className="video-title">Dr. Nica&apos;s Lecture</div>
                <div className="video-date">November 21, 2025</div>
              </div>
              <ExternalLink size={20} />
            </a>
          </div>

          <p>
            To make the theory tangible, he also released an interactive tool
            titled <strong>&quot;Guess Who? Simulator&quot;</strong> built on
            marimo. Despite the name, the app does not use character faces at
            all:
          </p>

          <div className="callout">
            <strong>The numerical abstraction:</strong>
            <ul>
              <li>Each player secretly selects a number from 1 to N.</li>
              <li>
                Questions are of the form: &quot;Is your number between a and b?&quot;
              </li>
              <li>
                The interface exposes this as a slider choosing an interval
                [a,b].
              </li>
              <li>
                The response is YES or NO, and both players shrink their
                candidate sets accordingly.
              </li>
            </ul>
          </div>

          <p className="emphasis">
            In other words, this is a mathematical game inspired by{" "}
            <em>Guess Who?</em>, but it is not the physical board game itself.
            The crucial difference appears in how the simulator decides that a
            player has won.
          </p>
        </div>
      </section>

      {/* Discovery Section */}
      <section className="section">
        <div className="content">
          <h2>The Discovery</h2>

          <p>
            After playing several games against the simulator, something felt
            wrong. Not in the math of the paper—but in how that math had been
            translated into an interactive game.
          </p>

          <ul className="discovery-list">
            <li>I was winning earlier than I should have.</li>
            <li>The computer seemed to skip turns it should have been allowed.</li>
            <li>
              The app declared me the winner at the moment my candidate pool
              shrank to one—even when I had not actually guessed the number.
            </li>
          </ul>

          <p>
            When I noticed this discrepancy, I went through the comments on
            Nica&apos;s lecture to see if anyone else had caught it. One
            commenter, <strong>@madks13</strong>, suggested an alternative UI
            that would allow arbitrary subsets instead of just intervals:
          </p>

          <div className="callout">
            <p className="quote">
              “For the website, you could add 20 check-boxes so people can
              select the numbers they want to ask about… Just make sure they can
              not use the sliders at the same time as the check-boxes.”
            </p>
            <p>Nica replied:</p>
            <p className="quote">
              “Ya I thought about this, but I decided that having to check like
              10 checkboxes everytime would be a bit annoying… I thought it was
              more instructive with the slider. Feel free to modify though if
              you want to!”
            </p>
          </div>

          <p>
            Even here, the conversation stays at the level of interface design.
            No one points out the deeper issue: the simulator ends the game as
            soon as a player&apos;s candidate set has size 1. Knowing the
            answer is treated as equivalent to declaring it.
          </p>
        </div>
      </section>

      {/* Formal Notation */}
      <section className="section alt">
        <div className="content">
          <h2>Formal Notation &amp; Game Structure</h2>

          <div className="math-block-container">
            <h3>Game State</h3>
            <p>Each player tracks a set of possible opponent values:</p>
            <ul>
              <li>S₁: Player 1&apos;s remaining possibilities</li>
              <li>S₂: Player 2&apos;s remaining possibilities</li>
            </ul>
            <p>The sizes of these sets are:</p>
            <ul>
              <li>n = |S₁|</li>
              <li>m = |S₂|</li>
            </ul>
            <p>At the start of a 1–20 game:</p>
            <div className="formula-display">
              S₁ = S₂ = {"{1, …, 20}"}, n = m = 20
            </div>
          </div>

          <div className="math-block-container">
            <h3>Question Format</h3>
            <p>A question is written in interval form:</p>
            <p className="quote">[a,b]? = “Is your secret number between a and b?”</p>
            <p>We notate a half-move for Player 1 as:</p>
            <div className="formula-display">[a,b]? (A; n → n&apos;)</div>
            <p>
              where A ∈ {"{Y, N}"} is the answer and n → n&apos; records how the
              size of S₁ changes after updating.
            </p>
          </div>
        </div>
      </section>

      {/* Example Game */}
      <section className="section">
        <div className="content">
          <h2>Example Game: Exposing the Discrepancy</h2>
          <p>
            Below is a reconstructed game that follows the same logic as{" "}
            <em>Game 2</em> from my notes. The key is Move 4: the point where
            Nica&apos;s simulator declares Player 1 the winner without giving
            Player 2 their final turn.
          </p>

          <GamePlayback />

          <div className="analysis-box">
            <h3>The Critical Moment</h3>
            <p>
              At Move 4, Player 1 asks [4,4]? and receives the answer NO. This
              eliminates 4 and leaves S₁ = {"{5}"} so that n = 1.
            </p>
            <p className="emphasis">
              In the simulator, this triggers an immediate win for Player 1.
              Player 2&apos;s turn is silently skipped.
            </p>
            <p>In real Guess Who, however:</p>
            <ul>
              <li>You have logically inferred the correct answer.</li>
              <li>You still must pass the turn to your opponent.</li>
              <li>They should get one last opportunity to guess and steal the win.</li>
              <li>
                Only if they miss do you get to declare &quot;Your person is 5.&quot;
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Death Valley */}
      <section className="section death-valley-section">
        <div className="content">
          <h2>Death Valley: The Missing State</h2>

          <p>
            In the abstraction implemented in Nica&apos;s simulator, the rule is:
          </p>

          <div className="formula-display">n = 1 ⇒ Player 1 wins immediately</div>

          <p>
            That rule removes one of the most interesting and strategically
            important states in the real game.
          </p>

          <DeathValleyViz />

          <div className="definition-box">
            <h3>What Is Death Valley?</h3>
            <p>
              In real <em>Guess Who?</em>, the transition from n = 2 to n = 1—
              especially when the answer to [a,b]? is NO—creates a state where:
            </p>
            <p className="emphasis">
              You know the answer, but you cannot act on it yet.
            </p>
            <p>
              You must pass your turn, exposing yourself to a final guess from
              your opponent. That one-turn vulnerability is what I call{" "}
              <strong>Death Valley</strong>.
            </p>
          </div>

          <div className="impact-grid">
            <h3>Why Death Valley Matters</h3>
            <div className="impact-item">
              <div className="impact-icon">❌</div>
              <div className="impact-text">
                Makes aggressive, uneven questions artificially safe.
              </div>
            </div>
            <div className="impact-item">
              <div className="impact-icon">⚡</div>
              <div className="impact-text">
                Lets strategies &quot;win early&quot; by deduction instead of
                declaration.
              </div>
            </div>
            <div className="impact-item">
              <div className="impact-icon">⏱️</div>
              <div className="impact-text">
                Erases how timing and turn order actually interact.
              </div>
            </div>
            <div className="impact-item">
              <div className="impact-icon">📈</div>
              <div className="impact-text">
                Overstates the strength of Nica&apos;s optimal strategy.
              </div>
            </div>
            <div className="impact-item">
              <div className="impact-icon">🛡️</div>
              <div className="impact-text">
                Hides defensive counterplay that exists in the real board game.
              </div>
            </div>
          </div>

          <div className="contrast-box">
            <h3>In the real game:</h3>
            <ul>
              <li>Going from n = 2 to n = 1 can be dangerous, not safe.</li>
              <li>Turn order and survival across one more move matter.</li>
              <li>Binary search behaves differently when Death Valley exists.</li>
              <li>
                Any truly optimal strategy must model the turn structure, not
                just the information state.
              </li>
            </ul>
            <p className="emphasis">
              The simulator—and the abstraction it implements—does not.
            </p>
          </div>
        </div>
      </section>

      {/* Turn Structure Comparison */}
      <section className="section">
        <div className="content">
          <h2>Turn Structure Comparison</h2>
          <p>
            Here&apos;s a side-by-side sketch of the same game played out in
            Nica&apos;s Race-to-1 model vs. the real, turn-based game:
          </p>
          <StateTree />
        </div>
      </section>

      {/* Conclusion */}
      <section className="section conclusion">
        <div className="content">
          <h2>The Core Issue</h2>

          <p className="emphasis large">
            Nica&apos;s simulator does not simulate <em>Guess Who?</em> as it is
            physically played.
            <br />
            It simulates a different game entirely: a Race-to-1 deduction race.
          </p>

          <div className="final-thoughts">
            <p>
              This was the gap I decided to formalize: the mismatch between the
              mathematical abstraction, the code that implements it, and the
              rules of the real board game that inspired the paper.
            </p>
            <p>
              By removing Death Valley and treating n = 1 as an instant win, the
              numerical model changes the strategic landscape. It isn&apos;t
              just a simplification—it is a different game with different optimal
              strategies.
            </p>
            <p>
              Any attempt to apply these &quot;optimal&quot; results back onto
              real Guess Who needs to account for that structural difference
              first.
            </p>
          </div>
        </div>
      </section>

      {/* Corrected Implementation */}
      <section className="section corrected-game">
        <div className="content">
          <h2>Attempting a Corrected Version</h2>

          <div
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              padding: "1.5rem",
              borderRadius: "12px",
              marginBottom: "2rem",
              border: "2px solid rgba(96, 165, 250, 0.3)",
            }}
          >
            <h3
              style={{
                color: "#60a5fa",
                marginBottom: "1rem",
                fontSize: "1.3rem",
              }}
            >
              About the Computer&apos;s Strategy
            </h3>
            <p style={{ color: "#e2e8f0", marginBottom: "1rem" }}>
              The computer opponent uses an approximate{" "}
              <strong>b*(n,m)</strong> bidding strategy inspired by Nica&apos;s
              recursion. It adapts its interval size based on relative pool
              sizes—more aggressive when behind, more conservative when ahead.
            </p>
            <ul
              style={{
                color: "#cbd5e1",
                listStyle: "none",
                padding: 0,
                margin: 0,
              }}
            >
              <li style={{ padding: "0.5rem 0" }}>
                • When behind (n/m &lt; 0.5): asks about ~60% of its pool.
              </li>
              <li style={{ padding: "0.5rem 0" }}>
                • When ahead (n/m &gt; 2): asks about ~40% of its pool.
              </li>
              <li style={{ padding: "0.5rem 0" }}>
                • When roughly equal: asks about ~50% (near binary split).
              </li>
            </ul>
            <p
              style={{
                color: "#94a3b8",
                marginTop: "1rem",
                fontSize: "0.95rem",
                fontStyle: "italic",
              }}
            >
              Crucially, this corrected game only awards a win when a player
              makes an explicit exact guess [x,x] and is right. Reducing the
              pool to size 1 is not, by itself, a victory.
            </p>
          </div>

          <p className="disclaimer">
            This implementation is an independent reconstruction built for
            analysis. It is inspired by Dr. Mihai Nica&apos;s marimo notebook
            but changes the win condition to match the real board game.
          </p>

          <CorrectedGame />
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="contact">
            <Mail size={20} />
            <span>Contact: dylantague7704@gmail.com</span>
          </div>
          <div className="footer-note">
            © 2025 Dylan Tague. All rights reserved.
          </div>
        </div>
      </footer>

      <Styles />
    </div>
  );
}

// =======================
// Example Game Playback
// =======================
const GamePlayback = () => {
  const [currentMove, setCurrentMove] = useState(0);

  const moves = [
    {
      p1: {
        question: "Initial",
        answer: "",
        n: 20,
        pool: Array.from({ length: 20 }, (_, i) => i + 1),
      },
      p2: {
        question: "",
        answer: "",
        m: 20,
        pool: Array.from({ length: 20 }, (_, i) => i + 1),
      },
    },
    {
      p1: { question: "[1,9]?", answer: "Y", n: 9, pool: [1, 2, 3, 4, 5, 6, 7, 8, 9] },
      p2: {
        question: "[1,8]?",
        answer: "N",
        m: 12,
        pool: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
      },
    },
    {
      p1: { question: "[1,5]?", answer: "Y", n: 5, pool: [1, 2, 3, 4, 5] },
      p2: {
        question: "[9,12]?",
        answer: "N",
        m: 8,
        pool: [13, 14, 15, 16, 17, 18, 19, 20],
      },
    },
    {
      p1: { question: "[1,3]?", answer: "N", n: 2, pool: [4, 5] },
      p2: {
        question: "[13,13]?",
        answer: "N",
        m: 7,
        pool: [14, 15, 16, 17, 18, 19, 20],
      },
    },
    {
      p1: { question: "[4,4]?", answer: "N", n: 1, pool: [5], winner: true },
      p2: {
        question: "—",
        answer: "",
        m: 7,
        pool: [14, 15, 16, 17, 18, 19, 20],
        skipped: true,
      },
    },
  ];

  const currentState = moves[currentMove];
  const isLastMove = currentMove === moves.length - 1;

  const handleContinue = () => {
    if (!isLastMove) setCurrentMove(currentMove + 1);
  };

  const handleReset = () => setCurrentMove(0);

  return (
    <div className="game-playback">
      <div className="playback-controls">
        <button
          onClick={handleContinue}
          className="control-btn"
          disabled={isLastMove}
          style={{
            opacity: isLastMove ? 0.5 : 1,
            cursor: isLastMove ? "not-allowed" : "pointer",
          }}
        >
          <ChevronRight size={20} />
          Continue
        </button>
        <button onClick={handleReset} className="control-btn">
          <RotateCcw size={20} />
          Reset
        </button>
        <div className="move-indicator">
          Move {currentMove} of {moves.length - 1}
        </div>
      </div>

      <div className="game-state">
        <div className="player-state">
          <div className="player-header">
            <h3>P1 (Human)</h3>
            <div className="pool-size">n = {currentState.p1.n}</div>
          </div>
          {currentState.p1.question && (
            <div className="move-display">
              <span className="question">{currentState.p1.question}</span>
              {currentState.p1.answer && (
                <span
                  className={`answer ${
                    currentState.p1.answer === "Y" ? "yes" : "no"
                  }`}
                >
                  {currentState.p1.answer}
                </span>
              )}
            </div>
          )}
          <div className="candidate-pool">
            {currentState.p1.pool.map((num) => (
              <div key={num} className="candidate">
                {num}
              </div>
            ))}
          </div>
          {currentState.p1.winner && currentMove === 4 && (
            <div className="winner-badge">
              ⚠️ Simulator declares Player 1 winner here.
            </div>
          )}
        </div>

        <div className="vs-divider">
          <ChevronRight size={24} />
        </div>

        <div className="player-state">
          <div className="player-header">
            <h3>P2 (Simulator)</h3>
            <div className="pool-size">m = {currentState.p2.m}</div>
          </div>
          {currentState.p2.question && (
            <div className="move-display">
              <span className="question">{currentState.p2.question}</span>
              {currentState.p2.answer && (
                <span
                  className={`answer ${
                    currentState.p2.answer === "Y" ? "yes" : "no"
                  }`}
                >
                  {currentState.p2.answer}
                </span>
              )}
            </div>
          )}
          <div className="candidate-pool">
            {currentState.p2.pool.map((num) => (
              <div key={num} className="candidate">
                {num}
              </div>
            ))}
          </div>
          {currentState.p2.skipped && currentMove === 4 && (
            <div className="skipped-badge">Turn skipped here.</div>
          )}
        </div>
      </div>
    </div>
  );
};

// =======================
// Death Valley Viz
// =======================
const DeathValleyViz = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () => setPhase((p) => (p + 1) % 4),
      3000
    );
    return () => clearInterval(interval);
  }, []);

  const phases = [
    { title: "Safe Zone", desc: "n ≥ 3", danger: false, pool: [3, 4, 5, 6, 7] },
    { title: "Approaching", desc: "n = 2", danger: true, pool: [4, 5] },
    {
      title: "Death Valley",
      desc: "n = 1 (You know, but must wait)",
      danger: true,
      pool: [5],
      critical: true,
    },
    {
      title: "Your Turn",
      desc: "Declare [5,5] after surviving",
      danger: true,
      pool: [5],
      declare: true,
    },
  ];

  const current = phases[phase];

  return (
    <div className="death-valley">
      <div
        className={`valley-state ${
          current.danger ? "danger" : "safe"
        } ${current.critical ? "critical" : ""}`}
      >
        <div className="valley-header">
          <h4>{current.title}</h4>
          <div className="valley-formula">{current.desc}</div>
        </div>

        <div className="valley-pool">
          {current.pool.map((num) => (
            <div
              key={num}
              className={`valley-card ${current.critical ? "pulse" : ""}`}
            >
              {num}
            </div>
          ))}
        </div>

        {current.critical && (
          <div className="warning-text">
            ⚠️ You know the answer, but cannot act yet.
          </div>
        )}

        {current.declare && (
          <div className="declare-text">
            ✓ Opponent misses — you now declare &quot;Your number is 5.&quot;
          </div>
        )}
      </div>

      <div className="phase-dots">
        {phases.map((_, i) => (
          <div key={i} className={`dot ${i === phase ? "active" : ""}`} />
        ))}
      </div>
    </div>
  );
};

// =======================
// State Tree
// =======================
const StateTree = () => (
  <div className="state-tree">
    <div className="tree-header">
      <h3>Turn Structure Comparison</h3>
    </div>

    <div className="tree-columns">
      <div className="tree-col">
        <h4>Nica&apos;s Race-to-1 Model</h4>
        <div className="tree-nodes">
          <div className="node">n = 20, m = 20</div>
          <div className="node">n = 9, m = 12</div>
          <div className="node">n = 5, m = 8</div>
          <div className="node">n = 2, m = 7</div>
          <div className="node winner">n = 1 → P1 wins instantly</div>
          <div className="node skipped">P2 turn skipped</div>
        </div>
      </div>

      <div className="tree-col">
        <h4>Real Guess Who</h4>
        <div className="tree-nodes">
          <div className="node">n = 20, m = 20</div>
          <div className="node">n = 9, m = 12</div>
          <div className="node">n = 5, m = 8</div>
          <div className="node">n = 2, m = 7</div>
          <div className="node death-valley">
            n = 1, m = 7 (Death Valley)
          </div>
          <div className="node">P2 gets final guess</div>
          <div className="node winner">
            If P2 misses, P1 declares and wins
          </div>
        </div>
      </div>
    </div>
  </div>
);

// =======================
// Corrected Game Component
// =======================
const CorrectedGame = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [playerSecret, setPlayerSecret] = useState(null); // number human is guessing
  const [computerSecret, setComputerSecret] = useState(null); // number computer is guessing
  const [playerPool, setPlayerPool] = useState([]);
  const [computerPool, setComputerPool] = useState([]);
  const [guessRange, setGuessRange] = useState([1, 20]);
  const [gameLog, setGameLog] = useState([]);
  const [winner, setWinner] = useState(null); // 'player' | 'computer' | null
  const [playerTurn, setPlayerTurn] = useState(true);

  const startGame = () => {
    const pSecret = Math.floor(Math.random() * 20) + 1;
    const cSecret = Math.floor(Math.random() * 20) + 1;

    setPlayerSecret(pSecret);
    setComputerSecret(cSecret);
    setPlayerPool(Array.from({ length: 20 }, (_, i) => i + 1));
    setComputerPool(Array.from({ length: 20 }, (_, i) => i + 1));
    setGuessRange([1, 20]);
    setGameLog([
      "🎮 Game started! Both players have secret numbers between 1 and 20.",
      "You must make an exact [x,x] guess to win. No instant win at pool size 1.",
    ]);
    setWinner(null);
    setGameStarted(true);
    setPlayerTurn(true);
  };

  const getOptimalBidSize = (n, m) => {
    if (n <= 1) return 1;
    if (n === 2) return 1;
    if (n <= 4) return Math.floor(n / 2);

    const ratio = n / Math.max(m, 1);
    let bidSize;

    if (ratio < 0.5) {
      bidSize = Math.ceil(n * 0.6); // behind → aggressive
    } else if (ratio > 2) {
      bidSize = Math.floor(n * 0.4); // far ahead → conservative
    } else {
      bidSize = Math.floor(n / 2); // roughly equal → near-binary
    }

    return Math.max(1, Math.min(bidSize, n));
  };

  const computerTurn = () => {
    if (winner || computerSecret == null) return;

    // If computer knows the answer (size 1), it must now declare
    if (computerPool.length === 1) {
      const guess = computerPool[0];
      if (guess === computerSecret) {
        setWinner("computer");
        setGameLog((prev) => [
          ...prev,
          `🤖 Computer declared [${guess}, ${guess}] — CORRECT. Computer wins by declaration.`,
        ]);
      } else {
        setGameLog((prev) => [
          ...prev,
          `🤖 Computer declared [${guess}, ${guess}] — WRONG. Turn passes back to you.`,
        ]);
        setPlayerTurn(true);
      }
      return;
    }

    const n = computerPool.length;
    const m = playerPool.length;
    const bidSize = getOptimalBidSize(n, m);

    const sortedPool = [...computerPool].sort((a, b) => a - b);
    const min = sortedPool[0];
    const maxIndex = Math.min(bidSize - 1, sortedPool.length - 1);
    const max = sortedPool[maxIndex];

    const inRange = min <= computerSecret && computerSecret <= max;

    const newComputerPool = inRange
      ? computerPool.filter((x) => x >= min && x <= max)
      : computerPool.filter((x) => x < min || x > max);

    setComputerPool(newComputerPool);

    const logMsg = `🤖 Computer asked: [${min}, ${max}]? Answer: ${
      inRange ? "YES" : "NO"
    } (${newComputerPool.length} remaining)`;
    setGameLog((prev) => [...prev, logMsg]);

    if (newComputerPool.length === 1) {
      setGameLog((prev) => [
        ...prev,
        "🤖 Computer now knows your number, but must wait until its next turn to declare.",
      ]);
    }

    setPlayerTurn(true);
  };

  const makeRangeGuess = () => {
    if (!playerTurn || winner || playerSecret == null) return;

    const [minRaw, maxRaw] = guessRange;
    const lo = Math.max(1, Math.min(minRaw, maxRaw));
    const hi = Math.min(20, Math.max(minRaw, maxRaw));

    // Exact guess [x,x] — only way the human can actually win
    if (lo === hi) {
      const guess = lo;
      if (guess === playerSecret) {
        setWinner("player");
        setGameLog((prev) => [
          ...prev,
          `👤 You asked: [${guess}, ${guess}]? Answer: YES ✅ CORRECT! You win by declaration.`,
        ]);
        return;
      } else {
        const newPlayerPool = playerPool.filter((n) => n !== guess);
        setPlayerPool(newPlayerPool);
        setGameLog((prev) => [
          ...prev,
          `👤 You asked: [${guess}, ${guess}]? Answer: NO ❌ (${newPlayerPool.length} remaining)`,
        ]);
        setPlayerTurn(false);
        setTimeout(() => computerTurn(), 800);
        return;
      }
    }

    // General interval [lo,hi]
    const inRange = lo <= playerSecret && playerSecret <= hi;

    const newPlayerPool = inRange
      ? playerPool.filter((n) => n >= lo && n <= hi)
      : playerPool.filter((n) => n < lo || n > hi);

    setPlayerPool(newPlayerPool);

    const logMsg = `👤 You asked: [${lo}, ${hi}]? Answer: ${
      inRange ? "YES" : "NO"
    } (${newPlayerPool.length} remaining)`;
    setGameLog((prev) => [...prev, logMsg]);

    if (newPlayerPool.length === 1) {
      setGameLog((prev) => [
        ...prev,
        "👤 You now know the answer, but must declare [x,x] on a later turn.",
      ]);
    }

    setPlayerTurn(false);
    setTimeout(() => computerTurn(), 800);
  };

  return (
    <div className="corrected-game-container">
      {!gameStarted ? (
        <div className="game-start">
          <button onClick={startGame} className="start-game-btn">
            Start Corrected Game
          </button>
          <div className="key-difference">
            <h4>Key Differences</h4>
            <ul>
              <li>
                ✅ Players must make an <strong>exact guess [x,x]</strong> to win.
              </li>
              <li>
                ✅ Death Valley (pool size 1 without auto-win) is preserved.
              </li>
              <li>✅ Turns alternate fairly; no hidden skipped turns.</li>
              <li>
                ❌ No instant win when a pool shrinks to 1 on a range question.
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="game-play">
          <div className="game-state-display">
            <div className="player-status">
              <h4>Your Status</h4>
              <div className="pool-display">
                {playerPool.map((n) => (
                  <span key={n} className="pool-number">
                    {n}
                  </span>
                ))}
              </div>
              <div className="pool-count">
                {playerPool.length} possibilities remaining
              </div>
            </div>

            <div className="computer-status">
              <h4>Computer Status</h4>
              <div className="pool-display">
                {computerPool.map((n) => (
                  <span key={n} className="pool-number computer">
                    {n}
                  </span>
                ))}
              </div>
              <div className="pool-count">
                {computerPool.length} possibilities remaining
              </div>
            </div>
          </div>

          {!winner && playerTurn && (
            <div className="player-controls">
              <h4>Your Turn — Ask a Range</h4>
              <div className="range-controls">
                <div className="range-control">
                  <label>From:</label>
                  <div className="number-spinner">
                    <button
                      onClick={() =>
                        setGuessRange(([from, to]) => [
                          Math.max(1, from - 1),
                          to,
                        ])
                      }
                      disabled={guessRange[0] <= 1}
                    >
                      -
                    </button>
                    <span className="number-display">{guessRange[0]}</span>
                    <button
                      onClick={() =>
                        setGuessRange(([from, to]) => {
                          const newFrom = Math.min(20, from + 1);
                          return [newFrom, Math.max(newFrom, to)];
                        })
                      }
                      disabled={guessRange[0] >= 20}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="range-control">
                  <label>To:</label>
                  <div className="number-spinner">
                    <button
                      onClick={() =>
                        setGuessRange(([from, to]) => [
                          from,
                          Math.max(from, to - 1),
                        ])
                      }
                      disabled={guessRange[1] <= guessRange[0]}
                    >
                      -
                    </button>
                    <span className="number-display">{guessRange[1]}</span>
                    <button
                      onClick={() =>
                        setGuessRange(([from, to]) => [
                          from,
                          Math.min(20, to + 1),
                        ])
                      }
                      disabled={guessRange[1] >= 20}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              <button onClick={makeRangeGuess} className="guess-btn">
                Ask: Is your number between {guessRange[0]} and{" "}
                {guessRange[1]}?
              </button>
            </div>
          )}

          {!winner && !playerTurn && (
            <div className="waiting">
              <div className="spinner">⏳</div>
              <p>Computer is thinking...</p>
            </div>
          )}

          {winner && (
            <div className={`game-over ${winner}`}>
              <h3>
                {winner === "player" ? "🎉 You won!" : "💻 Computer won!"}
              </h3>
              <button onClick={startGame} className="play-again-btn">
                Play Again
              </button>
            </div>
          )}

          <div className="game-log">
            <h4>Game Log</h4>
            <div className="log-entries">
              {gameLog.map((entry, i) => (
                <div key={i} className="log-entry">
                  {entry}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// =======================
// Inline Styles
// =======================
const Styles = () => (
  <style>{`
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Georgia, serif; line-height: 1.7; color: #1a1a1a; background: #fafaf9; }
    .analysis-container { min-height: 100vh; }
    .scroll-progress { position: fixed; top: 0; left: 0; height: 3px; background: linear-gradient(90deg, #2563eb, #7c3aed); z-index: 1000; transition: width 0.1s ease; }

    .hero { min-height: 90vh; display: flex; align-items: center; justify-content: center; padding: 4rem 2rem; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); color: white; }
    .hero-content { max-width: 900px; }
    .hero h1 { font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 700; margin-bottom: 1rem; line-height: 1.2; }
    .hero h2 { font-size: clamp(1.2rem, 3vw, 1.8rem); font-weight: 400; margin-bottom: 2rem; color: #cbd5e1; }
    .subtitle { font-size: 1.1rem; color: #94a3b8; line-height: 1.8; }

    .section { padding: 5rem 2rem; }
    .section.alt { background: white; }
    .content { max-width: 800px; margin: 0 auto; }
    .section h2 { font-size: 2.5rem; margin-bottom: 2rem; color: #0f172a; font-weight: 700; }
    .section p { margin-bottom: 1.5rem; font-size: 1.05rem; color: #334155; }
    .emphasis { font-style: italic; color: #1e40af; font-weight: 500; }
    .emphasis.large { font-size: 1.5rem; line-height: 1.6; text-align: center; }

    .video-card { margin: 1.5rem 0; border: 2px solid #e2e8f0; border-radius: 12px; overflow: hidden; transition: all 0.3s ease; background: #fff; }
    .video-card:hover { border-color: #3b82f6; box-shadow: 0 10px 40px rgba(59, 130, 246, 0.1); transform: translateY(-2px); }
    .video-card a { display: flex; align-items: center; gap: 1.5rem; padding: 1.25rem 1.5rem; text-decoration: none; color: inherit; }
    .video-icon { font-size: 2rem; flex-shrink: 0; }
    .video-info { flex: 1; }
    .video-title { font-weight: 600; font-size: 1.05rem; color: #1e293b; margin-bottom: 0.25rem; }
    .video-date { color: #64748b; font-size: 0.9rem; }

    .stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin: 2.5rem 0; }
    .stat { text-align: center; padding: 1.5rem; background: white; border-radius: 12px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); }
    .stat-value { font-size: 2.5rem; font-weight: 700; color: #2563eb; margin-bottom: 0.5rem; }
    .stat-label { color: #64748b; font-size: 0.95rem; }

    .paper-card { background: linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%); padding: 2rem; border-radius: 12px; border-left: 4px solid #3b82f6; margin: 2rem 0; }
    .paper-title { font-size: 1.3rem; font-weight: 600; color: #1e293b; margin-bottom: 1rem; }
    .paper-versions { display: flex; flex-wrap: wrap; gap: 1.5rem; font-size: 0.95rem; color: #475569; }

    .callout { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 1.5rem; margin: 2rem 0; border-radius: 8px; }
    .callout strong { display: block; margin-bottom: 1rem; color: #92400e; }
    .callout ul { list-style: none; padding-left: 0; }
    .callout li { padding: 0.5rem 0; color: #78350f; }
    .callout li::before { content: '→'; margin-right: 0.75rem; color: #f59e0b; }

    .quote { font-style: italic; color: #475569; padding-left: 1rem; border-left: 3px solid #cbd5e1; margin-bottom: 1rem; }

    .discovery-list { list-style: none; padding: 0; margin: 1.5rem 0; }
    .discovery-list li { padding: 1rem; margin: 0.75rem 0; background: #fee2e2; border-left: 4px solid #dc2626; border-radius: 8px; color: #7f1d1d; }

    .math-block-container { background: white; padding: 2rem; border-radius: 12px; margin: 2rem 0; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); }
    .math-block-container h3 { color: #1e293b; margin-bottom: 1rem; font-size: 1.3rem; }
    .formula-display { background: #f8fafc; padding: 1.25rem 1.5rem; border-radius: 8px; margin: 1rem 0; text-align: center; font-family: "Courier New", monospace; font-size: 1rem; }

    .game-playback { background: white; border-radius: 16px; padding: 2rem; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1); margin: 3rem 0; }
    .playback-controls { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 2px solid #e2e8f0; }
    .control-btn { display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.5rem; background: #3b82f6; color: white; border: none; border-radius: 8px; font-size: 0.95rem; cursor: pointer; transition: all 0.2s; font-family: inherit; }
    .control-btn:hover { background: #2563eb; transform: translateY(-2px); }
    .move-indicator { margin-left: auto; font-weight: 600; color: #475569; }

    .game-state { display: grid; grid-template-columns: 1fr auto 1fr; gap: 2rem; align-items: flex-start; }
    .player-state { background: #f8fafc; border-radius: 12px; padding: 1.5rem; min-height: 260px; }
    .player-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
    .player-header h3 { color: #1e293b; font-size: 1.1rem; }
    .pool-size { background: #3b82f6; color: white; padding: 0.4rem 0.9rem; border-radius: 20px; font-weight: 600; font-size: 0.85rem; }
    .move-display { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; padding: 0.75rem; background: white; border-radius: 8px; }
    .question { font-weight: 600; color: #1e293b; }
    .answer { padding: 0.25rem 0.75rem; border-radius: 4px; font-weight: 600; font-size: 0.9rem; }
    .answer.yes { background: #dcfce7; color: #166534; }
    .answer.no { background: #fee2e2; color: #991b1b; }
    .candidate-pool { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 0.5rem; }
    .candidate { background: #e0e7ff; color: #3730a3; padding: 0.4rem 0.6rem; border-radius: 6px; font-weight: 600; font-size: 0.9rem; }
    .winner-badge { margin-top: 1rem; padding: 1rem; background: #fef3c7; border: 2px solid #f59e0b; border-radius: 8px; text-align: center; font-weight: 600; color: #92400e; }
    .skipped-badge { margin-top: 1rem; padding: 1rem; background: #fee2e2; border: 2px solid #dc2626; border-radius: 8px; text-align: center; font-weight: 600; color: #991b1b; }
    .vs-divider { display: flex; align-items: center; justify-content: center; color: #cbd5e1; }

    .analysis-box { background: #fef3c7; border: 2px solid #f59e0b; border-radius: 12px; padding: 2rem; margin: 3rem 0; }
    .analysis-box h3 { color: #92400e; margin-bottom: 1rem; }
    .analysis-box ul { list-style: none; padding: 0; margin: 0.5rem 0 0; }
    .analysis-box li { padding: 0.4rem 0; color: #78350f; }
    .analysis-box li::before { content: '✓'; margin-right: 0.75rem; color: #f59e0b; font-weight: 700; }

    .death-valley-section { background: white; }
    .death-valley { margin: 3rem 0; padding: 2rem; background: #f8fafc; border-radius: 16px; border: 2px solid #e2e8f0; }
    .valley-state { padding: 2rem; border-radius: 12px; transition: all 0.6s ease; }
    .valley-state.safe { background: #dcfce7; border: 2px solid #22c55e; }
    .valley-state.danger { background: #fee2e2; border: 2px solid #ef4444; }
    .valley-state.critical { animation: dangerPulse 2s ease infinite; }
    @keyframes dangerPulse {
      0%, 100% { border-color: #ef4444; background: #fee2e2; }
      50% { border-color: #dc2626; background: #fecaca; }
    }
    .valley-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .valley-header h4 { font-size: 1.3rem; color: #1e293b; }
    .valley-formula { font-family: "Courier New", monospace; font-size: 1rem; padding: 0.4rem 0.8rem; background: #e0e7ff; border-radius: 6px; color: #3730a3; }
    .valley-pool { display: flex; gap: 1rem; justify-content: center; margin: 2rem 0 1rem; }
    .valley-card { width: 70px; height: 90px; background: white; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; font-weight: 700; color: #1e293b; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2); border: 2px solid #e2e8f0; }
    .valley-card.pulse { animation: cardPulse 1s ease infinite; }
    @keyframes cardPulse {
      0%, 100% { transform: scale(1); box-shadow: 0 4px 20px rgba(239, 68, 68, 0.4); border-color: #ef4444; }
      50% { transform: scale(1.05); box-shadow: 0 8px 30px rgba(239, 68, 68, 0.6); border-color: #dc2626; }
    }
    .warning-text { text-align: center; padding: 0.75rem 1rem; background: #fee2e2; border-radius: 8px; font-weight: 600; color: #991b1b; margin-top: 0.5rem; border: 2px solid #ef4444; }
    .declare-text { text-align: center; padding: 0.75rem 1rem; background: #dcfce7; border-radius: 8px; font-weight: 600; color: #166534; margin-top: 0.5rem; border: 2px solid #22c55e; }
    .phase-dots { display: flex; justify-content: center; gap: 0.6rem; margin-top: 1.5rem; }
    .dot { width: 10px; height: 10px; border-radius: 50%; background: #cbd5e1; transition: all 0.3s; }
    .dot.active { background: #3b82f6; transform: scale(1.4); }

    .definition-box { background: #dbeafe; border: 2px solid #3b82f6; border-radius: 12px; padding: 2rem; margin: 2rem 0; }
    .definition-box h3 { color: #1e40af; margin-bottom: 1rem; }

    .impact-grid { margin: 3rem 0; }
    .impact-grid h3 { color: #1e40af; margin-bottom: 1.5rem; font-size: 1.4rem; }
    .impact-item { display: flex; gap: 1rem; align-items: flex-start; padding: 0.9rem 1rem; margin: 0.6rem 0; background: #f8fafc; border-radius: 8px; border: 2px solid #e2e8f0; transition: all 0.3s; }
    .impact-item:hover { background: #f1f5f9; transform: translateX(6px); border-color: #3b82f6; }
    .impact-icon { font-size: 1.4rem; flex-shrink: 0; }
    .impact-text { color: #334155; line-height: 1.6; }

    .contrast-box { background: #dcfce7; border: 2px solid #22c55e; border-radius: 12px; padding: 2rem; margin: 2rem 0; }
    .contrast-box h3 { color: #166534; margin-bottom: 1rem; }
    .contrast-box ul { list-style: none; padding: 0; margin: 0 0 1rem; }
    .contrast-box li { padding: 0.4rem 0; color: #15803d; }
    .contrast-box li::before { content: '→'; margin-right: 0.75rem; color: #22c55e; }
    .contrast-box p { color: #15803d; }

    .state-tree { background: white; border-radius: 16px; padding: 2rem; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1); margin: 3rem 0; }
    .tree-header h3 { color: #1e293b; margin-bottom: 1.5rem; text-align: center; font-size: 1.6rem; }
    .tree-columns { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
    .tree-col h4 { color: #475569; margin-bottom: 1rem; text-align: center; font-size: 1.1rem; padding-bottom: 0.75rem; border-bottom: 2px solid #e2e8f0; }
    .tree-nodes { display: flex; flex-direction: column; gap: 0.6rem; }
    .node { padding: 0.75rem 1rem; background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 8px; text-align: center; font-weight: 500; color: #334155; transition: all 0.3s; font-size: 0.95rem; }
    .node:hover { transform: translateX(4px); border-color: #3b82f6; }
    .node.winner { background: #dcfce7; border-color: #22c55e; color: #166534; font-weight: 700; }
    .node.skipped { background: #fee2e2; border-color: #dc2626; color: #991b1b; font-weight: 700; }
    .node.death-valley { background: #fef3c7; border-color: #f59e0b; color: #92400e; font-weight: 700; }

    .conclusion { background: linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%); }
    .final-thoughts { margin-top: 2rem; padding: 2rem; background: white; border-radius: 12px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); }
    .final-thoughts p { margin-bottom: 1rem; }

    .corrected-game { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #e2e8f0; }
    .corrected-game h2 { color: #fff; }
    .disclaimer { font-size: 0.95rem; color: #94a3b8; font-style: italic; padding: 1rem 1.25rem; background: rgba(15, 23, 42, 0.7); border-radius: 8px; border-left: 3px solid #60a5fa; margin-bottom: 2rem; }

    .corrected-game-container { background: white; border-radius: 16px; padding: 2rem; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.35); }
    .game-start { text-align: center; padding: 3rem 2rem; }
    .start-game-btn { padding: 1.3rem 2.7rem; font-size: 1.1rem; background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; border: none; border-radius: 12px; cursor: pointer; font-weight: 600; transition: all 0.3s; box-shadow: 0 4px 20px rgba(59, 130, 246, 0.3); font-family: inherit; }
    .start-game-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 30px rgba(59, 130, 246, 0.4); }

    .key-difference { margin-top: 2.5rem; text-align: left; max-width: 520px; margin-left: auto; margin-right: auto; padding: 1.8rem; background: #f8fafc; border-radius: 12px; }
    .key-difference h4 { color: #1e293b; margin-bottom: 0.75rem; }
    .key-difference ul { list-style: none; padding: 0; margin: 0; }
    .key-difference li { padding: 0.4rem 0; color: #334155; display: flex; align-items: flex-start; gap: 0.5rem; }

    .game-state-display { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 2rem; }
    .player-status, .computer-status { padding: 1.3rem; background: #f8fafc; border-radius: 12px; }
    .player-status h4, .computer-status h4 { color: #1e293b; margin-bottom: 0.75rem; }
    .pool-display { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 0.75rem; min-height: 60px; }
    .pool-number { background: #e0e7ff; color: #3730a3; padding: 0.4rem 0.6rem; border-radius: 6px; font-weight: 600; font-size: 0.85rem; }
    .pool-number.computer { background: #fecaca; color: #991b1b; }
    .pool-count { color: #64748b; font-size: 0.85rem; font-weight: 600; }

    .player-controls { background: #dbeafe; padding: 1.75rem; border-radius: 12px; margin-bottom: 2rem; }
    .player-controls h4 { color: #1e40af; margin-bottom: 1rem; }
    .range-controls { display: flex; gap: 1.5rem; margin-bottom: 1rem; align-items: flex-end; flex-wrap: wrap; }
    .range-control label { display: block; margin-bottom: 0.5rem; color: #1e40af; font-weight: 600; }
    .number-spinner { display: flex; gap: 0.5rem; align-items: center; }
    .number-spinner button { padding: 0.4rem 0.9rem; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 1.1rem; font-family: inherit; transition: all 0.2s; }
    .number-spinner button:hover { background: #2563eb; }
    .number-spinner button:disabled { background: #cbd5e1; cursor: not-allowed; }
    .number-display { padding: 0.6rem 1.2rem; background: white; border-radius: 6px; font-weight: 600; font-size: 1.05rem; min-width: 50px; text-align: center; }

    .guess-btn { width: 100%; padding: 0.9rem 1.2rem; background: #3b82f6; color: white; border: none; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: all 0.2s; font-family: inherit; }
    .guess-btn:hover { background: #2563eb; transform: translateY(-2px); }

    .waiting { text-align: center; padding: 1.75rem; background: #f8fafc; border-radius: 12px; margin-bottom: 2rem; }
    .spinner { font-size: 2rem; animation: spin 2s linear infinite; }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    .waiting p { color: #64748b; margin-top: 0.75rem; }

    .game-over { text-align: center; padding: 2.5rem 2rem; border-radius: 12px; margin-bottom: 2rem; }
    .game-over.player { background: #dcfce7; border: 3px solid #22c55e; }
    .game-over.computer { background: #fee2e2; border: 3px solid #ef4444; }
    .game-over h3 { font-size: 1.8rem; margin-bottom: 1rem; }
    .game-over.player h3 { color: #166534; }
    .game-over.computer h3 { color: #991b1b; }
    .play-again-btn { padding: 0.9rem 1.8rem; background: #1e293b; color: white; border: none; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: all 0.2s; font-family: inherit; }
    .play-again-btn:hover { background: #0f172a; transform: translateY(-2px); }

    .game-log { background: #f8fafc; padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem; }
    .game-log h4 { color: #1e293b; margin-bottom: 0.8rem; }
    .log-entries { max-height: 260px; overflow-y: auto; }
    .log-entry { padding: 0.45rem 0.6rem; margin: 0.2rem 0; background: white; border-radius: 6px; font-size: 0.9rem; color: #334155; font-family: "Courier New", monospace; }

    .code-download { background: #f1f5f9; padding: 1.8rem; border-radius: 12px; text-align: center; }

    .footer { background: #0f172a; color: white; padding: 3rem 2rem; margin-top: 3rem; }
    .footer-content { max-width: 800px; margin: 0 auto; text-align: center; }
    .contact { display: flex; align-items: center; justify-content: center; gap: 0.75rem; font-size: 1.05rem; margin-bottom: 1rem; color: #60a5fa; }
    .footer-note { color: #94a3b8; font-size: 0.95rem; }

    @media (max-width: 768px) {
      .section { padding: 3.5rem 1.5rem; }
      .game-state { grid-template-columns: 1fr; }
      .vs-divider { transform: rotate(90deg); margin: 1rem 0; }
      .tree-columns { grid-template-columns: 1fr; }
      .stat-grid { grid-template-columns: 1fr; }
      .game-state-display { grid-template-columns: 1fr; }
      .range-controls { flex-direction: column; align-items: stretch; }
    }
  `}</style>
);

