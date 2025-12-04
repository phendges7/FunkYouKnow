import { useBackgroundVideo } from "../../../hooks/useBackgroundVideo";
import { useVideoPreload } from "../../../hooks/useVideoPreload";
import "./GlobalBackgroundVideo.css";

const GlobalBackgroundVideo = () => {
  const { videoUrl, videoRef } = useBackgroundVideo();

  // Preload video for better performance and wait for readiness
  const isVideoLoaded = useVideoPreload(videoUrl);

  if (!videoUrl) return null;

  return (
    <div className="global-bg-video-wrapper" aria-hidden>
      <video
        ref={videoRef}
        className={`global-bg-video ${
          isVideoLoaded ? "global-bg-video--visible" : "global-bg-video--hidden"
        }`}
        src={videoUrl}
        autoPlay
        playsInline
        muted
        loop
        preload="auto"
        onError={(e) => {
          console.error("Background video failed to load:", videoUrl);
          e.target.style.display = "none";
        }}
      />
      <div className="global-bg-overlay" />
    </div>
  );
};

export default GlobalBackgroundVideo;
