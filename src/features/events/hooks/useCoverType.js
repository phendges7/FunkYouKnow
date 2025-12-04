/**
 * Detects whether a cover URL refers to an image or a video file.
 */

export default function useCoverType(url) {
  if (!url) return "image";

  const isVideo = /\.(mp4|mov|avi|webm|ogg)$/i.test(url);
  return isVideo ? "video" : "image";
}
