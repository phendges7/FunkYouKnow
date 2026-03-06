import { useEffect, useMemo, useRef, useState } from "react";
import { useBackgroundVideo } from "../../../hooks/useBackgroundVideo";
import "./GlobalBackgroundVideo.css";

const LOAD_DELAY_MS = 600;
const MAX_RETRIES = 2;
const RETRY_BASE_DELAY_MS = 800;

const GlobalBackgroundVideo = () => {
  const { videoUrl, videoRef } = useBackgroundVideo();

  const [delayedUrl, setDelayedUrl] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const retryTimerRef = useRef(null);

  // 1) Delay assigning the URL so we don't instantly thrash preload on route changes
  useEffect(() => {
    if (!videoUrl) {
      setDelayedUrl(null);
      setRetryCount(0);
      setIsVideoLoaded(false);
      return;
    }

    const t = setTimeout(() => {
      setDelayedUrl(videoUrl);
      setRetryCount(0);
      setIsVideoLoaded(false);
    }, LOAD_DELAY_MS);

    return () => clearTimeout(t);
  }, [videoUrl]);

  // 2) Cache-bust on retries
  const effectiveUrl = useMemo(() => {
    if (!delayedUrl) return null;
    if (retryCount === 0) return delayedUrl;

    const u = new URL(delayedUrl, window.location.origin);
    u.searchParams.set("retry", String(retryCount));
    u.searchParams.set("t", String(Date.now()));
    return u.toString();
  }, [delayedUrl, retryCount]);

  useEffect(() => {
    if (!effectiveUrl) {
      setIsVideoLoaded(false);
    }
  }, [effectiveUrl]);

  // 4) HARD STOP when URL clears / changes (prevents dangling requests on navigation)
  useEffect(() => {
    const el = videoRef?.current;
    if (!el) return;

    if (!effectiveUrl) {
      el.pause();
      el.removeAttribute("src");
      el.load();
    }
  }, [effectiveUrl, videoRef]);

  useEffect(() => {
    return () => {
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
      }
    };
  }, []);

  const handleError = () => {
    if (retryCount < MAX_RETRIES) {
      const backoff = RETRY_BASE_DELAY_MS * (retryCount + 1);
      retryTimerRef.current = setTimeout(() => {
        setRetryCount((c) => c + 1);
      }, backoff);
      return;
    }
    // keep this if you want, but don't spam errors for expected cancels
    console.warn("Background video failed after retries:", videoUrl);
  };

  // ✅ Conditional render happens AFTER all hooks
  if (!videoUrl) return null;

  return (
    <div className="global-bg-video-wrapper" aria-hidden>
      <video
        ref={videoRef}
        className={`global-bg-video ${
          isVideoLoaded ? "global-bg-video--visible" : "global-bg-video--hidden"
        }`}
        src={effectiveUrl || undefined}
        autoPlay
        playsInline
        loop
        muted
        preload="metadata"
        onLoadStart={() => setIsVideoLoaded(false)}
        onLoadedData={() => setIsVideoLoaded(true)}
        onError={handleError}
      />
      <div className="global-bg-overlay" />
    </div>
  );
};

export default GlobalBackgroundVideo;
