# ADR-001: Student Resource Hierarchy, Scoped Storage Partitioning, and Day-Zero Migration Plan

## Status
**ACCEPTED** (2026-10-25)

## Context
In the initial prototype waves of HEX-AIM, files, assessment payloads, and generated packs were stored in a flat namespace:
- Redis keys were loosely formatted (e.g. `aim:assessments:<id>`, `aim:sprints:<id>`).
- Static PDF and HTML sources in `sources/` and `manifest/` were dumped without student, school, academic year, or subject boundaries.
- As the pilot expanded from Lara to include Maya, and from Mathematics to English Language and beyond, this flat structure caused:
  1. High risk of cross-student collision (Lara vs. Maya).
  2. Subject conflation (English language quizzes ingested as Mathematics).
  3. No partition for longitudinal tracking across school years (e.g., Year 4 to Year 5).
  4. Search and retrieval required full-keyspace scans without logical prefix filtering.

## Decision

We establish a canonical, deterministic, 5-tier hierarchical storage specification across all storage layers (Redis, Git State, Object Storage / R2, and Local Filesystem).

### 1. Canonical URI Path Specification
All student educational assets MUST follow this deterministic directory and key schema:

```
students/
└── {student_id}/                         # e.g., lara, maya
    └── {school_id}/                      # e.g., asten-college
        └── {academic_year}/              # e.g., 2026-2027_Y4
            └── {subject_id}/             # e.g., maths, english
                ├── raw-intake/           # Original uploaded quiz photos/scans
                │   └── week-{term_week}/ # e.g., week-03/photo_01.jpg
                ├── assessments/          # Diagnostic JSON extraction & scoring
                │   └── {assessment_id}.json
                ├── sprints/              # Targeted 4-page student remediation packs
                │   ├── {sprint_id}.json
                │   ├── {sprint_id}.html
                │   └── {sprint_id}.pdf
                ├── guides/               # Socratic parent coaching guides (EN/AR)
                │   ├── {guide_id}.json
                │   ├── {guide_id}.html
                │   └── {guide_id}.pdf
                └── ledger/               # Longitudinal cognitive gap ledger
                    └── cognitive-gaps.json
```

### 2. Redis Key Partitioning Schema
To enable instant prefix querying, rate-limiting, and student-level privacy boundaries:

| Entity | Canonical Redis Key Pattern | Example |
| :--- | :--- | :--- |
| **Student Profile** | `aim:students:{studentId}` | `aim:students:lara` |
| **Cognitive Gap Ledger** | `aim:ledger:{studentId}:{subjectId}` | `aim:ledger:lara:maths` |
| **Assessment Record** | `aim:assessments:{studentId}:{subjectId}:{yearGroup}:{termWeek}:{assessmentId}` | `aim:assessments:lara:maths:Y4:3:asm_17929` |
| **Remediation Sprint** | `aim:sprints:{studentId}:{subjectId}:{sprintId}` | `aim:sprints:lara:maths:sprint_17929` |
| **Coaching Guide** | `aim:guides:{studentId}:{subjectId}:{guideId}` | `aim:guides:lara:maths:guide_17929` |
| **Intake File Fingerprint**| `aim:fingerprint:{guardianId}:{fileHash}` | `aim:fingerprint:guardian_123:hash_abc` |

### 3. Student Identification & Vision Classification Rules
To eliminate hardcoded placeholders:
1. **Multi-Student Detection Gate**:
   - Every incoming quiz image is passed to the Vision Model with a prompt to detect:
     - `detectedStudentName`: Look for "Lara", "Maya", or other student name written on the header.
     - `detectedSubject`: Classify whether the quiz is "Mathematics" (numeracy, arithmetic, geometry, number lines) or "English" (spelling, vocabulary, reading comprehension, grammar).
     - `detectedWeek`: Extract term week (e.g. Week 3, Week 4).
     - `detectedYearGroup`: Extract Year 4 (Y4), Year 5 (Y5), etc.
   - If confidence on student identity is below threshold, match against the guardian's enrolled children (`guardian.studentIds`). If ambiguous, dispatch a quick inline keyboard in Telegram: *"Who completed this quiz? [ Lara ] [ Maya ]"*.

2. **Batch / Media Group Aggregation**:
   - Quizzes uploaded as albums (up to 10 photos) share a Telegram `media_group_id`.
   - The edge intake MUST buffer all photos within a 3-second debounce window, assemble them into a single ordered multi-page assessment, and execute **one single vision evaluation** rather than firing separate jobs for each individual page.

3. **Direct PDF Delivery via Messaging**:
   - The Telegram bot MUST send the actual `.pdf` document directly (`sendDocument`) in addition to providing web console review links.
   - External shortlink providers (Dub.co) must NOT gate core delivery or be used on every internal generated preview.

---

## Day-Zero Migration & Transition Plan

### Phase 1: Dual-Read Compatibility (Non-Breaking)
The storage adapter layer (`StorageFactory`) implements a dual-read fallback:
1. Attempt read at the new canonical hierarchical key.
2. If null, attempt read at legacy flat key (`aim:assessments:<id>`).
3. If legacy record found, promote it atomically to the canonical key before returning.

### Phase 2: Manifest-Driven Batch Migration
A dedicated script (`scripts/migrate-storage-hierarchy.ts`) scans:
1. All legacy Redis keys matching `aim:assessments:*`, `aim:sprints:*`, `aim:guides:*`.
2. Inspects payload metadata (`studentId`, `subjectId`, `yearGroup`, `termWeek`).
3. Writes canonical structured keys and soft-deprecates flat keys with a 7-day TTL.

### Phase 3: Filesystem & Asset Archive Reorganization
Organize existing pilot sources in `hex-aim-private/sources/`:
- `sources/` -> `students/lara/asten-college/2026-2027_Y4/maths/`
- `sources/` -> `students/maya/asten-college/2026-2027_Y4/maths/`

## Consequences
- **Positive**: Strict data isolation between siblings (Lara and Maya) prevents cognitive gap contamination.
- **Positive**: Direct prefix queries allow fetching all Year 4 English assessments in O(1) without iterating entire database.
- **Positive**: Deterministic folder structure allows seamless export, backup, and GDPR data portability.
- **Negative**: Existing unindexed flat test keys need automated migration (handled by Phase 1 dual-read adapter).
