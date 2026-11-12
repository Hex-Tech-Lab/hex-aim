# LMS API investigation (public information only)

Date: 2026-11-11. Scope: public, unauthenticated GET requests only. No login, no credentials, no form submission, no POST to any school endpoint.

## Summary

- **Host found in repo: yes, but not confirmed as the parent app host.** The only school host in the repo is `sims.astencollege.com`. The repo calls it the SIMS gradebook sync endpoint. Its public login page is an ASP.NET WebForms "School Information Managment System" (sic) login, not a parent-facing app.
- **Parent app features (Posts, Message, Menu, quiz lists):** not found anywhere in the repo. No host for them was found.
- **Endpoints found:** 2 host paths (login at `/`, gradebook sync at `/api/v1/gradebook-sync`), 2 ASP.NET handler paths (`ScriptResource.axd` x3, `WebResource.axd` x1), and 7 static scripts. **0 endpoints return results, quizzes, attendance, homework or posts** in the public JS.
- **Auth observed:** no 401 or 403 anywhere. The login page and all 11 scripts return 200 unauthenticated. The gradebook sync path returns 404 on an unauthenticated GET, which is a "route not present" result, not auth evidence.

## Method

1. `rg` for `lms|asten|sims|parent portal` in hex-aim, and for the same terms in hex-expan docs. hex-expan docs had no hits.
2. `rg` for `https?://` URLs containing `lms|asten|sims|school|portal|parent` across hex-aim source and docs.
3. GET `https://sims.astencollege.com/` (login page), then GET the 11 scripts that page references. Each request used a normal browser User-Agent and no cookies.
4. One probe GET to `/login` (not linked from the login page, guessed). Returned 404.
5. `rg` over the downloaded scripts for `/api`, `.ashx|.asmx|.svc|.aspx`, and the terms grade, quiz, result, attendance, homework, post, message, menu, score.

## Endpoints

| Endpoint | Method | Purpose (evidence) | Auth required (observed) | Source file |
|---|---|---|---|---|
| `https://sims.astencollege.com/` | GET | Public login page, ASP.NET WebForms ("School Information Managment System"). Serves a login form and loads the scripts below. | No: 200 unauthenticated | Live response (scratch copy only). Host reference: `packages/core/src/school/SchoolMisSyncEngine.ts:20` |
| `https://sims.astencollege.com/` (form postback to `./`) | POST | Login form fields `ctl09$txtUserName`, `ctl09$txtPassword`, image button `ctl09$imgbLogin`. Not submitted. | Login required (form present). Not tested: no credentials. | Live login page markup |
| `https://sims.astencollege.com/api/v1/gradebook-sync` | GET | Repo names this as the gradebook push target: "Pushes completed home Socratic remediation results back to the school gradebook" (the code is in-memory and does not call it). Unauthenticated GET returned 404 with the same body as `/login`, so the route is not present for GET. | Not determinable. 404 is not an auth response. POST not tested because it would write to a school system. | `packages/core/src/school/SchoolMisSyncEngine.ts:20`, `apps/web/src/ui/tabInfraGate.ts:95` |
| `https://sims.astencollege.com/login` | GET | Probe only (guessed, not linked). Returned 404 with the same body as the sync path. | No route | Not in repo; guessed probe |
| `https://sims.astencollege.com/ScriptResource.axd?d=...` (3 URLs) | GET | ASP.NET framework script handler, referenced by the login page. | No: 200 unauthenticated. No results data. | Login page `<script src>` tags |
| `https://sims.astencollege.com/WebResource.axd?d=...` (1 URL) | GET | ASP.NET embedded resource handler, referenced by the login page. | No: 200 unauthenticated. No results data. | Login page `<script src>` tags |
| `/Scripts/JS/jquery-3.3.1.js`, `/Scripts/JS/selectMenus.js`, `/Scripts/JS/commonFunctions.js`, `/ckeditor/ckeditor.js`, `/assets/vendors/base/vendors.bundle.js`, `/assets/demo/default/base/scripts.bundle.js`, `/assets/vendors/custom/datatables/datatables.bundle.js` | GET | Static scripts, all 200 unauthenticated. The site-specific files (`selectMenus.js`, `commonFunctions.js`) contain no `/api`, AJAX, fetch or page-handler URLs. Matches on grade, result, score, menu and post are generic library code (WebForms postback, DataTables, CKEditor). | No: 200 unauthenticated | Login page `<script src>` tags |

Not endpoints, but checked: the login page has no anchor links to other pages, so no further public routes were visible.

## Security finding (not a network result)

- `packages/core/src/school/SchoolMisSyncEngine.ts` line 21 hardcodes a live-looking `webhookSecret` for the Asten SIMS sync. The value is not reproduced here.
- During this investigation the value was printed once in search output. Treat it as exposed. Rotate it and move it to an environment or secret store.
- The sync engine contains no `fetch(` or HTTP call (`rg` for `fetch|method|POST|GET` returned no network lines). The sync is simulated, so the endpoint URL is configuration only.

## Other candidates checked

- `docs/ARCHITECTURE.md` lines 34-35 label the LMS as "Microsoft Graph API (Teams for Education)". No code in `apps` or `packages` or `scripts` calls Microsoft Graph or an education API. This is a design label only, not a host.
- `aim.getvintel.com/sources/*.jpg` and `/school/asten-college` are hex-aim's own assets and portal, not the parent LMS.

## Open questions for the parent

These cannot be answered from public information. They need a login, the app's network traffic, or the school's answers.

1. Which host does the parent app use for Posts, Message, Menu and quiz lists? The repo does not contain it.
2. Is `sims.astencollege.com` (the SIMS staff or MIS login) the same system the parent app uses, or a separate administration system?
3. Does the school use Microsoft Teams for Education (Graph) for parents? If so, which tenant, and is parent access granted through it?
4. Which account type does the parent have (parent, guardian, staff)? The login page shows a single generic username and password form.
5. Which URLs and methods do the quiz-list and results screens call, and do they return 401 or 403 without a session? Only the app's own traffic, or a login, can show this.
6. Does `/api/v1/gradebook-sync` exist on any host, and with what method and auth scheme? The school's API documentation or an authorized request is needed.
7. Should the exposed webhook secret be rotated now, and who owns that change? This is a founder decision.
