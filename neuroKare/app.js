
/* ============ CONFIG ============ */
// Set this to a real form endpoint (Formspree, Basin, your own server, etc.) so requests reach you.
// Leave blank and the page will show the guest a summary to copy/download/email instead.
const FORM_ENDPOINT = "https://formsubmit.co/ajax/khylannr15@gmail.com";
const PRACTITIONER_EMAIL = "khylannr15@gmail.com";   // used by the "Email it" button

/* ============ BODY MAP ============ */
const ZONES = [
  { id:'neck', name:'Neck & upper traps', desc:'Broad, slow work on the neck muscles and tops of the shoulders.' },
  { id:'shoulders', name:'Shoulders', desc:'Deltoids and the shoulder joint, for overhead and inversion fatigue.' },
  { id:'upper_back', name:'Upper back & shoulder blades', desc:'Lats, rhomboids and the muscles around the shoulder blades.' },
  { id:'low_back', name:'Low back', desc:'Broad compression and sweeping work along the lower back.' },
  { id:'glutes', name:'Glutes', sens:true, desc:'Broad forearm compression around the hip rotators, adjusted to your preferred pressure.' },
  { id:'hamstrings', name:'Hamstrings', desc:'Slow, downward kneading along the back of the thigh.' },
  { id:'calves', name:'Calves', desc:'Release for constant toe-pointing (gastrocnemius and soleus).' },
  { id:'feet', name:'Feet & toes', desc:'Release for toe-point fatigue and arches.' },
  { id:'forearms', name:'Forearms & grip', desc:'Pin-and-stretch for the forearm flexors, plus thumb-pad work for grip fatigue.' },
  { id:'elbows', name:'Elbows', desc:'Relief at the inner and outer elbow, where grip strain often collects.' },
  { id:'chest', name:'Upper chest (below collarbone)', sens:true, desc:'Static pressure just beneath the collarbone, tailored to comfort. Does not involve breast tissue.' },
  { id:'underarm', name:'Underarm / side of ribcage', sens:true, desc:'A hold along the side of the ribcage to release the rotator cuff. I can guide you to position your own arm, or you can apply the pressure yourself with my instruction.' },
  { id:'hipflex', name:'Hip flexors / lower abdomen', sens:true, desc:'Slow, sustained work at the front of the hip, paired with comfortable breathing. We’ll discuss the approach before including this area.' },
  { id:'inner', name:'Inner thighs', sens:true, desc:'A common site of pole bruising. Broad, flat compression only, kept on the thigh and away from the groin. No sharp points.' },
  { id:'quads', name:'Front of thighs', desc:'Broad compression and sweeping work along the front of the thigh.' }
];
const ZVIEW = { chest:'front', underarm:'front', hipflex:'front', quads:'front', inner:'front', upper_back:'back', low_back:'back', glutes:'back', hamstrings:'back', calves:'back' };
const STATES = { focus:'Focus here', include:'Include', ask:'Ask me first', skip:'Skip' };
const zname = id => ZONES.find(z => z.id === id).name;
const zoneState = {};
const defaultState = () => ZONES.forEach(z => zoneState[z.id] = z.sens ? 'skip' : 'include');
defaultState();

const E = (z, tag, a) => ({ z, tag, a });
const SIL = [
  ['circle',{cx:100,cy:30,r:19}], ['rect',{x:70,y:72,width:60,height:100,rx:22}], ['rect',{x:68,y:162,width:64,height:38,rx:18}],
  ['rect',{x:38,y:78,width:20,height:62,rx:10}], ['rect',{x:142,y:78,width:20,height:62,rx:10}],
  ['rect',{x:32,y:140,width:18,height:58,rx:9}], ['rect',{x:150,y:140,width:18,height:58,rx:9}],
  ['ellipse',{cx:38,cy:208,rx:9,ry:11}], ['ellipse',{cx:162,cy:208,rx:9,ry:11}],
  ['rect',{x:70,y:196,width:28,height:100,rx:14}], ['rect',{x:102,y:196,width:28,height:100,rx:14}],
  ['rect',{x:73,y:294,width:22,height:92,rx:11}], ['rect',{x:105,y:294,width:22,height:92,rx:11}]
];
const SHARED = [
  E('neck','rect',{x:91,y:50,width:18,height:18,rx:7}),
  E('shoulders','ellipse',{cx:58,cy:82,rx:17,ry:13}), E('shoulders','ellipse',{cx:142,cy:82,rx:17,ry:13}),
  E('elbows','circle',{cx:44,cy:142,r:9}), E('elbows','circle',{cx:156,cy:142,r:9}),
  E('forearms','rect',{x:32,y:153,width:18,height:45,rx:9}), E('forearms','ellipse',{cx:38,cy:210,rx:9,ry:11}),
  E('forearms','rect',{x:150,y:153,width:18,height:45,rx:9}), E('forearms','ellipse',{cx:162,cy:210,rx:9,ry:11}),
  E('feet','ellipse',{cx:84,cy:406,rx:15,ry:8}), E('feet','ellipse',{cx:116,cy:406,rx:15,ry:8})
];
const FRONT = [ ...SHARED,
  E('chest','rect',{x:74,y:84,width:52,height:32,rx:14}),
  E('underarm','ellipse',{cx:66,cy:104,rx:6,ry:13}), E('underarm','ellipse',{cx:134,cy:104,rx:6,ry:13}),
  E('hipflex','ellipse',{cx:86,cy:176,rx:10,ry:13}), E('hipflex','ellipse',{cx:114,cy:176,rx:10,ry:13}),
  E('quads','rect',{x:70,y:208,width:28,height:84,rx:13}), E('quads','rect',{x:102,y:208,width:28,height:84,rx:13}),
  E('inner','rect',{x:90,y:210,width:8,height:68,rx:4}), E('inner','rect',{x:102,y:210,width:8,height:68,rx:4})
];
const BACK = [ ...SHARED,
  E('upper_back','rect',{x:74,y:80,width:52,height:42,rx:14}),
  E('low_back','rect',{x:78,y:124,width:44,height:38,rx:12}),
  E('glutes','ellipse',{cx:88,cy:186,rx:16,ry:15}), E('glutes','ellipse',{cx:112,cy:186,rx:16,ry:15}),
  E('hamstrings','rect',{x:70,y:208,width:28,height:84,rx:13}), E('hamstrings','rect',{x:102,y:208,width:28,height:84,rx:13}),
  E('calves','rect',{x:73,y:298,width:22,height:82,rx:11}), E('calves','rect',{x:105,y:298,width:22,height:82,rx:11})
];
const mk = (tag, a) => `<${tag} ${Object.entries(a).map(([k,v]) => `${k}="${v}"`).join(' ')}/>`;
function svgFor(view) {
  const list = view === 'front' ? FRONT : BACK, by = {};
  list.forEach(s => (by[s.z] = by[s.z] || []).push(s));
  return `<svg viewBox="0 0 200 430" role="group" aria-label="${view} view body map"><g class="sil" aria-hidden="true">${SIL.map(([t,a]) => mk(t,a)).join('')}</g>` +
    Object.entries(by).map(([z, l]) => `<g class="zone" data-zone="${z}" role="button" tabindex="0" aria-controls="zonePanel">${l.map(s => mk(s.tag, s.a)).join('')}</g>`).join('') + `</svg>`;
}

let view = 'front', activeZone = null;
const mapSvg = document.getElementById('mapSvg');
const chipsEl = document.getElementById('zoneChips');
const panel = document.getElementById('zonePanel');

chipsEl.innerHTML = ZONES.map(z => `<button type="button" class="zchip" data-zone="${z.id}"><i></i>${z.name}<small></small></button>`).join('');

function renderMap() {
  mapSvg.innerHTML = svgFor(view);
  document.querySelectorAll('.viewbtn').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.view === view)));
  refresh();
}
function renderPanel() {
  if (!activeZone) {
    panel.innerHTML = '<p class="text-sm text-[#c7cfe0]">Tap any glowing area on the body, or pick from the list below. Everything starts as <strong class="text-white">Include</strong>, except optional areas, which start as <strong class="text-white">Skip</strong>.</p>';
    return;
  }
  const z = ZONES.find(x => x.id === activeZone), cur = zoneState[z.id];
  panel.innerHTML = `<h4 class="font-display text-sm text-mystic-glow mb-2">${z.name}</h4>
    <p class="hint mb-3">${z.desc}</p>
    ${z.sens ? '<p class="text-xs text-[#9fd0ff] mb-3">Optional area: starts as Skip. Choose a preference if you’d like to include or discuss it.</p>' : ''}
    <div class="flex flex-wrap gap-2" role="radiogroup" aria-label="${z.name} preference">
      <label class="pill"><input type="radio" name="zone_state" value="focus" ${cur==='focus'?'checked':''}><span>Focus here</span></label>
      <label class="pill"><input type="radio" name="zone_state" value="include" ${cur==='include'?'checked':''}><span>Include</span></label>
      <label class="pill ask"><input type="radio" name="zone_state" value="ask" ${cur==='ask'?'checked':''}><span>Ask me first</span></label>
      <label class="pill skip"><input type="radio" name="zone_state" value="skip" ${cur==='skip'?'checked':''}><span>Skip</span></label>
    </div>`;
}
function refresh(rebuildPanel = true) {
  document.querySelectorAll('.zone').forEach(g => {
    const id = g.dataset.zone;
    g.dataset.state = zoneState[id];
    g.classList.toggle('active', id === activeZone);
    g.setAttribute('aria-label', `${zname(id)}: ${STATES[zoneState[id]]}. Press Enter to change.`);
    g.setAttribute('aria-pressed', String(id === activeZone));
  });
  chipsEl.querySelectorAll('.zchip').forEach(c => {
    const id = c.dataset.zone;
    c.dataset.state = zoneState[id];
    c.querySelector('small').textContent = STATES[zoneState[id]];
    c.classList.toggle('active', id === activeZone);
    c.setAttribute('aria-pressed', String(id === activeZone));
    c.setAttribute('aria-controls', 'zonePanel');
  });
  const n = k => Object.values(zoneState).filter(s => s === k).length;
  document.getElementById('mapCount').textContent = `${n('focus')} focus · ${n('ask')} ask first · ${n('skip')} skipped`;
  if (rebuildPanel) renderPanel();
}
function selectZone(id) {
  if (submitting) return;
  activeZone = id;
  if (ZVIEW[id] && ZVIEW[id] !== view) { view = ZVIEW[id]; renderMap(); } else refresh();
}
mapSvg.addEventListener('click', e => { const g = e.target.closest('.zone'); if (g) selectZone(g.dataset.zone); });
mapSvg.addEventListener('keydown', e => { const g = e.target.closest('.zone'); if (g && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); selectZone(g.dataset.zone); } });
chipsEl.addEventListener('click', e => { const c = e.target.closest('.zchip'); if (c) selectZone(c.dataset.zone); });
panel.addEventListener('change', e => { if (e.target.name === 'zone_state' && activeZone) { zoneState[activeZone] = e.target.value; refresh(false); progress(); } });
document.querySelectorAll('.viewbtn').forEach(b => b.addEventListener('click', () => { if (submitting) return; view = b.dataset.view; renderMap(); }));
document.getElementById('mapReset').addEventListener('click', () => { if (submitting) return; defaultState(); activeZone = null; refresh(); });
renderMap();

function zoneSummary() {
  const g = { focus:[], include:[], ask:[], skip:[] };
  ZONES.forEach(z => g[zoneState[z.id]].push(z.name));
  return ['  Focus here: ' + (g.focus.join(', ') || '—'), '  Ask me first: ' + (g.ask.join(', ') || '—'),
          '  Skip: ' + (g.skip.join(', ') || '—'), '  Include as usual: ' + (g.include.join(', ') || '—')].join('\n');
}



/* ============ FORM LOGIC ============ */
const core = RecoveryIntake;
const form = document.getElementById('intakeForm');
const errBox = document.getElementById('formError');
const submitBtn = document.getElementById('submitBtn');
const submitStatus = document.getElementById('submitStatus');
const done = document.getElementById('done');
let lastData = null;
let submitting = false;
const smooth = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';

// Fragrance preferences stay in this page and travel only with the guest's request.
const scentState = Object.fromEntries(core.SCENTS.map(scent => [scent.id, 'neutral']));
const scentCards = document.getElementById('scentCards');
const scentFamilies = document.getElementById('scentFamilies');
const scentPanel = document.getElementById('scentPanel');
const scentLabels = { neutral: 'No preference', interested: 'Interested', discuss: 'Discuss with me', avoid: 'Avoid' };
let activeScent = core.SCENTS[0].id;
let activeFamily = 'all';
const families = ['all', ...new Set(core.SCENTS.map(scent => scent.family))];
scentFamilies.innerHTML = families.map(family => `<button type="button" class="scent-family" data-family="${family}" aria-controls="scentCards" aria-pressed="${family === 'all'}">${family === 'all' ? 'All scents' : family}</button>`).join('');
scentCards.innerHTML = core.SCENTS.map(scent => `<button type="button" class="scent-card" data-scent="${scent.id}" data-family="${scent.family}" aria-controls="scentPanel">
  <span class="scent-emblem" aria-hidden="true"><svg class="ico"><use href="#i-drop"/></svg></span><span class="scent-name">${scent.name}</span><small>${scent.family}</small><span class="scent-status">No preference</span></button>`).join('');
function renderScentPanel() {
  const scent = core.SCENTS.find(item => item.id === activeScent);
  scentPanel.innerHTML = `<div class="scent-panel-emblem" aria-hidden="true"><svg class="ico-lg"><use href="#i-drop"/></svg></div><p class="fragrance-kicker">${scent.family}</p><h4>${scent.name}</h4><p class="hint">How would you like this scent considered?</p>
    <div class="scent-actions" role="radiogroup" aria-label="${scent.name} preference">${Object.entries(scentLabels).map(([state, label]) => `<label class="pill ${state === 'avoid' ? 'skip' : state === 'discuss' ? 'ask' : ''}"><input type="radio" name="activeScentState" value="${state}" ${scentState[activeScent] === state ? 'checked' : ''}><span>${label}</span></label>`).join('')}</div><p class="hint scent-panel-note">Your choices help shape the atmosphere. Products are agreed before use.</p>`;
}
function refreshScents(rebuildPanel = true) {
  Object.assign(scentState, core.scentChoices({ scent: new FormData(form).get('scent'), scentMap: scentState }));
  for (const card of scentCards.children) {
    const id = card.dataset.scent;
    card.dataset.state = scentState[id];
    card.classList.toggle('active', id === activeScent);
    card.setAttribute('aria-pressed', String(id === activeScent));
    card.setAttribute('aria-label', `${core.SCENTS.find(s => s.id === id).name}: ${scentLabels[scentState[id]]}. Explore scent.`);
    card.querySelector('.scent-status').textContent = scentLabels[scentState[id]];
    card.hidden = activeFamily !== 'all' && card.dataset.family !== activeFamily;
  }
  scentFamilies.querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.family === activeFamily)));
  const count = state => Object.values(scentState).filter(value => value === state).length;
  const fragranceFree = new FormData(form).get('scent') === 'No added fragrance';
  form.querySelectorAll('input[name="scentIntensity"]').forEach(input => { input.disabled = fragranceFree; });
  document.getElementById('scentCount').textContent = `${fragranceFree ? 'No added fragrance' : 'Scent discussion requested'} · ${count('interested')} interested · ${count('discuss')} to discuss · ${count('avoid')} avoided`;
  const rows = ['interested', 'discuss', 'avoid'].map(state => {
    const selected = core.SCENTS.filter(scent => scentState[scent.id] === state);
    return `<div class="scent-selection-row" data-state="${state}"><span>${scentLabels[state]}</span><div>${selected.length ? selected.map(scent => `<button type="button" data-explore-scent="${scent.id}" aria-label="Review ${scent.name} preference">${scent.name}</button>`).join('') : '<small>None selected</small>'}</div></div>`;
  });
  document.getElementById('scentSelection').innerHTML = rows.join('');
  if (rebuildPanel) renderScentPanel();
}
function exploreScent(id) {
  if (submitting) return;
  activeScent = id;
  refreshScents();
  if (window.matchMedia('(max-width: 700px)').matches) scentPanel.scrollIntoView({ behavior: smooth(), block: 'nearest' });
}
scentCards.addEventListener('click', event => {
  const card = event.target.closest('[data-scent]');
  if (card) exploreScent(card.dataset.scent);
});
scentFamilies.addEventListener('click', event => {
  const button = event.target.closest('[data-family]');
  if (!button) return;
  activeFamily = button.dataset.family;
  if (activeFamily !== 'all' && core.SCENTS.find(s => s.id === activeScent).family !== activeFamily) activeScent = core.SCENTS.find(s => s.family === activeFamily).id;
  refreshScents();
});
scentPanel.addEventListener('change', event => {
  if (event.target.name !== 'activeScentState') return;
  scentState[activeScent] = event.target.value;
  if (['interested', 'discuss'].includes(event.target.value)) form.querySelector('input[name="scent"][value="Interested in a scent; discuss before use"]').checked = true;
  refreshScents(false);
});
document.getElementById('scentSelection').addEventListener('click', event => {
  const button = event.target.closest('[data-explore-scent]');
  if (!button) return;
  activeFamily = 'all';
  exploreScent(button.dataset.exploreScent);
  scentPanel.scrollIntoView({ behavior: smooth(), block: 'nearest' });
});
form.addEventListener('change', event => { if (event.target.name === 'scent') refreshScents(); });
document.getElementById('scentReset').addEventListener('click', () => {
  Object.keys(scentState).forEach(id => { scentState[id] = 'neutral'; });
  form.querySelector('input[name="scent"][value="No added fragrance"]').checked = true;
  form.querySelector('input[name="scentIntensity"][value="Light"]').checked = true;
  activeFamily = 'all';
  activeScent = core.SCENTS[0].id;
  refreshScents();
  progress();
});
refreshScents();

function values() {
  const fd = new FormData(form);
  return { ...Object.fromEntries(fd), times: fd.getAll('times'), days: fd.getAll('days'), health: fd.getAll('health'), style: fd.getAll('style'), scentMap: { ...scentState } };
}
function updateDates() {
  for (const id of ['date1', 'date2']) document.getElementById(id).min = core.todayISO();
}
function progress() {
  updateDates();
  const v = values();
  const checks = [
    !!v.name?.trim(), /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email?.trim() || ''),
    ['30','60','90'].includes(v.length),
    core.validDate(v.date1) && v.date1 >= core.todayISO() && (!v.date2 || (core.validDate(v.date2) && v.date2 >= core.todayISO())),
    !!v.flexible || v.times.length > 0, !!v.flexible || v.days.length > 0, !!v.drape, !!v.ack1, !!v.ack2, !!v.ack3, !!v.ackDelivery
  ];
  const n = checks.filter(Boolean).length;
  document.getElementById('pbar').style.width = `${n / checks.length * 100}%`;
  document.getElementById('ptxt').textContent = n === checks.length ? 'Alignment Complete' : `${n} of ${checks.length} required fields`;
  const pressure = document.getElementById('pressure');
  const text = `${pressure.value} · ${core.PRESSURE[Number(pressure.value)-1]}`;
  document.getElementById('pressureOut').textContent = text;
  pressure.setAttribute('aria-valuetext', text);
  updateSnapshot();
}
function clearErrors() {
  errBox.classList.add('hidden');
  form.querySelectorAll('[aria-invalid]').forEach(el => el.removeAttribute('aria-invalid'));
}
function showErrors(errors) {
  errBox.replaceChildren();
  const list = document.createElement('ul');
  list.className = 'list-disc pl-5 space-y-1';
  for (const error of errors) {
    const item = document.createElement('li');
    item.textContent = error.message;
    list.appendChild(item);
    if (error.field) form.querySelectorAll(`[name="${error.field}"]`).forEach(el => el.setAttribute('aria-invalid', 'true'));
  }
  const firstControl = errors[0]?.field && form.querySelector('[name="' + errors[0].field + '"]');
  if (firstControl) revealControl(firstControl);
  errBox.appendChild(list);
  errBox.classList.remove('hidden');
  errBox.focus({ preventScroll: true });
  errBox.scrollIntoView({ behavior: smooth(), block: 'center' });
}
function buildData() {
  const id = window.crypto?.randomUUID ? window.crypto.randomUUID() : `request-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return core.buildData(values(), zoneState, new Date(), id);
}
function saveRecord(data) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
  const a = document.createElement('a');
  a.href = url;
  const name = data.contact.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'draft';
  a.download = `somatic-intake-${name}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function prepareEmail(data) {
  const payload = core.payload(data, Object.fromEntries(ZONES.map(z => [z.id, z.name])));
  const body = Object.entries(payload).filter(([key]) => !key.startsWith('_') && key !== 'Complete record').map(([key, value]) => `${key}: ${value}`).join('\r\n');
  const subject = encodeURIComponent('NeuroKare — appointment request');
  let uri = `mailto:${PRACTITIONER_EMAIL}?subject=${subject}&body=${encodeURIComponent(body)}`;
  if (uri.length > 1800) {
    saveRecord(data);
    uri = `mailto:${PRACTITIONER_EMAIL}?subject=${subject}&body=${encodeURIComponent(`Please find my intake record attached.\r\nRequest ID: ${data.meta.requestId}\r\nName: ${data.contact.name}\r\nSession: ${data.availability.length} minutes\r\nEarliest date: ${data.availability.date1}\r\n\r\nPlease attach the downloaded JSON record before sending.`)}`;
    submitStatus.textContent = 'Your record was downloaded. Attach it to the email draft before sending; nothing has been emailed yet.';
  } else submitStatus.textContent = 'An email draft will open in your mail app. Review and send it there; this page has not sent that email.';
  const link = document.createElement('a');
  link.href = uri;
  link.click();
}

function updateSnapshot() {
  const v = values();
  document.getElementById('snapLength').textContent = `${v.length || '60'} min`;
  document.getElementById('snapPressure').textContent = core.PRESSURE[Number(v.pressure) - 1];
  document.getElementById('snapFocus').textContent = Object.values(zoneState).filter(s => s === 'focus').length;
  document.getElementById('snapSkip').textContent = `${Object.values(zoneState).filter(s => s === 'skip').length} skipped`;
}
function readableSummary(data) {
  const payload = core.payload(data, Object.fromEntries(ZONES.map(z => [z.id, z.name])));
  return Object.entries(payload).filter(([key]) => !key.startsWith('_') && key !== 'Complete record').map(([key, value]) => `${key}: ${value || '—'}`).join('\n');
}
function refreshRecord() {
  document.getElementById('summary').textContent = readableSummary(lastData);
  document.getElementById('jsonPreview').textContent = JSON.stringify(lastData, null, 2);
}
function renderReview() {
  document.getElementById('doneTitle').textContent = `Ready when you are, ${lastData.contact.name.split(/\s+/)[0]}.`;
  document.getElementById('doneMsg').textContent = 'Review your personalized session plan below. Nothing has been sent yet. We’ll fine-tune the details together when I arrive.';
  document.getElementById('sendReviewedBtn').classList.remove('hidden');
  document.getElementById('retryBtn').classList.add('hidden');
  refreshRecord();
  form.classList.add('hidden');
  document.getElementById('intakeProgress').classList.add('hidden');
  document.querySelector('.session-snapshot').classList.add('hidden');
  done.classList.remove('hidden');
  done.focus({ preventScroll:true });
  done.scrollIntoView({ behavior:smooth(), block:'start' });
}
async function sendReviewed() {
  if (submitting || !lastData || lastData.meta.status === 'accepted-by-delivery-service') return;
  submitting = true;
  const buttons = [...done.querySelectorAll('button')];
  buttons.forEach(btn => { btn.disabled = true; });
  done.setAttribute('aria-busy', 'true');
  const message = document.getElementById('doneMsg');
  message.textContent = 'Sending your appointment request. Please keep this page open.';
  try {
    await core.send(FORM_ENDPOINT, lastData, Object.fromEntries(ZONES.map(z => [z.id, z.name])));
    lastData.meta.status = 'accepted-by-delivery-service';
    document.getElementById('doneTitle').textContent = 'Your request is on its way.';
    message.textContent = 'The delivery service accepted your request for email delivery. Your time is not booked yet; the practitioner will contact you to confirm your time and session preferences.';
    document.getElementById('sendReviewedBtn').classList.add('hidden');
    document.getElementById('retryBtn').classList.add('hidden');
  } catch {
    lastData.meta.status = 'delivery-unconfirmed';
    document.getElementById('doneTitle').textContent = 'Your answers are still here.';
    message.textContent = 'We could not confirm delivery. Download your record or prepare an email below. Check with the practitioner before retrying if a request may already have arrived, so it is not duplicated.';
    document.getElementById('sendReviewedBtn').classList.add('hidden');
    document.getElementById('retryBtn').classList.remove('hidden');
  } finally {
    submitting = false;
    buttons.forEach(btn => { btn.disabled = false; });
    done.removeAttribute('aria-busy');
    refreshRecord();
  }
}

document.querySelectorAll('[data-quick-name]').forEach(button => button.addEventListener('click', () => {
  const choices = button.dataset.vals === '*' ? null : button.dataset.vals.split(',');
  form.querySelectorAll(`input[name="${button.dataset.quickName}"]`).forEach(input => {
    input.checked = choices === null || choices.includes(input.value);
  });
  clearErrors();
  progress();
}));
// Multiple atmosphere preferences, with consistent fallback and conflicting choices.
form.addEventListener('change', event => {
  const selected = event.target;
  if (selected.name !== 'style') return;
  const choices = [...form.querySelectorAll('input[name="style"]')];
  const fallback = choices.find(input => input.value === 'No preference');
  if (selected.checked) {
    if (selected === fallback) choices.forEach(input => { input.checked = input === fallback; });
    else {
      fallback.checked = false;
      if (selected.dataset.atmosphereGroup) choices.forEach(input => {
        if (input !== selected && input.dataset.atmosphereGroup === selected.dataset.atmosphereGroup && (selected.value === 'No music' || input.value === 'No music')) input.checked = false;
      });
      const conversation = ['Quiet, minimal talking', 'Casual conversation welcome'];
      if (conversation.includes(selected.value)) choices.forEach(input => {
        if (input !== selected && conversation.includes(input.value)) input.checked = false;
      });
    }
  }
  if (!choices.some(input => input.checked)) fallback.checked = true;
});
form.addEventListener('input', () => { clearErrors(); progress(); });
form.addEventListener('change', () => { clearErrors(); progress(); });
window.addEventListener('focus', progress);
document.getElementById('mapReset').addEventListener('click', progress);
progress();

form.addEventListener('submit', event => {
  event.preventDefault();
  if (submitting) return;
  clearErrors();
  const problems = core.validate(values());
  if (problems.length) { showErrors(problems); return; }
  if (!form.checkValidity()) { form.reportValidity(); return; }
  lastData = buildData();
  renderReview();
});
document.getElementById('sendReviewedBtn').addEventListener('click', sendReviewed);
document.getElementById('retryBtn').addEventListener('click', sendReviewed);
document.getElementById('jsonNowBtn').addEventListener('click', () => saveRecord(buildData()));
document.getElementById('jsonBtn').addEventListener('click', () => { if (lastData) saveRecord(lastData); });
document.getElementById('mailBtn').addEventListener('click', () => {
  if (!lastData) return;
  prepareEmail(lastData);
  document.getElementById('doneMsg').textContent = submitStatus.textContent;
});
document.getElementById('copyBtn').addEventListener('click', async event => {
  if (!lastData) return;
  try {
    await navigator.clipboard.writeText(JSON.stringify(lastData, null, 2));
    event.target.textContent = 'Copied';
  } catch {
    document.getElementById('jsonPreview').closest('details').open = true;
    event.target.textContent = 'Select and copy JSON below';
  }
});
document.getElementById('editBtn').addEventListener('click', () => {
  if (submitting) return;
  done.classList.add('hidden');
  form.classList.remove('hidden');
  document.getElementById('intakeProgress').classList.remove('hidden');
  document.querySelector('.session-snapshot').classList.remove('hidden');
  window.openBookingStep?.(0, false);
  document.getElementById('name').focus();
  progress();
});


// Progressive disclosure: all original inputs stay in the same form and JSON schema.
function initGuidedBooking() {
  const labels = [
    ['About you', 'Name and email to confirm your request.'],
    ['Your visit & timing', 'Session length, location, and when you’re available.'],
    ['Focus & pressure', 'Optional: tell me where to focus, or keep the balanced defaults.'],
    ['Atmosphere', 'Optional: music, conversation, and scent preferences.'],
    ['Comfort & setup', 'Choose how you’d like to get settled.'],
    ['Health check', 'Share anything relevant so I can plan appropriately.'],
    ['Review & prepare', 'A few final checks, then preview before sending.']
  ];
  const fieldsets = [...form.children].filter(el => el.tagName === 'FIELDSET');
  if (fieldsets.length !== labels.length) return;
  const steps = fieldsets.map((fieldset, i) => {
    const details = document.createElement('details');
    details.className = 'booking-step';
    details.id = 'booking-step-' + (i + 1);
    const summary = document.createElement('summary');
    summary.innerHTML = '<span class="step-number">' + (i + 1) + '</span><span class="step-heading"><strong>' + labels[i][0] + '</strong><small>' + labels[i][1] + '</small></span><span class="step-status">Open</span>';
    fieldset.before(details);
    details.append(summary, fieldset);
    const nav = document.createElement('div');
    nav.className = 'step-actions';
    if (i > 0) {
      const back = document.createElement('button');
      back.type = 'button'; back.className = 'chip-btn'; back.textContent = 'Back';
      back.addEventListener('click', () => openStep(i - 1));
      nav.append(back);
    }
    if (i < labels.length - 1) {
      const next = document.createElement('button');
      next.type = 'button'; next.className = 'primary-action';
      next.textContent = 'Continue to ' + labels[i + 1][0].toLowerCase();
      next.addEventListener('click', () => {
        clearErrors();
        const names = new Set([...fieldset.querySelectorAll('[name]')].map(el => el.name));
        const errors = core.validate(values()).filter(error => names.has(error.field));
        if (errors.length) { showErrors(errors); return; }
        const invalid = [...fieldset.querySelectorAll('input, select, textarea')].find(el => !el.checkValidity());
        if (invalid) { revealControl(invalid); invalid.reportValidity(); return; }
        details.dataset.visited = 'true';
        summary.querySelector('.step-status').textContent = 'Visited';
        openStep(i + 1);
      });
      nav.append(next);
    }
    details.append(nav);
    details.addEventListener('toggle', () => {
      if (!details.open) return;
      steps.forEach(other => { if (other !== details) other.open = false; });
      stepPosition.textContent = 'Step ' + (i + 1) + ' of ' + labels.length + ' · ' + labels[i][0];
    });
    return details;
  });
  const stepPosition = document.createElement('p');
  stepPosition.id = 'stepPosition'; stepPosition.className = 'guided-position';
  stepPosition.setAttribute('role', 'status'); stepPosition.setAttribute('aria-live', 'polite');
  form.before(stepPosition);
  function openStep(i, scroll = true) {
    steps.forEach((step, n) => { step.open = n === i; });
    stepPosition.textContent = 'Step ' + (i + 1) + ' of ' + labels.length + ' · ' + labels[i][0];
    if (scroll) {
      const summary = steps[i].querySelector('summary');
      summary.tabIndex = 0;
      summary.focus({preventScroll:true});
      steps[i].scrollIntoView({behavior:smooth(), block:'start'});
    }
  }
  window.openBookingStep = openStep;
  // Keep delivery agreement and preview actions inside the final step.
  const delivery = document.getElementById('deliveryNote').closest('.delivery-note');
  const previewActions = document.getElementById('submitBtn').parentElement;
  steps.at(-1).insertBefore(delivery, steps.at(-1).lastElementChild);
  steps.at(-1).insertBefore(previewActions, steps.at(-1).lastElementChild);
  function disclose(element, title, description) {
    const details = document.createElement('details');
    details.className = 'optional-detail';
    const summary = document.createElement('summary');
    summary.textContent = title;
    element.before(details);
    details.append(summary);
    if (description) {
      const hint = document.createElement('p'); hint.className = 'hint'; hint.textContent = description;
      details.append(hint);
    }
    details.append(element);
    return details;
  }
  disclose(document.getElementById('bodymap'), 'Customize specific body areas (optional)', 'Balanced defaults are already selected. Optional areas stay skipped unless you choose otherwise. Open this only if you want more detail.');
  disclose(document.getElementById('techniqueInterests').parentElement, 'Explore a style or technique (optional)');
  disclose(document.getElementById('ecName').parentElement, 'Add an emergency contact (optional)');
  disclose(document.getElementById('timing').parentElement, 'Training context (optional)');
  const scentDetails = disclose(document.getElementById('fragranceMatrix'), 'Explore scent choices (optional)', 'Fragrance-free is the default. You can still note scents to avoid.');
  form.addEventListener('change', event => {
    if (event.target.name === 'scent' && event.target.value !== 'No added fragrance') scentDetails.open = true;
  });
  // Detailed technique descriptions are reference material, not a booking step.
  const sequence = document.querySelector('section[aria-labelledby="seq-h"]');
  const sequenceGrid = sequence.querySelector('.grid');
  disclose(sequenceGrid, 'Explore the recommended 60-minute sequence', 'Reference only—you can book without reading every technique.');
  function revealHash() {
    if (!location.hash) return;
    const target = document.getElementById(location.hash.slice(1));
    if (!target) return;
    revealControl(target);
    target.scrollIntoView({behavior:smooth(), block:'start'});
  }
  window.addEventListener('hashchange', revealHash);
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    if (link?.getAttribute('href') === '#bodymap') {
      const target = document.getElementById('bodymap');
      revealControl(target);
    }
  });
  openStep(0, false);
  revealHash();
}
function revealControl(control) {
  let parent = control.parentElement;
  while (parent) {
    if (parent.tagName === 'DETAILS') parent.open = true;
    parent = parent.parentElement;
  }
}
initGuidedBooking();

// A quiet, optional response to pointer movement, never needed to use the page.
const artwork = document.getElementById('heroArtwork');
const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
artwork.addEventListener('pointermove', event => {
  if (motion.matches || event.pointerType !== 'mouse') return;
  const rect = artwork.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width - .5) * 4;
  const y = ((event.clientY - rect.top) / rect.height - .5) * -4;
  artwork.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${y}deg)`;
});
artwork.addEventListener('pointerleave', () => { artwork.style.transform = ''; });
