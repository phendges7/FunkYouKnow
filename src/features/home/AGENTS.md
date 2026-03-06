# AGENTS.md - Home Feature (F.U.K.)

This guide is specific to `src/features/home/`.
Use it when changing the home/landing experience.

---

## 0) Hard invariants

- React + JavaScript only.
- Keep the home feature lightweight and presentation-first.
- No new libraries unless explicitly requested.
- Keep cross-feature logic minimal in this feature.

If a request would break these invariants, stop and ask first.

---

## 1) Current feature map

- `pages/MainHome/Main.jsx`
  - Main home content
  - CTA navigation to `/events` and `/request-song`
  - Embeds `SongList` from songs feature
- `pages/MainHome/Main.css`
  - Home layout and responsive behavior

There is no local service or hook folder here at the moment.

---

## 2) Layering rules

### Home page (`Main.jsx`)

- Keep this file focused on:
  - home hero content
  - navigation actions
  - composition of existing shared/feature components
- Avoid putting business/data logic in this file.

### Cross-feature composition

- `SongList` is owned by `features/songs`.
- Any ranking/search/likes behavior belongs in songs feature, not in home.

---

## 3) Navigation conventions

- CTA buttons should continue to route through `useNavigate`.
- Keep routes explicit and aligned with app routing:
  - `/events`
  - `/request-song`

---

## 4) Styling conventions

- Keep classes in the `main__*` namespace.
- Preserve current responsive breakpoints and stacked-mobile layout behavior.
- Reuse global theme tokens and shared button classes already used in app.

---

## 5) Change protocol

Before editing:
1. Confirm whether change is pure home UI vs songs feature behavior.
2. Keep touched files minimal.

During editing:
1. Keep home focused on layout/content/navigation.
2. Push data/interaction-heavy changes to the owning feature.

After editing:
1. Summarize what changed.
2. Note any cross-feature dependency changes (especially `SongList` usage).

