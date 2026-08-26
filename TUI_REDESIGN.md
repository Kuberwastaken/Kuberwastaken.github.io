# Kuber Studio TUI redesign

Reference direction: Claude Code session structure and prompt grammar from Brainless, with a custom Kuber palette and a `KM` dot-matrix glimmer inspired by the Grok header animation.

## Checklist

- [x] Establish a single responsive TUI token system and Geist Mono typography.
- [x] Replace the legacy banner, transcript, navigation, and input with a Claude-style session shell.
- [x] Rebuild the `KM / Kuber Mehta` header with an accessible reduced-motion glimmer.
- [x] Convert help, skills, games, miscellaneous tools, and system output into semantic terminal views.
- [x] Rebuild `/who` around the interactive ASCII depth portrait.
- [x] Replace project masonry/iframes with fast terminal project records.
- [x] Restyle résumé, calculator, QR, password, GitHub feed, Terms, and easter eggs.
- [x] Port Snake, Tetris, and Game of Life into the same visual system.
- [x] Remove 2048 and Flappy Bird from the bundle and command registry.
- [x] Replace the public skill inventory with the requested languages and technologies.
- [x] Verify keyboard behavior, reduced motion, desktop, small mobile, build output, and deep links.
- [ ] Push sequential commits and deploy the final build to `kuber.studio`.

## Verification

- Production build compiles without React or ESLint warnings.
- All 16 internal views pass deep-link rendering checks; removed game routes return command-not-found output.
- Real device emulation passes at 390px and 320px with no horizontal overflow.
- Mobile portrait is static, project cards collapse to one column, and the composer remains viewport-pinned.
- Keyboard submit/history, reduced motion, JSON-LD, generated metadata, and the GitHub Pages `/tos` restoration path pass.
