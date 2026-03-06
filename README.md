# 🎧 FUNK YOU KNOW — Official Web App

> Private Repository · Internal Use Only

Welcome to the internal repository of the FUNK YOU KNOW (F.U.K.) Web Application, a modern single-page application built to power the digital presence of a Brazilian Funk events brand operating in the United Kingdom.

**This repository is private, and access is restricted to authorized collaborators only.**
**It is not intended to be cloned, forked, or distributed outside the team.**

## 🚀 Overview

The F.U.K. Web App is a React + Vite project designed to deliver a high-performance, neon-styled, club-inspired experience for event attendees and internal administrators.

The platform includes:

- Public pages (Events, Event Details, Request a Song, About, Contact)
- An admin-only panel for CRUD management of events
- A custom Supabase integration for authentication, database queries, and storage
- Animated page transitions and immersive UI/UX
- A fully responsive layout (desktop, tablet, mobile)

The project is actively evolving and represents the current stage of development.

## 🧩 Tech Stack

### Frontend

- React 18
- Vite
- CSS Modules
- Neon dark-mode UI using custom gradients and cinematic overlays
- React Router DOM for SPA routing
- IntersectionObserver & Lazy Loading for optimized image performance
- Custom hooks (usePageFade, AuthProvider, lazy-image hooks)

### Backend & Services

- Supabase
  - Authentication (email/password)
  - Realtime database
  - Storage (covers & gallery images)
  - RLS Policies for admin-only access

### Other

- Custom loading states
- Animated modal gallery
- Full admin CRUD for events
- PWA preparation (manifest, icons, future service worker)

## 🔐 Authentication & Authorization

Admin access is validated through the users table:

- `isAdmin = true` → grants access to `/adminDashboard`
- Non-admin users are restricted and shown "Access Denied"

### Session Persistence

- `AuthProvider` context
- LocalStorage token storage
- Auto-redirect logic based on user role

## 🗃 Database Schema

### Events Table

The primary backend table `events` includes fields:

| Field                                      | Type      | Description                          |
| ------------------------------------------ | --------- | ------------------------------------ |
| `id`                                       | uuid      | Primary key                          |
| `slug`                                     | string    | URL identifier                       |
| `name`                                     | string    | Event name                           |
| `description`                              | jsonb     | Text + photos[]                      |
| `status`                                   | enum      | `draft` \| `published` \| `archived` |
| `cover_image_url`                          | string    | Cover image URL                      |
| `location`                                 | string    | Event location                       |
| `date`                                     | timestamp | Event date & time                    |
| `created_by` / `updated_by` / `deleted_by` | uuid      | User references                      |
| `timestamps`                               | timestamp | Auto-generated timestamps            |

**RLS policies** ensure only admins can alter event data.

## 🖼 Media Handling

Images are stored in **Supabase Storage**:

- `/events/covers/` — event cover images
- `/events/gallery/{eventId}/` — event galleries

### Gallery Features

- ✅ Lazy loading
- ✅ Blur-up placeholder effect
- ✅ Modal full-screen viewing
- ✅ Swipe navigation (mobile)
- ✅ Keyboard navigation (desktop)

## 🎨 UI/UX Features

- Cinematic event cover with gradient overlays
- Custom neon purple/lilac + acid green palette
- Smooth blur/fade transitions
- Fully responsive layout
- High-quality modal gallery
- Admin panel with intuitive CRUD experience

## 🔧 Development

### Scripts

```bash
npm install
npm run dev
npm run build
npm run preview
```

## ⚠️ Important Notice

This repository is private.  
Content here is restricted to authorized collaborators only.

**Please DO NOT:**

- Publish this repo
- Fork it publicly
- Clone it outside the intended environment
- Share internal code, database schema, or API keys

## 🧭 Roadmap (Current & Upcoming)

- [ ] Add Service Worker + PWA offline caching
- [ ] Implement splash screens for iOS/Android
- [ ] Add role-specific dashboards
- [ ] Expand admin tools for analytics
- [ ] Improve gallery performance even further
- [ ] Event analytics & ticketing integration (future)

## 🤝 Credits

Developed by Pedro Henrique Hendges Rodrigues

**FUNK YOU KNOW** — Tudo Nosso, Nada Deles.
