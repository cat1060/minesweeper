import { PRESETS, createGame, cellAt, reveal, toggleFlag } from './game.js';

const LONG_PRESS_MS = 400;
const MOVE_TOLERANCE_PX = 10;

const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');
const difficultyEl = document.getElementById('difficulty');
const newGameEl = document.getElementById('new-game');
const flagModeEl = document.getElementById('flag-mode');

let game;
let flagMode = false;

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
  if (cell.flagged) return 'flagged';
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
    el.classList.toggle('flagged', cell.flagged);
    el.dataset.n = cell.revealed && !cell.mine && cell.adjacent > 0 ? cell.adjacent : '';
    el.textContent = el.dataset.n;
    el.setAttribute('aria-label', `Row ${r + 1}, column ${c + 1}, ${describe(cell)}`);
  }
  statusEl.textContent = game.minesPlaced
    ? `${game.mineCount} mines.`
    : `${game.mineCount} mines. Click any cell to start; the first click is always safe.`;
}

function setFlagMode(on) {
  flagMode = on;
  flagModeEl.setAttribute('aria-pressed', String(on));
  boardEl.classList.toggle('flag-mode', on);
}

function position(el) {
  return [Number(el.dataset.row), Number(el.dataset.col)];
}

function flag(el) {
  if (toggleFlag(game, ...position(el))) render();
}

// --- Touch: long-press flags. Mouse uses right-click instead. ---
let press = null; // { el, x, y, timer, fired }
let lastPointerType = 'mouse';
let suppressClickOn = null;

function cancelPress() {
  if (press) clearTimeout(press.timer);
  press = null;
}

boardEl.addEventListener('pointerdown', (event) => {
  lastPointerType = event.pointerType;
  const el = event.target.closest('.cell');
  if (!el || event.pointerType === 'mouse') return;
  cancelPress();
  press = {
    el,
    x: event.clientX,
    y: event.clientY,
    timer: setTimeout(() => {
      flag(el);
      if (navigator.userActivation?.hasBeenActive) navigator.vibrate?.(15);
      suppressClickOn = el; // the finger lifting must not also reveal
      press = null;
    }, LONG_PRESS_MS),
  };
});

boardEl.addEventListener('pointermove', (event) => {
  if (press && Math.hypot(event.clientX - press.x, event.clientY - press.y) > MOVE_TOLERANCE_PX) cancelPress();
});
for (const type of ['pointerup', 'pointercancel', 'pointerleave']) boardEl.addEventListener(type, cancelPress);

boardEl.addEventListener('contextmenu', (event) => {
  const el = event.target.closest('.cell');
  if (!el) return;
  event.preventDefault();
  // Android fires contextmenu on a long-press; the timer above already handled it.
  if (lastPointerType === 'mouse') flag(el);
});

boardEl.addEventListener('click', (event) => {
  const el = event.target.closest('.cell');
  if (!el) return;
  if (suppressClickOn) {
    const suppressed = suppressClickOn === el;
    suppressClickOn = null;
    if (suppressed) return;
  }
  if (flagMode) flag(el);
  else {
    reveal(game, ...position(el));
    render();
  }
});

difficultyEl.addEventListener('change', newGame);
newGameEl.addEventListener('click', newGame);
flagModeEl.addEventListener('click', () => setFlagMode(!flagMode));

setFlagMode(false);
newGame();
