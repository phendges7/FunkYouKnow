import { createContext, useState, useCallback, useRef } from "react";

export const BackgroundVideoContext = createContext(null);

export const BackgroundVideoProvider = ({ children }) => {
  const [videoUrl, setVideoUrl] = useState(null);
  const videoRef = useRef(null);

  // Memoize functions to prevent unnecessary re-renders
  const setBackgroundVideo = useCallback((url) => {
    // Only update if URL actually changed
    setVideoUrl((currentUrl) => (currentUrl === url ? currentUrl : url));
  }, []);

  const clearBackgroundVideo = useCallback(() => {
    setVideoUrl(null);
    // Clean up video element reference
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.removeAttribute("src");
      videoRef.current.load();
      videoRef.current = null;
    }
  }, []);

  const value = {
    videoUrl,
    setBackgroundVideo,
    clearBackgroundVideo,
    videoRef,
  };

  return (
    <BackgroundVideoContext.Provider value={value}>
      {children}
    </BackgroundVideoContext.Provider>
  );
};
