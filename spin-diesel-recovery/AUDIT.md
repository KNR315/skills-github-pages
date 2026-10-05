# Code audit — October 5, 2026

Scope: the supplied single HTML file, its browser behavior, the FormSubmit integration, and GitHub Pages publishing. Original clinical and creative copy retained; this is a software review, not a review of practitioner qualifications or treatment methods.

| Finding | Severity | Repair |
| --- | --- | --- |
| Submission used a timer and claimed receipt without sending | Critical | Real POST to existing endpoint; success requires both HTTP acceptance and provider `success`; failures keep the form visible |
| Body map omitted from saved record | Critical | All zone states included in a snapshot and the emailed payload |
| Pronouns, secondary date, flexibility, training context, acknowledgments omitted | High | Full schema and complete record retained in delivery and export |
| Email button had no handler | High | Working mail draft with encoded content; long records download separately for manual attachment |
| `novalidate` bypassed past-date checking | High | Both date fields checked against St. Louis date, including impossible dates; native validation used afterward |
| Missing data-delivery disclosure | High | FormSubmit/email processing explained and explicitly acknowledged before submission |
| Submission implied a booked slot and promised a response within 24 hours | High | Reports accepted delivery separately from personal appointment confirmation |
| SVG buttons lacked labels and keyboard handlers | Medium | Named map controls, Enter/Space activation, selection states, and panel associations |
| Rebuilding the zone panel after each radio change lost focus | Medium | Change updates map/chips without replacing the focused radio group |
| Pressure output never updated | Medium | Live label and accessible slider value text |
| Progress excluded required length and displayed an inconsistent total | Medium | Nine validated completion criteria, matching delivery acknowledgment |
| No network/timeout handling or repeat-submit guard | Medium | Timeout, rejection handling, busy states, and double-click guard |
| Answers could change while a request was in flight | Medium | Snapshot first, then lock form controls and map until delivery finishes |
| Object URLs were never revoked | Low | Download anchors removed and URLs released |
| Motion and small-screen controls needed attention | Medium | Reduced-motion support, 44px choice controls, chip wrapping, and mobile padding |
| All application code lived in one HTML file | Low | Browser behavior and pure intake logic separated for focused edits and tests |

## Verification

Node regression tests cover complete records, consent and availability validation, St. Louis date boundaries, real POST payload shape, successful acceptance, HTTP rejection, false/missing success, invalid JSON, network failure, and timeout. Static HTML checks cover duplicate IDs and required script/control references. Public-page inspection follows the Pages deployment.

The public page loaded with the original design. Live checks confirmed keyboard map selection, focus preference updates, pressure-label updates, and visible/focused errors on an empty submission. Mobile wrapping and reduced-motion styles were inspected in source; full device emulation was not available in this environment.

## Remaining limits

- No custom backend was supplied. The backend available here is the third-party FormSubmit service; its internals and recipient activation cannot be verified from this source.
- This is an appointment request, with no live calendar, slot locking, bookings database, payment system, or automatic appointment confirmation.
- A timeout can occur after the provider accepted a request. The page advises confirming with the practitioner before retrying; there is no server-side idempotency guarantee.
- Tests use mocked delivery responses. No real intake was emailed during automated verification.
- Original Tailwind runtime CDN and externally loaded fonts remain dependencies. The next practical code improvement is a compiled stylesheet for more predictable production loading.
- The clinical copy was preserved. Public release of a creative prototype does not establish suitability for storing clinical records.
