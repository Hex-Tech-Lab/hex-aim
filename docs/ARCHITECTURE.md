# HEX-AIM System Architecture: DDD-Lite & Hexagonal-Lite

```
                        ┌────────────────────────────────────────────────────────┐
                        │              CORE DOMAIN (DDD-LITE)                    │
                        │                                                        │
                        │  Aggregates:                                           │
                        │  • Student (Lara, Maya, baseline profiles)             │
                        │  • Assessment (Quiz score, timing, itemized errors)    │
                        │  • CognitiveGap (Error taxonomy, recurrence, state)    │
                        │  • RemediationSprint (4-page fluid pack + Dad guide)   │
                        │                                                        │
                        │  Value Objects:                                        │
                        │  • TrafficLightStatus (Green, Yellow, Orange, Purple)  │
                        │  • ErrorClassification (ERR_PHANTOM_ZERO, etc.)        │
                        │  • SprintConstraints (Max 3-4 Qs/page, 6-10 min total) │
                        └───────────────────▲────────────────────────────────────┘
                                            │
                         ┌──────────────────┴──────────────────┐
                         │         HEXAGONAL PORTS (CONTRACTS) │
                         │                                     │
                         │  • IStoragePort (CRUD & Trends)     │
                         │  • IVisionExtractionPort (OCR)      │
                         │  • IQueuePort (Async Batching)      │
                         │  • IVectorPort (Curriculum Match)   │
                         │  • IMessagingPort (Telegram / Web)  │
                         └──────────▲─────────────────▲────────┘
                                    │                 │
             ┌──────────────────────┴──────┐   ┌──────┴──────────────────────┐
             │       ACTIVE ADAPTERS       │   │      ENTERPRISE ADAPTERS    │
             │                             │   │                             │
             │  • Storage: Upstash Redis   │   │  • Storage: Supabase PG     │
             │    + Git-backed JSON (RICO) │   │    (Remote Only)            │
             │  • Queue: Upstash QStash    │   │  • LMS: Microsoft Graph API │
             │  • Vector: Upstash Vector   │   │    (Teams for Education)    │
             │  • Edge: Cloudflare Workers │   │  • Mobile: React Native/Expo│
             │    & Vercel SPA Dashboard   │   │  • Schoolgy / Edmodo Sync   │
             └─────────────────────────────┘   └─────────────────────────────┘
```

---

## 1. The Upstash Serverless Backbone

1. **`@upstash/redis` (State & Session Store):**
   * Stores student state, recent assessment items, conversational intake sessions, and rolling traffic-light flags.
   * Eliminates SQL schema migrations during the initial iteration phase.
2. **`@upstash/qstash` (Asynchronous Job Queue):**
   * Receives incoming Telegram webhook events and dispatches asynchronous background extraction jobs.
   * Guarantees zero webhook timeouts and zero dropped parent uploads.
3. **`@upstash/vector` (Curriculum & Remediation Vector Store):**
   * Indexes the British National Curriculum (Years 1–6) and Egyptian MoE syllabus embeddings.
   * Matches specific student mistakes (e.g. "writing 03 for thirty") to verified remediation strategies and Socratic scripts.

---

## 2. Ports & Adapters Implementation Directory

* `packages/types/src/index.ts`: Strict shared TypeScript interfaces for all Domain Models and Ports.
* `packages/core/src/adapters/`:
  * `UpstashStorageAdapter.ts`: Implements `IStoragePort` via `@upstash/redis`.
  * `GitStorageAdapter.ts`: Implements `IStoragePort` via GitHub Contents API / JSON files (the proven $0 RICO engine).
  * `QStashQueueAdapter.ts`: Implements `IQueuePort` via `@upstash/qstash`.
  * `UpstashVectorAdapter.ts`: Implements `IVectorPort` via `@upstash/vector`.
  * `VisionExtractionAdapter.ts`: Implements `IVisionExtractionPort` via OpenRouter (Gemini 3.5-flash-lite, Gemini 3.8-flash, Claude 4.5 Haiku).
* `apps/web/`:
  * Vercel SPA dashboard serving Parent, Teacher, and Student views with interactive Chart.js trend lines.
* `apps/bot/`:
  * Cloudflare Worker / Vercel Edge Telegram webhook handler with batch confirmation logic.
