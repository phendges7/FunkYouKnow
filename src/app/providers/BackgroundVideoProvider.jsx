// src/app/providers/BackgroundVideoProvider.jsx
import { useState, useCallback, useRef } from "react";
import { BackgroundVideoContext } from "../../context/BackgroundVideoContext";

export const BackgroundVideoProvider = ({ children }) => {
  const [videoUrl, setVideoUrl] = useState(null);
  const videoRef = useRef(null);

  const setBackgroundVideo = useCallback((url) => {
    setVideoUrl((currentUrl) => (currentUrl === url ? currentUrl : url));
  }, []);

  const clearBackgroundVideo = useCallback(() => {
    setVideoUrl(null);

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.removeAttribute("src");
      videoRef.current.load();
      videoRef.current = null;
    }
  }, []);

  return (
    <BackgroundVideoContext.Provider
      value={{
        videoUrl,
        setBackgroundVideo,
        clearBackgroundVideo,
        videoRef,
      }}
    >
      {children}
    </BackgroundVideoContext.Provider>
  );
};
