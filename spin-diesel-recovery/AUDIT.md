# Code audit — October 5, 2026

Scope: both supplied HTML revisions, their browser behavior, the FormSubmit integration, and GitHub Pages publishing. The richer revision and supplied lotus artwork are synthesized into the existing site, preserving creative copy and consent defaults.

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
| Progress excluded required length and displayed an inconsistent total | Medium | Eleven completion criteria matching the richer form's required agreements and availability |
| No network/timeout handling or repeat-submit guard | Medium | Timeout, rejection handling, busy states, and double-click guard |
| Answers could change while a request was in flight | Medium | Snapshot first, then lock form controls and map until delivery finishes |
| Object URLs were never revoked | Low | Download anchors removed and URLs released |
| Motion and small-screen controls needed attention | Medium | Reduced-motion support, 44px choice controls, chip wrapping, and mobile padding |
| Custom fade-in classes referenced keyframes that Tailwind did not generate | High | Current hero renders visibly without depending on generated animation utilities |
| All application code lived in one HTML file | Low | Browser behavior and pure intake logic separated for focused edits and tests |
| Richer revision introduced additional fields absent from the earlier record | High | Days, health flags, support person, contact preference, cancellation list, group booking, and all agreements survive review, export, and delivery |
| Form submission immediately initiated delivery | Medium | Explicit preview step followed by a separate send action; editing preserves answers |
| Artwork embedded a large data URI in the page | Low | Optimized WebP asset loads separately and retains the full artwork |
| Browser reused earlier scripts after the new HTML deployed | High | Versioned local stylesheet and script URLs keep the synthesis assets together for returning visitors |
| FormSubmit emails linked to the bare domain, which returned 404 | High | Explicit `_url` and readable `Form URL` use the complete working form address |
| Repository landing page still showed the GitHub exercise | Medium | Branded root redirect, direct booking link in the repository README, and a useful project 404 page |

## Verification

Twelve Node regression tests cover complete records including the richer fields, consent and availability validation, St. Louis date boundaries, real POST payload shape, successful acceptance, HTTP rejection, false/missing success, invalid JSON, network failure, and timeout. Static HTML checks cover duplicate IDs and relative asset references. Public-page inspection follows the Pages deployment.

The earlier public revision was verified for keyboard map selection, focus preference updates, pressure labels, and focused errors. The current synthesis adds live session summaries, explicit review, day/time shortcuts, and optional pointer parallax that respects reduced motion. Mobile wrapping and reduced-motion styles were inspected in source; full device emulation was not available in this environment.

## Remaining limits

- No custom backend was supplied. The backend available here is the third-party FormSubmit service; its internals cannot be verified from this source. Recipient activation and live inbox delivery were verified on October 5, 2026.
- This is an appointment request, with no live calendar, slot locking, bookings database, payment system, or automatic appointment confirmation.
- A timeout can occur after the provider accepted a request. The page advises confirming with the practitioner before retrying; there is no server-side idempotency guarantee.
- Regression tests use mocked delivery responses. An explicitly authorized synthetic request was submitted through the live public page after FormSubmit activation. Its matching email arrived in the configured Gmail inbox at 1:01 PM Central, with the complete record, body map, and agreements intact. No real client health data was sent.
- Original Tailwind runtime CDN and externally loaded fonts remain dependencies. The next practical code improvement is a compiled stylesheet for more predictable production loading.
- The clinical copy was preserved. Public release of a creative prototype does not establish suitability for storing clinical records.


## October 6 customization and public-data audit

- Atmosphere now supports multiple communication and sound choices, with no music exclusive of sound selections. Lighting was excluded as requested.
- Optional scent discussion defaults to no added fragrance and does not authorize skin application.
- Specific bodywork requests sit directly below the map; these and atmosphere notes survive the review, JSON, and delivery payload.
- All 15 regression tests passed, including multi-selection retention and literal handling of request notes.
- Inspected all 26 current text files and the repository file listing. No real client submission records were found. Test fixtures are synthetic. The form sends requests to FormSubmit by POST for email delivery; it has no public requests feed, database, browser storage, or submission logging.
- Added ignore rules for downloaded intake records and private client-record directories. These reduce accidental commits; they are not an access-control mechanism.
- Public source files still expose the practitioner delivery address. FormSubmit and the mailbox process submissions; their access controls are outside this static site's code.
