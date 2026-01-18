import { create } from "zustand";

export type ToastType = "success" | "error" | "info" | "warning";

interface ToastState {
  message: string;
  type: ToastType;
  isVisible: boolean;
  showToast: (message: string, type?: ToastType) => void;
  hideToast: () => void;
}

const useToastStore = create<ToastState>((set) => ({
  message: "",
  type: "success",
  isVisible: false,
  showToast: (message, type = "success") => {
    set({ message, type, isVisible: true });
  },
  hideToast: () => {
    set({ isVisible: false });
  },
}));

export default useToastStore;
