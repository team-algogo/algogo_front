import { create } from "zustand";

export type ToastType = "success" | "error" | "info" | "warning";
export type ToastPosition = "top-center" | "bottom-right";

export interface ToastItem {
  id: string;
  message: string;
  description?: string;
  type: ToastType;
  position?: ToastPosition; // 위치 정보 (기본값: bottom-right)
  cta?: {
    label: string;
    route: string;
    params?: Record<string, any>;
  };
  createdAt: number;
}

interface ToastState {
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, "id" | "createdAt">) => void;
  removeToast: (id: string) => void;
  clearAll: () => void;
}

const MAX_TOASTS = 4;

const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = `${Date.now()}-${Math.random()}`;
    const newToast: ToastItem = {
      ...toast,
      id,
      createdAt: Date.now(),
    };

    set((state) => {
      const newToasts = [...state.toasts, newToast];
      // 최대 개수 초과 시 가장 오래된 것 제거
      if (newToasts.length > MAX_TOASTS) {
        newToasts.shift();
      }
      console.log("[ToastStore] Added toast:", newToast);
      console.log("[ToastStore] Current toasts:", newToasts);
      return { toasts: newToasts };
    });
  },
  removeToast: (id: string) => {
    console.log("[ToastStore] Removing toast:", id);
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },
  clearAll: () => {
    set({ toasts: [] });
  },
}));

export default useToastStore;
