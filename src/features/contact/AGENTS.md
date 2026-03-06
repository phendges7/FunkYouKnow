# AGENTS.md - Contact Feature (F.U.K.)

This guide is specific to `src/features/contact/`.
Use it for all contact page and contact delivery changes.

---

## 0) Hard invariants

- React + JavaScript only.
- Keep contact UI styles local and scoped.
- Do not add libraries for forms/network unless explicitly requested.
- Keep external I/O in services.

If a requested change breaks these invariants, stop and ask first.

---

## 1) Current feature map

- `pages/Contact/Contact.jsx`
  - Contact page UI, form state, submit orchestration, toast feedback
- `pages/Contact/Contact.css`
  - Contact page styling
- `services/contactService.js`
  - Message sending via Supabase Edge Function

This is intentionally small; keep it simple.

---

## 2) Layering rules

### Contact page (`Contact.jsx`)

- Handles local form state, disabled/submitting states, and user feedback.
- May call shared hooks/contexts (page fade, toast).
- Should not contain raw Supabase client calls.

### Contact service (`contactService.js`)

- Owns payload sanitization and edge function invocation.
- Owns request auth header behavior for anonymous users.
- Should throw clean errors for UI consumption.

---

## 3) Service contract

- `sendContactMessage({ name, email, message })`:
  - trims/normalizes string fields
  - invokes edge function `contact-email-autoreply`
  - sends `Authorization: Bearer ${VITE_SUPABASE_ANON_KEY}`
  - throws on invocation failure or non-OK response payload

Keep this contract stable when updating UI flow.

---

## 4) UX behavior conventions

- Use toast notifications for success/failure (`useToast`).
- Keep submit button disabled while request is in flight.
- Keep current post-success behavior (delayed page reload) unless a change request explicitly replaces it.

---

## 5) Styling conventions

- Use existing contact block classes (`contact__*`) and existing shared button class pattern (`form__submit`).
- Reuse existing app design tokens (`var(--fyk-...)`, border radius, spacing vars).
- Keep form selectors scoped to contact markup to avoid global leakage.

---

## 6) Change protocol

Before editing:
1. Identify whether change is UI-only or service contract.
2. Keep touched files minimal (`Contact.jsx`, `Contact.css`, `contactService.js`).

During editing:
1. Keep network logic in service.
2. Keep page logic focused on state and feedback.

After editing:
1. Summarize what changed and why.
2. Note any edge function payload/header changes.

