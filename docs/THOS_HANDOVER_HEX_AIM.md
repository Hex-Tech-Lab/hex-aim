## RESUME HERE (read first; update this block every turn that changes state)

- **Last updated:** 2026-11-11 (session with Haiku 5.5). Supersedes the 2026-10-28 entry below.
- **Ledger:** `docs/agent_ledger.jsonl` (protocol v2). Latest state per `task_id` is current.
- **Done today (verified):**
  - MIME fix for Telegram photos: commit `cb17f47`, adapter tests pass.
  - Upstash DB `hex-aim-prod` (id `b4a712b4`, eu-central-1, pay-as-you-go). Worker secrets point at it; `/health` 200.
  - Quiz 5 cheat sheets for Lara and Maya: one A4 page each, real examples from lesson slides 2.1 to 2.3.
  - LMS results recorded side by side (`docs/progress/lms_progress.json`, `docs/reports/LMS_PROGRESS_LARA_MAYA.html`).
  - LMS API investigation, public info only, no login (`docs/reports/LMS_API_INVESTIGATION.md`): host `sims.astencollege.com` found in repo but not confirmed as the parent app; 0 result endpoints in public JS; hardcoded `webhookSecret` in `SchoolMisSyncEngine.ts` needs rotation.
- **In progress:**
  - Central `redis.prefix` setting, default empty, replacing hard-coded `aim:` keys (`packages/core/src/settings/redisKeys.ts`). Core tests pass (9/9). Core build and bot typecheck still to re-run after the last fix.
  - Family overview reads the stored LMS snapshot, not constants. Snapshot not yet seeded into `hex-aim-prod`; worker not yet redeployed.
- **Student records (located 2026-11-11):** the live copy is in Upstash database `becoming-lioness-125833` (id `96bcea5e`), which hex-yt-intel also uses. It holds 53 `aim:*` keys: `aim:student:lara|maya`, `aim:students:index`, `aim:assessments:*`, `aim:gaps:*`, `aim:guide:*`, `aim:sprint:*`, `aim:instructions:*`, `aim:user_lang:*`. Source of truth for the JSON-to-Redis history: `manifest/students.json` and `manifest/asten_college_curriculum.json` in this repo.
  - Dry run (read-only, nothing written): all 53 keys read. Plan is to copy them into `hex-aim-prod` with the prefix removed, source untouched. Awaiting founder approval for the write (production rule).
  - Reed Telegram photo: not found in any readable source.
  - Handwriting engine: needs labelled samples per child before matching can be validated.
- **Not started:** English practice photos, French project (due Tue 17 Nov), science worksheets, square numbers worksheet. Child attribution unknown.
- **Next steps (no founder input needed):** finish core build; seed `lms:progress`; redeploy worker; read back the snapshot; read the 1.4 lesson PDF (now readable at `docs/for_sharing/`) to check the Quiz 5 sheets.

---

# TOTAL HANDOVER OF STATE (THOS) — PROJECT HEX-AIM

> **Current Canonical THOS (Waves 6–22 Full Mega-Session):** [`docs/history/THOS_2026-10-28_1645_WAVES_6_TO_22_FULL_SESSION_MEGA_HANDOVER.md`](file:///home/kellyb_dev/projects/hex-aim/docs/history/THOS_2026-10-28_1645_WAVES_6_TO_22_FULL_SESSION_MEGA_HANDOVER.md)  
> **Unified Canonical Master Template:** [`docs/templates/THOS_MASTER_TEMPLATE.md`](file:///home/kellyb_dev/projects/hex-aim/docs/templates/THOS_MASTER_TEMPLATE.md)  
> **Project:** `hex-aim` (Adaptive Individualized Mastery)  
> **Target Path:** `/home/kellyb_dev/projects/hex-aim`  
> **Last Updated:** 2026-10-28T16:52:00+03:00  
> **Source Session:** Antigravity (AGY / Gemini 3.8 Flash High)

---

## 1. Executive Summary & Core Philosophy

* **The Mission:** Build an automated, continuous educational diagnostic and targeted remediation system for primary students (Years 1–6, pilot at **Asten College**, New Cairo).
* **"Targeted Medicine for Education" (The Core Moat):** Traditional platforms (Kumon, IXL, Twinkl) flood children with 30-page repetitive drill sheets that induce ADHD shutdown. `hex-aim` operates like **targeted micro-dosing**: it ingests teacher-marked milestone quizzes, identifies the 1–2 specific cognitive bottlenecks, and compiles a **fluid 4-page sprint (6–10 minutes)** that fixes the issue without tears.
* **The Twin Dynamic (Zero Competition):** Built-in support for siblings/twins (modeled on Lara and Maya, Year 4). Different cognitive profiles (Lara: ADHD/dyslexia vulnerability under speed pressure; Maya: steady verbal execution, interval scale confusion). Cross-teaching routines are emphasized over any comparative scoring.
* **Unit Economics at Scale:**
  * Target price: **200 EGP / month per student** (~$4.15 USD).
  * Ingesting milestone quizzes only (2–4 per month = 4–8 pages) results in LLM vision + Upstash costs of **~$0.08 USD (~3.90 EGP) per child/month**.
  * **Gross Margin: >96%** (200 students = 40,000 EGP revenue vs. ~800 EGP infra/API cost).

---

## 2. Core Architectural Decisions (Binding)

### A. Pure TypeScript / Serverless Edge (No Python Hosting Required)
* **The Elimination of Python in Production:** The ad-hoc Python scripts (`generate_lara.py`, `generate_dad_master.py`) created during initial discovery are **scaffolding only**.
* **Production Stack:** 100% **TypeScript** running on **Cloudflare Workers (0ms cold start)** and **Vercel Edge**.
* **Why:** Running Python containers on Render/Fly introduces 30–50s cold starts that cause WhatsApp/Telegram webhooks to fail. Cloudflare Workers + Vercel Edge run on V8 isolates with zero cold start globally.

### B. Upstash Complete Serverless Backbone
* **`@upstash/redis`:** Sub-millisecond serverless state for parent sessions, student profiles, and rolling gap registers.
* **`@upstash/qstash`:** Asynchronous webhook queueing. When parents upload batch photos, QStash receives the event and orchestrates background extraction without timing out.
* **`@upstash/vector`:** Semantic embedding of the British National Curriculum + Egyptian MoE syllabus, matching student mistakes to verified Socratic hints.

### C. JEV (Joint Evaluation Value) Decision Engine
* Use the **TypeSafe JEV model** for ultra-fast, structured, low-cost heuristic decision-making across classification and remediation selection.

### D. Canonical Assessment Deduplication (Classroom Scale)
* When 32 students in a class (e.g. Year 4, Class A/B) upload the same weekly quiz, the system does **not** store 32 redundant copies of the teacher's blank test.
* The system detects the document family, selects the cleanest upload as the **Canonical Assessment Master**, extracts the blank question schema once, and links each student's upload as an individual **Student Delta Response** (recording only their handwritten marks).

### E. WhatsApp-First Messaging Port
* While Telegram is supported as an adapter, **WhatsApp** is the primary medium for Egypt (100% household penetration).
* Abstracted via `IMessagingPort` so the core application is decoupled from the transport (WhatsApp Cloud API / Twilio vs. Telegram Bot API).

### F. Bilingual Parent Socratic Guides (English & Arabic)
* Many Egyptian parents face friction with dense English pedagogic mark schemes.
* The Parent Socratic Guide generator must support **English, Arabic, and Bilingual side-by-side**.
* **The 3-Strike Rule:** If a parent requests the Arabic translation 3 times, their profile automatically updates to default to Arabic permanently.

### G. Zero-Alarm Traffic Lights
* 🟢 **Green:** Mastered / Resolved
* 🟡 **Yellow:** Progressing / Stabilizing
* 🟠 **Orange:** Active Priority *(Replaced Red to prevent ADHD alarm and negative stigma)*
* 🟣 **Purple:** New / Emerging Curriculum Objective

---

## 3. Domain & Entity Hierarchy (DDD-Lite)

```
[Curriculum Authority]
  ├── British National Curriculum (Years 1 to 6)
  └── Egyptian Ministry of Education (MoE)
        │
        ▼
[School]: Asten College
  ├── Track 1: British Primary (Y1–Y6)
  └── Track 2: American Division (G6–G9 Transition Path)
        │
        ▼
[Year Group]: Year 4 (Classes 4A, 4B ~32 students)
        │
        ▼
[Subject Catalog] (9 Subjects):
  ├── British Purview: Mathematics, English (SPaG & Reading), Science, Humanities
  ├── Egyptian MoE: Arabic Language, Religion (Islamic/Christian), Arabic Social Studies
  └── Electives & Program: French / German, Physical Education (PE)
        │
        ▼
[Canonical Assessment Master]: Clean digitized question set for the weekly test
        │
        ▼
[Student Delta Response]: Lara's / Maya's individual handwritten submission
        │
        ▼
[Cognitive Gaps Ledger]: Running history of specific error patterns
        │
        ▼
[Remediation Sprint]: Parametric 4-page student pack + Dad/Mom Socratic Guide
```

---

## 4. Current State of the Codebase (`/home/kellyb_dev/projects/hex-aim`)

```text
hex-aim/
├── .git/                  # Initialized Git repository
├── .code-review-graph/    # Knowledge graph active (23 nodes, 118 edges)
├── pnpm-workspace.yaml    # Monorepo workspace configuration
├── package.json           # Root scripts (build, test, dev:web, dev:bot)
├── packages/
│   ├── types/             # Strict TypeScript contracts (IStoragePort, IVisionPort, etc.)
│   │   └── src/index.ts
│   ├── core/              # Domain logic & legacy generators to refactor to TS
│   │   ├── generate_lara.py
│   │   ├── generate_maya.py
│   │   └── generate_dad_master.py
│   └── vision/            # RICO handwriting lessons & CER harness
│       ├── cer.py
│       └── rico_lessons.json
├── manifest/              # Catalogs & baseline student profiles
│   ├── asten_college_curriculum.json
│   ├── students.json      # Lara & Maya verified baselines
│   ├── lara_review.html
│   ├── maya_quest.html
│   └── dad_master.html
├── sources/               # Raw input PDFs & verified diagnostic print outputs
│   ├── Lara Match Quiz - 8-10-2026.pdf
│   ├── Lara Match Quiz - 15-10-2026.pdf
│   ├── Yr4 - Math Review - Binder 1 - October 2026 (Reordered).pdf
│   ├── Lara_Year4_Math_Review.pdf
│   ├── Maya_Year4_NumberLine_Quest.pdf
│   └── Dad_Master_Coaching_Guide_Lara_and_Maya.pdf
└── docs/
    ├── ARCHITECTURE.md
    ├── THOUGHT_PARTNER_PUSHBACK.md
    └── THOS_HANDOVER_HEX_AIM.md (This Document)
```

---

## 5. Immediate Action Plan for the Incoming Agent

When opening `/home/kellyb_dev/projects/hex-aim`:

1. **Refactor Scaffolding Generators into Generic TypeScript Engines:**
   * Replace `generate_lara.py` and `generate_maya.py` with `@hex-aim/core`:
     * `SprintCompiler.ts`: Takes a `StudentProfile`, `CurriculumScope`, and `CognitiveGap[]` and compiles the fluid 4-page HTML template.
     * `ParentGuideCompiler.ts`: Generates Dad/Mom Socratic scripts in English or Arabic.
2. **Implement Storage Adapters:**
   * `UpstashStorageAdapter.ts` using `@upstash/redis`.
   * `GitStorageAdapter.ts` using GitHub Contents API (for $0 JSON-backed state parity with RICO).
3. **Wire Asynchronous Queueing (`@upstash/qstash`):**
   * Set up the batch intake endpoint in `apps/bot` to process multi-photo uploads asynchronously.
4. **Deploy Vercel Dashboard (`aim.getvintel.com`):**
   * Single-page dashboard in `apps/web/` connecting to the state adapter.
5. **Set up GitHub Repositories:**
   * Public code repo under `Hex-Tech-Lab/hex-aim` (enabling CodeRabbit/Cubic automated reviews on free tier).
   * Private state repo under `Hex-Tech-Lab/hex-aim-state` (for student records and private configs).
