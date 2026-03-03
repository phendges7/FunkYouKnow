import { useCallback, useState } from "react";

const useModalGallery = (totalItems) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);

  const openModal = useCallback((index) => {
    setModalIndex(index);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => setModalOpen(false), []);

  const navigateModal = useCallback(
    (direction) => {
      setModalIndex((prev) => {
        if (!totalItems) return prev;
        return (prev + direction + totalItems) % totalItems;
      });
    },
    [totalItems],
  );

  return {
    modalOpen,
    modalIndex,
    openModal,
    closeModal,
    navigateModal,
  };
};

export default useModalGallery;
