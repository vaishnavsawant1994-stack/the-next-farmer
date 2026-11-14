# The Next Farmer — Farmer Requirements Master Blueprint
Version: 0.1 | Date: 2026-11-14 | Status: proposed, pending field validation

## 1. Vision and scope
**Vision:** A dependable, practical, multilingual farming companion that helps farmers make better decisions from before sowing until sale and payment.

**Mission:** Reduce avoidable crop risk, informational gaps and administrative friction; improve farmers' ability to assess net returns, get timely advice, reach trustworthy services and retain control over their data.

**Geographic rollout:** Begin with a Maharashtra pilot in Nashik district, including Satana/Baglan. Expand by crop, agro-climatic zone and language only after expert content and data partnerships are verified. Pilot geography is a proposed product choice, not a statement that farmers have enrolled.

**Who it serves:** Small/marginal owner-operators; semi-medium, medium and large growers; tenant/sharecropping operators; landless agricultural workers; women farmers; youth/new entrants; horticulture and protected-cultivation growers; livestock and allied producers; farmer producer organisations (FPOs); licensed agronomists, KVK advisers, local extension workers and approved service partners.

**Out of scope for MVP:** Unlicensed pesticide prescribing, automatic lender eligibility decisions, guaranteed yield/price claims, money custody, loan origination, independent medical/veterinary diagnoses, and unauthorized access to government or private farmer datasets.

## 2. Farmer problems / jobs to be done
Farmers routinely need to:
1. Choose crop, variety and planting window suitable to **their** soil, water, climate, labour and budget.
2. Plan farm cash flow and compare input costs, time requirements and break-even sale price.
3. Get reliable seed, input and equipment information with locally available alternatives.
4. Diagnose unusual crop symptoms without confusing a photo guess for a lab or field diagnosis.
5. Decide **when**, **why** and **how much** to irrigate or apply nutrients using measured evidence.
6. React to forecasts and warnings early enough to prevent avoidable losses.
7. Keep simple field records, track tasks and remember crop-stage operations.
8. Understand government schemes, documents and real application procedures.
9. Compare net market returns after grading, commissions, transportation, spoilage and payment delays.
10. Access credible experts and escalation paths when recommendations are uncertain, risky or urgent.
11. Plan livestock care, feed and allied activities with qualified professional referral.
12. Share work with family/team while respecting privacy and role permissions.

## 3. Segments and accessibility
| Segment | Key constraint | Product response |
|---|---|---|
| Marginal (<1 ha) | Cash and labour constraints | Free core guidance, simple budgets, low-data mode |
| Small (1–2 ha) | Risk concentration | Multi-crop calendar, input comparison, market netback |
| Semi-medium (2–4 ha) | Operational coordination | Plot-wise logs and family roles |
| Medium/large (>=4 ha) | Multi-plot, staff coordination | Multi-user logs, inventory, analytics (later) |
| Tenant/sharecropper | No title document | Operated-field records independent of ownership; no false scheme promises |
| Women farmers | Shared phone, access/ownership barriers | Private accounts, role access, voice and easy navigation |
| Landless labourer | Work access and payments | Service/labour information in later phase |
| Rainfed farmer | Weather dependency | Risk-first warnings and conservative planning |
| Irrigated horticulture | Higher input intensity and perishability | Crop-stage guidance, crop health, net sale economics |
| Dairy/goat/poultry farmer | Animal health and feed | Records, preventive calendars and vet escalation |
| FPO/cooperative | Aggregation and logistics | Shared aggregation and market workflows later |

*Farm-size categories reflect operational holdings as defined by the Agriculture Census, not proof of land title.*

## 4. Product promises and service levels
1. **Local**: show language, crop, variety (if known), soil, irrigation, location, date and crop stage used in advice.
2. **Actionable**: tell users what to check, when to check again, and which professional or official service to contact.
3. **Honest**: show uncertainty, last verified date, source and where guidance cannot be safely personalized.
4. **Affordable**: do not place critical alerts or essential safety information behind a paywall.
5. **Simple**: Marathi-first pilot; support English/Hindi content with expert review, large targets, short tasks, voice where tested and low-bandwidth fallback.
6. **Accountable**: corrections, feedback, reporting, escalation and content revision logs.

## 5. Primary product domains and requirements
Each FR ID is an initial product requirement, not an implemented feature. P0 = pilot-critical; P1 = next; P2 = growth; P3 = advanced.

### A — Identity, farm and field setup
- **FR-001 [P0]** Sign up/log in with minimally identifying information; secure recovery; anonymous exploration before account creation.
- **FR-002 [P0]** Language choice and accessible, low-bandwidth onboarding.
- **FR-003 [P0]** Profile operating role (owner, tenant, manager, worker) without demanding ownership documents.
- **FR-004 [P0]** Farm/plot profile: district/taluka/village (optional precision), area + units, soil type, irrigation source, crop and planting date.
- **FR-005 [P1]** Household/team roles for shared farming decisions; explicit access scopes.
- **FR-006 [P1]** Optional uploaded reports with private encrypted access, retention controls and deletion.
- **FR-007 [P2]** FPO / cooperative membership and organization context.

### B — Crop planning and cultivation
- **FR-010 [P0]** Crop directory with season, agro-climatic applicability, source, revision date and known limits.
- **FR-011 [P0]** Guided crop planner considering water, soil, budget, planting period and labour, with explanation of trade-offs.
- **FR-012 [P0]** Stage-based cultivation calendar showing tasks, dependencies and reminders.
- **FR-013 [P0]** Seed, seedling, spacing and seed-rate guidance from reviewed sources.
- **FR-014 [P1]** Crop alternatives and scenario comparison: conservative cost, downside risk, break-even price.
- **FR-015 [P2]** Precision farming, protected farming, hydroponic and nursery guides where local economics justify them.

### C — Soil, nutrients and irrigation
- **FR-020 [P0]** Soil-testing education and report capture without implying laboratory analysis has occurred.
- **FR-021 [P0]** Display reviewed soil-report interpretations with units, reference ranges and validity context.
- **FR-022 [P0]** Water-source information, irrigation logs and stage-specific **conditional** schedules.
- **FR-023 [P0]** Nutrient advice only when crop, soil/water measurements and local expert-approved rule sets are sufficient; otherwise suggest testing/referral.
- **FR-024 [P1]** Irrigation/water-budget calculator with adjustable flow, system efficiency, rainfall and interval.
- **FR-025 [P2]** Sensor imports and irrigation optimization; manual override and safe failure state.

### D — Crop health and expert support
- **FR-030 [P0]** Report a problem by crop, location, age/stage, symptoms, photos and recent actions.
- **FR-031 [P0]** Offer differential possibilities with confidence/uncertainty and diagnostic next steps; not a definitive image-only diagnosis.
- **FR-032 [P0]** Expert review queue, triage, evidence requests, response status, follow-up and closure.
- **FR-033 [P0]** Chemical safety gate: no improvised pesticide concentration, off-label use, unsafe mixing or dosage without jurisdiction-, crop- and label-specific verification.
- **FR-034 [P1]** Preventive integrated pest management (IPM) guides and approved treatment decision trees.
- **FR-035 [P2]** Plant/lab referral and local extension-provider directory.

### E — Weather, alerts and tasking
- **FR-040 [P0]** Dated, source-labelled local forecast and warning view, indicating spatial/time uncertainty.
- **FR-041 [P0]** Relevant alerts for crop stages, expected adverse weather and upcoming tasks (opt-in).
- **FR-042 [P1]** Farmer-selectable SMS/WhatsApp/push/voice delivery where providers are integrated and consented.
- **FR-043 [P1]** Offline saved advisories and queued actions when connectivity returns.
- **FR-044 [P2]** Field observations and post-event damage evidence log.

### F — Money, risk and farm records
- **FR-050 [P0]** Expense ledger by plot/crop/category; date, amount, quantity, unit and notes.
- **FR-051 [P0]** Gross revenue, total cost, net margin, cost per unit, break-even price and editable assumptions.
- **FR-052 [P0]** Transparent calculator rounding and unit conversions; no hidden assumptions.
- **FR-053 [P1]** Scenario comparison for price, yield, transportation, labour and storage loss.
- **FR-054 [P1]** Loan and insurance information with sources and eligibility caveats; no application approvals implied.
- **FR-055 [P2]** Farm purchase receipts and invoice management; role-based access.

### G — Market, sale and logistics
- **FR-060 [P1]** Market prices showing crop, grade/variety, mandi, date/time, source and gaps.
- **FR-061 [P1]** Netback calculator: market price minus transport, grading, commissions, spoilage and other fees.
- **FR-062 [P1]** Harvest, grading, stock and storage records.
- **FR-063 [P2]** Verified buyer directory and lead requests; verification state visible.
- **FR-064 [P2]** Sale agreement, delivery and payment tracking with dispute reporting.
- **FR-065 [P3]** FPO aggregation, lots and traceability after market/partner compliance review.

### H — Schemes, official services and documents
- **FR-070 [P1]** Central/state scheme directory with official URL, state, eligibility, required documents, revision date and status.
- **FR-071 [P1]** Eligibility **pre-screen** explaining uncertain answers; redirect to official portal for application and final status.
- **FR-072 [P1]** Reminder of farmer-selected scheme deadlines only when independently verified.
- **FR-073 [P2]** Guided documentation education: land-record terminology, crop registration, insurance claims and grievance paths.
- **FR-074 [P3]** Authorized official integrations only with published contracts, lawful basis, access control and consent.

### I — Allied agriculture and community
- **FR-080 [P2]** Dairy, goat, poultry, aquaculture and mushroom record templates.
- **FR-081 [P2]** Livestock health questions routed to a licensed veterinarian; no definite remote diagnosis.
- **FR-082 [P2]** Directory of accredited experts, KVKs, input testing services and service providers.
- **FR-083 [P2]** Farm equipment rentals, verified service providers and farmer-help resources.
- **FR-084 [P3]** Moderated peer Q&A, expert office hours and FPO procurement tools.

### J — Administration, sources, trust and platform
- **FR-090 [P0]** Editorial CMS with author, reviewer, scientific source, applicability metadata and expiry/review date.
- **FR-091 [P0]** Role permissions for farmer, expert, editor, administrator and support operator.
- **FR-092 [P0]** Source provenance and citations shown for consequential advice.
- **FR-093 [P0]** Audit trail for content publication, overrides and expert advice.
- **FR-094 [P0]** Consent management, export/deletion request process and security baseline.
- **FR-095 [P0]** Incident reporting for harmful advice or data exposure; withdraw/rectify affected content.
- **FR-096 [P1]** Analytics about successful task completion with privacy-preserving aggregation.
- **FR-097 [P1]** Translation, voice and language QA by crop/domain experts.
- **FR-098 [P2]** Integration monitoring, provider health and data freshness indicators.

## 6. Proposed application surfaces / page inventory
**Public / discovery (6):** Home; crop library; crop guide detail; scheme directory; farmer knowledge center; contact/help.

**Farmer account (20):** Sign in/onboarding; farmer home; farms/plots; plot detail; crop plan wizard; crop calendar; crop guide; seed/spacing planner; soil report; irrigation log; nutrient guidance; crop-health report; crop-health case detail; weather/alerts; expense ledger; profit calculator; harvest/stock; market comparison; scheme pre-check; settings/privacy.

**Expert and extension (7):** Expert overview; incoming cases; case workspace; follow-ups; knowledge references; advisory response review; escalation directory.

**Editorial/administration (9):** Operations dashboard; users/permissions; crop content; source library; translation review; alert rules; provider status; safety incidents; audit and privacy requests.

**Growth surfaces (10):** Buyer directory; buyer inquiry; sales and payment; equipment rental; services directory; FPO dashboard; inventory; livestock records; community Q&A; training center.

**Total candidate screens: 52**. Counts are planning inventory, not evidence of implementation. Detailed UX and route mapping follow user research; mobile-web responsiveness is required, but native apps are not MVP prerequisites.

## 7. Ten end-to-end farmer scenarios
1. Rainfed farmer selects crop and sees resource/risk trade-offs before sowing.
2. Onion farmer creates plot, enters sowing date, receives verified crop-stage checklist.
3. Farmer adds soil report and sees which interpretation requires lab/expert confirmation.
4. Farmer spots yellowing leaves, submits photos and receives investigation steps and expert escalation.
5. Forecast warns of heavy rain; farmer sees dated source and stage-relevant precautions.
6. Farmer records seed, fertilizer, labour, transport and irrigation expenses; calculates break-even.
7. Farmer compares two mandi prices using netback after costs, not only headline price.
8. Tenant farmer registers operated land without being falsely declared owner/eligible for owner-only scheme.
9. Farmer reviews scheme documents and opens the verified government portal.
10. Farmer withdraws permissions/exports/deletes data and can still read public crop guidance.

## 8. User experience and localisation
- Default Marathi for Maharashtra pilot; add Hindi/English with editorially approved translations.
- Support Devanagari font accessibility, simple vocabulary, pictograms, voice input/output after reliability tests.
- Use local units (acre, guntha, hectare, litre, kg, quintal) and clear conversion display.
- Make key decisions possible with intermittent connectivity and low-end Android phones.
- Explain alerts with *why this matters*, *when to act*, *source*, *confidence*, *who to contact*.
- Accessible contrast, screen-reader labels, large touch targets, keyboard support.
- Do not assume only one smartphone per farmer or a private phone number.

## 9. Acceptance criteria for earliest release
- A farmer can use basic public guidance without submitting identity documents.
- Onboarding supports at least Marathi with tested real-user comprehension.
- A farmer can maintain one plot, one crop cycle, tasks and a dated expense ledger.
- Net-margin, break-even and unit conversion calculations match known test vectors.
- Every agronomic recommendation in the pilot has a source, reviewer, applicability and reviewed date.
- Weather and market information are not shown as live if no fresh provider data exists.
- Ambiguous crop health cases ask for more evidence or escalate, never hallucinate prescriptions.
- Privacy controls work and are tested, including deletion/export workflows.
- At least one real end-to-end pilot journey passes with farmer + agronomist observers.

## 10. Decision log and open questions
1. Farmer research must establish the 3 highest-frequency and 3 highest-cost problems by crop/region.
2. Validate which communications channels work: voice, app, SMS, WhatsApp, local expert.
3. Confirm crops for pilot (onion is a candidate, not yet approved).
4. Verify content rights, expert credentials, government data usage agreements and provider costs.
5. Determine whether offline-first is essential for pilot villages from connectivity observations.
6. Confirm safe economics of offering core guidance free; no premature subscription claims.
7. Choose architecture/hosting/database only after usage, security and deployment constraints are documented.

See [personas/journeys](FARMER_JOURNEYS_AND_PERSONAS.md), [research](FIELD_RESEARCH_AND_VALIDATION.md), [roadmap](PRODUCT_ROADMAP.md), [safety](DATA_SAFETY_AND_TRUST.md) and [official sources](OFFICIAL_SOURCES.md).
