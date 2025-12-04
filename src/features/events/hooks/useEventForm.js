/**
 * Hook to manage EventForm states (events + media fields básicos)
 * */
import { useState } from "react";
import { generateSlug } from "./eventFormUtils";

const useEventForm = (event) => {
  const [form, setForm] = useState({
    name: event?.name || "",
    slug: event?.slug || "",
    description: event?.description || "",
    location: event?.location || "",
    status: event?.status || "draft",
    thumbnail_url: event?.thumbnail_url || "",
    background_video_url: event?.background_video_url || "",
    date: event?.date
      ? new Date(event.date).toISOString().replace(/:\d{2}\.\d{3}Z$/, "")
      : "",
    // only URLs to gallery preview (comes from event_media or new uploads)
    photos: event?.photos || [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => {
      if (name === "name") {
        return {
          ...prev,
          name: value,
          slug: generateSlug(value, prev.date),
        };
      }

      if (name === "date") {
        return {
          ...prev,
          date: value,
          slug: generateSlug(prev.name, value),
        };
      }

      return { ...prev, [name]: value };
    });
  };

  return { form, setForm, handleChange };
};

export default useEventForm;
