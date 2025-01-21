import { TUserType } from "@/types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type UserState = {
  userId: string | null;
  userName: string | null;
  userType: TUserType | null;
  hasHydrated: boolean;
};
export type UserActions = {
  setUserId: (id: string) => void;
  setUserName: (name: string) => void;
  setUserType: (type: TUserType | null) => void;
  setHasHydrated: () => void;
};
export type UserStore = UserState & UserActions;
export const initUserStore = (): UserState => {
  return {
    userId: null,
    userName: null,
    userType: null,
    hasHydrated: false,
  };
};
export const defaultInitState: UserState = {
  userId: null,
  userName: null,
  userType: null,
  hasHydrated: false,
};
export const createUserStore = (initState: UserState = defaultInitState) => {
  return create<UserStore>()(
    persist(
      (set) => ({
        ...initState,
        setUserId: (id: string) => set(() => ({ userId: id })),
        setUserName: (name: string) => set(() => ({ userName: name })),
        setUserType: (type: TUserType | null) =>
          set(() => ({ userType: type })),
        setHasHydrated: () => set(() => ({ hasHydrated: true })),
      }),
      {
        name: "user-storage",
        storage: createJSONStorage(() => sessionStorage),
        onRehydrateStorage: () => (state) => {
          state?.setHasHydrated();
        },
      }
    )
  );
};
