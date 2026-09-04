# Site Changelog

Running log of changes to kuber.studio, maintained by Instinct's site-keeper agent.
Newest entries first.

## 2026-09-04

- **Audit (stale-content sweep):** verified the rumored "Hong Kong timezone" in the
  about-me does not exist anywhere - not on main, gh-pages, any branch, the live
  site, profile.json/llms.txt/profile.md, the GitHub profile README, or the blog
  repo. Location correctly reads New Delhi, India. No fix needed.
- **Removed dead code:** deleted `src/constants/whoami.js` - unused since the
  whoami view moved to `WhoamiCard` + `profile.json`, and it carried stale claims
  ("Currently a Perplexity AI Business Fellow", pre-acquisition TREAT AI framing).
- **Infra:** added a GitHub Actions deploy workflow. Pushes to `main` now build
  and deploy to `gh-pages` automatically (previously manual `npm run deploy`).
- Created this changelog.
