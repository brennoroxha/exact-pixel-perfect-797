import { useEffect, useState } from "react";
import { LocationModal } from "./LocationModal";
import { isLocationFresh, useLocationStore } from "@/stores/location";

type WindowWithLocationModal = Window & {
  floraOpenLocationModal?: () => void;
};

export function LocationGate() {
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const showIfNeeded = () => {
      setHydrated(true);
      const current = useLocationStore.getState().location;
      if (!isLocationFresh(current)) setOpen(true);
    };

    if (useLocationStore.persist.hasHydrated()) {
      showIfNeeded();
      return;
    }

    return useLocationStore.persist.onFinishHydration(showIfNeeded);
  }, []);

  // Allow opening from anywhere via custom event
  useEffect(() => {
    const handler = () => {
      setHydrated(true);
      setOpen(true);
    };
    (window as WindowWithLocationModal).floraOpenLocationModal = handler;
    window.addEventListener("flora:open-location", handler);
    return () => {
      delete (window as WindowWithLocationModal).floraOpenLocationModal;
      window.removeEventListener("flora:open-location", handler);
    };
  }, []);

  if (!hydrated && !open) return null;

  return open ? <LocationModal onClose={() => setOpen(false)} /> : null;
}

export const openLocationModal = () =>
  (window as WindowWithLocationModal).floraOpenLocationModal?.() ??
  window.dispatchEvent(new CustomEvent("flora:open-location"));
