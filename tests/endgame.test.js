import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cellAt, createGame, elapsedSeconds, isWrongFlag, reveal, toggleFlag } from '../src/game.js';
import { draw, fixedBoard, seeded } from './helpers.js';

const LAYOUT = ['*....', '.....', '.....', '....*'];
const T0 = 1_700_000_000_000;

test('revealing a mine loses and shows every unflagged mine', () => {
  const game = fixedBoard(['*...*', '.....', '..*..']);
  toggleFlag(game, 0, 4); // a correct flag stays a flag
  toggleFlag(game, 1, 1); // a wrong flag
  reveal(game, 0, 0, Math.random, T0 + 5_000);

  assert.equal(game.status, 'lost');
  assert.deepEqual(game.exploded, [0, 0]);
  assert.deepEqual(draw(game), ['*###F', '#F###', '##*##']);
  assert.equal(isWrongFlag(game, cellAt(game, 1, 1)), true);
  assert.equal(isWrongFlag(game, cellAt(game, 0, 4)), false);
});

test('revealing the last safe cell wins and flags the mines', () => {
  const game = fixedBoard(LAYOUT);
  reveal(game, 0, 1, Math.random, T0);
  assert.equal(game.status, 'playing');
  reveal(game, 0, 4, Math.random, T0 + 12_400);
  assert.equal(game.status, 'won');
  assert.deepEqual(draw(game), ['F1...', '11...', '...11', '...1F']);
  assert.equal(game.exploded, null);
});

test('the game is not won while any safe cell is hidden, even if mines are all flagged', () => {
  const game = fixedBoard(LAYOUT);
  toggleFlag(game, 0, 0);
  toggleFlag(game, 3, 4);
  reveal(game, 1, 1);
  assert.equal(game.status, 'playing');
});

test('a win can come from a single click', () => {
  const game = fixedBoard(['....', '....', '...*']);
  reveal(game, 0, 0);
  assert.equal(game.status, 'won');
});

test('no reveals or flags after a win or a loss', () => {
  const lost = fixedBoard(LAYOUT);
  reveal(lost, 0, 0);
  assert.deepEqual(reveal(lost, 0, 4), []);
  assert.equal(toggleFlag(lost, 2, 2), false);
  assert.equal(cellAt(lost, 0, 4).revealed, false);

  const won = fixedBoard(['....', '....', '...*']);
  reveal(won, 0, 0);
  assert.equal(toggleFlag(won, 2, 3), false, 'the auto-flag stays');
});

test('the clock starts on the first reveal and stops at the end', () => {
  const game = createGame('beginner');
  assert.equal(elapsedSeconds(game, T0), 0, 'no clock before the first click');
  toggleFlag(game, 0, 0);
  assert.equal(game.startedAt, null, 'a flag does not start the clock');

  reveal(game, 4, 4, seeded(3), T0);
  assert.equal(game.startedAt, T0);
  assert.equal(elapsedSeconds(game, T0 + 2_999), 2);

  // Reveal every safe cell to win at T0 + 41.5 s.
  for (let r = 0; r < game.rows; r++) {
    for (let c = 0; c < game.cols; c++) {
      if (!cellAt(game, r, c).mine) {
        if (cellAt(game, r, c).flagged) toggleFlag(game, r, c);
        reveal(game, r, c, Math.random, T0 + 41_500);
      }
    }
  }
  assert.equal(game.status, 'won');
  assert.equal(game.endedAt, T0 + 41_500);
  assert.equal(elapsedSeconds(game, T0 + 99_000), 41, 'stopped at the win');
});

test('a new game starts clean', () => {
  const game = createGame('intermediate');
  assert.equal(game.status, 'ready');
  assert.equal(game.startedAt, null);
  assert.equal(game.endedAt, null);
  assert.equal(game.exploded, null);
});
