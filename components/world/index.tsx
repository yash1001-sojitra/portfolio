"use client";

import dynamic from "next/dynamic";

// three.js needs window/WebGL, so the world is only rendered in the browser
export const WorldLoader = dynamic(() => import("./world"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 grid place-items-center bg-bg font-mono text-xs text-muted">
      loading yash.world…
    </div>
  ),
});
