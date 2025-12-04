import { useContext } from "react";
import { BackgroundVideoContext } from "../context/BackgroundVideoContext";

export const useBackgroundVideo = () => {
  const context = useContext(BackgroundVideoContext);

  if (!context) {
    throw new Error(
      "useBackgroundVideo must be used within a BackgroundVideoProvider"
    );
  }

  return context;
};
