import { useCallback, useState } from "react";
import useToast from "../../../hooks/useToast"; // ajuste o path conforme seu projeto
import { createRequestedSong } from "../services/songsService";

export default function useSubmitSongRequest() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setIsSubmitting(true);

      const formData = new FormData(e.target);
      const title = formData.get("songTitle");
      const artist = formData.get("songArtist");
      const link = formData.get("songLink");

      try {
        await createRequestedSong({ title, artist, link });

        showToast("🎵 Song request submitted successfully!", "success", 2500);
        e.target.reset();
      } catch (err) {
        console.error("Error submitting song:", err);
        showToast("⚠️ Something went wrong. Try again later.", "error", 3000);
      } finally {
        setIsSubmitting(false);
      }
    },
    [showToast],
  );

  return { isSubmitting, handleSubmit };
}
