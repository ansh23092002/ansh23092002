export const INTRO_VIDEOS = {
  low: "/splash-mobile.mp4",
  medium: "/splash-desktop.mp4",
  high: "/splash-hd.mp4",
} as const;

export type IntroQuality = keyof typeof INTRO_VIDEOS;

export type NetworkConnection = EventTarget & {
  downlink?: number;
  effectiveType?: string;
  saveData?: boolean;
};

export function selectIntroQuality(connection?: Partial<NetworkConnection>): IntroQuality {
  if (connection?.saveData || ["slow-2g", "2g", "3g"].includes(connection?.effectiveType ?? "")) return "low";
  const speed = connection?.downlink;
  if (typeof speed === "number" && Number.isFinite(speed)) {
    if (speed < 1.5) return "low";
    if (speed >= 5) return "high";
  }
  return "medium";
}

export function lowerIntroQuality(quality: IntroQuality): IntroQuality | null {
  return quality === "high" ? "medium" : quality === "medium" ? "low" : null;
}
