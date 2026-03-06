# AGENTS.md - Admin Feature (F.U.K.)

This guide is specific to `src/features/admin/`.
Use it for any admin feature changes.

---

## 0) Hard invariants

- React + JavaScript only.
- Keep styles local to admin files and keep existing BEM-style class naming.
- Do not introduce new libraries unless explicitly requested.
- Keep network/persistence logic in services, not UI components.
- Keep admin-only actions behind authenticated admin flows.

If a change would break these invariants, stop and ask first.

---

## 1) Current feature map

- `components/AdminNavBar/`
  - Admin navigation + logout action (via auth context)
- `components/NewAdminForm/`
  - Form UI/state for creating admin users
- `pages/AdminDashboard/`
  - Admin overview, quick actions, derived stats
- `pages/CreateNewAdmin/`
  - Page wrapper that renders `NewAdminForm`
- `pages/RequestedSongs/`
  - Admin moderation view for requested songs
- `services/adminUsersService.js`
  - Edge function invocation for creating auth users

Keep new files inside this structure unless there is a clear architecture reason.

---

## 2) Layering rules

### Components and pages

- Should handle rendering, local UI state, and user interactions.
- May call feature services and shared contexts/hooks.
- Should not contain raw Supabase queries in JSX files.

### Services

- External calls belong here.
- `adminUsersService` is the boundary for "create admin user" persistence.
- Keep edge function naming and payload shape explicit and centralized here.

---

## 3) Domain conventions

- New admin creation currently goes through Supabase Edge Function `create-auth-user`.
- Dashboard aggregates data from other features:
  - Events data from `features/events/services/eventsService`
  - Requested songs data from `features/songs/services/songsService`
- Requested songs moderation uses songs feature APIs for:
  - fetching
  - clearing likes
  - soft deleting

Do not duplicate these data access paths in multiple admin files.

---

## 4) Auth and access rules

- Admin routing is guarded at app routing level (`RequireAuth`), and dashboard also defensively checks `user.isAdmin`.
- Preserve this behavior when refactoring.
- Logout flow is centralized via `useAuth().logout()` in admin nav.

---

## 5) Styling conventions in this feature

- Keep admin styles scoped (`admin-*`, `requested-songs*`, `new-admin-form*`).
- Reuse existing tokens (`var(--fyk-...)`, spacing/radius vars).
- Keep responsive behavior and reduced-motion handling where already present.

---

## 6) Known current state

- `pages/CreateNewAdmin/CreateNewAdmin.css` is currently empty.
- If you add styles there, do it only for an intentional page-level change.

---

## 7) Change protocol

Before editing:
1. Confirm whether change is admin-only UI, service logic, or cross-feature data aggregation.
2. Keep touched files minimal.

During editing:
1. Keep edge function and Supabase access inside services.
2. Keep page components focused on orchestration + rendering.

After editing:
1. Summarize what changed and why.
2. Call out any cross-feature dependency changes (events/songs/auth/toast).

