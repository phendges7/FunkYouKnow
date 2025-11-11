import "./SongList.css";
import { useState, useEffect } from "react";
import { supabase } from "../../utils/supabaseClient";
import SongCard from "../SongCard/SongCard";

const SongList = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liking, setLiking] = useState(false);

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const { data, error } = await supabase
        .from("requested_songs")
        .select("*")
        .order("like_count", { ascending: false })
        .limit(15);
      if (error) throw error;
      setSongs(data);
    } catch (err) {
      console.log("Error loading songs: ", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLikeClick = async (id, currentLikes) => {
    if (liking === id) return;
    setLiking(id);

    try {
      const { error } = await supabase
        .from("requested_songs")
        .update({ like_count: currentLikes + 1 })
        .eq("id", id);
      if (error) throw error;

      setSongs((prevSongs) =>
        prevSongs
          .map((song) =>
            song.id === id ? { ...song, like_count: song.like_count + 1 } : song
          )
          .sort((a, b) => b.like_count - a.like_count)
      );
    } catch (err) {
      console.error("Error updating like: ", err);
    } finally {
      setLiking(null);
    }
  };

  return (
    <div className="song-list">
      <div className="song-list__header">
        <h1 className="song-list__title">Most Requested Songs</h1>
        <div className="equalizer">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <div className="song-list__container">
        {songs.length === 0 ? (
          <p>No songs requested yet.</p>
        ) : (
          songs
            .slice(0, 15)
            .map((song, index) => (
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
