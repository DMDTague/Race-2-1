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
 * Evaluate move decision quality & equity swing
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
}) {
  const safeNBefore = Math.max(1, Math.min(MAX_POOL_SIZE, nBefore || 1));
  const safeMBefore = Math.max(1, Math.min(MAX_POOL_SIZE, mBefore || 1));
  const activeModel = memo[model] ? model : 'soft';

  const actorN = isPlayerMove ? safeNBefore : safeMBefore;
  const actorM = isPlayerMove ? safeMBefore : safeNBefore;

  const optimalValForActor = getWinValue(actorN, actorM, activeModel);

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

  // Thresholds
  const BEST_EPS = 0.005;
  const GREAT_EPS = 0.02;
  const GOOD_EPS = 0.05;
  const MISTAKE_EPS = 0.12;

  let category = 'good';
  let label = 'Good move';
  let icon = '✓';

  if (decisionError < BEST_EPS) {
    category = 'best';
    label = 'Best move';
    icon = '!!';
  } else if (decisionError < GREAT_EPS) {
    category = 'great';
    label = 'Great move';
    icon = '★';
  } else if (decisionError < GOOD_EPS) {
    category = 'good';
    label = 'Good move';
    icon = '✓';
  } else if (decisionError < MISTAKE_EPS) {
    category = 'mistake';
    label = 'Mistake';
    icon = '?';
  } else {
    category = 'blunder';
    label = 'Blunder';
    icon = '??';
  }

  // Brilliant play detection
  if (isPlayerMove && (preWin || 0) <= 0.30 && (postWin || 0) >= 0.70) {
    category = 'brilliant';
    label = 'Brilliant move';
    icon = '‼';
  }

  const startPct = ((preWin || 0) * 100).toFixed(0);
  const endPct = ((postWin || 0) * 100).toFixed(0);
  const diffSign = equitySwing >= 0 ? '+' : '';
  const diffPct = (equitySwing * 100).toFixed(0);

  let description = `Win prob: ${startPct}% → ${endPct}% (${diffSign}${diffPct}%)`;

  if (category === 'blunder' && equitySwing < -0.10) {
    description = `Lead squandered: ${startPct}% → ${endPct}%`;
  } else if (category === 'best' && equitySwing < -0.01) {
    description = `Optimal decision, unlucky variance: ${startPct}% → ${endPct}%`;
  } else if (category === 'best' && equitySwing > 0.10) {
    description = `Huge advantage gain: ${startPct}% → ${endPct}%`;
  } else if ((preWin || 0) < 0.30 && (postWin || 0) > 0.50) {
    description = `Clutch comeback: ${startPct}% → ${endPct}%`;
  }

  if (!isPlayerMove) {
    if (category === 'blunder' && equitySwing > 0) {
      description = `Engine blunder: your win chance jumped ${diffSign}${diffPct}%`;
    } else if (category === 'best' && equitySwing < 0) {
      description = `Optimal engine play: your win chance dropped to ${endPct}%`;
    }
  }

  return { category, label, icon, description, decisionError, equitySwing };
}
