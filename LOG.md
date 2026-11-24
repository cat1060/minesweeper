# Log

## 2026-11-24

**Stage 1, Define.** I customized the Prototype Lifecycle Playbook for Minesweeper: wrote `DEFINE.md`, `CLAUDE.md`, and `LIFECYCLE.md`, created the public repo `cat1060/minesweeper`, and filed issues #1–#8 with labels. What broke: pushing over SSH failed because there's no SSH key on this Mac, so the remote now uses HTTPS with the GitHub CLI's login.

**Stage 2, issue #1: board generation.** Asked: "Build #1." Built `src/game.js` (presets, `createGame`, `neighbours`, and `placeMines` with a safe first-click area and an injectable random function), a page with the difficulty picker and board, and 10 tests, including a uniformity check over 4,000 boards. `npm test` passes 10 of 10. Checked by hand in the browser: there are no console errors, Expert renders 480 cells, and at 375px wide the Expert board scrolls inside its box while the page doesn't scroll sideways. Change next time: nothing yet. Next: #2 reveal and flood fill.
