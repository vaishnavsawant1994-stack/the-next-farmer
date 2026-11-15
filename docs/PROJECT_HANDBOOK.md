# The Next Farmer / द नेक्स्ट फार्मर — Project Handbook

> Owner: `vaishnavsawant1994-stack` · Repository: `the-next-farmer` · Reviewed: 15 November 2026  
> Documentation maturity: repo/source/manifest inspection; **not** an independent live release certification.

## Project overview and audience
Farmer-first English/Marathi planning companion for recording farms, seasons, crop guidance and expenses in India.

**Intended users:** Indian farmers, farm advisers and agritech teams.

## Main features / user journeys
1. Dashboard with active farm and crop summaries.
2. Farm/field and irrigation source records.
3. Crop season/sowing/stage/yield and farmer price assumptions.
4. Educational crop guidance and farming expense calculator.

These items are code areas and project goals; individual end-to-end flows must be qualified separately.

## Architecture, stack and repository layout
Lightweight local-first HTML/CSS/JavaScript app. `index.html`, `src/app.js`, `src/store.js`, `src/math.js`, `src/content.js`, `tools/serve.mjs`, `tests/` and product requirements docs. No remote account/server database is implied.

## What is actually qualified or still outstanding
Functional local-first pilot with English and Marathi; guidance is educational and unvalidated for every region/crop. Local storage is not multi-device sync or a secure backup.

Source code and historical QA reports are distinct from passing current CI, real integrations, live deployment and production acceptance.

## Installation and developer operations
`npm run dev` launches `node tools/serve.mjs`; `npm test`, `npm run check` validate source syntax and unit tests. Test using synthetic farm names, acreage and expenses.

Before running migrations, scripts or providers, verify environment, branches, private credentials, target database and rollback. Do not use actual user/customer records in unqualified development.

## Security and quality requirements
- Distinguish educational agronomy guidance from field-specific expert advice.
- Do not promise market price/weather accuracy without sourced data.
- Provide backups/export before farmers rely on permanent records.
Release acceptance also requires role/session auditing, dependency/security review, accessible interaction, observability, backups, restore and a controlled rollback where applicable.

## Prioritized roadmap
1. Test real farmer workflows in Marathi and low-connectivity devices.
2. Add consentful durable sync and export/restore.
3. Connect trusted locality/weather/market sources.
4. Validate crop and expense calculations with domain experts.

## Source-of-truth documents
- [`README.md`](../README.md)
- [`docs/FARMER_REQUIREMENTS_MASTER_BLUEPRINT.md`](../docs/FARMER_REQUIREMENTS_MASTER_BLUEPRINT.md)
- [`docs/PRODUCT_ROADMAP.md`](../docs/PRODUCT_ROADMAP.md)
- [`docs/MVP_IMPLEMENTATION.md`](../docs/MVP_IMPLEMENTATION.md)
- [`package.json`](../package.json)

**Maintenance:** Revisit this guide when functional implementation, project boundaries or deployment gates change. For precise status, read qualified exact-commit test and release artifacts.
