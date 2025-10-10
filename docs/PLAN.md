# Waifu Material – Phase Plan

## Phase 1: Halloween Launch (Current)

### Objective
Rebrand the existing experience into Waifu Material and deliver a polished Halloween-focused virtual costume try-on MVP with multi-provider AI support and affiliate monetization hooks. Every major system/component should be documented with Mermaid diagrams saved both inline (Markdown) and as exported SVG/PNG assets in `docs/diagrams/`.

### Sub-Phases
1. **Branding & Theme Refresh**  _(ui-theme-droid)_ ✅ **COMPLETED**
   - Update Tailwind tokens and component styles to neon/anime aesthetic. ✅
   - Replace hero messaging, typography, and meta assets. ✅

2. **Costume Catalog Foundations**  _(catalog-curator-droid)_ ✅ **COMPLETED**
   - Define costume schema (`CostumePreset`). ✅
   - Import 6–9 launch costumes with reference images and prompts. ✅
   - Document migration path to Neon/Supabase. ✅

3. **Flow Rework & UX Copy**  _(affiliates-comms-droid)_ ✅ **COMPLETED**
   - Reframe screens: costume selection → selfie upload → email capture → generation lounge → results/share. ✅
   - Implement disclosure copy, affiliate link presentation, and social CTAs. ✅

4. **AI Provider Abstraction**  _(ai-pipeline-droid)_
   - Support Gemini proxy + OpenAI-compatible providers (incl. `seedream-v4`).
   - Handle multiple costume reference images per request.
   - Provide mockable interfaces for tests.

5. **Instrumentation & Data Hooks**  _(affiliates-comms-droid + ai-pipeline-droid)_
   - Extend logging events (selection, email, generation, affiliate clicks, social shares).
   - Stub email submission endpoint integration.

6. **Documentation & Ops**  _(ops-docs-droid)_
   - Keep README, AGENTS.md, CHANGELOG.md, docs/TODO.md synchronized.
   - Capture deployment notes for Vercel and optional Backblaze B2 CDN.
   - Maintain Mermaid diagrams (systems, timelines, complex flows) and ensure matching SVG/PNG exports live in `docs/diagrams/`.
## Diagram Standards

- Mermaid diagrams must accompany complex features, architecture views, and delivery timelines.
- Store source `.mmd` (or Markdown snippets) under `docs/diagrams/` and regenerate SVG/PNG exports via Mermaid CLI (`npx @mermaid-js/mermaid-cli -i <file>.mmd -o <file>.svg --png`).
- Reference both the inline Mermaid code and the exported assets within docs so readers without Mermaid support still see visuals.

### Exit Criteria
- All sub-phases completed with passing lint/tests.
- Documentation updated to reflect feature set and processes.
- Summary + challenge log recorded, changes committed, PR opened.

## Phase 2: Operations Dashboard

### Objective
Deliver admin tooling to manage costumes/products, view analytics, and tune theming without redeploys.

### Highlights
- Implement dashboard UI (likely Next.js or Vite) with auth.
- Migrate catalog and analytics to Neon/Supabase.
- Integrate email delivery service and reporting.
- Extend affiliate product management and tracking.

## Phase 3+: Seasonal & Monetization Expansions

- Pivot costume catalog/themes to winter holidays and beyond.
- Introduce premium upsells, community features, or creator monetization.
- Automate CI/CD with gated preview deployments and QA bots.

## Session Workflow Reminder
1. Read this plan before starting work.
2. Select the active sub-phase and coordinate with the appropriate droid.
3. Implement changes, keeping tests and lint up-to-date.
4. Update docs and log challenges.
5. Commit, push, and open a PR summarizing the outcome.
