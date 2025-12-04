# 🧩 Hooks — F.U.K. Events Feature

This folder contains **all custom React hooks** used across the **Events Feature** of the FUNK YOU KNOW web application.  
Each hook is responsible for a specific piece of UI or business logic, keeping the main components clean, modular, and maintainable.

This documentation provides:

- A quick overview of each hook
- What it does
- Where it is used
- The mental model for this folder
- How future hooks should be added

---

# 📁 Folder Purpose

All hooks inside this folder are **specific to the Events domain**.  
They are _not_ global application hooks — they exist only to support:

- Event creation/editing (EventForm)
- Event details rendering (EventDetails)
- Media upload/delete logic
- Gallery modal navigation
- Cover type detection

If you are working inside the **Events feature**, this is where your hooks live.

---

# 🔍 Hooks Index

Below is a quick reference table documenting each hook, its responsibility, and where it is currently used.

| Hook                     | Purpose                                                                              | Used In                            |
| ------------------------ | ------------------------------------------------------------------------------------ | ---------------------------------- |
| **useEventForm**         | Controls all state + handlers for EventForm (name, slug, status, date, description). | `EventForm.jsx`                    |
| **useCoverUpload**       | Uploads cover media (image or video) to Supabase Storage and updates form state.     | `EventForm.jsx`                    |
| **useGalleryUpload**     | Handles gallery file selection prior to upload.                                      | `EventForm.jsx`                    |
| **useGalleryDelete**     | Deletes a gallery image from Supabase Storage and updates event description.         | `EventForm.jsx`                    |
| **useFetchEventDetails** | Fetches a single event by slug, exposing `{ event, loading }`.                       | `EventDetails.jsx`                 |
| **useModalNavigation**   | Handles modal open/close + next/previous navigation for gallery modal.               | `EventDetails.jsx`                 |
| **useCoverType**         | Detects if a cover URL is an image or a video (mp4, mov, webm…).                     | `EventDetails.jsx`                 |
| **eventFormUtils**       | Shared utilities (slug generator + storage path extraction).                         | `useEventForm`, `useGalleryDelete` |

---

# 🧠 How Hooks Are Structured

Each hook follows the same internal convention:

1. **First line:** a short comment describing the hook
2. **Stateful logic** (if needed)
3. **Helper functions**
4. **A returned object** exposing only what the component needs

Example pattern:

```js
/**
 * Short description of what this hook does.
 */

export default function useSomething() {
  const [state, setState] = useState();

  const action = () => {};

  return { state, action };
}
```

# Events Feature Hooks Guidelines

This document outlines the guidelines for creating and managing React hooks within the Events feature.

## 🎯 Purpose

This makes all hooks consistent across the entire Events feature.

## 🧭 When To Add a New Hook

Create a new hook when:

- A component is getting too large
- Logic is reused in more than one place
- A piece of logic has one clear responsibility
- Something is related specifically to the Events feature

Hooks should **NOT** be placed here when:

- They belong to other domains (e.g., authentication, UI theme)
- They are global utilities (those go to `/utils`)
- They are tied to a totally different feature

## 🏗 Folder Guidelines

### ✔ Naming Convention

Always name hooks using the prefix:

- `useSomethingMeaningful.js`

### ✔ One responsibility per hook

Do not mix concerns.  
If a hook manages uploading AND deleting — break it into two.

### ✔ Keep it pure

Hooks should not manipulate UI directly.  
Let the component render.

### ✔ Document everything

Each new hook must include a one-line explanation at the top.

## 🙌 Contribution Notes

If you are adding or editing hooks:

- Keep the structure clean
- Follow the naming convention
- Update this README's hook table
- Ensure imports stay organized
- Keep the domain logic inside `features/events/`

This ensures the codebase stays clear for all collaborators — present and future.
