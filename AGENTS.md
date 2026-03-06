# AGENTS.md — FUNK YOU KNOW (F.U.K.) Codebase Rules

You are an agent working inside the FUNK YOU KNOW (F.U.K.) web app.
This repository is a React + Vite JavaScript project organized with feature-first structure.

Your job: implement changes that match the existing architecture, keep logic modular, and avoid introducing new patterns casually.

---

## 0) Non-negotiable invariants (break these = stop and ask)

- React + Vite + JavaScript only (NO TypeScript).
- CSS uses BEM naming (Block\_\_element--modifier) consistently across the app.
- Do not introduce new libraries unless explicitly requested or absolutely necessary.
- Do not duplicate business logic in components. Prefer hooks/services.
- Avoid “clever” refactors that rewrite large sections without clear need.

---

## 1) Repository map (how this project is shaped)

Use these conventions based on the existing tree:

- `main.jsx` boots the app.
- `app/` contains:
  - `App.jsx` (routing layout)
  - `providers/` (AuthProvider, BackgroundVideoProvider, ToastProvider)
  - `routes/RequireAuth.jsx` (route guard)
- `components/` are shared UI blocks:
  - `layout/` (Header, Footer, PublicNavBar)
  - `sections/` (About, LoginForm)
  - `media/` (GlobalBackgroundVideo, ModalGallery)
  - `feedback/Toast` (GlobalToast)
- `context/` contains context definitions (AuthContext, BackgroundVideoContext, ToastContext)
- `features/` is the domain layer (admin, events, songs, contact, home)
  - Each feature uses pages/components/hooks/services as needed.
- `hooks/` is cross-feature hooks (global hooks, react-query queries)
- `lib/` contains infrastructure clients and helpers:
  - `lib/supabase/supabaseClient.js`
  - `lib/react-query/queryClient.js`
  - `lib/url/formatLink.js`
- `styles/` is global CSS
- `assets/` holds icons/logos/images
- `vendor/` holds fonts/normalize

When adding new code, place it where the tree suggests it belongs.

---

## 2) Layering rules (where logic is allowed to live)

### Components

- Components under `components/**` and `features/**/components/**` should be UI-first.
- They may receive data and callbacks as props.
- They may use local UI state (open/close modals, input state).
- They should NOT contain:
  - raw Supabase calls
  - heavy data mapping/normalization logic
  - long multi-step workflows (move to hooks/services)

### Hooks

- Feature-specific logic stays in `features/<feature>/hooks/`.
- Shared logic stays in `hooks/`.
- Hooks may:
  - fetch data (prefer react-query hooks in `hooks/queries/`)
  - orchestrate services
  - map DB → UI models (but keep mapping in one place)
- If a page is “doing too much”, refactor into hooks, not more components.

### Services

- External I/O and domain actions go in `features/<feature>/services/`.
- Services encapsulate Supabase calls and return clean data/results.
- Do not scatter Supabase calls through random files.

### Context + Providers

- Prefer existing providers in `app/providers/` for global behaviors:
  - auth session
  - background video
  - toast notifications
- Avoid creating new global state unless it benefits multiple features.

---

## 3) The big architectural invariants (F.U.K. rules)

### Events & media (critical)

- Events metadata lives in the `events` table.
- ALL event media lives in `event_media` with a role system.
- Any work involving gallery/cover/background video must respect:
  - performance-first loading (thumbnails, lazy loading where applicable)
  - role uniqueness/invariants (do not allow duplicates that break UI expectations)
- Mapping between DB models and UI models must happen in approved hooks/services,
  not scattered across components.

### Admin boundaries

- Admin pages/components live under `features/admin/` or `features/events/pages/admin/`.
- Anything requiring admin privileges must be gated behind `RequireAuth` route logic.
- Avoid “soft” admin checks in UI only; security belongs in backend policies.

### Songs feature

- `features/songs/` contains UI components + services.
- Like/session logic belongs in `features/songs/lib/likeSession.js`.
- Keep services responsible for persistence; components render.

---

## 4) React Query conventions

- Shared query hooks live in `hooks/queries/` (e.g., `usePublishedEvents.js`, `useEventBySlug.js`).
- Mutation hooks can live in `hooks/mutations/` or feature hooks if tightly scoped.
- Prefer:
  - stable query keys
  - cache invalidation after mutations
  - minimal duplicate fetching inside components

---

## 5) CSS conventions (BEM, always)

- Use `.Block` for root.
- Use `.Block__element`.
- Use `.Block--modifier` and `.Block__element--modifier`.
- Prefer feature-local CSS files alongside the component/page:
  - `Component.jsx` + `Component.css`
- Use `styles/_variables.css` for shared tokens (when applicable).
- Avoid global CSS leaks; keep selectors scoped to the component.

---

## 6) File creation rules

When creating new components/pages/hooks/services:

- Follow the existing naming patterns in the tree.
- Provide full file contents, ready to copy/paste.
- Update imports and exports cleanly (don’t leave dead code).
- If you add a new hook/service, ensure it is used and not orphaned.

---

## 7) Working protocol (how to behave before/after edits)

Before making changes:

1. Identify the target feature and the correct folder.
2. List the files you will touch (keep it minimal).
3. Describe the intended behavior change in 2–5 bullets.

While implementing:

- Keep diffs small and reversible.
- Prefer extraction into hooks/services over bloating pages.

After changes:

- Summarize what changed and why.
- Mention any follow-up refactors that would improve the codebase,
  but do not perform them unless requested.

---

## 8) Output format (non-negotiable)

When asked to implement something:

- Return:
  1. A brief plan
  2. The file tree (only affected paths)
- Keep code blocks separated and labeled by path.
