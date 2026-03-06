import { useState, useEffect } from "react";

/**
 * Manages base event form state.
 * MUST mirror the `events` table schema only.
 * Media is handled exclusively elsewhere.
 */
const useEventForm = (event = null) => {
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    location: "",
    status: "draft",
    date: "",
    ticketLink: "",
    thumbnail_url: null,
    background_video_url: null,
  });

  useEffect(() => {
    if (!event) return;

    setForm({
      name: event.name ?? "",
      slug: event.slug ?? "",
      description: event.description ?? "",
      location: event.location ?? "",
      status: event.status ?? "draft",
      date: event.date ? new Date(event.date).toISOString().slice(0, 16) : "",
      ticketLink: event.ticket_url ?? "",
      thumbnail_url: event.thumbnail_url ?? null,
      background_video_url: event.background_video_url ?? null,
    });
  }, [event]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return {
    form,
    setForm,
    handleChange,
  };
};

export default useEventForm;
