# Minesweeper

A fast, fair Minesweeper in the browser, with no install or account. Plain HTML, CSS, and JavaScript, no build step, and zero dependencies.

Live URL: not deployed yet.

## What it does today

- Three difficulty presets: Beginner 9×9 with 10 mines, Intermediate 16×16 with 40, and Expert 30×16 with 99.
- Mines are placed on the first click, never on that cell or its neighbours, so the first click always opens an area.
- Clicking a cell reveals it: a number shows how many of its eight neighbours are mines, and an empty cell opens its neighbours until numbers border the area.
- Flags: right-click on a computer, or long-press (about 0.4 s) on a phone, to place or remove a flag. **Flag mode** makes a plain tap or click flag instead of reveal, for touch screens where long-press is awkward. Flagged cells can't be revealed until the flag is removed.
- New game and the difficulty picker reset the board. On narrow screens, wide boards scroll inside their own box.
- Light and dark themes follow your system setting.

Not yet: win and loss, the counter, and the timer ([issues #4–#5](https://github.com/cat1060/minesweeper/issues)). Until #4, hitting a mine shows it but the game carries on.

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

- Not yet a full game: no win or loss.
- Long-press flagging is tested with simulated touch in a desktop browser, not yet on a real phone.

Written with Claude Code.
