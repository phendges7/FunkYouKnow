/**
 * Fetches event by slug and its media (cover + gallery) from event_media.
 */

import { useEffect, useState } from "react";
import { eventsService } from "../services/eventsService";
import { eventMediaService } from "../services/eventMediaService";

export default function useFetchEventDetails(slug) {
  const [event, setEvent] = useState(null);
  const [media, setMedia] = useState({ cover: null, gallery: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const data = await eventsService.getEventBySlug(slug);
        setEvent(data);

        if (data?.id) {
          const [coverItems, galleryItems] = await Promise.all([
            eventMediaService.getByEvent(data.id, "cover"),
            eventMediaService.getByEvent(data.id, "gallery"),
          ]);

          setMedia({
            cover: coverItems && coverItems[0] ? coverItems[0] : null,
            gallery: galleryItems || [],
          });
        }
      } catch (err) {
        console.error("Erro ao carregar evento:", err.message);
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [slug]);

  return { event, media, loading };
}
