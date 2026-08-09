// src/components/CorrectedGame.jsx
import React, { useState } from 'react';
import {
  getPlayerPerspectiveWinProb,
  getOptimalBotAction,
  evaluateMoveQuality,
  getEvBreakdown,
} from '../utils/mathEngine';
import { sound } from '../utils/audio';
import {
  RotateCcw,
  Zap,
  Award,
  HelpCircle,
  Volume2,
  VolumeX,
  Bot,
  User,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Play,
  Pause,
} from 'lucide-react';

const CHARACTERS = [
  { id: 1, name: 'Alex', icon: '👨‍🦰' },
  { id: 2, name: 'Ben', icon: '🧔' },
  { id: 3, name: 'Claire', icon: '👩' },
  { id: 4, name: 'David', icon: '👨‍🦱' },
  { id: 5, name: 'Emma', icon: '👩‍🦰' },
  { id: 6, name: 'Felix', icon: '👨‍🦲' },
  { id: 7, name: 'Grace', icon: '👩‍🦱' },
  { id: 8, name: 'Henry', icon: '👴' },
  { id: 9, name: 'Isla', icon: '👧' },
  { id: 10, name: 'Jack', icon: '👦' },
  { id: 11, name: 'Kate', icon: '👩‍💼' },
  { id: 12, name: 'Leo', icon: '👨‍💼' },
  { id: 13, name: 'Maya', icon: '👩‍🎨' },
  { id: 14, name: 'Noah', icon: '👨‍🚀' },
  { id: 15, name: 'Olivia', icon: '👩‍⚕️' },
  { id: 16, name: 'Paul', icon: '👨‍✈️' },
  { id: 17, name: 'Quinn', icon: '🧑‍🎤' },
  { id: 18, name: 'Ruby', icon: '👩‍💻' },
  { id: 19, name: 'Sam', icon: '👨‍🌾' },
  { id: 20, name: 'Tina', icon: '👩‍🍳' },
];

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

export default function CorrectedGame() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameModel, setGameModel] = useState('soft'); // 'soft' | 'hard' | 'race'
  const [botMode, setBotMode] = useState('optimal'); // 'optimal' | 'binary' | 'random'
  const [soundEnabled, setSoundEnabled] = useState(true);

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
  const [showHint, setShowHint] = useState(false);

  // Session Stats
  const [sessionStats, setSessionStats] = useState({
    wins: 0,
    losses: 0,
    bestMoves: 0,
    blunders: 0,
  });

  const toggleAudio = () => {
    const isMuted = sound.toggleMute();
    setSoundEnabled(!isMuted);
  };

  const startGame = () => {
    sound.playSelect();
    const computerHidden = Math.floor(Math.random() * 20) + 1;
    const playerHidden = Math.floor(Math.random() * 20) + 1;

    setPlayerSecret(computerHidden);
    setComputerSecret(playerHidden);

    const fullPool = Array.from({ length: 20 }, (_, i) => i + 1);

    setPlayerPool(fullPool);
    setComputerPool(fullPool);
    setSelectedNumbers([]);
    setGameLog([
      { text: `🎮 Game initialized! Mode: ${gameModel.toUpperCase()} | Bot: ${botMode.toUpperCase()}`, quality: null },
      { text: "📊 Evaluate your moves against optimal DP decisions in real time.", quality: null },
    ]);
    setWinner(null);
    setGameStarted(true);
    setPlayerTurn(true);

    const initialWin = getPlayerPerspectiveWinProb(20, 20, true, gameModel);
    setWinProb(initialWin);
    setLastPlayerQuality(null);
    setLastComputerQuality(null);
    setThinking(false);
    setShowHint(false);
  };

  const handleCardClick = (num) => {
    if (!playerTurn || winner || thinking) return;
    if (!playerPool.includes(num)) return;

    sound.playSelect();
    if (selectedNumbers.includes(num)) {
      sound.playDeselect();
      setSelectedNumbers(selectedNumbers.filter((n) => n !== num));
    } else if (selectedNumbers.length < 2) {
      setSelectedNumbers([...selectedNumbers, num].sort((a, b) => a - b));
    } else {
      setSelectedNumbers([num]);
    }
  };

  const selectOptimalHintRange = () => {
    const n = playerPool.length;
    const m = computerPool.length;
    const action = getOptimalBotAction(n, m, gameModel);

    if (action.type === 'guess') {
      if (playerPool.length > 0) {
        setSelectedNumbers([playerPool[0]]);
      }
    } else {
      const sorted = [...playerPool].sort((a, b) => a - b);
      const targetSize = action.b;
      const subset = sorted.slice(0, targetSize);
      if (subset.length >= 1) {
        if (subset.length === 1) {
          setSelectedNumbers([subset[0]]);
        } else {
          setSelectedNumbers([subset[0], subset[subset.length - 1]]);
        }
      }
    }
    sound.playSelect();
  };

  const makeRangeOrGuess = () => {
    if (!playerTurn || winner || selectedNumbers.length === 0 || thinking) return;

    sound.playAsk();
    const nBefore = playerPool.length;
    const mBefore = computerPool.length;
    const preWin = getPlayerPerspectiveWinProb(nBefore, mBefore, true, gameModel);

    const min = selectedNumbers[0];
    const max = selectedNumbers.length === 2 ? selectedNumbers[1] : selectedNumbers[0];

    // --- EXACT GUESS ---
    if (min === max) {
      const guess = min;
      const charName = CHARACTERS.find((c) => c.id === guess)?.name || `#${guess}`;

      if (guess === playerSecret) {
        sound.playWin();
        const quality = {
          category: 'best',
          label: 'Best move',
          icon: '!!',
          description: 'Correct winning guess!',
        };
        setLastPlayerQuality(quality);
        setGameLog((prev) => [
          ...prev,
          { text: `👤 You guessed [${guess}: ${charName}] — Correct! You win the game!`, quality },
        ]);
        setWinner('player');
        setSessionStats((prev) => ({
          ...prev,
          wins: prev.wins + 1,
          bestMoves: prev.bestMoves + 1,
        }));
        setWinProb(1.0);
        setSelectedNumbers([]);
        return;
      }

      // Incorrect Guess
      let newPlayerPool = playerPool.filter((x) => x !== guess);
      if (gameModel === 'hard') {
        sound.playLoss();
        setGameLog((prev) => [
          ...prev,
          { text: `👤 Hard Guess [${guess}: ${charName}] was WRONG! Instant Game Over.`, quality: { category: 'blunder', label: 'Blunder', icon: '??', description: 'Hard guess failed.' } },
        ]);
        setWinner('computer');
        setSessionStats((prev) => ({ ...prev, losses: prev.losses + 1, blunders: prev.blunders + 1 }));
        setWinProb(0.0);
        return;
      }

      const nAfter = newPlayerPool.length;
      const mAfter = mBefore;
      const postWin = getPlayerPerspectiveWinProb(nAfter, mAfter, false, gameModel);

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
        model: gameModel,
      });

      if (quality?.category === 'best') setSessionStats((prev) => ({ ...prev, bestMoves: prev.bestMoves + 1 }));
      if (quality?.category === 'blunder') setSessionStats((prev) => ({ ...prev, blunders: prev.blunders + 1 }));

      setLastPlayerQuality(quality || null);
      setGameLog((prev) => [
        ...prev,
        { text: `👤 You guessed [${guess}: ${charName}] — Wrong (${nAfter} candidates remain)`, quality },
      ]);

      setPlayerPool(newPlayerPool);
      setSelectedNumbers([]);
      setPlayerTurn(false);
      setWinProb(postWin);

      setTimeout(() => {
        setThinking(true);
        setTimeout(() => triggerComputerTurn(newPlayerPool, computerPool), 1200);
      }, 1500);
      return;
    }

    // --- RANGE QUESTION ---
    const inRange = min <= playerSecret && playerSecret <= max;
    const affected = playerPool.filter((x) => x >= min && x <= max);
    const b = affected.length;

    const newPlayerPool = inRange
      ? affected
      : playerPool.filter((x) => x < min || x > max);

    const nAfter = newPlayerPool.length;
    const mAfter = mBefore;
    const postWin = getPlayerPerspectiveWinProb(nAfter, mAfter, false, gameModel);

    const quality = evaluateMoveQuality({
      nBefore,
      mBefore,
      nAfter,
      mAfter,
      isPlayerMove: true,
      isGuess: false,
      b,
      preWin,
      postWin,
      model: gameModel,
    });

    if (quality?.category === 'best') setSessionStats((prev) => ({ ...prev, bestMoves: prev.bestMoves + 1 }));
    if (quality?.category === 'blunder') setSessionStats((prev) => ({ ...prev, blunders: prev.blunders + 1 }));

    setLastPlayerQuality(quality || null);
    setGameLog((prev) => [
      ...prev,
      {
        text: `👤 You asked: [${min} to ${max}]? Answer: ${inRange ? 'YES ✅' : 'NO ❌'} (${nAfter} candidates remain)`,
        quality,
      },
    ]);

    setPlayerPool(newPlayerPool);
    setSelectedNumbers([]);
    setPlayerTurn(false);
    setWinProb(postWin);

    setTimeout(() => {
      setThinking(true);
      setTimeout(() => triggerComputerTurn(newPlayerPool, computerPool), 1200);
    }, 1500);
  };

  const triggerComputerTurn = (currPlayerPool, currComputerPool) => {
    if (winner) {
      setThinking(false);
      return;
    }

    const n = currComputerPool.length;
    const m = currPlayerPool.length;

    if (n <= 0 || m <= 0) {
      setThinking(false);
      return;
    }

    const preWinPlayer = getPlayerPerspectiveWinProb(m, n, false, gameModel);

    let action;
    if (botMode === 'optimal') {
      action = getOptimalBotAction(n, m, gameModel);
    } else if (botMode === 'binary') {
      action = { type: 'question', b: Math.max(1, Math.floor(n / 2)) };
    } else {
      // Random
      if (n > 1 && Math.random() > 0.3) {
        action = { type: 'question', b: Math.floor(Math.random() * (n - 1)) + 1 };
      } else {
        action = { type: 'guess', b: 0 };
      }
    }

    // Bot GUESS
    if (action.type === 'guess') {
      const idx = Math.floor(Math.random() * n);
      const guess = currComputerPool[idx];
      const charName = CHARACTERS.find((c) => c.id === guess)?.name || `#${guess}`;

      if (guess === computerSecret) {
        sound.playLoss();
        const quality = {
          category: 'best',
          label: 'Best move',
          icon: '!!',
          description: 'Engine declared the correct winning guess.',
        };
        setLastComputerQuality(quality);
        setGameLog((prev) => [
          ...prev,
          { text: `🤖 Computer guessed [${guess}: ${charName}] — Correct. Computer Wins!`, quality },
        ]);
        setWinner('computer');
        setSessionStats((prev) => ({ ...prev, losses: prev.losses + 1 }));
        setWinProb(0.0);
        setThinking(false);
        return;
      }

      const newComputerPool = currComputerPool.filter((x) => x !== guess);
      const nAfter = newComputerPool.length;
      const mAfter = m;
      const postWinPlayer = getPlayerPerspectiveWinProb(mAfter, nAfter, true, gameModel);

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
        model: gameModel,
      });

      setLastComputerQuality(quality || null);
      setGameLog((prev) => [
        ...prev,
        { text: `🤖 Computer guessed [${guess}: ${charName}] — Wrong (${nAfter} remaining)`, quality },
      ]);

      setComputerPool(newComputerPool);
      setPlayerTurn(true);
      setWinProb(postWinPlayer);
      setThinking(false);
      return;
    }

    // Bot QUESTION
    const bidSize = action.b;
    const sorted = [...currComputerPool].sort((a, b) => a - b);
    const subset = sorted.slice(0, bidSize);
    const minQ = subset[0];
    const maxQ = subset[subset.length - 1];

    const inSubset = subset.includes(computerSecret);
    const newComputerPool = inSubset
      ? subset
      : currComputerPool.filter((x) => !subset.includes(x));

    const nAfter = newComputerPool.length;
    const mAfter = m;
    const postWinPlayer = getPlayerPerspectiveWinProb(mAfter, nAfter, true, gameModel);

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
      model: gameModel,
    });

    setLastComputerQuality(quality || null);
    setGameLog((prev) => [
      ...prev,
      {
        text: `🤖 Computer asked: [${minQ} to ${maxQ}]? Answer: ${inSubset ? 'YES ✅' : 'NO ❌'} (${nAfter} remaining)`,
        quality,
      },
    ]);

    setComputerPool(newComputerPool);
    setPlayerTurn(true);
    setWinProb(postWinPlayer);
    setThinking(false);
  };

  const hintEvBreakdown = gameStarted && playerTurn && playerPool.length > 1
    ? getEvBreakdown(playerPool.length, computerPool.length, gameModel)
    : [];

  return (
    <div className="corrected-game-wrapper">
      {/* Top Options Bar */}
      <div className="game-options-bar">
        <div className="option-group">
          <label>Game Ruleset Model:</label>
          <select value={gameModel} onChange={(e) => setGameModel(e.target.value)} disabled={gameStarted && !winner}>
            <option value="soft">Soft-Guess (Real Game + Death Valley)</option>
            <option value="hard">Hard-Guess (Strict All-In)</option>
            <option value="race">Race-to-1 (Nica Instant Win Model)</option>
          </select>
        </div>

        <div className="option-group">
          <label>Bot Strategy:</label>
          <select value={botMode} onChange={(e) => setBotMode(e.target.value)} disabled={gameStarted && !winner}>
            <option value="optimal">🧠 Optimal DP Engine</option>
            <option value="binary">🔍 Binary Search (Mark Rober)</option>
            <option value="random">🎲 Naïve / Random Play</option>
          </select>
        </div>

        <button className="sound-toggle-btn" onClick={toggleAudio} title="Toggle Sound">
          {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>
      </div>

      {!gameStarted ? (
        <div className="game-start-hero">
          <div className="start-badge">Interactive Simulation</div>
          <h3>Play Corrected Guess Who vs. Strategy Engine</h3>
          <p>
            Experience true turn-based mechanics where candidate pool $n=1$ places you in <strong>Death Valley</strong>.
            Every move is evaluated for mathematical equity precision.
          </p>

          <button onClick={startGame} className="start-game-btn">
            <Play size={20} /> Start New Game
          </button>
        </div>
      ) : (
        <div className="game-active-layout">
          {/* Header Stats */}
          <div className="game-stats-header">
            <div className="session-card">
              <span className="card-label">Session Record</span>
              <span className="card-value">
                {sessionStats.wins}W - {sessionStats.losses}L
              </span>
            </div>
            <div className="session-card">
              <span className="card-label">Best Move Ratio</span>
              <span className="card-value">
                {sessionStats.bestMoves} Best / {sessionStats.blunders} Blunders
              </span>
            </div>
            <button onClick={startGame} className="restart-btn">
              <RotateCcw size={16} /> Reset Board
            </button>
          </div>

          {/* Boards Layout */}
          <div className="boards-container">
            {/* Player Side */}
            <div className="board-panel player-board">
              <div className="panel-header">
                <User className="icon" size={20} />
                <h4>Your Board (P1)</h4>
                <span className="pool-count">{playerPool.length} Candidates</span>
              </div>

              {winProb !== null && (
                <div className="win-gauge">
                  <div className="gauge-info">
                    <span>Win Chance</span>
                    <span className="gauge-pct">{(winProb * 100).toFixed(1)}%</span>
                  </div>
                  <div className="gauge-bar">
                    <div
                      className="gauge-fill"
                      style={{
                        width: `${winProb * 100}%`,
                        backgroundColor: winProb > 0.6 ? '#22c55e' : winProb > 0.4 ? '#eab308' : '#ef4444',
                      }}
                    />
                  </div>
                </div>
              )}

              {lastPlayerQuality && <QualityBadge quality={lastPlayerQuality} />}

              {/* Candidate Cards Grid */}
              <div className="cards-grid">
                {CHARACTERS.map((char) => {
                  const isAlive = playerPool.includes(char.id);
                  const isSelected = selectedNumbers.includes(char.id);

                  return (
                    <div
                      key={char.id}
                      className={`character-card ${isAlive ? 'alive' : 'eliminated'} ${isSelected ? 'selected' : ''}`}
                      onClick={() => isAlive && handleCardClick(char.id)}
                    >
                      <div className="card-avatar">{char.icon}</div>
                      <div className="card-name">{char.name}</div>
                      <div className="card-num">#{char.id}</div>
                    </div>
                  );
                })}
              </div>

              {/* Range Action Controls */}
              {!winner && playerTurn && !thinking && (
                <div className="turn-controls">
                  <div className="controls-row">
                    <button
                      onClick={selectOptimalHintRange}
                      className="hint-btn"
                      title="Auto-select optimal range size b*"
                    >
                      <Sparkles size={16} /> Auto-Select Optimal
                    </button>
                    <button
                      onClick={() => setShowHint(!showHint)}
                      className="toggle-hint-btn"
                    >
                      <HelpCircle size={16} /> {showHint ? 'Hide Strategy EVs' : 'Show Strategy EVs'}
                    </button>
                  </div>

                  {showHint && hintEvBreakdown.length > 0 && (
                    <div className="hint-ev-panel">
                      <h5>Strategy EV Breakdown for State ({playerPool.length}, {computerPool.length})</h5>
                      <div className="hint-list">
                        {hintEvBreakdown.slice(0, 4).map((h, i) => (
                          <div key={i} className={`hint-item ${h.isOptimal ? 'optimal' : ''}`}>
                            <span>{h.isOptimal ? '★ ' : ''}{h.label}</span>
                            <span>{h.evPct}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={makeRangeOrGuess}
                    className="submit-move-btn"
                    disabled={selectedNumbers.length === 0}
                  >
                    {selectedNumbers.length === 0 && 'Click numbers above to make a move'}
                    {selectedNumbers.length === 1 && `Guess #${selectedNumbers[0]} (${CHARACTERS.find((c) => c.id === selectedNumbers[0])?.name})`}
                    {selectedNumbers.length === 2 && `Ask Range [${selectedNumbers[0]} .. ${selectedNumbers[1]}]`}
                  </button>
                </div>
              )}
            </div>

            {/* Computer Side */}
            <div className="board-panel computer-board">
              <div className="panel-header">
                <Bot className="icon" size={20} />
                <h4>Computer Board (P2)</h4>
                <span className="pool-count">{computerPool.length} Candidates</span>
              </div>

              {winProb !== null && (
                <div className="win-gauge">
                  <div className="gauge-info">
                    <span>Computer Win Chance</span>
                    <span className="gauge-pct">{((1 - winProb) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="gauge-bar">
                    <div
                      className="gauge-fill computer-fill"
                      style={{
                        width: `${(1 - winProb) * 100}%`,
                        backgroundColor: (1 - winProb) > 0.6 ? '#ef4444' : (1 - winProb) > 0.4 ? '#eab308' : '#22c55e',
                      }}
                    />
                  </div>
                </div>
              )}

              {lastComputerQuality && <QualityBadge quality={lastComputerQuality} />}

              {/* Computer Candidate Grid (Hidden values) */}
              <div className="cards-grid mini-grid">
                {CHARACTERS.map((char) => {
                  const isAlive = computerPool.includes(char.id);
                  return (
                    <div
                      key={char.id}
                      className={`character-card mini ${isAlive ? 'alive' : 'eliminated'}`}
                    >
                      <div className="card-num">#{char.id}</div>
                    </div>
                  );
                })}
              </div>

              {thinking && (
                <div className="thinking-indicator">
                  <div className="spinner-dots">
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                  </div>
                  <span>Computing optimal decision V({computerPool.length}, {playerPool.length})...</span>
                </div>
              )}
            </div>
          </div>

          {/* Winner Banner */}
          {winner && (
            <div className={`winner-banner ${winner}`}>
              <h3>{winner === 'player' ? '🎉 Victory! You Won!' : '💻 Defeat! Computer Won!'}</h3>
              <button onClick={startGame} className="play-again-btn">
                Play Next Game
              </button>
            </div>
          )}

          {/* Game Log */}
          <div className="game-log-panel">
            <h4>Live Game & Decision Log</h4>
            <div className="log-list">
              {gameLog.map((entry, idx) => (
                <div key={idx} className="log-row">
                  <span className="log-text">{entry.text}</span>
                  {entry.quality && <QualityBadge quality={entry.quality} inline={true} />}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
