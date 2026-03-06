# AGENTS.md - Songs Feature (F.U.K.)

This guide is specific to `src/features/songs/`.
Use it for song request, ranking, likes, and moderation-related work.

---

## 0) Hard invariants

- React + JavaScript only.
- Keep persistence logic in `services/`.
- Keep like/session logic in `lib/likeSession.js`.
- Do not duplicate Supabase logic in components.
- Do not add libraries unless explicitly requested.

If a requested change breaks these invariants, stop and ask first.

---

## 1) Current feature map

- `components/`
  - `SongCard/` (public list item + like action UI)
  - `SongList/` (public list, search, ranking, like flow)
  - `SongDetails/` (admin-facing detailed card)
  - `SongLinkModal/` (confirm external link opening)
- `hooks/`
  - `useSubmitSongRequest.js` (request form submit orchestration)
- `lib/`
  - `likeSession.js` (localStorage gating for likes)
- `pages/`
  - `RequestSong/` (song request page + form)
- `services/`
  - `songsService.js` (requested_songs read/write/update/delete actions)

---

## 2) Layering rules

### Components and pages

- Components render and handle local UI interactions.
- Pages orchestrate component composition and local view behavior.
- Components/pages should call services or hooks, not raw Supabase.

### Hooks

- Keep submission/workflow logic in hooks when reused or multi-step.
- `useSubmitSongRequest` is the request flow boundary for Request Song page.

### Services

- `songsService.js` is the single persistence layer for requested songs.
- Keep query filtering, sorting, and write actions centralized there.

### Local lib

- `likeSession.js` is the single source for client-side like window checks.
- Keep localStorage key/window policy centralized there.

---

## 3) Domain conventions

- Requested songs table fields currently used:
  - `id`, `title`, `artist`, `link`, `like_count`, `created_at`, `isDeleted`
- Public list behavior:
  - sorted by `like_count` descending
  - supports title/artist search
  - supports optimistic-like UI update after successful service call
- Admin moderation behavior:
  - clear all likes
  - soft delete song (`isDeleted: true`)

---

## 4) Like-session rules (critical)

- Respect `tryRegisterSongLike` / `canLikeSong` from `lib/likeSession.js`.
- Avoid bypassing this guard in UI logic.
- Keep like-window policy changes inside `likeSession.js`, not scattered.

---

## 5) External link safety conventions

- Song links are opened via modal confirmation in `SongLinkModal`.
- Keep `window.open(..., "_blank", "noopener,noreferrer")` behavior for external links.
- Preserve close affordances:
  - close button
  - escape key
  - backdrop click

---

## 6) Styling conventions

- Keep CSS next to component/page files.
- Use existing blocks:
  - `song-list__*`, `song-card__*`, `song-details__*`, `song-link-modal__*`, `request-song__*`
- Reuse existing visual tokens and form utility classes (`form__*`) already in use.
- Keep responsive behavior for list/cards/request form.

---

## 7) Change protocol

Before editing:
1. Identify whether change belongs to UI component, hook, service, or `likeSession`.
2. Keep file touch-set minimal.

During editing:
1. Keep Supabase access in services only.
2. Keep like-session logic in `lib/likeSession.js`.
3. Preserve sort/search and moderation behavior unless explicitly changed.

After editing:
1. Summarize changes and rationale.
2. Note any service contract or like-window behavior changes.

