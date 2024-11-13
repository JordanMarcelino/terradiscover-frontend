import { StateCreator } from "zustand";

export interface ContactSlice {
    refetch: boolean;
    toggleRefetch: () => void;
}

export const createContactSlice: StateCreator<ContactSlice, [], [], ContactSlice> = (set) => ({
    refetch: false,
    toggleRefetch: () => set((state) => ({ refetch: !state.refetch })),
});
