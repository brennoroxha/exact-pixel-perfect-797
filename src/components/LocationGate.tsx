import { useEffect, useState } from "react";
import { LocationModal } from "./LocationModal";
import { isLocationFresh, useLocationStore } from "@/stores/location";

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
    const handler = () => setOpen(true);
    window.addEventListener("flora:open-location", handler);
    return () => window.removeEventListener("flora:open-location", handler);
  }, []);

  if (!hydrated) return null;

  return open ? <LocationModal onClose={() => setOpen(false)} /> : null;
}

export const openLocationModal = () =>
  window.dispatchEvent(new CustomEvent("flora:open-location"));
