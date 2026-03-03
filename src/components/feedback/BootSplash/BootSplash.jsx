import { createPortal } from "react-dom";
import "./BootSplash.css";

export default function BootSplash({ isExiting = false }) {
  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className={`boot-splash ${isExiting ? "boot-splash--exit" : ""}`}
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className="boot-splash__content">
        <img
          className="boot-splash__logo"
          src="/assets/NoBGLogo.png"
          alt="FUNK YOU KNOW logo"
          width="1024"
          height="1024"
          decoding="async"
          loading="eager"
        />
        <div className="boot-splash__spinner" aria-hidden="true" />
        <p className="boot-splash__text">Loading the vibe…</p>
      </div>
    </div>,
    document.body
  );
}
