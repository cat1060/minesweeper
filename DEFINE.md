# Minesweeper — one-page definition

**The user.** Someone with a few spare minutes, on a laptop or a phone, who wants a quick, fair game of Minesweeper in the browser with no install, no account, and no ads.

**The journey.** A first-time player opens the URL, picks a difficulty, clicks any cell (the first click is always safe), reveals and flags cells until every safe cell is open, and sees a "You won in N seconds" message, or hits a mine and sees the whole board revealed; either way, one click starts a new game.

**Features in priority order.**

Must have (the journey):
1. Board generation for three difficulty presets: Beginner 9×9 with 10 mines, Intermediate 16×16 with 40, and Expert 30×16 with 99. Mines are placed after the first click, so the first click is never a mine and always opens an area.
2. Reveal: clicking a cell shows its neighbour-mine count; a zero flood-fills its neighbours.
3. Flagging: right-click on desktop, long-press on touch, plus a visible flag-mode toggle as a fallback.
4. Win and loss: win when every safe cell is revealed; loss reveals all mines and marks wrong flags; a New game button restarts.
5. Status bar: mines remaining (mines minus flags) and a timer that starts on the first click and stops at the end.

---- line: nothing below gets built until everything above works ----

Nice to have:
6. Chording: clicking a revealed number whose flags are all placed opens its remaining neighbours.
7. Best time per difficulty, saved in localStorage.
8. Keyboard play: arrow keys to move, Space or Enter to reveal, F to flag.

**Definition of success.**
- Demo: a full Beginner game, won and lost, on the live URL on both a laptop and a phone, with no console errors.
- Real user: 3 of 5 testers finish a Beginner game (win or lose) without help, in under 5 minutes, on their own device.

**Biggest risk and fallback.** Touch input: long-press to flag can fight with the browser's own long-press menu and scrolling on Expert boards, which are wider than a phone. Test this on a real phone first. Fallback: the flag-mode toggle button, and on phones the Expert board scrolls horizontally inside its own container.

**Out of scope this week.**
- Accounts, online leaderboards, and any backend.
- Custom board sizes.
- No-guess board generation (boards that are always solvable by logic alone).
- Sound, animations beyond simple CSS, and themes.

The look is our own: a plain, modern grid with original colours and icons, not a copy of any existing Minesweeper's art.
