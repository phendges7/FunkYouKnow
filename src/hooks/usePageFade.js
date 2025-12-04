import { useEffect } from "react";

export default function usePageFade() {
  useEffect(() => {
    const hasVisited = sessionStorage.getItem("fyk_visited");

    const isFirstVisit = !hasVisited;
    const target = isFirstVisit
      ? document.body
      : document.querySelector("main");

    if (!target) return;

    target.classList.add("fade-enter");

    const timeout = setTimeout(() => {
      target.classList.add("fade-enter-active");
    }, 50);

    if (isFirstVisit) {
      sessionStorage.setItem("fyk_visited", "true");
    }

    return () => {
      clearTimeout(timeout);
      target.classList.remove("fade-enter", "fade-enter-active");
    };
  }, []);
}
