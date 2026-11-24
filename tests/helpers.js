import { createGame, computeAdjacency } from '../src/game.js';

// Small seeded generator (mulberry32) so random boards are repeatable.
export function seeded(seed) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * A game in progress with a fixed layout, drawn as strings: `*` is a mine,
 * anything else is safe. Example: fixedBoard(['*..', '...', '..*']).
 */
export function fixedBoard(rowsOfText) {
  const game = createGame('beginner');
  game.rows = rowsOfText.length;
  game.cols = rowsOfText[0].length;
  game.cells = rowsOfText.join('').split('').map((ch) => ({
    mine: ch === '*',
    adjacent: 0,
    revealed: false,
    flagged: false,
  }));
  game.mineCount = game.cells.filter((c) => c.mine).length;
  game.minesPlaced = true;
  game.status = 'playing';
  return computeAdjacency(game);
}

/** The board drawn back as strings: `#` hidden, `F` flagged, `*` revealed mine, digits or `.` for open cells. */
export function draw(game) {
  const lines = [];
  for (let r = 0; r < game.rows; r++) {
    let line = '';
    for (let c = 0; c < game.cols; c++) {
      const cell = game.cells[r * game.cols + c];
      if (cell.flagged) line += 'F';
      else if (!cell.revealed) line += '#';
      else if (cell.mine) line += '*';
      else line += cell.adjacent === 0 ? '.' : String(cell.adjacent);
    }
    lines.push(line);
  }
  return lines;
}
