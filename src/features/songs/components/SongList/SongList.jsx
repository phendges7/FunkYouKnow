// src/features/songs/components/SongList/SongList.jsx
import "./SongList.css";
import { useState, useEffect } from "react";
import SongCard from "../SongCard/SongCard";
import {
  fetchRequestedSongs,
  updateRequestedSongLikes,
} from "../../services/songsService";

const SongList = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liking, setLiking] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const cleanTerm = searchTerm.trim();
    const handle = setTimeout(() => {
      loadSongs(cleanTerm);
    }, 300);

    return () => clearTimeout(handle);
  }, [searchTerm]);

  const loadSongs = async (term = "") => {
    setLoading(true);
    try {
      const data = await fetchRequestedSongs({
        orderBy: "like_count",
        ascending: false,
        limit: term ? 50 : 15,
        searchTerm: term,
      });
      setSongs(data);
    } catch (err) {
      console.log("Error loading songs: ", err);
      // se quiser, depois pluga o Toast global aqui
    } finally {
      setLoading(false);
    }
  };

  const handleLikeClick = async (id, currentLikes) => {
    if (liking === id) return;
    setLiking(id);

    try {
      const newLikeCount = currentLikes + 1;

      // Atualiza no banco via service
      await updateRequestedSongLikes(id, newLikeCount);

      // Atualiza estado local + mantém ordenado por like_count desc
      setSongs((prevSongs) =>
        prevSongs
          .map((song) =>
            song.id === id
              ? { ...song, like_count: song.like_count + 1 }
              : song,
          )
          .sort((a, b) => b.like_count - a.like_count),
      );
    } catch (err) {
      console.error("Error updating like: ", err);
      // aqui também dá pra plugar Toast de erro
    } finally {
      setLiking(null);
    }
  };

  return (
    <div className="song-list">
      <div className="song-list__header">
        <h1 className="song-list__title">Requested songs for next party</h1>
        <div className="equalizer">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <div className="song-list__search">
        <label className="song-list__search-label" htmlFor="songSearch">
          Search requested songs
        </label>
        <input
          id="songSearch"
          className="song-list__search-input"
          type="search"
          placeholder="Search by song or artist"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </div>

      <div className="song-list__container">
        {loading ? (
          <p>Loading songs...</p>
        ) : songs.length === 0 ? (
          <p>
            {searchTerm.trim()
              ? "No requested songs match your search."
              : "No songs requested yet."}
          </p>
        ) : (
          songs.map((song, index) => (
            <SongCard
              key={song.id}
              id={song.id}
              rank={index + 1}
              title={song.title}
              artist={song.artist}
              likes={song.like_count}
              onLike={handleLikeClick}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default SongList;
