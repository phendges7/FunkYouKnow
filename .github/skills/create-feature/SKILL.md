# Skill: Create Feature (F.U.K. Feature-First)

## Purpose
Use this skill whenever you need to create a new feature in this repository using the existing structure:
- feature-first folders under `src/features`
- UI in components/pages
- logic in hooks
- persistence/integration in services

This skill is optimized for **React + Vite + JavaScript** and this codebase's conventions.

---

## Use This Skill When

- A new domain feature is requested (for example: `gallery`, `merch`, `partners`).
- A feature needs one or more pages plus internal components.
- A feature needs API/Supabase integration through a service layer.
- Existing page files are overloaded and need logic extracted into hooks.

---

## Non-Negotiable Rules

1. JavaScript only (no TypeScript).
2. BEM naming for CSS classes.
3. No raw Supabase calls inside components/pages.
4. Put cross-cutting logic in hooks/services, not duplicated across components.
5. Keep changes small, feature-scoped, and reversible.

---

## Target Structure

Create only what the feature actually needs.

```text
src/features/<feature>/
  AGENTS.md
  pages/
    <FeaturePage>/
      <FeaturePage>.jsx
      <FeaturePage>.css
  components/
    <FeatureCard>/
      <FeatureCard>.jsx
      <FeatureCard>.css
  hooks/
    use<FeatureFlow>.js
  services/
    <feature>Service.js
```

Optional (only if needed):
- `lib/` for feature-local utilities (example: `songs/lib/likeSession.js`)
- additional `pages/<SubPage>/...`
- additional `components/<Widget>/...`

---

## Workflow

### 1) Scope the feature

- Name the feature and folder: `src/features/<feature>`.
- Decide if it is:
  - public page
  - admin page
  - both
- Confirm data source:
  - existing React Query hook
  - feature service
  - new service method

### 2) Create minimal skeleton

- Add page first, then component(s), then hook(s), then service(s).
- Keep imports relative and consistent with existing patterns.
- Add local CSS beside each page/component.

### 3) Implement layering correctly

- Page:
  - orchestrates hooks + renders sections
- Component:
  - presentational + local UI state only
- Hook:
  - async orchestration, state transitions, mapping
- Service:
  - Supabase/external I/O only

### 4) Integrate into app

- Add route in `src/app/App.jsx` if this feature adds a new page route.
- If admin-only, place route inside `<Route element={<RequireAuth adminOnly />}>`.
- Reuse shared providers/context (`Auth`, `Toast`, `BackgroundVideo`) as needed.

### 5) Add feature-local AGENTS guide

- Create `src/features/<feature>/AGENTS.md`.
- Document:
  - feature map
  - layer boundaries
  - domain invariants
  - change protocol

### 6) Verify

- Ensure no dead files/imports.
- Ensure all new hooks/services are actually used.
- Ensure CSS class names match JSX.
- Ensure errors are surfaced with UI feedback/toasts when appropriate.

---

## Templates

### Page template

```jsx
import usePageFade from "../../../../hooks/usePageFade";
import useFeatureFlow from "../../hooks/useFeatureFlow";
import FeatureCard from "../../components/FeatureCard/FeatureCard";
import "./FeaturePage.css";

const FeaturePage = () => {
  usePageFade();

  const {
    items,
    isLoading,
    error,
    refetch,
  } = useFeatureFlow();

  if (isLoading) {
    return <main className="feature-page">Loading...</main>;
  }

  if (error) {
    return (
      <main className="feature-page">
        <p className="feature-page__error">{error}</p>
        <button type="button" onClick={refetch}>Retry</button>
      </main>
    );
  }

  return (
    <main className="feature-page">
      <h1 className="feature-page__title">Feature</h1>
      <section className="feature-page__grid">
        {items.map((item) => (
          <FeatureCard key={item.id} item={item} />
        ))}
      </section>
    </main>
  );
};

export default FeaturePage;
```

### Component template

```jsx
import "./FeatureCard.css";

const FeatureCard = ({ item }) => {
  return (
    <article className="feature-card">
      <h2 className="feature-card__title">{item.title}</h2>
      <p className="feature-card__description">{item.description}</p>
    </article>
  );
};

export default FeatureCard;
```

### Hook template

```js
import { useCallback, useEffect, useState } from "react";
import { featureService } from "../services/featureService";

const useFeatureFlow = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await featureService.getItems();
      setItems(data || []);
    } catch (err) {
      setError(err?.message || "Could not load feature data.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { items, isLoading, error, refetch: load };
};

export default useFeatureFlow;
```

### Service template

```js
import { supabase } from "../../../lib/supabase/supabaseClient";

export const featureService = {
  async getItems() {
    const { data, error } = await supabase
      .from("feature_table")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },
};
```

---

## Route Integration Example

Add to `src/app/App.jsx`:

```jsx
import FeaturePage from "../features/<feature>/pages/FeaturePage/FeaturePage";

// Public route
<Route path="/<feature>" element={<FeaturePage />} />

// Admin route
<Route element={<RequireAuth adminOnly />}>
  <Route path="/admin/<feature>" element={<FeaturePage />} />
</Route>
```

---

## Feature Acceptance Checklist

- [ ] Correct folder: `src/features/<feature>`
- [ ] Page/component/hook/service boundaries respected
- [ ] No Supabase in component/page files
- [ ] CSS follows BEM and is feature-local
- [ ] Route added (if required)
- [ ] New files imported and used (no orphans)
- [ ] `src/features/<feature>/AGENTS.md` created/updated
- [ ] Output includes plan, affected tree, and full file contents

---

## Notes for This Repository

- Shared query hooks live in `src/hooks/queries`.
- Admin access is enforced via `src/app/routes/RequireAuth.jsx`.
- Reuse existing feature guides:
  - `src/features/admin/AGENTS.md`
  - `src/features/contact/AGENTS.md`
  - `src/features/events/AGENTS.md`
  - `src/features/home/AGENTS.md`
  - `src/features/songs/AGENTS.md`

