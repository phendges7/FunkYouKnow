import { useCallback, useEffect, useState } from "react";
import SongDetails from "../../../songs/components/SongDetails/SongDetails";
import {
  clearRequestedSongLikes,
  fetchRequestedSongs,
  softDeleteRequestedSong,
} from "../../../songs/services/songsService";
import "./RequestedSongs.css";

const RequestedSongs = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [clearing, setClearing] = useState(false);
  const [removingId, setRemovingId] = useState(null);

  const loadRequestedSongs = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchRequestedSongs({
        orderBy: "like_count",
        ascending: false,
      });
      setSongs(data);
    } catch (err) {
      console.error("Error fetching requested songs:", err);
      setError("Could not load the requested songs.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRequestedSongs();
  }, [loadRequestedSongs]);

  const hasLikes = songs.some((song) => (song.like_count || 0) > 0);

  const handleClearLikes = async () => {
    const confirmed = window.confirm(
      "Clear likes for all requested songs?"
    );
    if (!confirmed) return;

    setClearing(true);
    setError(null);

    try {
      await clearRequestedSongLikes();
      await loadRequestedSongs();
    } catch (err) {
      console.error("Error clearing song likes:", err);
      setError("Could not clear likes for the requested songs.");
    } finally {
      setClearing(false);
    }
  };

  const handleRemoveSong = async (song) => {
    const title = song?.title || "this song";
    const confirmed = window.confirm(`Remove ${title}?`);
    if (!confirmed) return;

    setRemovingId(song.id);
    setError(null);

    try {
      await softDeleteRequestedSong(song.id);
      await loadRequestedSongs();
    } catch (err) {
      console.error("Error removing requested song:", err);
      setError("Could not remove the song.");
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <section className="requested-songs">
      <header className="requested-songs__header">
        <div className="requested-songs__title-wrapper">
          <h1 className="requested-songs__title">Requested Songs</h1>
          <p className="requested-songs__subtitle">
            See every song requested by the audience and use this to build
            heavier and heavier sets.
          </p>
        </div>

        <div className="requested-songs__meta">
          <span className="requested-songs__badge">
            {songs.length} {songs.length === 1 ? "request" : "requests"}
          </span>
          <button
            type="button"
            className="requested-songs__clear"
            onClick={handleClearLikes}
            disabled={loading || clearing || !hasLikes}
          >
            {clearing ? "Clearing..." : "Clear likes"}
          </button>
        </div>
      </header>

      {loading && (
        <div className="requested-songs__state requested-songs__state--loading">
          <div className="requested-songs__loader" />
          <p className="requested-songs__state-text">
            Loading requested songs...
          </p>
        </div>
      )}

      {error && !loading && (
        <div className="requested-songs__state requested-songs__state--error">
          <p className="requested-songs__state-text">{error}</p>
        </div>
      )}

      {!loading && !error && songs.length === 0 && (
        <div className="requested-songs__state requested-songs__state--empty">
          <p className="requested-songs__state-text">
            No songs have been requested yet.
          </p>
          <p className="requested-songs__state-hint">
            As soon as people start spamming requests, everything will show up
            here.
          </p>
        </div>
      )}

      {!loading && !error && songs.length > 0 && (
        <div className="requested-songs__grid">
          {songs.map((song) => (
            <SongDetails
              key={song.id}
              song={song}
              onRemove={() => handleRemoveSong(song)}
              removing={removingId === song.id}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default RequestedSongs;
