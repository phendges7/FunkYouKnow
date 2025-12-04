/**
 * Controls gallery modal navigation: open, close, next, previous.
 */

import { useState } from "react";

export default function useModalNavigation(photos) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);

  const openModal = (index) => {
    setModalIndex(index);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const navigateModal = (direction) => {
    setModalIndex((prev) => {
      const next = prev + direction;
      if (next < 0) return photos.length - 1;
      if (next >= photos.length) return 0;
      return next;
    });
  };

  return { modalOpen, modalIndex, openModal, closeModal, navigateModal };
}
