# Spin Diesel Recovery - verification and scope

Updated 2026-10-08. The owner selected an educational design demo while legal scope and a deliberate private record system are developed.

## Public behavior

The current page offers self-directed movement and rest planning. It offers no appointments, practitioner-provided touch, treatment, or product application. The page title, metadata, hero, sequence, map descriptions, preference labels, review, footer, and repository README reflect that behavior. A label alone cannot authorize a regulated service; a disclaimer is not a substitute for legal scope. Earlier service copy remains in Git history.

## Privacy changes

- Removed collection of names, contact details, availability, emergency contacts, health flags, and personal-history notes.
- Removed all network submission and email-preparation functions from the loaded code.
- Preserved local-only body map, multi-select atmosphere, fragrance interests/exclusions, intensity preference, review/edit, and JSON download.
- Removed remote scripts and fonts. Added Content Security Policy restrictions with `connect-src 'none'` and `form-action 'none'`.
- Added Clear my plan, which resets fields, map, scents, memory, and rendered review; restored back/forward pages clear their plan.
- Hosting still processes connection data. Downloaded or photographed copies remain outside the page. Optional notes could still contain sensitive information if a visitor ignores the prompt; they are not anonymized.
- No existing emails or exported records were accessed, imported, edited, or deleted in this update. Provider activation is unchanged. An already open earlier version can still use its historical endpoint; deactivation requires a separate provider operation and may affect other forms using that inbox.

## Verification

Run `node --test spin-diesel-recovery/tests/intake.test.cjs` from the repository root. Checks cover six timed outlines, validation, fragrance-free exclusions, multiple scent choices, schema minimization, bounded notes, snapshot isolation, readable review, absence of transmission/storage code, local assets, CSP, safe rendering, and clear/reset behavior.

The private reports describe evidence limits, official Missouri sources, proposed record retention, and a future private data architecture. No central record backend has been created.
