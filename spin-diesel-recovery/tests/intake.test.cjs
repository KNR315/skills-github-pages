const { test } = require('node:test');
const assert = require('node:assert/strict');
const core = require('../intake-core.js');
const fs = require('node:fs');

const values = {
  name: '  Example Athlete  ', pronouns: 'they/them', email: 'athlete@example.com', phone: '555-0100',
  length: '60', date1: '2026-10-05', date2: '2026-10-07', times: ['Evening (4-8pm)'],
  flexible: 'yes', timing: 'Routine Maintenance', pressure: '4', style: 'Quiet',
  days: ['Mon','Fri'], contactPref: 'either', ecName: 'Example Contact, 555-0101',
  waitlist: 'yes', group: 'yes', chaperone: 'I would like a friend in the room', health: ['Recent surgery'],
  drape: 'Clothed', notes: '<script>literal text</script>', stopWord: 'Red',
  ack1: 'on', ack2: 'on', ack3: 'on', ack4: 'on', ackDelivery: 'on'
};
const zones = { neck: 'focus', glutes: 'skip', chest: 'ask' };
const record = () => core.buildData(values, zones, new Date('2026-10-05T13:00:00Z'), 'test-request');

test('St. Louis dates remain correct across midnight and daylight saving', () => {
  assert.equal(core.todayISO(new Date('2026-10-06T03:00:00Z')), '2026-10-05');
  assert.equal(core.todayISO(new Date('2026-12-06T05:59:00Z')), '2026-12-05');
});
test('valid intake and flexible-only windows are accepted', () => {
  assert.deepEqual(core.validate(values, '2026-10-05'), []);
  assert.deepEqual(core.validate({ ...values, times: [] }, '2026-10-05'), []);
});
test('invalid contact, missing time, consent, and session length are rejected', () => {
  const fields = core.validate({ ...values, name: '', email: 'x@@example.com', length: '', times: [], flexible: '', drape: '', ack1: '', ack3: '', ackDelivery: '' }, '2026-10-05').map(e => e.field);
  for (const field of ['name','email','length','times','drape','ack1','ackDelivery']) assert.ok(fields.includes(field));
});
test('past, malformed, and impossible dates are rejected for both date fields', () => {
  for (const date of ['2026-10-04','2026-02-30','garbage']) {
    assert.ok(core.validate({ ...values, date1: date }, '2026-10-05').some(e => e.field === 'date1'));
    assert.ok(core.validate({ ...values, date2: date }, '2026-10-05').some(e => e.field === 'date2'));
  }
});
test('record retains every intake answer and a snapshot of the body map', () => {
  const data = record();
  assert.equal(data.contact.name, 'Example Athlete');
  assert.equal(data.contact.pronouns, values.pronouns);
  assert.equal(data.availability.date2, values.date2);
  assert.equal(data.availability.flexible, true);
  assert.equal(data.availability.trainingContext, values.timing);
  assert.equal(data.preferences.pressureLabel, 'Firm-deep');
  assert.equal(data.boundaries.notes, values.notes);
  assert.deepEqual(data.preferences.bodyMap, zones);
  assert.equal(data.agreements.emailDelivery, true);
  assert.equal(data.meta.status, 'prepared');
  data.preferences.bodyMap.glutes = 'include';
  assert.equal(zones.glutes, 'skip');
});
test('provider payload includes boundaries, body map, and full record', () => {
  const payload = core.payload(record(), { neck: 'Neck', glutes: 'Glutes', chest: 'Chest' });
  assert.match(payload['Body map'], /focus: Neck/);
  assert.match(payload['Body map'], /skip: Glutes/);
  assert.match(payload['Body map'], /ask: Chest/);
  assert.deepEqual(JSON.parse(payload['Complete record']), record());
  assert.equal(payload.email, values.email);
  assert.equal(payload._url, 'https://knr315.github.io/skills-github-pages/spin-diesel-recovery/');
  assert.equal(payload['Form URL'], payload._url);
});
test('only accepted provider responses report success; POST contains complete data', async () => {
  for (const success of [true, 'true']) {
    await core.send('https://example.invalid', record(), {}, async (endpoint, options) => {
      assert.equal(options.method, 'POST');
      assert.ok(JSON.parse(options.body)['Complete record']);
      assert.equal(JSON.parse(options.body)._url, core.SITE_URL);
      assert.equal(options.referrer, core.SITE_URL);
      assert.equal(options.referrerPolicy, 'no-referrer-when-downgrade');
      return { ok: true, json: async () => ({ success }) };
    });
  }
});
test('HTTP rejection, false success, unexpected JSON, and non-JSON fail', async () => {
  for (const response of [
    { ok: false, json: async () => ({ success: true }) },
    { ok: true, json: async () => ({ success: false }) },
    { ok: true, json: async () => ({}) },
    { ok: true, json: async () => { throw new SyntaxError('Invalid JSON'); } }
  ]) await assert.rejects(core.send('https://example.invalid', record(), {}, async () => response));
});
test('network failure and timeout fail without a false confirmation', async () => {
  await assert.rejects(core.send('https://example.invalid', record(), {}, async () => { throw new TypeError('Offline'); }));
  await assert.rejects(core.send('https://example.invalid', record(), {}, async (_, options) => new Promise((resolve, reject) => {
    options.signal.addEventListener('abort', () => reject(new Error('Aborted')));
  }), 10));
});
test('interactive map keeps keyboard activation, accessible names, and radio focus', () => {
  const app = fs.readFileSync(require.resolve('../app.js'), 'utf8');
  assert.match(app, /mapSvg.addEventListener\('keydown'/);
  assert.match(app, /setAttribute\('aria-label'/);
  assert.match(app, /refresh\(false\)/);
  assert.doesNotMatch(app, /Simulate network/);
});
test('expanded source intake survives export and delivery without dropping preferences', () => {
  const data=record();
  assert.deepEqual(data.availability.days,['Mon','Fri']);
  assert.equal(data.availability.cancellationList,true);
  assert.equal(data.availability.groupBooking,true);
  assert.equal(data.contact.preferredContact,'either');
  assert.equal(data.contact.emergencyContact,values.ecName);
  assert.deepEqual(data.health.flags,values.health);
  assert.equal(data.boundaries.supportPerson,values.chaperone);
  assert.equal(data.agreements.answersAccurate,true);
  assert.equal(data.agreements.reminderAndAftercareOptIn,true);
  const p=core.payload(data,{});
  assert.equal(p['Health flags'],'Recent surgery');
  assert.equal(p['Support person'],values.chaperone);
});
test('missing days and accuracy agreement cannot pass unless day availability is flexible', () => {
  assert.ok(core.validate({...values, days:[], flexible:'',ack2:''},'2026-10-05').some(e=>e.field==='days'));
  assert.ok(core.validate({...values, ack2:''},'2026-10-05').some(e=>e.field==='ack2'));
  assert.deepEqual(core.validate({...values, days:[], times:[]},'2026-10-05'),[]);
});


test('multiple atmosphere preferences and notes survive review, JSON, and delivery', async () => {
  const selected = ['Quiet, minimal talking', 'Check in with me often', 'Nature sounds', 'Explain each technique as you go'];
  const data = core.buildData({ ...values, style: selected, atmosphereNotes: 'Forest sounds at low volume' }, zones);
  assert.deepEqual(data.preferences.style, selected);
  selected.push('Not part of the prepared request');
  assert.equal(data.preferences.style.length, 4);
  const exported = JSON.parse(JSON.stringify(data));
  assert.deepEqual(exported.preferences.style, data.preferences.style);
  await core.send('https://example.invalid', data, {}, async (_, options) => {
    const delivered = JSON.parse(options.body);
    assert.equal(delivered.Atmosphere, data.preferences.style.join(', '));
    assert.equal(delivered['Atmosphere notes'], 'Forest sounds at low volume');
    assert.deepEqual(JSON.parse(delivered['Complete record']).preferences.style, data.preferences.style);
    return { ok: true, json: async () => ({ success: true }) };
  });
});
test('single-choice legacy records and no preference still produce readable summaries', () => {
  const data = record();
  assert.deepEqual(data.preferences.style, ['Quiet']);
  assert.equal(core.payload(data, {}).Atmosphere, 'Quiet');
  data.preferences.style = 'Soft music';
  assert.equal(core.payload(data, {}).Atmosphere, 'Soft music');
  const empty = core.buildData({ ...values, style: [] }, zones);
  assert.equal(core.payload(empty, {}).Atmosphere, 'No preference');
});

test('specific bodywork requests and scent preference survive delivery as literal text', () => {
  const note = 'Right shoulder focus. <script>literal text</script>';
  const data = core.buildData({ ...values, bodyRequests: note, scent: 'Interested in a scent; discuss before use' }, zones);
  const sent = core.payload(data, {});
  assert.equal(sent['Specific bodywork requests'], note);
  assert.equal(sent['Scent preference'], 'Interested in a scent; discuss before use');
  assert.equal(JSON.parse(sent['Complete record']).preferences.bodyRequests, note);
  assert.equal(core.buildData(values, zones).preferences.scent, 'No added fragrance');
});

test('fragrance matrix retains multiple interests, discussion, and exclusions in delivery', async () => {
  const data = core.buildData({ ...values, scent: 'Interested in a scent; discuss before use', scentMap: { lavender: 'interested', sandalwood: 'interested', chamomile: 'discuss', peppermint: 'avoid' } }, zones);
  assert.equal(core.SCENTS.length, 20);
  assert.equal(new Set(core.SCENTS.map(s => s.id)).size, 20);
  const exported = JSON.parse(JSON.stringify(data));
  assert.equal(exported.preferences.scentMap.lavender, 'interested');
  assert.equal(exported.preferences.scentMap.peppermint, 'avoid');
  await core.send('https://example.invalid', data, {}, async (_, options) => {
    const sent = JSON.parse(options.body);
    assert.match(sent['Fragrance preferences'], /Interested in: Lavender, Sandalwood/);
    assert.match(sent['Fragrance preferences'], /Discuss with me: Chamomile/);
    assert.match(sent['Fragrance preferences'], /Avoid: Peppermint/);
    assert.deepEqual(JSON.parse(sent['Complete record']).preferences.scentMap, data.preferences.scentMap);
    return { ok: true, json: async () => ({ success: true }) };
  });
});
test('fragrance-free clears positive choices, preserves exclusions, and rejects unknown values', () => {
  const map = { lavender: 'interested', jasmine: 'discuss', cinnamon: 'avoid', peppermint: 'unexpected', unknown: 'interested' };
  const data = core.buildData({ ...values, scentMap: map }, zones);
  assert.equal(data.preferences.scent, 'No added fragrance');
  assert.equal(data.preferences.scentMap.lavender, 'neutral');
  assert.equal(data.preferences.scentMap.jasmine, 'neutral');
  assert.equal(data.preferences.scentMap.cinnamon, 'avoid');
  assert.equal(data.preferences.scentMap.peppermint, 'neutral');
  assert.equal(data.preferences.scentMap.unknown, undefined);
  assert.equal(map.lavender, 'interested');
});

test('requested scent intensity is retained as a preference and disabled for fragrance-free', () => {
  for (const intensity of ['Light', 'Medium', 'Strong']) {
    const data = core.buildData({ ...values, scent: 'Interested in a scent; discuss before use', scentIntensity: intensity }, zones);
    assert.equal(core.payload(data, {})['Requested scent intensity'], intensity);
  }
  assert.equal(core.buildData({ ...values, scentIntensity: 'Strong' }, zones).preferences.scentIntensity, 'None');
  assert.equal(core.buildData({ ...values, scent: 'Interested in a scent; discuss before use', scentIntensity: 'invalid' }, zones).preferences.scentIntensity, 'Light');
});
