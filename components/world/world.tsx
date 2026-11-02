"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import { PCFSoftShadowMap } from "three";
import { HUD, useDragLook } from "./hud";
import { Scene } from "./scene";

export default function World() {
  const wrap = useRef<HTMLDivElement>(null);
  const [quality, setQuality] = useState<"high" | "low">("high");
  useDragLook(wrap);

  useEffect(() => {
    // phones and low-core machines skip bloom and use smaller shadow maps
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (coarse || (navigator.hardwareConcurrency ?? 8) <= 4) setQuality("low");
  }, []);

  return (
    <div ref={wrap} className="fixed inset-0 touch-none overflow-hidden bg-bg select-none">
      <Canvas
        shadows={{ type: PCFSoftShadowMap }}
        dpr={quality === "high" ? [1, 1.5] : [1, 1.25]}
        camera={{ fov: 55, near: 0.1, far: 1500, position: [0, 70, 115] }}
        gl={{ antialias: quality === "low", powerPreference: "high-performance" }}
        onCreated={(state) => {
          // dev-only handle for profiling from the browser console
          if (process.env.NODE_ENV !== "production") (window as unknown as { __r3f: unknown }).__r3f = state;
        }}
      >
        <Suspense fallback={null}>
          <Scene quality={quality} />
        </Suspense>
      </Canvas>
      <HUD />
    </div>
  );
}
