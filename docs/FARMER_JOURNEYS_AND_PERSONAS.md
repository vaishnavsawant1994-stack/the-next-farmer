# Farmer Personas and End-to-End Journeys
Version 0.1 — Hypothetical research personas; do not mistake for interviewed people.

## 1. Archetypes and assumptions to validate
**A. Small rainfed field-crop farmer:** 1–2 ha, dependent on uncertain rains, limited spare cash. Question: What crop and sowing window make sense given water and investment?

**B. Marginal horticulture farmer:** <1 ha, high-quality but perishable harvest, input-heavy season. Question: Why is the crop unhealthy, and what will I actually earn after sale costs?

**C. Tenant/sharecropper:** Operates land without ownership title; may be excluded from some formal support. Question: Which services and assistance can I actually use without ownership records?

**D. Woman managing household farming:** May have shared devices, informal decision authority and less access to training. Question: Can I privately and confidently manage crop work and records in my language?

**E. Commercial irrigated horticulture grower:** Multiple plots, changing workforce and pest risks. Question: How do I coordinate schedules, ensure traceable advice and track margins by plot?

**F. Livestock + cropping household:** Time and money split between feed, herd health and crop work. Question: How do I manage routines, costs, seasonal risks and professional referrals?

**G. Young first-time farmer:** No strong historical yield/cost baseline. Question: What can I reasonably grow without overinvesting or being misled by online income claims?

**H. FPO member/manager:** Aggregates multiple growers and deals with buyers and grading. Question: How do we get verified prices, track quality and improve collective returns?

**I. Agricultural labourer:** Landless or seasonal worker with inconsistent income. Question: Where is legitimate work, what wage and payment evidence is available, and how do I avoid fraud?

**J. Agricultural adviser/KVK expert:** Must triage incomplete reports under time pressure. Question: Can requests arrive with enough structured information, and can we audit what was advised?

## 2. Universal journey map
| Stage | Farmer decision | Required inputs | Assistance | Failure we must avoid |
|---|---|---|---|---|
| Discover | Is this advice relevant? | Language, region, crop | Public crop guide | Pretending advice is universally applicable |
| Register (optional) | Is it safe to share details? | Minimal consented details | Accessible setup | Requiring Aadhaar/land title by default |
| Plan | What crop, cost, date? | Soil, water, labour, budget | Planner + risk table | Guaranteed profit/yield claims |
| Prepare | What inputs are needed? | Variety, field area | Seed/spacing guide | Wrong units or brands disguised as advice |
| Sow | When and how? | Crop, weather, local calendar | Stage checklist | Outdated timing |
| Grow | How to manage crop? | Observations, weather, soil test | Water/nutrient/health guidance | Unsupported chemical advice |
| Respond | What if illness or storm occurs? | Photo, symptoms, forecast | Triage + expert | Delayed urgent escalation |
| Harvest | When is it ready? | Crop maturity, quality | Harvest/handling guide | Loss from unsafe storage guidance |
| Market | Where should I sell? | Grade, quantity, fees, prices | Verified data + netback | Stale prices shown as current |
| Payment | Was I fully paid? | Invoice, actual receipts | Sale ledger | False payment guarantee |
| Review | How to improve next season? | Actual costs/revenue | Crop-cycle report | Inflating net earnings |

## 3. Journey J01: onion grower, Maharashtra
- **Precondition:** farmer optionally enters a plot in Satana, crop onion, planting/transplanting date, irrigation availability.
- **Step 1:** farmer selects Marathi; sees public onion guide and its expert-review date.
- **Step 2:** farmer creates a crop season with optional variety and irrigation source.
- **Step 3:** system generates a *proposed* stage checklist based on a verified crop guide. Farmer can change dates; app records assumptions.
- **Step 4:** farmer records seed/seedlings, fertilizer, labour and pump expenses.
- **Step 5:** on yellow leaf symptoms, system asks which leaf part yellows first, when symptoms began, irrigation history and other signs; allows photos.
- **Step 6:** system lists plausible causes and red flags; if uncertainty/high-risk, creates a human expert ticket instead of prescribing a pesticide.
- **Step 7:** farmer marks harvest weight/grade and compares price and transportation estimates.
- **Step 8:** farmer records actual sale/payment and sees total cost, revenue, net margin and lessons learned.
- **Acceptance:** no precise doses/diagnoses without reviewed agronomic rule sets; no implicit live mandi feed; ledger totals correct; public access remains possible.

## 4. Journey J02: rainfed farmer
- Enters expected crop, seasonal budget, soil and water constraints.
- Sees risk considerations, weather-source age and conditional sowing checklist.
- Receives warning when forecast provider reports weather risk, with opt-in communication and acknowledgment.
- Can mark actions done and compare actual versus planned cost.
- Acceptance: no promise to forecast exact rainfall, no automatic choice disguised as certainty.

## 5. Journey J03: tenant farmer / scheme explorer
- Onboarding asks **operating relationship**, not ownership proof.
- Explores scheme pages showing official source and beneficiary/landholding caveats.
- An eligibility pre-check explains what is unknown and sends user to government portal for official decision.
- Acceptance: no false declarations, no unauthorized scraping of citizen data, no collection of ID numbers by default.

## 6. Journey J04: livestock household
- Tracks animals, recurring feed costs and vaccinations if entered.
- If animal has illness symptoms, shows warning signs and licensed veterinarian referral.
- Acceptance: does not give unsupported drugs/doses, distinguishes advice from veterinary diagnosis.

## 7. Journey J05: expert receives a crop health report
- Queue shows symptoms, crop, stage, location approximation, history and image consent.
- Expert requests missing evidence, adds diagnosis confidence and cites local sources.
- Reviewer checks recommendations requiring higher-risk intervention.
- Farmer receives reply in chosen language with follow-up date and contact.
- Acceptance: response tied to named expert, timestamps, audit trail; emergency escalation available.

## 8. Journey J06: market choice
- Farmer enters crop, variety, grade, harvest weight and selected market options.
- Prices are listed with source and timestamps; data can be entered manually if there is no valid API.
- Calculator subtracts transport, packaging, commission, taxes/fees if applicable and likely wastage as editable inputs.
- Shows *estimated* net realization and uncertainty. Actual sale entered afterward.
- Acceptance: calculation test vectors and stale-data warning pass.

## 9. Problem-to-guidance taxonomy
| Farmer intent (sample phrase) | Required context | Safe response mode |
|---|---|---|
| "What should I plant?" | District, season, water, soil, budget | Options with risks, not single guaranteed winner |
| "Why are leaves yellow?" | Crop stage, photo, pattern, irrigation, recent inputs | Triage and follow-up; expert escalation |
| "How much water?" | Crop stage, climate, soil, delivery method | Conditional reviewed guidance, not universal amount |
| "Which fertilizer?" | Soil test, crop, stage, local guidance | Soil-test-based or refer to test/expert |
| "What is today's rate?" | Crop, mandi, grade, timestamp | Fresh source label or cannot verify |
| "Can I get a subsidy?" | State, verified criteria, dates | Pre-check and official portal, not guarantee |
| "How much profit?" | Yield, actual costs, price, loss | Transparent calculations and assumptions |
| "My animal is sick" | Species, symptoms, urgency | Licensed veterinary referral |

## 10. Channels and inclusion
- Test Marathi voice and text separately; speech recognition may mishear crop names, units and chemical names.
- Offer typing and callbacks, not voice-only.
- Design for shared phone, older Android device, slow/mobile connectivity, numeracy variation and disability access.
- Never assume all farmers can pay, read English or upload high-resolution photos.
- Validate assumptions in field research before converting personas to verified requirements.
