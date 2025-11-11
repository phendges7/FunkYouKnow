import "./RequestSong.css";
import usePageFade from "../../utils/usePageFade.js";
import { useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import Toast from "../../components/Toast/Toast.jsx";

async function submitSongRequest({ title, artist, link }) {
  const { error } = await supabase
    .from("requested_songs")
    .insert([{ title, artist, link }]);
  if (error) throw error;
}

const RequestSong = () => {
  usePageFade();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success",
  });

  const showToast = (message, type = "success") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast({ visible: false, message: "", type }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.target);
    const title = formData.get("songTitle");
    const artist = formData.get("songArtist");
    const link = formData.get("songLink");

    try {
      await submitSongRequest({ title, artist, link });
      showToast("🎵 Song request submitted successfully!");
      e.target.reset();
    } catch (err) {
      console.error("Error submitting song:", err);
      showToast("⚠️ Something went wrong. Try again later.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="request-song">
      <div className="request-song__content">
        <h1 className="request-song__title">REQUEST A SONG</h1>
        <div className="request-song__description">
          <p>Let us know what you want to hear!</p>
          <p>Submit your song request below.</p>
        </div>

        <form className="request-song__form" onSubmit={handleSubmit}>
          <div className="form__group" id="groupTitle">
            <label htmlFor="songTitle" className="form__label">
              SONG TITLE *
            </label>
            <input
              className="form__input"
              type="text"
              id="songTitle"
              name="songTitle"
              placeholder="Enter song title"
              required
            />
          </div>

          <div className="form__group" id="groupArtist">
            <label htmlFor="songArtist" className="form__label">
              ARTIST
            </label>
            <input
              className="form__input"
              type="text"
              id="songArtist"
              name="songArtist"
              placeholder="Enter artist name"
            />
          </div>

          <div className="form__group" id="groupURL">
            <label htmlFor="songLink" className="form__label">
              SONG LINK (URL) *
            </label>
            <input
              className="form__input"
              type="url"
              id="songLink"
              name="songLink"
              placeholder="Paste YouTube, Spotify, or other music link"
              required
            />
          </div>

          <button
            type="submit"
            className="form__submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "SUBMIT REQUEST"}
          </button>
        </form>
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
      />
    </main>
  );
};

export default RequestSong;
