import { useEffect, useState } from "react";

/**
 * Cover selection + preview only.
 * NO Supabase calls here. Upload happens inside useEventSubmit.
 */
const useCoverUpload = (setForm) => {
  const [coverFile, setCoverFile] = useState(null);
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

  const handleCoverSelect = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("O arquivo precisa ser uma imagem.");
      return;
    }

    setError(null);
    setCoverFile(file);

    // Replace previous preview (revoke if blob)
    setPreviewUrl((prev) => {
      if (prev && prev.startsWith("blob:")) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });

    // update form preview only (not persisted)
    if (typeof setForm === "function") {
      setForm((prev) => ({
        ...prev,
        thumbnail_url: URL.createObjectURL(file),
      }));
    }
  };

  const clearCover = () => {
    setCoverFile(null);
    setPreviewUrl((prev) => {
      if (prev && prev.startsWith("blob:")) URL.revokeObjectURL(prev);
      return null;
    });
    setError(null);
  };

  return {
    coverFile,
    coverPreviewUrl: previewUrl,
    handleCoverSelect,
    clearCover,
    error,
  };
};

export default useCoverUpload;
