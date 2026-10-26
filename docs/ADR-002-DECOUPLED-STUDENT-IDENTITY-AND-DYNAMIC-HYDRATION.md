# ADR-002: Decoupled Student Identity, Zero-PII Internal Core, and Dynamic Egress Hydration

## Status
**ACCEPTED** (2026-10-26)

## Context
In early prototypes and iterations of HEX-AIM, internal code, storage paths, scripts, and artifact generation frequently used direct student first names:
- Internal scripts were named after children (e.g. `generate_lara.py`).
- Files and Redis keys contained unhashed, raw student names (`aim:assessments:lara:...`, `lara_review.html`).
- Generated sprint artifacts mixed presentation concerns (human-readable names for parents) with internal storage persistence.

This architecture presented three critical architectural and privacy problems:
1. **Privacy & Regulatory Risk (GDPR Art. 4(5), Art. 17, FERPA, COPPA)**:
   Child educational data is sensitive biometric and behavioral test data. Exposing Personally Identifiable Information (PII) throughout internal scripts, logs, job queues, and storage keys violates the Privacy-by-Design standard. Furthermore, when a family exercises their **Right to Erasure (Right to be Forgotten)**, deleting their account must not corrupt or force deletion of aggregated cognitive models, error-classification benchmarks, or curriculum gap research.
2. **Lack of Educational Portability Across Schools, Stages, and Countries**:
   School IDs or class names (`asten-college`, `Y4`) cannot be baked into immutable primary keys. A child moves from Year 1 through Year 13, changes schools, relocates to different cities or countries, or shifts between British and American curriculum tracks. The child's developmental and cognitive gap history must follow the child for life under one persistent, school-agnostic identity.
3. **Presentation Disconnect**:
   Attempting to resolve privacy by sending clinical student IDs (e.g., `sprint_STU-AST-Y4-001.pdf`) to parents produces an impersonal, frustrating experience. Parents expect warm, personalized files named after their children (`Lara's Science Detective Pack.pdf`), while the coaching sheet should specifically address the parent role (`Dad's Rapid Science Cheat Sheet for Lara & Maya.pdf`).

## Settled Industry Reference Standards
Rather than reinventing identity management, this decision adopts established, proven enterprise privacy and tokenization frameworks:
- **ISO/IEC 20889:2018**: Privacy enhancing data de-identification and pseudonymization techniques.
- **NIST SP 800-122**: Guide to Protecting the Confidentiality of Personally Identifiable Information (PII).
- **GDPR Article 4(5) & Article 32**: Pseudonymization with cryptographic decoupling of the re-identification key.
- **Enterprise Token Vault Pattern**: Isolation of sensitive PII into a secured Identity Vault, with stateless, tokenized operational pipelines.

---

## Decision

We establish a **Four-Tier Decoupled Identity and Presentation Architecture** across HEX-AIM:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        TIER 1: IDENTITY VAULT                          │
│         (Encrypted, Access-Controlled PII Token Vault)                 │
│                                                                        │
│   student_uid ──► { firstName, lastName, displayName, familyRole }    │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
                 Dynamic Egress      │ Tokenization Boundary
                 Hydration Only      │ (Zero PII flows inward)
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   TIER 2: INTERNAL CORE ENGINE                         │
│            (Anonymous, Opaque, Persistent Lifetime ID)                 │
│                                                                        │
│   • Global Student UID: stu_01j9ax8001lara                             │
│   • School-Agnostic, Stage-Agnostic, Country-Agnostic                  │
│   • Lifetime Longitudinal Cognitive Gap Ledger                         │
│   • Scripts: generate_sprint.py --student-uid <uid>                    │
│   • Storage: students/{student_uid}/assessments/{assessment_id}.json   │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
                                     │ Compiled Artifact
                                     │ (Anonymous File Matching)
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│               TIER 3: PRESENTATION EGRESS HYDRATOR                     │
│         (Just-In-Time Re-identification at Customer Edge)              │
│                                                                        │
│   • Inbound from Core: sprint_stu_01j9ax8001lara_science_midterm.pdf   │
│   • Hydrator lookup: student_uid ──► displayName = "Lara"              │
│   • Outbound File: Lara_Science_Detective_Sprint.pdf                   │
│   • Outbound Coach: Dads_Rapid_Science_Cheat_Sheet_Lara_Maya.pdf       │
│   • Channel: Telegram / WhatsApp / Web Console                         │
└────────────────────────────────────────────────────────────────────────┘
```

---

### Tier 1: Canonical Student UID (`student_uid`)
- Every child is assigned an immutable, globally unique, time-sortable canonical identifier (`student_uid`).
- **Format**: `stu_` prefix followed by a collision-free token (e.g., ULID or UUIDv7: `stu_01j9ax8001lara`, `stu_01j9ax8002maya`).
- **Invariance**: This ID is created upon first onboarding and **never changes**.
  - If the student moves from *Asten College (Cairo)* to *Dulwich College (London)*, `student_uid` remains identical.
  - If the student advances from *Year 4* to *Year 5* to *Year 11*, `student_uid` remains identical.
  - School enrollments, cohorts, and academic years are modeled as **mutable relational attributes**, not primary key path segments.

### Tier 2: The Identity Token Vault (PII Isolation Layer)
- Personally Identifiable Information is strictly confined to an isolated Identity Vault record:
  ```typescript
  export interface IdentityVaultRecord {
    studentUid: string;           // Canonical opaque foreign key
    firstName: string;            // e.g. "Lara"
    lastName: string;             // e.g. "Bakri"
    displayName: string;          // e.g. "Lara"
    dateOfBirth?: string;
    guardianIds: string[];        // e.g. ["guardian_5055012900"]
    preferredParentTitle: string; // e.g. "Dad" or "Mum"
    avatarUrl?: string;
    status: 'active' | 'anonymized' | 'archived';
  }
  ```
- **Cryptographic Shredding & Right to Erasure**:
  When a parent requests account deletion, the system deletes or shreds the student's `IdentityVaultRecord`.
  - The internal cognitive gap ledger, error taxonomy classifications, diagnostic scoring records, and anonymized worksheet performance data remain completely intact under `student_uid`.
  - Without the Vault record, `student_uid` is an irreversible pseudonym.
  - Aggregated data continues to power AI educational diagnostics and curriculum benchmarks without violating child privacy laws.

### Tier 3: Zero-PII Internal Core & Pipeline Execution
- **Script Conventions**:
  - NO script, job, or worker file may be named after a child (e.g. never `generate_lara.py`).
  - All generators are parametric and driven by canonical IDs:
    `python3 scripts/generate_sprint.py --student-uid <student_uid>`
    or `processAssessmentJob({ studentUid: string, ... })`.
- **Internal Storage & Redis Keys**:
  All internal files and caches use opaque keys:
  - Storage: `storage/students/{student_uid}/sprints/{sprint_uid}.pdf`
  - Redis: `aim:students:{student_uid}:gaps`
  - Temporary files: `scratch/sprint_{student_uid}_{subject}.html`

### Tier 4: Dynamic Presentation Hydration (The Egress Layer)
Re-identification occurs **only at the delivery edge** (the moment an artifact is dispatched to the parent):
1. **Student Sprint Document**:
   - The file sent to the parent is dynamically hydrated with the child's friendly name:
     `${displayName}_${subject}_${topic}_Sprint.pdf`
     *(Example: `Lara_Science_Detective_Sprint.pdf`, `Maya_Science_Detective_Sprint.pdf`)*
   - Inside the PDF, the detective badge is populated:
     `Student Detective: ${fullName} | Class: ${classLabel}`
2. **Parent Cheat Sheet**:
   - Dedicated coaching materials are dynamically hydrated to reflect the family configuration:
     `${preferredParentTitle}_Rapid_${subject}_Cheat_Sheet_${childrenList}.pdf`
     *(Example: `Dads_Rapid_Science_Cheat_Sheet_Lara_Maya.pdf`)*
   - Bedtime oral scripts explicitly address the parent role: *"Dad's 5-Minute Bedtime Oral Drill"*.
3. **Telegram / WhatsApp Captions**:
   - Delivered with warm, personalized messaging: *"Here is Lara's personalized 6-page Science Detective Pack for tomorrow's midterm!"*

---

## Standardized Naming Conventions Summary

| Context | Pattern | Concrete Example |
| :--- | :--- | :--- |
| **Canonical Student ID** | `stu_{unique_token}` | `stu_01j9ax8001lara` |
| **Class / Cohort ID** | `cls_{school}_{year}_{section}` | `cls_asten_y4a` |
| **Guardian ID** | `guardian_{chatId}` | `guardian_5055012900` |
| **Internal Script** | Parametric verb + noun (no names) | `scripts/generate_sprints.py` |
| **Internal Storage Path** | `students/{student_uid}/{subject}/{id}` | `students/stu_01j9ax8001lara/science/sprint_01.pdf` |
| **Internal Redis Key** | `aim:ledger:{student_uid}:{subject}` | `aim:ledger:stu_01j9ax8001lara:science` |
| **Delivered Student PDF** | `${displayName}_${Subject}_${PackType}.pdf` | `Lara_Science_Detective_Sprint.pdf` |
| **Delivered Parent Sheet** | `${ParentTitle}_Rapid_${Subject}_Cheat_Sheet_${Children}.pdf` | `Dads_Rapid_Science_Cheat_Sheet_Lara_Maya.pdf` |

---

## Consequences

### Positive
1. **Enterprise Privacy Compliance**: Full adherence to GDPR Article 4(5) and Article 17, FERPA, and COPPA standards through decoupled pseudonymization and cryptographic shredding.
2. **Permanent Longitudinal Portability**: A student's cognitive gap history is immortal across schools, grades, and international relocations.
3. **Flawless User Experience**: Parents and children never see cold technical database IDs; all customer-facing touchpoints are personalized and warm.
4. **Architectural Cleanliness**: Internal developer codebases and scripts are completely generic and reusable across unlimited cohorts and educational institutions.

### Negative / Trade-Offs
1. **Hydration Overhead**: Egress delivery adapters must query the Identity Vault to hydrate file names and headers before dispatch (mitigated by in-memory caching of active vault sessions in Redis with sub-millisecond lookups).
