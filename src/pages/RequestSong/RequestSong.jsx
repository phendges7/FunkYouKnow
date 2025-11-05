import "./RequestSong.css";

import { supabase } from "../../utils/supabaseClient";
import { useState } from "react";

const RequestSong = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("Submitting your request...");

    const formData = new FormData(e.target);
    const songTitle = formData.get("songTitle");
    const songLink = formData.get("songLink");

    try {
      const { data, error } = await supabase.from("requested_songs").insert([
        {
          song_name: songTitle,
          song_link: songLink,
        },
      ]);

      if (error) throw error;

      setMessage("🎵 Song request submitted successfully!");
      e.target.reset();
    } catch (err) {
      console.error("Error submitting song:", err);
      setMessage("⚠️ Something went wrong. Try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="request-song">
      <div className="request-song__content">
        <h1 className="request-song__title">REQUEST A SONG</h1>
        <div className="request-song__description">
          <p>Let us know what you want to hear!</p>
          <p>Submit your song request below.</p>
        </div>
        <form className="request-song__form" onSubmit={handleSubmit}>
          <div className="form__group" id="groupTitle">
            <label htmlFor="songTitle" className="form__label">
              SONG NAME *
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
          <div className="form__group" id="groupURL">
            <label htmlFor="songLink" className="form__label">
              SONG LINK (URL)*
            </label>
            <input
              className="form__input"
              type="URL"
              id="songLink"
              name="songLink"
              placeholder="Paste YOUTUBE, SPOTIFY, or other music link"
              required
            ></input>
          </div>
          <button
            type="submit"
            className="form__submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "SUBMIT REQUEST"}
          </button>
          {message && <p className="form__message">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default RequestSong;
