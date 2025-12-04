/**
 * Handles uploading of event cover (image or video) to Supabase Storage.
 */

import { supabase } from "../../../utils/supabaseClient";

const useCoverUpload = (form, setForm, setUploading, setError) => {
  const handleCoverUpload = async (e) => {
    try {
      setUploading?.(true);
      const file = e.target.files[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        setError?.("Thumbnail precisa ser uma imagem.");
        return;
      }

      const ext = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}.${ext}`;

      const filePath = `thumbnails/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("events")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("events").getPublicUrl(filePath);

      setForm((prev) => ({ ...prev, thumbnail_url: publicUrl }));
    } catch (err) {
      console.error(err.message);
      setError?.("Failed uploading thumbnail.");
      alert("Failed uploading thumbnail.");
    } finally {
      setUploading?.(false);
    }
  };

  return { handleCoverUpload };
};

export default useCoverUpload;
