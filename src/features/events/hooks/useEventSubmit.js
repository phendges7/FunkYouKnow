import { useState } from "react";
import { eventsService } from "../services/eventsService";
import { eventMediaService } from "../services/eventMediaService";

/**
 * Orchestrates event creation/update and related media sync.
 * IMPORTANT:
 * - React form fields !== DB columns
 * - This hook is the ONLY place where persistence happens (events + media)
 */
export const useEventSubmit = ({
  mode, // "create" | "edit"
  eventId,
  formData,
  cover = null,
  gallery = [],
  backgroundVideo = null,
  eventTitle = "",
  createdBy = null, // string user id (recommended)
}) => {
  const [status, setStatus] = useState("idle"); // idle | saving | success | error
  const [error, setError] = useState(null);

  const submit = async () => {
    try {
      setStatus("saving");
      setError(null);

      /**
       * 🔥 MAP FORM → DB PAYLOAD (DEFENSIVE)
       * Never send raw formData to Supabase
       *
       * We also DROP thumbnail_url/background_video_url here because they are preview-only.
       */
      const {
        ticketLink,
        thumbnail_url, // preview-only
        background_video_url, // preview-only
        ...rest
      } = formData || {};

      const eventPayload = {
        ...rest,
        ticket_url: ticketLink?.trim() || null,
      };

      // 1️⃣ Save base event
      const savedEvent =
        mode === "create"
          ? await eventsService.createEvent(eventPayload, createdBy)
          : await eventsService.updateEvent(eventId, eventPayload, createdBy);

      const resolvedEventId = savedEvent?.id ?? eventId;
      if (!resolvedEventId) throw new Error("Event ID could not be resolved.");

      // Use the best title we have for ALT generation
      const resolvedTitle =
        (eventTitle || "").trim() ||
        (savedEvent?.name || "").trim() ||
        (eventPayload?.name || "").trim();

      // 2️⃣ Cover (event_media role = cover)
      if (cover) {
        const coverUrl = await eventMediaService.upsertCover({
          eventId: resolvedEventId,
          file: cover,
          createdBy,
        });

        if (coverUrl) {
          await eventsService.updateEvent(
            resolvedEventId,
            { thumbnail_url: coverUrl },
            createdBy,
          );
        }
      }

      // 3️⃣ Background video (event_media role = background)
      if (backgroundVideo) {
        const backgroundUrl = await eventMediaService.upsertBackgroundVideo({
          eventId: resolvedEventId,
          file: backgroundVideo,
          createdBy,
        });

        if (backgroundUrl) {
          await eventsService.updateEvent(
            resolvedEventId,
            { background_video_url: backgroundUrl },
            createdBy,
          );
        }
      }

      // 4️⃣ Gallery sync (new items only)
      if (Array.isArray(gallery) && gallery.length > 0) {
        let position =
          await eventMediaService.getNextGalleryPosition(resolvedEventId);

        for (const item of gallery) {
          if (!item?.isNew || !item?.file) continue;

          await eventMediaService.createGalleryItem({
            eventId: resolvedEventId,
            file: item.file,
            position,
            eventTitle: resolvedTitle,
            createdBy,
          });

          position += 1;
        }
      }

      setStatus("success");
      return resolvedEventId;
    } catch (err) {
      console.error("[useEventSubmit]", err);
      setError("Could not save event. Please try again.");
      setStatus("error");
      throw err;
    }
  };

  return {
    submit,
    status,
    error,
    isSaving: status === "saving",
  };
};
