# Farmer Data, Agronomic Safety, Privacy and Trust
Version 0.1 | 2026-11-14 | Draft operating requirements, not legal advice

## 1. Non-negotiable safety policy
- Distinguish general education from personalized agronomic advice.
- Expose author, source, crop, stage, geographic applicability, last review date and confidence where relevant.
- Give multiple plausible causes and verification steps for photo/symptom reports. Do not make image-only definitive diagnoses.
- Do not fabricate experimental results, weather forecasts, market rates, scheme eligibility, guaranteed profits or official affiliation.
- Pesticides, fungicides, herbicides, fertilizer mixes and animal medicines can be hazardous. Never output operational chemical instructions without an approved, current, crop/region-specific source and qualified review as appropriate. Show label/safety, protective-equipment, pre-harvest interval and escalation context when applicable.
- Route red-flag cases to qualified experts or official emergency services; do not encourage delay for hazardous exposures.
- Livestock treatment involving medicine/dosage requires licensed veterinary oversight.
- Alerts must be clear whether they are observed, forecast, modeled, manually entered or unavailable.

## 2. Privacy by design
Farmer record data belongs to the farmer's account and is not public GitHub content. Avoid collecting Aadhaar numbers, bank account information, detailed land title, precise home addresses or biometric data unless a necessary, lawful, clearly consented future use is approved.

Data minimization:
| Category | Pilot handling |
|---|---|
| Language/rough district | Minimal preference; read-only public guides possible |
| Farm area/crop/season | Optional, farmer-controlled, private |
| Plot geolocation | Opt-in only if needed; coarse location default |
| Photos of crops | Purpose-specific consent; remove unnecessary metadata |
| Expense records | Private, not used for marketing without separate lawful basis |
| Phone/email | Auth or alert delivery only; separate contact permission |
| Medical/personal identity records | Not required for MVP |
| Government Farmer ID | Do not require/store by default; later legal/API review |
| Expert notes | Confidential, role-restricted with retention policy |

- Purpose limitation, notice in chosen language, user controls for sharing, export/correction/deletion requests.
- Consent state changes with timestamp, scope, revocation and audit.
- Support legal retention and deletion timelines after counsel review.
- Implement encryption in transit and at rest, strict authorization per farmer/plot, secret management, backup/restore testing and incident response.
- Avoid public user directory and any unconsented sale/sharing of personal farm data.
- Test shared-device privacy and account recovery.

## 3. Digital India/AgriStack
India's Digital Agriculture Mission includes state-maintained Farmer Registry, crop-sown registry and geo-referenced village maps. AgriStack emphasizes consent architecture. **No third-party integration is implied by this blueprint.** Access to official infrastructure depends on authorization, agreements, API availability and compliance; do not scrape identity/land data. Reference: https://agristack.gov.in/ and https://www.pib.gov.in/PressReleasePage.aspx?PRID=2296209

## 4. Expert content workflow
1. Identify authoritative source and permitted reuse conditions.
2. Record crop, variety if needed, soil, stage, region, season, measurements and exclusions.
3. Draft guidance in source language with review date.
4. Qualified domain reviewer checks agronomy, dangerous advice and conflict with labels.
5. Translator verifies local terminology, units, negations, warnings and usability.
6. Editor publishes versioned guide with visible source and next review date.
7. Expired or superseded guidance automatically becomes review-required or unpublished.
8. Farmer can report inaccurate or dangerous advice; correction and incident processes log action.

## 5. Risk matrix
| Risk | Severity | Mitigation |
|---|---|---|
| Incorrect crop pesticide recommendation | Critical | No autonomous dosing; review/label gate; urgent escalation |
| Weather alert missed/stale | High | Timestamp, TTL, source quality, delivery status |
| Overstated crop price/yield | High | Timestamp and confidence, editable netback, no guarantees |
| Personal land/financial record exposure | Critical | Role security, encryption, tenant isolation, incident plan |
| Incorrect scheme eligibility | Medium/high | Official links, dates, explicit pre-screen caveat |
| Wrong translation of chemical warnings | High | Human QA, version lock, bilingual testing |
| AI hallucinated expert authority | High | Approved-source retrieval, citation, no fictitious credentials |
| Fraudulent buyer/provider | High | Verification badges with evidence, reporting, moderation |
| Network outage | Medium/high | Low-data cache and clear stale mode |
| Shared-phone privacy breach | High | Short session option, reauthentication for sensitive data |

## 6. Suggested data objects (conceptual, no migration yet)
- Farmer (internal ID; preferred language; role; auth references)
- Consent (purpose, scope, source, created_at, revoked_at, policy_version)
- Farm / Plot (operated relationship; units; coarse region; irrigation source)
- CropSeason (crop ID; variety optional; sowing date; estimated/actual status)
- AgronomySource (issuer, URL, document ID, published date, version, reuse permission)
- AdvisoryVersion (scope; author; reviewer; confidence; next_review; safety classification)
- Task / Observation / Expense / Revenue / Sale (linked to plot/season with audit)
- HealthCase / Attachment / ExpertResponse (consent and role restrictions)
- WeatherObservation / PriceObservation (provider, location, time, ingested_at, expires_at)
- SchemeEntry (official URL, eligibility, region, verified_at, revision date)
- NotificationDelivery (channel consent, rendered language, expiry/status)
- AuditEvent / Incident / DataRequest (immutable security and compliance log)

## 7. Prelaunch checks
- Independent security review of authentication and cross-account farm access.
- Agricultural safety evaluation on curated risky prompts and disease photo ambiguity.
- Localized privacy notices, support/grievance pathway and deletion/export behavior.
- Expert roster credentials and advisory responsibility defined.
- Integrations have documented contracts, freshness/error behavior and permitted use.
- No genuine farmer records in public demo, docs, analytics exports or source control.

This is a safety/product specification; qualified legal and agronomic review is mandatory before production.
