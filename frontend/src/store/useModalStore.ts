import { create } from "zustand";

type ModalType = "popup" | "alert" | null;

interface ModalStore {
  modalType: ModalType;
  openModal: (type: ModalType) => void;
  closeModal: () => void;
  isOpen: (type: ModalType) => boolean;
}

export const useModalStore = create<ModalStore>((set, get) => ({
  modalType: null,
  openModal: (type) => set({ modalType: type }),
  closeModal: () => set({ modalType: null }),
  isOpen: (type) => get().modalType === type,
}));
