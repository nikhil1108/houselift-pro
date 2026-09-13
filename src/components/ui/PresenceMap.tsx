"use client";

import { MapPin } from "lucide-react";
import { useState } from "react";

import { PRESENCE_CITIES } from "@/components/data/mockData";

/**
 * Pan India operating cities on real OpenStreetMap tiles.
 *
 * This is a genuine map — raster tiles straight from the OSM tile server,
 * with markers placed by the same Web Mercator projection the tiles use, so a
 * pin lands where the city actually is. No API key, no billing account and no
 * mapping library: the section only needs to *show* twelve fixed points, not
 * pan, zoom or geocode, and a static mosaic does that in 16 cached image
 * requests instead of ~150 KB of JavaScript.
 *
 * NOTE(owner): tile.openstreetmap.org is free but its usage policy asks that
 * heavy or commercial traffic move to a paid provider. At this volume a
 * marketing page is fine; if traffic grows, swap TILE_URL for a MapTiler or
 * Thunderforest key — the projection maths below is provider-agnostic.
 */

/** Zoom 5 puts the whole subcontinent in a 4×4 tile square. */
const ZOOM = 5;
/** Top-left tile of the mosaic, in OSM tile coordinates at ZOOM. */
const TILE_X0 = 21;
const TILE_Y0 = 12;
/** Mosaic size in tiles. 4×4 spans roughly 56°–101°E and 0°–41°N. */
const COLS = 4;
const ROWS = 4;

const TILE_URL = (x: number, y: number): string =>
  `https://tile.openstreetmap.org/${ZOOM}/${x}/${y}.png`;

const TILES: ReadonlyArray<{ key: string; url: string }> = Array.from(
  { length: ROWS },
  (_, row) =>
    Array.from({ length: COLS }, (_, col) => ({
      key: `${TILE_X0 + col}-${TILE_Y0 + row}`,
      url: TILE_URL(TILE_X0 + col, TILE_Y0 + row),
    })),
).flat();

/**
 * Web Mercator (EPSG:3857) forward projection, expressed as a percentage
 * offset inside the mosaic. Identical to the transform the tile server used to
 * cut the tiles, which is why the markers register against the coastline.
 */
function project(lat: number, lng: number): { left: number; top: number } {
  const n = 2 ** ZOOM;
  const latRad = (lat * Math.PI) / 180;
  const x = ((lng + 180) / 360) * n;
  const y =
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n;

  return {
    left: Math.round(((x - TILE_X0) / COLS) * 10000) / 100,
    top: Math.round(((y - TILE_Y0) / ROWS) * 10000) / 100,
  };
}

export function PresenceMap(): JSX.Element {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = PRESENCE_CITIES.find((city) => city.id === activeId);

  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-200/80 bg-canvas p-4 shadow-panel sm:p-6">
      <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
        {/* Tiles are desaturated so the amber and blue markers read as the
            foreground layer rather than competing with OSM's own colours. */}
        <div
          aria-hidden
          className="absolute inset-0 grid grid-cols-4 grid-rows-4 [filter:saturate(0.35)_contrast(1.04)_brightness(1.03)]"
        >
          {TILES.map((tile) => (
            /* eslint-disable-next-line @next/next/no-img-element --
               Tiles are already exactly 256×256 raster PNGs on a CDN; routing
               them through next/image would add a proxy hop and buy nothing. */
            <img
              key={tile.key}
              src={tile.url}
              alt=""
              width={256}
              height={256}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
          ))}
        </div>

        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-hydraulic-900/5 to-hydraulic-900/15"
        />

        <ul
          className="absolute inset-0 list-none"
          aria-label={`${PRESENCE_CITIES.length} operating cities across India`}
        >
          {PRESENCE_CITIES.map((city) => {
            const { left, top } = project(city.lat, city.lng);
            const isActive = activeId === city.id;

            return (
              <li
                key={city.id}
                className="absolute"
                style={{ left: `${left}%`, top: `${top}%` }}
                suppressHydrationWarning
              >
                <button
                  type="button"
                  aria-label={`${city.name}: ${city.projects} projects${city.hq ? ", head office" : ""}`}
                  onMouseEnter={() => setActiveId(city.id)}
                  onMouseLeave={() => setActiveId(null)}
                  onFocus={() => setActiveId(city.id)}
                  onBlur={() => setActiveId(null)}
                  /* Hit area is 40px on touch devices, centred on the pin,
                     while the visible dot stays small. */
                  className="absolute left-0 top-0 flex h-10 w-10 sm:h-8 sm:w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-amber-500 touch-manipulation"
                >
                  {city.hq ? (
                    <span
                      aria-hidden
                      className="absolute h-5 w-5 rounded-full border border-amber-600/60 bg-amber-500/15"
                    />
                  ) : null}
                  <span
                    aria-hidden
                    className={[
                      "relative rounded-full border border-white shadow-sm transition-all duration-200",
                      city.hq ? "bg-amber-600" : "bg-hydraulic-600",
                      city.hq
                        ? isActive
                          ? "h-4 w-4"
                          : "h-3 w-3"
                        : isActive
                          ? "h-3 w-3"
                          : "h-2.5 w-2.5",
                    ].join(" ")}
                  />
                </button>

                {isActive ? (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute left-3 top-0 -translate-y-1/2 whitespace-nowrap rounded bg-ink/90 px-1.5 py-0.5 font-mono text-[10px] font-medium text-white"
                  >
                    {city.name}
                  </span>
                ) : null}
              </li>
            );
          })}
        </ul>

        <p className="absolute bottom-0 right-0 bg-white/80 px-1.5 py-0.5 text-[10px] leading-tight text-slate-600">
          ©{" "}
          <a
            href="https://www.openstreetmap.org/copyright"
            target="_blank"
            rel="noreferrer noopener"
            className="underline hover:text-ink"
          >
            OpenStreetMap
          </a>{" "}
          contributors
        </p>
      </div>

      {/* Readout keeps a fixed height so hovering never shifts the layout. */}
      <div className="relative mt-4 flex min-h-[2.5rem] items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5">
        {active ? (
          <>
            <MapPin className="h-3.5 w-3.5 shrink-0 text-amber-600" aria-hidden />
            <p className="font-mono text-xs text-slate-600">
              <span className="font-semibold text-ink">{active.name}</span>
              <span className="mx-2 text-slate-300">·</span>
              <span className="nums">{active.projects}</span> projects
              {active.hq ? (
                <>
                  <span className="mx-2 text-slate-300">·</span>
                  <span className="font-semibold text-amber-700">Head office</span>
                </>
              ) : null}
            </p>
          </>
        ) : (
          <p className="font-mono text-xs text-slate-400">
            Hover a marker for the project count
          </p>
        )}
      </div>
    </div>
  );
}
