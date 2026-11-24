import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createGame, elapsedSeconds, minesRemaining, reveal, toggleFlag } from '../src/game.js';
import { fixedBoard, seeded } from './helpers.js';

const T0 = 1_700_000_000_000;

test('mines remaining starts at the preset mine count', () => {
  assert.equal(minesRemaining(createGame('beginner')), 10);
  assert.equal(minesRemaining(createGame('intermediate')), 40);
  assert.equal(minesRemaining(createGame('expert')), 99);
});

test('each flag lowers the counter and removing it raises it again', () => {
  const game = createGame('beginner');
  toggleFlag(game, 0, 0);
  toggleFlag(game, 0, 1);
  assert.equal(minesRemaining(game), 8);
  toggleFlag(game, 0, 0);
  assert.equal(minesRemaining(game), 9);
});

test('the counter counts flags, right or wrong, and can go negative', () => {
  const game = fixedBoard(['*...', '....']); // one mine
  toggleFlag(game, 1, 1);
  toggleFlag(game, 1, 2);
  toggleFlag(game, 1, 3);
  assert.equal(minesRemaining(game), -2);
});

test('the counter reads zero after a win, because the mines are flagged', () => {
  const game = fixedBoard(['....', '....', '...*']);
  reveal(game, 0, 0);
  assert.equal(game.status, 'won');
  assert.equal(minesRemaining(game), 0);
});

test('the timer counts whole seconds while playing and freezes at a loss', () => {
  const game = createGame('beginner');
  reveal(game, 4, 4, seeded(11), T0);
  assert.equal(elapsedSeconds(game, T0 + 999), 0);
  assert.equal(elapsedSeconds(game, T0 + 1_000), 1);
  assert.equal(elapsedSeconds(game, T0 + 75_250), 75);

  const mine = game.cells.findIndex((cell) => cell.mine);
  reveal(game, Math.floor(mine / game.cols), mine % game.cols, Math.random, T0 + 8_000);
  assert.equal(game.status, 'lost');
  assert.equal(elapsedSeconds(game, T0 + 500_000), 8);
});

test('a new game resets the counter and the timer', () => {
  const old = createGame('beginner');
  toggleFlag(old, 0, 0);
  reveal(old, 4, 4, seeded(2), T0);
  const game = createGame('beginner');
  assert.equal(minesRemaining(game), 10);
  assert.equal(elapsedSeconds(game, T0 + 60_000), 0);
});
