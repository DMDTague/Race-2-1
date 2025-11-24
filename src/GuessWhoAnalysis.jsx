import React, { useState, useEffect } from 'react';
import { ChevronRight, RotateCcw, Mail, ExternalLink } from 'lucide-react';

export default function GuessWhoAnalysis() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress((scrolled / maxScroll) * 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="analysis-container">
      <div className="scroll-progress" style={{width: `${scrollProgress}%`}} />

      {/* Hero Section */}
      <header className="hero">
        <div className="hero-content">
          <h1>Race to 1 vs. Real Guess Who</h1>
          <h2>A Code-Level Audit of Dr. Mihai Nica's Optimal Strategy Simulation</h2>
          <p className="subtitle">
            How Dr. Mihai Nica's Python implementation introduced a Race-to-1 win condition 
            that diverges from the actual rules of Guess Who—and how I uncovered the discrepancy, 
            formalized it, and built a corrected model that reflects the real, turn-based game.
          </p>
        </div>
      </header>

      {/* Mark Rober Section */}
      <section className="section">
        <div className="content">
          <h2>The Viral Strategy</h2>
          <p>
            On November 17, 2015, Mark Rober—former NASA engineer, Apple product designer, and now 
            the 37th most-subscribed YouTuber with over 71 million followers—released a massively 
            popular video arguing that he had found a dominant strategy for Guess Who.
          </p>
          
          <div className="video-card">
            <a href="https://youtu.be/FRlbNOno5VA?si=o6gN1jFEMXZcqEa-" target="_blank" rel="noopener noreferrer">
              <div className="video-icon">📺</div>
              <div className="video-info">
                <div className="video-title">Mark Rober's Original Video</div>
                <div className="video-date">November 17, 2015</div>
              </div>
              <ExternalLink size={20} />
            </a>
          </div>

          <p>
            The idea was simple but powerful: ask broad, binary-elimination questions that remove 
            half the candidates per turn, rather than narrow questions about specific physical features.
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
            Together with the IShowSpeed short, the video accumulated over 155 million combined views, 
            turning binary search into the publicly accepted strategy for Guess Who.
          </p>
        </div>
      </section>

      {/* Dr. Nica Section */}
      <section className="section alt">
        <div className="content">
          <h2>Enter Dr. Mihai Nica</h2>
          
          <p>
            Just months before Rober's video, Dr. Mihai Nica published the first version of his 
            research paper:
          </p>

          <div className="paper-card">
            <div className="paper-title">"Optimal Strategy in 'Guess Who?': Beyond Binary Search"</div>
            <div className="paper-versions">
              <span>Version 1: September 8, 2015</span>
              <span>Version 2: January 16, 2016</span>
            </div>
          </div>

          <p>
            Nearly a decade later, on November 21, 2025, Dr. Nica released a full YouTube lecture 
            revisiting this research and illustrating how his dynamic-programming method identifies 
            an optimal strategy that outperforms naïve binary search.
          </p>

          <div className="video-card">
            <a href="https://www.youtube.com/watch?v=_3RNB8eOSx0" target="_blank" rel="noopener noreferrer">
              <div className="video-icon">📺</div>
              <div className="video-info">
                <div className="video-title">Dr. Mihai Nica's Lecture</div>
                <div className="video-date">November 21, 2025</div>
              </div>
              <ExternalLink size={20} />
            </a>
          </div>

          <p>
            To accompany the lecture, he released an interactive online tool titled 
            "Guess Who? Simulator" on marimo.app. Despite the name, the simulator does not use 
            faces or features. Instead, it uses a number-based abstraction.
          </p>

          <div className="callout">
            <strong>The Mathematical Model:</strong>
            <ul>
              <li>Each player secretly chooses a number (1–N)</li>
              <li>You "ask questions" using a slider that defines an interval [a,b]</li>
              <li>The simulator responds YES/NO based on whether the opponent's number lies in that range</li>
            </ul>
          </div>

          <p className="emphasis">
            This is a mathematical model inspired by Guess Who, not a literal implementation 
            of the real board game. And this modeling choice is what creates the discrepancy.
          </p>
        </div>
      </section>

      {/* The Discovery */}
      <section className="section">
        <div className="content">
          <h2>The Discovery</h2>
          
          <p>
            But when I started playing Nica's simulator, I noticed something unmistakably wrong:
          </p>

          <ul className="discovery-list">
            <li>I was winning earlier than I should</li>
            <li>The computer was not taking turns it should have been allowed to take</li>
            <li>The game declared me the winner at moments when I had not actually guessed the number—only reduced my candidate pool to one</li>
          </ul>

          <p>
            Curious whether anyone else noticed, I searched the comments on Nica's lecture. 
            One comment by @madks13 stood out, proposing a checkbox interface instead of a slider. 
            Yet none of the comments mentioned the issue I had discovered.
          </p>

          <p className="emphasis">
            So I decided to investigate further.
          </p>
        </div>
      </section>

      {/* Formal Notation */}
      <section className="section alt">
        <div className="content">
          <h2>Formal Notation & Game Structure</h2>
          
          <div className="math-block-container">
            <h3>Game State</h3>
            <p>Each player holds a set of possible opponent values:</p>
            <ul>
              <li>S₁: P1's remaining possibilities</li>
              <li>S₂: P2's remaining possibilities</li>
            </ul>
            <p>Their sizes are:</p>
            <ul>
              <li>n = |S₁|</li>
              <li>m = |S₂|</li>
            </ul>
            <p>At the start of a 1–20 game:</p>
            <div className="formula-display">
              S₁ = S₂ = {'{1, …, 20}'}, n = m = 20
            </div>
          </div>

          <div className="math-block-container">
            <h3>Question Format</h3>
            <p>A question is written as [a,b]? meaning:</p>
            <p className="quote">"Is your secret number between a and b?"</p>
            <p>Each half-move is notated:</p>
            <div className="formula-display">
              [a,b]? (A; n → n')
            </div>
            <p>where A ∈ {'{Y, N}'} and n → n' indicates P1's pool update.</p>
          </div>
        </div>
      </section>

      {/* Example Game Playback */}
      <section className="section">
        <div className="content">
          <h2>Example Game: Exposing the Discrepancy</h2>
          <p>
            Watch as the game progresses move by move. Pay special attention to Move 4, 
            where Nica's simulator declares P1 the winner immediately—without allowing P2 
            their final turn.
          </p>
          <GamePlayback />
          
          <div className="analysis-box">
            <h3>The Critical Moment</h3>
            <p>
              After Move 4, you ask: "Is your number 4?" Answer: NO. 
              Thus your pool becomes {'{5}'} → n=1.
            </p>
            <p className="emphasis">
              The simulator declares you the winner immediately. P2 does not get to take their turn.
            </p>
            <p>
              But according to the rules of real Guess Who:
            </p>
            <ul>
              <li>You have inferred the correct answer</li>
              <li>You must still wait one turn</li>
              <li>P2 must be allowed to guess</li>
              <li>Only after P2 misses can you declare "You are 5."</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Death Valley */}
      <section className="section death-valley-section">
        <div className="content">
          <h2>Death Valley: The Dangerous Missing State</h2>
          
          <p>
            In Dr. Nica's abstract model, the moment your pool size reaches 1, the game ends:
          </p>
          
          <div className="formula-display">
            n = 1 ⇒ P1 wins immediately
          </div>

          <p>
            This eliminates one of the most important states in real Guess Who.
          </p>

          <DeathValleyViz />

          <div className="definition-box">
            <h3>What Is Death Valley?</h3>
            <p>
              In real Guess Who, the transition n = 2 → n = 1—especially when 
              the interval [a,b]? returns NO—creates a special state:
            </p>
            <p className="emphasis">
              You know the answer but you cannot act yet.
            </p>
            <p>
              You must pass your turn, giving your opponent a final opportunity to win.
            </p>
            <p>
              This creates the strategic danger zone I call: 
              <strong> Death Valley</strong> — the one-turn vulnerability where full information 
              does not equal victory.
            </p>
          </div>

          <div className="impact-grid">
            <h3>Why Death Valley Matters</h3>
            <div className="impact-item">
              <div className="impact-icon">❌</div>
              <div className="impact-text">Makes aggressive, unbalanced guesses artificially safe</div>
            </div>
            <div className="impact-item">
              <div className="impact-icon">⚡</div>
              <div className="impact-text">Lets strategies "win early" without declaring</div>
            </div>
            <div className="impact-item">
              <div className="impact-icon">⏱️</div>
              <div className="impact-text">Misrepresents how timing and turn-order interact</div>
            </div>
            <div className="impact-item">
              <div className="impact-icon">📈</div>
              <div className="impact-text">Overstates the value of Nica's aggressive optimal strategy</div>
            </div>
            <div className="impact-item">
              <div className="impact-icon">🛡️</div>
              <div className="impact-text">Undermines defensive counterplay that exists in real Guess Who</div>
            </div>
          </div>

          <div className="contrast-box">
            <h3>In the real game:</h3>
            <ul>
              <li>Going from n=2 to n=1 can be dangerous</li>
              <li>Timing and survival matter</li>
              <li>Binary search behaves differently</li>
              <li>Optimal play must account for turn structure</li>
            </ul>
            <p className="emphasis">The simulator—and the abstraction it implements—does not.</p>
          </div>
        </div>
      </section>

      {/* State Tree Comparison */}
      <section className="section">
        <div className="content">
          <h2>Turn Structure Comparison</h2>
          <p>
            Here's a side-by-side comparison of how the same game plays out in Nica's Race-to-1 
            model versus real Guess Who:
          </p>
          <StateTree />
        </div>
      </section>

      {/* Conclusion */}
      <section className="section conclusion">
        <div className="content">
          <h2>The Core Issue</h2>
          
          <p className="emphasis large">
            Dr. Nica's simulator does not simulate Guess Who.
            <br/>
            It simulates a different game entirely — a Race-to-1 deduction race.
          </p>

          <div className="final-thoughts">
            <p>
              This was the core issue that no one in the comments had mentioned — and the one 
              I decided to formally analyze.
            </p>
            <p>
              By eliminating Death Valley, the Race-to-1 model fundamentally changes the strategic 
              landscape of the game. It's not just a simplification—it's a different game with 
              different optimal strategies.
            </p>
            <p>
              Understanding this distinction is crucial for anyone attempting to apply these 
              theoretical results to the actual board game.
            </p>
          </div>
        </div>
      </section>

      {/* Corrected Implementation */}
      <section className="section corrected-game">
        <div className="content">
          <h2>My Attempt at the Corrected Version of the Game</h2>
          
          <div style={{background: 'rgba(255, 255, 255, 0.1)', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', border: '2px solid rgba(96, 165, 250, 0.3)'}}>
            <h3 style={{color: '#60a5fa', marginBottom: '1rem', fontSize: '1.3rem'}}>About the Computer's Strategy</h3>
            <p style={{color: '#e2e8f0', marginBottom: '1rem'}}>
              The computer opponent uses an <strong>optimal bidding strategy</strong> based on Dr. Nica's 
              approach. It dynamically adjusts its question sizes using b*(n,m) approximation:
            </p>
            <ul style={{color: '#cbd5e1', listStyle: 'none', padding: 0}}>
              <li style={{padding: '0.5rem 0'}}>• When behind (n/m {'<'} 0.5): Asks about ~60% of pool (aggressive)</li>
              <li style={{padding: '0.5rem 0'}}>• When ahead (n/m {'>'} 2): Asks about ~40% of pool (conservative)</li>
              <li style={{padding: '0.5rem 0'}}>• When equal: Asks about ~50% of pool (balanced)</li>
            </ul>
            <p style={{color: '#94a3b8', marginTop: '1rem', fontSize: '0.95rem', fontStyle: 'italic'}}>
              However, unlike Nica's Race-to-1 simulator, this version requires exact guesses to win—preserving 
              the Death Valley state and turn structure of real Guess Who.
            </p>
          </div>

          <p className="disclaimer">
            This corrected implementation is based on Dr. Mihai Nica's original code, 
            used with consent from the original author for analytical purposes. 
            Feel free to use and modify this code for your own analytical work.
          </p>

          <CorrectedGame />
        </div>
      </section>

      {/* Dr. Nica's Response */}
      <section className="section nica-response">
        <div className="content">
          <h2>Dr. Nica's Response</h2>
          
          <div className="conversation">
            <div className="message dylan">
              <div className="message-header">
                <strong>Dylan Tague:</strong>
              </div>
              <div className="message-content">
                <p>
                  Hello Dr. Nica. I've sent you an email explaining what I believe is an error in your marimo code. 
                  It appears that your simulator treats "reducing your possibilities to one number" as an immediate win, 
                  ending the game the moment a player logically deduces the opponent's answer. In the real Guess Who? 
                  board game, however, narrowing your possibilities to one is not a victory—you must still declare 
                  your final guess on a later turn.
                </p>
                <p>
                  For example, if the range of the number your opponent has is between 4 and 5 and player 1 asks 
                  whether the opponent's number is 4, if the opponent's number is 5, your program correctly returns 
                  NO (and with that the only possible number is 5) but then immediately declares that player 1 is 
                  the winner. In the physical game however, player 1's turn would end at that moment, and the opponent 
                  would still get a final turn to guess, which can change the outcome.
                </p>
                <p>
                  By collapsing "knowing the answer" into "winning the game," the simulator unintentionally models a 
                  different game. More of a pure 'race to deduce the final candidate' rather than the actual turn-based 
                  structure of Guess Who?. I'm not sure if this is the same code you used for the simulations in your 
                  2015/2016 paper, but if it is, I believe the same error may appear in those simulations too.
                </p>
              </div>
            </div>

            <div className="message nica">
              <div className="message-header">
                <strong>Dr. Mihai Nica:</strong>
              </div>
              <div className="message-content">
                <p>
                  Thanks for pointing this out! It's not an error, the rule you described is a clearly stated version 
                  on how we model the game. Hasbro has several rules out there with different rules depending on the 
                  exact edition you buy (it seems to mostly depend on the target audience being older vs younger kids). 
                  This rule set is the most mathematical and has the most interesting structure.
                </p>
              </div>
            </div>

            <div className="message dylan">
              <div className="message-header">
                <strong>Dylan Tague:</strong>
              </div>
              <div className="message-content">
                <p>
                  Thank you for clarifying! I understand now that the "auto-win once reduced to one candidate" rule 
                  is an intentional modeling choice rather than an implementation mistake. My only concern was that 
                  this rule meaningfully alters the game-theoretic structure of Guess Who? compared to the standard 
                  Milton Bradley/Hasbro rules, where deduction does not end the game and a player must still spend 
                  a turn to declare the guess.
                </p>
                <p>
                  This additional turn can shift the distribution of victory outcomes, since players can sometimes 
                  overcome split or otherwise unfavorable probabilities, slightly changing the overall odds of winning. 
                  Under the official rules, a player can know the answer and still lose if it isn't their turn, whereas 
                  in the modeled version this dynamic disappears entirely. That shift can influence the optimal strategies 
                  produced in simulation and can make the paper's title slightly misleading if interpreted strictly within 
                  the classic ruleset (wherein my confusion was).
                </p>
                <p>
                  This distinction is especially relevant for the ruleset used in Mark Rober's binary-search style play. 
                  Even with the "Death Valley" principle defined in the dashboard I shared with you, and even with this 
                  distinction, your method still appears to produce the optimal strategy for that form of turn-based 
                  play, especially when compared to Rober's proposed binary search method—the confusion came solely from 
                  this modeling choice, not from any actual inaccuracy. I only wanted to confirm whether the difference 
                  was intentional since it does affect the strategy space. Thanks again for the explanation!
                </p>
              </div>
            </div>

            <div className="message nica">
              <div className="message-header">
                <strong>Dr. Mihai Nica:</strong>
              </div>
              <div className="message-content">
                <p>
                  Back in 2015 I simulated different rulesets—this one was the most mathematically interesting and elegant, 
                  which is why I chose it!
                </p>
              </div>
            </div>
          </div>

          <div className="reflection-box">
            <h3>Reflection</h3>
            <p>
              Dr. Nica's clarification confirms that the Race-to-1 win condition was a deliberate design choice 
              motivated by mathematical elegance. While this makes for a more tractable analysis, it fundamentally 
              changes the strategic landscape compared to the standard Guess Who? rules where Death Valley exists.
            </p>
            <p>
              The key takeaway: both models are valid—they simply answer different questions. Nica's model asks 
              "what's optimal in a pure deduction race?" while the standard rules ask "what's optimal when turns 
              and timing matter?" Understanding this distinction is crucial for anyone applying these theoretical 
              results to actual gameplay.
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
            Part of an analytical portfolio exploring the gap between Dr. Nica's mathematical model and the ruleset of the 'Guess Who?' game.
          </div>
        </div>
      </footer>

      <Styles />
    </div>
  );
}

// Game Playback Component with manual Continue button
const GamePlayback = () => {
  const [currentMove, setCurrentMove] = useState(0);
  
  const moves = [
    { 
      p1: { question: "Initial", answer: "", n: 20, pool: Array.from({length: 20}, (_, i) => i + 1) },
      p2: { question: "", answer: "", m: 20, pool: Array.from({length: 20}, (_, i) => i + 1) }
    },
    { 
      p1: { question: "[1,9]?", answer: "Y", n: 9, pool: [1,2,3,4,5,6,7,8,9] },
      p2: { question: "[1,8]?", answer: "N", m: 12, pool: [9,10,11,12,13,14,15,16,17,18,19,20] }
    },
    { 
      p1: { question: "[1,5]?", answer: "Y", n: 5, pool: [1,2,3,4,5] },
      p2: { question: "[9,12]?", answer: "N", m: 8, pool: [13,14,15,16,17,18,19,20] }
    },
    { 
      p1: { question: "[1,3]?", answer: "N", n: 2, pool: [4,5] },
      p2: { question: "[13,13]?", answer: "N", m: 7, pool: [14,15,16,17,18,19,20] }
    },
    { 
      p1: { question: "[4,4]?", answer: "N", n: 1, pool: [5], winner: true },
      p2: { question: "—", answer: "", m: 7, pool: [14,15,16,17,18,19,20], skipped: true }
    }
  ];

  const handleContinue = () => {
    if (currentMove < moves.length - 1) {
      setCurrentMove(currentMove + 1);
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
          style={{opacity: isLastMove ? 0.5 : 1, cursor: isLastMove ? 'not-allowed' : 'pointer'}}
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
                <span className={`answer ${currentState.p1.answer === 'Y' ? 'yes' : 'no'}`}>
                  {currentState.p1.answer}
                </span>
              )}
            </div>
          )}
          <div className="candidate-pool">
            {currentState.p1.pool.map(num => (
              <div key={num} className="candidate">
                {num}
              </div>
            ))}
          </div>
          {currentState.p1.winner && currentMove === 4 && (
            <div className="winner-badge">
              ⚠️ NICA'S SIMULATOR DECLARES: P1 Winner!
            </div>
          )}
        </div>

        <div className="vs-divider">
          <ChevronRight size={24} />
        </div>

        <div className="player-state">
          <div className="player-header">
            <h3>P2 (Dr. Nica's Simulator)</h3>
            <div className="pool-size">m = {currentState.p2.m}</div>
          </div>
          {currentState.p2.question && (
            <div className="move-display">
              <span className="question">{currentState.p2.question}</span>
              {currentState.p2.answer && (
                <span className={`answer ${currentState.p2.answer === 'Y' ? 'yes' : 'no'}`}>
                  {currentState.p2.answer}
                </span>
              )}
            </div>
          )}
          <div className="candidate-pool">
            {currentState.p2.pool.map(num => (
              <div key={num} className="candidate">
                {num}
              </div>
            ))}
          </div>
          {currentState.p2.skipped && currentMove === 4 && (
            <div className="skipped-badge">
              Turn Skipped!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Death Valley visualization
const DeathValleyViz = () => {
  const [phase, setPhase] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setPhase(p => (p + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const phases = [
    { title: "Safe Zone", desc: "n ≥ 3", danger: false, pool: [3,4,5,6,7] },
    { title: "Approaching", desc: "n = 2", danger: true, pool: [4,5] },
    { title: "Death Valley", desc: "n = 1", danger: true, pool: [5], critical: true },
    { title: "Your Turn", desc: "Must declare!", danger: true, pool: [5], declare: true }
  ];

  const current = phases[phase];

  return (
    <div className="death-valley">
      <div className={`valley-state ${current.danger ? 'danger' : 'safe'} ${current.critical ? 'critical' : ''}`}>
        <div className="valley-header">
          <h4>{current.title}</h4>
          <div className="valley-formula">{current.desc}</div>
        </div>
        
        <div className="valley-pool">
          {current.pool.map((num, i) => (
            <div 
              key={num} 
              className={`valley-card ${current.critical ? 'pulse' : ''}`}
            >
              {num}
            </div>
          ))}
        </div>

        {current.critical && (
          <div className="warning-text">
            ⚠️ You know the answer but cannot act yet!
          </div>
        )}

        {current.declare && (
          <div className="declare-text">
            ✓ Opponent missed - You can now declare "You are 5!"
          </div>
        )}
      </div>

      <div className="phase-dots">
        {phases.map((_, i) => (
          <div key={i} className={`dot ${i === phase ? 'active' : ''}`} />
        ))}
      </div>
    </div>
  );
};

// State tree visualization
const StateTree = () => {
  return (
    <div className="state-tree">
      <div className="tree-header">
        <h3>Turn Structure Comparison</h3>
      </div>
      
      <div className="tree-columns">
        <div className="tree-col">
          <h4>Nica's Race-to-1</h4>
          <div className="tree-nodes">
            <div className="node">n = 20, m = 20</div>
            <div className="node">n = 9, m = 12</div>
            <div className="node">n = 5, m = 8</div>
            <div className="node">n = 2, m = 7</div>
            <div className="node winner">n = 1 → P1 WINS</div>
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
            <div className="node death-valley">n = 1, m = 7 (Death Valley)</div>
            <div className="node">P2 takes turn</div>
            <div className="node winner">P1 declares → P1 WINS</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Corrected Game Component
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

  const startGame = () => {
    const pSecret = Math.floor(Math.random() * 20) + 1;
    const cSecret = Math.floor(Math.random() * 20) + 1;
    setPlayerSecret(pSecret);
    setComputerSecret(cSecret);
    setPlayerPool(Array.from({length: 20}, (_, i) => i + 1));
    setComputerPool(Array.from({length: 20}, (_, i) => i + 1));
    setSelectedNumbers([]);
    setGameLog([`🎮 Game Started! Your secret number is ${cSecret}`]);
    setWinner(null);
    setGameStarted(true);
    setPlayerTurn(true);
  };

  const handleNumberClick = (num) => {
    if (!playerTurn || winner) return;
    
    if (selectedNumbers.includes(num)) {
      // Deselect if already selected
      setSelectedNumbers(selectedNumbers.filter(n => n !== num));
    } else if (selectedNumbers.length < 2) {
      // Select if less than 2 numbers selected
      setSelectedNumbers([...selectedNumbers, num].sort((a, b) => a - b));
    } else {
      // Replace selection if 2 already selected
      setSelectedNumbers([num]);
    }
  };

  const makeRangeGuess = () => {
    if (!playerTurn || winner || selectedNumbers.length === 0) return;

    const min = selectedNumbers[0];
    const max = selectedNumbers.length === 2 ? selectedNumbers[1] : selectedNumbers[0];
    
    // Check if this is an exact guess (min === max)
    if (min === max) {
      const guess = min;
      if (guess === playerSecret) {
        setWinner('player');
        setGameLog(prev => [...prev, `👤 You asked: [${guess}, ${guess}]? Answer: YES ✅ CORRECT! You win!`]);
        return;
      } else {
        setGameLog(prev => [...prev, `👤 You asked: [${guess}, ${guess}]? Answer: NO`]);
        const newPlayerPool = playerPool.filter(n => n !== guess);
        setPlayerPool(newPlayerPool);
        setSelectedNumbers([]);
        setPlayerTurn(false);
        setTimeout(() => computerTurn(), 1000);
        return;
      }
    }
    
    // Range guess
    const inRange = min <= playerSecret && playerSecret <= max;
    const newPlayerPool = inRange 
      ? playerPool.filter(n => n >= min && n <= max)
      : playerPool.filter(n => n < min || n > max);
    
    setPlayerPool(newPlayerPool);
    
    const logMsg = `👤 You asked: [${min}, ${max}]? Answer: ${inRange ? 'YES' : 'NO'} (${newPlayerPool.length} remaining)`;
    setGameLog(prev => [...prev, logMsg]);
    
    setSelectedNumbers([]);
    setPlayerTurn(false);
    setTimeout(() => computerTurn(), 1000);
  };

  // Optimal bid approximation - mimics Nica's b*(n,m) strategy
  const getOptimalBidSize = (n, m) => {
    // Simplified approximation of optimal bid size based on pool sizes
    // This approximates the dynamic programming solution without full computation
    if (n === 1) return 1; // Must make exact guess
    if (n === 2) return 1; // Optimal to split evenly
    if (n <= 4) return Math.floor(n / 2);
    
    // For larger pools, use a more aggressive strategy when ahead
    const ratio = n / Math.max(m, 1);
    let bidSize;
    
    if (ratio < 0.5) {
      // We're behind - be more aggressive
      bidSize = Math.ceil(n * 0.6);
    } else if (ratio > 2) {
      // We're ahead - be more conservative
      bidSize = Math.floor(n * 0.4);
    } else {
      // Roughly equal - standard binary approach
      bidSize = Math.floor(n / 2);
    }
    
    // Safety bounds: bidSize must be in [1, n]
    return Math.max(1, Math.min(bidSize, n));
  };

  const computerTurn = () => {
    if (winner) return;

    // Check if computer can make exact guess
    if (computerPool.length === 1) {
      const guess = computerPool[0];
      if (guess === computerSecret) {
        setWinner('computer');
        setGameLog(prev => [...prev, `🤖 Computer declared ${guess} - CORRECT! Computer wins!`]);
      } else {
        setGameLog(prev => [...prev, `🤖 Computer declared ${guess} - WRONG!`]);
        setPlayerTurn(true);
      }
      return;
    }

    // Use optimal bidding strategy
    const n = computerPool.length;
    const m = playerPool.length;
    const bidSize = getOptimalBidSize(n, m);
    
    const sortedPool = [...computerPool].sort((a, b) => a - b);
    const min = sortedPool[0];
    const max = sortedPool[Math.min(bidSize - 1, sortedPool.length - 1)];
    
    const inRange = min <= computerSecret && computerSecret <= max;
    
    const newComputerPool = inRange
      ? computerPool.filter(n => n >= min && n <= max)
      : computerPool.filter(n => n < min || n > max);
    
    setComputerPool(newComputerPool);
    
    const logMsg = `🤖 Computer asked: [${min}, ${max}]? Answer: ${inRange ? 'YES' : 'NO'} (${newComputerPool.length} remaining)`;
    setGameLog(prev => [...prev, logMsg]);

    if (newComputerPool.length === 1) {
      setGameLog(prev => [...prev, '🤖 Computer knows the answer but must declare on their next turn']);
    }
    
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
            <h4>Key Difference</h4>
            <ul>
              <li>✅ Players must make an <strong>exact guess</strong> to win</li>
              <li>✅ Death Valley state is preserved</li>
              <li>✅ Both players get equal turns</li>
              <li>❌ No auto-win when pool reaches 1</li>
            </ul>
            <div style={{marginTop: '1.5rem', padding: '1rem', background: '#e0e7ff', borderRadius: '8px', fontSize: '0.95rem'}}>
              <strong style={{color: '#1e40af'}}>How to Play:</strong>
              <p style={{color: '#1e40af', marginTop: '0.5rem', marginBottom: 0}}>
                Click numbers from your possibilities to select your guess range. Click one number 
                for an exact guess, or two numbers to ask about a range. You can only select from 
                numbers currently in your pool.
              </p>
            </div>
            <div style={{marginTop: '1rem', padding: '1rem', background: '#e0e7ff', borderRadius: '8px', fontSize: '0.95rem'}}>
              <strong style={{color: '#1e40af'}}>Computer Strategy:</strong>
              <p style={{color: '#1e40af', marginTop: '0.5rem', marginBottom: 0}}>
                The computer uses an optimal bidding strategy approximating b*(n,m) - adjusting 
                subset sizes based on relative pool sizes to maximize win probability, but must 
                still make exact guesses to win.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="game-play">
          <div className="game-state-display">
            <div className="player-status">
              <h4>Your Status</h4>
              <div className="pool-display-interactive">
                {playerPool.map(n => (
                  <span 
                    key={n} 
                    className={`pool-number-clickable ${selectedNumbers.includes(n) ? 'selected' : ''}`}
                    onClick={() => handleNumberClick(n)}
                  >
                    {n}
                  </span>
                ))}
              </div>
              <div className="pool-count">{playerPool.length} possibilities</div>
              {selectedNumbers.length > 0 && (
                <div className="selection-display">
                  Selected: [{selectedNumbers[0]}{selectedNumbers.length === 2 ? `, ${selectedNumbers[1]}` : ''}]
                </div>
              )}
            </div>

            <div className="computer-status">
              <h4>Computer Status</h4>
              <div className="pool-display">
                {computerPool.map(n => (
                  <span key={n} className="pool-number computer">{n}</span>
                ))}
              </div>
              <div className="pool-count">{computerPool.length} possibilities</div>
            </div>
          </div>

          {!winner && playerTurn && (
            <div className="player-controls">
              <h4>Your Turn - Select Numbers to Guess</h4>
              <p className="instruction-text">
                Click numbers from your possibilities above to select a range. 
                Click one number for an exact guess, or two numbers to ask about a range.
              </p>
              <button 
                onClick={makeRangeGuess} 
                className="guess-btn"
                disabled={selectedNumbers.length === 0}
                style={{opacity: selectedNumbers.length === 0 ? 0.5 : 1, cursor: selectedNumbers.length === 0 ? 'not-allowed' : 'pointer'}}
              >
                {selectedNumbers.length === 0 && 'Select numbers to make a guess'}
                {selectedNumbers.length === 1 && `Ask: Is your number ${selectedNumbers[0]}?`}
                {selectedNumbers.length === 2 && `Ask: Is your number between ${selectedNumbers[0]} and ${selectedNumbers[1]}?`}
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
              <h3>{winner === 'player' ? '🎉 You Won!' : '💻 Computer Won!'}</h3>
              <button onClick={startGame} className="play-again-btn">
                Play Again
              </button>
            </div>
          )}

          <div className="game-log">
            <h4>Game Log</h4>
            <div className="log-entries">
              {gameLog.map((entry, i) => (
                <div key={i} className="log-entry">{entry}</div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="code-download">
        <h4>Download Full Python Implementation</h4>
        <p>The complete marimo notebook with optimal strategy computation and corrected turn-based rules.</p>
      </div>
    </div>
  );
};

// Styles Component
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
    .control-btn:hover { background: #2563eb; transform: translateY(-2px); }
    .move-indicator { margin-left: auto; font-weight: 600; color: #475569; }
    
    .game-state { display: grid; grid-template-columns: 1fr auto 1fr; gap: 2rem; align-items: start; }
    .player-state { background: #f8fafc; border-radius: 12px; padding: 1.5rem; min-height: 300px; }
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
    .analysis-box ul { list-style: none; padding: 0; }
    .analysis-box li { padding: 0.5rem 0; color: #78350f; }
    .analysis-box li::before { content: '✓'; margin-right: 0.75rem; color: #f59e0b; font-weight: 700; }
    
    .death-valley-section { background: white; }
    .death-valley-section h2 { color: #0f172a; }
    .death-valley-section h3 { color: #1e293b; }
    .death-valley-section p { color: #334155; }
    .death-valley-section .emphasis { color: #1e40af; }
    .death-valley { margin: 3rem 0; padding: 2rem; background: #f8fafc; border-radius: 16px; border: 2px solid #e2e8f0; }
    .valley-state { padding: 2rem; border-radius: 12px; transition: all 0.6s ease; }
    .valley-state.safe { background: #dcfce7; border: 2px solid #22c55e; }
    .valley-state.danger { background: #fee2e2; border: 2px solid #ef4444; }
    .valley-state.critical { animation: dangerPulse 2s ease infinite; }
    @keyframes dangerPulse { 0%, 100% { border-color: #ef4444; background: #fee2e2; } 50% { border-color: #dc2626; background: #fecaca; } }
    .valley-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    .valley-header h4 { font-size: 1.5rem; color: #1e293b; }
    .valley-formula { font-family: 'Courier New', monospace; font-size: 1.2rem; padding: 0.5rem 1rem; background: #e0e7ff; border-radius: 6px; color: #3730a3; }
    .valley-pool { display: flex; gap: 1rem; justify-content: center; margin: 2rem 0; }
    .valley-card { width: 80px; height: 100px; background: white; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: 700; color: #1e293b; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2); border: 2px solid #e2e8f0; }
    .valley-card.pulse { animation: cardPulse 1s ease infinite; }
    @keyframes cardPulse { 0%, 100% { transform: scale(1); box-shadow: 0 4px 20px rgba(239, 68, 68, 0.4); border-color: #ef4444; } 50% { transform: scale(1.05); box-shadow: 0 8px 30px rgba(239, 68, 68, 0.6); border-color: #dc2626; } }
    .warning-text { text-align: center; padding: 1rem; background: #fee2e2; border-radius: 8px; font-weight: 600; color: #991b1b; margin-top: 1rem; border: 2px solid #ef4444; }
    .declare-text { text-align: center; padding: 1rem; background: #dcfce7; border-radius: 8px; font-weight: 600; color: #166534; margin-top: 1rem; border: 2px solid #22c55e; }
    .phase-dots { display: flex; justify-content: center; gap: 0.75rem; margin-top: 2rem; }
    .dot { width: 12px; height: 12px; border-radius: 50%; background: #cbd5e1; transition: all 0.3s; }
    .dot.active { background: #3b82f6; transform: scale(1.5); }
    
    .definition-box { background: #dbeafe; border: 2px solid #3b82f6; border-radius: 12px; padding: 2rem; margin: 2rem 0; }
    .definition-box h3 { color: #1e40af; margin-bottom: 1rem; }
    .definition-box p { color: #1e293b; }
    
    .impact-grid { margin: 3rem 0; }
    .impact-grid h3 { color: #1e40af; margin-bottom: 2rem; font-size: 1.5rem; }
    .impact-item { display: flex; gap: 1rem; align-items: start; padding: 1rem; margin: 1rem 0; background: #f8fafc; border-radius: 8px; transition: all 0.3s; border: 2px solid #e2e8f0; }
    .impact-item:hover { background: #f1f5f9; transform: translateX(10px); border-color: #3b82f6; }
    .impact-icon { font-size: 1.5rem; flex-shrink: 0; }
    .impact-text { color: #334155; line-height: 1.6; }
    
    .contrast-box { background: #dcfce7; border: 2px solid #22c55e; border-radius: 12px; padding: 2rem; margin: 2rem 0; }
    .contrast-box h3 { color: #166534; margin-bottom: 1rem; }
    .contrast-box ul { list-style: none; padding: 0; }
    .contrast-box li { padding: 0.5rem 0; color: #15803d; }
    .contrast-box li::before { content: '→'; margin-right: 0.75rem; color: #22c55e; }
    .contrast-box p { color: #15803d; }
    .contrast-box .emphasis { color: #166534; font-weight: 600; }
    
    .state-tree { background: white; border-radius: 16px; padding: 2rem; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1); margin: 3rem 0; }
    .tree-header h3 { color: #1e293b; margin-bottom: 2rem; text-align: center; font-size: 1.8rem; }
    .tree-columns { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; }
    .tree-col h4 { color: #475569; margin-bottom: 1.5rem; text-align: center; font-size: 1.2rem; padding-bottom: 1rem; border-bottom: 2px solid #e2e8f0; }
    .tree-nodes { display: flex; flex-direction: column; gap: 1rem; }
    .node { padding: 1rem; background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 8px; text-align: center; font-weight: 500; color: #334155; transition: all 0.3s; }
    .node:hover { transform: translateX(5px); border-color: #3b82f6; }
    .node.winner { background: #dcfce7; border-color: #22c55e; color: #166534; font-weight: 700; }
    .node.skipped { background: #fee2e2; border-color: #dc2626; color: #991b1b; font-weight: 700; }
    .node.death-valley { background: #fef3c7; border-color: #f59e0b; color: #92400e; font-weight: 700; }
    
    .conclusion { background: linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%); }
    .final-thoughts { margin-top: 2rem; padding: 2rem; background: white; border-radius: 12px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); }
    .final-thoughts p { margin-bottom: 1rem; }
    
    .corrected-game { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); }
    .corrected-game h2 { color: white; }
    .corrected-game p { color: #e2e8f0; }
    .disclaimer { font-size: 0.95rem; color: #94a3b8; font-style: italic; padding: 1rem; background: rgba(255, 255, 255, 0.05); border-radius: 8px; border-left: 3px solid #60a5fa; margin-bottom: 2rem; }
    
    .corrected-game-container { background: white; border-radius: 16px; padding: 2rem; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3); }
    .game-start { text-align: center; padding: 3rem 2rem; }
    .start-game-btn { padding: 1.5rem 3rem; font-size: 1.3rem; background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; border: none; border-radius: 12px; cursor: pointer; font-weight: 600; transition: all 0.3s; box-shadow: 0 4px 20px rgba(59, 130, 246, 0.3); font-family: inherit; }
    .start-game-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 30px rgba(59, 130, 246, 0.4); }
    
    .key-difference { margin-top: 3rem; text-align: left; max-width: 500px; margin-left: auto; margin-right: auto; padding: 2rem; background: #f8fafc; border-radius: 12px; }
    .key-difference h4 { color: #1e293b; margin-bottom: 1rem; }
    .key-difference ul { list-style: none; padding: 0; }
    .key-difference li { padding: 0.5rem 0; color: #334155; display: flex; align-items: start; gap: 0.5rem; }
    
    .game-state-display { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem; }
    .player-status, .computer-status { padding: 1.5rem; background: #f8fafc; border-radius: 12px; }
    .player-status h4, .computer-status h4 { color: #1e293b; margin-bottom: 1rem; }
    .pool-display { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem; min-height: 80px; }
    .pool-display-interactive { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem; min-height: 80px; }
    .pool-number { background: #e0e7ff; color: #3730a3; padding: 0.5rem 0.75rem; border-radius: 6px; font-weight: 600; font-size: 0.9rem; }
    .pool-number-clickable { background: #e0e7ff; color: #3730a3; padding: 0.5rem 0.75rem; border-radius: 6px; font-weight: 600; font-size: 0.9rem; cursor: pointer; transition: all 0.2s; border: 2px solid transparent; }
    .pool-number-clickable:hover { background: #c7d2fe; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3); }
    .pool-number-clickable.selected { background: #3b82f6; color: white; border-color: #1e40af; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.5); }
    .pool-number.computer { background: #fecaca; color: #991b1b; }
    .pool-count { color: #64748b; font-size: 0.9rem; font-weight: 600; }
    .selection-display { margin-top: 1rem; padding: 0.75rem; background: #dbeafe; border-radius: 8px; color: #1e40af; font-weight: 600; text-align: center; }
    
    .player-controls { background: #dbeafe; padding: 2rem; border-radius: 12px; margin-bottom: 2rem; }
    .player-controls h4 { color: #1e40af; margin-bottom: 1rem; }
    .instruction-text { color: #1e40af; margin-bottom: 1.5rem; font-size: 0.95rem; line-height: 1.6; }
    .range-controls { display: flex; gap: 2rem; margin-bottom: 1rem; align-items: flex-end; }
    .range-control label { display: block; margin-bottom: 0.5rem; color: #1e40af; font-weight: 600; }
    .number-spinner { display: flex; gap: 0.5rem; align-items: center; }
    .number-spinner button { padding: 0.5rem 1rem; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 1.2rem; font-family: inherit; transition: all 0.2s; }
    .number-spinner button:hover { background: #2563eb; }
    .number-spinner button:disabled { background: #cbd5e1; cursor: not-allowed; }
    .number-display { padding: 0.75rem 1.5rem; background: white; border-radius: 6px; font-weight: 600; font-size: 1.2rem; min-width: 60px; text-align: center; }
    .guess-btn { width: 100%; padding: 1rem; background: #3b82f6; color: white; border: none; border-radius: 8px; font-size: 1.1rem; font-weight: 600; cursor: pointer; transition: all 0.2s; font-family: inherit; }
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
    .play-again-btn { padding: 1rem 2rem; background: #1e293b; color: white; border: none; border-radius: 8px; font-size: 1.1rem; font-weight: 600; cursor: pointer; transition: all 0.2s; font-family: inherit; }
    .play-again-btn:hover { background: #0f172a; transform: translateY(-2px); }
    
    .game-log { background: #f8fafc; padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem; }
    .game-log h4 { color: #1e293b; margin-bottom: 1rem; }
    .log-entries { max-height: 300px; overflow-y: auto; }
    .log-entry { padding: 0.5rem; margin: 0.25rem 0; background: white; border-radius: 6px; font-size: 0.95rem; color: #334155; font-family: 'Courier New', monospace; }
    
    .code-download { background: #f1f5f9; padding: 2rem; border-radius: 12px; text-align: center; }
    .code-download h4 { color: #1e293b; margin-bottom: 0.5rem; }
    .code-download p { color: #64748b; margin-bottom: 1.5rem; }
    
    .nica-response { background: #f8fafc; }
    .conversation { margin: 2rem 0; }
    .message { margin: 1rem 0; padding: 1rem 1.25rem; border-radius: 8px; }
    .message.dylan { background: white; border-left: 3px solid #3b82f6; }
    .message.nica { background: #e0e7ff; border-left: 3px solid #6366f1; }
    .message-header { margin-bottom: 0.75rem; }
    .message-header strong { color: #1e293b; font-size: 0.95rem; }
    .message-content p { margin-bottom: 0.75rem; color: #334155; line-height: 1.7; font-size: 0.95rem; }
    .message-content p:last-child { margin-bottom: 0; }
    .reflection-box { background: linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%); padding: 1.5rem; border-radius: 12px; border-left: 4px solid #3b82f6; margin-top: 2rem; }
    .reflection-box h3 { color: #1e40af; margin-bottom: 0.75rem; font-size: 1.2rem; }
    .reflection-box p { color: #334155; margin-bottom: 0.75rem; line-height: 1.7; font-size: 0.95rem; }
    .reflection-box p:last-child { margin-bottom: 0; }
    
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
      .range-controls { flex-direction: column; align-items: stretch; }
      .pool-display-interactive { justify-content: center; }
      .message { padding: 1rem; }
      .message-content p { font-size: 1rem; }
    }
  `}</style>
);
