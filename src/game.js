// Pure game logic. No DOM access, so everything here runs under `node --test`.

export const PRESETS = Object.freeze({
  beginner: Object.freeze({ label: 'Beginner', rows: 9, cols: 9, mines: 10 }),
  intermediate: Object.freeze({ label: 'Intermediate', rows: 16, cols: 16, mines: 40 }),
  expert: Object.freeze({ label: 'Expert', rows: 16, cols: 30, mines: 99 }),
});

/** A new, empty game. Mines are placed later, on the first click. */
export function createGame(difficulty = 'beginner') {
  const preset = PRESETS[difficulty];
  if (!preset) throw new Error(`Unknown difficulty: ${difficulty}`);
  const { rows, cols, mines } = preset;
  return {
    difficulty,
    rows,
    cols,
    mineCount: mines,
    minesPlaced: false,
    status: 'ready', // ready | playing | won | lost
    startedAt: null,
    endedAt: null,
    cells: Array.from({ length: rows * cols }, () => ({
      mine: false,
      adjacent: 0,
      revealed: false,
      flagged: false,
    })),
  };
}

export function inBounds(game, row, col) {
  return row >= 0 && row < game.rows && col >= 0 && col < game.cols;
}

export function cellAt(game, row, col) {
  if (!inBounds(game, row, col)) throw new RangeError(`Cell (${row}, ${col}) is off the board`);
  return game.cells[row * game.cols + col];
}

/** The up-to-eight [row, col] pairs around a cell that are on the board. */
export function neighbours(game, row, col) {
  const result = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const r = row + dr;
      const c = col + dc;
      if (inBounds(game, r, c)) result.push([r, c]);
    }
  }
  return result;
}

/**
 * Place mines uniformly at random, never on the first-clicked cell or its
 * neighbours, so the first click always opens an area. If the board is too
 * small for that, only the clicked cell itself is kept safe.
 * `random` returns a number in [0, 1), like Math.random; tests pass a seeded one.
 */
export function placeMines(game, safeRow, safeCol, random = Math.random) {
  if (game.minesPlaced) throw new Error('Mines are already placed');
  cellAt(game, safeRow, safeCol); // validates the position

  const index = (r, c) => r * game.cols + c;
  const safeZone = new Set([index(safeRow, safeCol)]);
  for (const [r, c] of neighbours(game, safeRow, safeCol)) safeZone.add(index(r, c));

  let candidates = game.cells.map((_, i) => i).filter((i) => !safeZone.has(i));
  if (candidates.length < game.mineCount) {
    candidates = game.cells.map((_, i) => i).filter((i) => i !== index(safeRow, safeCol));
  }
  if (candidates.length < game.mineCount) throw new Error('Too many mines for this board');

  // Partial Fisher–Yates: the first mineCount entries become a uniform random sample.
  for (let i = 0; i < game.mineCount; i++) {
    const j = i + Math.floor(random() * (candidates.length - i));
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
    game.cells[candidates[i]].mine = true;
  }

  for (let r = 0; r < game.rows; r++) {
    for (let c = 0; c < game.cols; c++) {
      cellAt(game, r, c).adjacent = neighbours(game, r, c).filter(([nr, nc]) => cellAt(game, nr, nc).mine).length;
    }
  }

  game.minesPlaced = true;
  game.status = 'playing';
  return game;
}
