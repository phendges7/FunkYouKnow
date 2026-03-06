---
name: scan-performance
description: Audit a React + Vite + Supabase application for performance bottlenecks, focusing on rerender cascades, media/gallery loading, and query lifecycle bugs during navigation.
---

# Purpose

Scan the application for performance and data-loading issues without making broad speculative rewrites.

This skill is designed for React + Vite + Supabase applications, especially apps with:

- route navigation
- async server-state
- media-heavy pages
- galleries and background video
- feature-first architecture

The goal is to identify likely causes of:

- unnecessary rerenders
- slow or wasteful media loading
- stale or broken query behavior after navigating back and forth
- missing database objects until the page is refreshed

This skill should prioritize diagnosis, evidence, and safe recommendations.

---

# When to Use

Use this skill when the user asks to:

- scan the app for performance issues
- investigate slow pages or slow navigation
- review rerender problems
- review gallery or media loading strategy
- investigate why database-backed data disappears or fails after navigation
- produce a performance audit before implementing fixes

Do NOT use this skill when the user only wants:

- a single isolated code change
- a new feature scaffold
- visual/UI redesign

---

# Inputs

If missing, infer from the repository where possible:

- target area or route (optional)
- whether to scan the whole app or a specific feature
- whether code changes are allowed
- whether build/dev/test commands are available

Default behavior:

- scan only
- no code changes unless explicitly requested

---

# Core Investigation Goals

The skill must investigate these classes of problems.

## 1. React rerender cascades

Look for:

- parent components causing large subtree rerenders
- unstable object/array/function props recreated on every render
- effects that retrigger state changes unnecessarily
- duplicated derived state
- expensive computations inside render
- context values changing too often and rerendering unrelated consumers
- pages doing too much orchestration directly

Check whether:

- logic should move into hooks/services
- memoization is missing where it would materially reduce rerenders
- memoization is being overused without benefit
- route/page composition can be simplified

Do not recommend `useMemo`, `useCallback`, or `React.memo` blindly.
Only suggest them when there is a clear rerender cause and measurable likely benefit.

---

## 2. Gallery and media loading strategy

Look for:

- full-size images loaded where thumbnails should be used
- eager loading of gallery media that should be deferred
- background videos loading too early or too often
- media fetched before the route or section is visible
- repeated media URL resolution or repeated fetch logic
- lack of lazy loading on images/video where appropriate
- components that mount/unmount and trigger redundant media work

Check whether:

- thumbnails are used in lists/grids and full assets only in detail/modal views
- route transitions cause media to refetch unnecessarily
- gallery/modal logic can preserve state or cache more safely
- browser-native lazy loading and route-level deferral are being used where appropriate

---

## 3. Query lifecycle and navigation bugs

This is a priority area.

Investigate cases where:

- navigating away and back causes DB objects not to render
- data is missing until refresh
- queries do not refetch or hydrate correctly
- stale state or race conditions hide valid data
- route params or dependencies are not wired correctly
- async hooks exit early or stay stuck in loading/error/empty states
- effects or cleanup logic cancel or overwrite valid results
- query keys are unstable or incomplete
- data mapping produces false-empty results after navigation

For React Query or similar server-state patterns, inspect:

- query key stability
- `enabled` conditions
- stale/cache timing assumptions
- invalidation/refetch behavior after mutations or route transitions
- duplicate fetching logic outside the query layer

If the repository uses feature hooks instead of shared query hooks in some areas, verify whether the split is consistent and safe.

---

# F.U.K.-Specific Heuristics

When scanning this repository, prefer these assumptions unless code proves otherwise:

- features live under `src/features`
- pages should stay thin
- hooks contain orchestration logic
- services contain external I/O
- components should not call Supabase directly
- media-heavy areas deserve extra scrutiny
- event/gallery/background-video flows should be treated as high-risk performance surfaces

If an issue involves event media:

- verify thumbnails vs full assets
- verify lazy rendering strategy
- verify that mapping from DB media records to UI structures is not duplicated across components

If an issue involves navigation:

- compare route-level behavior before and after unmount/remount
- inspect hooks for stale closure bugs, dependency mistakes, and race conditions

---

# Investigation Process

Follow this order.

## Step 1. Map the app structure

Identify:

- app shell and routing
- shared providers and contexts
- feature folders
- shared query hooks
- Supabase access points
- media-heavy pages/components
- suspect routes for broken back/forward navigation

Summarize only the parts relevant to performance.

---

## Step 2. Find likely hotspots

Prioritize files and flows that are likely to affect:

- route transitions
- database-backed lists/details
- galleries/modals/background media
- shared providers/context
- pages with many effects or local orchestration

Prefer high-signal hotspots over broad unfocused scanning.

---

## Step 3. Inspect rendering behavior statically

Review:

- prop churn
- state placement
- effect dependencies
- context usage
- repeated transforms in render
- data-fetching duplication

Flag suspected rerender cascades with specific evidence.

Bad:

- “might rerender a lot”

Good:

- “this parent recreates `filters`, `handlers`, and mapped media arrays on every render, forcing children to rerender even when server data is unchanged”

---

## Step 4. Inspect query/data-loading behavior

Review:

- shared query hooks
- feature hooks that fetch data
- service calls
- query key construction
- enabled/guard logic
- invalidation/refetch patterns
- race conditions around unmount/remount

Pay special attention to navigation flows where data disappears until refresh.

If the app mixes manual `useEffect` fetching and query-layer fetching, call this out clearly.

---

## Step 5. Inspect media delivery behavior

Review:

- list vs detail asset choice
- thumbnail usage
- lazy loading
- modal/gallery behavior
- background video lifecycle
- route transitions involving media mounts

Flag wasteful patterns and rank them by likely impact.

---

## Step 6. Run safe verification commands if available

If the repo provides commands, prefer safe read-only checks first, such as:

- build
- lint
- test
- available profiling or analysis scripts

Do not invent commands that do not exist.

If no profiling scripts exist, continue with static analysis and state that limitation clearly.

---

# Output Format

Return findings in this structure:

## Summary

A brief overview of the highest-impact issues found.

## Findings

For each finding, include:

1. Title
2. Severity: high / medium / low
3. Confidence: high / medium / low
4. Affected files
5. Evidence
6. Likely cause
7. User impact
8. Recommended fix
9. Risk of the fix

## Priority Order

Rank the top fixes by expected impact vs implementation risk.

## Safe Next Actions

List the smallest safe changes that should be implemented first.

---

# Rules for Recommendations

- Prefer small, high-confidence fixes over sweeping rewrites.
- Do not recommend memoization everywhere.
- Do not recommend moving all state globally.
- Do not recommend replacing architecture unless the evidence strongly supports it.
- Do not assume the database is at fault if the bug is more likely caused by query lifecycle or render logic.
- Do not change code unless the user explicitly asks for implementation after the audit.

---

# If Code Changes Are Explicitly Requested

If the user asks for fixes after the scan:

- implement only the top-priority safe changes first
- keep diffs small and reversible
- preserve existing architecture
- prefer hooks/services refactors over component bloat
- explain exactly why each change was made

---

# Acceptance Checklist

Before finishing, verify that the audit:

- covers rerender cascades
- covers media/gallery loading
- covers navigation/query lifecycle bugs
- names specific files and patterns
- avoids vague generic advice
- prioritizes fixes by impact and risk
- does not perform speculative rewrites
