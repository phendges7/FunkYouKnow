import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";

import { eventsService } from "../../services/eventsService";
import { eventMediaService } from "../../services/eventMediaService";

import ModalGallery from "../../../../components/ModalGallery/ModalGallery";
import usePageFade from "../../../../utils/usePageFade";

import { useBackgroundVideo } from "../../../../hooks/useBackgroundVideo";

import defaultCover from "../../../../assets/cover_image_default.png";
import "./EventDetails.css";

const EventDetails = () => {
  usePageFade();

  const { slug } = useParams();
  const { videoUrl, setBackgroundVideo, clearBackgroundVideo, videoRef } =
    useBackgroundVideo();
  const [isMuted, setIsMuted] = useState(true);

  const [event, setEvent] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  // Memoize the load function to prevent unnecessary re-renders
  const loadEventData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await eventsService.getEventBySlug(slug);

      if (!data) {
        setEvent(null);
        clearBackgroundVideo();
        return;
      }

      setEvent(data);

      // Set background video only if it exists and is different from current
      if (data?.background_video_url) {
        setBackgroundVideo(data.background_video_url);
      } else {
        clearBackgroundVideo();
      }

      // Load gallery only if event has ID
      if (data?.id) {
        try {
          const media = await eventMediaService.getGalleryByEvent(data.id);
          setGallery(media.map((m) => m.public_url));
        } catch (mediaError) {
          console.error("Erro ao carregar galeria:", mediaError.message);
          setGallery([]);
        }
      }
    } catch (err) {
      console.error("Erro ao carregar evento:", err.message);
      clearBackgroundVideo();
      setEvent(null);
    } finally {
      setLoading(false);
    }
  }, [slug, setBackgroundVideo, clearBackgroundVideo]);

  useEffect(() => {
    loadEventData();
  }, [loadEventData]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearBackgroundVideo();
    };
  }, [clearBackgroundVideo]);

  if (loading) {
    return (
      <main className="event-details event-details--loading">
        <div className="event-details__loader" />
      </main>
    );
  }

  if (!event) {
    return (
      <main className="event-details">
        <h1>Evento não encontrado.</h1>
      </main>
    );
  }

  const {
    name,
    description,
    thumbnail_url,
    date,
    location,
    background_video_url,
  } = event;

  const formattedDate = date
    ? new Date(date).toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "Data a definir";

  const coverSrc = thumbnail_url || defaultCover;

  const openModal = (index) => {
    setModalIndex(index);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const navigateModal = (direction) => {
    setModalIndex((prev) => {
      const total = gallery.length;
      if (!total) return prev;
      return (prev + direction + total) % total;
    });
  };

  return (
    <main className="event-details">
      {/* Capa somente sem vídeo */}
      {!background_video_url && (
        <section className="event-cover">
          <img
            src={coverSrc}
            alt={name}
            className="event-cover__img"
            loading="lazy"
          />
          <div className="event-cover__overlay" />
          <h1 className="event-cover__title">{name}</h1>
        </section>
      )}

      {/* Título flutuante quando vídeo existe */}
      {background_video_url && (
        <div className="event-hero-title">
          <h1 className="event-hero-title__text">{name}</h1>

          {/* Mute Button - Only show when video is present */}
          {videoUrl && (
            <button
              className="event-mute-btn"
              onClick={toggleMute}
              aria-label={isMuted ? "Unmute video" : "Mute video"}
            >
              {isMuted ? "🔇" : "🔊"}
            </button>
          )}
        </div>
      )}

      <section className="event-info">
        <p className="event-info__date">DATA: {formattedDate}</p>
        <p className="event-info__location">
          LOCAL: {location || "Local a definir"}
        </p>
        <p className="event-info__description">{description || ""}</p>
      </section>

      {gallery.length > 0 && (
        <section className="event-gallery">
          <h2 className="event-gallery__title">Galeria</h2>
          <div className="event-gallery__grid">
            {gallery.map((photo, index) => (
              <img
                key={photo}
                src={photo}
                alt={`Foto ${index + 1}`}
                className="event-gallery__img"
                onClick={() => openModal(index)}
                loading="lazy"
              />
            ))}
          </div>
        </section>
      )}

      {modalOpen && (
        <ModalGallery
          photos={gallery}
          index={modalIndex}
          onClose={closeModal}
          onNavigate={navigateModal}
        />
      )}
    </main>
  );
};

export default EventDetails;
