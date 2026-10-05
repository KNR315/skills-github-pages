# Spin Diesel Recovery

An appointment-request and consent intake for pole and aerial athletes, preserving Khylan's lotus artwork, somatic map, consent defaults, and sanctuary language. The latest synthesis uses the supplied fire-and-water artwork with navy, gold, red, and blue accents.

## Files

- `index.html`: Page composition, richer intake, and review panel.
- `base.css` and `design.css`: Responsive foundation and artwork-inspired visual system.
- `assets/lotus-fire-water.webp`: Supplied artwork optimized for web delivery, retaining its full composition.
- `app.js`: Interactive map, progress, validation presentation, submission, and downloads.
- `intake-core.js`: Testable data, validation, and delivery functions.
- `tests/intake.test.cjs`: Regression coverage using Node's built-in test runner.
- `AUDIT.md`: Findings, fixes, and remaining limits.

## Run locally

From this folder, run `python3 -m http.server 8000` and open `http://localhost:8000/`. Run regression checks with `node --test tests/intake.test.cjs`.

## Publishing and editing

This folder lives in `KNR315/skills-github-pages` on `main`. The existing GitHub Pages branch build publishes it at `/skills-github-pages/spin-diesel-recovery/`. Changes committed to `main` deploy automatically through the existing Pages build. Repository history retains each revision.

Natural-language edits can target this folder's files. Preserve the artwork, copy, consent defaults, and aesthetic unless a change is specifically requested. Request data must never be committed to the repository.

## Delivery

GitHub Pages serves static files. The page POSTs to the pre-existing FormSubmit address in `app.js`; no custom server or appointment database exists. FormSubmit forwards accepted requests by email. The recipient may need to activate FormSubmit in their inbox before delivery works. A positive API response does not prove inbox receipt or confirm an appointment. The frontend reports this distinction explicitly.

The form includes an email-delivery disclosure and consent checkbox. Previewing shows a readable review without sending anything; a separate send action submits the reviewed snapshot. Live session summaries, day/time shortcuts, optional health fields, support-person preferences, JSON exports, manual email drafts, and retries are included. All richer fields are retained in the delivery payload and export.

Answers remain only in the current page until explicitly sent or exported. A refresh loses unsaved answers. No localStorage or public intake storage is added. FormSubmit and the recipient mailbox process submitted data.

Live delivery was not exercised with a real client request. Tests mock the provider to avoid sending test messages. Before inviting clients, verify recipient activation and send an explicitly intended request end to end.

Styling depends on the original Tailwind CDN and fonts on Google Fonts. A later optional improvement is to compile Tailwind locally and self-host fonts; neither changes the creative design.
