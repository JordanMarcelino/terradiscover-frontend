import { create } from "zustand";
import { ContactSlice, createContactSlice } from "./contact-slice";

type store = ContactSlice;

export const useStore = create<store>()((...a) => ({
    ...createContactSlice(...a),
}));
