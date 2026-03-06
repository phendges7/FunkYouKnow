import { useEffect, useRef, useState } from "react";

import useEventForm from "../../hooks/useEventForm";
import useGalleryUpload from "../../hooks/useGalleryUpload";
import useGalleryDelete from "../../hooks/useGalleryDelete";
import useCoverUpload from "../../hooks/useCoverUpload";
import useBackgroundVideoUpload from "../../hooks/useBackgroundVideoUpload";
import { useEventSubmit } from "../../hooks/useEventSubmit";

import { useAuth } from "../../../../context/AuthContext";

import EventGalleryUploader from "../EventGalleryUploader/EventGalleryUploader";
import EventGalleryPreview from "../EventGalleryPreview/EventGalleryPreview";
import EventCoverUploader from "../EventCoverUploader/EventCoverUploader";
import EventBackgroundVideoUploader from "../EventBackgroundVideoUploader/EventBackgroundVideoUploader";

import { eventMediaService } from "../../services/eventMediaService";

import "./EventForm.css";

const EventForm = ({ event = null, onSubmitSuccess }) => {
  const { user } = useAuth();

  /* ----------------------------- base event form ---------------------------- */
  const { form, setForm, handleChange } = useEventForm(event);

  /* ----------------------------- gallery (new) ------------------------------ */
  const {
    galleryItems,
    addFiles,
    removeItem,
    resetGallery,
    error: galleryError,
  } = useGalleryUpload([]);

  const galleryInputRef = useRef(null);

  /* ------------------------- gallery (already in DB) ------------------------- */
  const [galleryFromDb, setGalleryFromDb] = useState([]);

  useEffect(() => {
    if (!event?.id) return;

    const loadGallery = async () => {
      const items = await eventMediaService.getGalleryByEvent(event.id);
      setGalleryFromDb(items);
    };

    loadGallery();
  }, [event?.id]);

  /* ----------------------------- hard delete -------------------------------- */
  const { deleteGalleryItem, deletingId } = useGalleryDelete((deletedId) => {
    setGalleryFromDb((prev) => prev.filter((item) => item.id !== deletedId));
  });

  /* ----------------------------- cover select -------------------------------- */
  const {
    coverFile,
    coverPreviewUrl,
    handleCoverSelect,
    error: coverError,
  } = useCoverUpload(setForm);

  /* ------------------------- background video select ------------------------- */
  const {
    backgroundVideoFile,
    backgroundVideoPreviewUrl,
    handleBackgroundVideoSelect,
    error: bgError,
  } = useBackgroundVideoUpload(setForm);

  /* ----------------------------- submit logic -------------------------------- */
  const {
    submit,
    isSaving,
    error: submitError,
  } = useEventSubmit({
    mode: event ? "edit" : "create",
    eventId: event?.id,
    formData: form,
    cover: coverFile,
    gallery: galleryItems,
    backgroundVideo: backgroundVideoFile,
    eventTitle: form?.name || "",
    createdBy: user?.id || null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await submit();

      resetGallery();
      if (galleryInputRef.current) {
        galleryInputRef.current.value = "";
      }

      onSubmitSuccess?.();
    } catch {
      // errors handled in hooks
    }
  };

  return (
    <form className="event-form" onSubmit={handleSubmit}>
      <h2 className="event-form__title">
        {event ? "Edit Event" : "Create New Event"}
      </h2>

      {(submitError || galleryError || coverError || bgError) && (
        <div className="event-form__error">
          {submitError || galleryError || coverError || bgError}
        </div>
      )}

      {/* ----------------------------- basic fields ---------------------------- */}
      <label className="event-form__label">
        Event Name
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className="event-form__input"
        />
      </label>

      <label className="event-form__label">
        Location
        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          className="event-form__input"
        />
      </label>

      <label className="event-form__label">
        Date
        <input
          type="datetime-local"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
          className="event-form__input"
        />
      </label>

      <label className="event-form__label">
        Description
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="event-form__textarea"
        />
      </label>

      <label className="event-form__label">
        Status
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="event-form__select"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </label>

      <label className="event-form__label">
        Ticket Link
        <input
          name="ticketLink"
          value={form.ticketLink}
          onChange={handleChange}
          className="event-form__input"
        />
      </label>

      {/* ------------------------------ cover ---------------------------------- */}
      <EventCoverUploader
        previewUrl={coverPreviewUrl || form.thumbnail_url}
        onSelect={handleCoverSelect}
        disabled={isSaving}
      />

      {/* ------------------------ background video ----------------------------- */}
      <EventBackgroundVideoUploader
        previewUrl={backgroundVideoPreviewUrl || form.background_video_url}
        onSelect={handleBackgroundVideoSelect}
        disabled={isSaving}
      />

      {/* ---------------------- gallery already uploaded ----------------------- */}
      <EventGalleryPreview
        items={galleryFromDb}
        onDelete={deleteGalleryItem}
        deletingId={deletingId}
      />

      {/* ---------------------- gallery new uploads ---------------------------- */}
      <EventGalleryUploader
        existingPhotos={[]}
        newItems={galleryItems}
        onAddFiles={addFiles}
        onRemoveNew={removeItem}
        onRemoveExisting={() => {}}
        inputRef={galleryInputRef}
        disabled={isSaving}
      />

      {/* ------------------------------- submit -------------------------------- */}
      <button className="event-form__submit" type="submit" disabled={isSaving}>
        {isSaving ? "Saving..." : event ? "Save Changes" : "Create Event"}
      </button>
    </form>
  );
};

export default EventForm;
