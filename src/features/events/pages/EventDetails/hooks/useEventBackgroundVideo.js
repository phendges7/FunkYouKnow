import { useCallback, useEffect, useState } from "react";
import { useBackgroundVideo } from "../../../../../hooks/useBackgroundVideo";

const useEventBackgroundVideo = ({ eventExists, backgroundVideoUrl }) => {
  const { videoUrl, setBackgroundVideo, clearBackgroundVideo, videoRef } =
    useBackgroundVideo();

  const [isMuted, setIsMuted] = useState(false);

  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;

    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  }, [videoRef]);

  useEffect(() => {
    if (!eventExists) {
      clearBackgroundVideo();
      return;
    }

    if (backgroundVideoUrl) {
      setBackgroundVideo(backgroundVideoUrl);

      if (videoRef.current) {
        videoRef.current.muted = false; // start unmuted
        setIsMuted(false);
      }
    } else {
      clearBackgroundVideo();
    }
  }, [
    eventExists,
    backgroundVideoUrl,
    setBackgroundVideo,
    clearBackgroundVideo,
    videoRef,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearBackgroundVideo();
    };
  }, [clearBackgroundVideo]);

  return { videoUrl, isMuted, toggleMute };
};

export default useEventBackgroundVideo;
