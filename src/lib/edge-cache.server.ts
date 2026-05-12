import { setResponseHeader } from "@tanstack/react-start/server";

export function setEdgeCacheHeader(value: string) {
  setResponseHeader("Cache-Control", value);
}
