# Product Delivery Roadmap and Engineering Backlog
Version 0.1 | 2026-11-14 | Proposal — no application implemented yet

## Principle
Do not manufacture a broad feature-complete platform before validating a narrow, trustworthy farmer journey. Ship safe, testable value at each stage. Roadmap sequence describes dependencies, **not** date commitments.

## Phase 0 — Foundation and reality check
**Goal:** Verify needs, operational model and guardrails.
- [x] Create public repository and documentation index.
- [x] Draft master requirements and persona/journey blueprint.
- [x] Draft research, source, privacy and roadmap policies.
- [ ] Conduct 30–50 farmer interviews and record anonymized evidence.
- [ ] Recruit qualified agronomy reviewer(s) and define content responsibilities.
- [ ] Decide initial pilot crop(s), geography and language based on evidence.
- [ ] Define brand identity, information architecture and accessible UI design system.
- [ ] Verify data-provider terms, weather/market data access, prices and regulatory assumptions.
**Exit gate:** approved validated P0 scope, baseline research and signed-off high-risk advisory policy.

## Phase 1 — Foundational web application / P0
**Goal:** Functioning Marathi-first pilot for a farmer's single crop cycle.
- Secure authentication and optional read-only public mode.
- Farmer profile, plot, crop-season creation and data-unit conversions.
- Content publishing/review system and crop guide with sources.
- Crop-stage checklist with task calendar and local language.
- Expense ledger and tested break-even / margin calculator.
- Crop symptom intake with human-review workflow; conservative advice-only behavior.
- Source-labelled weather information if reliable provider is contracted; otherwise informational fallback with clear absence state.
- Privacy/export/deletion baseline, audit events and incident-report controls.
**Exit gate:** e2e test of farmer crop-cycle path; reviewer approval; threat model and data controls verified.

## Phase 2 — Decision support / P1
- Soil test report interpretations from verified source and expert-reviewed nutrient rules.
- Crop-specific irrigation logging / calculators.
- Market-price integration with freshness/staleness indicator and netback calculator.
- Scheme directory and **advisory** pre-screen with official redirection.
- Alert delivery, language QA, offline saved content where field-tested.
- Expert queues / response SLAs / review dashboards.
**Exit gate:** live provider contracts and source data validated; accuracy benchmark and farmer usability tests passed.

## Phase 3 — Farmer services / P2
- Trusted supplier, buyer and service directory with transparent vetting.
- Harvest, inventory, buyer leads, sale and payment ledger (no money custody).
- Equipment rental leads; FPO participation and group record coordination.
- Allied farm activity logs; veterinarian referrals.
- Expanded languages, crops, geographical coverage with localized editorial review.
**Exit gate:** safety, fraud controls, partner SLAs and rural usability validated.

## Phase 4 — Advanced intelligence / P3
- Optional crop-risk models using authorized data and measured performance.
- Precision irrigation/IoT connectors with user override and safe defaults.
- FPO crop aggregation, quality and traceability.
- Optional authorized public infrastructure integrations (AgriStack etc.) if applicable; never assume API access.
- Advanced dashboards only where farmers observe real value.
**Exit gate:** model monitoring, fairness review, human oversight and incident response demonstrated.

## 52-screen planned inventory
See section 6 of the [Master Blueprint](FARMER_REQUIREMENTS_MASTER_BLUEPRINT.md). No screen has been marked fully implemented; page-count is a **proposed inventory** and may change after research.

## Prioritized initial work items
| ID | Priority | Deliverable | Acceptance evidence |
|---|---|---|---|
| TNF-001 | P0 | Interview protocol + recruitment | Coverage, consent, anonymized evidence |
| TNF-002 | P0 | Agronomy source register | Source owners, content rights, refresh cadence |
| TNF-003 | P0 | Product / UI information architecture | Farmer-approved Marathi navigation prototype |
| TNF-004 | P0 | App scaffold / CI / quality gates | Reproducible build, lint, test, security scan |
| TNF-005 | P0 | Authentication / role controls | Auth tests, least-privilege tests |
| TNF-006 | P0 | Farm plot and crop-season storage | Create/read/update/delete, validation, tenant role |
| TNF-007 | P0 | Crop guide CMS and review | Draft-review-publish-retract audit flow |
| TNF-008 | P0 | Crop calendar and reminders | Date/season logic tests, editability |
| TNF-009 | P0 | Expense and net-return calculator | Unit/rounding/negative/zero scenarios pass |
| TNF-010 | P0 | Crop symptom intake / triage | Safe fallback and reviewer routing |
| TNF-011 | P0 | Privacy and data lifecycle | Consent, deletion/export, access audit |
| TNF-012 | P0 | Marathi accessibility pilot | Task-based test and language comprehension |
| TNF-013 | P1 | Weather provider adapter | Timestamp/source/coverage errors tested |
| TNF-014 | P1 | Soil report interpreter | Expert-reviewed, unit-aware test cases |
| TNF-015 | P1 | Market data/netback | Stale feed behavior and fee calculation tests |
| TNF-016 | P1 | Scheme index and redirection | Current official links + eligibility caveat |
| TNF-017 | P1 | Expert console and SLAs | Triage-to-closure auditability |
| TNF-018 | P2 | Verified buyer/services directory | Vetting, flagging, moderation |
| TNF-019 | P2 | Allied farming modules | Domain expert review |
| TNF-020 | P3 | Optional data/sensor intelligence | Consent, accuracy and safe override |

## Technical architecture (candidate; not selected yet)
**Client:** responsive low-bandwidth web/PWA with Marathi/Hindi/English internationalization; optional Android distribution only after pilot evidence.

**Backend domains:** identity/consent; farms/plots; crop cycles; guide CMS; advisory cases; task scheduling; ledger/calculations; weather/market adapters; scheme index; notifications; expert/admin; audit/observability.

**Data contracts:** versioned crop guides; explicit units/currencies and timezone; source/provenance objects; status freshness; immutable audit entries; typed domain events.

**Integration strategy:** provider adapters with fixtures, no invented availability; weather data and market data independent; documented retry/failure/expired-data states; official API terms review before production.

**AI strategy:** retrieval from approved/dated agricultural content; no high-risk unsupervised actions; confidence + source and expert handoff; evaluation sets per crop and language; incidents trigger content correction/retraction.

**Infrastructure:** select only after product/security requirements. Separate development/test/production; encryption, backups, least privilege, deployment review; no secrets or farmer records in GitHub.

## Engineering quality gates
- Code review and CI required before merging app changes.
- Tests: unit, integration, e2e, a11y, localization, security, source freshness and dangerous-advice red team.
- Observability: error rate, case SLA, incident count, content expiry, stale integrations, farmer task completion and feedback.
- No live launch until privacy notice, terms, consent, data lifecycle and expert review are complete.
- Data/third-party integrations must be explicitly marked live, simulated or unavailable.

## Definition of done
A feature is **done** only when farmer-facing UI, persistence, authorization, failure handling, localized content, tests, monitoring, documentation and release evidence all pass. A static preview or stub is not completed functionality.

## Current state
Documentation committed; field research pending; no production application, live API, farmer data or deployment.
