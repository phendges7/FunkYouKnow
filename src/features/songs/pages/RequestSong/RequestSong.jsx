import "./RequestSong.css";
import usePageFade from "../../../../hooks/usePageFade.js";
import useSubmitSongRequest from "../../hooks/useSubmitSongRequest.js";

const RequestSong = () => {
  usePageFade();
  const { isSubmitting, handleSubmit } = useSubmitSongRequest();

  return (
    <main className="request-song">
      <div className="request-song__container">
        <header className="request-song__header">
          <h1 className="request-song__title">REQUEST A SONG</h1>
          <p className="request-song__subtitle">
            Help shape the night — your picks can end up in the set.
          </p>
        </header>

        <div className="request-song__grid">
          {/* LEFT COLUMN */}
          <section
            className="request-song__info"
            aria-label="About song requests"
          >
            <h2 className="request-song__info-title">Why request a song?</h2>

            <p className="request-song__info-text">
              This page is your direct line to the vibe. Drop the tracks you
              want to hear and we’ll use it to guide the set — especially the
              songs that keep showing up.
            </p>

            <ul className="request-song__info-list">
              <li className="request-song__info-item">
                <span className="request-song__info-bullet" />
                Make the party feel more like <strong>your</strong> party.
              </li>
              <li className="request-song__info-item">
                <span className="request-song__info-bullet" />
                Help the DJ spot what people actually want — not just what’s
                trending.
              </li>
              <li className="request-song__info-item">
                <span className="request-song__info-bullet" />
                Share a link (Spotify/YouTube) so there’s no confusion.
              </li>
            </ul>

            <div className="request-song__info-note">
              <p className="request-song__info-note-title">Pro tip</p>
              <p className="request-song__info-note-text">
                If it’s a niche remix or a specific version, paste the exact
                link. Saves everyone’s time — and don't forget to get back to
                main page and like your favorite songs.
              </p>
            </div>
          </section>

          {/* RIGHT COLUMN */}
          <section
            className="request-song__panel"
            aria-label="Song request form"
          >
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
          </section>
        </div>
      </div>
    </main>
  );
};

export default RequestSong;
