# The Next Farmer — Database-backed Secure Pilot v0.2

**Status:** Implemented as development code, **not launched or production accepted**. The offline v0.1 MVP is preserved separately. Live PostgreSQL tests and farmer/qualified agronomist validation are still required.

## What was added
- New responsive farmer web portal at `/`, English + Marathi; original local-only prototype accessible at `/offline` in server mode.
- PostgreSQL schema: users, server-side sessions, farms, crop seasons, expenses, agronomy guide lifecycle, advisory cases and audit events.
- Farmer registration (disabled unless explicitly enabled for a controlled pilot), email/password sign-in, secure cookie sessions, logout and CSRF/origin checks.
- CRUD APIs for farmer-owned farms, crops, expenses; owner ID enforced by SQL with composite foreign keys; projected/actual farm financials reuse the v0.1 calculator.
- Reviewer/editor workflow for guides: draft → submit for review → independent editorial approval → published (or withdrawn). Farmers can only view published guides. **No guides are pre-approved or automatically published.**
- Advisory case submission, human expert/admin queue and sourced responses. No automated prescription or definitive remote diagnosis.
- Farmer interface for all core P0 records, guide library, case workflow and editorial desk.
- Automated Node tests for security boundaries, validation and preexisting financial/UI behavior; opt-in PostgreSQL integration test in CI.

## Prerequisites
- Node.js >=20, npm
- PostgreSQL 15+ or a managed PostgreSQL server (the migration uses a composite foreign-key SET NULL column list)
- A dedicated **development database**. Never connect this experimental system to live farmer/patient/financial records.

## Start locally
1. Clone the repository and run `npm install`.
2. Create a fresh PostgreSQL database and a least-privilege development login; update the connection URL. Run `cp .env.example .env` and configure values. **Node does not automatically read .env**; load it with a local shell or Node's built-in `--env-file` option (Node >=20.6), e.g. commands below.
3. Run `node --env-file=.env server/migrate.mjs` once.
4. For a closed pilot leave `ALLOW_REGISTRATION=false`. For a disposable local test you may temporarily set `ALLOW_REGISTRATION=true`, start server and register two accounts; immediately turn it back off.
5. Start `node --env-file=.env server/index.mjs` and visit `http://127.0.0.1:8787` (or the exact `PUBLIC_ORIGIN`).
6. Use `npm run check` for tests and syntax validation.
7. Grant roles *only through a trusted local database operator*: `node --env-file=.env server/grant-role.mjs expert@example.com expert`, and similarly for an independent **editor** account. An editor must be a different account from the guide author to publish.

**Windows PowerShell example:**
```powershell
Copy-Item .env.example .env
# Edit .env with your own PostgreSQL development credentials.
node --env-file=.env server/migrate.mjs
node --env-file=.env server/index.mjs
```

**Do not expose the local HTTP pilot to the internet.** Public deployment requires TLS, external shared rate limiting, verified email/invitations, operational backups, privacy and deletion controls, monitoring, independent penetration testing and agronomist-reviewed content.

## API overview
| Route | Methods | Who | Behavior |
|---|---|---|---|
| /api/auth/me | GET | any | Current session and CSRF token |
| /api/auth/register | POST | opt-in controlled pilot | Account creation with password hashing |
| /api/auth/login, /logout | POST | any / signed-in | Issue/revoke server-side session cookie |
| /api/snapshot | GET | signed-in | Farmer's own fields, crops, expenses |
| /api/farms, /api/farms/:id | POST / PATCH / DELETE | farmer/account holder | Field record, ownership enforced |
| /api/crops, /api/crops/:id | POST / PATCH / DELETE | farmer/account holder | Crop season, farm ownership enforced |
| /api/expenses, /api/expenses/:id | POST / PATCH / DELETE | farmer/account holder | Expense, crop ownership enforced |
| /api/guides | GET | signed-in | Published only for farmer; all for editor/expert/admin |
| /api/guides | POST | expert/editor/admin | Create draft |
| /api/guides/:id/submit | POST | draft author with editorial role | Submit for review |
| /api/guides/:id/publish | POST | independent editor/admin | Explicit confirmation and publication |
| /api/guides/:id/withdraw | POST | editor/admin | Withdraw published content |
| /api/cases | GET / POST | user (view own); expert/admin (view queue) | Human advice requests |
| /api/cases/:id/respond | POST | expert/admin | Sourced human response |

### Security boundaries and limitations
- Cookie is HttpOnly and SameSite=Strict, Secure on HTTPS; server persists **only SHA-256 session token digest**.
- Passwords use salted, memory-hard scrypt (not reversible encryption).
- Mutating endpoints require matching `Origin` and CSRF token; server sends CSP, no-store and anti-framing headers.
- Accounts cannot edit/read another farmer's records by path ID; SQL `WHERE user_id=$...` and composite owner foreign keys protect linked records.
- All input validation is server-side. Prepared SQL parameters prevent user-controlled values becoming SQL source.
- Registration disabled by default; no password reset, email verification or 2FA yet. **Do not invite real farmers to put sensitive identity, land, bank or financial records into this preproduction app.**
- In-memory auth attempt limiting is a development guard only; replace with shared durable limits in production.
- Admin role assignment is manual and database-privileged; do not expose public grant route.
- Guide author/reviewer separation is enforced in the DB update, but formal agronomist credential verification is not yet implemented.
- Advisory responses are manually written, so their scientific accuracy still requires trained reviewers; never assume a role badge proves expertise.
- Database audit writes and their business mutation are not yet wrapped in one transaction; fix before real production acceptance.
- No data migration from existing browser-local records has occurred: **do not assume old browser entries are on the server**.

## Acceptance checklist
- [x] Implement v0.2 application code and DB schema.
- [x] Unit/API handler checks, including baseline v0.1 tests.
- [ ] Install `pg`, start PostgreSQL and run real migration in target environment.
- [ ] Verify GitHub CI PostgreSQL integration suite is green.
- [ ] End-to-end browser walkthrough against actual database.
- [ ] Production-grade authentication, deletion/export, backups, alerts and independent security review.
- [ ] Real farmer interviews, localized usability and expert sign-off on guides.
- [ ] Hosting/deployment approval and domain/HTTPS configuration.

## Priorities after this PR
1. Run database integration + browser acceptance in a real development environment.
2. Add proper farmer account deletion/data export, password reset/email verification and shared throttling.
3. Invite qualified agronomy reviewers; create verified, localized crop guides.
4. Validate field usability with farmers, especially low-connectivity and shared phones.
5. Add source-labelled weather/market providers only after official data licensing and freshness guarantees.
