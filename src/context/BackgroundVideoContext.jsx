import { createContext, useContext } from "react";

export const BackgroundVideoContext = createContext({
  videoUrl: null,
  setBackgroundVideo: () => {},
  clearBackgroundVideo: () => {},
  videoRef: null,
});

export const useBackgroundVideo = () => useContext(BackgroundVideoContext);
