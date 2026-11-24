# Prototype Lifecycle Playbook — Minesweeper edition

A software development lifecycle for building a prototype with Claude Code, from definition to real users, adapted from the one-week playbook for this Minesweeper project. Read it with `CLAUDE.md` at the start of every session: "Read LIFECYCLE.md and CLAUDE.md, then tell me which stage we are in."

Two roles. You are the product owner: you decide what gets built, test it by hand, and talk to users. Claude Code is the engineering team: it writes the code, the tests, and the documentation, one feature at a time.

## This project's schedule (compressed)

Minesweeper is a small, well-understood game with no backend, so the week compresses to a first day plus a few short follow-ups. The gates do not change; only the clock does.

| Stage | When | Minesweeper gate |
| --- | --- | --- |
| 1. Define | Day 1, first 30 min | `DEFINE.md` and `CLAUDE.md` in the repo, repo on GitHub, issues #1–#8 filed and labelled |
| 2. Walking skeleton | Day 1, next 2–3 h | Must-haves #1–#5 closed; a Beginner game can be won and lost; `npm test` green |
| 3. Deploy | Day 1, right after | Live Vercel URL; one other person finished a game on their phone |
| 4. Release and recruit | Day 2 | 3–5 players have the link and a feedback form; Vercel Web Analytics on |
| 5. Iterate | Days 3–4 | Top three `feedback` issues closed and deployed; games-finished rate compared before and after |
| 6. Security and polish | Day 4 | Review done; leftovers open as `known-limitation` |
| 7. Document and submit | Day 5 | README, CLAUDE.md, LOG.md, DEFINE.md, and the issue list current |

The riskiest thing is touch input on phones (see `DEFINE.md`), so the first time the board renders, try it on a real phone before building more.

## Stage 1: Define

The one-page definition is in `DEFINE.md`: the user, the journey, features in priority order with the must-have line, success measures, the biggest risk and its fallback, and what is out of scope. `CLAUDE.md` turns it into the contract Claude works to.

Then create the GitHub repo and file one issue per feature with the `gh` CLI, labelled `must-have` or `nice-to-have`, numbered in priority order. The issue list is now the backlog: every feature, bug, and piece of feedback lives there, and a feature is done when its issue is closed.

## Stage 2: Build the walking skeleton

Build the thinnest version of the whole journey end to end before perfecting any one step. Every feature goes through the same loop:

1. **Pick the next open issue** in priority order and prompt for that one feature: "Read issue #2 and build it." Never "build the whole app".
2. **Test.** Claude writes tests for the feature in `tests/`, runs `npm test`, and shows you the result. Watch it run.
3. **Try it yourself** against the journey checklist in `CLAUDE.md`, including a phone-width window.
4. **Commit** with a message naming the feature and `Closes #2`, so the issue closes when the commit lands on main. README.md is updated in the same commit.
5. **Log** one entry in `LOG.md`: what you asked, what happened, and what you would change. Anything noticed but not fixed becomes a new issue.

First prompt of the build, always: "Read CLAUDE.md and summarize the plan back to me; don't write code yet. Which must-have would you build first and why?"

When something breaks: if Claude cannot fix it in two tries, split the feature in half or `git checkout` back to the last working commit. Never stack a new feature on a broken one.

Gate: the whole journey works end to end, every must-have has tests, and the suite is green.

## Stage 3: Deploy early

Deploying early matters more than deploying complete. Once the repo is connected to Vercel, every push to main ships automatically.

1. Ask Claude: "Make this deploy-ready for Vercel: confirm there is no secret in the repo, no missing build step, and that any key is read from an environment variable." For this app the answer should be: static files, no build, no keys.
2. Connect the GitHub repo to Vercel (hobby plan) and get a public URL.
3. If a key is ever needed, put it into Vercel's environment variables yourself. Never paste a key into a chat with Claude or into a file.
4. Hand the URL to one friend and watch them play a game on their phone, without helping. Fix only what blocks the journey.

Gate: a public URL, and one person outside the project has finished a game on it.

## Stage 4: Release to real users

Recruit 3–5 players who are not you and not your partner. Give each of them the URL and two ways to answer: a short written form and a place to leave a voice note. Ask only three questions:

1. What were you trying to do?
2. What got in the way?
3. What would you change?

Every answer becomes a GitHub issue labelled `feedback`, one issue per problem, quoting the player anonymously. Duplicates get a comment on the existing issue, not a new one; the count of comments is your vote tally.

Turn on Vercel Web Analytics and Observability before the first player arrives. For a single-page game, page views alone say little, so track two custom events: `game_started` and `game_finished` (with `result: won | lost` and `difficulty`). Tell players they are being observed and keep their answers anonymous when you quote them.

Gate: 3–5 players have the link, feedback is arriving, and you can see the first events in analytics.

## Stage 5: Iterate on feedback

You decide what gets built; Claude ranks and estimates. Prompt it with the issue list, not your memory of it:

"Read every open issue labelled feedback. Group them by theme, rank them by how many players hit each one, and for the top three propose the smallest change that addresses it, with an estimate in hours. Don't build anything yet."

Pick the top three, label them `next`, and run the Stage 2 loop on each. Close feedback issues with the commit that fixes them. `nice-to-have` issues move down when feedback outranks them.

After each deploy, compare the ratio of `game_finished` to `game_started` with the Stage 4 numbers, and write the before and after in `LOG.md`.

Gate: the three `next` issues are closed and deployed, and the comparison is in the log.

## Stage 6: Security review and polish

Ask Claude to review its own work: "Review this repo for security: secrets or keys in any commit, user input that is not validated, anything that stores or sends user data, and every dependency you added with why it is needed. Open one GitHub issue per finding, labelled `security`, with a severity and a suggested fix."

Fix the cheap ones through the normal loop. Relabel the rest `known-limitation` and leave them open; an honest list of what is not fixed is part of the deliverable. Then play a full game in a fresh browser with the console open and fix anything that errors.

Gate: no open `security` issue without a decision, and a full game runs clean.

## Stage 7: Document and submit

Every project ends with the same set of files, all kept current by the loop rather than written at the end:

- `README.md`: what the app is, the live URL, how to run it, and how to run the tests.
- `CLAUDE.md`: the contract, as it stood at the end.
- `LOG.md`: the dated session log, with the analytics numbers and a short "what I learned" section at the bottom.
- `DEFINE.md`: the one-page definition.
- The GitHub issue list: closed issues are what shipped, open ones are what is still broken or deferred.

Submit the repo link and the live URL. A reader should be able to reconstruct the whole project from the commit history and the issues alone.

## Considerations most prototypes skip

Take a stance on each, even if the answer is "not this week". Write it as one line in `README.md` under "Known limitations", or open an issue labelled `later`. Minesweeper's likely stance is noted after each.

- [ ] **Accessibility:** keyboard navigation, contrast, screen-reader labels on controls. *Cells need `aria-label`s; keyboard play is feature 8; numbers must not rely on colour alone.*
- [ ] **Internationalization and localization:** *English only; the game itself is mostly numbers.*
- [ ] **Privacy and consent:** *No personal data; best times stay in the player's own browser; analytics are anonymous.*
- [ ] **Data and API licensing:** *None used.*
- [ ] **Cost:** *Static hosting on the hobby plan; no paid calls.*
- [ ] **Secrets management:** *No keys needed.*
- [ ] **Supply chain:** *Zero runtime and dev dependencies.*
- [ ] **Error handling:** *localStorage may be unavailable (private mode); the game must still work.*
- [ ] **Mobile and low bandwidth:** *Tiny page; Expert board width on phones is the real issue.*
- [ ] **Content and moderation:** *No user posts.*
- [ ] **Bias and fairness:** *No AI content; mine placement must be uniformly random apart from the first-click area.*
- [ ] **Security testing:** *Claude's review is not a penetration test; say so.*
- [ ] **Backups and data loss:** *Only local best times; losing them is acceptable.*
- [ ] **Handoff and sustainability:** *No build step, so it should still run in three months.*
- [ ] **Authorship and IP:** *Generic game mechanics, original look; say the code was written with Claude Code.*

## Rules of thumb

- Working code at a public URL early beats a beautiful plan with nothing deployed.
- One issue per prompt. "Build the whole app" prompts produce tangled code nobody can test.
- Tests are your protection against Claude quietly breaking yesterday's work. Watch it run the suite before every commit.
- If the backlog is not in GitHub Issues, it does not exist.
- Keys go in the host's environment variables: never in files, never in chat.
- It is fine to fail, as long as the log and the issues show what you tried and what you learned.
