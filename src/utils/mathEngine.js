// src/utils/mathEngine.js

const MAX_POOL_SIZE = 20;

// Dynamic Programming Cache for 3 Models:
// 1. 'soft'   -> Real Turn-Based Soft Guess (wrong guess removes 1 candidate & passes turn)
// 2. 'hard'   -> Real Turn-Based Hard Guess (wrong guess loses game immediately)
// 3. 'race'   -> Dr. Mihai Nica's Race-to-1 (n=1 is instant win even on opponent's turn)

const memo = {
  soft: { value: new Map(), bestBid: new Map() },
  hard: { value: new Map(), bestBid: new Map() },
  race: { value: new Map(), bestBid: new Map() },
};

const makeKey = (n, m) => `${n},${m}`;

/**
 * Compute Win Probability V(n, m) for active player under selected model
 */
export function getWinValue(n, m, model = 'soft') {
  const safeN = Math.max(1, Math.min(MAX_POOL_SIZE, n || 1));
  const safeM = Math.max(1, Math.min(MAX_POOL_SIZE, m || 1));
  const activeModel = memo[model] ? model : 'soft';

  if (activeModel === 'race') {
    if (safeN === 1) return 1.0;
    if (safeM === 1) return 0.0;
  } else {
    // Turn-based real rules: on your turn with n=1, you declare exact candidate and win
    if (safeN === 1) return 1.0;
  }

  const key = makeKey(safeN, safeM);
  const cache = memo[activeModel];
  if (cache.value.has(key)) return cache.value.get(key);

  let bestVal = -1;
  let bestB = 0; // 0 represents "guess exact candidate"

  if (activeModel === 'soft') {
    // 1. EV of Soft Guessing
    const winNow = 1 / safeN;
    const surviveLater = ((safeN - 1) / safeN) * (1 - getWinValue(safeM, safeN - 1, 'soft'));
    const guessEV = winNow + surviveLater;
    bestVal = guessEV;
    bestB = 0;

    // 2. EV of Asking Questions [a, b] of size b
    for (let b = 1; b <= safeN - 1; b++) {
      const pYes = b / safeN;
      const valYes = 1 - getWinValue(safeM, b, 'soft');
      const valNo = 1 - getWinValue(safeM, safeN - b, 'soft');
      const askEV = pYes * valYes + (1 - pYes) * valNo;

      if (askEV > bestVal + 1e-9) {
        bestVal = askEV;
        bestB = b;
      }
    }
  } else if (activeModel === 'hard') {
    // 1. EV of Hard Guessing (All-in: 1/n chance to win, 0% to survive if wrong)
    const guessEV = 1 / safeN;
    bestVal = guessEV;
    bestB = 0;

    // 2. EV of Asking Questions
    for (let b = 1; b <= safeN - 1; b++) {
      const pYes = b / safeN;
      const valYes = 1 - getWinValue(safeM, b, 'hard');
      const valNo = 1 - getWinValue(safeM, safeN - b, 'hard');
      const askEV = pYes * valYes + (1 - pYes) * valNo;

      if (askEV > bestVal + 1e-9) {
        bestVal = askEV;
        bestB = b;
      }
    }
  } else if (activeModel === 'race') {
    // Race-to-1: Cannot "guess", only ask questions until pool size reaches 1
    bestVal = -1;
    bestB = Math.floor(safeN / 2); // default half-split

    for (let b = 1; b <= safeN - 1; b++) {
      const pYes = b / safeN;
      const valYes = 1 - getWinValue(safeM, b, 'race');
      const valNo = 1 - getWinValue(safeM, safeN - b, 'race');
      const askEV = pYes * valYes + (1 - pYes) * valNo;

      if (askEV > bestVal + 1e-9) {
        bestVal = askEV;
        bestB = b;
      }
    }
  }

  cache.value.set(key, bestVal);
  cache.bestBid.set(key, bestB);
  return bestVal;
}

/**
 * Precompute full DP matrix up to MAX_POOL_SIZE for all models
 */
export function precomputeAllModels() {
  ['soft', 'hard', 'race'].forEach((model) => {
    memo[model].value.clear();
    memo[model].bestBid.clear();
    for (let n = 1; n <= MAX_POOL_SIZE; n++) {
      for (let m = 1; m <= MAX_POOL_SIZE; m++) {
        getWinValue(n, m, model);
      }
    }
  });
}

// Precompute on module load
precomputeAllModels();

/**
 * Get full DP matrix data for a specific model (for 2D Heatmap visualizer)
 */
export function getDpMatrix(model = 'soft') {
  const activeModel = memo[model] ? model : 'soft';
  const matrix = [];
  for (let n = 1; n <= MAX_POOL_SIZE; n++) {
    const row = [];
    for (let m = 1; m <= MAX_POOL_SIZE; m++) {
      const val = getWinValue(n, m, activeModel);
      const key = makeKey(n, m);
      const bestB = memo[activeModel].bestBid.get(key) ?? 0;
      row.push({
        n,
        m,
        val,
        valPct: (val * 100).toFixed(1),
        bestB,
        actionText: bestB === 0 ? 'Guess' : `Ask ${bestB}`,
      });
    }
    matrix.push(row);
  }
  return matrix;
}

/**
 * Detailed expected value (EV) breakdown for all possible choices at state (n, m)
 */
export function getEvBreakdown(n, m, model = 'soft') {
  const safeN = Math.max(1, Math.min(MAX_POOL_SIZE, n || 1));
  const safeM = Math.max(1, Math.min(MAX_POOL_SIZE, m || 1));
  const activeModel = memo[model] ? model : 'soft';

  if (safeN <= 1) {
    return [
      {
        type: 'guess',
        b: 0,
        label: 'Declare Exact Guess',
        ev: 1.0,
        evPct: '100.0%',
        isOptimal: true,
      },
    ];
  }

  const results = [];

  // Guess EV (if allowed)
  if (activeModel === 'soft') {
    const winNow = 1 / safeN;
    const surviveLater = ((safeN - 1) / safeN) * (1 - getWinValue(safeM, safeN - 1, 'soft'));
    const guessEV = winNow + surviveLater;
    results.push({
      type: 'guess',
      b: 0,
      label: `Guess 1 of ${safeN}`,
      ev: guessEV,
      evPct: (guessEV * 100).toFixed(1) + '%',
      detail: `Success: ${(100 / safeN).toFixed(1)}%, Fail: ${(((safeN - 1) / safeN) * 100).toFixed(1)}% (pool -> ${safeN - 1})`,
    });
  } else if (activeModel === 'hard') {
    const guessEV = 1 / safeN;
    results.push({
      type: 'guess',
      b: 0,
      label: `Hard Guess 1 of ${safeN}`,
      ev: guessEV,
      evPct: (guessEV * 100).toFixed(1) + '%',
      detail: `Success: ${(100 / safeN).toFixed(1)}%, Fail: Instant Loss`,
    });
  }

  // Question EVs for b = 1..safeN-1
  for (let b = 1; b <= safeN - 1; b++) {
    const pYes = b / safeN;
    const valYes = 1 - getWinValue(safeM, b, activeModel);
    const valNo = 1 - getWinValue(safeM, safeN - b, activeModel);
    const askEV = pYes * valYes + (1 - pYes) * valNo;

    results.push({
      type: 'question',
      b,
      label: `Ask ${b} candidate${b > 1 ? 's' : ''}`,
      ev: askEV,
      evPct: (askEV * 100).toFixed(1) + '%',
      detail: `YES (${(pYes * 100).toFixed(0)}%): win ${(valYes * 100).toFixed(1)}% | NO (${((1 - pYes) * 100).toFixed(0)}%): win ${(valNo * 100).toFixed(1)}%`,
    });
  }

  // Find optimal EV
  const maxEV = Math.max(...results.map((r) => r.ev));
  results.forEach((r) => {
    r.isOptimal = Math.abs(r.ev - maxEV) < 1e-7;
    r.diffFromOptimal = maxEV - r.ev;
  });

  return results.sort((a, b) => b.ev - a.ev);
}

/**
 * Get optimal bot action for a given state (n, m)
 */
export function getOptimalBotAction(n, m, model = 'soft') {
  const safeN = Math.max(1, Math.min(MAX_POOL_SIZE, n || 1));
  const safeM = Math.max(1, Math.min(MAX_POOL_SIZE, m || 1));
  const activeModel = memo[model] ? model : 'soft';

  if (safeN <= 1) return { type: 'guess', b: 0 };

  const key = makeKey(safeN, safeM);
  const bestB = memo[activeModel].bestBid.get(key) ?? 0;

  if (bestB === 0) {
    return { type: 'guess', b: 0 };
  }
  return { type: 'question', b: bestB };
}

/**
 * Get win probability from Player 1's perspective
 */
export function getPlayerPerspectiveWinProb(nPlayer, nComputer, isPlayerTurn, model = 'soft') {
  const safeP = Math.max(1, Math.min(MAX_POOL_SIZE, nPlayer || 1));
  const safeC = Math.max(1, Math.min(MAX_POOL_SIZE, nComputer || 1));
  const activeModel = memo[model] ? model : 'soft';

  if (isPlayerTurn) {
    return getWinValue(safeP, safeC, activeModel);
  } else {
    return 1 - getWinValue(safeC, safeP, activeModel);
  }
}

/**
 * Compute positional volatility std_dev(EV) across all possible moves at state (n, m)
 */
export function getPositionalVolatility(n, m, model = 'soft') {
  const evs = getEvBreakdown(n, m, model).map((r) => r.ev);
  if (evs.length <= 1) return 0.05;
  const mean = evs.reduce((a, b) => a + b, 0) / evs.length;
  const variance = evs.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / evs.length;
  return Math.max(0.01, Math.sqrt(variance));
}

/**
 * Modern CAPS2 Move Accuracy Curve
 * Accuracy = 103.17 * exp(-0.0435 * (deltaW * 100)) - 3.17, clamped to [0, 100]
 */
export function calculateCaps2Accuracy(decisionError) {
  const deltaPct = Math.max(0, (decisionError || 0) * 100);
  const rawAcc = 103.17 * Math.exp(-0.0435 * deltaPct) - 3.17;
  return Math.max(0, Math.min(100, rawAcc));
}

/**
 * Evaluate move decision quality & equity swing using Chess.com CAPS2 blueprint
 */
export function evaluateMoveQuality({
  nBefore,
  mBefore,
  isPlayerMove,
  isGuess,
  b,
  preWin,
  postWin,
  model = 'soft',
  elo = 1500,
  prevMoveWasOpponentBlunder = false,
}) {
  const safeNBefore = Math.max(1, Math.min(MAX_POOL_SIZE, nBefore || 1));
  const safeMBefore = Math.max(1, Math.min(MAX_POOL_SIZE, mBefore || 1));
  const activeModel = memo[model] ? model : 'soft';

  const actorN = isPlayerMove ? safeNBefore : safeMBefore;
  const actorM = isPlayerMove ? safeMBefore : safeNBefore;

  const evBreakdown = getEvBreakdown(actorN, actorM, activeModel);
  const optimalValForActor = evBreakdown[0]?.ev ?? getWinValue(actorN, actorM, activeModel);

  // Compute EV of actual action taken
  let actualEVForActor = 0;
  if (isGuess) {
    if (activeModel === 'soft') {
      const winNow = 1 / actorN;
      const surviveLater = ((actorN - 1) / actorN) * (1 - getWinValue(actorM, actorN - 1, 'soft'));
      actualEVForActor = winNow + surviveLater;
    } else if (activeModel === 'hard') {
      actualEVForActor = 1 / actorN;
    }
  } else {
    const qSize = b;
    if (qSize && qSize > 0 && qSize < actorN) {
      const pYes = qSize / actorN;
      const valYes = 1 - getWinValue(actorM, qSize, activeModel);
      const valNo = 1 - getWinValue(actorM, actorN - qSize, activeModel);
      actualEVForActor = pYes * valYes + (1 - pYes) * valNo;
    }
  }

  const decisionError = Math.max(0, optimalValForActor - actualEVForActor);
  const equitySwing = (postWin || 0) - (preWin || 0);

  // ELO Rating Scaling Factor
  const safeElo = Math.min(2500, Math.max(800, elo || 1500));
  const eloScale = 1 + (2000 - safeElo) / 3000;
  const effectiveError = decisionError / eloScale;

  const moveAccuracy = calculateCaps2Accuracy(decisionError);

  // Thresholds adjusted for ELO rating scaling
  const BEST_EPS = 0.005 * eloScale;
  const GOOD_EPS = 0.040 * eloScale;
  const INACCURACY_EPS = 0.100 * eloScale;
  const MISTAKE_EPS = 0.200 * eloScale;

  let category = 'good';
  let label = 'Good move';
  let icon = '✓';

  // --- SPECIAL CONTEXTUAL CLASSIFICATIONS ---

  // 1. 📖 Book Move: Standard theoretical opening split at initial pool state (20,20)
  if (actorN === 20 && actorM === 20 && !isGuess && (b === 8 || b === 10)) {
    category = 'book';
    label = 'Book move';
    icon = '📖';
  }
  // 2. ‼ Brilliant: Trailing or high-uncertainty position with turnaround win swing & low EV loss
  else if (isPlayerMove && (preWin || 0) <= 0.35 && (postWin || 0) >= 0.60 && effectiveError < 0.01) {
    category = 'brilliant';
    label = 'Brilliant move';
    icon = '‼';
  }
  // 3. ★ Great Move: Single winning path (second best move is a mistake/blunder >= 0.10 EV drop)
  else if (
    effectiveError < BEST_EPS &&
    evBreakdown.length > 1 &&
    (evBreakdown[1].diffFromOptimal || 0) >= 0.10
  ) {
    category = 'great';
    label = 'Great move';
    icon = '★';
  }
  // 4. !! Best Move: Bellman optimal
  else if (effectiveError < BEST_EPS) {
    category = 'best';
    label = 'Best move';
    icon = '!!';
  }
  // 5. ❌ Miss: Opponent blundered on previous turn, but actor failed to punish with optimal push
  else if (prevMoveWasOpponentBlunder && effectiveError >= GOOD_EPS) {
    category = 'miss';
    label = 'Miss';
    icon = '❌';
  }
  // 6. ✓ Good Move
  else if (effectiveError < GOOD_EPS) {
    category = 'good';
    label = 'Good move';
    icon = '✓';
  }
  // 7. ⚠️ Inaccuracy
  else if (effectiveError < INACCURACY_EPS) {
    category = 'inaccuracy';
    label = 'Inaccuracy';
    icon = '⚠️';
  }
  // 8. ? Mistake
  else if (effectiveError < MISTAKE_EPS) {
    category = 'mistake';
    label = 'Mistake';
    icon = '?';
  }
  // 9. ?? Blunder
  else {
    category = 'blunder';
    label = 'Blunder';
    icon = '??';
  }

  const startPct = ((preWin || 0) * 100).toFixed(1);
  const endPct = ((postWin || 0) * 100).toFixed(1);
  const diffSign = equitySwing >= 0 ? '+' : '';
  const diffPct = (equitySwing * 100).toFixed(1);

  let description = `Win prob: ${startPct}% → ${endPct}% (${diffSign}${diffPct}%)`;

  if (category === 'book') {
    description = `Theoretical opening split (b* = ${b}) at (20,20)`;
  } else if (category === 'great') {
    description = `The ONLY move that preserves your advantage! Second best lost ${(evBreakdown[1].diffFromOptimal * 100).toFixed(1)}% EV`;
  } else if (category === 'brilliant') {
    description = `Clutch turnaround play! Win prob jumped from ${startPct}% to ${endPct}%`;
  } else if (category === 'miss') {
    description = `Missed chance to punish opponent blunder! Lost ${(decisionError * 100).toFixed(1)}% EV`;
  } else if (category === 'blunder') {
    description = `Critical error lost ${(decisionError * 100).toFixed(1)}% EV (Win prob: ${startPct}% → ${endPct}%)`;
  } else if (category === 'best' && equitySwing < -0.01) {
    description = `Optimal DP bid (b*), unlucky variance: ${startPct}% → ${endPct}%`;
  }

  if (!isPlayerMove) {
    if (category === 'blunder' && equitySwing > 0) {
      description = `Engine blunder: player win chance jumped ${diffSign}${diffPct}%`;
    } else if (category === 'best' && equitySwing < 0) {
      description = `Optimal engine play: player win chance dropped to ${endPct}%`;
    }
  }

  return {
    category,
    label,
    icon,
    description,
    decisionError,
    equitySwing,
    moveAccuracy: parseFloat(moveAccuracy.toFixed(1)),
    optimalEV: optimalValForActor,
    actualEV: actualEVForActor,
  };
}

/**
 * Calculate Chess.com CAPS2 Volatility-Weighted Harmonic Mean Match Accuracy (0 - 100%)
 */
export function calculateGameAccuracy(moveHistory, actor = 'player', model = 'soft') {
  const actorMoves = (moveHistory || []).filter((m) => m.actor === actor);
  if (actorMoves.length === 0) return '100.0';

  let weightedSum = 0;
  let weightSum = 0;
  let harmonicInverseSum = 0;

  actorMoves.forEach((m) => {
    const acc = Math.max(1, m.moveAccuracy ?? calculateCaps2Accuracy(m.decisionError));
    const volatility = getPositionalVolatility(m.nBefore || 20, m.mBefore || 20, model);

    weightedSum += volatility * acc;
    weightSum += volatility;
    harmonicInverseSum += 1 / acc;
  });

  const weightedMean = weightSum > 0 ? weightedSum / weightSum : 100;
  const harmonicMean = actorMoves.length / (harmonicInverseSum || 0.01);

  // Combined CAPS2 Harmonic-Volatility Mean
  const finalAccuracy = 0.5 * (weightedMean + harmonicMean);
  return Math.max(0, Math.min(100, finalAccuracy)).toFixed(1);
}
