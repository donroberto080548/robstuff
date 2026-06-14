# Psych! v2.2

This is the beautified public-facing build of Psych!, based on the stable v2.1 baseline.

## What changed in v2.2

- Revised Psych! logo integrated.
- Real playing-card PNG assets are used for the human hand, the up-card deck, and AI reveal/review states.
- Dark green felt-style background and more polished presentation.
- Layout is constrained so the board does not balloon awkwardly on large screens.
- Setup confirmation workflow retained.
- Developer controls are hidden from the normal presentation.
- If AI played bids are hidden during the game, the round result and scoreboard no longer reveal them prematurely.

## Gameplay features retained

- RobAI — Classic
- ArthurAI — Strategic
- ArthurAI Memory: Perfect / Faulty
- Show or hide AI played bids during the game
- End-of-game and end-of-match review
- How to Play overlay
- About Psych! overlay

## Provenance

Psych! began as Jujitsu, a two-player card game described by Jim Fixx in *Games for the Super Intelligent*. Rob Landeros adapted Jujitsu into a Commodore 64 BASIC program, with an accompanying article and source-code listing published in COMPUTE!'s Gazette, September 1986, Issue 39, Vol. 4, No. 9. The game was renamed Psych! when revisited in recent years.


## v2.2.1 fit adjustment

This build treats the interface as a 1920×1080 design canvas and scales the entire board to fit the browser viewport. That keeps the composition visible instead of allowing individual panels and cards to expand vertically beyond the screen.


## v2.2.2 polish

- Added richer felt background image (vignette version).
- Colored suit symbols in scoreboard/result text: hearts red; spades and clubs white for readability on dark green.
- Increased container stroke weight by 1 pixel with a subtle brownish-gray tone.
