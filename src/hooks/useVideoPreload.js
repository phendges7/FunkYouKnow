import { useEffect, useState } from "react";

export const useVideoPreload = (videoUrl) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!videoUrl) {
      setIsLoaded(false);
      return;
    }

    const video = document.createElement("video");
    video.src = videoUrl;
    video.preload = "auto";

    const handleLoaded = () => {
      setIsLoaded(true);
    };

    video.addEventListener("loadeddata", handleLoaded);
    video.addEventListener("error", () => {
      console.error("Failed to preload video:", videoUrl);
      setIsLoaded(false);
    });

    // Start preloading
    video.load();

    return () => {
      video.removeEventListener("loadeddata", handleLoaded);
      // Clean up the video element
      video.src = "";
    };
  }, [videoUrl]);

  return isLoaded;
};
