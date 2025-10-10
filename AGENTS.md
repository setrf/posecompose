# Agents Guide

## Toolchains
- Bun 1.2+ is the primary runtime for install/dev/build/test.
- Node.js 18+ with npm is the fallback when Bun is unavailable.

## Core Commands
- Type-check & lint: `bunx tsc --noEmit && bun run lint`
- Auto-fix style/lint: `bun run lint -- --fix`
- Run full test suite: `bun test --run` (use `--watch` when appropriate)
- Run a single test file: `bun test --run src/path/to/file.test.ts`
- Start dev server: `bun run dev`
- Build for production: `bun run build` then `bun run preview`

All other scripts wrap these core tasks.

## Project Layout

```
├─ public/        → Static assets served as-is
├─ src/           → React + Vite frontend (components, pages, hooks)
├─ docs/          → Project plan, todo list, diagrams, specs
└─ server/        → (Placeholder) API proxy when backend is introduced
```

- Frontend code lives **only** in `src/`.
- Shared, environment-agnostic utilities belong in `src/lib/`.
- Future backend/proxy code should live under `server/` (documented in plan for Phase 2).

## Development Patterns & Constraints

- TypeScript strict mode, single quotes, trailing commas, no semicolons.
- 100-character line limit; tabs for indent (2-space YAML/JSON/MD).
- Prefer interfaces for public APIs; avoid `@ts-ignore`.
- Write or update tests first when fixing logic bugs.
- Use visual diff loop (Storybook/screenshot) for UI tweaks when available.
- Do not introduce new runtime dependencies without explaining the need in the PR description.
- Limit individual files to 500 lines—split into modules when larger.

### Python considerations
- Supplementary scripts may use Python 3.12 with `uv` as the package manager.
- Document Python usage within the PR and add instructions to README if recurring.

## Core Workflow
1. **Start of session**
   - Read `docs/PLAN.md` to identify the active phase/sub-phase.
   - Create/checkout the appropriate feature branch if not already present.
2. **Implementation**
   - Coordinate responsibilities across droids:
     - `ui-theme-droid` – theming, Tailwind tokens, visual polish.
     - `catalog-curator-droid` – costume metadata, prompts, affiliate links.
     - `ai-pipeline-droid` – provider/model abstraction (`seedream-v4`, Gemini, OpenAI-compatible).
     - `affiliates-comms-droid` – email capture UX, disclosure copy, social CTAs, analytics dictionary.
     - `ops-docs-droid` – documentation, changelog, plan upkeep, deployment notes, Mermaid diagram exports.
   - Break large features into sub-phases; log assignments in the plan document.
3. **Verification**
   - Run `bunx tsc --noEmit && bun run lint`; execute `bun test --run` once tests exist for the touched area.
   - Ensure new logging/analytics events are covered.
4. **Documentation & Diagrams**
   - Update README, this file, `CHANGELOG.md`, and `docs/TODO.md` as scope changes.
   - Place Mermaid source files under `docs/diagrams/` and regenerate SVG/PNG exports via Mermaid CLI before closing a phase:
     ```sh
     npx @mermaid-js/mermaid-cli -i diagram.mmd -o diagram.svg --png
     ```
   - Suggest new rules for AGENTS.md whenever gaps emerge.
5. **Wrap-up**
   - Record a brief summary of accomplishments + challenges for the phase.
   - Create detailed phase summary document: `docs/SUBPHASE_{N}_SUMMARY.md` including:
     * Phase overview and date completed
     * Responsible droid(s) and objectives achieved
     * Technical deliverables and files modified
     * Validation commands run and results
     * Asset requirements and documentation created
     * Challenges encountered and solutions implemented
     * Impact assessment and next steps
   - Commit with descriptive messages and open a pull request.

## Git Workflow Essentials
1. Branch from `main` using a descriptive slug: `feature/<slug>` or `bugfix/<slug>`.
2. Run `bunx tsc --noEmit && bun run lint` locally **before** committing.
3. Force pushes are allowed only on your feature branch using `git push --force-with-lease`. Never force-push `main`.
4. Keep commits atomic; prefer checkpoint-style prefixes (`feat: …`, `test: …`).

## Validation Checklist
- Bun workflows must pass; validate npm fallback periodically.
- Confirm `bun run build -- --base=/...` works for alternate deployment paths when relevant.
- Ensure documentation reflects the current behavior before merging.
- After each phase, verify summary + documentation updates are committed alongside code.

## Evidence Required for Every PR
- All tests green (`bun test --run`).
- Type-check and lint pass (`bunx tsc --noEmit && bun run lint`).
- Diff limited to agreed paths (`src/`, `docs/`, `server/` when applicable).
- **Proof artifact**:
  - Bug fix → failing test added first, now passes.
  - Feature → new tests, screenshots, or visual snapshots showing behavior.
- One-paragraph PR description covering intent & root cause.
- No drop in coverage; no unexplained runtime dependencies.

