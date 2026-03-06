import { useMemo } from "react";
import { useParams } from "react-router-dom";

import ModalGallery from "../../../../components/media/ModalGallery/ModalGallery";
import { useEventBySlug } from "../../../../hooks/queries/useEventBySlug";

import defaultCover from "../../../../assets/cover_image_default.png";

import EventHero from "./components/EventHero/EventHero";
import EventInfo from "./components/EventInfo/EventInfo";
import EventGallerySection from "./components/EventGallerySection/EventGallerySection";

import useEventTicketsCTA from "./hooks/useEventTicketsCTA";
import useEventGalleryLazy from "./hooks/useEventGalleryLazy";
import useEventBackgroundVideo from "./hooks/useEventBackgroundVideo";
import useModalGallery from "./hooks/useModalGallery";

import "./EventDetails.css";

const EventDetails = () => {
  const { slug } = useParams();

  const {
    data: event,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useEventBySlug(slug);

  const {
    id: eventId,
    name,
    description,
    thumbnail_url,
    date,
    location,
    background_video_url,
    ticket_url,
  } = event || {};

  const perfMode =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("perf") === "1";

  const formattedDate = useMemo(
    () =>
      date
        ? new Date(date).toLocaleString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        : "Date TBD",
    [date],
  );

  const coverSrc = useMemo(
    () => thumbnail_url || defaultCover,
    [thumbnail_url],
  );

  // ✅ Tickets CTA (page rule)
  const ticketCta = useEventTicketsCTA({ date, ticket_url });

  // ✅ Background video orchestration (page rule that uses global context hook)
  const { videoUrl, isMuted, toggleMute } = useEventBackgroundVideo({
    eventExists: Boolean(event),
    backgroundVideoUrl: background_video_url,
  });

  // ✅ Gallery lazy loading + thumbs mapping (page rule)
  const {
    galleryItems,
    galleryStatus,
    shouldRenderGallery,
    sentinelRef,
    modalPhotos,
  } = useEventGalleryLazy(eventId);

  // ✅ Modal UI state (page rule)
  const { modalOpen, modalIndex, openModal, closeModal, navigateModal } =
    useModalGallery(galleryItems.length);

  if (isLoading) {
    return (
      <main className="event-details event-details--loading">
        <div className="event-details__loader" />
      </main>
    );
  }

  if (isError) {
    return (
      <main className="event-details event-details--error">
        <h1>Event not found</h1>
        <p className="event-details__error">
          {error?.message || "Could not load event. Try again."}
        </p>
        <button
          type="button"
          className="event-details__retry"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          {isFetching ? "Retrying..." : "Retry"}
        </button>
      </main>
    );
  }

  if (!event) {
    return (
      <main className="event-details">
        <h1>Event not found</h1>
      </main>
    );
  }

  return (
    <main
      className={`event-details${perfMode ? " event-details--perf" : ""}`}
      data-perf-mode={perfMode ? "1" : "0"}
    >
      <EventHero
        name={name}
        coverSrc={coverSrc}
        backgroundVideoUrl={background_video_url}
        videoUrl={videoUrl}
        isMuted={isMuted}
        onToggleMute={toggleMute}
      />

      <EventInfo
        formattedDate={formattedDate}
        location={location}
        description={description}
        ticketCta={ticketCta}
      />

      <EventGallerySection
        sentinelRef={sentinelRef}
        shouldRender={shouldRenderGallery}
        status={galleryStatus}
        items={galleryItems}
        onOpenModal={openModal}
      />

      {modalOpen && (
        <ModalGallery
          photos={modalPhotos}
          index={modalIndex}
          onClose={closeModal}
          onNavigate={navigateModal}
        />
      )}
    </main>
  );
};

export default EventDetails;
