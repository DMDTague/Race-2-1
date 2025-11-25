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
              <li>Each player secretly chooses a number in {"{1,…,N}"}</li>
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
              is {"{5}"} so n=1. The simulator instantly ends the game in your
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
            (approximately) optimally according to that DP. Both players' moves
            are now evaluated for quality!
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
// Death Valley DP + Soft-Guess Engine
// =======================

const MAX_POOL_SIZE = 20;

// V(n,m): win prob for the player TO MOVE,
// when they have n candidates and opponent has m,
// under soft-guess rules (miss = pass turn with n-1).
const dvValueMemo = new Map();
const dvBestBidMemo = new Map(); // 0 => "guess", >0 => best question size

const dvKey = (n, m) => `${n},${m}`;

// Core DP with SOFT GUESS
function dvValue(n, m) {
  if (n <= 0 || m <= 0) return 0.5; // should never appear
  if (n === 1) return 1.0;          // you know the answer on your turn

  const key = dvKey(n, m);
  const cached = dvValueMemo.get(key);
  if (cached !== undefined) return cached;

  // --- 1. EV of GUESSING (soft guess) ---
  // P(correct) * 1 + P(wrong) * (1 - V(m, n-1))
  const winNow = 1 / n;
  const surviveLater = ((n - 1) / n) * (1 - dvValue(m, n - 1));
  const guessEV = winNow + surviveLater;

  let bestVal = guessEV;
  let bestB = 0; // 0 == "guess"

  // --- 2. EV of ASKING ---
  // ask [a,b] of size b; yes => (b, m) with opponent to move; no => (n-b, m).
  // Tie goes to GUESS (agency).
  if (n > 1) {
    for (let b = 1; b <= n - 1; b++) {
      const pYes = b / n;
      const valYes = 1 - dvValue(m, b);
      const valNo = 1 - dvValue(m, n - b);
      const askEV = pYes * valYes + (1 - pYes) * valNo;

      if (askEV > bestVal + 1e-9) {
        bestVal = askEV;
        bestB = b;
      }
    }
  }

  dvValueMemo.set(key, bestVal);
  dvBestBidMemo.set(key, bestB); // 0 means "guess"
  return bestVal;
}

function precomputeDeathValleyStrategy() {
  dvValueMemo.clear();
  dvBestBidMemo.clear();
  for (let n = 1; n <= MAX_POOL_SIZE; n++) {
    for (let m = 1; m <= MAX_POOL_SIZE; m++) {
      dvValue(n, m);
    }
  }
}
precomputeDeathValleyStrategy();

// Bot action: trust DP (no hacks needed)
function getOptimalBotAction(n, m) {
  if (n <= 1) return { type: "guess" };

  const key = dvKey(n, m);
  const bestB = dvBestBidMemo.get(key);

  if (!bestB || bestB === 0) {
    // DP says guessing is optimal (or only legal)
    return { type: "guess" };
  }
  return { type: "question", b: bestB };
}

// Win prob from PLAYER'S perspective, for display
function getPlayerPerspectiveWinProb(nPlayer, nComputer, isPlayerTurn) {
  if (nPlayer <= 0 || nComputer <= 0) return 0.0;

  if (isPlayerTurn) {
    // player's turn, so use V(nPlayer, nComputer)
    return dvValue(nPlayer, nComputer);
  } else {
    // computer's turn: player's win prob = 1 - V(nComputer, nPlayer)
    return 1 - dvValue(nComputer, nPlayer);
  }
}

// =======================
// Move Evaluation (Soft-Guess + Equity Swing + Agency)
// =======================

function evaluateMoveQuality({
  nBefore,
  mBefore,
  nAfter,
  mAfter,
  isPlayerMove,      // true if human moved, false if bot moved
  isGuess,           // true for guess, false for question
  b,                 // question size if isGuess === false
  preWin,            // player's win prob BEFORE move
  postWin            // player's win prob AFTER move
}) {
  // ---- 1. Compute actor's EV: optimal vs actual ----
  let actorN, actorM;

  if (isPlayerMove) {
    actorN = nBefore;
    actorM = mBefore;
  } else {
    // For the bot, its candidate count is mBefore, opponent's is nBefore
    actorN = mBefore;
    actorM = nBefore;
  }

  // Optimal EV for the side to move from this state
  const optimalValForActor = dvValue(actorN, actorM);

  // Helper: EV of guessing for the actor (soft-guess)
  function guessEVForActor(n, m) {
    const winNow = 1 / n;
    const surviveLater =
      ((n - 1) / n) * (1 - dvValue(m, n - 1));
    return winNow + surviveLater;
  }

  // Helper: EV of asking a question of size b for the actor
  function questionEVForActor(n, m, qSize) {
    if (!qSize || qSize <= 0 || qSize >= n) return null;
    const pYes = qSize / n;
    const valYes = 1 - dvValue(m, qSize);
    const valNo = 1 - dvValue(m, n - qSize);
    return pYes * valYes + (1 - pYes) * valNo;
  }

  const guessEV = guessEVForActor(actorN, actorM);
  let actualEVForActor;

  if (isGuess) {
    actualEVForActor = guessEV;
  } else {
    const qSize = isPlayerMove ? b : b; // same b, just different actorN/actorM
    actualEVForActor = questionEVForActor(actorN, actorM, qSize);
    if (actualEVForActor === null) return null;
  }

  const decisionError = Math.max(0, optimalValForActor - actualEVForActor);

  // ---- 2. Equity swing from the PLAYER'S POV ----
  const startWinProb = preWin;
  const endWinProb = postWin;
  const equitySwing = endWinProb - startWinProb;

  // ---- 3. Badge selection based purely on decisionError ----
  // Tight EV thresholds (tweak if you like)
  const BEST_EPS    = 0.005; // <0.5% from optimal
  const GREAT_EPS   = 0.02;  // <2% from optimal
  const GOOD_EPS    = 0.05;  // <5% from optimal
  const MISTAKE_EPS = 0.12;  // <12% from optimal

  let category = "good";
  let label = "Good move";
  let icon = "✓";

  if (decisionError < BEST_EPS) {
    category = "best";
    label = "Best move";
    icon = "!!";
  } else if (decisionError < GREAT_EPS) {
    category = "great";
    label = "Great move";
    icon = "★";
  } else if (decisionError < GOOD_EPS) {
    category = "good";
    label = "Good move";
    icon = "✓";
  } else if (decisionError < MISTAKE_EPS) {
    category = "mistake";
    label = "Mistake";
    icon = "?";
  } else {
    category = "blunder";
    label = "Blunder";
    icon = "??";
  }

  // ---- 4. Optional "passive play" overlay for true near-ties ----
  // Only applies if actor had a viable guess AND chose a question AND
  // BOTH guessEV and actualEV are in the same tiny band around optimal.
  if (!isGuess) {
    const PASSIVE_BAND = 0.005; // 0.5% band for "true tie"

    const guessNearOpt =
      Math.abs(guessEV - optimalValForActor) < PASSIVE_BAND;
    const actualNearOpt =
      Math.abs(actualEVForActor - optimalValForActor) < PASSIVE_BAND;

    // Only re-label as passive if the move was already near-optimal
    // (i.e., not a real mistake/blunder) AND the outcome wasn't a big improvement.
    // Don't call a move "passive" if it gained you >5% in practice.
    if (guessNearOpt && actualNearOpt && decisionError < GREAT_EPS) {
      if (equitySwing <= 0.05) {
        category = "inaccuracy";
        label = "Passive play";
        icon = "?!";
      }
      // If equitySwing > 5%, it was still powerful in practice.
      // Let the normal EV thresholds handle it (often "Good" or "Great").
    }
  }

  // ---- 5. "Brilliant rescue" for huge swing from the player's POV ----
  if (isPlayerMove && startWinProb <= 0.30 && endWinProb >= 0.70) {
    category = "brilliant";
    label = "Brilliant move";
    icon = "‼";
  }

  // ---- 6. Narrative description based on equity swing ----
  const startPct = (startWinProb * 100).toFixed(0);
  const endPct = (endWinProb * 100).toFixed(0);
  const diffSign = equitySwing >= 0 ? "+" : "";
  const diffPct = (equitySwing * 100).toFixed(0);

  let description = `Win prob: ${startPct}% → ${endPct}% (${diffSign}${diffPct}%)`;

  // Special upgrade: Good move with big positive swing → Great move
  if (category === "good" && equitySwing > 0.10 && decisionError < 0.03) {
    category = "great";
    label = "Great move";
    icon = "★";
  }

  // Narrative adjustments based on category and swing
  if (category === "blunder" && equitySwing < -0.10) {
    description = `Lead squandered: ${startPct}% → ${endPct}%`;
  } else if (category === "best" && equitySwing < -0.01) {
    // Lowered threshold: any Best move with negative outcome shows variance
    description = `Good decision, bad result: ${startPct}% → ${endPct}%`;
  } else if (category === "best" && equitySwing > 0.10) {
    description = `Huge improvement: ${startPct}% → ${endPct}%`;
  } else if (startWinProb < 0.30 && endWinProb > 0.50) {
    description = `Clutch comeback: ${startPct}% → ${endPct}%`;
  }

  // Bot-specific narration tweaks
  if (!isPlayerMove) {
    if (category === "blunder" && equitySwing > 0) {
      description = `Engine blunder: your chances jumped ${diffSign}${diffPct}%`;
    } else if (category === "best" && equitySwing < -0.01) {
      // Bot's best move that hurt player
      description = `Strong engine move: your chances dropped to ${endPct}%`;
    } else if (category === "best" && equitySwing < 0) {
      // Even tiny drops get acknowledged for bot moves
      description = `Strong engine move: your chances dropped to ${endPct}%`;
    }
  }

  return { category, label, icon, description };
}

// =======================
// Animated Move Quality Badge (inline compact version)
// =======================
const QualityBadge = ({ quality, inline = false }) => {
  if (!quality) return null;

  if (inline) {
    return (
      <span className={`inline-quality quality-${quality.category}`}>
        <span className="quality-icon-inline">{quality.icon}</span>
        <span className="quality-label-inline">{quality.label}</span>
      </span>
    );
  }

  return (
    <div className={`move-quality move-${quality.category}`}>
      <div className="move-icon">{quality.icon}</div>
      <div className="move-details">
        <div className="move-label">{quality.label}</div>
        {quality.description && (
          <div className="move-description">{quality.description}</div>
        )}
      </div>
    </div>
  );
};

// =======================
// Corrected Game Component
// =======================
const CorrectedGame = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [playerSecret, setPlayerSecret] = useState(null);
  const [computerSecret, setComputerSecret] = useState(null);
  const [playerPool, setPlayerPool] = useState([]);
  const [computerPool, setComputerPool] = useState([]);
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [gameLog, setGameLog] = useState([]);
  const [winner, setWinner] = useState(null);
  const [playerTurn, setPlayerTurn] = useState(true);
  const [winProb, setWinProb] = useState(null);
  const [lastPlayerQuality, setLastPlayerQuality] = useState(null);
  const [lastComputerQuality, setLastComputerQuality] = useState(null);
  const [thinking, setThinking] = useState(false);
  
  // Session win/loss tracking
  const [sessionStats, setSessionStats] = useState({ wins: 0, losses: 0 });

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
      { text: "🎮 Game started! Each side chooses a secret number between 1 and 20.", quality: null },
      { text: "🤖 Bot strategy: Optimal Death Valley DP (soft-guess V(n,m)).", quality: null },
      { text: "📊 Both players' moves are evaluated for quality!", quality: null },
    ]);
    setWinner(null);
    setGameStarted(true);
    setPlayerTurn(true);

    const initialWin = getPlayerPerspectiveWinProb(20, 20, true);
    setWinProb(initialWin);
    setLastPlayerQuality(null);
    setLastComputerQuality(null);
    setThinking(false);
  };

  const handleNumberClick = (num) => {
    if (!playerTurn || winner || thinking) return;
    if (!playerPool.includes(num)) return;

    if (selectedNumbers.includes(num)) {
      setSelectedNumbers(selectedNumbers.filter((n) => n !== num));
    } else if (selectedNumbers.length < 2) {
      setSelectedNumbers([...selectedNumbers, num].sort((a, b) => a - b));
    } else {
      setSelectedNumbers([num]);
    }
  };

  const makeRangeOrGuess = () => {
    if (!playerTurn || winner || selectedNumbers.length === 0 || thinking) return;

    const nBefore = playerPool.length;
    const mBefore = computerPool.length;
    const preWin = getPlayerPerspectiveWinProb(nBefore, mBefore, true);

    const min = selectedNumbers[0];
    const max =
      selectedNumbers.length === 2 ? selectedNumbers[1] : selectedNumbers[0];

    // Exact GUESS
    if (min === max) {
      const guess = min;

      if (guess === playerSecret) {
        // Correct terminal guess: just mark as Best and end.
        const quality = {
          category: "best",
          label: "Best move",
          icon: "!!",
          description: "Correct winning guess.",
        };
        setLastPlayerQuality(quality);
        setGameLog((prev) => [
          ...prev,
          { text: `👤 You guessed [${guess}] — Correct! You win.`, quality },
        ]);
        setWinner("player");
        setSessionStats((prev) => ({ ...prev, wins: prev.wins + 1 }));
        setWinProb(1.0);
        setSelectedNumbers([]);
        return;
      }

      // Wrong guess: remove that candidate, pass turn
      const newPlayerPool = playerPool.filter((x) => x !== guess);
      const nAfter = newPlayerPool.length;
      const mAfter = mBefore;
      const postWin = getPlayerPerspectiveWinProb(nAfter, mAfter, false);

      const quality = evaluateMoveQuality({
        nBefore,
        mBefore,
        nAfter,
        mAfter,
        isPlayerMove: true,
        isGuess: true,
        b: null,
        preWin,
        postWin,
      });

      setLastPlayerQuality(quality || null);
      setGameLog((prev) => [
        ...prev,
        {
          text: `👤 You guessed [${guess}] — Wrong (${nAfter} remaining)`,
          quality,
        },
      ]);

      setPlayerPool(newPlayerPool);
      setSelectedNumbers([]);
      setPlayerTurn(false);
      setWinProb(postWin);

      // Delay before computer moves - 2.5 seconds to read quality
      setTimeout(() => {
        setThinking(true);
        setTimeout(() => computerTurn(), 1000);
      }, 2500);
      return;
    }

    // RANGE QUESTION
    const inRange = min <= playerSecret && playerSecret <= max;
    const affected = playerPool.filter((x) => x >= min && x <= max);
    const b = affected.length;

    const newPlayerPool = inRange
      ? affected
      : playerPool.filter((x) => x < min || x > max);

    const nAfter = newPlayerPool.length;
    const mAfter = mBefore;
    const postWin = getPlayerPerspectiveWinProb(nAfter, mAfter, false);

    const quality =
      b > 0
        ? evaluateMoveQuality({
            nBefore,
            mBefore,
            nAfter,
            mAfter,
            isPlayerMove: true,
            isGuess: false,
            b,
            preWin,
            postWin,
          })
        : null;

    setLastPlayerQuality(quality || null);
    setGameLog((prev) => [
      ...prev,
      {
        text: `👤 You asked: [${min}, ${max}]? Answer: ${
          inRange ? "YES" : "NO"
        } (${nAfter} remaining)`,
        quality,
      },
    ]);

    setPlayerPool(newPlayerPool);
    setSelectedNumbers([]);
    setPlayerTurn(false);
    setWinProb(postWin);

    // Delay before computer moves - 2.5 seconds to read quality
    setTimeout(() => {
      setThinking(true);
      setTimeout(() => computerTurn(), 1000);
    }, 2500);
  };

  const computerTurn = () => {
    if (winner) {
      setThinking(false);
      return;
    }

    const n = computerPool.length;
    const m = playerPool.length;

    if (n <= 0 || m <= 0) {
      setThinking(false);
      return;
    }

    const preWinPlayer = getPlayerPerspectiveWinProb(m, n, false);

    const action = getOptimalBotAction(n, m);

    // Bot GUESS
    if (action.type === "guess") {
      const idx = Math.floor(Math.random() * n);
      const guess = computerPool[idx];

      if (guess === computerSecret) {
        const quality = {
          category: "best",
          label: "Best move",
          icon: "!!",
          description: "Engine found a winning guess.",
        };
        setLastComputerQuality(quality);
        setGameLog((prev) => [
          ...prev,
          {
            text: `🤖 Computer guesses ${guess} — Correct. Computer wins.`,
            quality,
          },
        ]);
        setWinner("computer");
        setSessionStats((prev) => ({ ...prev, losses: prev.losses + 1 }));
        setWinProb(0.0);
        setThinking(false);
        return;
      }

      const newComputerPool = computerPool.filter((x) => x !== guess);
      const nAfter = newComputerPool.length;
      const mAfter = m;
      const postWinPlayer = getPlayerPerspectiveWinProb(mAfter, nAfter, true);

      const quality = evaluateMoveQuality({
        nBefore: m,
        mBefore: n,
        nAfter: mAfter,
        mAfter: nAfter,
        isPlayerMove: false,
        isGuess: true,
        b: null,
        preWin: preWinPlayer,
        postWin: postWinPlayer,
      });

      setLastComputerQuality(quality || null);
      setGameLog((prev) => [
        ...prev,
        {
          text: `🤖 Computer guesses ${guess} — Wrong (${nAfter} remaining)`,
          quality,
        },
      ]);

      setComputerPool(newComputerPool);
      setPlayerTurn(true);
      setWinProb(postWinPlayer);
      setThinking(false);
      return;
    }

    // Bot QUESTION
    const bidSize = action.b;
    const sorted = [...computerPool].sort((a, b) => a - b);
    const subset = sorted.slice(0, bidSize);
    const minQ = subset[0];
    const maxQ = subset[subset.length - 1];

    const inSubset = subset.includes(computerSecret);

    const newComputerPool = inSubset
      ? subset
      : computerPool.filter((x) => !subset.includes(x));

    const nAfter = newComputerPool.length;
    const mAfter = m;

    const postWinPlayer = getPlayerPerspectiveWinProb(mAfter, nAfter, true);

    const quality = evaluateMoveQuality({
      nBefore: m,
      mBefore: n,
      nAfter: mAfter,
      mAfter: nAfter,
      isPlayerMove: false,
      isGuess: false,
      b: bidSize,
      preWin: preWinPlayer,
      postWin: postWinPlayer,
    });

    setLastComputerQuality(quality || null);
    setGameLog((prev) => [
      ...prev,
      {
        text: `🤖 Computer asks: [${minQ}, ${maxQ}]? Answer: ${
          inSubset ? "YES" : "NO"
        } (${nAfter} remaining)`,
        quality,
      },
    ]);

    setComputerPool(newComputerPool);
    setPlayerTurn(true);
    setWinProb(postWinPlayer);
    setThinking(false);
  };

  return (
    <div className="corrected-game-container">
      {!gameStarted ? (
        <div className="game-start">
          <button onClick={startGame} className="start-game-btn">
            Start Corrected Game
          </button>

          <div className="key-difference">
            <h4>Key Features</h4>
            <ul>
              <li>✅ Must make an exact guess to win</li>
              <li>✅ Death Valley (n=1 but not your turn) is preserved</li>
              <li>✅ Bot uses DP V(n,m) with guess vs question</li>
              <li>✅ Move quality evaluation for BOTH players</li>
              <li>✅ Live win probability updates</li>
              <li>✅ Slower pacing to read move evaluations</li>
              <li>✅ Session win/loss tracking</li>
              <li>❌ No auto-win just for reaching n=1</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="game-play">
          {/* Session Stats Display */}
          <div className="session-stats">
            <h4>Session Record</h4>
            <div className="stats-display">
              <div className="stat-item player-wins">
                <div className="stat-icon">👤</div>
                <div className="stat-details">
                  <div className="stat-value">{sessionStats.wins}</div>
                  <div className="stat-label">Wins</div>
                </div>
              </div>
              <div className="stat-divider">—</div>
              <div className="stat-item computer-wins">
                <div className="stat-icon">🤖</div>
                <div className="stat-details">
                  <div className="stat-value">{sessionStats.losses}</div>
                  <div className="stat-label">Wins</div>
                </div>
              </div>
            </div>
            {(sessionStats.wins + sessionStats.losses > 0) && (
              <div className="win-rate">
                Win Rate: {((sessionStats.wins / (sessionStats.wins + sessionStats.losses)) * 100).toFixed(1)}%
              </div>
            )}
          </div>

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
                  <span className="prob-label">Your win chance:</span>
                  <span className="prob-number">
                    {(winProb * 100).toFixed(1)}%
                  </span>
                  <div className="prob-bar">
                    <div 
                      className="prob-bar-fill" 
                      style={{ 
                        width: `${winProb * 100}%`,
                        background: winProb > 0.6 ? '#22c55e' : winProb > 0.4 ? '#f59e0b' : '#ef4444'
                      }}
                    />
                  </div>
                </div>
              )}

              {lastPlayerQuality && (
                <QualityBadge quality={lastPlayerQuality} />
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
              
              {winProb !== null && (
                <div className="win-prob computer-win-prob">
                  <span className="prob-label">Computer win chance:</span>
                  <span className="prob-number">
                    {((1 - winProb) * 100).toFixed(1)}%
                  </span>
                  <div className="prob-bar">
                    <div 
                      className="prob-bar-fill" 
                      style={{ 
                        width: `${(1 - winProb) * 100}%`,
                        background: (1 - winProb) > 0.6 ? '#ef4444' : (1 - winProb) > 0.4 ? '#f59e0b' : '#22c55e'
                      }}
                    />
                  </div>
                </div>
              )}

              {lastComputerQuality && (
                <QualityBadge quality={lastComputerQuality} />
              )}
            </div>
          </div>

          {!winner && playerTurn && !thinking && (
            <div className="player-controls">
              <h4>Your Turn – Choose an Exact Guess or a Range</h4>
              <p className="instruction-text">
                Click numbers in your pool above. Click one number for an exact
                guess, or two numbers to ask about a contiguous range.
              </p>
              <button
                onClick={makeRangeOrGuess}
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
                  `Guess: Is your number ${selectedNumbers[0]}?`}
                {selectedNumbers.length === 2 &&
                  `Ask: Is your number between ${selectedNumbers[0]} and ${selectedNumbers[1]}?`}
              </button>
            </div>
          )}

          {!winner && (!playerTurn || thinking) && (
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
                  <span>{entry.text}</span>
                  {entry.quality && (
                    <QualityBadge quality={entry.quality} inline={true} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="code-download">
        <h4>Technical Notes</h4>
        <p>
          <strong>Soft-Guess Death Valley DP:</strong> Unlike the original "all-in" guess model, 
          this engine uses soft-guess mechanics where a wrong guess removes one candidate and passes 
          the turn (not instant loss). The DP computes V(n,m) = max(guessEV, askEV) where 
          guessEV = (1/n)×1 + ((n-1)/n)×(1-V(m,n-1)). This prevents "best move → instant death" 
          scenarios and makes guessing viable in tight endgames.
        </p>
        <p>
          <strong>Pure EV-Based Evaluation:</strong> Move badges are determined by decision 
          error (optimal EV - actual EV). Thresholds: &lt;0.5% = "Best", &lt;2% = "Great", 
          &lt;5% = "Good", &lt;12% = "Mistake", &gt;12% = "Blunder". Good moves with huge 
          positive swings (&gt;10% gain, &lt;3% EV loss) get upgraded to "Great" to reward 
          high-impact hits.
        </p>
        <p>
          <strong>Smart Passive Play Detection:</strong> "Passive play" only appears when: 
          (1) you chose a question, (2) both guessing and your question are within 0.5% of optimal 
          (true tie), AND (3) equity swing ≤5%. This prevents labeling big improvements as "passive" - 
          a move that gains you 10% isn't passive, even if you rejected a viable guess!
        </p>
        <p>
          <strong>Variance Acknowledgment:</strong> When a "Best move" produces any negative outcome 
          (&gt;1% drop), the description changes to "Good decision, bad result" to acknowledge 
          variance. Wrong guesses that are mathematically optimal now properly show they were correct 
          decisions with unlucky outcomes.
        </p>
        <p>
          <strong>Context-Aware Narratives:</strong> Descriptions adapt to situation: "Lead squandered" 
          for blunders with big drops, "Huge improvement" for best moves with big gains, "Clutch comeback" 
          for turning losing positions around, "Strong engine move" when bot plays well, "Engine blunder" 
          when bot makes mistakes.
        </p>
        <p>
          <strong>Session Tracking:</strong> Your wins and losses are tracked across multiple 
          games in your current session. The counter persists when you click "Play Again" and 
          resets only when you refresh the page.
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

    .game-play { padding: 3rem 2rem; }
    
    .session-stats {
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      border: 2px solid #e2e8f0;
      border-radius: 16px;
      padding: 1.5rem;
      margin-bottom: 2rem;
      text-align: center;
    }
    .session-stats h4 {
      color: #1e293b;
      font-size: 1.1rem;
      margin-bottom: 1rem;
      font-weight: 700;
    }
    .stats-display {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 2rem;
      margin-bottom: 0.75rem;
    }
    .stat-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem 1.5rem;
      border-radius: 12px;
      transition: all 0.3s;
    }
    .stat-item.player-wins {
      background: linear-gradient(135deg, #dbeafe, #bfdbfe);
      border: 2px solid #3b82f6;
    }
    .stat-item.computer-wins {
      background: linear-gradient(135deg, #fee2e2, #fecaca);
      border: 2px solid #ef4444;
    }
    .stat-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }
    .stat-icon {
      font-size: 2rem;
      line-height: 1;
    }
    .stat-details {
      text-align: left;
    }
    .stat-value {
      font-size: 2rem;
      font-weight: 800;
      line-height: 1;
      margin-bottom: 0.25rem;
      animation: statUpdate 0.6s ease;
    }
    @keyframes statUpdate {
      0% { transform: scale(1); }
      50% { transform: scale(1.3); }
      100% { transform: scale(1); }
    }
    .stat-item.player-wins .stat-value {
      color: #1e40af;
    }
    .stat-item.computer-wins .stat-value {
      color: #991b1b;
    }
    .stat-label {
      font-size: 0.85rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      opacity: 0.8;
    }
    .stat-item.player-wins .stat-label {
      color: #1e40af;
    }
    .stat-item.computer-wins .stat-label {
      color: #991b1b;
    }
    .stat-divider {
      font-size: 1.5rem;
      font-weight: 700;
      color: #94a3b8;
    }
    .win-rate {
      font-size: 0.95rem;
      font-weight: 700;
      color: #475569;
      padding: 0.5rem 1rem;
      background: #e0e7ff;
      border-radius: 999px;
      display: inline-block;
    }
    
    .game-state-display { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem; }
    .player-status, .computer-status { padding: 1.5rem; background: #f8fafc; border-radius: 12px; position: relative; }
    .player-status h4, .computer-status h4 { color: #1e293b; margin-bottom: 1rem; }

    .pool-display, .pool-display-interactive { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem; min-height: 80px; }
    .pool-number { background: #e0e7ff; color: #3730a3; padding: 0.5rem 0.75rem; border-radius: 6px; font-weight: 600; font-size: 0.9rem; }
    .pool-number.computer { background: #fecaca; color: #991b1b; }
    .pool-number-clickable { background: #e0e7ff; color: #3730a3; padding: 0.5rem 0.75rem; border-radius: 6px; font-weight: 600; font-size: 0.9rem; cursor: pointer; transition: all 0.2s; border: 2px solid transparent; }
    .pool-number-clickable:hover { background: #c7d2fe; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3); }
    .pool-number-clickable.selected { background: #3b82f6; color: white; border-color: #1e40af; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.5); }

    .pool-count { color: #64748b; font-size: 0.9rem; font-weight: 600; }

    .win-prob {
      margin-top: 1rem;
      padding: 0.75rem;
      border-radius: 12px;
      background: linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%);
    }
    .win-prob .prob-label {
      display: block;
      font-size: 0.85rem;
      color: #334155;
      margin-bottom: 0.25rem;
      font-weight: 600;
    }
    .win-prob .prob-number {
      display: block;
      font-family: 'Courier New', monospace;
      font-weight: 700;
      font-size: 1.5rem;
      color: #0f172a;
      margin-bottom: 0.5rem;
    }
    .prob-bar {
      width: 100%;
      height: 8px;
      background: #e2e8f0;
      border-radius: 999px;
      overflow: hidden;
    }
    .prob-bar-fill {
      height: 100%;
      transition: width 0.5s ease, background 0.5s ease;
      border-radius: 999px;
    }

    .move-quality {
      margin-top: 1rem;
      padding: 1rem;
      border-radius: 12px;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      transition: all 0.3s ease;
      border: 2px solid transparent;
      animation: badgeEntrance 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
    
    @keyframes badgeEntrance {
      0% {
        transform: scale(0) rotate(-180deg);
        opacity: 0;
      }
      50% {
        transform: scale(1.1) rotate(10deg);
      }
      100% {
        transform: scale(1) rotate(0deg);
        opacity: 1;
      }
    }

    .move-quality:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }

    .move-icon {
      font-size: 1.5rem;
      font-weight: 800;
      padding: 0.5rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 3rem;
      min-height: 3rem;
      flex-shrink: 0;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
      transition: transform 0.3s ease;
    }
    
    .move-quality:hover .move-icon {
      transform: rotate(360deg) scale(1.1);
    }

    .move-details {
      flex: 1;
    }
    
    .move-label {
      font-weight: 700;
      font-size: 1rem;
      margin-bottom: 0.25rem;
    }
    
    .move-description {
      font-size: 0.85rem;
      opacity: 0.9;
      line-height: 1.3;
    }

    /* Inline quality badges for game log */
    .inline-quality {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      padding: 0.2rem 0.6rem;
      border-radius: 999px;
      font-size: 0.8rem;
      font-weight: 600;
      margin-left: 0.5rem;
      vertical-align: middle;
    }
    .quality-icon-inline {
      font-weight: 800;
      font-size: 0.85rem;
    }
    .quality-label-inline {
      font-size: 0.75rem;
    }

    /* brilliant: purple */
    .move-brilliant {
      background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
      border-color: #a855f7;
    }
    .move-brilliant .move-icon {
      background: linear-gradient(135deg, #a855f7, #7c3aed);
      color: #ffffff;
    }
    .move-brilliant .move-label {
      color: #6b21a8;
    }
    .move-brilliant .move-description {
      color: #7c3aed;
    }
    .quality-brilliant {
      background: linear-gradient(135deg, #ede9fe, #ddd6fe);
      color: #6b21a8;
    }

    /* best: blue */
    .move-best {
      background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
      border-color: #3b82f6;
    }
    .move-best .move-icon {
      background: linear-gradient(135deg, #60a5fa, #3b82f6);
      color: #ffffff;
    }
    .move-best .move-label {
      color: #1e40af;
    }
    .move-best .move-description {
      color: #2563eb;
    }
    .quality-best {
      background: linear-gradient(135deg, #dbeafe, #bfdbfe);
      color: #1e40af;
    }

    /* great: green */
    .move-great {
      background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
      border-color: #22c55e;
    }
    .move-great .move-icon {
      background: linear-gradient(135deg, #4ade80, #22c55e);
      color: #ffffff;
    }
    .move-great .move-label {
      color: #15803d;
    }
    .move-great .move-description {
      color: #16a34a;
    }
    .quality-great {
      background: linear-gradient(135deg, #dcfce7, #bbf7d0);
      color: #15803d;
    }

    /* good: light gray */
    .move-good {
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      border-color: #94a3b8;
    }
    .move-good .move-icon {
      background: linear-gradient(135deg, #cbd5e1, #94a3b8);
      color: #1e293b;
    }
    .move-good .move-label {
      color: #334155;
    }
    .move-good .move-description {
      color: #475569;
    }
    .quality-good {
      background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
      color: #334155;
    }

    /* inaccuracy: yellow */
    .move-inaccuracy {
      background: linear-gradient(135deg, #fefce8 0%, #fef9c3 100%);
      border-color: #eab308;
    }
    .move-inaccuracy .move-icon {
      background: linear-gradient(135deg, #facc15, #eab308);
      color: #713f12;
    }
    .move-inaccuracy .move-label {
      color: #854d0e;
    }
    .move-inaccuracy .move-description {
      color: #a16207;
    }
    .quality-inaccuracy {
      background: linear-gradient(135deg, #fef9c3, #fef08a);
      color: #854d0e;
    }

    /* mistake: orange */
    .move-mistake {
      background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
      border-color: #f97316;
    }
    .move-mistake .move-icon {
      background: linear-gradient(135deg, #fb923c, #f97316);
      color: #ffffff;
    }
    .move-mistake .move-label {
      color: #c2410c;
    }
    .move-mistake .move-description {
      color: #ea580c;
    }
    .quality-mistake {
      background: linear-gradient(135deg, #ffedd5, #fed7aa);
      color: #c2410c;
    }

    /* blunder: red */
    .move-blunder {
      background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
      border-color: #ef4444;
      animation: blunderShake 0.5s ease;
    }
    .move-blunder .move-icon {
      background: linear-gradient(135deg, #f87171, #ef4444);
      color: #ffffff;
    }
    .move-blunder .move-label {
      color: #991b1b;
    }
    .move-blunder .move-description {
      color: #dc2626;
    }
    .quality-blunder {
      background: linear-gradient(135deg, #fee2e2, #fecaca);
      color: #991b1b;
    }
    
    @keyframes blunderShake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-10px); }
      75% { transform: translateX(10px); }
    }

    .selection-display { margin-top: 1rem; padding: 0.75rem; background: #dbeafe; border-radius: 8px; color: #1e40af; font-weight: 600; text-align: center; }

    .player-controls { background: linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%); padding: 2rem; border-radius: 12px; margin-bottom: 2rem; border: 2px solid #93c5fd; }
    .player-controls h4 { color: #1e40af; margin-bottom: 1rem; }
    .instruction-text { color: #1e40af; margin-bottom: 1.5rem; font-size: 0.95rem; line-height: 1.6; }
    .guess-btn { width: 100%; padding: 1rem; background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; border: none; border-radius: 8px; font-size: 1.1rem; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.3s; }
    .guess-btn:hover:not(:disabled) { background: linear-gradient(135deg, #2563eb, #1e40af); transform: translateY(-2px); box-shadow: 0 8px 25px rgba(37, 99, 235, 0.4); }

    .waiting { text-align: center; padding: 2rem; background: #f8fafc; border-radius: 12px; margin-bottom: 2rem; }
    .spinner { font-size: 2rem; animation: spin 2s linear infinite; }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    .waiting p { color: #64748b; margin-top: 1rem; }

    .game-over { text-align: center; padding: 3rem 2rem; border-radius: 12px; margin-bottom: 2rem; animation: gameOverSlide 0.5s ease; }
    @keyframes gameOverSlide {
      from { transform: translateY(-50px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    .game-over.player { background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%); border: 3px solid #22c55e; }
    .game-over.computer { background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%); border: 3px solid #ef4444; }
    .game-over h3 { font-size: 2rem; margin-bottom: 1rem; }
    .game-over.player h3 { color: #166534; }
    .game-over.computer h3 { color: #991b1b; }
    .play-again-btn { padding: 1rem 2rem; background: #1e293b; color: white; border: none; border-radius: 8px; font-size: 1.1rem; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.3s; }
    .play-again-btn:hover { background: #0f172a; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3); }

    .game-log { background: #f8fafc; padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem; border: 2px solid #e2e8f0; }
    .game-log h4 { color: #1e293b; margin-bottom: 1rem; }
    .log-entries { max-height: 400px; overflow-y: auto; }
    .log-entry { padding: 0.75rem; margin: 0.5rem 0; background: white; border-radius: 6px; font-size: 0.95rem; color: #334155; font-family: 'Courier New', monospace; display: flex; align-items: center; flex-wrap: wrap; border-left: 3px solid #e2e8f0; transition: all 0.2s; }
    .log-entry:hover { border-left-color: #3b82f6; background: #f8fafc; }

    .code-download { background: #1e293b; padding: 2rem; border-radius: 12px; border: 1px solid #334155; }
    .code-download h4 { color: #f1f5f9; margin-bottom: 1rem; }
    .code-download p { color: #cbd5e1; margin-bottom: 1rem; font-size: 0.95rem; line-height: 1.6; }
    .code-download strong { color: #60a5fa; }

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
      .stats-display { flex-direction: column; gap: 1rem; }
      .stat-divider { transform: rotate(90deg); }
    }
  `}</style>
);
