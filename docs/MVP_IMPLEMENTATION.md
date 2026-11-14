# Working MVP implementation — 2026-11-14

## What is implemented
- Dependency-free responsive HTML/CSS/JavaScript web app, with English and Marathi navigation and educational guides.
- Dashboard with counts, active crop seasons and recorded expenses.
- Create, edit and delete operated-farm/plot records, with acres, guntha and hectares converted to acres for consistent storage.
- Create, edit and delete crop seasons linked to a farm, with planting date, stage, expected harvest and **farmer-assumed** sale price.
- Create, edit and delete expense records linked to crop season; category breakdown, projected revenue, entered actual revenue, net margin, return on cost and break-even per kg.
- Transparent distinction between projected values, actual revenue entered by the farmer and unknown revenue.
- Six illustrative crop/decision checklists (onion, tomato, wheat, maize, pomegranate, general). These are education only **and have not been locally agronomist-validated**.
- Browser localStorage persistence with JSON backup export/import and deletion control; example data only when user explicitly loads it.
- Node.js no-dependency dev server, strict resource path handling, Content Security Policy and Node built-in tests.
- GitHub Actions check workflow (on push/PR).

## Running locally

Requirements: Node.js 20+; no npm dependencies or login needed.

```bash
npm run dev
```

Open http://127.0.0.1:5173/ in a normal browser.

```bash
npm run check
```

Tests use the built-in Node.js test runner. To publish a static preview, serve the root folder as static files over HTTPS. `tools/serve.mjs` is a **local development server** and is not recommended as a public production server.

## Limitations (not production ready)
- **Not a cloud app**: no backend, authentication, multi-device sync, encrypted database or multi-farmer separation. Records are stored in the current browser under this site's origin. Anyone with access to that browser profile may be able to see them.
- Clearing site data or changing browsers can lose records. Export backups regularly; imports replace the current local state after confirmation.
- **No live data**: no connected weather, market prices, schemes, messaging or government APIs. No scientific yield or price predictions.
- Guidance is general checklists, not verified location-specific agronomy, pesticide recommendations or diagnosis. Seek a qualified local expert for consequential decisions.
- Financial results depend entirely on farmer-entered records; they omit any expenses that the user fails to enter. A crop's cost-per-acre is calculated using its selected farm's whole area; crop-area allocation is a future requirement.
- There is no field-testing evidence. Farmer validation, professional agronomy review, privacy/legal review, browser interaction tests and production acceptance are pending.

## Test cases
- Unit conversion: 40 guntha = 1 acre; 1 hectare ≈ 2.47105 acres.
- Crop 800 kg × ₹18/kg = ₹14,400 projected revenue.
- ₹3,500 expenses → ₹10,900 projected net margin.
- ₹12,000 entered as actual revenue → ₹8,500 actual net margin.
- ₹0 actual sale revenue → negative return equal to recorded costs.
- No valid forecast or actual revenue → **unknown**, not fake ₹0 profit.
- Invalid backup/orphan references/duplicate IDs are rejected.

## Recommended follow-up engineering work
1. Farmer usability test and local expert approval for at least one priority crop.
2. Secure backend, login, tenant isolation, encrypted storage, backups and verified farmer-consent workflows.
3. Plot-specific crop area and multiple crop cycles on a plot; input and output units/localized categories.
4. CRUD browser end-to-end tests in a reachable browser environment.
5. Stale-data-safe adapters for weather and mandi prices after authorized data access.
6. Verified editorial CMS, expert case workflow, official scheme source register and field validation.

For the approved backlog and scope, see [Product Roadmap](PRODUCT_ROADMAP.md) and [Farmer Requirements Master Blueprint](FARMER_REQUIREMENTS_MASTER_BLUEPRINT.md).
