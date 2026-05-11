import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { LocationModal } from "./LocationModal";
import { isLocationFresh, useLocationStore } from "@/stores/location";

export function LocationGate() {
  const location = useLocationStore((s) => s.location);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    if (!isLocationFresh(location)) setOpen(true);
  }, [location]);

  // Allow opening from anywhere via custom event
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("flora:open-location", handler);
    return () => window.removeEventListener("flora:open-location", handler);
  }, []);

  if (!hydrated) return null;

  return (
    <AnimatePresence>{open && <LocationModal onClose={() => setOpen(false)} />}</AnimatePresence>
  );
}

export const openLocationModal = () =>
  window.dispatchEvent(new CustomEvent("flora:open-location"));
