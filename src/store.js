const KEY = 'the-next-farmer:p1:v1';
const MAX_RECORDS = 10000;
export const emptyData = () => ({ version: 1, farms: [], crops: [], expenses: [] });

function isObject(value) { return value !== null && typeof value === 'object' && !Array.isArray(value); }
function text(value, max) { return typeof value === 'string' && value.length <= max; }
function goodNumber(value, max = 1e12) { return typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= max; }
function goodDate(value) { return text(value, 10) && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value + 'T12:00:00')); }
function uniqueIds(rows) { return new Set(rows.map(r => r.id)).size === rows.length; }

export function validateData(data) {
  if (!isObject(data) || data.version !== 1 || !['farms', 'crops', 'expenses'].every(k => Array.isArray(data[k]) && data[k].length <= MAX_RECORDS)) throw new Error('Unsupported or invalid backup');
  const { farms, crops, expenses } = data;
  for (const farm of farms) {
    if (!isObject(farm) || !text(farm.id, 100) || !farm.id || !text(farm.name, 100) || !farm.name.trim() || !text(farm.village, 100) || !['Rainfed', 'Well', 'Borewell', 'Canal', 'Drip', 'Other'].includes(farm.irrigation) || !goodNumber(farm.areaAcres, 100000) || farm.areaAcres === 0) throw new Error('Invalid farm record');
  }
  for (const crop of crops) {
    if (!isObject(crop) || !text(crop.id, 100) || !crop.id || !text(crop.farmId, 100) || !text(crop.name, 100) || !crop.name.trim() || !['planned','growing','harvested'].includes(crop.status) || !goodDate(crop.sownDate) || !goodNumber(crop.expectedYieldKg) || !goodNumber(crop.expectedPricePerKg) || !(crop.actualRevenue === null || goodNumber(crop.actualRevenue))) throw new Error('Invalid crop record');
  }
  for (const expense of expenses) {
    if (!isObject(expense) || !text(expense.id, 100) || !expense.id || !text(expense.cropId, 100) || !text(expense.category, 100) || !text(expense.description, 180) || !goodNumber(expense.amount) || !goodDate(expense.date)) throw new Error('Invalid expense record');
  }
  if (![farms,crops,expenses].every(uniqueIds)) throw new Error('Duplicate record identifiers');
  const farmIds = new Set(farms.map(f => f.id));
  const cropIds = new Set(crops.map(c => c.id));
  if (crops.some(c => !farmIds.has(c.farmId)) || expenses.some(e => !cropIds.has(e.cropId))) throw new Error('Backup contains orphaned records');
  return { version: 1, farms, crops, expenses };
}

export function loadData(storage = globalThis.localStorage) {
  try {
    const raw = storage.getItem(KEY);
    return { data: raw ? validateData(JSON.parse(raw)) : emptyData(), error: null };
  } catch {
    return { data: emptyData(), error: 'Local records could not be read. Your existing browser data has not been overwritten.' };
  }
}

export function saveData(data, storage = globalThis.localStorage) {
  validateData(data);
  storage.setItem(KEY, JSON.stringify(data));
  return data;
}

export function removeData(storage = globalThis.localStorage) { storage.removeItem(KEY); }

export function sampleData() {
  return validateData({ version: 1,
    farms: [{ id: 'demo-farm', name: 'Sample field — demonstration', village: 'Satana, Nashik', areaAcres: 1.5, irrigation: 'Drip' }],
    crops: [{ id: 'demo-crop', farmId: 'demo-farm', name: 'Onion', sownDate: '2026-11-01', status: 'growing', expectedYieldKg: 1500, expectedPricePerKg: 18, actualRevenue: null }],
    expenses: [
      { id: 'demo-expense-1', cropId: 'demo-crop', category: 'Seed & seedlings', description: 'Sample seedlings', amount: 4200, date: '2026-11-02' },
      { id: 'demo-expense-2', cropId: 'demo-crop', category: 'Labour', description: 'Sample field preparation', amount: 2900, date: '2026-11-03' }
    ]
  });
}
