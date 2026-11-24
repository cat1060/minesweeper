# Minesweeper

A fast, fair, browser Minesweeper for anyone with a few spare minutes, on a laptop or a phone, with no install or account.

## The user journey (keep this working at all times)
Open the URL -> pick a difficulty -> click any cell (always safe) -> reveal and flag cells -> win ("You won in N seconds") or hit a mine (whole board revealed) -> New game.

## Features in priority order
Must have: (1) board generation for Beginner 9×9/10, Intermediate 16×16/40, Expert 30×16/99, mines placed after the first click; (2) reveal with flood fill on zeros; (3) flagging by right-click, long-press, and a flag-mode toggle; (4) win/loss detection, mine reveal, wrong-flag marks, New game; (5) mines-remaining counter and timer.
Nice to have: (6) chording; (7) best time per difficulty in localStorage; (8) keyboard play.
Build in this order. Do not start a nice-to-have until all must-haves pass the journey checklist.

## Tech stack and why
- Plain HTML, CSS, and JavaScript (ES modules), no framework and no build step. Hosted on Vercel as static files.
- Why: deploys to Vercel as static files with nothing to configure or break; the game needs no server.
- Data: none on a server. Best times (feature 7) go in localStorage under the key `minesweeper.best`.
- Tests: Node's built-in test runner (`node --test`), so there are zero dependencies. Run with `npm test`.

## File layout
- `index.html`  — the page: status bar, difficulty picker, board container
- `src/game.js`  — pure game logic (board, mines, reveal, flags, win/loss); no DOM access, so it is testable in Node
- `src/ui.js`  — renders the board and wires mouse, touch, and keyboard input to `game.js`
- `src/styles.css`  — layout and look
- `tests/`  — one test file per feature, e.g. `tests/reveal.test.js`
- `package.json`  — only the `test` script; no dependencies
- README.md, LOG.md, CLAUDE.md, LIFECYCLE.md, DEFINE.md

## Rules
- One GitHub issue per feature, one feature per task. Start by reading the issue, finish by committing with "Closes #<n>" in the message, then start the next.
- New bugs and feedback become issues, never fixes slipped into another feature's commit.
- Write tests for each feature and run the full suite before every commit. A failing suite blocks the commit.
- Never commit secrets, API keys, or .env files. Keys go in environment variables on the host. (This app should need none.)
- Update README.md after each feature so it always describes what the app does today.
- Append a short dated entry to LOG.md after each session: what was built, what broke, and what is next.
- Ask before adding any dependency or changing the file layout.
- If a fix fails twice, stop and say so instead of trying a third approach.

## Content and data rules
- `game.js` is the single source of truth for game state. A cell has: `mine` (bool), `adjacent` (0–8), `revealed` (bool), `flagged` (bool). The game has: `difficulty`, `rows`, `cols`, `mineCount`, `minesPlaced`, `status` (`ready` | `playing` | `won` | `lost`), `startedAt`, `endedAt` (ms timestamps, set on the first reveal and at the end), `exploded` (`[row, col]` of the losing mine, else null), and `cells` (row-major, index `row * cols + col`).
- Mine placement takes an injectable random function so tests can use fixed boards.
- The difficulty presets above are fixed; do not change them without asking.
- The look is original: our own colours and icons, not a copy of any existing Minesweeper's art, faces, or sounds.

## Definition of done for a feature
Tests written and passing, the full suite green, the manual journey checklist walked through, README.md updated, change committed with a one-line message naming the feature.

## Manual journey checklist (walk through before saying any feature is done)
- [ ] The page loads with no console errors and shows a Beginner board
- [ ] Switching difficulty resizes the board and resets the counter and timer
- [ ] The first click never hits a mine and opens an area
- [ ] Right-click (desktop), long-press (phone), and flag mode all place and remove flags
- [ ] Winning shows the time; losing reveals all mines and marks wrong flags
- [ ] New game starts a fresh board
- [ ] On a 375px-wide phone window, Beginner fits and Expert scrolls inside its container without scrolling the page
- [ ] Refreshing mid-game starts a new game cleanly (saving a game in progress is out of scope); best times survive a refresh once feature 7 exists
