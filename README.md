# The Next Farmer / द नेक्स्ट फार्मर

**Farmer-first digital agriculture for India.** A Marathi/English planning and record-keeping pilot; designed to grow into a trustworthy crop-to-sale ecosystem.

> **Status — v0.2 development:** Code is available for an offline prototype and a PostgreSQL-backed, authenticated pilot. Neither is production-approved. No farmer field study, agronomist validation, live deployment or real-database acceptance is claimed.

## What works in code

| Feature | Offline v0.1 | Database-backed v0.2 |
|---|---|---|
| Dashboard, farms, crop seasons, expense/profit calculator | Browser-local storage | Per-account PostgreSQL APIs |
| Marathi + English UI | Yes | Yes |
| Crop guidance | Six unreviewed educational checklists, visibly labelled | Only independently reviewed, published guides (none auto-published) |
| Expert questions / response | No | Human expert queue and sourced responses |
| Authentication | No | Email/password, scrypt, HttpOnly server sessions, CSRF checks |
| Backup/export | Local JSON export/import | **Not implemented yet** (production blocker) |

## Quick start: offline demonstration
Requires Node.js >=20 and does not require dependencies:
```bash
npm run dev
```
Open http://127.0.0.1:5173 and **do not enter sensitive farmer data**. Data is local to that browser; it does not automatically transfer to server mode.

## Quick start: database-backed development pilot
Requires Node.js >=20 and a **separate PostgreSQL 15+ development database**.
```bash
npm install
cp .env.example .env
# Edit .env to use your own disposable development database credentials.
node --env-file=.env server/migrate.mjs
node --env-file=.env server/index.mjs
```
Visit http://127.0.0.1:8787. By default public registration is **disabled**. For isolated local tests, temporarily set `ALLOW_REGISTRATION=true` to create initial accounts and switch it off after the controlled test.

For Windows PowerShell:
```powershell
Copy-Item .env.example .env
node --env-file=.env server/migrate.mjs
node --env-file=.env server/index.mjs
```

For the independent crop guide workflow, create separate expert and editor accounts, then assign privileged roles locally with `node --env-file=.env server/grant-role.mjs user@example.com expert` (or `editor`). Only a different editor/admin can approve an author's submitted guide.

## Testing
```bash
npm run check
```
The local suite includes the original finance/browser checks and new API/security checks; the PostgreSQL integration test requires `TNF_TEST_DATABASE_URL` and an initialized disposable database. GitHub CI has a PostgreSQL service for that integration test. **Passing a mocked API test is not evidence of live database acceptance.**

## Reference documentation
- [Master requirements blueprint](docs/FARMER_REQUIREMENTS_MASTER_BLUEPRINT.md)
- [Farmer journeys & personas](docs/FARMER_JOURNEYS_AND_PERSONAS.md)
- [Research and validation plan](docs/FIELD_RESEARCH_AND_VALIDATION.md)
- [Development roadmap](docs/PRODUCT_ROADMAP.md)
- [Data safety and trust](docs/DATA_SAFETY_AND_TRUST.md)
- [Official source register](docs/OFFICIAL_SOURCES.md)
- [Offline MVP implementation](docs/MVP_IMPLEMENTATION.md)
- [Secure pilot implementation, APIs and safety limitations](docs/SECURE_PILOT_IMPLEMENTATION.md)

## Data safety
This repository is **public**. Never commit `.env`, database passwords, private farmer records, Aadhaar numbers, bank details, land-record originals or identifying interview transcripts. This is **not yet a secure public SaaS**: password recovery, email verification, farmer data deletion/export, distributed abuse protection, verified expert credentials, monitoring, backup/restore, production security review and safe agronomic content publication remain pending. Do not deploy the development server publicly.
