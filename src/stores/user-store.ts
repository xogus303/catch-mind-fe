import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserState = {
  userId: string | null;
  userName: string | null;
  hasHydrated: boolean;
};
export type UserActions = {
  setUserId: (id: string) => void;
  setUserName: (name: string) => void;
  setHasHydrated: () => void;
};
export type UserStore = UserState & UserActions;
export const initUserStore = (): UserState => {
  return {
    userId: "",
    userName: "",
    hasHydrated: false,
  };
};
export const defaultInitState: UserState = {
  userId: null,
  userName: null,
  hasHydrated: false,
};
export const createUserStore = (initState: UserState = defaultInitState) => {
  return create<UserStore>()(
    persist(
      (set) => ({
        ...initState,
        setUserId: (id: string) => set(() => ({ userId: id })),
        setUserName: (name: string) => set(() => ({ userName: name })),
        setHasHydrated: () => set(() => ({ hasHydrated: true })),
      }),
      {
        name: "user-storage",
        onRehydrateStorage: () => (state) => {
          state?.setHasHydrated();
        },
      }
    )
  );
};
