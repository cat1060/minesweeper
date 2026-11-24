import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createGame, cellAt, reveal, toggleFlag } from '../src/game.js';
import { draw, fixedBoard, seeded } from './helpers.js';

const LAYOUT = ['*....', '.....', '.....', '....*'];

test('toggleFlag puts a flag on a hidden cell and takes it off again', () => {
  const game = fixedBoard(LAYOUT);
  assert.equal(toggleFlag(game, 0, 0), true);
  assert.equal(cellAt(game, 0, 0).flagged, true);
  assert.equal(toggleFlag(game, 0, 0), true);
  assert.equal(cellAt(game, 0, 0).flagged, false);
});

test('a revealed cell cannot be flagged', () => {
  const game = fixedBoard(LAYOUT);
  reveal(game, 1, 1);
  assert.equal(toggleFlag(game, 1, 1), false);
  assert.equal(cellAt(game, 1, 1).flagged, false);
});

test('flags cannot change once the game is over', () => {
  for (const status of ['won', 'lost']) {
    const game = fixedBoard(LAYOUT);
    cellAt(game, 3, 4).flagged = true;
    game.status = status;
    assert.equal(toggleFlag(game, 0, 0), false);
    assert.equal(toggleFlag(game, 3, 4), false);
    assert.equal(cellAt(game, 0, 0).flagged, false);
    assert.equal(cellAt(game, 3, 4).flagged, true);
  }
});

test('removing a flag lets the cell be revealed', () => {
  const game = fixedBoard(LAYOUT);
  toggleFlag(game, 1, 1);
  assert.deepEqual(reveal(game, 1, 1), []);
  toggleFlag(game, 1, 1);
  assert.deepEqual(reveal(game, 1, 1), [[1, 1]]);
});

test('flags survive a flood fill around them', () => {
  const game = fixedBoard(LAYOUT);
  toggleFlag(game, 0, 0);
  toggleFlag(game, 3, 4);
  reveal(game, 0, 4);
  assert.deepEqual(draw(game), ['F1...', '11...', '...11', '...1F']);
});

test('flags can go down before the first click, and clicking one does not start the game', () => {
  const game = createGame('beginner');
  assert.equal(toggleFlag(game, 4, 4), true);
  assert.deepEqual(reveal(game, 4, 4, seeded(1)), []);
  assert.equal(game.minesPlaced, false, 'mines wait for a real first reveal');
  assert.equal(game.status, 'ready');

  // The real first click elsewhere is still safe.
  const opened = reveal(game, 0, 0, seeded(1));
  assert.ok(opened.length > 0);
  assert.equal(cellAt(game, 0, 0).mine, false);
  assert.equal(cellAt(game, 4, 4).flagged, true);
  assert.equal(cellAt(game, 4, 4).revealed, false);
});
