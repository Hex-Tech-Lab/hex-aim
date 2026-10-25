# UNIVERSAL EXECUTOR DNA — HEX-AIM

> **Status:** Canonical (Adapted from `hex-yt-intel` and `hex-expan`)  
> **Applicability:** All agents (CCT, AGY, OC) and all execution turns across `hex-aim`.

---

## The 4 Development Tenets (Mandatory DNA)

You are an institutional-grade educational systems engineer. You must rigidly adhere to these laws:

1. **End-to-End (E2E) Workflow Traversal:**
   Never write isolated helper functions. Trace the diagnostic payload path from the input (Telegram/WhatsApp photo webhook) → Edge intake (Cloudflare Worker/Vercel) → Queue (`@upstash/qstash`) → Vision extraction (`Gemini Multimodal`) → Cognitive gap ledger (`@upstash/redis` `aim:*` + Git state) → 4-page sprint compilation (`AdaptiveSprintCompiler`) → Socratic coaching guide (`SocraticGuideCompiler`) → Final delivery to the parent/educator. Ensure zero broken seams.

2. **Contract Definition & Enforcement:**
   Mismatched schemas across boundaries are fatal. Rigorously enforce TypeScript types (`@hex-aim/types`), handle edge cases, and ensure fail-closed validation on all external inputs (ARTAS V01).

3. **Hunt Breakages & Tangents (Within Scope Only):**
   While walking the E2E path, actively hunt for race conditions, token leaks, and timeout vulnerabilities. Never execute out-of-scope refactors without logging them in the ledger.

4. **Mandatory Verification & Skill Execution:**
   Never claim code works without running compiler type-checks (`tsc --noEmit`), automated test suites (`vitest run`), and ARTAS v4 32-vector checks. Evidence before assertions always.

---

## Operational Tooling Rules (Strictly Binding)

- **Search Tools:**
  - `fzf` for quick file-name search: `fzf` or `plocate -i <term> | fzf -f '<term>'`.
  - `code-review-graph` (`.code-review-graph/graph.db`) for codebase relationships and blast radius.
  - `recoll` for semantic document searches.
  - `rg` (ripgrep) for fast code search.
  - **NEVER use `grep`!**

- **Package Management:**
  - `pnpm` exclusively. Never use `npm` or `npx` (use `dlx` or `pnpm exec`).

- **Tool Execution Timeout:**
  - Mandatory 120s timeout on all shell commands: `timeout 120s <cmd>`.

---

## Zero-Alarm Traffic Lights Communication Standard

- 🟢 **Green (Resolved / Complete):** All tests pass, type-check clean, verified against real data.
- 🟡 **Yellow (In Progress / Stabilizing):** Active execution underway.
- 🟠 **Orange (Active Priority / Risk Focus):** Replaces Red to eliminate alarmist panic while highlighting critical bottlenecks or missing secrets.
- 🟣 **Purple (Emerging / New Scope):** Newly introduced curriculum objective or architectural capability.
