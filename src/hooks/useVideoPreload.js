import { useEffect, useRef, useState } from "react";

export const useVideoPreload = (videoUrl) => {
  const [loaded, setLoaded] = useState(false);
  const preloadRef = useRef(null);

  useEffect(() => {
    setLoaded(false);

    // Cleanup any previous preloader
    if (preloadRef.current) {
      try {
        preloadRef.current.pause();
        preloadRef.current.removeAttribute("src");
        preloadRef.current.load();
      } catch {
        // ignore
      }
      preloadRef.current = null;
    }

    if (!videoUrl) return;

    const video = document.createElement("video");
    preloadRef.current = video;

    video.muted = false;
    video.playsInline = true;
    video.preload = "auto";
    video.src = videoUrl;

    // Consider it "loaded" once the browser has enough data to start playback
    const onCanPlay = () => setLoaded(true);

    // IMPORTANT: navigation cancels are normal; don't log as errors
    const onError = () => {
      // stay false; no console error spam
      setLoaded(false);
    };

    video.addEventListener("canplaythrough", onCanPlay, { once: true });
    video.addEventListener("error", onError);

    // Kick the request
    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {
        // autoplay restrictions / cancellation — normal, ignore
      });
    }

    return () => {
      video.removeEventListener("canplaythrough", onCanPlay);
      video.removeEventListener("error", onError);

      try {
        video.pause();
        video.removeAttribute("src");
        video.load();
      } catch {
        // ignore
      }

      if (preloadRef.current === video) preloadRef.current = null;
    };
  }, [videoUrl]);

  return loaded;
};
