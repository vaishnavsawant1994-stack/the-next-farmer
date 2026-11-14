import test from 'node:test';
import assert from 'node:assert/strict';

// Minimal DOM adapter tests the application's actual rendering and event logic
// without claiming full cross-browser, accessibility or end-to-end acceptance.
test('farmer can create a farm, crop and expense; see correct net result; switch language', async () => {
  const storage = new Map();
  const listeners = {};
  const root = {
    innerHTML: '',
    addEventListener(type, handler) { (listeners[type] ||= []).push(handler); },
    querySelector(selector) { return selector === '.page-footer' ? { before() {} } : { prepend() {} }; }
  };
  globalThis.document = {
    documentElement: { lang: 'en' },
    getElementById(id) { return id === 'app' ? root : { click() {} }; },
    createElement() { return { className: '', innerHTML: '', setAttribute() {} }; },
  };
  globalThis.location = { hash: '' };
  globalThis.window = { addEventListener() {}, scrollTo() {} };
  globalThis.localStorage = {
    getItem: key => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
    removeItem: key => storage.delete(key)
  };
  globalThis.confirm = () => true;
  globalThis.FormData = class {
    constructor(form) { return Object.entries(form.fields)[Symbol.iterator](); }
  };
  const click = (dataset) => (listeners.click || []).forEach(handler => handler({ target: { closest: () => ({ dataset }) } }));
  const submit = (id, fields) => (listeners.submit || []).forEach(handler => handler({
    target: { id, fields, reportValidity: () => true }, preventDefault() {}
  }));
  const change = target => (listeners.change || []).forEach(handler => handler({ target }));
  await import('../src/app.js?smoke');
  assert.match(root.innerHTML, /Good farming starts with better decisions/);
  click({ action: 'newFarm' });
  assert.match(root.innerHTML, /farm-form/);
  submit('farm-form', { name: 'My Demo Farm', village: 'Satana', area: '40', unit: 'guntha', irrigation: 'Drip' });
  assert.match(root.innerHTML, /My Demo Farm/);
  const saved = JSON.parse([...storage.entries()].find(([key])=>key.startsWith('the-next-farmer:'))[1]);
  assert.equal(saved.farms[0].areaAcres, 1);
  click({ action: 'newCrop' });
  submit('crop-form', { name: 'Onion', farmId: saved.farms[0].id, sownDate: '2026-11-14', status: 'growing', expectedYieldKg: '800', expectedPricePerKg: '18', actualRevenue: '' });
  assert.match(root.innerHTML, /Onion/);
  click({ page: 'finance' });
  assert.match(root.innerHTML, /14,400/);
  submit('expense-form', { category: 'Labour', description: 'Field work', amount: '3500', date: '2026-11-14' });
  assert.match(root.innerHTML, /10,900/);
  change({ id: 'language', value: 'mr' });
  assert.equal(document.documentElement.lang,'mr');
  assert.match(root.innerHTML, /खर्च व उत्पन्न/);
});
