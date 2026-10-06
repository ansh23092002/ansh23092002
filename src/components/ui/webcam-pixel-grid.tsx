"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

export interface WebcamPixelGridProps {
  gridCols?: number;
  gridRows?: number;
  maxElevation?: number;
  motionSensitivity?: number;
  elevationSmoothing?: number;
  colorMode?: "webcam" | "grayscale" | "monochrome";
  backgroundColor?: string;
  mirror?: boolean;
  gapRatio?: number;
  invertColors?: boolean;
  darken?: number;
  borderColor?: string;
  borderOpacity?: number;
  className?: string;
  onWebcamReady?: () => void;
  onWebcamError?: (err: unknown) => void;
  // Optional controls
  showControls?: boolean;
  defaultPixelSize?: number;
}

export function WebcamPixelGrid({
  gridCols = 60,
  gridRows = 40,
  maxElevation = 50,
  motionSensitivity = 0.25,
  elevationSmoothing = 0.2,
  colorMode = "monochrome", // Default to monochrome as user requested no color
  backgroundColor = "#030303",
  mirror = true,
  gapRatio = 0.05,
  invertColors = false,
  darken = 0.6,
  borderColor = "#ffffff",
  borderOpacity = 0.06,
  className,
  onWebcamReady,
  onWebcamError,
  showControls = true,
}: WebcamPixelGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [fps, setFps] = useState(0);

  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const prevFrameRef = useRef<Uint8ClampedArray | null>(null);
  const elevationGridRef = useRef<Float32Array | null>(null);
  const frameCountRef = useRef(0);
  const lastFpsTimeRef = useRef(performance.now());

  // Initialize camera
  const startCamera = useCallback(async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: "user" },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setIsCameraActive(true);
      setHasPermission(true);
      onWebcamReady?.();
    } catch (err) {
      console.warn("Webcam access unavailable or denied:", err);
      setIsCameraActive(false);
      onWebcamError?.(err);
    }
  }, [onWebcamReady, onWebcamError]);

  // Stop camera
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [stopCamera]);

  // Resize canvas to container
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current || !canvasRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvasRef.current.width = rect.width * dpr;
      canvasRef.current.height = rect.height * dpr;
    };

    handleResize();
    const observer = new ResizeObserver(handleResize);
    if (containerRef.current) observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  // Render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    // Create offscreen canvas for downsampling video
    const offCanvas = document.createElement("canvas");
    offCanvas.width = gridCols;
    offCanvas.height = gridRows;
    const offCtx = offCanvas.getContext("2d", { willReadFrequently: true });

    // Initialize elevation buffer
    const totalCells = gridCols * gridRows;
    if (!elevationGridRef.current || elevationGridRef.current.length !== totalCells) {
      elevationGridRef.current = new Float32Array(totalCells);
    }
    const elevations = elevationGridRef.current;

    let simTime = 0;

    const render = () => {
      simTime += 0.03;
      const width = canvas.width;
      const height = canvas.height;

      // Track FPS
      frameCountRef.current++;
      const now = performance.now();
      if (now - lastFpsTimeRef.current >= 1000) {
        setFps(frameCountRef.current);
        frameCountRef.current = 0;
        lastFpsTimeRef.current = now;
      }

      // Background fill
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);

      const cellW = width / gridCols;
      const cellH = height / gridRows;
      const gapX = cellW * gapRatio;
      const gapY = cellH * gapRatio;
      const drawW = Math.max(1, cellW - gapX);
      const drawH = Math.max(1, cellH - gapY);

      let currentImageData: Uint8ClampedArray | null = null;

      if (
        isCameraActive &&
        videoRef.current &&
        videoRef.current.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA &&
        offCtx
      ) {
        offCtx.save();
        if (mirror) {
          offCtx.scale(-1, 1);
          offCtx.drawImage(videoRef.current, -gridCols, 0, gridCols, gridRows);
        } else {
          offCtx.drawImage(videoRef.current, 0, 0, gridCols, gridRows);
        }
        offCtx.restore();

        try {
          const imgData = offCtx.getImageData(0, 0, gridCols, gridRows);
          currentImageData = imgData.data;
        } catch {
          currentImageData = null;
        }
      }

      const prevData = prevFrameRef.current;

      for (let row = 0; row < gridRows; row++) {
        for (let col = 0; col < gridCols; col++) {
          const idx = row * gridCols + col;
          let targetElevation = 0;
          let r = 0, g = 0, b = 0;

          if (currentImageData) {
            const pxIdx = idx * 4;
            r = currentImageData[pxIdx];
            g = currentImageData[pxIdx + 1];
            b = currentImageData[pxIdx + 2];

            // Pure luminance calculation (Monochrome / No Color)
            const lum = 0.299 * r + 0.587 * g + 0.114 * b;

            // Motion detection
            let motion = 0;
            if (prevData && motionSensitivity > 0) {
              const prevLum = 0.299 * prevData[pxIdx] + 0.587 * prevData[pxIdx + 1] + 0.114 * prevData[pxIdx + 2];
              motion = Math.abs(lum - prevLum) / 255;
            }

            const baseElev = (lum / 255) * maxElevation;
            const motionElev = motion * motionSensitivity * maxElevation;
            targetElevation = baseElev + motionElev;
          } else {
            // Natural simulation wave (zero color / monochrome)
            const dist = Math.hypot(col - gridCols / 2, row - gridRows / 2);
            const wave = Math.sin(dist * 0.25 - simTime) * 0.5 + 0.5;
            const noise = Math.cos(col * 0.18 + simTime) * Math.sin(row * 0.18 - simTime * 0.7);
            const factor = Math.max(0, Math.min(1, wave * 0.7 + noise * 0.3));

            const lum = factor * 220;
            r = lum;
            g = lum;
            b = lum;
            targetElevation = factor * maxElevation;
          }

          // Smooth elevation
          elevations[idx] += (targetElevation - elevations[idx]) * elevationSmoothing;
          const currentElev = elevations[idx];

          // Compute monochrome brightness (NO COLOR / strictly shades of gray)
          let lum = 0.299 * r + 0.587 * g + 0.114 * b;
          if (invertColors) lum = 255 - lum;

          // Apply darkening
          lum = lum * (1 - Math.max(0, Math.min(0.95, darken)));
          const gray = Math.max(0, Math.min(255, Math.round(lum)));

          const posX = col * cellW + gapX / 2;
          const posY = row * cellH + gapY / 2;

          // Render pixel tile with elevation scale effect
          const elevScale = Math.min(1.2, Math.max(0.4, 0.4 + (currentElev / (maxElevation || 1)) * 0.6));
          const actualW = drawW * elevScale;
          const actualH = drawH * elevScale;
          const offX = posX + (drawW - actualW) / 2;
          const offY = posY + (drawH - actualH) / 2;

          // ZERO COLOR: Pure Grayscale (v, v, v)
          ctx.fillStyle = `rgb(${gray}, ${gray}, ${gray})`;
          ctx.fillRect(offX, offY, actualW, actualH);

          // Border stroke if configured
          if (borderOpacity > 0 && borderColor) {
            ctx.save();
            ctx.strokeStyle = borderColor;
            ctx.globalAlpha = borderOpacity;
            ctx.strokeRect(offX, offY, actualW, actualH);
            ctx.restore();
          }
        }
      }

      if (currentImageData) {
        if (!prevFrameRef.current || prevFrameRef.current.length !== currentImageData.length) {
          prevFrameRef.current = new Uint8ClampedArray(currentImageData.length);
        }
        prevFrameRef.current.set(currentImageData);
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [
    gridCols,
    gridRows,
    maxElevation,
    motionSensitivity,
    elevationSmoothing,
    colorMode,
    backgroundColor,
    mirror,
    gapRatio,
    invertColors,
    darken,
    borderColor,
    borderOpacity,
    isCameraActive,
  ]);

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full h-full overflow-hidden", className)}
    >
      <video ref={videoRef} className="hidden" playsInline muted autoPlay />

      <canvas
        ref={canvasRef}
        className="w-full h-full block object-cover"
      />

      {/* Floating minimal toggle control */}
      {showControls && (
        <div className="absolute bottom-4 right-4 z-20 flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-mono text-neutral-400">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span>{isCameraActive ? "LIVE B&W" : "MONOCHROME SENSOR"}</span>
            <span>•</span>
            <span>FPS: {fps}</span>
          </div>

          <button
            onClick={isCameraActive ? stopCamera : startCamera}
            className={cn(
              "px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold transition-all cursor-pointer shadow-lg flex items-center gap-1.5 backdrop-blur-md",
              isCameraActive
                ? "bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30"
                : "bg-white/10 hover:bg-white/20 text-white border border-white/20"
            )}
          >
            <span>{isCameraActive ? "⏹ Stop Camera" : "📷 Start Camera"}</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default WebcamPixelGrid;
