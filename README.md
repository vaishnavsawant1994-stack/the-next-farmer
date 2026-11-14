# The Next Farmer / द नेक्स्ट फार्मर

**A farmer-first, multilingual agricultural planning companion for India.**

[Master requirements](docs/FARMER_REQUIREMENTS_MASTER_BLUEPRINT.md) · [Roadmap](docs/PRODUCT_ROADMAP.md) · [MVP guide](docs/MVP_IMPLEMENTATION.md)

## What is available today

A functional, **local-first pilot** of the web application (English and Marathi) featuring:

- **Dashboard:** farm and crop summaries, active seasons and recent expenses.
- **Farm records:** create, edit and delete fields, area in acres/guntha/hectares, irrigation source.
- **Crop seasons:** create and edit crop records linked to farms, sowing dates, stages, expected yield and farmer-entered selling-price assumptions.
- **Crop guidance:** six educational checklists (onion, tomato, wheat, maize, pomegranate and general crops), clearly marked as awaiting expert review.
- **Farm finances:** expenses by crop, projected or actual revenue, net returns, cost categories and break-even price.
- **Data portability:** sample records, JSON export/import and browser-data deletion.

## Run the app

Requires Node.js **20 or newer**. No dependency installation, API key, external service or database needed.

```bash
git clone https://github.com/vaishnavsawant1994-stack/the-next-farmer.git
cd the-next-farmer
npm run dev
```

Open **http://127.0.0.1:5173/** in a browser.

To run the eight automated calculation and validation tests plus syntax checks:

```bash
npm run check
```

## Important pilot limitations

- **Local browser storage only.** No account authentication, encryption, server database, cloud sync or multi-user access. Do not enter sensitive farmer identity, confidential land or banking information. Clearing browser storage can erase your data; export a backup first.
- **No live market prices, weather, government scheme integration or AI crop diagnosis.** The selling price is a user-entered assumption.
- **Crop guidance is not yet locally validated by a qualified agronomist.** Do not use it to make chemical application or emergency decisions.
- The application passes syntax and calculation/data-model tests locally. **Browser end-to-end testing and real-farmer usability validation are pending.** The development server is not hardened for internet exposure.

See [MVP implementation details](docs/MVP_IMPLEMENTATION.md) for full functionality, acceptance examples and limitations.

## Project mission

Help farmers plan crops, keep reliable records and understand farm economics; expand into trusted local guidance and expert services only after field research and qualified review.

**Proposed pilot region:** Satana / Nashik, Maharashtra. National expansion is a future goal.

## Project documentation

- [Farmer Requirements Master Blueprint](docs/FARMER_REQUIREMENTS_MASTER_BLUEPRINT.md)
- [Farmer Journeys and Personas](docs/FARMER_JOURNEYS_AND_PERSONAS.md)
- [Farmer Research and Validation Plan](docs/FIELD_RESEARCH_AND_VALIDATION.md)
- [Product Roadmap](docs/PRODUCT_ROADMAP.md)
- [Privacy, Safety and Trust](docs/DATA_SAFETY_AND_TRUST.md)
- [Official Source Register](docs/OFFICIAL_SOURCES.md)
- [MVP Implementation](docs/MVP_IMPLEMENTATION.md)

**Status:** Functional local-first pilot committed to `main`; not yet a secure deployed production app. Field research, expert validation, backend architecture and production acceptance remain open.
