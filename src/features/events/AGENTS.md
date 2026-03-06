# AGENTS.md — Events Feature (F.U.K.)

This guide is specific to `src/features/events/`.
Use it when creating or changing anything inside the Events feature.

---

## 0) Hard invariants for this feature

- Keep this feature in React + JavaScript (no TypeScript).
- Keep component styles in local CSS files and use existing BEM-style class naming.
- Do not add new libraries for uploads, forms, or state unless explicitly requested.
- Keep persistence logic out of UI components.
- Preserve the event/media model:
  - `events` table stores event metadata.
  - `event_media` table stores media with roles (`cover`, `background`, `gallery`).

If a requested change would break these invariants, stop and ask first.

---

## 1) Feature structure (current)

- `components/`
  - Uploaders, form UI, card UI, modal confirmation
- `hooks/`
  - Event form state, gallery upload/delete, submit orchestration, utility helpers
- `pages/admin/`
  - Admin list/create/edit pages
- `pages/EventDetails/`
  - Public event detail page with local components + hooks
- `pages/PublicEventList/`
  - Public events list page
- `services/`
  - `eventsService.js` for `events` table actions
  - `eventMediaService.js` for `event_media` + storage actions

Keep new files in the matching layer. Do not create alternative folder patterns inside this feature.

---

## 2) Layering rules (strict)

### Components (`components/**`, `pages/**/components/**`)

- UI only: render props, trigger callbacks, local visual state.
- Allowed: input handling, simple presentational formatting.
- Not allowed:
  - Supabase queries/mutations directly in component files
  - Multi-step persistence workflows
  - Media role reconciliation logic

### Hooks (`hooks/**`, `pages/**/hooks/**`)

- Orchestrate feature behavior and page-specific logic.
- Keep hooks focused (one concern per hook).
- Upload selection hooks (`useCoverUpload`, `useBackgroundVideoUpload`, `useGalleryUpload`) must remain client-side preview/validation only.
- Persistence orchestration belongs in `useEventSubmit`.

### Services (`services/**`)

- All Supabase access for this feature should live here.
- `eventsService` handles `events` CRUD/soft-delete concerns.
- `eventMediaService` handles:
  - storage upload/remove
  - `event_media` inserts/updates/deletes
  - role-specific behavior (singleton roles vs gallery)

---

## 3) Events + media domain rules

### Media roles and uniqueness

- `cover` and `background` are singleton roles per event.
- Keep manual singleton upsert strategy in `eventMediaService` (`upsertSingletonMediaRow`), because partial unique indexes are in play.
- `gallery` allows multiple rows and uses ordered `position`.

### Storage paths and behavior

- Bucket is `events`.
- Current path conventions:
  - `covers/...`
  - `backgrounds/...`
  - `gallery/<eventId>/...`
  - `gallery_thumbs/<eventId>/...`
- Keep cleanup behavior best-effort for replaced singleton files.

### Thumbnail strategy

- Gallery upload currently creates optional WebP thumbnails client-side (`createThumbBlob`) and stores `thumb_url`.
- UI should prefer `thumb_url` for grids and `public_url` for full-size modal views.

---

## 4) Form and submit contract

- `useEventForm` state mirrors UI form fields, including preview-only media URLs.
- `useEventSubmit` is the canonical mapper from form state to DB payload.
  - Always map `ticketLink -> ticket_url`.
  - Never send preview-only fields (`thumbnail_url`, `background_video_url`) as raw form payload.
- Submit flow order must stay:
  1. Save base event
  2. Upsert cover and persist returned URL to `events.thumbnail_url`
  3. Upsert background and persist returned URL to `events.background_video_url`
  4. Append new gallery items with ordered `position`

---

## 5) Query/data loading conventions in this feature

- Public list uses shared query hook `usePublishedEvents`.
- Event details uses shared query hook `useEventBySlug`.
- Event details gallery loading is lazy via IntersectionObserver (`useEventGalleryLazy`).
- Prefer existing query hooks before adding direct fetch logic in page components.

---

## 6) Admin boundaries

- Admin pages live under `pages/admin/`.
- Keep actions destructive/persistent only in services/hooks.
- Route protection remains outside this feature (`RequireAuth` in app routing), so do not duplicate ad-hoc auth gates in random components.

---

## 7) CSS and UI conventions in this folder

- Keep styles adjacent to components/pages.
- Use existing block patterns (e.g., `event-form__...`, `admin-events__...`, `event-gallery__...`).
- Reuse existing design tokens (`var(--fyk-...)`, shared radii/spacing vars) instead of hardcoding new token systems.
- Maintain current accessibility basics:
  - meaningful `alt`
  - button `type`
  - disabled states for async actions
  - `loading`/`decoding` attributes for media where already used

---

## 8) Known current state (do not “fix by surprise”)

- These files are currently empty placeholders:
  - `components/EventTable/EventTable.jsx`
  - `components/EventTable/EventTable.css`
  - `pages/EventDetails/components/EventGallerySection/EventGallerySection.css`
  - `pages/EventDetails/components/EventHero/EventHero.css`
  - `pages/EventDetails/components/EventInfo/EventInfo.css`
  - `pages/EventDetails/hooks/useIsPastEvent.js`
- If you populate these, do it only as part of a requested change.

---

## 9) Change protocol for this feature

Before editing:
1. Identify whether change belongs to `components`, `hooks`, `services`, or `pages`.
2. Keep touched files minimal and consistent with existing flow.
3. Confirm whether media role behavior (`cover/background/gallery`) is impacted.

During editing:
1. Keep Supabase logic in services.
2. Keep UI components thin; move workflows to hooks.
3. Preserve gallery ordering and lazy-loading behavior.

After editing:
1. Summarize exactly what changed and why.
2. Call out any invariants affected (query keys, media roles, storage paths).
3. Mention follow-up refactors only if requested.

