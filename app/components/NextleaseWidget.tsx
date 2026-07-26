"use client";

import { useEffect } from "react";

const EMBED_SRC = "https://embedded.nextlease.se/embedded.js";

/**
 * Embeds the Nextlease car-listing widget.
 *
 * The widget is a client-side SPA that Nextlease injects into a
 * `<div id="nextlease" data-uid="...">`. We load its script on mount and
 * remove it on unmount so it re-initialises correctly on client-side
 * navigation between pages.
 */
export default function NextleaseWidget({ uid }: { uid: string }) {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = EMBED_SRC;
    script.async = true;
    document.body.appendChild(script);
    return () => {
      script.remove();
    };
  }, []);

  return <div id="nextlease" data-uid={uid} style={{ width: "100%" }} />;
}
