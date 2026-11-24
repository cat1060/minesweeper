import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createGame, cellAt, reveal } from '../src/game.js';
import { draw, fixedBoard, seeded } from './helpers.js';

// Adjacency for this layout:
//   * 1 . . .
//   1 1 . . .
//   . . . 1 1
//   . . . 1 *
const LAYOUT = ['*....', '.....', '.....', '....*'];

test('revealing a numbered cell opens only that cell', () => {
  const game = fixedBoard(LAYOUT);
  assert.deepEqual(reveal(game, 1, 1), [[1, 1]]);
  assert.deepEqual(draw(game), ['#####', '#1###', '#####', '#####']);
});

test('revealing a zero flood-fills up to the numbered border', () => {
  const game = fixedBoard(LAYOUT);
  const opened = reveal(game, 0, 4);
  assert.deepEqual(opened[0], [0, 4], 'the clicked cell opens first');
  assert.equal(opened.length, 18, 'every safe cell opens');
  // Opening every safe cell also wins, which flags the mines.
  assert.deepEqual(draw(game), ['F1...', '11...', '...11', '...1F']);
});

test('the flood fill stops at numbers and does not cross them', () => {
  // A wall of mines splits the board; the right side must stay hidden.
  const game = fixedBoard(['..*..', '..*..', '..*..']);
  reveal(game, 1, 0);
  assert.deepEqual(draw(game), ['.2###', '.3###', '.2###']);
});

test('flagged cells are never revealed, by a click or by the flood fill', () => {
  const game = fixedBoard(LAYOUT);
  cellAt(game, 0, 3).flagged = true;
  assert.deepEqual(reveal(game, 0, 3), [], 'clicking a flag does nothing');
  assert.equal(cellAt(game, 0, 3).revealed, false);

  reveal(game, 2, 2);
  assert.deepEqual(draw(game), ['#1.F.', '11...', '...11', '...1#']);
});

test('revealing an open cell again does nothing', () => {
  const game = fixedBoard(LAYOUT);
  reveal(game, 1, 1);
  assert.deepEqual(reveal(game, 1, 1), []);
});

test('revealing a mine returns just that mine and spreads no further', () => {
  const game = fixedBoard(LAYOUT);
  assert.deepEqual(reveal(game, 0, 0), [[0, 0]]);
  assert.deepEqual(draw(game), ['*####', '#####', '#####', '####*'], 'safe cells stay hidden; all mines show');
});

test('no moves once the game is over', () => {
  for (const status of ['won', 'lost']) {
    const game = fixedBoard(LAYOUT);
    game.status = status;
    assert.deepEqual(reveal(game, 0, 4), []);
    assert.ok(game.cells.every((c) => !c.revealed));
  }
});

test('the first reveal places mines, then opens an area with no mine in it', () => {
  for (let seed = 1; seed <= 30; seed++) {
    const game = createGame('expert');
    const opened = reveal(game, 8, 15, seeded(seed));
    assert.equal(game.minesPlaced, true);
    assert.equal(game.status, 'playing');
    assert.ok(opened.length >= 9, `seed ${seed} opened ${opened.length}`);
    assert.ok(opened.every(([r, c]) => !cellAt(game, r, c).mine));
    assert.equal(game.cells.filter((c) => c.revealed).length, opened.length);
  }
});

test('a fully empty Expert-sized board opens in one click', () => {
  const game = fixedBoard(Array.from({ length: 16 }, () => '.'.repeat(30)));
  assert.equal(reveal(game, 0, 0).length, 480);
  assert.ok(game.cells.every((c) => c.revealed));
});
