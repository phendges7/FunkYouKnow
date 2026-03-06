---
description: Scaffold a new feature under src/features following the
  FUNK YOU KNOW architecture (React + Vite + JavaScript, BEM CSS,
  feature-first structure, logic in hooks/services).
name: create-feature
---

# Purpose

Create a new feature that respects the architectural rules of the FUNK
YOU KNOW codebase.

This skill ensures that features follow the project's layering
principles:

UI → components/pages\
Logic → hooks\
External I/O → services

The skill should produce minimal, clean scaffolding, not a full
implementation.

---

# When to Use

Use this skill when the user asks to:

- create a new feature
- scaffold a feature folder
- start a new domain module
- add a new page under src/features

Do NOT use this skill for:

- adding a single component
- modifying an existing feature
- small UI changes

---

# Inputs (ask if missing)

- feature name (kebab-case recommended)
- main page name (PascalCase)
- whether routing should be added
- whether persistence/integration is required

---

# Architectural Rules

## Language & Framework

- React
- Vite
- JavaScript only (NO TypeScript)

## Styling

- CSS must follow BEM methodology
- Each page/component has its own CSS file
- CSS lives beside the component/page

Example:

Component.jsx\
Component.css

## Feature-first structure

All new features live inside:

src/features/`<feature-name>`{=html}/

Typical structure:

src/features/`<feature-name>`{=html}/ pages/ components/ hooks/
services/

Create folders only if needed. Do not generate empty folders
unnecessarily.

---

# Layering Rules

## Pages

Pages are responsible for:

- layout
- composing components
- connecting hooks to UI

Pages should NOT contain:

- raw Supabase calls
- complex business logic
- large workflows

Keep pages thin.

---

## Components

Components should be UI-focused.

Allowed:

- rendering
- props
- local UI state

Not allowed:

- Supabase calls
- heavy logic
- cross-feature orchestration

---

## Hooks

Hooks contain feature logic.

Examples:

- orchestrating services
- managing async state
- combining data sources
- UI logic reused by multiple components

Hooks may call services.

---

## Services

Services handle external I/O and persistence.

Examples:

- Supabase queries
- API calls
- storage operations

Services must:

- encapsulate external integrations
- return clean data structures
- avoid UI concerns

Components and pages must never call Supabase directly.

---

# React Query Guidance

Shared server-state queries belong in:

src/hooks/queries/

Feature-specific orchestration may remain inside:

src/features/`<feature>`{=html}/hooks

Prefer React Query for server-state whenever appropriate.

---

# AGENTS.md Integration

If the feature introduces domain rules, invariants, or complex
workflows, create:

src/features/`<feature>`{=html}/AGENTS.md

This file should document:

- feature-specific rules
- invariants
- boundaries
- data constraints

Do not create a feature-level AGENTS.md for trivial features.

---

# Implementation Steps

1.  Determine feature scope and name.

2.  Create the feature directory:

src/features/`<feature-name>`{=html}/

3.  Create necessary subfolders based on the feature needs:

pages/ components/ hooks/ services/

4.  Create a minimal starter page:

src/features/`<feature>`{=html}/pages/`<PageName>`{=html}/`<PageName>`{=html}.jsx
src/features/`<feature>`{=html}/pages/`<PageName>`{=html}/`<PageName>`{=html}.css

The page should:

- render a root BEM block
- import its CSS
- avoid complex logic

5.  If the feature requires logic, create a hook:

src/features/`<feature>`{=html}/hooks/use`<FeatureName>`{=html}.js

6.  If the feature interacts with external services, create:

src/features/`<feature>`{=html}/services/`<feature>`{=html}Service.js

7.  If routing is needed, integrate the page into the application
    routing.

---

# Example Minimal Page Template

```jsx
import "./FeaturePage.css";

export default function FeaturePage() {
  return (
    <div className="FeaturePage">
      <h1 className="FeaturePage__title">Feature Page</h1>
    </div>
  );
}
```

Example CSS:

```css
.FeaturePage {
}

.FeaturePage__title {
}
```

---

# Acceptance Checklist

Before completing the task, verify:

- feature lives under src/features
- JavaScript (no TypeScript)
- BEM CSS structure
- no Supabase calls in components/pages
- logic placed in hooks/services
- minimal scaffolding only
- folders created only when needed

---

# Output Format

Always return:

1.  The new file tree (only created files)
2.  Complete file contents
3.  Clear paths for each file
