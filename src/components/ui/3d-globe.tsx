"use client";

import React, { useEffect, useRef, useState } from "react";
import createGlobe from "cobe";
import { cn } from "@/lib/utils";

export interface GlobeMarker {
  lat: number;
  lng: number;
  src?: string;
  label?: string;
  size?: number;
}

export interface GlobeConfig {
  atmosphereColor?: string;
  atmosphereIntensity?: number;
  bumpScale?: number;
  autoRotateSpeed?: number;
}

export interface Globe3DProps {
  className?: string;
  markers?: GlobeMarker[];
  config?: GlobeConfig;
  onMarkerClick?: (marker: GlobeMarker) => void;
  onMarkerHover?: (marker: GlobeMarker | null) => void;
}

export function Globe3D({
  className,
  markers = [],
  config = {},
  onMarkerClick,
  onMarkerHover,
}: Globe3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);

  const [activeMarker, setActiveMarker] = useState<GlobeMarker | null>(null);
  const [projectedMarkers, setProjectedMarkers] = useState<
    Array<{ marker: GlobeMarker; x: number; y: number; visible: boolean }>
  >([]);

  const autoRotateSpeed = config.autoRotateSpeed ?? 0.3;

  useEffect(() => {
    let phi = 0;
    let width = 0;
    let animId: number;

    const onResize = () => {
      if (canvasRef.current && containerRef.current) {
        width = containerRef.current.offsetWidth || canvasRef.current.offsetWidth || 500;
      }
    };
    window.addEventListener("resize", onResize);
    onResize();

    if (!canvasRef.current) return;

    // Convert hex atmosphereColor to RGB 0-1
    let glowR = 0.3, glowG = 0.65, glowB = 1.0;
    if (config.atmosphereColor && config.atmosphereColor.startsWith("#")) {
      const hex = config.atmosphereColor.replace("#", "");
      if (hex.length === 6) {
        glowR = parseInt(hex.substring(0, 2), 16) / 255;
        glowG = parseInt(hex.substring(2, 4), 16) / 255;
        glowB = parseInt(hex.substring(4, 6), 16) / 255;
      }
    }

    const cobeMarkers = markers.map((m) => ({
      location: [m.lat, m.lng] as [number, number],
      size: m.size || 0.06,
    }));

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 2),
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.25,
      dark: 1,
      diffuse: 1.4,
      mapSamples: 18000,
      mapBrightness: 6,
      baseColor: [0.1, 0.12, 0.2],
      markerColor: [0.15, 0.6, 1.0],
      glowColor: [glowR, glowG, glowB],
      opacity: 0.92,
      markers: cobeMarkers,
    });

    const animate = () => {
      if (!pointerInteracting.current) {
        phi += (autoRotateSpeed * 0.01);
      }
      const totalPhi = phi + pointerInteractionMovement.current;

      globe.update({
        phi: totalPhi,
        width: width * 2,
        height: width * 2,
      });

      // Calculate 2D screen positions for interactive marker avatars
      if (containerRef.current) {
        const radius = (width / 2) * 0.85;
        const centerX = width / 2;
        const centerY = width / 2;

        const nextProjected = markers.map((marker) => {
          const latRad = (marker.lat * Math.PI) / 180;
          const lngRad = (marker.lng * Math.PI) / 180;

          // Projected coords with tilt theta = 0.25
          const theta = 0.25;
          const rotLng = lngRad + totalPhi;

          // 3D coordinates on unit sphere
          const x3d = Math.cos(latRad) * Math.sin(rotLng);
          const y3d = -Math.sin(latRad);
          const z3d = Math.cos(latRad) * Math.cos(rotLng);

          // Apply theta tilt around X axis
          const yTilted = y3d * Math.cos(theta) - z3d * Math.sin(theta);
          const zTilted = y3d * Math.sin(theta) + z3d * Math.cos(theta);

          const isFacingCamera = zTilted > 0.15; // Only show if on visible front hemisphere

          const screenX = centerX + x3d * radius;
          const screenY = centerY + yTilted * radius;

          return {
            marker,
            x: screenX,
            y: screenY,
            visible: isFacingCamera,
          };
        });

        setProjectedMarkers(nextProjected);
      }

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    setTimeout(() => {
      if (canvasRef.current) {
        canvasRef.current.style.opacity = "1";
      }
    });

    return () => {
      cancelAnimationFrame(animId);
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, [markers, config.atmosphereColor, autoRotateSpeed]);

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full h-full overflow-hidden flex items-center justify-center", className)}
    >
      <canvas
        ref={canvasRef}
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX - pointerInteractionMovement.current;
          if (canvasRef.current) canvasRef.current.style.cursor = "grabbing";
        }}
        onPointerUp={() => {
          pointerInteracting.current = null;
          if (canvasRef.current) canvasRef.current.style.cursor = "grab";
        }}
        onPointerOut={() => {
          pointerInteracting.current = null;
          if (canvasRef.current) canvasRef.current.style.cursor = "grab";
        }}
        onMouseMove={(e) => {
          if (pointerInteracting.current !== null) {
            const delta = e.clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta * 0.005;
          }
        }}
        onTouchMove={(e) => {
          if (pointerInteracting.current !== null && e.touches[0]) {
            const delta = e.touches[0].clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta * 0.005;
          }
        }}
        className="w-full h-full opacity-0 transition-opacity duration-1000 cursor-grab block"
      />

      {/* Floating Interactive Marker Avatars */}
      {projectedMarkers.map((item, idx) => {
        if (!item.visible) return null;
        const isHovered = activeMarker?.label === item.marker.label;

        return (
          <div
            key={idx}
            style={{
              left: `${item.x}px`,
              top: `${item.y}px`,
              transform: "translate(-50%, -50%)",
            }}
            className="absolute z-20 pointer-events-auto cursor-pointer group"
            onClick={() => onMarkerClick?.(item.marker)}
            onMouseEnter={() => {
              setActiveMarker(item.marker);
              onMarkerHover?.(item.marker);
            }}
            onMouseLeave={() => {
              setActiveMarker(null);
              onMarkerHover?.(null);
            }}
          >
            {/* Avatar Pill / Pin */}
            <div
              className={cn(
                "relative rounded-full p-0.5 transition-all duration-200 shadow-lg",
                isHovered
                  ? "scale-125 ring-2 ring-blue-400 bg-blue-500 z-30"
                  : "bg-white/20 hover:scale-110"
              )}
            >
              {item.marker.src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.marker.src}
                  alt={item.marker.label || "Marker"}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-white/60 bg-neutral-900"
                />
              ) : (
                <div className="w-3.5 h-3.5 rounded-full bg-blue-400 ring-2 ring-white" />
              )}

              {/* Pulsing ring indicator */}
              <div className="absolute inset-0 rounded-full bg-blue-400/40 animate-ping pointer-events-none" />
            </div>

            {/* Label Tooltip */}
            {item.marker.label && (
              <div
                className={cn(
                  "absolute left-1/2 -bottom-7 -translate-x-1/2 whitespace-nowrap rounded-md px-2 py-0.5 text-[10px] font-mono font-medium shadow-md transition-all duration-200 pointer-events-none",
                  isHovered
                    ? "opacity-100 bg-white text-black font-semibold scale-100"
                    : "opacity-0 scale-95"
                )}
              >
                {item.marker.label}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default Globe3D;
