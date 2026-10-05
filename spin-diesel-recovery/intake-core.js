'use strict';

// Pure intake logic shared by the browser and regression tests.
(function (root) {
  const TIME_ZONE = 'America/Chicago';
  const SITE_URL = 'https://knr315.github.io/skills-github-pages/spin-diesel-recovery/';
  const PRESSURE = ['Light', 'Light-medium', 'Firm', 'Firm-deep', 'Intense'];
  function todayISO(now = new Date()) {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit'
    }).formatToParts(now);
    const value = type => parts.find(p => p.type === type).value;
    return `${value('year')}-${value('month')}-${value('day')}`;
  }
  function validDate(value) {
    return /^\d{4}-\d{2}-\d{2}$/.test(value || '') &&
      !Number.isNaN(Date.parse(`${value}T12:00:00Z`)) &&
      new Date(`${value}T12:00:00Z`).toISOString().slice(0, 10) === value;
  }
  function validate(values, today = todayISO()) {
    const errors = [];
    const fail = (field, message) => errors.push({ field, message });
    if (!values.name?.trim()) fail('name', 'Please provide your name.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email?.trim() || '')) fail('email', 'A valid email is required for confirmation.');
    if (!['30', '60', '90'].includes(values.length)) fail('length', 'Please choose a session length.');
    if (!validDate(values.date1) || values.date1 < today) fail('date1', 'Please select an earliest date of today or later.');
    if (values.date2 && (!validDate(values.date2) || values.date2 < today)) fail('date2', 'Please select a secondary date of today or later.');
    if (!values.times?.length && !values.flexible) fail('times', 'Select at least one time window, or choose flexible.');
    if (!values.days?.length && !values.flexible) fail('days', 'Select at least one day, or choose flexible.');
    if (!['Clothed', 'Draped', 'Clothed (sports bra / shorts)', 'Undressed to comfort with full draping', 'Discuss at arrival'].includes(values.drape)) fail('drape', 'Clothing and draping boundaries are required.');
    for (const key of ['ack1','ack2','ack3']) if (!values[key]) fail(key, 'Please acknowledge each required agreement.');
    if (!values.ackDelivery) fail('ackDelivery', 'Please agree to email delivery of your responses before sending.');
    return errors;
  }
  function buildData(values, zones, now = new Date(), requestId = '') {
    const clean = value => String(value || '').trim();
    return {
      meta: { schemaVersion: 2, requestId, submittedAt: now.toISOString(), status: 'prepared' },
      contact: { name: clean(values.name), pronouns: clean(values.pronouns), email: clean(values.email), phone: clean(values.phone), preferredContact: values.contactPref || 'email', emergencyContact: clean(values.ecName) },
      availability: { length: values.length, date1: values.date1, date2: values.date2 || '', days: [...(values.days || [])], times: [...(values.times || [])], flexible: Boolean(values.flexible), cancellationList: Boolean(values.waitlist), groupBooking: Boolean(values.group), timeZone: TIME_ZONE, trainingContext: values.timing || '' },
      preferences: { pressure: Number(values.pressure), pressureLabel: PRESSURE[Number(values.pressure) - 1], style: values.style, bodyMap: { ...zones } },
      boundaries: { drape: values.drape, notes: clean(values.notes), stopWord: clean(values.stopWord), supportPerson: values.chaperone || '' },
      health: { flags: [...(values.health || [])], notes: clean(values.notes) },
      agreements: { restorativeBodywork: Boolean(values.ack1), answersAccurate: Boolean(values.ack2), boundariesConfirmed: Boolean(values.ack3), reminderAndAftercareOptIn: Boolean(values.ack4), emailDelivery: Boolean(values.ackDelivery) }
    };
  }
  function payload(data, names) {
    const groups = { focus: [], include: [], ask: [], skip: [] };
    for (const [id, state] of Object.entries(data.preferences.bodyMap)) groups[state]?.push(names[id] || id);
    return {
      name: data.contact.name, email: data.contact.email,
      _subject: 'Spin Diesel Recovery — appointment request', _template: 'table',
      _url: SITE_URL,
      'Form URL': SITE_URL,
      'Request ID': data.meta.requestId,
      'Pronouns': data.contact.pronouns, 'Phone': data.contact.phone,
      'Preferred contact': data.contact.preferredContact, 'Emergency contact': data.contact.emergencyContact,
      'Session length': `${data.availability.length} minutes`,
      'Earliest date': data.availability.date1, 'Secondary date': data.availability.date2,
      'Time windows': data.availability.times.join(', ') || 'No preference',
      'Days': data.availability.days.join(', ') || 'Flexible',
      'Cancellation list': data.availability.cancellationList ? 'Yes' : 'No',
      'Group booking': data.availability.groupBooking ? 'Yes' : 'No',
      'Flexible': data.availability.flexible ? 'Yes' : 'No',
      'Time zone': data.availability.timeZone, 'Training context': data.availability.trainingContext,
      'Pressure': `${data.preferences.pressure} · ${data.preferences.pressureLabel}`,
      'Atmosphere': data.preferences.style, 'Draping': data.boundaries.drape,
      'Stop signal': data.boundaries.stopWord, 'Notes': data.boundaries.notes,
      'Support person': data.boundaries.supportPerson, 'Health flags': data.health.flags.join(', ') || 'None shared',
      'Body map': Object.entries(groups).map(([state, zones]) => `${state}: ${zones.join(', ') || '—'}`).join('\n'),
      'Agreements': JSON.stringify(data.agreements),
      'Complete record': JSON.stringify(data)
    };
  }
  async function send(endpoint, data, names, fetchFn = root.fetch.bind(root), timeoutMs = 15000) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetchFn(endpoint, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        // Share only the canonical public form address, never a visitor's query or fragment.
        referrer: SITE_URL, referrerPolicy: 'no-referrer-when-downgrade',
        body: JSON.stringify(payload(data, names)), signal: controller.signal
      });
      const result = await response.json();
      if (!response.ok || ![true, 'true'].includes(result.success)) throw new Error('Delivery was not accepted.');
      return result;
    } finally { clearTimeout(timeout); }
  }
  const api = { TIME_ZONE, SITE_URL, PRESSURE, todayISO, validDate, validate, buildData, payload, send };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.RecoveryIntake = api;
})(globalThis);
