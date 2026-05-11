import { useEffect, useState } from "react";
import { LocationModal } from "./LocationModal";
import { isLocationFresh, useLocationStore } from "@/stores/location";

type WindowWithLocationModal = Window & {
  floraOpenLocationModal?: () => void;
};

const OPEN_LOCATION_EVENT = "flora:open-location";

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
    window.addEventListener(OPEN_LOCATION_EVENT, handler);
    window.dispatchEvent(new CustomEvent("flora:location-gate-ready"));
    return () => {
      delete (window as WindowWithLocationModal).floraOpenLocationModal;
      window.removeEventListener(OPEN_LOCATION_EVENT, handler);
    };
  }, []);

  if (!hydrated && !open) return null;

  return open ? <LocationModal onClose={() => setOpen(false)} /> : null;
}

export const openLocationModal = () => {
  if (typeof window === "undefined") return;
  const open = (window as WindowWithLocationModal).floraOpenLocationModal;
  if (open) {
    open();
    return;
  }
  window.dispatchEvent(new CustomEvent(OPEN_LOCATION_EVENT));
};
