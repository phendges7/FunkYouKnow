import { useEffect, useMemo, useRef, useState } from "react";
import { eventMediaService } from "../../../services/eventMediaService";

const useEventGalleryLazy = (eventId) => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [galleryStatus, setGalleryStatus] = useState("idle"); // idle | loading | loaded | error
  const [shouldLoad, setShouldLoad] = useState(false);

  const sentinelRef = useRef(null);
  const statusRef = useRef("idle");

  // Keep ref synced to prevent race conditions
  useEffect(() => {
    statusRef.current = galleryStatus;
  }, [galleryStatus]);

  // Reset when event changes
  useEffect(() => {
    setGalleryItems([]);
    setGalleryStatus("idle");
    setShouldLoad(false);
  }, [eventId]);

  // IntersectionObserver: trigger load near viewport
  useEffect(() => {
    if (!eventId) return;
    if (shouldLoad) return;
    if (!sentinelRef.current) return;

    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setShouldLoad(true);
      return;
    }

    const el = sentinelRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      {
        root: null,
        rootMargin: "300px 0px",
        threshold: 0.01,
      },
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [eventId, shouldLoad]);

  // Fetch only after trigger
  useEffect(() => {
    if (!eventId) return;
    if (!shouldLoad) return;

    if (statusRef.current === "loading" || statusRef.current === "loaded") {
      return;
    }

    let cancelled = false;

    setGalleryStatus("loading");

    eventMediaService
      .getGalleryByEvent(eventId)
      .then((media) => {
        if (cancelled) return;

        setGalleryItems(
          media.map((m) => ({
            full: m.public_url,
            thumb: m.thumb_url || m.public_url,
            alt: m.alt || "",
          })),
        );

        setGalleryStatus("loaded");
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Failed to load gallery:", err?.message);
        setGalleryItems([]);
        setGalleryStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [eventId, shouldLoad]);

  const modalPhotos = useMemo(
    () => galleryItems.map((g) => g.full),
    [galleryItems],
  );

  const shouldRenderGallery = shouldLoad || galleryStatus !== "idle";

  return {
    galleryItems,
    galleryStatus,
    shouldRenderGallery,
    sentinelRef,
    modalPhotos,
  };
};

export default useEventGalleryLazy;
