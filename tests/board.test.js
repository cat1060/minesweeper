import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PRESETS, createGame, cellAt, neighbours, placeMines } from '../src/game.js';

// Small seeded generator (mulberry32) so boards are repeatable.
function seeded(seed) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const countMines = (game) => game.cells.filter((c) => c.mine).length;

test('presets match the definition', () => {
  assert.deepEqual(
    Object.fromEntries(Object.entries(PRESETS).map(([k, p]) => [k, [p.rows, p.cols, p.mines]])),
    { beginner: [9, 9, 10], intermediate: [16, 16, 40], expert: [16, 30, 99] },
  );
});

test('createGame builds an empty board of the right size', () => {
  for (const difficulty of Object.keys(PRESETS)) {
    const game = createGame(difficulty);
    const { rows, cols, mines } = PRESETS[difficulty];
    assert.equal(game.rows, rows);
    assert.equal(game.cols, cols);
    assert.equal(game.mineCount, mines);
    assert.equal(game.cells.length, rows * cols);
    assert.equal(game.status, 'ready');
    assert.equal(countMines(game), 0);
    assert.ok(game.cells.every((c) => !c.revealed && !c.flagged && c.adjacent === 0));
  }
});

test('createGame defaults to beginner and rejects unknown difficulties', () => {
  assert.equal(createGame().difficulty, 'beginner');
  assert.throws(() => createGame('impossible'), /Unknown difficulty/);
});

test('neighbours handles corners, edges, and the middle', () => {
  const game = createGame('beginner');
  assert.equal(neighbours(game, 0, 0).length, 3);
  assert.equal(neighbours(game, 0, 4).length, 5);
  assert.equal(neighbours(game, 4, 4).length, 8);
  assert.equal(neighbours(game, 8, 8).length, 3);
});

test('placeMines places exactly the preset number of mines', () => {
  for (const difficulty of Object.keys(PRESETS)) {
    for (let seed = 1; seed <= 20; seed++) {
      const game = placeMines(createGame(difficulty), 3, 3, seeded(seed));
      assert.equal(countMines(game), PRESETS[difficulty].mines, `${difficulty} seed ${seed}`);
      assert.equal(game.status, 'playing');
      assert.equal(game.minesPlaced, true);
    }
  }
});

test('the first click and its neighbours are never mines', () => {
  const clicks = [[0, 0], [4, 4], [8, 8], [0, 8], [8, 0], [0, 4]];
  for (const [r, c] of clicks) {
    for (let seed = 1; seed <= 50; seed++) {
      const game = placeMines(createGame('beginner'), r, c, seeded(seed));
      assert.equal(cellAt(game, r, c).mine, false);
      assert.equal(cellAt(game, r, c).adjacent, 0, 'first click opens an area');
      for (const [nr, nc] of neighbours(game, r, c)) assert.equal(cellAt(game, nr, nc).mine, false);
    }
  }
  // Expert is the densest preset; check it too.
  for (let seed = 1; seed <= 20; seed++) {
    const game = placeMines(createGame('expert'), 7, 15, seeded(seed));
    assert.equal(cellAt(game, 7, 15).adjacent, 0);
  }
});

test('adjacent counts match the mines around each cell', () => {
  const game = placeMines(createGame('intermediate'), 8, 8, seeded(42));
  for (let r = 0; r < game.rows; r++) {
    for (let c = 0; c < game.cols; c++) {
      const expected = neighbours(game, r, c).filter(([nr, nc]) => cellAt(game, nr, nc).mine).length;
      assert.equal(cellAt(game, r, c).adjacent, expected, `cell (${r}, ${c})`);
    }
  }
});

test('the same seed gives the same board; different seeds differ', () => {
  const layout = (seed) => placeMines(createGame('beginner'), 4, 4, seeded(seed)).cells.map((c) => +c.mine).join('');
  assert.equal(layout(7), layout(7));
  assert.notEqual(layout(7), layout(8));
});

test('placeMines cannot run twice or off the board', () => {
  const game = placeMines(createGame('beginner'), 0, 0, seeded(1));
  assert.throws(() => placeMines(game, 1, 1), /already placed/);
  assert.throws(() => placeMines(createGame('beginner'), 9, 0), RangeError);
});

test('mine placement is roughly uniform outside the safe zone', () => {
  const hits = new Array(81).fill(0);
  const random = seeded(2026);
  const runs = 4000;
  for (let i = 0; i < runs; i++) {
    placeMines(createGame('beginner'), 0, 0, random).cells.forEach((c, j) => { if (c.mine) hits[j]++; });
  }
  // 10 mines over 77 eligible cells: expected rate ≈ 0.13 per cell.
  const safe = new Set([0, 1, 9, 10]);
  for (let j = 0; j < 81; j++) {
    if (safe.has(j)) assert.equal(hits[j], 0);
    else assert.ok(Math.abs(hits[j] / runs - 10 / 77) < 0.03, `cell ${j} rate ${hits[j] / runs}`);
  }
});
