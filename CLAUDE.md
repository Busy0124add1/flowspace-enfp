# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FlowSpace ENFP — a single-file personal productivity dashboard (`dashboard.html`). Everything (HTML, CSS, JS) lives in one file with no build tools, no frameworks, no dependencies. Open `dashboard.html` directly in a browser to run it.

## Architecture

- **No build system**: Pure vanilla HTML/CSS/JS in a single file (~1250 lines). External resources are CDN-loaded (Google Fonts "Outfit", Font Awesome 6.5).
- **Data persistence**: All state is stored in `localStorage` with the `fp3_` prefix (threads, stages, project, sync, todos, notes, energy, journal, streak, mbti). No backend.
- **Layout**: CSS Grid two-column layout (left panel + 360px right sidebar), fixed 100vh with overflow scroll per column.
- **MBTI theming**: The dashboard supports switching between all 16 MBTI types via a dropdown. Each type group (analysts/diplomats/sentinels/explorers) has a distinct accent color. The ENFP avatar image only shows for ENFP mode.

## Key Modules (all in `<script>`)

| Section | Purpose |
|---|---|
| Energy + Journal | Daily mood/focus/creative sliders (0-100), journal textarea with auto-save |
| Threads | Parallel task cards with color-coded paint splat progress system |
| Design Flow | Linear stage pipeline (需求分析→线框图→视觉稿→原型→交付) |
| Four-Quadrant Todo | Eisenhower matrix as draggable dot canvas (ui/si/un quadrants) + done list panel |
| Sync | Status display for external tool sync (Obsidian, GitHub, etc.) — currently mock data |
| Flash Notes | Quick capture notepad with Ctrl+Enter save |
| Daily Spark | Daily typewriter-animated inspirational prompt (20 prompts, persisted per day) |

## Visual Effects

- **Egg burst**: Emoji particle explosion (`🥚🌈⭐✨💥🎯🔥💫🎉🌟`) triggered on interactions
- **Paint splats**: Seeded-random organic blobs that fill thread cards as steps complete
- **Splat drops/rings**: Landing splashes for egg particles
- **Mascot mood**: ENFP avatar animates (bounce/celebrate/wobble/vibe) based on energy levels

## Editing Guidelines

- Keep everything in `dashboard.html` — this is intentionally a single-file project
- CSS variables are defined in `:root` (dark theme: `--bg:#0c0d10`, accent colors: `--pink`, `--cyan`, `--lime`, `--violet`, `--amber`)
- The `$` helper is shorthand for `document.getElementById`
- `load(k, default)` / `save(k, v)` handle all localStorage I/O with JSON serialization and error swallowing
- Default data structures (`DEF_THREADS`, `DEF_STAGES`, `DEF_SYNC`, `DEF_TODOS`, `DEF_ENERGY`) seed initial state

---

## Karpathy Coding Guidelines

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

### 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

### 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

### 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

### 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.