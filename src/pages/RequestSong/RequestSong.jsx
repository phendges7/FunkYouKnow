import "./RequestSong.css";

const RequestSong = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const songTitle = formData.get("songTitle");
    const songUrl = formData.get("songUrl");
    console.log("Requested song:", songTitle);
    console.log("Song URL:", songUrl);
    e.target.reset();
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
          <button type="submit" className="form__submit">
            SUBMIT REQUEST
          </button>
        </form>
      </div>
    </div>
  );
};

export default RequestSong;
