import { PRESETS, createGame, cellAt, reveal } from './game.js';

const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');
const difficultyEl = document.getElementById('difficulty');
const newGameEl = document.getElementById('new-game');

let game;

for (const [key, preset] of Object.entries(PRESETS)) {
  const option = document.createElement('option');
  option.value = key;
  option.textContent = `${preset.label} · ${preset.cols}×${preset.rows} · ${preset.mines} mines`;
  difficultyEl.append(option);
}

function newGame() {
  game = createGame(difficultyEl.value);
  buildBoard();
  render();
}

function buildBoard() {
  boardEl.style.setProperty('--cols', game.cols);
  boardEl.replaceChildren();
  for (let r = 0; r < game.rows; r++) {
    const row = document.createElement('div');
    row.className = 'row';
    row.setAttribute('role', 'row');
    for (let c = 0; c < game.cols; c++) {
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'cell';
      cell.dataset.row = r;
      cell.dataset.col = c;
      cell.setAttribute('role', 'gridcell');
      row.append(cell);
    }
    boardEl.append(row);
  }
}

function describe(cell) {
  if (!cell.revealed) return 'hidden';
  if (cell.mine) return 'mine';
  if (cell.adjacent === 0) return 'empty';
  return `${cell.adjacent} ${cell.adjacent === 1 ? 'mine' : 'mines'} nearby`;
}

function render() {
  for (const el of boardEl.querySelectorAll('.cell')) {
    const r = Number(el.dataset.row);
    const c = Number(el.dataset.col);
    const cell = cellAt(game, r, c);
    el.classList.toggle('open', cell.revealed);
    el.classList.toggle('mine', cell.revealed && cell.mine);
    el.dataset.n = cell.revealed && !cell.mine && cell.adjacent > 0 ? cell.adjacent : '';
    el.textContent = el.dataset.n;
    el.setAttribute('aria-label', `Row ${r + 1}, column ${c + 1}, ${describe(cell)}`);
  }
  statusEl.textContent = game.minesPlaced
    ? `${game.mineCount} mines.`
    : `${game.mineCount} mines. Click any cell to start; the first click is always safe.`;
}

boardEl.addEventListener('click', (event) => {
  const el = event.target.closest('.cell');
  if (!el) return;
  reveal(game, Number(el.dataset.row), Number(el.dataset.col));
  render();
});

difficultyEl.addEventListener('change', newGame);
newGameEl.addEventListener('click', newGame);

newGame();
