/* ============ BODY MAP ============ */
const ZONES = [
  { id:'neck', name:'Neck & upper traps', desc:'Explore small, comfortable head turns. No neck pressure or forced end-range movement.' },
  { id:'shoulders', name:'Shoulders', desc:'Explore easy shoulder circles or a short, comfortable wall slide.' },
  { id:'upper_back', name:'Upper back & shoulder blades', desc:'Consider a small seated torso turn without forcing the shoulders.' },
  { id:'low_back', name:'Low back', desc:'Notice comfortable movement. Pain or radiating symptoms require appropriate assessment.' },
  { id:'glutes', name:'Glutes', sens:true, desc:'A movement-planning area only. No practitioner-provided pressure or touch.' },
  { id:'hamstrings', name:'Hamstrings', desc:'Explore a gentle seated knee extension without locking the knee or pulling hard.' },
  { id:'calves', name:'Calves', desc:'Explore easy ankle circles. Do not exercise a newly swollen, hot, or painful calf.' },
  { id:'feet', name:'Feet & toes', desc:'Explore easy toe opening and ankle movement, within comfort.' },
  { id:'forearms', name:'Forearms & grip', desc:'Explore gentle wrist circles and opening the hands; no sustained gripping.' },
  { id:'elbows', name:'Elbows', desc:'Explore comfortable bending and straightening without weights.' },
  { id:'chest', name:'Upper chest', sens:true, desc:'A map reference only. No pressure, tissue work, or product application is offered.' },
  { id:'underarm', name:'Underarm / side of ribcage', sens:true, desc:'A map reference only. No direct pressure or touch is offered.' },
  { id:'hipflex', name:'Front of hips', sens:true, desc:'Explore movement only within comfort; no abdominal or groin pressure.' },
  { id:'inner', name:'Inner thighs', sens:true, desc:'A map reference only. No touch or forced stretching is offered.' },
  { id:'quads', name:'Front of thighs', desc:'Explore comfortable bending and straightening of the knee, without forcing range.' }
];
const ZVIEW = { chest:'front', underarm:'front', hipflex:'front', quads:'front', inner:'front', upper_back:'back', low_back:'back', glutes:'back', hamstrings:'back', calves:'back' };
const STATES = { focus:'Focus here', include:'Include', ask:'Learn more', skip:'Skip' };
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
    panel.innerHTML = '<p class="text-sm text-[#c7cfe0]">Tap any glowing area on the body, or pick from the list below. Everything starts as <strong class="text-white">Include</strong>, except sensitive areas, which start as <strong class="text-white">Skip</strong>.</p>';
    return;
  }
  const z = ZONES.find(x => x.id === activeZone), cur = zoneState[z.id];
  panel.innerHTML = `<h4 class="font-display text-sm text-mystic-glow mb-2">${z.name}</h4>
    <p class="hint mb-3">${z.desc}</p>
    ${z.sens ? '<p class="text-xs text-[#9fd0ff] mb-3">Sensitive area: starts as Skip. This is a movement-planning reference, not permission for touch.</p>' : ''}
    <div class="flex flex-wrap gap-2" role="radiogroup" aria-label="${z.name} preference">
      <label class="pill"><input type="radio" name="zone_state" value="focus" ${cur==='focus'?'checked':''}><span>Focus here</span></label>
      <label class="pill"><input type="radio" name="zone_state" value="include" ${cur==='include'?'checked':''}><span>Include</span></label>
      <label class="pill ask"><input type="radio" name="zone_state" value="ask" ${cur==='ask'?'checked':''}><span>Learn more</span></label>
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
  document.getElementById('mapCount').textContent = `${n('focus')} focus · ${n('ask')} learning choices · ${n('skip')} skipped`;
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
  return ['  Focus here: ' + (g.focus.join(', ') || '—'), '  Learn more: ' + (g.ask.join(', ') || '—'),
          '  Skip: ' + (g.skip.join(', ') || '—'), '  Include as usual: ' + (g.include.join(', ') || '—')].join('\n');
}



/* ============ FORM LOGIC ============ */
const core = RecoveryIntake;
const form = document.getElementById('intakeForm');
const errBox = document.getElementById('formError');


const done = document.getElementById('done');
let lastData = null;
let submitting = false;
const smooth = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';

// Fragrance preferences remain in this page. There is no transmission function.
const scentState = Object.fromEntries(core.SCENTS.map(scent => [scent.id, 'neutral']));
const scentCards = document.getElementById('scentCards');
const scentFamilies = document.getElementById('scentFamilies');
const scentPanel = document.getElementById('scentPanel');
const scentLabels = { neutral: 'No preference', interested: 'Interested', discuss: 'Explore later', avoid: 'Avoid' };
let activeScent = core.SCENTS[0].id;
let activeFamily = 'all';
const families = ['all', ...new Set(core.SCENTS.map(scent => scent.family))];
scentFamilies.innerHTML = families.map(family => `<button type="button" class="scent-family" data-family="${family}" aria-controls="scentCards" aria-pressed="${family === 'all'}">${family === 'all' ? 'All scents' : family}</button>`).join('');
scentCards.innerHTML = core.SCENTS.map(scent => `<button type="button" class="scent-card" data-scent="${scent.id}" data-family="${scent.family}" aria-controls="scentPanel">
  <span class="scent-emblem" aria-hidden="true"><svg class="ico"><use href="#i-drop"/></svg></span><span class="scent-name">${scent.name}</span><small>${scent.family}</small><span class="scent-status">No preference</span></button>`).join('');
function renderScentPanel() {
  const scent = core.SCENTS.find(item => item.id === activeScent);
  scentPanel.innerHTML = `<div class="scent-panel-emblem" aria-hidden="true"><svg class="ico-lg"><use href="#i-drop"/></svg></div><p class="fragrance-kicker">${scent.family}</p><h4>${scent.name}</h4><p class="hint">How would you like this scent considered?</p>
    <div class="scent-actions" role="radiogroup" aria-label="${scent.name} preference">${Object.entries(scentLabels).map(([state, label]) => `<label class="pill ${state === 'avoid' ? 'skip' : state === 'discuss' ? 'ask' : ''}"><input type="radio" name="activeScentState" value="${state}" ${scentState[activeScent] === state ? 'checked' : ''}><span>${label}</span></label>`).join('')}</div><p class="hint scent-panel-note">A visual preference only. No products are supplied, applied, or recommended for skin.</p>`;
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
  document.getElementById('scentCount').textContent = `${fragranceFree ? 'No added fragrance' : 'Exploring scent preferences'} · ${count('interested')} interested · ${count('discuss')} to discuss · ${count('avoid')} avoided`;
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
  if (['interested', 'discuss'].includes(event.target.value)) form.querySelector('input[name="scent"][value="Explore scent preferences"]').checked = true;
  refreshScents(false);
  progress();
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
  return { ...Object.fromEntries(fd), style:fd.getAll('style'), scentMap:{...scentState} };
}
function progress() {
  const v=values();
  const pace=core.PACE[Number(v.effort)-1] || core.PACE[0];
  document.getElementById('pressureOut').textContent=pace;
  document.getElementById('effort').setAttribute('aria-valuetext',pace);
  document.getElementById('snapLength').textContent=`${v.length} min`;
  document.getElementById('snapPressure').textContent=pace;
  document.getElementById('snapFocus').textContent=Object.values(zoneState).filter(s=>s==='focus').length;
  document.getElementById('snapSkip').textContent=`${Object.values(zoneState).filter(s=>s==='skip').length} skipped`;
}
function clearErrors() {errBox.classList.add('hidden');errBox.textContent='';}
function showErrors(errors) {
  errBox.textContent=errors.map(e=>e.message).join(' ');
  errBox.classList.remove('hidden');errBox.focus();
}
function renderReview() {
  const names=Object.fromEntries(ZONES.map(z=>[z.id,z.name]));
  document.getElementById('summary').textContent=core.summary(lastData,names);
  document.getElementById('jsonPreview').textContent=JSON.stringify(lastData,null,2);
  const outline=document.getElementById('routineOutline');outline.replaceChildren();
  const heading=document.createElement('h4');heading.textContent=lastData.outline.title;outline.appendChild(heading);
  const caution=document.createElement('p');caution.className='hint';caution.textContent=lastData.outline.note;outline.appendChild(caution);
  const list=document.createElement('ol');
  lastData.outline.steps.forEach(step=>{const item=document.createElement('li');item.textContent=`${step.minutes} min · ${step.label}: ${step.detail}`;list.appendChild(item);});outline.appendChild(list);
  form.classList.add('hidden');document.querySelector('.session-snapshot').classList.add('hidden');done.classList.remove('hidden');done.focus();done.scrollIntoView({behavior:smooth(),block:'start'});
}
function clearPlan() {
  form.reset();lastData=null;defaultState();activeZone=null;view='front';
  Object.keys(scentState).forEach(id=>scentState[id]='neutral');activeFamily='all';activeScent=core.SCENTS[0].id;
  document.getElementById('summary').textContent='';document.getElementById('jsonPreview').textContent='';document.getElementById('routineOutline').replaceChildren();
  done.classList.add('hidden');form.classList.remove('hidden');document.querySelector('.session-snapshot').classList.remove('hidden');clearErrors();renderMap();refreshScents();progress();
}
form.addEventListener('change',event=>{
  const selected=event.target;if(selected.name!=='style')return;
  const choices=[...form.querySelectorAll('input[name="style"]')];const fallback=choices.find(i=>i.value==='No preference');
  if(selected.checked){if(selected===fallback)choices.forEach(i=>i.checked=i===fallback);else {fallback.checked=false;if(selected.dataset.atmosphereGroup)choices.forEach(i=>{if(i!==selected && i.dataset.atmosphereGroup===selected.dataset.atmosphereGroup && (selected.value==='No music'||i.value==='No music'))i.checked=false;});}}
  if(!choices.some(i=>i.checked))fallback.checked=true;
});
form.addEventListener('input',()=>{clearErrors();progress();});form.addEventListener('change',()=>{clearErrors();progress();});
form.addEventListener('submit',event=>{
  event.preventDefault();clearErrors();const v=values();const errors=core.validate(v);if(errors.length){showErrors(errors);return;}
  lastData=core.buildData(v,zoneState);renderReview();
});
document.getElementById('editBtn').addEventListener('click',()=>{done.classList.add('hidden');form.classList.remove('hidden');document.querySelector('.session-snapshot').classList.remove('hidden');document.getElementById('theme').focus();progress();});
for(const id of ['clearPlan','clearReview'])document.getElementById(id).addEventListener('click',clearPlan);
document.getElementById('jsonBtn').addEventListener('click',()=>{
  if(!lastData)return;const url=URL.createObjectURL(new Blob([JSON.stringify(lastData,null,2)],{type:'application/json'}));
  const a=document.createElement('a');a.href=url;a.download='spin-diesel-personal-plan.json';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
});
window.addEventListener('pageshow',event=>{if(event.persisted)clearPlan();});
clearPlan();
const artwork=document.getElementById('heroArtwork');const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
artwork.addEventListener('pointermove',event=>{if(motion.matches||event.pointerType!=='mouse')return;const r=artwork.getBoundingClientRect();artwork.style.transform=`perspective(1000px) rotateY(${((event.clientX-r.left)/r.width-.5)*4}deg) rotateX(${((event.clientY-r.top)/r.height-.5)*-4}deg)`;});
artwork.addEventListener('pointerleave',()=>{artwork.style.transform='';});
