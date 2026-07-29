"use client";

import { useEffect } from "react";

const EMBED_SRC = "https://embedded.nextlease.se/embedded.js";

/**
 * Bäddar in Nextlease bil-widget. Widgeten är en klient-SPA som Nextlease
 * monterar i `<div id="nextlease" data-uid>`, och dess `embedded.js` injicerar
 * GLOBALA stilar + global JS-state (initieras bara en gång).
 *
 * Därför renderas den här komponenten i ett EGET dokument via en iframe (se
 * /nextlease-embed + app/objekt/NextleaseFrame.tsx). Isoleringen gör att
 * widgetens CSS inte läcker till resten av sajten och att den initieras färskt
 * vid varje besök (annars blev sidan blank andra gången / layouten trasig efter
 * bakåtnavigering).
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
