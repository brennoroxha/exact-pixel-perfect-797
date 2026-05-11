import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SavedLocation = {
  state: string;
  city: string;
  citySlug: string;
  deliveryFee: number;
  freeShippingMin: number;
  deliveryTimeMin: number;
  deliveryTimeMax: number;
  savedAt: number;
};

type LocationState = {
  location: SavedLocation | null;
  setLocation: (l: SavedLocation) => void;
  clear: () => void;
};

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      location: null,
      setLocation: (location) => set({ location }),
      clear: () => set({ location: null }),
    }),
    { name: "flora-luxe-location", version: 2 },
  ),
);

export const isLocationFresh = (l: SavedLocation | null) =>
  !!l && Date.now() - l.savedAt < 30 * 24 * 60 * 60 * 1000;
