import test from 'node:test';
import assert from 'node:assert/strict';
import { areaToAcres, cropFinancials, money, nonNegative } from '../src/math.js';
import { emptyData, validateData, loadData, saveData, sampleData } from '../src/store.js';

const crop = { id: 'c1', expectedYieldKg: 800, expectedPricePerKg: 18, actualRevenue: null };
const expenses = [{ cropId: 'c1', amount: 1000 }, { cropId: 'c1', amount: 2500 }, { cropId: 'c2', amount: 999 }];
test('acre, guntha and hectare conversions', () => {
  assert.equal(areaToAcres(40, 'guntha'), 1);
  assert.equal(areaToAcres(1, 'acre'), 1);
  assert.ok(Math.abs(areaToAcres(1, 'hectare') - 2.47105) < .00001);
  assert.throws(() => areaToAcres(0, 'acre'));
});
test('projected margin, cost and break-even', () => {
  const f = cropFinancials(crop, expenses);
  assert.equal(f.basis, 'projected');
  assert.equal(f.projectedRevenue, 14400);
  assert.equal(f.totalCost, 3500);
  assert.equal(f.netReturn, 10900);
  assert.equal(f.breakEvenPricePerKg, 4.375);
});
test('actual revenue overrides projection, including zero', () => {
  assert.equal(cropFinancials({ ...crop, actualRevenue: 12000 }, expenses).netReturn, 8500);
  assert.equal(cropFinancials({ ...crop, actualRevenue: 0 }, expenses).netReturn, -3500);
});
test('unknown revenue is not presented as zero profit', () => {
  const f = cropFinancials({ ...crop, expectedYieldKg: 0 }, expenses);
  assert.equal(f.basis, 'none');
  assert.equal(f.netReturn, null);
});
test('reject invalid numeric inputs and missing links', () => {
  assert.throws(() => nonNegative(-5));
  assert.throws(() => nonNegative(''));
  assert.throws(() => cropFinancials(crop, [{ cropId: 'c1', amount: -10 }]));
  assert.throws(() => validateData({ ...emptyData(), crops: [{ ...crop, farmId: 'missing' }] }));
});
test('valid sample data round trips through storage', () => {
  let raw;
  const storage = { getItem: () => raw, setItem: (_key, value) => { raw = value; }, removeItem: () => { raw = null; } };
  const expected = sampleData();
  saveData(expected, storage);
  assert.deepEqual(loadData(storage).data, expected);
});
test('invalid backups are rejected and prior data preserved', () => {
  const bad = { ...sampleData(), expenses: [{ ...sampleData().expenses[0], cropId: 'unknown' }] };
  assert.throws(() => validateData(bad));
  const storage = { getItem: () => '{bad JSON', setItem: () => { throw new Error('should not save'); } };
  const result = loadData(storage);
  assert.ok(result.error);
  assert.deepEqual(result.data, emptyData());
});
test('currency formatting for Indian rupees', () => assert.match(money(120000), /1,20,000/));
