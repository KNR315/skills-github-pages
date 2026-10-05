
/* ============ CONFIG ============ */
const FORM_ENDPOINT = "https://formsubmit.co/ajax/khylannr15@gmail.com";
const PRACTITIONER_EMAIL = "khylannr15@gmail.com";

/* ============ BODY MAP ============ */
const ZONES = [
  { id:'neck', name:'Cervical & Upper Traps', desc:'Broad, slow myofascial release along the neck and shoulders.' },
  { id:'shoulders', name:'Deltoid Complex', desc:'Addressing overhead inversion fatigue in the shoulder capsule.' },
  { id:'upper_back', name:'Scapular Region', desc:'Unbinding rhomboids and latissimus dorsi attachments.' },
  { id:'low_back', name:'Lumbar Spine', desc:'Sweeping decompression for the lower posterior chain.' },
  { id:'glutes', name:'Gluteal Group', sens:true, desc:'Broad forearm compression over drapery to release external rotators.' },
  { id:'hamstrings', name:'Hamstrings', desc:'Downward rhythmic pétrissage.' },
  { id:'calves', name:'Gastrocnemius', desc:'Deep stripping to counter constant plantar flexion (toe-pointing).' },
  { id:'feet', name:'Plantar Fascia', desc:'Restoration for the arches and toe joints.' },
  { id:'forearms', name:'Forearm Flexors', desc:'Active pin-and-stretch to reset grip fatigue.' },
  { id:'elbows', name:'Epicondyles', desc:'Relieving the origins of medial/lateral elbow strain.' },
  { id:'chest', name:'Pectoralis Minor', sens:true, desc:'Static anchor beneath the clavicle to open rounded shoulders. No breast tissue involvement.' },
  { id:'underarm', name:'Subscapularis', sens:true, desc:'Axillary hold against the ribcage. Practitioner guided or self-applied.' },
  { id:'hipflex', name:'Psoas / Iliacus', sens:true, desc:'Breath-assisted, sustained pressure near the anterior hip bone.' },
  { id:'inner', name:'Adductors', sens:true, desc:'Broad, flat compression avoiding the groin and bruising. Highly sensitive in pole athletes.' },
  { id:'quads', name:'Quadriceps', desc:'Broad flushing along the anterior thigh.' }
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
    panel.innerHTML = '<p class="text-sm font-light text-mystic-champagne/60 leading-relaxed italic">Select an area on the topography map or from the list to define your boundaries. Intrusive zones default to <strong class="text-mystic-rose font-medium">Skip</strong>.</p>';
    return;
  }
  const z = ZONES.find(x => x.id === activeZone), cur = zoneState[z.id];
  panel.innerHTML = `
    <h4 class="font-serif text-lg text-mystic-champagne mb-2 border-b border-mystic-copper/20 pb-1 inline-block">${z.name}</h4>
    <p class="hint mb-4 text-xs">${z.desc}</p>
    ${z.sens ? '<p class="text-xs text-mystic-rose mb-4 italic">Sensory Zone: Requires explicit opt-in.</p>' : ''}
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
    g.setAttribute('aria-label', `${zname(id)}: ${STATES[zoneState[id]]}`);
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
  document.getElementById('mapCount').textContent = `FOCAL: ${n('focus')} | VERBAL: ${n('ask')} | OMITTED: ${n('skip')}`;
  if (rebuildPanel) renderPanel();
}

function selectZone(id) {
  if (submitting) return;
  activeZone = id;
  if (ZVIEW[id] && ZVIEW[id] !== view) { view = ZVIEW[id]; renderMap(); } else refresh();
}

mapSvg.addEventListener('keydown', e => {
  const g = e.target.closest('.zone');
  if (g && ['Enter', ' '].includes(e.key)) { e.preventDefault(); selectZone(g.dataset.zone); }
});
mapSvg.addEventListener('click', e => { const g = e.target.closest('.zone'); if (g) selectZone(g.dataset.zone); });
chipsEl.addEventListener('click', e => { const c = e.target.closest('.zchip'); if (c) selectZone(c.dataset.zone); });
panel.addEventListener('change', e => { if (e.target.name === 'zone_state' && activeZone) { zoneState[activeZone] = e.target.value; refresh(false); progress(); } });
document.querySelectorAll('.viewbtn').forEach(b => b.addEventListener('click', () => { if (submitting) return; view = b.dataset.view; renderMap(); }));
document.getElementById('mapReset').addEventListener('click', () => { if (submitting) return; defaultState(); activeZone = null; refresh(); });

renderMap();

function zoneSummary() {
  const g = { focus:[], include:[], ask:[], skip:[] };
  ZONES.forEach(z => g[zoneState[z.id]].push(z.name));
  return ['  Focus: ' + (g.focus.join(', ') || '—'), '  Ask First: ' + (g.ask.join(', ') || '—'),
          '  Skipped: ' + (g.skip.join(', ') || '—'), '  Included: ' + (g.include.join(', ') || '—')].join('\n');
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

function values() {
  const fd = new FormData(form);
  return { ...Object.fromEntries(fd), times: fd.getAll('times') };
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
    !!v.flexible || v.times.length > 0, !!v.drape, !!v.ack1, !!v.ack3, !!v.ackDelivery
  ];
  const n = checks.filter(Boolean).length;
  document.getElementById('pbar').style.width = `${n / checks.length * 100}%`;
  document.getElementById('ptxt').textContent = n === checks.length ? 'Alignment Complete' : `${n} of ${checks.length} required fields`;
  const pressure = document.getElementById('pressure');
  const text = `${pressure.value} · ${core.PRESSURE[Number(pressure.value)-1]}`;
  document.getElementById('pressureOut').textContent = text;
  pressure.setAttribute('aria-valuetext', text);
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
  const subject = encodeURIComponent('Spin Diesel Recovery — appointment request');
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

form.addEventListener('input', e => {
  e.target.removeAttribute('aria-invalid');
  progress();
});
form.addEventListener('change', progress);
window.addEventListener('focus', progress);
progress();

form.addEventListener('submit', async e => {
  e.preventDefault();
  if (submitting) return;
  clearErrors();
  const problems = core.validate(values());
  if (problems.length) { showErrors(problems); return; }
  if (!form.checkValidity()) { form.reportValidity(); return; }
  submitting = true;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending intentions…';
  form.setAttribute('aria-busy', 'true');
  submitStatus.textContent = 'Sending your appointment request. Please keep this page open.';
  lastData = buildData();
  // Freeze the request after taking its snapshot so edits cannot disappear during delivery.
  const locked = [...form.querySelectorAll('input, select, textarea, button')].filter(el => !el.disabled);
  locked.forEach(el => { el.disabled = true; });
  try {
    await core.send(FORM_ENDPOINT, lastData, Object.fromEntries(ZONES.map(z => [z.id, z.name])));
    lastData.meta.status = 'accepted-by-delivery-service';
    document.getElementById('doneName').textContent = lastData.contact.name.split(/\s+/)[0];
    document.getElementById('doneMsg').textContent = 'The delivery service accepted your intake for email delivery. Your session time is not yet booked; the practitioner will contact you to confirm availability and boundaries. Please contact us directly if you do not hear back.';
    form.classList.add('hidden');
    document.getElementById('intakeProgress').classList.add('hidden');
    done.classList.remove('hidden');
    done.focus({ preventScroll: true });
    done.scrollIntoView({ behavior: smooth(), block: 'start' });
    submitStatus.textContent = '';
  } catch (error) {
    lastData.meta.status = 'delivery-unconfirmed';
    submitStatus.textContent = 'Your responses remain on this page. You can save a draft or prepare an email below.';
    showErrors([{ message: 'We could not confirm delivery. Check your connection, then save your record or email a request manually. If you already sent a request, confirm with the practitioner before retrying to avoid duplicates.' }]);
  } finally {
    locked.forEach(el => { el.disabled = false; });
    submitting = false;
    submitBtn.disabled = false;
    submitBtn.textContent = 'Solidify Intentions';
    form.removeAttribute('aria-busy');
  }
});

document.getElementById('draftBtn').addEventListener('click', () => saveRecord(buildData()));
document.getElementById('draftMailBtn').addEventListener('click', () => prepareEmail(buildData()));
document.getElementById('jsonBtn').addEventListener('click', () => { if (lastData) saveRecord(lastData); });
document.getElementById('mailBtn').addEventListener('click', () => {
  if (!lastData) return;
  prepareEmail(lastData);
  document.getElementById('doneMsg').textContent = submitStatus.textContent;
});
document.getElementById('editBtn').addEventListener('click', () => {
  done.classList.add('hidden');
  form.classList.remove('hidden');
  document.getElementById('intakeProgress').classList.remove('hidden');
  document.getElementById('name').focus();
  progress();
});
