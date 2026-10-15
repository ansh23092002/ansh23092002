"use client";

import dynamic from "next/dynamic";
import type { GlobeConfig } from "@/components/ui/globe";

const World = dynamic(() => import("@/components/ui/globe").then((m) => m.World), {
  ssr: false,
  loading: () => null,
});

const RAIPUR = { lat: 21.2514, lng: 81.6296 };
const GOLD = "#c9a227";
const WHITE = "#ffffff";

const destinations = [
  { lat: 28.6139, lng: 77.209 }, // New Delhi
  { lat: 1.3521, lng: 103.8198 }, // Singapore
  { lat: 51.5072, lng: -0.1276 }, // London
  { lat: 25.2048, lng: 55.2708 }, // Dubai
  { lat: 37.7749, lng: -122.4194 }, // San Francisco
  { lat: 35.6762, lng: 139.6503 }, // Tokyo
  { lat: 52.52, lng: 13.405 }, // Berlin
  { lat: -33.8688, lng: 151.2093 }, // Sydney
  { lat: 40.7128, lng: -74.006 }, // New York
  { lat: 19.076, lng: 72.8777 }, // Mumbai
];

const arcs = destinations.map((d, i) => ({
  order: (i % 5) + 1,
  startLat: RAIPUR.lat,
  startLng: RAIPUR.lng,
  endLat: d.lat,
  endLng: d.lng,
  arcAlt: 0.12 + (i % 4) * 0.08,
  color: i % 3 === 0 ? WHITE : GOLD,
}));

const globeConfig: GlobeConfig = {
  pointSize: 2,
  globeColor: "#384144",
  showAtmosphere: false,
  emissive: "#2d3436",
  emissiveIntensity: 0.4,
  shininess: 0.3,
  polygonColor: "rgba(223,230,233,0.6)",
  ambientLight: "#ffffff",
  directionalLeftLight: "#ffffff",
  directionalTopLight: "#ffffff",
  pointLight: "#ffffff",
  arcTime: 1400,
  arcLength: 0.9,
  rings: 1,
  maxRings: 3,
  initialPosition: RAIPUR,
  autoRotate: true,
  autoRotateSpeed: 0.4,
};

export function HeroGlobe() {
  return <World data={arcs} globeConfig={globeConfig} />;
}
