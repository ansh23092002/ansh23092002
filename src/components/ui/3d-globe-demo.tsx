"use client";
import { Globe3D, GlobeMarker } from "@/components/ui/3d-globe";

const sampleMarkers: GlobeMarker[] = [
  {
    lat: 40.7128,
    lng: -74.006,
    src: "https://assets.aceternity.com/avatars/1.webp",
    label: "New York",
  },
  {
    lat: 51.5074,
    lng: -0.1278,
    src: "https://assets.aceternity.com/avatars/2.webp",
    label: "London",
  },
  {
    lat: 35.6762,
    lng: 139.6503,
    src: "https://assets.aceternity.com/avatars/3.webp",
    label: "Tokyo",
  },
  {
    lat: -33.8688,
    lng: 151.2093,
    src: "https://assets.aceternity.com/avatars/4.webp",
    label: "Sydney",
  },
  {
    lat: 48.8566,
    lng: 2.3522,
    src: "https://assets.aceternity.com/avatars/5.webp",
    label: "Paris",
  },
  {
    lat: 28.6139,
    lng: 77.209,
    src: "https://assets.aceternity.com/avatars/6.webp",
    label: "New Delhi",
  },
  {
    lat: 55.7558,
    lng: 37.6173,
    src: "https://assets.aceternity.com/avatars/7.webp",
    label: "Moscow",
  },
  {
    lat: -22.9068,
    lng: -43.1729,
    src: "https://assets.aceternity.com/avatars/8.webp",
    label: "Rio de Janeiro",
  },
  {
    lat: 31.2304,
    lng: 121.4737,
    src: "https://assets.aceternity.com/avatars/9.webp",
    label: "Shanghai",
  },
  {
    lat: 25.2048,
    lng: 55.2708,
    src: "https://assets.aceternity.com/avatars/10.webp",
    label: "Dubai",
  },
  {
    lat: -34.6037,
    lng: -58.3816,
    src: "https://assets.aceternity.com/avatars/11.webp",
    label: "Buenos Aires",
  },
  {
    lat: 1.3521,
    lng: 103.8198,
    src: "https://assets.aceternity.com/avatars/12.webp",
    label: "Singapore",
  },
  {
    lat: 37.5665,
    lng: 126.978,
    src: "https://assets.aceternity.com/avatars/13.webp",
    label: "Seoul",
  },
];

export function Globe3DDemoThird() {
  return (
    <div className="relative mx-auto h-[440px] md:h-[420px] w-full max-w-7xl overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 shadow-black/10 ring-black/10 dark:bg-neutral-950 dark:border dark:border-white/10">
      <div className="relative z-10 p-6 md:p-12">
        <h2 className="mb-4 max-w-2xl text-2xl font-extrabold tracking-tight text-balance text-neutral-900 md:text-5xl lg:text-6xl dark:text-white">
          Play all over the world with a click.
        </h2>
        <p className="mt-2 max-w-lg text-balance text-neutral-600 md:mt-6 md:text-lg dark:text-neutral-400">
          Sign up for an account and start posting all over the world with one click.
        </p>

        <div className="mt-6 flex flex-wrap gap-4 md:mt-8">
          <a
            href="#contact"
            className="flex cursor-pointer items-center justify-center rounded-lg bg-neutral-900 px-5 py-2.5 font-medium text-white shadow-[0px_0px_10px_0px_rgba(255,255,255,0.2)_inset] ring ring-white/20 ring-offset-2 ring-offset-neutral-900 transition-all duration-200 ring-inset hover:shadow-[0px_0px_20px_0px_rgba(255,255,255,0.4)_inset] hover:ring-white/40 active:scale-98 dark:bg-white dark:text-black"
          >
            Get Started
          </a>
          <a
            href="#projects"
            className="flex cursor-pointer items-center justify-center rounded-lg bg-white px-5 py-2.5 font-medium text-neutral-900 ring ring-neutral-200 transition-all duration-200 ring-inset hover:bg-neutral-50 hover:ring-neutral-300 active:scale-98 dark:bg-white/5 dark:text-white dark:ring-white/20 dark:hover:bg-white/10"
          >
            Learn More
          </a>
        </div>
      </div>

      {/* Globe container - sized and positioned just for the globe */}
      <div className="absolute -right-52 -bottom-72 md:-right-60 md:-bottom-72 z-10 w-[420px] h-[420px] md:w-[500px] md:h-[500px] pointer-events-auto">
        <Globe3D
          className="h-full w-full"
          markers={sampleMarkers}
          config={{
            atmosphereColor: "#4da6ff",
            atmosphereIntensity: 20,
            bumpScale: 5,
            autoRotateSpeed: 0.3,
          }}
          onMarkerClick={(marker) => {
            console.log("Clicked marker:", marker.label);
          }}
          onMarkerHover={(marker) => {
            if (marker) {
              console.log("Hovering:", marker.label);
            }
          }}
        />
      </div>
    </div>
  );
}

export default Globe3DDemoThird;
