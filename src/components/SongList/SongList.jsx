import "./SongList.css";
import { useState, useEffect } from "react";
import { supabase } from "../../utils/supabaseClient";

const SongList = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const { data, error } = await supabase
        .from("requested_songs")
        .select("*")
        .order("like_count", { ascending: false });
      if (error) throw error;
      console.log(data);
      setSongs(data);
    } catch (err) {
      console.log("Error loading songs: ", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="song-list">
      <h1 className="song-list__title">🔥 Most Requested Songs</h1>
      <ul className="song-list__list">
        {songs.length === 0 ? (
          <li>No songs requested yet.</li>
        ) : (
          songs.map((song, index) => (
            <li key={song.id} className="song-list__item">
              <span className="song-list__rank">#{index + 1}</span>
              <span className="song-list__name">{song.title}</span>
              <span className="song-list__likes"> ❤️ {song.like_count} </span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};
export default SongList;
