# Plan: delete exercise and history data

**Status:** planned, not executed. The plan is ready for deletion work, but no data is removed until the steps below run.

## What can be deleted

| Store | Keys or files | Contains | Delete when |
|---|---|---|---|
| Upstash Redis `hexaimprod` | `aim:chat_history:{chatId}` | rolling Telegram chat window (last 20 turns) | on parent "clear chat", and after 30 days idle |
| Upstash Redis `hexaimprod` | `aim:instructions:latest`, `aim:instructions:log` | `#I:` instructions and 5-turn context | after the instruction is marked done and 30 days |
| Upstash Redis `hexaimprod` | `aim:bot_messages:{chatId}` | tracked bot message IDs for clear-chat | on clear-chat |
| Upstash Redis `hexaimprod` | `aim:assessments:*`, `aim:ledger:*` | assessment records and gap ledgers | only on the parent's written request, after the archive step |
| Repo files | `apps/web/public/archive/*`, generated sprint and guide HTML | exported child material | after the family's request, and never from git history without approval |

## Rules

1. **Parent request first.** A deletion request for a child's records is honoured in full. It covers Redis keys, archive files and any generated material for that child.
2. **Archive before erase for assessments.** Assessment and ledger records are written to the archive first, so the school's statutory record is not lost. Only the live copy is removed.
3. **Scope by child.** Delete only the keys and files that carry the child's ID. Never run a pattern delete over `aim:*`.
4. **Confirm the count.** Before a deletion, count the keys it will remove and log the count in the ledger. After, count again and confirm the number is zero.
5. **Log every delete.** Append a ledger line with the task ID, the scope and the counts. The ledger keeps no child names, only IDs.

## Steps (in order)

1. Add a `deleteChildData(childId)` function in `packages/core`, with the scope rules above.
2. Add tests: a deletion removes only that child's keys, archives assessments first, and leaves other children unchanged.
3. Add a Telegram command for parents to request deletion, which asks for confirmation before running.
4. Run the tests, then a dry run against `hexaimprod` that only counts keys.
5. Run the live delete only after the parent confirms in Telegram.

## Out of scope

- Git history: rewriting git history to remove past content is a separate decision and needs approval.
- Supabase: AIM does not use Supabase.
