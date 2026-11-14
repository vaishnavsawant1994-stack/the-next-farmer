/** Pure calculation helpers, independent from the UI and storage. */
export const AREA_UNITS = Object.freeze({ acre: 1, guntha: 0.025, hectare: 2.4710538147 });
export const EXPENSE_CATEGORIES = Object.freeze(['Seed & seedlings', 'Fertilizer & nutrients', 'Water & electricity', 'Labour', 'Crop protection', 'Transport', 'Machinery', 'Other']);

export function areaToAcres(value, unit = 'acre') {
  if (!Object.hasOwn(AREA_UNITS, unit)) throw new Error('Unknown land area unit');
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0 || number > 100000) throw new Error('Area must be above zero');
  return number * AREA_UNITS[unit];
}

export function nonNegative(value, name = 'Amount') {
  const number = Number(value);
  if (value === '' || value === null || value === undefined || !Number.isFinite(number) || number < 0 || number > 1e12) {
    throw new Error(name + ' must be a valid non-negative number');
  }
  return number;
}

export function positive(value, name = 'Value') {
  const number = nonNegative(value, name);
  if (number <= 0) throw new Error(name + ' must be greater than zero');
  return number;
}

export function cropFinancials(crop, expenses) {
  const totalCost = expenses.filter(item => item.cropId === crop.id).reduce((total, item) => total + nonNegative(item.amount), 0);
  const yieldKg = nonNegative(crop.expectedYieldKg ?? 0, 'Expected harvest');
  const pricePerKg = nonNegative(crop.expectedPricePerKg ?? 0, 'Expected price');
  const projectedRevenue = yieldKg * pricePerKg;
  const actualIsSet = crop.actualRevenue !== null && crop.actualRevenue !== undefined && crop.actualRevenue !== '';
  const actualRevenue = actualIsSet ? nonNegative(crop.actualRevenue, 'Actual revenue') : null;
  const hasProjection = yieldKg > 0 && pricePerKg > 0;
  const basis = actualIsSet ? 'actual' : hasProjection ? 'projected' : 'none';
  const revenue = actualIsSet ? actualRevenue : hasProjection ? projectedRevenue : null;
  return {
    totalCost, projectedRevenue, actualRevenue, basis, revenue,
    netReturn: revenue === null ? null : revenue - totalCost,
    breakEvenPricePerKg: yieldKg > 0 ? totalCost / yieldKg : null,
    returnOnCostPercent: revenue !== null && totalCost > 0 ? (revenue - totalCost) / totalCost * 100 : null
  };
}

export function money(amount) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount || 0);
}

export function num(amount, digits = 1) {
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: digits }).format(amount || 0);
}

export function dateLabel(date, language = 'en') {
  if (!date) return '—';
  const parsed = new Date(date + 'T12:00:00');
  return Number.isNaN(parsed.getTime()) ? '—' : parsed.toLocaleDateString(language === 'mr' ? 'mr-IN' : 'en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}
