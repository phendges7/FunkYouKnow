import { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../../../context/AuthContext";
import usePageFade from "../../../../hooks/usePageFade";

import { eventsService } from "../../../events/services/eventsService";
import { fetchRequestedSongs } from "../../../songs/services/songsService";

import "./AdminDashboard.css";

const AdminDashboard = () => {
  usePageFade();

  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [state, setState] = useState({
    isLoading: true,
    error: "",
    events: [],
    requestedSongs: [],
    lastUpdatedAt: null,
  });

  useEffect(() => {
    if (authLoading) return;

    if (!user || !user.isAdmin) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  const formatDateTime = useCallback((isoString) => {
    if (!isoString) return "—";
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return "—";
    return new Intl.DateTimeFormat("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  }, []);

  const startOfToday = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const loadDashboard = useCallback(async () => {
    setState((prev) => ({
      ...prev,
      isLoading: true,
      error: "",
    }));

    try {
      const [eventsRaw, requestedSongs] = await Promise.all([
        eventsService.getAllEvents(),
        fetchRequestedSongs({
          limit: 5,
          orderBy: "like_count",
          ascending: false,
        }),
      ]);

      const events = (eventsRaw || []).filter((e) => !e.deleted_at);

      setState({
        isLoading: false,
        error: "",
        events,
        requestedSongs: requestedSongs || [],
        lastUpdatedAt: new Date().toISOString(),
      });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: err?.message || "Failed to load dashboard data.",
      }));
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user || !user.isAdmin) return;

    loadDashboard();
  }, [authLoading, user, loadDashboard]);

  const displayName = useMemo(
    () => user?.displayName?.trim() || "Admin",
    [user]
  );

  const derived = useMemo(() => {
    const events = state.events || [];

    const totalEvents = events.length;

    const upcomingEvents = [...events]
      .filter((e) => {
        const dt = new Date(e.date);
        return !Number.isNaN(dt.getTime()) && dt >= startOfToday;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    const drafts = events.filter(
      (e) => String(e.status || "").toLowerCase() === "draft"
    );

    const recentEvents = [...events]
      .sort((a, b) => {
        const aKey = new Date(a.created_at || a.date || 0).getTime();
        const bKey = new Date(b.created_at || b.date || 0).getTime();
        return bKey - aKey;
      })
      .slice(0, 6);

    return {
      totalEvents,
      upcomingEvents,
      upcomingCount: upcomingEvents.length,
      draftCount: drafts.length,
      recentEvents,
      nextThreeUpcoming: upcomingEvents.slice(0, 3),
    };
  }, [state.events, startOfToday]);

  const actionItems = useMemo(
    () => [
      {
        label: "Create new event",
        description: "Publish a new event with cover, gallery & details.",
        onClick: () => navigate("/admin/events/create"),
      },
      {
        label: "Manage events",
        description: "Edit, draft, publish, or archive existing events.",
        onClick: () => navigate("/admin/events"),
      },
      // {
      //   label: "Manage users",
      //   description: "Admins, permissions, and account checks.",
      //   onClick: () => navigate("/admin/users"),
      // },
    ],
    [navigate]
  );

  // If still auth-loading, don’t flash content
  if (authLoading) {
    return (
      <main className="admin-dashboard">
        <section
          className="admin-dashboard__loading"
          aria-label="Loading admin"
        >
          <div className="admin-dashboard__spinner" aria-hidden="true" />
          <p className="admin-dashboard__loading-text">Checking access…</p>
        </section>
      </main>
    );
  }

  if (!user || !user.isAdmin) return null;

  return (
    <main className="admin-dashboard">
      <header className="admin-dashboard__header">
        <div className="admin-dashboard__header-center">
          <h1 className="admin-dashboard__title">Admin Dashboard</h1>
          <p className="admin-dashboard__subtitle">
            Welcome back,{" "}
            <span className="admin-dashboard__name">{displayName}</span>.
          </p>
        </div>

        <div className="admin-dashboard__header-right">
          <div className="admin-dashboard__meta">
            <span className="admin-dashboard__meta-label">Last updated</span>
            <span className="admin-dashboard__meta-value">
              {state.lastUpdatedAt ? formatDateTime(state.lastUpdatedAt) : "—"}
            </span>
          </div>

          <button
            className="admin-dashboard__refresh"
            type="button"
            onClick={loadDashboard}
            disabled={state.isLoading}
            aria-disabled={state.isLoading}
          >
            {state.isLoading ? "Refreshing…" : "Refresh"}
          </button>
        </div>
      </header>

      {state.error ? (
        <section className="admin-dashboard__alert" role="alert">
          <p className="admin-dashboard__alert-title">Dashboard error</p>
          <p className="admin-dashboard__alert-text">{state.error}</p>
        </section>
      ) : null}

      <section className="admin-dashboard__stats" aria-label="Overview stats">
        <article className="admin-dashboard__card">
          <div className="admin-dashboard__card-header">
            <h2 className="admin-dashboard__card-title">Total events</h2>
            <span className="admin-dashboard__badge admin-dashboard__badge--neutral">
              Live
            </span>
          </div>
          <p className="admin-dashboard__card-value">
            {state.isLoading ? "—" : derived.totalEvents}
          </p>
          <p className="admin-dashboard__card-meta">
            Excludes soft-deleted records.
          </p>
        </article>

        <article className="admin-dashboard__card">
          <div className="admin-dashboard__card-header">
            <h2 className="admin-dashboard__card-title">Upcoming</h2>
            <span className="admin-dashboard__badge admin-dashboard__badge--neutral">
              From today
            </span>
          </div>
          <p className="admin-dashboard__card-value">
            {state.isLoading ? "—" : derived.upcomingCount}
          </p>
          <p className="admin-dashboard__card-meta">
            Based on event date ≥ today.
          </p>
        </article>

        <article className="admin-dashboard__card">
          <div className="admin-dashboard__card-header">
            <h2 className="admin-dashboard__card-title">Drafts</h2>
            <span className="admin-dashboard__badge admin-dashboard__badge--neutral">
              Status
            </span>
          </div>
          <p className="admin-dashboard__card-value">
            {state.isLoading ? "—" : derived.draftCount}
          </p>
          <p className="admin-dashboard__card-meta">
            Events with status “draft”.
          </p>
        </article>
      </section>

      <section className="admin-dashboard__actions" aria-label="Quick actions">
        <div className="admin-dashboard__section-header">
          <h2 className="admin-dashboard__section-title">Quick actions</h2>
          <p className="admin-dashboard__section-subtitle">
            The buttons you’ll actually press.
          </p>
        </div>

        <div className="admin-dashboard__actions-grid">
          {actionItems.map((item) => (
            <button
              key={item.label}
              className={["admin-dashboard__action"].join(" ")}
              type="button"
              onClick={item.onClick}
            >
              <span className="admin-dashboard__action-label">
                {item.label}
              </span>
              <span className="admin-dashboard__action-desc">
                {item.description}
              </span>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
};

export default AdminDashboard;
