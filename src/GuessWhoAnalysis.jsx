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
            How Dr. Mihai Nica&apos;s Python implementation introduced a Race-to-1
            win condition that diverges from the actual rules of Guess Who—and how
            I uncovered the discrepancy, formalized it, and built a corrected
            model that reflects the real, turn-based game.
          </p>
        </div>
      </header>

      {/* Mark Rober Section */}
      <section className="section">
        <div className="content">
          <h2>The Viral Strategy</h2>
          <p>
            On November 17, 2015, Mark Rober—former NASA engineer, Apple product
            designer, and now a massively popular YouTuber—released a video claiming
            to have found a dominant strategy for Guess Who.
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

          <p>
            The idea was simple: play Guess Who like a binary search. Ask questions
            that cut the space of faces in half instead of narrow, feature-based
            questions.
          </p>

          <div className="stat-grid">
            <div className="stat">
              <div className="stat-value">80%</div>
              <div className="stat-label">Win rate in single games</div>
            </div>
            <div className="stat">
              <div className="stat-value">96%</div>
              <div className="stat-label">Win rate in first-to-five series</div>
            </div>
            <div className="stat">
              <div className="stat-value">155M+</div>
              <div className="stat-label">Combined views</div>
            </div>
          </div>

          <p>
            Together with the IShowSpeed short, Rober&apos;s framing effectively made
            binary search the &quot;accepted&quot; public strategy for Guess Who.
          </p>
        </div>
      </section>

      {/* Dr. Nica Section */}
      <section className="section alt">
        <div className="content">
          <h2>Enter Dr. Mihai Nica</h2>
          <p>
            Months before Rober&apos;s video, Dr. Mihai Nica released his paper
            <em> &quot;Optimal Strategy in Guess Who?: Beyond Binary Search&quot;</em>,
            showing that a dynamic-programming strategy can outperform naïve binary search.
          </p>

          <div className="paper-card">
            <div className="paper-title">
              &quot;Optimal Strategy in &apos;Guess Who?&apos;: Beyond Binary Search&quot;
            </div>
            <div className="paper-versions">
              <span>Version 1: September 8, 2015</span>
              <span>Version 2: January 16, 2016</span>
            </div>
          </div>

          <p>
            In November 2025 he revisited the work in a YouTube lecture and published
            a marimo-based &quot;Guess Who? Simulator&quot;—a number abstraction of the game.
          </p>

          <div className="video-card">
            <a
              href="https://www.youtube.com/watch?v=_3RNB8eOSx0"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="video-icon">📺</div>
              <div className="video-info">
                <div className="video-title">Dr. Mihai Nica&apos;s Lecture</div>
                <div className="video-date">November 21, 2025</div>
              </div>
              <ExternalLink size={20} />
            </a>
          </div>

          <p>
            The simulator uses numbers instead of faces. You ask interval questions
            [a,b]? and get YES/NO answers, shrinking your candidate pool.
          </p>

          <div className="callout">
            <strong>The Mathematical Model</strong>
            <ul>
              <li>Each player secretly chooses a number in {{ }["{1,…,N}"]}</li>
              <li>Moves are questions of the form [a,b]?</li>
              <li>Answers are YES or NO, and each answer shrinks the pool</li>
            </ul>
          </div>

          <p className="emphasis">
            This is not the literal physical Guess Who ruleset—this modeling choice
            is where the Race-to-1 vs turn-based discrepancy appears.
          </p>
        </div>
      </section>

      {/* Discovery */}
      <section className="section">
        <div className="content">
          <h2>The Discovery</h2>
          <p>When I started playing with Nica&apos;s simulator, I noticed:</p>
          <ul className="discovery-list">
            <li>It occasionally declared wins too early</li>
            <li>The opponent sometimes lost the right to a final turn</li>
            <li>
              I could &quot;win&quot; by logically deducing the number (n=1) even
              though I had never declared it
            </li>
          </ul>

          <p>
            In real Guess Who, narrowing to one candidate doesn&apos;t win. You still
            must spend a turn declaring the guess—and your opponent gets a last shot
            in between.
          </p>

          <p className="emphasis">
            That missing &quot;you know but must pass&quot; state is Death Valley.
          </p>
        </div>
      </section>

      {/* Formal notation (kept short) */}
      <section className="section alt">
        <div className="content">
          <h2>Formal Game Structure</h2>

          <div className="math-block-container">
            <h3>State</h3>
            <p>Each player tracks a candidate set for the opponent:</p>
            <ul>
              <li>S₁: P1&apos;s remaining candidates, |S₁| = n</li>
              <li>S₂: P2&apos;s remaining candidates, |S₂| = m</li>
            </ul>
            <div className="formula-display">
              Start of 1–20 game: S₁ = S₂ = {'{1, …, 20}'}, n = m = 20
            </div>
          </div>

          <div className="math-block-container">
            <h3>Questions</h3>
            <p>A move is an interval question:</p>
            <p className="quote">&quot;Is your number between a and b?&quot;</p>
            <p>We write a half-move as:</p>
            <div className="formula-display">[a,b]? (A; n → n&apos;)</div>
            <p>
              where A ∈ {'{Y,N}'} and n → n&apos; describes how your pool changes
              after the answer.
            </p>
          </div>
        </div>
      </section>

      {/* Example playback showing Race-to-1 issue */}
      <section className="section">
        <div className="content">
          <h2>Example Game: Where the Race-to-1 Model Breaks</h2>
          <p>
            In the sequence below, Nica&apos;s simulator declares P1 the winner
            as soon as their pool reaches size 1—without giving P2 their final
            turn that exists in the real game.
          </p>
          <GamePlayback />

          <div className="analysis-box">
            <h3>The Critical Moment</h3>
            <p>
              After asking &quot;Is your number 4?&quot; and getting NO, your pool
              is {{ }["{5}"]} so n=1. The simulator instantly ends the game in your
              favor.
            </p>
            <p className="emphasis">
              In the real board game, that is exactly the Death Valley state:
              you know the answer but must pass the turn. P2 still gets a final
              guess and can steal the win.
            </p>
          </div>
        </div>
      </section>

      {/* Death Valley */}
      <section className="section death-valley-section">
        <div className="content">
          <h2>Death Valley: Knowing But Not Winning</h2>

          <p>
            In Nica&apos;s Race-to-1 abstraction, reaching n = 1 is an absorbing
            win: the game ends the moment you deduce the opponent&apos;s number.
          </p>

          <div className="formula-display">n = 1 ⇒ immediate win (Race-to-1)</div>

          <p>
            In the real game, the state n = 1 while it&apos;s still your opponent&apos;s
            turn is a dangerous limbo: Death Valley.
          </p>

          <DeathValleyViz />

          <div className="definition-box">
            <h3>Definition</h3>
            <p>
              <strong>Death Valley</strong> is the state where you have a single
              remaining candidate but must pass the turn. You know the answer,
              but you can still lose before you get to say it.
            </p>
          </div>

          <div className="impact-grid">
            <h3>Why It Matters</h3>
            <div className="impact-item">
              <div className="impact-icon">❌</div>
              <div className="impact-text">
                Aggressive guesses that drop you into n=1 can be dangerous, not
                automatically winning.
              </div>
            </div>
            <div className="impact-item">
              <div className="impact-icon">⚡</div>
              <div className="impact-text">
                Race-to-1 &quot;wins early&quot; by treating n=1 as a victory,
                skipping the opponent&apos;s last chance.
              </div>
            </div>
            <div className="impact-item">
              <div className="impact-icon">⏱️</div>
              <div className="impact-text">
                Real Guess Who is about timing and turn order, not just deduction.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Turn structure comparison */}
      <section className="section">
        <div className="content">
          <h2>Turn Structure: Race-to-1 vs Real Guess Who</h2>
          <p>
            The same sequence of questions leads to different outcomes depending
            on whether n=1 is treated as &quot;win now&quot; or &quot;wait and
            survive.&quot;
          </p>
          <StateTree />
        </div>
      </section>

      {/* DP / Optimal strategy summary */}
      <section className="section alt">
        <div className="content">
          <h2>Optimal Death Valley Strategy V(n,m)</h2>

          <div className="math-block-container">
            <h3>The Value Function</h3>
            <p>
              I define V(n,m) as the win probability for the player to move when
              their pool has size n and the opponent&apos;s pool has size m,
              under the *turn-based* rules with Death Valley (no auto-win at
              n=1, must still guess).
            </p>
            <div className="formula-display">
              V(20,20) ≈ 0.63
              <br />
              b*(20,20) = 8
            </div>
            <p>
              The optimal first question is not a perfect half-split;
              it&apos;s &quot;Is your number in the first 8 candidates?&quot;
            </p>
          </div>

          <div className="math-block-container">
            <h3>DP Recurrence</h3>
            <p>
              The DP chooses between guessing now and asking a question of size b:
            </p>
            <div className="formula-display">
              V(n,m) = max &#123; 1/n (guess),
              <br />
              max<sub>1 ≤ b ≤ n−1</sub> [ (b/n)(1 − V(m,b)) + (1 − b/n)(1 − V(m,n−b)) ] &#125;
            </div>
            <p>
              Reaching n=1 does not auto-win; it simply gives you a nearly 100%
              state on your next turn if you survive the opponent&apos;s shot.
            </p>
          </div>
        </div>
      </section>

      {/* Conclusion */}
      <section className="section conclusion">
        <div className="content">
          <h2>The Core Issue</h2>

          <p className="emphasis large">
            Nica&apos;s simulator doesn&apos;t simulate the standard Guess Who rules.
            <br />
            It simulates a different game entirely: a Race-to-1 deduction race.
          </p>

          <div className="final-thoughts">
            <p>
              That race is mathematically elegant, but removing Death Valley
              changes the strategy space. You win by being first to deduce,
              not by surviving the opponent&apos;s last guess.
            </p>
            <p>
              My corrected model keeps the turn structure intact and asks:
              &quot;What is optimal when you can know and still lose?&quot;
            </p>
          </div>
        </div>
      </section>

      {/* Corrected implementation section */}
      <section className="section corrected-game">
        <div className="content">
          <h2>Interactive: Corrected Game vs Optimal Death Valley Bot</h2>

          <p className="disclaimer">
            This implementation uses a dynamic program on V(n,m) that keeps the
            Death Valley state and requires exact guesses to win. The bot plays
            (approximately) optimally according to that DP.
          </p>

          <CorrectedGame />
        </div>
      </section>

      {/* Nica Response (kept, slightly compressed) */}
      <section className="section nica-response">
        <div className="content">
          <h2>Conversation with Dr. Nica</h2>

          <div className="conversation">
            <div className="message dylan">
              <div className="message-header">
                <strong>Dylan Tague:</strong>
              </div>
              <div className="message-content">
                <p>
                  I pointed out that the marimo simulator treats &quot;reducing
                  to one candidate&quot; as an immediate win. In the physical
                  Guess Who rules I&apos;m familiar with, you still must declare
                  your guess on a later turn, so a player can know the answer
                  and still lose if it isn&apos;t their turn.
                </p>
              </div>
            </div>

            <div className="message nica">
              <div className="message-header">
                <strong>Dr. Mihai Nica:</strong>
              </div>
              <div className="message-content">
                <p>
                  He clarified that treating n=1 as an auto-win is an intentional
                  modeling choice: one among several rulesets he simulated, and
                  the one he found most mathematically elegant.
                </p>
              </div>
            </div>

            <div className="message dylan">
              <div className="message-header">
                <strong>Dylan Tague:</strong>
              </div>
              <div className="message-content">
                <p>
                  My concern wasn&apos;t that the model is &quot;wrong&quot; but
                  that it changes the game-theoretic structure compared to the
                  standard Milton Bradley / Hasbro rules. Under those rules, the
                  extra turn can shift victory percentages, because players can
                  escape seemingly lost positions.
                </p>
              </div>
            </div>
          </div>

          <div className="reflection-box">
            <h3>Reflection</h3>
            <p>
              Both models are valid; they simply ask different questions. Nica&apos;s
              model solves a pure deduction race. My corrected model solves the
              actual turn-based game where Death Valley exists and &quot;knowing&quot;
              is not the same as &quot;winning.&quot;
            </p>
          </div>
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
            Part of a portfolio exploring gaps between mathematical models and
            real-world rulesets in games like Guess Who.
          </div>
        </div>
      </footer>

      <Styles />
    </div>
  );
}

// =======================
// Example Race-to-1 Playback
// =======================
const GamePlayback = () => {
  const [currentMove, setCurrentMove] = useState(0);

  const moves = [
    {
      p1: { question: "Initial", answer: "", n: 20, pool: Array.from({ length: 20 }, (_, i) => i + 1) },
      p2: { question: "", answer: "", m: 20, pool: Array.from({ length: 20 }, (_, i) => i + 1) },
    },
    {
      p1: { question: "[1,9]?", answer: "Y", n: 9, pool: [1, 2, 3, 4, 5, 6, 7, 8, 9] },
      p2: { question: "[1,8]?", answer: "N", m: 12, pool: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20] },
    },
    {
      p1: { question: "[1,5]?", answer: "Y", n: 5, pool: [1, 2, 3, 4, 5] },
      p2: { question: "[9,12]?", answer: "N", m: 8, pool: [13, 14, 15, 16, 17, 18, 19, 20] },
    },
    {
      p1: { question: "[1,3]?", answer: "N", n: 2, pool: [4, 5] },
      p2: { question: "[13,13]?", answer: "N", m: 7, pool: [14, 15, 16, 17, 18, 19, 20] },
    },
    {
      p1: { question: "[4,4]?", answer: "N", n: 1, pool: [5], winner: true },
      p2: { question: "—", answer: "", m: 7, pool: [14, 15, 16, 17, 18, 19, 20], skipped: true },
    },
  ];

  const handleContinue = () => {
    if (currentMove < moves.length - 1) {
      setCurrentMove((m) => m + 1);
    }
  };

  const handleReset = () => {
    setCurrentMove(0);
  };

  const currentState = moves[currentMove];
  const isLastMove = currentMove === moves.length - 1;

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
            <h3>P1 (Me)</h3>
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
              ⚠️ Simulator declares: P1 wins instantly at n=1
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
            <div className="skipped-badge">Turn Skipped</div>
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
    const id = setInterval(() => {
      setPhase((p) => (p + 1) % 4);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  const phases = [
    { title: "Safe Zone", desc: "n ≥ 3", danger: false, pool: [3, 4, 5, 6, 7] },
    { title: "Approaching", desc: "n = 2", danger: true, pool: [4, 5] },
    { title: "Death Valley", desc: "n = 1", danger: true, pool: [5], critical: true },
    {
      title: "Your Next Turn",
      desc: "Declare the answer",
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
            ⚠️ You know the answer but must pass the turn.
          </div>
        )}
        {current.declare && (
          <div className="declare-text">
            ✓ Opponent misses → you can now declare &quot;You are 5&quot;.
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
// State Tree Comparison
// =======================
const StateTree = () => {
  return (
    <div className="state-tree">
      <div className="tree-header">
        <h3>Turn Structure Comparison</h3>
      </div>

      <div className="tree-columns">
        <div className="tree-col">
          <h4>Race-to-1 Model</h4>
          <div className="tree-nodes">
            <div className="node">n = 20, m = 20</div>
            <div className="node">n = 9, m = 12</div>
            <div className="node">n = 5, m = 8</div>
            <div className="node">n = 2, m = 7</div>
            <div className="node winner">n = 1 → P1 wins immediately</div>
            <div className="node skipped">P2&apos;s last turn removed</div>
          </div>
        </div>

        <div className="tree-col">
          <h4>Real Guess Who (Death Valley)</h4>
          <div className="tree-nodes">
            <div className="node">n = 20, m = 20</div>
            <div className="node">n = 9, m = 12</div>
            <div className="node">n = 5, m = 8</div>
            <div className="node">n = 2, m = 7</div>
            <div className="node death-valley">n = 1, m = 7 (Death Valley)</div>
            <div className="node">P2 gets final guess</div>
            <div className="node winner">P1 declares afterwards → P1 wins</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// =======================
// Death Valley DP + Evaluation
// =======================

const MAX_POOL_SIZE = 20;

const dvValueMemo = new Map();   // "n,m" -> V(n,m)
const dvBestBidMemo = new Map(); // "n,m" -> best b (if question beats guess)

const dvKey = (n, m) => `${n},${m}`;

function dvValue(n, m) {
  if (n <= 0 || m <= 0) return 0.5;

  const key = dvKey(n, m);
  const cached = dvValueMemo.get(key);
  if (cached !== undefined) return cached;

  // Option 1: guess now
  let bestVal = 1 / n;
  let bestB = 0;

  // Option 2: ask question of size b
  if (n > 1) {
    for (let b = 1; b <= n - 1; b++) {
      const pYes = b / n;
      const valYes = 1 - dvValue(m, b);      // opponent to move in (m,b)
      const valNo = 1 - dvValue(m, n - b);   // opponent to move in (m,n-b)
      const ev = pYes * valYes + (1 - pYes) * valNo;
      if (ev > bestVal + 1e-12) {
        bestVal = ev;
        bestB = b;
      }
    }
  }

  dvValueMemo.set(key, bestVal);
  if (bestB > 0) {
    dvBestBidMemo.set(key, bestB);
  }
  return bestVal;
}

function precomputeDeathValleyStrategy() {
  for (let n = 1; n <= MAX_POOL_SIZE; n++) {
    for (let m = 1; m <= MAX_POOL_SIZE; m++) {
      dvValue(n, m);
    }
  }
}
precomputeDeathValleyStrategy();

// If dvBestBidMemo has no b for (n,m), guessing is optimal (or tied)
function getOptimalBotAction(n, m) {
  if (n <= 1) {
    return { type: "guess" };
  }
  const key = dvKey(n, m);
  const b = dvBestBidMemo.get(key);
  if (b === undefined) {
    return { type: "guess" };
  }
  return { type: "question", b };
}

// Player 1 (human) win probability from current state
function getPlayerPerspectiveWinProb(nPlayer, nComputer, isPlayerTurn) {
  if (nPlayer <= 0 || nComputer <= 0) return 0.5;
  if (isPlayerTurn) {
    return dvValue(nPlayer, nComputer);
  }
  return 1 - dvValue(nComputer, nPlayer);
}

// Move quality evaluation
function evaluatePlayerMoveQuality({
  nBefore,
  mBefore,
  b,
  preWin,
  branchWin,
}) {
  if (nBefore <= 1 || b <= 0 || b >= nBefore) return null;

  const optimalVal = dvValue(nBefore, mBefore);
  const optimalB = dvBestBidMemo.get(dvKey(nBefore, mBefore)) ?? null;

  const pYes = b / nBefore;
  const valYes = 1 - dvValue(mBefore, b);
  const valNo = 1 - dvValue(mBefore, nBefore - b);
  const actualEV = pYes * valYes + (1 - pYes) * valNo;
  const evLoss = Math.max(0, optimalVal - actualEV);

  const branchGain = branchWin - preWin;
  const branchDrop = preWin - branchWin;

  const HUGE_GAIN = 0.15;
  const LONG_SHOT_BASELINE = 0.25;
  const LONG_SHOT_TARGET = 0.9;

  // === Long-shot brilliant: you were basically dead, low-odds shot hits ===
  if (
    preWin <= LONG_SHOT_BASELINE &&
    b === 1 &&
    nBefore >= 4 &&
    branchWin >= LONG_SHOT_TARGET
  ) {
    return {
      category: "brilliant",
      label: "Brilliant long-shot (beating the odds)",
      icon: "???",
    };
  }

  // === Engine-brilliant: suboptimal line but huge real improvement ===
  if (
    optimalB !== null &&
    b !== optimalB &&
    evLoss > 0.01 &&
    branchGain >= HUGE_GAIN &&
    branchWin >= optimalVal - 1e-6
  ) {
    return {
      category: "brilliant",
      label: "Brilliant (non-engine idea, huge improvement)",
      icon: "???",
    };
  }

  // === Best move: matched engine line and didn’t damage your eval ===
  if (optimalB !== null && b === optimalB && branchDrop <= 0.005) {
    return {
      category: "best",
      label: "Best move (engine line)",
      icon: "!!",
    };
  }

  // === Everything else: classify by how much your odds changed ===
  let category = "good";
  let label = "Good move";
  let icon = "✓";

  if (branchGain >= 0.05) {
    category = "great";
    label = "Great move";
    icon = "★";
  } else if (branchGain >= 0.01) {
    category = "good";
    label = "Good move";
    icon = "✓";
  } else if (branchDrop <= 0.03) {
    category = "good";
    label = "Good / neutral move";
    icon = "✓";
  } else if (branchDrop <= 0.08) {
    category = "inaccuracy";
    label = "Inaccuracy";
    icon = "!?";
  } else if (branchDrop <= 0.20) {
    category = "mistake";
    label = "Mistake";
    icon = "?";
  } else {
    category = "blunder";
    label = "Blunder";
    icon = "!!!";
  }

  return { category, label, icon };
}

// =======================
// Corrected Game Component
// =======================
const CorrectedGame = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [playerSecret, setPlayerSecret] = useState(null);   // number you guess
  const [computerSecret, setComputerSecret] = useState(null); // number bot guesses
  const [playerPool, setPlayerPool] = useState([]);
  const [computerPool, setComputerPool] = useState([]);
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [gameLog, setGameLog] = useState([]);
  const [winner, setWinner] = useState(null);
  const [playerTurn, setPlayerTurn] = useState(true);
  const [winProb, setWinProb] = useState(null); // live P1 win chance
  const [lastMoveQuality, setLastMoveQuality] = useState(null);

  const startGame = () => {
    const computerHidden = Math.floor(Math.random() * 20) + 1;
    const playerHidden = Math.floor(Math.random() * 20) + 1;

    setPlayerSecret(computerHidden);
    setComputerSecret(playerHidden);

    const fullPool = Array.from({ length: 20 }, (_, i) => i + 1);

    setPlayerPool(fullPool);
    setComputerPool(fullPool);
    setSelectedNumbers([]);
    setGameLog([
      "🎮 Game started! Each side chooses a secret number between 1 and 20.",
      "🤖 Bot strategy: Optimal Death Valley DP (V(n,m) with guess vs question).",
    ]);
    setWinner(null);
    setGameStarted(true);
    setPlayerTurn(true);

    const initialWin = getPlayerPerspectiveWinProb(20, 20, true);
    setWinProb(initialWin);
    setLastMoveQuality(null);
  };

  const handleNumberClick = (num) => {
    if (!playerTurn || winner) return;
    if (!playerPool.includes(num)) return;

    if (selectedNumbers.includes(num)) {
      setSelectedNumbers(selectedNumbers.filter((n) => n !== num));
    } else if (selectedNumbers.length < 2) {
      setSelectedNumbers([...selectedNumbers, num].sort((a, b) => a - b));
    } else {
      setSelectedNumbers([num]);
    }
  };

  const makeRangeGuess = () => {
    if (!playerTurn || winner || selectedNumbers.length === 0) return;

    const nBefore = playerPool.length;
    const mBefore = computerPool.length;
    const preWin = getPlayerPerspectiveWinProb(nBefore, mBefore, true);

    const min = selectedNumbers[0];
    const max =
      selectedNumbers.length === 2 ? selectedNumbers[1] : selectedNumbers[0];

    // Exact guess
    if (min === max) {
      const guess = min;
      const b = 1;

      if (guess === playerSecret) {
        const branchWin = 1.0;
        const quality = evaluatePlayerMoveQuality({
          nBefore,
          mBefore,
          b,
          preWin,
          branchWin,
        });
        setLastMoveQuality(quality || null);

        setGameLog((prev) => [
          ...prev,
          `👤 You asked: [${guess}, ${guess}]? Answer: YES — Correct! You win.`,
        ]);
        setWinner("player");
        setWinProb(1.0);
        setSelectedNumbers([]);
        return;
      }

      // Wrong exact guess: remove that candidate from your pool
      const newPlayerPool = playerPool.filter((x) => x !== guess);

      setGameLog((prev) => [
        ...prev,
        `👤 You asked: [${guess}, ${guess}]? Answer: NO (${newPlayerPool.length} remaining)`,
      ]);

      setPlayerPool(newPlayerPool);

      const branchWin = getPlayerPerspectiveWinProb(
        newPlayerPool.length,
        computerPool.length,
        false
      );
      setWinProb(branchWin);

      const quality = evaluatePlayerMoveQuality({
        nBefore,
        mBefore,
        b,
        preWin,
        branchWin,
      });
      setLastMoveQuality(quality || null);

      setSelectedNumbers([]);
      setPlayerTurn(false);
      setTimeout(() => computerTurn(), 700);
      return;
    }

    // Range question
    const inRange = min <= playerSecret && playerSecret <= max;

    const newPlayerPool = inRange
      ? playerPool.filter((x) => x >= min && x <= max)
      : playerPool.filter((x) => x < min || x > max);

    const b = newPlayerPool.length === 0
      ? 0
      : playerPool.filter((x) => x >= min && x <= max).length; // subset size in your pool

    setPlayerPool(newPlayerPool);

    const logMsg = `👤 You asked: [${min}, ${max}]? Answer: ${
      inRange ? "YES" : "NO"
    } (${newPlayerPool.length} remaining)`;
    setGameLog((prev) => [...prev, logMsg]);

    const branchWin = getPlayerPerspectiveWinProb(
      newPlayerPool.length,
      computerPool.length,
      false
    );
    setWinProb(branchWin);

    const quality =
      b > 0
        ? evaluatePlayerMoveQuality({
            nBefore,
            mBefore,
            b,
            preWin,
            branchWin,
          })
        : null;
    setLastMoveQuality(quality || null);

    setSelectedNumbers([]);
    setPlayerTurn(false);
    setTimeout(() => computerTurn(), 700);
  };

  const computerTurn = () => {
    if (winner) return;

    const n = computerPool.length;
    const m = playerPool.length;

    if (n <= 0 || m <= 0) return;

    const action = getOptimalBotAction(n, m);

    // Bot chooses to guess
    if (action.type === "guess") {
      const guessIndex = Math.floor(Math.random() * n);
      const guess = computerPool[guessIndex];

      if (guess === computerSecret) {
        setGameLog((prev) => [
          ...prev,
          `🤖 Computer guesses ${guess} — Correct. Computer wins.`,
        ]);
        setWinner("computer");
        setWinProb(0.0);
        return;
      }

      const newComputerPool = computerPool.filter((x) => x !== guess);
      setComputerPool(newComputerPool);

      setGameLog((prev) => [
        ...prev,
        `🤖 Computer guesses ${guess} — Wrong (${newComputerPool.length} remaining)`,
      ]);

      const newWin = getPlayerPerspectiveWinProb(
        playerPool.length,
        newComputerPool.length,
        true
      );
      setWinProb(newWin);
      setLastMoveQuality(null);
      setPlayerTurn(true);
      return;
    }

    // Bot asks optimal question of size b
    const bidSize = action.b;
    const sorted = [...computerPool].sort((a, b) => a - b);
    const subset = sorted.slice(0, bidSize);
    const minQ = subset[0];
    const maxQ = subset[subset.length - 1];

    const inSubset = subset.includes(computerSecret);

    const newComputerPool = inSubset
      ? subset
      : computerPool.filter((x) => !subset.includes(x));

    setComputerPool(newComputerPool);

    const logMsg = `🤖 [ODV] asks: [${minQ}, ${maxQ}]? Answer: ${
      inSubset ? "YES" : "NO"
    } (${newComputerPool.length} remaining)`;
    setGameLog((prev) => [...prev, logMsg]);

    const newWin = getPlayerPerspectiveWinProb(
      playerPool.length,
      newComputerPool.length,
      true
    );
    setWinProb(newWin);
    setLastMoveQuality(null);
    setPlayerTurn(true);
  };

  return (
    <div className="corrected-game-container">
      {!gameStarted ? (
        <div className="game-start">
          <button onClick={startGame} className="start-game-btn">
            Start Corrected Game
          </button>

          <div className="key-difference">
            <h4>Key Rule Differences</h4>
            <ul>
              <li>✅ Must make an exact guess to win</li>
              <li>✅ Death Valley (n=1 but not your turn) is preserved</li>
              <li>✅ Bot uses DP V(n,m) with guess vs question</li>
              <li>❌ No auto-win just for reaching n=1</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="game-play">
          <div className="game-state-display">
            <div className="player-status">
              <h4>Your Status</h4>
              <div className="pool-display-interactive">
                {playerPool.map((n) => (
                  <span
                    key={n}
                    className={`pool-number-clickable ${
                      selectedNumbers.includes(n) ? "selected" : ""
                    }`}
                    onClick={() => handleNumberClick(n)}
                  >
                    {n}
                  </span>
                ))}
              </div>
              <div className="pool-count">
                {playerPool.length} possibilities
              </div>

              {winProb !== null && (
                <div className="win-prob">
                  Live win chance:{" "}
                  <span className="prob-number">
                    {(winProb * 100).toFixed(1)}%
                  </span>
                </div>
              )}

              {lastMoveQuality && (
                <div
                  className={`move-quality move-${lastMoveQuality.category}`}
                >
                  <span className="move-icon">{lastMoveQuality.icon}</span>
                  <span className="move-label">{lastMoveQuality.label}</span>
                </div>
              )}

              {selectedNumbers.length > 0 && (
                <div className="selection-display">
                  Selected: [{selectedNumbers[0]}
                  {selectedNumbers.length === 2
                    ? `, ${selectedNumbers[1]}`
                    : ""}
                  ]
                </div>
              )}
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
                {computerPool.length} possibilities
              </div>
            </div>
          </div>

          {!winner && playerTurn && (
            <div className="player-controls">
              <h4>Your Turn – Choose an Exact Guess or a Range</h4>
              <p className="instruction-text">
                Click numbers in your pool above. Click one number for an exact
                guess, or two numbers to ask about a contiguous range.
              </p>
              <button
                onClick={makeRangeGuess}
                className="guess-btn"
                disabled={selectedNumbers.length === 0}
                style={{
                  opacity: selectedNumbers.length === 0 ? 0.5 : 1,
                  cursor:
                    selectedNumbers.length === 0 ? "not-allowed" : "pointer",
                }}
              >
                {selectedNumbers.length === 0 && "Select numbers to make a move"}
                {selectedNumbers.length === 1 &&
                  `Ask: Is your number ${selectedNumbers[0]}?`}
                {selectedNumbers.length === 2 &&
                  `Ask: Is your number between ${selectedNumbers[0]} and ${selectedNumbers[1]}?`}
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
              <h3>{winner === "player" ? "🎉 You Won!" : "💻 Computer Won!"}</h3>
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

      <div className="code-download">
        <h4>Notes</h4>
        <p>
          Live win% is computed from the full Death Valley DP V(n,m) and updates
          after every move. Move-quality badges are evaluated purely from how
          your real odds change on the actual branch, plus brilliant flags for
          engine-defying and long-shot hits.
        </p>
      </div>
    </div>
  );
};

// =======================
// Styles
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
    .section.corrected-game { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); }
    .section.corrected-game h2 { color: white; }
    .section.corrected-game p { color: #e2e8f0; }

    .content { max-width: 800px; margin: 0 auto; }
    .section h2 { font-size: 2.5rem; margin-bottom: 2rem; color: #0f172a; font-weight: 700; }
    .section p { margin-bottom: 1.5rem; font-size: 1.1rem; color: #334155; }
    .emphasis { font-style: italic; color: #1e40af; font-weight: 500; }
    .emphasis.large { font-size: 1.5rem; line-height: 1.6; text-align: center; }

    .video-card { margin: 2rem 0; border: 2px solid #e2e8f0; border-radius: 12px; overflow: hidden; transition: all 0.3s ease; }
    .video-card:hover { border-color: #3b82f6; box-shadow: 0 10px 40px rgba(59, 130, 246, 0.1); transform: translateY(-2px); }
    .video-card a { display: flex; align-items: center; gap: 1.5rem; padding: 1.5rem; text-decoration: none; color: inherit; }
    .video-icon { font-size: 2rem; flex-shrink: 0; }
    .video-info { flex: 1; }
    .video-title { font-weight: 600; font-size: 1.1rem; color: #1e293b; margin-bottom: 0.25rem; }
    .video-date { color: #64748b; font-size: 0.9rem; }

    .stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem; margin: 3rem 0; }
    .stat { text-align: center; padding: 2rem; background: white; border-radius: 12px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); }
    .stat-value { font-size: 3rem; font-weight: 700; color: #2563eb; margin-bottom: 0.5rem; }
    .stat-label { color: #64748b; font-size: 0.95rem; }

    .paper-card { background: linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%); padding: 2rem; border-radius: 12px; border-left: 4px solid #3b82f6; margin: 2rem 0; }
    .paper-title { font-size: 1.3rem; font-weight: 600; color: #1e293b; margin-bottom: 1rem; }
    .paper-versions { display: flex; gap: 2rem; font-size: 0.95rem; color: #475569; }

    .callout { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 1.5rem; margin: 2rem 0; border-radius: 8px; }
    .callout strong { display: block; margin-bottom: 1rem; color: #92400e; }
    .callout ul { list-style: none; padding-left: 0; }
    .callout li { padding: 0.5rem 0; color: #78350f; }
    .callout li::before { content: '→'; margin-right: 0.75rem; color: #f59e0b; }

    .discovery-list { list-style: none; padding: 0; }
    .discovery-list li { padding: 1rem; margin: 1rem 0; background: #fee2e2; border-left: 4px solid #dc2626; border-radius: 8px; color: #7f1d1d; }

    .math-block-container { background: white; padding: 2rem; border-radius: 12px; margin: 2rem 0; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); }
    .math-block-container h3 { color: #1e293b; margin-bottom: 1rem; font-size: 1.4rem; }
    .formula-display { background: #f8fafc; padding: 1.5rem; border-radius: 8px; margin: 1rem 0; text-align: center; font-family: 'Courier New', monospace; font-size: 1.1rem; }
    .quote { font-style: italic; color: #475569; padding-left: 1rem; border-left: 3px solid #cbd5e1; }

    .game-playback { background: white; border-radius: 16px; padding: 2rem; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1); margin: 3rem 0; }
    .playback-controls { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 2px solid #e2e8f0; }
    .control-btn { display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.5rem; background: #3b82f6; color: white; border: none; border-radius: 8px; font-size: 1rem; cursor: pointer; transition: all 0.2s; font-family: inherit; }
    .control-btn:hover:not(:disabled) { background: #2563eb; transform: translateY(-2px); }
    .move-indicator { margin-left: auto; font-weight: 600; color: #475569; }

    .game-state { display: grid; grid-template-columns: 1fr auto 1fr; gap: 2rem; align-items: start; }
    .player-state { background: #f8fafc; border-radius: 12px; padding: 1.5rem; min-height: 260px; }
    .player-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
    .player-header h3 { color: #1e293b; font-size: 1.2rem; }
    .pool-size { background: #3b82f6; color: white; padding: 0.5rem 1rem; border-radius: 20px; font-weight: 600; font-size: 0.9rem; }

    .move-display { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; padding: 0.75rem; background: white; border-radius: 8px; }
    .question { font-weight: 600; color: #1e293b; }
    .answer { padding: 0.25rem 0.75rem; border-radius: 4px; font-weight: 600; font-size: 0.9rem; }
    .answer.yes { background: #dcfce7; color: #166534; }
    .answer.no { background: #fee2e2; color: #991b1b; }

    .candidate-pool { display: flex; flex-wrap: wrap; gap: 0.5rem; }
    .candidate { background: #e0e7ff; color: #3730a3; padding: 0.5rem 0.75rem; border-radius: 6px; font-weight: 600; }

    .winner-badge { margin-top: 1rem; padding: 1rem; background: #fef3c7; border: 2px solid #f59e0b; border-radius: 8px; text-align: center; font-weight: 600; color: #92400e; }
    .skipped-badge { margin-top: 1rem; padding: 1rem; background: #fee2e2; border: 2px solid #dc2626; border-radius: 8px; text-align: center; font-weight: 600; color: #991b1b; }
    .vs-divider { display: flex; align-items: center; justify-content: center; color: #cbd5e1; }

    .analysis-box { background: #fef3c7; border: 2px solid #f59e0b; border-radius: 12px; padding: 2rem; margin: 3rem 0; }
    .analysis-box h3 { color: #92400e; margin-bottom: 1rem; }

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
    .valley-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    .valley-header h4 { font-size: 1.5rem; color: #1e293b; }
    .valley-formula { font-family: 'Courier New', monospace; font-size: 1.1rem; padding: 0.5rem 1rem; background: #e0e7ff; border-radius: 6px; color: #3730a3; }
    .valley-pool { display: flex; gap: 1rem; justify-content: center; margin: 2rem 0; }
    .valley-card { width: 80px; height: 100px; background: white; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: 700; color: #1e293b; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2); border: 2px solid #e2e8f0; }
    .valley-card.pulse { animation: cardPulse 1s ease infinite; }
    @keyframes cardPulse {
      0%, 100% { transform: scale(1); box-shadow: 0 4px 20px rgba(239, 68, 68, 0.4); border-color: #ef4444; }
      50% { transform: scale(1.05); box-shadow: 0 8px 30px rgba(239, 68, 68, 0.6); border-color: #dc2626; }
    }
    .warning-text { text-align: center; padding: 1rem; background: #fee2e2; border-radius: 8px; font-weight: 600; color: #991b1b; margin-top: 1rem; border: 2px solid #ef4444; }
    .declare-text { text-align: center; padding: 1rem; background: #dcfce7; border-radius: 8px; font-weight: 600; color: #166534; margin-top: 1rem; border: 2px solid #22c55e; }
    .phase-dots { display: flex; justify-content: center; gap: 0.75rem; margin-top: 2rem; }
    .dot { width: 12px; height: 12px; border-radius: 50%; background: #cbd5e1; transition: all 0.3s; }
    .dot.active { background: #3b82f6; transform: scale(1.5); }

    .definition-box { background: #dbeafe; border: 2px solid #3b82f6; border-radius: 12px; padding: 2rem; margin: 2rem 0; }

    .impact-grid { margin: 3rem 0; }
    .impact-grid h3 { color: #1e40af; margin-bottom: 2rem; font-size: 1.5rem; }
    .impact-item { display: flex; gap: 1rem; align-items: start; padding: 1rem; margin: 1rem 0; background: #f8fafc; border-radius: 8px; border: 2px solid #e2e8f0; }
    .impact-icon { font-size: 1.5rem; flex-shrink: 0; }
    .impact-text { color: #334155; }

    .state-tree { background: white; border-radius: 16px; padding: 2rem; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1); margin: 3rem 0; }
    .tree-header h3 { color: #1e293b; margin-bottom: 2rem; text-align: center; font-size: 1.8rem; }
    .tree-columns { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; }
    .tree-col h4 { color: #475569; margin-bottom: 1.5rem; text-align: center; font-size: 1.2rem; padding-bottom: 1rem; border-bottom: 2px solid #e2e8f0; }
    .tree-nodes { display: flex; flex-direction: column; gap: 1rem; }
    .node { padding: 1rem; background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 8px; text-align: center; font-weight: 500; color: #334155; }
    .node.winner { background: #dcfce7; border-color: #22c55e; color: #166534; font-weight: 700; }
    .node.skipped { background: #fee2e2; border-color: #dc2626; color: #991b1b; font-weight: 700; }
    .node.death-valley { background: #fef3c7; border-color: #f59e0b; color: #92400e; font-weight: 700; }

    .conclusion { background: linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%); }
    .final-thoughts { margin-top: 2rem; padding: 2rem; background: white; border-radius: 12px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); }

    .disclaimer { font-size: 0.95rem; color: #94a3b8; font-style: italic; padding: 1rem; background: rgba(255, 255, 255, 0.05); border-radius: 8px; border-left: 3px solid #60a5fa; margin-bottom: 2rem; }

    .corrected-game-container { background: white; border-radius: 16px; padding: 2rem; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3); }
    .game-start { text-align: center; padding: 3rem 2rem; }
    .start-game-btn { padding: 1.5rem 3rem; font-size: 1.3rem; background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; border: none; border-radius: 12px; cursor: pointer; font-weight: 600; transition: all 0.3s; font-family: inherit; }
    .start-game-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 30px rgba(59, 130, 246, 0.4); }

    .key-difference { margin-top: 3rem; text-align: left; max-width: 500px; margin-left: auto; margin-right: auto; padding: 2rem; background: #f8fafc; border-radius: 12px; }

    .game-state-display { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem; }
    .player-status, .computer-status { padding: 1.5rem; background: #f8fafc; border-radius: 12px; }
    .player-status h4, .computer-status h4 { color: #1e293b; margin-bottom: 1rem; }

    .pool-display, .pool-display-interactive { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem; min-height: 80px; }
    .pool-number { background: #e0e7ff; color: #3730a3; padding: 0.5rem 0.75rem; border-radius: 6px; font-weight: 600; font-size: 0.9rem; }
    .pool-number.computer { background: #fecaca; color: #991b1b; }
    .pool-number-clickable { background: #e0e7ff; color: #3730a3; padding: 0.5rem 0.75rem; border-radius: 6px; font-weight: 600; font-size: 0.9rem; cursor: pointer; transition: all 0.2s; border: 2px solid transparent; }
    .pool-number-clickable:hover { background: #c7d2fe; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3); }
    .pool-number-clickable.selected { background: #3b82f6; color: white; border-color: #1e40af; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.5); }

    .pool-count { color: #64748b; font-size: 0.9rem; font-weight: 600; }

    .win-prob {
      margin-top: 0.75rem;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.35rem 0.9rem;
      border-radius: 999px;
      background: #e0f2fe;
      color: #0f172a;
      font-size: 0.9rem;
      font-weight: 600;
    }
    .win-prob .prob-number {
      font-family: 'Courier New', monospace;
      font-weight: 700;
    }

    .move-quality {
      margin-top: 0.5rem;
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.35rem 0.9rem;
      border-radius: 999px;
      font-size: 0.85rem;
      font-weight: 600;
    }
    .move-icon {
      font-size: 0.9rem;
      font-weight: 800;
      padding: 0.2rem 0.45rem;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 1.4rem;
    }

    /* brilliant: purple circle, ??? */
    .move-brilliant {
      background: #f5f3ff;
      color: #5b21b6;
    }
    .move-brilliant .move-icon {
      background: #7c3aed;
      color: #ffffff;
      box-shadow: 0 0 0 1px rgba(124, 58, 237, 0.6);
    }

    /* best: light blue circle, !! */
    .move-best {
      background: #eff6ff;
      color: #1d4ed8;
    }
    .move-best .move-icon {
      background: #bfdbfe;
      color: #1d4ed8;
      box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.5);
    }

    /* great: green star */
    .move-great {
      background: #ecfdf5;
      color: #166534;
    }
    .move-great .move-icon {
      background: #bbf7d0;
      color: #166534;
      box-shadow: 0 0 0 1px rgba(22, 163, 74, 0.5);
    }

    /* good: greyed green check */
    .move-good {
      background: #f1f5f9;
      color: #14532d;
    }
    .move-good .move-icon {
      background: #e2f3e6;
      color: #15803d;
      box-shadow: 0 0 0 1px rgba(21, 128, 61, 0.3);
    }

    /* inaccuracy: yellow ?! */
    .move-inaccuracy {
      background: #fefce8;
      color: #92400e;
    }
    .move-inaccuracy .move-icon {
      background: #fde68a;
      color: #92400e;
      box-shadow: 0 0 0 1px rgba(217, 119, 6, 0.6);
    }

    /* mistake: dark orange ? */
    .move-mistake {
      background: #ffedd5;
      color: #c2410c;
    }
    .move-mistake .move-icon {
      background: #fed7aa;
      color: #9a3412;
      box-shadow: 0 0 0 1px rgba(194, 65, 12, 0.6);
    }

    /* blunder: red !!! */
    .move-blunder {
      background: #fee2e2;
      color: #b91c1c;
    }
    .move-blunder .move-icon {
      background: #fecaca;
      color: #7f1d1d;
      box-shadow: 0 0 0 1px rgba(185, 28, 28, 0.8);
    }

    .selection-display { margin-top: 1rem; padding: 0.75rem; background: #dbeafe; border-radius: 8px; color: #1e40af; font-weight: 600; text-align: center; }

    .player-controls { background: #dbeafe; padding: 2rem; border-radius: 12px; margin-bottom: 2rem; }
    .player-controls h4 { color: #1e40af; margin-bottom: 1rem; }
    .instruction-text { color: #1e40af; margin-bottom: 1.5rem; font-size: 0.95rem; line-height: 1.6; }
    .guess-btn { width: 100%; padding: 1rem; background: #3b82f6; color: white; border: none; border-radius: 8px; font-size: 1.1rem; font-weight: 600; cursor: pointer; font-family: inherit; }
    .guess-btn:hover:not(:disabled) { background: #2563eb; transform: translateY(-2px); }

    .waiting { text-align: center; padding: 2rem; background: #f8fafc; border-radius: 12px; margin-bottom: 2rem; }
    .spinner { font-size: 2rem; animation: spin 2s linear infinite; }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    .waiting p { color: #64748b; margin-top: 1rem; }

    .game-over { text-align: center; padding: 3rem 2rem; border-radius: 12px; margin-bottom: 2rem; }
    .game-over.player { background: #dcfce7; border: 3px solid #22c55e; }
    .game-over.computer { background: #fee2e2; border: 3px solid #ef4444; }
    .game-over h3 { font-size: 2rem; margin-bottom: 1rem; }
    .game-over.player h3 { color: #166534; }
    .game-over.computer h3 { color: #991b1b; }
    .play-again-btn { padding: 1rem 2rem; background: #1e293b; color: white; border: none; border-radius: 8px; font-size: 1.1rem; font-weight: 600; cursor: pointer; font-family: inherit; }
    .play-again-btn:hover { background: #0f172a; transform: translateY(-2px); }

    .game-log { background: #f8fafc; padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem; }
    .game-log h4 { color: #1e293b; margin-bottom: 1rem; }
    .log-entries { max-height: 300px; overflow-y: auto; }
    .log-entry { padding: 0.5rem; margin: 0.25rem 0; background: white; border-radius: 6px; font-size: 0.95rem; color: #334155; font-family: 'Courier New', monospace; }

    .code-download { background: #f1f5f9; padding: 2rem; border-radius: 12px; text-align: center; }

    .nica-response { background: #f8fafc; }
    .conversation { margin: 2rem 0; }
    .message { margin: 1rem 0; padding: 1rem 1.25rem; border-radius: 8px; }
    .message.dylan { background: white; border-left: 3px solid #3b82f6; }
    .message.nica { background: #e0e7ff; border-left: 3px solid #6366f1; }
    .message-header { margin-bottom: 0.75rem; }
    .message-content p { margin-bottom: 0.75rem; color: #334155; line-height: 1.7; font-size: 0.95rem; }

    .reflection-box { background: linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%); padding: 1.5rem; border-radius: 12px; border-left: 4px solid #3b82f6; margin-top: 2rem; }

    .footer { background: #0f172a; color: white; padding: 3rem 2rem; }
    .footer-content { max-width: 800px; margin: 0 auto; text-align: center; }
    .contact { display: flex; align-items: center; justify-content: center; gap: 0.75rem; font-size: 1.1rem; margin-bottom: 1rem; color: #60a5fa; }
    .footer-note { color: #94a3b8; font-size: 0.95rem; }

    @media (max-width: 768px) {
      .game-state { grid-template-columns: 1fr; }
      .vs-divider { transform: rotate(90deg); margin: 1rem 0; }
      .tree-columns { grid-template-columns: 1fr; }
      .stat-grid { grid-template-columns: 1fr; }
      .game-state-display { grid-template-columns: 1fr; }
      .pool-display-interactive { justify-content: center; }
      .section { padding: 3rem 1.25rem; }
    }
  `}</style>
);

