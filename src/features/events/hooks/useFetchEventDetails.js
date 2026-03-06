/**
 * Fetches event by slug and its media (cover + gallery) from event_media.
 */

import { useEffect, useState } from "react";
import { eventMediaService } from "../services/eventMediaService";
import { useEventBySlug } from "../../../hooks/queries/useEventBySlug";

export default function useFetchEventDetails(slug) {
  const [media, setMedia] = useState({ cover: null, gallery: [] });
  const { data: event, isLoading } = useEventBySlug(slug);

  useEffect(() => {
    if (!event?.id) {
      setMedia({ cover: null, gallery: [] });
      return;
    }

    const loadMedia = async () => {
      try {
        const [coverItems, galleryItems] = await Promise.all([
          eventMediaService.getByEvent(event.id, "cover"),
          eventMediaService.getByEvent(event.id, "gallery"),
        ]);

        setMedia({
          cover: coverItems && coverItems[0] ? coverItems[0] : null,
          gallery: galleryItems || [],
        });
      } catch (err) {
        console.error("Erro ao carregar evento:", err.message);
        setMedia({ cover: null, gallery: [] });
      }
    };

    loadMedia();
  }, [event]);

  return { event, media, loading: isLoading };
}
