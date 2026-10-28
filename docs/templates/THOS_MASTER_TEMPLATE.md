# MASTER TECHNICAL HANDOVER SUMMARY (THOS) CANONICAL SPECIFICATION & TEMPLATE

> **Document Type:** Unified Standard Operating Procedure (SOP) & Scaffold Template  
> **Classification:** High-Value System State Transfer & Inter-LLM Session Continuity Standard  
> **Canonical Path:** `docs/templates/THOS_MASTER_TEMPLATE.md`  
> **Target Output Path:** `docs/history/THOS_<YYYY-MM-DD>_<HHMM>_<SHORT_TOPIC>.md`  
> **Companion Document:** [`docs/templates/UNIVERSAL_DNA.md`](file:///home/kellyb_dev/projects/hex-aim/docs/templates/UNIVERSAL_DNA.md)  
> **Status:** Binding Standard for all Antigravity / Claude / Gemini Agent Handover Sessions  

---

# PART I: OPERATING PRINCIPLES & INVARIANT RULES

### 1. Mandatory Operating Principles
1. **Always think step-by-step before documenting**: Never generate a THOS from superficial memory. Verify exact file paths, commit hashes, test results, and live edge URLs before writing.
2. **Critique your summarization decisions**: Never compress actionable detail, breakthrough code snippets, or error paths into vague platitudes.
3. **Verify with sample output until 95%+ confident**: Verify git status, run the test harness, and ensure every link and command in the THOS is 100% executable as written.

### 2. Verification Philosophy
- **"Plan 10x, Verify 10x, Execute 1x"**: Never skip verification steps. Document what was *verified*, not just what was claimed or planned.
- **"Verify, then trust, then act"**: Never accept previous agent claims at face value. Inspect the live code and running tasks.

### 3. Critical Anti-Pattern Warnings (What NEVER to Over-Summarize)
⚠️ **Strictly prohibit over-summarization in these 8 critical areas**:
1. **Iterative development cycles**: Do not hide the 4–6 iterations required to reach a stable solution. Document the progression.
2. **Troubleshooting loops**: Record the root cause, cycle count, failed attempts, and the exact breakthrough insight that solved it.
3. **Key decision inflection points**: Tag every binding architectural choice with 🔑 **KEY DECISION**.
4. **Breakthrough differential code snippets**: Include the exact function, formula, regex, or configuration line that fixed the issue.
5. **The Sacred Session Bridge Content**: The last 3–5 prompts and turns of a session represent the sacred lifeline between agents. **MUST be preserved near-verbatim** with minimal summarization.
6. **Multi-Horizon Wave Matrices**: Retain all 6 pedagogical and architectural dimensions across both current and future wave horizons.
7. **Recurring housekeeping & user friction patterns**: Record literal user frustration quotes so the next agent does not repeat the exact same behavioral mistake.
8. **Multi-agent coordination logic**: Document all inter-agent ledger entries, workspace boundaries, and dependency handoffs.

### 4. Tool Binding & Environment Invariants
- **Package Manager**: `pnpm` exclusively. **STRICT RULE**: Never use `npx`, `npm`, or `yarn`. Use `dlx` and `apt-fast`.
- **Search Tools Binding (SSOT)**:
  - `fzf`: Rapid file-name search.
  - `graph`: Codebase structural dependency navigation.
  - `recoll`: Deep content search across indexed files.
  - `rg` (ripgrep): Targeted pattern search with `-g '!node_modules' -g '!.git'`.
  - **HARD RULE**: NEVER use `grep`. Do not use `find` as primary search.

---

# PART II: THE UNIFIED THOS DOCUMENT SCAFFOLD
*(Copy the template below when generating a new handover report into `docs/history/THOS_<date>_<time>_<TOPIC>.md`)*

---

```markdown
# TECHNICAL HANDOVER SUMMARY — [Project Name]: [Detailed Scope & Subtitle]

**Document ID**: `THOS-[PROJECT]-[DATE]-[WAVE-COVERAGE]`  
**Session Date**: [Start Date] to [End Date], [Start Time] – [End Time] [Timezone]  
**Agents Involved**: [Agent Name / CLI Version (Model ID Used)]  
**Project**: `[Project Name]` — [2-sentence system purpose and target pilot]  
**Target Codebase**: `[Repo-Name]` (master branch at commit `[SHA]`)  
**Prior Handover Reference**: [`docs/history/THOS_...md`](file:///path/to/prior/THOS) (or link to living root handover)  
**Full Session Source Log**: `[Path to exported session .txt log if applicable]`  
**Operating DNA**: [`docs/templates/UNIVERSAL_DNA.md`](file:///path/to/UNIVERSAL_DNA.md) & [`docs/templates/THOS_MASTER_TEMPLATE.md`](file:///path/to/THOS_MASTER_TEMPLATE.md)  
**Status**: 🟢 **[Traffic Light Status + 1-line proof of what ran, e.g. 90/90 passing tests via pnpm test]**  

---

## 1. Executive Summary
- **Core Mission**: [2–3 sentences defining the product's primary moat, unit economics, and pedagogical objective].
- **Current Milestone**: [What was built, verified, and deployed in this specific window].
- **Immediate Next Step**: [The exact #1 priority action awaiting execution].

---

## 2. System Topology & Runtime Boundary Envelope
*Provide an ASCII diagram illustrating edge ingress, serverless workers, domain packages, infrastructure adapters, and databases.*

\`\`\`
[ASCII Architecture Diagram]
\`\`\`

- **Runtime Boundaries**:
  - **Edge Workers**: [Cloudflare Workers / Vercel Edge details, route patterns, cold-start latency]
  - **Serverless / Node.js**: [API server details, long-running processes, port allocations]
  - **Data Layer**: [Upstash Redis namespace, Upstash QStash queueing, Postgres/Vector DB]
- **Target Technology Stack**:
  - TypeScript version, Node runtime, CSS/UI tokens, LLM model ID & provider.

---

## 3. Comprehensive Wave & Architectural Ledger
*Chronological table of all waves and milestones executed across the session window.*

| Wave / Milestone | Description & Deliverables | Core Modules Touched | Duration | Variance | Vitest Count | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Wave X** | [Core architectural shift] | `packages/...` | [Xm] | [+/- %] | [N/N passed] | 🟢 Live |

---

## 4. Multi-Horizon Wave Matrices (6-Dimension Analysis)

### A. Current Generation Waves ([Start Wave] to [End Wave])
| Dimension | Wave N: [Name] | Wave N+1: [Name] | Wave N+2: [Name] | Wave N+3: [Name] |
| :--- | :--- | :--- | :--- | :--- |
| **Pedagogical Intent** | [Child/Teacher impact] | ... | ... | ... |
| **ADHD Adaptation** | [Specific cognitive scaffold] | ... | ... | ... |
| **Technical Moat** | [Proprietary algorithm/pipeline] | ... | ... | ... |
| **Frontend State** | [Tabs, modals, interactive widgets] | ... | ... | ... |
| **Edge & Performance** | [Latency, bundle size, cache rule] | ... | ... | ... |
| **Verification State** | 🟢 Live / Tested | ... | ... | ... |

### B. Future Generation Waves ([Next Wave] to [Next Wave + 5])
*(Same 6-dimension table defining the upcoming roadmap horizon).*

---

## 5. Forensic Defect & Resolution Ledger
*Document every P0/P1/P2 defect caught and fixed during the sprint to preserve institutional memory.*

| Defect ID & Location | Severity | Root Cause Mechanism | Production Blast Radius | Resolution Commit / PR |
| :--- | :--- | :--- | :--- | :--- |
| *e.g., PDF-01 (`generator.ts`)* | *P1* | *WinAnsi encoding crashed on Unicode emojis* | *Vector PDF compilation failed on-the-fly* | *Added ASCII sanitization helper (commit `3b228fe`)* |

---

## 6. Detailed Troubleshooting Loops & Root Cause Analyses (RCAs)
*For issues consuming 2+ cycles, document the full forensic RCA:*
- **Loop N: [Issue Title]**
  - **Root Cause Category**: [Environment / Encoding / Tooling / Race Condition / Architecture]
  - **Cycle Count & Wasted Time**: [e.g., 3 cycles, ~15 mins]
  - **User's Frustration Statement**: *"[Quote verbatim if user intervened]"*
  - **"Stop and Think" Moment**: [The realization that prevented further thrashing]
  - **Verification Gap**: [Why the issue was not caught before reaching production]
  - **Breakthrough Insight**: [The exact technical realization that solved it]
  - **Prevention Measure Applied**: [The standing invariant or code check created to prevent recurrence]

---

## 7. Knowledge Cycles & Architecture Decision Records (ADRs)
*Capture discrete architectural discoveries, formal ADRs, and technical trade-offs:*
- **Cycle / ADR N: [Title]**
  - **Duration & Context**: [Time spent, triggered by what]
  - **Objective**: [Problem to resolve]
  - **Trade-offs Evaluated**: [Option A vs Option B]
  - **Decided Solution**: [The chosen design and why]
  - **Key Artifacts**: [Files, contracts, formulas]
  - **Lifecycle Status**: [🟢 Shipped / 🟡 Designed / 🔴 Blocked]

---

## 8. Boundary Contracts, Protocols & Security Perimeters
- **Student Identity & PII Isolation**: [Decoupled identity vaults, pseudonymization, GDPR/Egyptian compliance]
- **Access Control & RBAC**: [Role definitions: primary coach, co-guardian, observer specialist]
- **API Security & Ingress Invariants**: [Constant-time webhook verification, atomic rate-limiting, fail-closed fallbacks]

---

## 9. Presentation Layer & Design System Tokens
- **Visual Design Tokens**:
  | Token Name | Dark Mode Value | Light Mode Value | Functional Purpose |
  | :--- | :--- | :--- | :--- |
  | `--bg-base` | `#...` | `#...` | Primary canvas |
  | `--accent-cyan` | `#...` | `#...` | Interactive focus |
- **Interaction Physics**:
  - Easing curves, animation durations, reduced-motion fallbacks, non-blocking notification standards.

---

## 10. Governance, CI/CD Pipeline & Tooling Invariants
- **Build & Test Sequence**: `pnpm build` → `pnpm test` (zero error tolerance).
- **Search Tool Hierarchy SSOT**: `fzf`, `graph`, `recoll`, `rg` strictly enforced.
- **Agent Ledger Synchronization**: All mutations recorded in `agent_ledger.jsonl` and summarized in `AGENT_LEDGER.md`.

---

## 11. Universal DNA Attestation (`UNIVERSAL_DNA.md`)
- **Tenet 1 (End-to-End Tracing)**: [Which flows were traced end-to-end with real payloads, which were mocked].
- **Tenet 2 (Contract Boundaries)**: [Verification of TypeScript interfaces, schemas, and error boundaries].
- **Tenet 3 (Latent Risks & Tangents)**: [Identified edge cases, quota ceilings, or third-party vulnerabilities].
- **Tenet 4 (Skill & Tool Discipline)**: [Tools executed, verified outcomes, and unapproved tools avoided].

---

## 12. Current System State Snapshot
- **What Works ✅**: [Exhaustive list of verified features, endpoints, and test coverage].
- **What Doesn't Work / Is Queued ❌**: [Identified gaps, queued roadmap waves].
- **In-Progress Tasks 🔄**: [Tasks actively running or in-flight].
- **Active Daemons & Crons ⚙️**: [Background tasks, cron expressions, ports].
- **Technical Debt**: [Known shortcuts or deferred refactors tracked for future waves].

---

## 13. Sacred Session Bridge Content (Last Prompts Preserved Near-Verbatim)
⚠️ **MANDATORY**: *Reproduce the last 3–5 user prompts and agent turns near-verbatim to eliminate "starting from scratch" syndrome for the incoming LLM:*
- **Bridge Turn 1**:
  - *User*: "[Verbatim user prompt]"
  - *Agent Action & Response*: "[Exact response and code action]"
- **Bridge Turn 2**:
  - *User*: "[Verbatim user prompt]"
  - *Agent Action & Response*: "[Exact response and code action]"
- **Bridge Turn 3**:
  - *User*: "[Verbatim user prompt]"
  - *Agent Action & Response*: "[Exact response and code action]"

---

## 14. Critical Path Forward (Top 3 Priority Actions for Incoming Agent)
*Provide step-by-step instructions so the next agent resumes immediately without asking clarifying questions:*
### Priority 1: [Action Title]
- **Action Description**: [Exact files to create or modify, with function signatures]
- **Dependencies**: [Prerequisite modules or packages]
- **Verification Criteria**: [Exact terminal command and expected passing output]
- **Edge Cases & Failure Modes**: [What could fail and how to guard against it]
- **Complexity**: [Low / Medium / High, estimated duration]

### Priority 2: [Action Title]
- [Same 5 structured fields]

### Priority 3: [Action Title]
- [Same 5 structured fields]

---

## 15. Reference Index & Self-Validation Quality Checklist
- **Key Artifacts & Locations**:
  - Canonical THOS Spec: `docs/templates/THOS_MASTER_TEMPLATE.md`
  - Current THOS: `docs/history/THOS_...md`
  - Living Root Handover: `docs/THOS_HANDOVER_HEX_AIM.md`
  - Core Domain Engines: `packages/core/src/...`
  - Active Edge Routes: `apps/bot/src/...`, `apps/web/src/...`

- **Self-Validation Checklist**:
  - [ ] Header contains real timestamps, active git branch, commit SHA, and test counts.
  - [ ] Prior THOS explicitly cited and linked.
  - [ ] Chronological timeline structured newest-first with 🔑 Key Decisions, 💡 Breakthroughs, and ⚠️ Troubleshooting Loops.
  - [ ] Multi-horizon wave matrices completely populated across all 6 dimensions.
  - [ ] Forensic Defect Ledger records all major issues with root causes, blast radiuses, and commits.
  - [ ] Universal DNA attestation completed across all four tenets.
  - [ ] Sacred session bridge captures the last 3–5 user prompts near-verbatim.
  - [ ] Immediate next steps provide concrete file paths, commands, and verification criteria.
  - [ ] Zero secrets or plaintext credentials leaked.
  - [ ] Quality Gate: 100% verified working across all workspace packages (≥95% confidence).
```
