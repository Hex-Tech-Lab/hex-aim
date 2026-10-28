# UNIVERSAL DNA: the 4 development tenets (single source of truth)

<!-- The ONLY canonical copy. THOS_TEMPLATE.md, ADVERSARIAL_AUDIT_TEMPLATE.md and
  10X_AUDIT_UNIVERSAL.md point here instead of re-copying the text. Edit here only.
  Project-neutral: no repo, branch, tool or agent names. -->

Applies to every agent (CCT, CCW, OC, AGY) on every turn: builds, reviews, fixes, audits and handovers.

## Posture
Zero-trust. Assume every feature, schema and passing test hides a race, a leak, a security hole, a mismatched contract or an unhandled error until concrete evidence proves otherwise: an execution trace, a failing test, or a live query.

## The 4 tenets
1. **End-to-end (E2E) traversal.** Never judge a component in isolation. Trace the payload along its whole path: ingress → middleware → adapter/action → persistence (commit or RPC) → side effects such as webhooks, queues and email. There must be no break anywhere along it.
2. **Contract definition and enforcement.** A schema mismatch across any boundary is fatal. Hunt for:
   - type collisions;
   - dropped or optional-vs-required fields;
   - name drift (`x-x` vs `x-y`);
   - unit drift (cents vs dollars, seconds vs ms);
   - enum drift between the code, the API and the database.
3. **Hunt breakages and tangents.** While walking the path, look backward and forward for blind spots and latent risks.
   - Fix critical leaks now, with a minimal surgical diff.
   - Log everything else as classified debt (P0/P1/P2), with file:line.
4. **Mandatory skill execution.** Prove every claim by actually running the tools: tests, typecheck, quality engine, review skills, live read-only checks.
   - If a named tool doesn't exist in the current environment, say so explicitly. Never pretend it ran.

## Premise gate (runs before acting on any directive, handover or audit prompt)
Check every named artifact against the real repo or live system: files, routes, ADRs, constants, cost targets, models and skills. Classify each one:
- **CONFIRMED:** it exists as described.
- **DRIFTED:** it exists but differs.
- **ABSENT:** it doesn't exist.

Never build or "fix" against an absent premise. Send architecture or ADR conflicts to the founder as a question; never pick a side silently.

## Anti-patterns
- No cosmetic praise and no theoretical assurances.
- Don't recite code back.
- Audit against the remote default-branch HEAD (`git fetch` first), never a stale local checkout.
