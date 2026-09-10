# Site Changelog

Running log of changes to kuber.studio, maintained by Instinct's site-keeper agent.
Newest entries first.

## 2026-09-10

- **Facts:** corrected stale current-tense Perplexity fellowship metadata to former / Mar–Aug 2025, removed Perplexity from active organization membership in structured data, and changed the Razorpay accomplishment date from "Summer 2026" to "Jun 2026–Present" to match the resume.

## 2026-09-08

- **Brief experiment, fully reverted:** an "update ticker" status line shipped
  to the terminal top (b4698e3) under what was read as a creative grant for
  this site. The grant was actually for vertigo.kuber.studio, not this
  portfolio - reverted the same night (fc12f30). No ticker here.
- **Changelog repair:** the 2026-09-04 workflow-sed mistake below had silently
  replaced this file's content with deploy.yml YAML; three subsequent entries
  no-op'd on the corrupted file. File fully reconstructed in this commit.

## 2026-09-07

- **Blog bugfix (kuber.studio/blog, repo Kuberwastaken/blog):** an HN reader
  reported the blog freezing in Firefox on Linux (no text selection, no link
  clicks). Root cause: Quartz's graph view (PixiJS v8, WebGPU) sizes its
  texture batch from a WebGL probe (pixijs/pixijs#11389), exceeding WebGPU's
  max-sampled-textures-per-shader-stage (16) on limited devices; Firefox 153
  then wedges the tab compositor on the failed shader.
  First fix (4e6e474) capped the batch for all browsers plus an init retry -
  broke the MindMap on mobile Chrome (black canvas). Reverted (352356f) and
  re-shipped narrowed (109b0b2): the texture cap runs ONLY in Firefox - no
  init restructuring, no retry path, no graph-hiding. Chrome/Safari/mobile
  run byte-identical stock Pixi code.
  Main site checked: no Pixi/graph component, unaffected.

## 2026-09-04

- **Audit (stale-content sweep):** verified the rumored "Hong Kong timezone" in
  the about-me does not exist anywhere - not on main, gh-pages, any branch,
  the live site, profile.json/llms.txt/profile.md, the GitHub profile README,
  or the blog repo. Location correctly reads New Delhi, India. No fix needed.
- **Removed dead code:** deleted `src/constants/whoami.js` - unused since the
  whoami view moved to `WhoamiCard` + `profile.json`, and it carried stale
  claims ("Currently a Perplexity AI Business Fellow", pre-acquisition TREAT
  AI framing).
- **Infra:** added a GitHub Actions deploy workflow. Pushes to `main` now
  build and deploy to `gh-pages` automatically (previously manual
  `npm run deploy`). The build step runs with `CI=false` so pre-existing
  ESLint warnings do not fail the deploy, matching the old manual local-build
  behavior.
- Created this changelog.
