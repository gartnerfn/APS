"use client";

import { useEffect } from "react";

export function InstagramEmbed({ url }: { url: string }) {
  useEffect(() => {
    // cargar script de Instagram si no está
    if (!document.getElementById("instagram-embed-script")) {
      const script = document.createElement("script");
      script.id = "instagram-embed-script";
      script.src = "https://www.instagram.com/embed.js";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    } else {
      // si ya está cargado, forzar re-parse de embeds
      // @ts-ignore
      if (window.instgrm) window.instgrm.Embeds.process();
    }
  }, []);

  return (
    <blockquote
      className="instagram-media w-full"
      data-instgrm-permalink={url}
      data-instgrm-version="14"
    >
      <a href={url}>Ver en Instagram</a>
    </blockquote>
  );
}