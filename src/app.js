import { areaToAcres, cropFinancials, EXPENSE_CATEGORIES, money, num, dateLabel, nonNegative, positive } from './math.js';
import { emptyData, loadData, saveData, removeData, sampleData, validateData } from './store.js';
import { dictionary, guideCatalog } from './content.js';

const root = document.getElementById('app');
const initial = loadData();
const pages = ['dashboard', 'farms', 'crops', 'guides', 'finance'];
const state = {
  data: initial.data, error: initial.error,
  lang: (() => { try { return localStorage.getItem('tnf:lang') === 'mr' ? 'mr' : 'en'; } catch { return 'en'; } })(),
  page: pages.includes(location.hash.slice(1)) ? location.hash.slice(1) : 'dashboard',
  editFarm: null, editCrop: null, editExpense: null,
  selectedCropId: null, selectedGuide: 'onion', notice: '',
};

const t = key => dictionary[state.lang][key] || dictionary.en[key] || key;
const esc = value => String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
const attr = esc;
const byId = id => document.getElementById(id);
const today = () => new Date().toLocaleDateString('en-CA');
const id = () => typeof crypto?.randomUUID === 'function' ? crypto.randomUUID() : 'local-' + Date.now() + '-' + Math.random().toString(36).slice(2);
const fmtArea = value => num(value, 2) + ' ' + t('unitAcre');
const nav = (page, label, icon) => '<button class="nav-link ' + (state.page === page ? 'active' : '') + '" data-page="' + page + '"><span class="nav-icon" aria-hidden="true">' + icon + '</span><span>' + t(label) + '</span></button>';
const primary = (label, action, extra = '') => '<button type="button" class="btn btn-primary" data-action="' + action + '" ' + extra + '>' + t(label) + '</button>';
const secondary = (label, action, extra = '') => '<button type="button" class="btn btn-secondary" data-action="' + action + '" ' + extra + '>' + t(label) + '</button>';
const empty = (label, action, actionText) => '<div class="empty-state"><span aria-hidden="true">🌿</span><p>' + t(label) + '</p>' + (action ? primary(actionText, action) : '') + '</div>';
const sectionHead = (title, subtitle, action = '') => '<div class="page-heading"><div><p class="eyebrow">THE NEXT FARMER</p><h1>' + t(title) + '</h1><p class="muted">' + t(subtitle) + '</p></div>' + action + '</div>';
const input = (name, label, value = '', type = 'text', other = '') => '<label class="field"><span>' + t(label) + '</span><input name="' + name + '" type="' + type + '" value="' + attr(value) + '" ' + other + ' /></label>';
const select = (name, label, choices, selected) => '<label class="field"><span>' + t(label) + '</span><select name="' + name + '">' + choices.map(([v, l]) => '<option value="' + attr(v) + '" ' + (v === selected ? 'selected' : '') + '>' + esc(l) + '</option>').join('') + '</select></label>';
const actions = (type, idValue) => '<div class="actions"><button class="text-btn" data-action="edit' + type + '" data-id="' + attr(idValue) + '">' + t('edit') + '</button><button class="text-btn danger-text" data-action="delete' + type + '" data-id="' + attr(idValue) + '">' + t('delete') + '</button></div>';
const notice = () => state.notice ? '<div class="notice" role="status">' + esc(state.notice) + '</div>' : '';

function layout() {
  root.innerHTML = '<div class="shell"><aside class="sidebar"><div class="brand"><div class="brand-icon">✳</div><div><strong>The Next Farmer</strong><span>' + t('brandTag') + '</span></div></div><div class="side-caption">' + t('workspace') + '</div><nav aria-label="Main navigation">' + nav('dashboard', 'navDashboard', '▦') + nav('farms', 'navFarms', '▤') + nav('crops', 'navCrops', '♧') + nav('guides', 'navGuides', '▣') + nav('finance', 'navFinance', '₹') + '</nav><div class="side-bottom"><div class="side-tip"><span class="side-tip-icon">✦</span><strong>' + t('quickStart') + '</strong><p>' + t('step1') + ' → ' + t('step2') + ' → ' + t('step3') + '</p></div><div class="side-footer">THE NEXT FARMER · v0.1</div></div></aside><div class="main-area"><header class="topbar"><div class="top-left"><span class="top-icon">✳</span><span class="top-crumb">' + t('overview') + '</span><span class="top-divider">/</span><strong>' + t('nav' + state.page[0].toUpperCase() + state.page.slice(1)) + '</strong></div><div class="top-right"><span class="pilot-pill"><i></i> ' + t('pilot') + '</span><label class="language-switch"><span class="sr-only">' + t('language') + '</span><select id="language" aria-label="Language"><option value="en" ' + (state.lang === 'en' ? 'selected' : '') + '>English</option><option value="mr" ' + (state.lang === 'mr' ? 'selected' : '') + '>मराठी</option></select></label></div></header><main id="content" tabindex="-1">' + notice() + '<div class="privacy-note">🔒 ' + t('storageWarning') + '</div>' + pageContent() + '</main><footer class="page-footer">' + t('footer') + '</footer></div></div>';
}

function pageContent() {
  switch (state.page) {
    case 'farms': return farmsView();
    case 'crops': return cropsView();
    case 'guides': return guidesView();
    case 'finance': return financeView();
    default: return dashboardView();
  }
}

function dashboardView() {
  const data = state.data;
  const cost = data.expenses.reduce((total, expense) => total + expense.amount, 0);
  const growing = data.crops.filter(c => c.status === 'growing').length;
  const recent = [...data.crops].slice(-3).reverse();
  const expenses = [...data.expenses].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4);
  return '<section class="hero"><div class="hero-body"><div class="hero-kicker"><span>✺</span> THE NEXT FARMER</div><h1>' + t('welcome') + '</h1><p>' + t('welcomeSub') + '</p><div class="hero-actions">' + primary('addFarm', 'newFarm') + secondary('newCrop', 'newCrop') + '</div></div><div class="hero-art" aria-hidden="true"><div class="sun"></div><div class="hill hill-one"></div><div class="hill hill-two"></div><div class="hill hill-three"></div><div class="plant-icon">🌱</div></div></section>' +
    '<section class="stats"><article class="stat"><div class="stat-top"><span>' + t('farmCount') + '</span><i>▤</i></div><strong>' + data.farms.length + '</strong><small>' + t('farmRecords') + '</small></article><article class="stat"><div class="stat-top"><span>' + t('cropCount') + '</span><i>♧</i></div><strong>' + data.crops.length + '</strong><small>' + t('cropRecords') + '</small></article><article class="stat"><div class="stat-top"><span>' + t('activeCrops') + '</span><i>↗</i></div><strong>' + growing + '</strong><small>' + t('growing') + '</small></article><article class="stat"><div class="stat-top"><span>' + t('totalSpend') + '</span><i>₹</i></div><strong class="rupee">' + money(cost) + '</strong><small>' + t('costTotal') + '</small></article></section>' +
    '<div class="dashboard-grid"><section class="panel"><div class="panel-heading"><h2>' + t('recentCrops') + '</h2><button class="text-btn" data-page="crops">' + t('view') + ' →</button></div>' + (recent.length ? '<div class="stack-list">' + recent.map(c => {
      const farm = data.farms.find(f => f.id === c.farmId);
      const f = cropFinancials(c, data.expenses);
      return '<button class="list-row list-row-button" data-action="viewCrop" data-id="' + attr(c.id) + '"><div class="round-symbol">🌾</div><div class="list-main"><strong>' + esc(c.name) + '</strong><span>' + esc(farm?.name || '') + ' · ' + dateLabel(c.sownDate, state.lang) + '</span></div><div class="list-aside"><span class="stage ' + c.status + '">' + t(c.status) + '</span><small>' + money(f.totalCost) + '</small></div></button>'; }).join('') + '</div>' : empty('emptyCrops', 'newFarm', 'addFarm')) + '</section>' +
    '<section class="panel"><div class="panel-heading"><h2>' + t('recentExpenses') + '</h2><button class="text-btn" data-page="finance">' + t('view') + ' →</button></div>' + (expenses.length ? '<div class="stack-list">' + expenses.map(e => '<div class="list-row"><div class="round-symbol money-symbol">₹</div><div class="list-main"><strong>' + esc(e.description || e.category) + '</strong><span>' + esc(e.category) + ' · ' + dateLabel(e.date, state.lang) + '</span></div><div class="list-aside"><strong>' + money(e.amount) + '</strong></div></div>').join('') + '</div>' : empty('emptyExpenses', 'newCrop', 'newCrop')) + '</section></div>' +
    '<div class="dashboard-bottom"><section class="panel intro"><span class="icon-card">📗</span><div><h3>' + t('learn') + '</h3><p>' + t('learnText') + '</p><button class="text-btn" data-page="guides">' + t('showGuidance') + ' →</button></div></section><section class="panel intro"><span class="icon-card">🔐</span><div><h3>' + t('backupTitle') + '</h3><p>' + t('dataNote') + '</p>' + secondary('downloadBackup', 'export') + '</div></section></div>' +
    (!data.farms.length ? '<div class="sample-banner"><span>✨ ' + t('sampleWarning') + '</span>' + secondary('sample', 'sample') + '</div>' : '');
}

function farmForm() {
  const f = state.data.farms.find(item => item.id === state.editFarm);
  return '<form class="form-card" id="farm-form"><div class="form-title"><h2>' + (f ? t('editFarm') : t('addFarm')) + '</h2><button type="button" class="icon-close" data-action="closeForm" aria-label="' + t('close') + '">×</button></div><div class="form-grid">' + input('name', 'farmName', f?.name ?? '', 'text', 'required maxlength="100"') + input('village', 'village', f?.village ?? '', 'text', 'maxlength="100"') + input('area', 'area', f?.areaAcres ?? '1', 'number', 'required min="0.01" max="100000" step="any"') + select('unit', 'unit', [['acre',t('unitAcre')],['guntha',t('unitGuntha')],['hectare',t('unitHectare')]], 'acre') + select('irrigation', 'irrigation', ['Rainfed','Well','Borewell','Canal','Drip','Other'].map(x=>[x,x]), f?.irrigation ?? 'Rainfed') + '</div><p class="form-help">' + t('landNote') + '</p><div class="form-actions"><button class="btn btn-primary" type="submit">' + t('save') + '</button>' + secondary('cancel','closeForm') + '</div></form>';
}

function farmsView() {
  const farms = state.data.farms;
  return sectionHead('farmRecords', 'farmSub', primary('addFarm','newFarm')) + (state.editFarm !== null ? farmForm() : '') + (farms.length ? '<div class="card-grid">' + farms.map(f => '<article class="farm-card"><div class="farm-top"><div class="farm-avatar">🌿</div><span class="farm-area">' + fmtArea(f.areaAcres) + '</span></div><h3>' + esc(f.name) + '</h3><p>📍 ' + esc(f.village || t('unknown')) + '</p><div class="farm-meta"><span>💧 ' + esc(f.irrigation) + '</span><span>🌾 ' + state.data.crops.filter(c => c.farmId === f.id).length + ' ' + t('cropCount') + '</span></div><div class="card-actions">' + actions('Farm',f.id) + '</div></article>').join('') + '</div>' : empty('emptyFarms','sample','sample')) + '<div class="info-banner">ℹ ' + t('storageWarning') + '</div>';
}

function cropForm() {
  const c = state.data.crops.find(item => item.id === state.editCrop);
  const farms = state.data.farms;
  if (!farms.length) return empty('noFarms','newFarm','addFarm');
  return '<form class="form-card" id="crop-form"><div class="form-title"><h2>' + (c ? t('editCrop') : t('newCrop')) + '</h2><button type="button" class="icon-close" data-action="closeForm" aria-label="' + t('close') + '">×</button></div><div class="form-grid">' + input('name','cropName', c?.name || '', 'text','required maxlength="100"') + select('farmId','farm',farms.map(f=>[f.id,f.name]), c?.farmId ?? farms[0].id) + input('sownDate','sownDate',c?.sownDate || today(),'date','required') + select('status','statusLabel',[['planned',t('planned')],['growing',t('growing')],['harvested',t('harvested')]],c?.status ?? 'planned') + input('expectedYieldKg','expectedYield',c?.expectedYieldKg ?? 0,'number','required min="0" step="any"') + input('expectedPricePerKg','expectedPrice',c?.expectedPricePerKg ?? 0,'number','required min="0" step="any"') + input('actualRevenue','actualRevenue',c?.actualRevenue ?? '','number','min="0" step="any"') + '</div><p class="form-help">' + t('actualRevenueHint') + ' ' + t('marketDisclaimer') + '</p><div class="form-actions"><button class="btn btn-primary" type="submit">' + t('save') + '</button>' + secondary('cancel','closeForm') + '</div></form>';
}

function cropsView() {
  const crops = state.data.crops;
  return sectionHead('cropRecords','cropSub',primary('newCrop','newCrop')) + (state.editCrop !== null ? cropForm() : '') + (crops.length ? '<div class="record-list">' + crops.map(c => { const f = state.data.farms.find(f => f.id === c.farmId); const m = cropFinancials(c,state.data.expenses);
    return '<article class="record-card"><div class="record-symbol">🌱</div><div class="record-info"><div class="record-title"><h3>' + esc(c.name) + '</h3><span class="stage ' + c.status + '">' + t(c.status) + '</span></div><p>' + esc(f?.name || '') + ' · ' + dateLabel(c.sownDate,state.lang) + '</p><div class="record-numbers"><span>' + t('costTotal') + ': <strong>' + money(m.totalCost) + '</strong></span><span>' + t('projectedRevenue') + ': <strong>' + (m.projectedRevenue > 0 ? money(m.projectedRevenue) : '—') + '</strong></span></div></div><div class="record-actions">' + actions('Crop',c.id) + '<button class="btn btn-light" data-action="viewCrop" data-id="' + attr(c.id) + '">' + t('recordExpenses') + '</button></div></article>'; }).join('') + '</div>' : (state.data.farms.length ? empty('emptyCrops','newCrop','newCrop') : empty('noFarms','newFarm','addFarm')));
}

function guidesView() {
  const guide = guideCatalog.find(g => g.id === state.selectedGuide) || guideCatalog[0];
  return sectionHead('allGuides','guidesSub') + '<div class="warning-banner">⚠ ' + t('guidanceWarning') + '</div><div class="guide-layout"><div class="guide-menu">' + guideCatalog.map(g => '<button class="guide-option ' + (guide.id === g.id ? 'active':'') + '" data-action="guide" data-id="' + g.id + '"><span>' + g.icon + '</span><strong>' + esc(g.title[state.lang]) + '</strong><small>›</small></button>').join('') + '</div><article class="guide-paper"><div class="guide-header"><span class="guide-illustration">' + guide.icon + '</span><div><p class="eyebrow">FIELD GUIDE / माहितीपर मार्गदर्शक</p><h2>' + esc(guide.title[state.lang]) + '</h2><div class="tag-list">' + guide.tags.map(tag => '<span>' + esc(tag) + '</span>').join('') + '</div></div></div><div class="guide-status">🔎 ' + t('sourceNote') + '</div><h3>' + t('guidanceTopics') + '</h3><ol class="guide-steps">' + guide.steps[state.lang].map(s => '<li>' + esc(s) + '</li>').join('') + '</ol><div class="guide-source"><strong>ICAR / KVK</strong><p>' + t('guideNote') + '</p><a href="https://icar.gov.in/en/krishi-vigyan-kendras-kvks" target="_blank" rel="noopener noreferrer">ICAR Krishi Vigyan Kendras ↗</a></div></article></div><div class="info-banner">ℹ ' + t('noLiveData') + '</div>';
}

function expenseForm(crop) {
  const e = state.data.expenses.find(item => item.id === state.editExpense);
  return '<form id="expense-form" class="form-card smaller"><div class="form-title"><h2>' + (e ? t('editExpense') : t('addExpense')) + '</h2>' + (e ? '<button type="button" class="icon-close" data-action="closeForm" aria-label="' + t('close') + '">×</button>' : '') + '</div><div class="form-grid">' + select('category','expenseCategory',EXPENSE_CATEGORIES.map(x=>[x,x]),e?.category ?? EXPENSE_CATEGORIES[0]) + input('description','expenseNote',e?.description ?? '','text','maxlength="180"') + input('amount','amount',e?.amount ?? '', 'number','required min="0" step="any"') + input('date','date',e?.date || today(),'date','required') + '</div><div class="form-actions"><button class="btn btn-primary" type="submit">' + t('save') + '</button>' + (e ? secondary('cancel','closeForm') : '') + '</div></form>';
}

function financeView() {
  const crops = state.data.crops;
  if (!crops.length) return sectionHead('finance','financeSub') + empty('noCrops','newCrop','newCrop');
  const crop = crops.find(c => c.id === state.selectedCropId) || crops[0];
  const expenses = state.data.expenses.filter(e => e.cropId === crop.id).sort((a,b)=>b.date.localeCompare(a.date));
  const finance = cropFinancials(crop,state.data.expenses);
  const farm = state.data.farms.find(f => f.id === crop.farmId);
  const costPerAcre = farm ? finance.totalCost / farm.areaAcres : 0;
  const basisInfo = finance.basis === 'actual' ? 'basisActual' : finance.basis === 'projected' ? 'basisProjected' : 'basisMissing';
  const totals = [[t('costTotal'),money(finance.totalCost),'cost'],[finance.basis === 'actual' ? t('actualRevenueLabel') : t('projectedRevenue'),finance.revenue === null ? '—' : money(finance.revenue),'revenue'],[t('netReturn'),finance.netReturn === null ? '—' : money(finance.netReturn),'net']];
  const categoryTotals = EXPENSE_CATEGORIES.map(category=>({category,amount:expenses.filter(e=>e.category===category).reduce((a,e)=>a+e.amount,0)})).filter(x=>x.amount > 0);
  return sectionHead('finance','financeSub',secondary('downloadBackup','export')) + '<div class="finance-filter">' + select('selectedCrop','chooseCrop',crops.map(c=>[c.id,c.name+' — '+(state.data.farms.find(f=>f.id===c.farmId)?.name || '')]),crop.id) + '<span class="stage ' + crop.status + '">' + t(crop.status) + '</span></div><div class="finance-stats">' + totals.map(([label,value,type])=>'<article class="finance-stat ' + type + '"><span>' + label + '</span><strong>' + value + '</strong></article>').join('') + '</div><div class="finance-note">ℹ ' + t(basisInfo) + ' ' + t('marketDisclaimer') + '</div><div class="finance-detail"><section class="panel"><div class="panel-heading"><h2>' + t('expenses') + '</h2><span class="muted">' + expenses.length + '</span></div>' + (expenses.length ? '<div class="expense-table-wrap"><table><thead><tr><th>' + t('expenseNote') + '</th><th>' + t('date') + '</th><th>' + t('amount') + '</th><th>' + t('action') + '</th></tr></thead><tbody>' + expenses.map(e=>'<tr><td><strong>' + esc(e.description || e.category) + '</strong><small>' + esc(e.category) + '</small></td><td>' + dateLabel(e.date,state.lang) + '</td><td>' + money(e.amount) + '</td><td>' + actions('Expense',e.id) + '</td></tr>').join('') + '</tbody></table></div>' : empty('emptyExpenses')) + '</section>' + expenseForm(crop) + '</div><div class="dashboard-bottom"><section class="panel"><h3>' + t('categoryTitle') + '</h3>' + (categoryTotals.length ? categoryTotals.map(x=>'<div class="cost-line"><div><span>' + esc(x.category) + '</span><strong>' + money(x.amount) + '</strong></div><div class="progress"><span style="width:' + Math.min(100, x.amount / finance.totalCost * 100).toFixed(2) + '%"></span></div></div>').join('') : '<p class="muted">' + t('emptyExpenses') + '</p>') + '</section><section class="panel summary-details"><h3>' + t('netCost') + '</h3><div><span>' + t('breakEven') + '</span><strong>' + (finance.breakEvenPricePerKg === null ? '—' : money(finance.breakEvenPricePerKg)) + '</strong></div><div><span>' + t('costPerAcre') + '</span><strong>' + money(costPerAcre) + '</strong></div><p>' + t('basisMissing') + '</p></section></div>';
}

function navigate(page) {
  if (!pages.includes(page)) return;
  state.page = page;
  location.hash = page;
  state.notice = '';
  render();
  window.scrollTo(0,0);
}
function render() { layout(); document.documentElement.lang = state.lang; }
function commit(next) {
  try { saveData(next); state.data = next; state.error = null; state.notice = t('saved'); render(); }
  catch (error) { state.notice = t('saveError') + ' ' + (error?.message || ''); render(); }
}
function clone() { return structuredClone(state.data); }
function closeForm() { state.editFarm = null; state.editCrop = null; state.editExpense = null; render(); }

function handleAction(action, target) {
  const itemId = target.dataset.id;
  const data = state.data;
  if (action === 'newFarm') { state.editFarm = ''; navigate('farms'); return; }
  if (action === 'newCrop') { if (!data.farms.length) { state.editFarm = ''; navigate('farms'); return; } state.editCrop = ''; navigate('crops'); return; }
  if (action === 'closeForm') return closeForm();
  if (action === 'editFarm') { state.editFarm = itemId; navigate('farms'); return; }
  if (action === 'editCrop') { state.editCrop = itemId; navigate('crops'); return; }
  if (action === 'editExpense') { state.editExpense = itemId; state.selectedCropId = data.expenses.find(e=>e.id===itemId)?.cropId; navigate('finance'); return; }
  if (action === 'viewCrop') { state.selectedCropId = itemId; navigate('finance'); return; }
  if (action === 'guide') { state.selectedGuide = itemId; render(); return; }
  if (action === 'deleteFarm' && confirm(t('deleteCascade'))) {
    const next = clone(); const ids = new Set(next.crops.filter(c=>c.farmId===itemId).map(c=>c.id));
    next.farms = next.farms.filter(f=>f.id!==itemId); next.crops = next.crops.filter(c=>c.farmId!==itemId); next.expenses = next.expenses.filter(e=>!ids.has(e.cropId)); commit(next); return;
  }
  if (action === 'deleteCrop' && confirm(t('cropCascade'))) { const next=clone();next.crops=next.crops.filter(c=>c.id!==itemId); next.expenses=next.expenses.filter(e=>e.cropId!==itemId);commit(next);return; }
  if (action === 'deleteExpense' && confirm(t('deleteConfirm'))) { const next=clone();next.expenses=next.expenses.filter(e=>e.id!==itemId);commit(next);return; }
  if (action === 'sample') { if ((data.farms.length || data.crops.length || data.expenses.length) && !confirm(t('sampleConfirm'))) return; state.editFarm=null;state.editCrop=null;state.selectedCropId='demo-crop';commit(sampleData());return; }
  if (action === 'export') {
    const blob = new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
    const url=URL.createObjectURL(blob); const a=document.createElement('a');a.href=url;a.download='the-next-farmer-backup-'+today()+'.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);return;
  }
  if (action === 'import') {byId('import-file').click();return;}
  if (action === 'clear' && confirm(t('clearConfirm'))) {try{removeData();state.data=emptyData();state.editFarm=null;state.editCrop=null;state.editExpense=null;render();}catch{state.notice=t('saveError');render();}return;}
}

root.addEventListener('click', event => {
  const button = event.target.closest('button'); if (!button) return;
  if (button.dataset.page) return navigate(button.dataset.page);
  if (button.dataset.action) return handleAction(button.dataset.action,button);
});
root.addEventListener('change', event => {
  if (event.target.id === 'language') {state.lang=event.target.value==='mr'?'mr':'en';try { localStorage.setItem('tnf:lang',state.lang); } catch {} render();}
  if (event.target.name === 'selectedCrop') {state.selectedCropId=event.target.value;state.editExpense=null;render();}
});
root.addEventListener('submit', event => {
  const form = event.target;
  if (!['farm-form','crop-form','expense-form'].includes(form.id)) return;
  event.preventDefault();
  if (!form.reportValidity()) return;
  const values = Object.fromEntries(new FormData(form));
  try {
    const next = clone();
    if (form.id === 'farm-form') {
      const record = {id:state.editFarm || id(),name:values.name.trim(),village:values.village.trim(),areaAcres:areaToAcres(values.area,values.unit),irrigation:values.irrigation};
      if (!record.name) throw new Error(t('allFieldsRequired'));
      const index=next.farms.findIndex(f=>f.id===record.id); if(index<0)next.farms.push(record);else next.farms[index]=record;
      state.editFarm=null;
    } else if(form.id === 'crop-form') {
      const record = {id:state.editCrop || id(),farmId:values.farmId,name:values.name.trim(),sownDate:values.sownDate,status:values.status,expectedYieldKg:nonNegative(values.expectedYieldKg),expectedPricePerKg:nonNegative(values.expectedPricePerKg),actualRevenue:values.actualRevenue===''?null:nonNegative(values.actualRevenue)};
      if(!record.name)throw new Error(t('allFieldsRequired'));
      const index=next.crops.findIndex(c=>c.id===record.id);if(index<0)next.crops.push(record);else next.crops[index]=record;
      state.editCrop=null;
    } else {
      const record={id:state.editExpense||id(),cropId:state.selectedCropId && next.crops.some(c=>c.id===state.selectedCropId)?state.selectedCropId:next.crops[0].id,category:values.category,description:values.description.trim(),amount:nonNegative(values.amount),date:values.date};
      const index=next.expenses.findIndex(e=>e.id===record.id);if(index<0)next.expenses.push(record);else next.expenses[index]=record;
      state.editExpense=null;
    }
    validateData(next);commit(next);
  } catch(error) {state.notice=t('validationError') + ' ' + (error?.message||'');render();}
});
window.addEventListener('hashchange',()=>{const page=location.hash.slice(1);if(pages.includes(page)&&page!==state.page)navigate(page);});

// Extra accessible controls remain in the top-level toolbar; never upload farmer data.
const baseRender = render;
render = function() {baseRender(); const tools=document.createElement('div');tools.className='backup-tools';tools.innerHTML='<button class="text-btn" data-action="export">⬇ '+t('downloadBackup')+'</button><button class="text-btn" data-action="import">↑ '+t('importBackup')+'</button><button class="text-btn danger-text" data-action="clear">'+t('clearData')+'</button><input id="import-file" aria-label="Import backup" type="file" accept="application/json,.json" hidden>';root.querySelector('.page-footer').before(tools);if(state.error){const banner=document.createElement('div');banner.className='notice';banner.setAttribute('role','alert');banner.textContent=state.error;root.querySelector('#content').prepend(banner);}
};
root.addEventListener('change',async event=>{
  if(event.target.id!=='import-file')return;
  const file=event.target.files?.[0];if(!file)return;
  try {if(file.size>2_000_000)throw new Error('Backup too large');const next=validateData(JSON.parse(await file.text()));if(!confirm(t('importConfirm')))return;state.editFarm=null;state.editCrop=null;state.editExpense=null;state.selectedCropId=null;commit(next);}
  catch {state.notice=t('importError');render();}
});
render();
