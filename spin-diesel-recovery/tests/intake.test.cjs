const { test } = require('node:test');
const assert = require('node:assert/strict');
const core = require('../intake-core.js');
const fs = require('node:fs');

const values = {
  name: '  Example Athlete  ', pronouns: 'they/them', email: 'athlete@example.com', phone: '555-0100',
  length: '60', date1: '2026-10-05', date2: '2026-10-07', times: ['Evening (4-8pm)'],
  flexible: 'yes', timing: 'Routine Maintenance', pressure: '4', style: 'Quiet',
  drape: 'Clothed', notes: '<script>literal text</script>', stopWord: 'Red',
  ack1: 'on', ack3: 'on', ackDelivery: 'on'
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
  assert.equal(data.preferences.pressureLabel, 'Deep');
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
});
test('only accepted provider responses report success; POST contains complete data', async () => {
  for (const success of [true, 'true']) {
    await core.send('https://example.invalid', record(), {}, async (endpoint, options) => {
      assert.equal(options.method, 'POST');
      assert.ok(JSON.parse(options.body)['Complete record']);
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
