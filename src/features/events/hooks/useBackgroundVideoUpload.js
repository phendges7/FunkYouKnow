import { useEffect, useState } from "react";

/**
 * Background video selection + preview only.
 * NO Supabase calls here. Upload happens inside useEventSubmit.
 */
const useBackgroundVideoUpload = (setForm) => {
  const [backgroundVideoFile, setBackgroundVideoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState(null);

  // Cleanup object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleBackgroundVideoSelect = (file) => {
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      setError("O arquivo precisa ser um video.");
      return;
    }

    setError(null);
    setBackgroundVideoFile(file);

    const objectUrl = URL.createObjectURL(file);

    // Replace previous preview (revoke if blob)
    setPreviewUrl((prev) => {
      if (prev && prev.startsWith("blob:")) URL.revokeObjectURL(prev);
      return objectUrl;
    });

    // update form preview only (not persisted)
    if (typeof setForm === "function") {
      setForm((prev) => ({
        ...prev,
        background_video_url: objectUrl,
      }));
    }
  };

  const clearBackgroundVideo = () => {
    setBackgroundVideoFile(null);
    setPreviewUrl((prev) => {
      if (prev && prev.startsWith("blob:")) URL.revokeObjectURL(prev);
      return null;
    });
    setError(null);
  };

  return {
    backgroundVideoFile,
    backgroundVideoPreviewUrl: previewUrl,
    handleBackgroundVideoSelect,
    clearBackgroundVideo,
    error,
  };
};

export default useBackgroundVideoUpload;
