import { create } from "zustand";
import { persist } from "zustand/middleware";

import type UserType from "@type/auth/UserType";

interface AuthState {
  userType: UserType;
  authorization: string;
  setUserType: (type: UserType) => void;
  setAuthorization: (token: string) => void;
}

const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      userType: null,
      authorization: "",
      setUserType: (type) => set({ userType: type }),
      setAuthorization: (token) => set({ authorization: token }),
    }),
    {
      name: "auth-storage",
    }
  )
);

export default useAuthStore;
