# Minesweeper

A fast, fair Minesweeper in the browser, with no install or account. Plain HTML, CSS, and JavaScript, no build step, and zero dependencies.

Live URL: not deployed yet.

## What it does today

- Three difficulty presets: Beginner 9×9 with 10 mines, Intermediate 16×16 with 40, and Expert 30×16 with 99.
- Mines are placed on the first click, never on that cell or its neighbours, so the first click always opens an area.
- New game and the difficulty picker reset the board. On narrow screens, wide boards scroll inside their own box.

Not yet: revealing cells, flags, win and loss, the counter, and the timer ([issues #2–#5](https://github.com/cat1060/minesweeper/issues)).

## Run it locally

ES modules need a web server, not `file://`. From the repo root:

```bash
python3 -m http.server 4173
```

Then open http://localhost:4173.

## Run the tests

```bash
npm test
```

This uses Node's built-in test runner (Node 20 or later); there is nothing to install.

## Project files

- `DEFINE.md`: the one-page definition. `CLAUDE.md`: the rules Claude Code works to. `LIFECYCLE.md`: the stages and gates. `LOG.md`: the session log.
- `src/game.js`: game logic, no DOM. `src/ui.js`: rendering and input. `src/styles.css`: the look. `tests/`: one file per feature.

## Known limitations

- Not yet playable: only board generation is built.

Written with Claude Code.
