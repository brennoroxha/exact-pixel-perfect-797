import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

export const Route = createFileRoute("/google4eede3016ec98bdc.html")({
  server: {
    handlers: {
      GET: () =>
        new Response("google-site-verification: google4eede3016ec98bdc.html", {
          headers: { "Content-Type": "text/html; charset=utf-8" },
        }),
    },
  },
});
