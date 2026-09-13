"use client";

import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/utils";
import type { PlateScene } from "@/types";

/**
 * Vector "photography" for the field gallery.
 *
 * These are the fallback when a project has no photograph yet. Rather than
 * ship grey boxes or pull from a stock CDN, each slot gets a purpose-drawn
 * technical scene, so the gallery reads as a real body of work at any viewport
 * and costs zero network requests. Set `photo` on a GALLERY_PROJECTS entry and
 * the real image takes over; the vector stays as the 404 fallback.
 *
 * All ten scenes share a palette (site blues, concrete greys, amber plant)
 * and a 800×450 coordinate space, so they tile without visual discontinuity.
 */

const W = 800;
const H = 450;

function Sky({ from, to }: { from: string; to: string }): JSX.Element {
  return (
    <>
      <defs>
        <linearGradient id={`sky-${from.slice(1)}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#sky-${from.slice(1)})`} />
    </>
  );
}

/** Distant skyline, used to give the outdoor scenes depth. */
function Skyline({ y = 300 }: { y?: number }): JSX.Element {
  return (
    <g fill="#cbd5e1" opacity="0.55">
      <rect x="20" y={y - 40} width="46" height="40" />
      <rect x="74" y={y - 62} width="34" height="62" />
      <rect x="116" y={y - 30} width="52" height="30" />
      <rect x="640" y={y - 52} width="40" height="52" />
      <rect x="688" y={y - 34} width="58" height="34" />
      <rect x="754" y={y - 68} width="30" height="68" />
    </g>
  );
}

function Ground({ y = 340, fill = "#94a3b8" }: { y?: number; fill?: string }): JSX.Element {
  return (
    <>
      <rect x="0" y={y} width={W} height={H - y} fill={fill} />
      <line x1="0" y1={y} x2={W} y2={y} stroke="#475569" strokeWidth="3" />
    </>
  );
}

/** Hydraulic jack: fixed cylinder with an extended rod. */
function Jack({
  x,
  baseY,
  extension,
  scale = 1,
}: {
  x: number;
  baseY: number;
  extension: number;
  scale?: number;
}): JSX.Element {
  const bodyW = 26 * scale;
  const bodyH = 30 * scale;
  const rodW = 10 * scale;

  return (
    <g>
      <rect
        x={x - bodyW / 2}
        y={baseY - bodyH}
        width={bodyW}
        height={bodyH}
        fill="#f59e0b"
        stroke="#78350f"
        strokeWidth="2"
        rx="2"
      />
      <rect
        x={x - rodW / 2}
        y={baseY - bodyH - extension}
        width={rodW}
        height={extension + 4}
        fill="#e2e8f0"
        stroke="#475569"
        strokeWidth="1.5"
      />
      <rect
        x={x - bodyW / 2 - 3}
        y={baseY - bodyH - extension - 6}
        width={bodyW + 6}
        height="7"
        fill="#64748b"
        stroke="#334155"
        strokeWidth="1.5"
        rx="1"
      />
    </g>
  );
}

/** Two-storey house body, drawn from its bottom-left corner. */
function HouseBody({
  x,
  y,
  w,
  h,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
}): JSX.Element {
  const storey = h / 2;

  return (
    <g>
      <rect x={x} y={y - h} width={w} height={h} fill="#ffffff" stroke="#334155" strokeWidth="3" />
      <line x1={x} y1={y - storey} x2={x + w} y2={y - storey} stroke="#334155" strokeWidth="2" />

      {/* Openings */}
      {[0.12, 0.42].map((fx) => (
        <rect
          key={`u${fx}`}
          x={x + w * fx}
          y={y - h + 18}
          width={w * 0.18}
          height={storey - 34}
          fill="#bae6fd"
          stroke="#0369a1"
          strokeWidth="2"
        />
      ))}
      <rect
        x={x + w * 0.72}
        y={y - h + 18}
        width={w * 0.18}
        height={storey - 34}
        fill="#bae6fd"
        stroke="#0369a1"
        strokeWidth="2"
      />
      {[0.12, 0.72].map((fx) => (
        <rect
          key={`l${fx}`}
          x={x + w * fx}
          y={y - storey + 16}
          width={w * 0.18}
          height={storey - 32}
          fill="#bae6fd"
          stroke="#0369a1"
          strokeWidth="2"
        />
      ))}
      {/* Door */}
      <rect
        x={x + w * 0.42}
        y={y - storey + 16}
        width={w * 0.18}
        height={storey - 16}
        fill="#d97706"
        stroke="#78350f"
        strokeWidth="2"
      />

      {/* Roof */}
      <path
        d={`M${x - 14} ${y - h} L${x + w / 2} ${y - h - 52} L${x + w + 14} ${y - h} Z`}
        fill="#e2e8f0"
        stroke="#334155"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </g>
  );
}

/** Blue dimension line with arrowheads and a label. */
function Dimension({
  x,
  topY,
  bottomY,
  label,
}: {
  x: number;
  topY: number;
  bottomY: number;
  label: string;
}): JSX.Element {
  return (
    <g stroke="#0284c7" strokeWidth="2" fill="none">
      <line x1={x} y1={topY} x2={x} y2={bottomY} />
      <path d={`M${x - 7} ${topY + 9} L${x} ${topY} L${x + 7} ${topY + 9}`} />
      <path d={`M${x - 7} ${bottomY - 9} L${x} ${bottomY} L${x + 7} ${bottomY - 9}`} />
      <rect
        x={x + 8}
        y={(topY + bottomY) / 2 - 13}
        width="78"
        height="26"
        fill="#ffffff"
        stroke="#0284c7"
        strokeWidth="1.5"
        rx="3"
      />
      <text
        x={x + 47}
        y={(topY + bottomY) / 2 + 5}
        textAnchor="middle"
        fontSize="15"
        fontFamily="ui-monospace, monospace"
        fontWeight="600"
        fill="#0369a1"
        stroke="none"
      >
        {label}
      </text>
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Scenes                                                              */
/* ------------------------------------------------------------------ */

function RaisedHouse(): JSX.Element {
  const ground = 350;
  const lift = 86;

  return (
    <>
      <Sky from="#e0f2fe" to="#f8fafc" />
      <Skyline y={ground} />
      <Ground y={ground} fill="#a8a29e" />

      {/* Flood datum the lift was designed against */}
      <line x1="0" y1={ground - 44} x2={W} y2={ground - 44} stroke="#0284c7" strokeWidth="2" strokeDasharray="10 7" />
      <text x="18" y={ground - 52} fontSize="14" fontFamily="ui-monospace, monospace" fill="#0369a1">
        2018 FLOOD LEVEL
      </text>

      {/* New plinth cast beneath the raised slab */}
      <rect x="266" y={ground - lift} width="268" height={lift} fill="#cbd5e1" stroke="#475569" strokeWidth="2.5" />
      {Array.from({ length: 6 }, (_, i) => (
        <line
          key={i}
          x1={266 + i * 45}
          y1={ground}
          x2={266 + i * 45 + 30}
          y2={ground - lift}
          stroke="#94a3b8"
          strokeWidth="1.5"
        />
      ))}

      {[300, 400, 500].map((x) => (
        <Jack key={x} x={x} baseY={ground} extension={lift - 34} />
      ))}

      <g transform={`translate(0 ${-lift})`}>
        <rect x="252" y={ground - 18} width="296" height="18" fill="#f1f5f9" stroke="#334155" strokeWidth="3" />
        <HouseBody x={266} y={ground - 18} w={268} h={150} />
      </g>

      <Dimension x={214} topY={ground - lift} bottomY={ground} label="5.5 ft" />
    </>
  );
}

function JackArray(): JSX.Element {
  const beam = 210;

  return (
    <>
      <Sky from="#f1f5f9" to="#e2e8f0" />
      <Ground y={352} fill="#78716c" />

      {/* Underside of the plinth beam being supported */}
      <rect x="0" y={beam - 46} width={W} height="46" fill="#94a3b8" stroke="#334155" strokeWidth="3" />
      <rect x="0" y={beam - 46} width={W} height="10" fill="#cbd5e1" />
      <text x="24" y={beam - 60} fontSize="15" fontFamily="ui-monospace, monospace" fill="#475569">
        PLINTH BEAM SOFFIT
      </text>

      {/* Steel spreader beam distributing the jack loads */}
      <rect x="60" y={beam + 6} width="680" height="16" fill="#64748b" stroke="#1e293b" strokeWidth="2" />

      {[130, 250, 370, 490, 610, 710].map((x) => (
        <Jack key={x} x={x} baseY={352} extension={92} scale={1.25} />
      ))}

      {/* Manifold hose runs */}
      <path
        d="M130 340 C 200 396, 300 396, 370 340 M370 340 C 440 396, 540 396, 610 340"
        stroke="#0284c7"
        strokeWidth="4"
        fill="none"
        opacity="0.75"
      />
      <path
        d="M250 344 C 320 400, 420 400, 490 344"
        stroke="#0284c7"
        strokeWidth="4"
        fill="none"
        opacity="0.5"
      />
    </>
  );
}

function CommercialBlock(): JSX.Element {
  const ground = 366;
  const lift = 58;

  return (
    <>
      <Sky from="#e0f2fe" to="#f8fafc" />
      <Skyline y={ground} />
      <Ground y={ground} fill="#9ca3af" />

      <rect x="196" y={ground - lift} width="410" height={lift} fill="#cbd5e1" stroke="#475569" strokeWidth="2.5" />

      {[240, 340, 440, 540].map((x) => (
        <Jack key={x} x={x} baseY={ground} extension={lift - 30} />
      ))}

      <g transform={`translate(0 ${-lift})`}>
        {/* Three tenanted floors */}
        <rect x="188" y={ground - 232} width="426" height="232" fill="#ffffff" stroke="#334155" strokeWidth="3" />
        {[0, 1, 2].map((floor) => (
          <g key={floor}>
            <line
              x1="188"
              y1={ground - 232 + floor * 77}
              x2="614"
              y2={ground - 232 + floor * 77}
              stroke="#334155"
              strokeWidth="2"
            />
            {Array.from({ length: 6 }, (_, i) => (
              <rect
                key={i}
                x={210 + i * 68}
                y={ground - 214 + floor * 77}
                width="46"
                height="44"
                fill="#bae6fd"
                stroke="#0369a1"
                strokeWidth="1.5"
              />
            ))}
          </g>
        ))}
        {/* Shopfront awning — the tenants stayed open */}
        <rect x="188" y={ground - 34} width="426" height="34" fill="#d97706" opacity="0.9" />
        <rect x="188" y={ground - 240} width="426" height="12" fill="#64748b" />
      </g>

      <Dimension x={148} topY={ground - lift} bottomY={ground} label="4.0 ft" />
    </>
  );
}

function Heritage(): JSX.Element {
  const ground = 358;

  return (
    <>
      <Sky from="#fef3c7" to="#f8fafc" />
      <Ground y={ground} fill="#a8a29e" />

      {/* Ornamented lime-mortar facade */}
      <rect x="210" y={ground - 190} width="380" height="190" fill="#fffbeb" stroke="#78350f" strokeWidth="3" />

      {/* Arched openings */}
      {[250, 360, 470].map((x) => (
        <g key={x}>
          <path
            d={`M${x} ${ground - 30} L${x} ${ground - 96} A 30 30 0 0 1 ${x + 60} ${ground - 96} L${x + 60} ${ground - 30} Z`}
            fill="#bae6fd"
            stroke="#78350f"
            strokeWidth="2.5"
          />
        </g>
      ))}

      {/* Cornice + parapet detail */}
      <rect x="196" y={ground - 202} width="408" height="16" fill="#fde68a" stroke="#78350f" strokeWidth="2.5" />
      {Array.from({ length: 11 }, (_, i) => (
        <rect
          key={i}
          x={206 + i * 36}
          y={ground - 224}
          width="18"
          height="22"
          fill="#fffbeb"
          stroke="#78350f"
          strokeWidth="2"
        />
      ))}

      {/* Low-pressure jacks — smaller, more of them */}
      {[240, 310, 380, 450, 520].map((x) => (
        <Jack key={x} x={x} baseY={ground} extension={26} scale={0.8} />
      ))}

      {/* Levelling instrument sighting the correction */}
      <g stroke="#0284c7" strokeWidth="2" fill="none" strokeDasharray="7 5">
        <line x1="120" y1={ground - 150} x2="680" y2={ground - 150} />
      </g>
      <text x="120" y={ground - 158} fontSize="14" fontFamily="ui-monospace, monospace" fill="#0369a1">
        DATUM · 82 mm CORRECTION
      </text>
    </>
  );
}

function JackCloseup(): JSX.Element {
  return (
    <>
      <Sky from="#e2e8f0" to="#cbd5e1" />

      {/* Load being carried, top of frame */}
      <rect x="0" y="0" width={W} height="74" fill="#94a3b8" stroke="#334155" strokeWidth="3" />

      {/* Cylinder body */}
      <rect x="286" y="196" width="228" height="180" fill="#f59e0b" stroke="#78350f" strokeWidth="4" rx="6" />
      <rect x="286" y="196" width="228" height="22" fill="#fbbf24" rx="4" />
      {/* Ribs */}
      {[240, 274, 308, 342].map((y) => (
        <line key={y} x1="292" y1={y} x2="508" y2={y} stroke="#b45309" strokeWidth="3" />
      ))}

      {/* Extended rod */}
      <rect x="360" y="74" width="80" height="128" fill="#e2e8f0" stroke="#475569" strokeWidth="4" />
      <rect x="344" y="74" width="112" height="18" fill="#64748b" stroke="#1e293b" strokeWidth="3" />

      {/* Hydraulic feed */}
      <path d="M286 300 C 200 300, 170 350, 90 350" stroke="#0284c7" strokeWidth="12" fill="none" strokeLinecap="round" />
      <path d="M286 300 C 200 300, 170 350, 90 350" stroke="#38bdf8" strokeWidth="4" fill="none" strokeLinecap="round" />

      {/* Pressure gauge */}
      <circle cx="600" cy="250" r="52" fill="#ffffff" stroke="#334155" strokeWidth="4" />
      <circle cx="600" cy="250" r="42" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2 - Math.PI / 2;
        return (
          <line
            key={i}
            x1={600 + Math.cos(angle) * 34}
            y1={250 + Math.sin(angle) * 34}
            x2={600 + Math.cos(angle) * 41}
            y2={250 + Math.sin(angle) * 41}
            stroke="#64748b"
            strokeWidth="2"
          />
        );
      })}
      <line x1="600" y1="250" x2="628" y2="224" stroke="#dc2626" strokeWidth="4" strokeLinecap="round" />
      <circle cx="600" cy="250" r="6" fill="#334155" />
      <text x="600" y="322" textAnchor="middle" fontSize="15" fontFamily="ui-monospace, monospace" fill="#475569">
        700 bar
      </text>

      {/* Capacity stamp */}
      <text x="400" y="290" textAnchor="middle" fontSize="34" fontFamily="ui-monospace, monospace" fontWeight="700" fill="#78350f">
        100 T
      </text>
    </>
  );
}

function BeforeAfter(): JSX.Element {
  const ground = 356;
  const mid = W / 2;

  return (
    <>
      <Sky from="#e0f2fe" to="#f8fafc" />

      {/* BEFORE — sunk below carriageway, standing water */}
      <g>
        <rect x="0" y={ground} width={mid} height={H - ground} fill="#a8a29e" />
        <rect x="0" y={ground - 40} width={mid} height="40" fill="#7dd3fc" opacity="0.55" />
        <line x1="0" y1={ground - 40} x2={mid} y2={ground - 40} stroke="#0284c7" strokeWidth="2.5" />
        <rect x="70" y={ground - 150} width="230" height="150" fill="#ffffff" stroke="#334155" strokeWidth="3" />
        <path d="M56 206 L185 152 L314 206 Z" fill="#e2e8f0" stroke="#334155" strokeWidth="3" strokeLinejoin="round" />
        <rect x="105" y={ground - 116} width="52" height="46" fill="#bae6fd" stroke="#0369a1" strokeWidth="2" />
        <rect x="215" y={ground - 116} width="52" height="46" fill="#bae6fd" stroke="#0369a1" strokeWidth="2" />
        <text x="30" y="52" fontSize="19" fontFamily="ui-monospace, monospace" fontWeight="700" fill="#b91c1c">
          BEFORE
        </text>
        <text x="30" y="76" fontSize="14" fontFamily="ui-monospace, monospace" fill="#475569">
          −3.0 ft TO ROAD
        </text>
      </g>

      {/* AFTER — raised clear, dry */}
      <g>
        <rect x={mid} y={ground} width={mid} height={H - ground} fill="#a8a29e" />
        <rect x={mid + 70} y={ground - 78} width="230" height="78" fill="#cbd5e1" stroke="#475569" strokeWidth="2.5" />
        <rect x={mid + 56} y={ground - 96} width="258" height="18" fill="#f1f5f9" stroke="#334155" strokeWidth="3" />
        <rect x={mid + 70} y={ground - 246} width="230" height="150" fill="#ffffff" stroke="#334155" strokeWidth="3" />
        <path
          d={`M${mid + 56} ${ground - 246} L${mid + 185} ${ground - 300} L${mid + 314} ${ground - 246} Z`}
          fill="#e2e8f0"
          stroke="#334155"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <rect x={mid + 105} y={ground - 212} width="52" height="46" fill="#bae6fd" stroke="#0369a1" strokeWidth="2" />
        <rect x={mid + 215} y={ground - 212} width="52" height="46" fill="#bae6fd" stroke="#0369a1" strokeWidth="2" />
        <text x={mid + 30} y="52" fontSize="19" fontFamily="ui-monospace, monospace" fontWeight="700" fill="#15803d">
          AFTER
        </text>
        <text x={mid + 30} y="76" fontSize="14" fontFamily="ui-monospace, monospace" fill="#475569">
          +2.0 ft TO ROAD
        </text>
      </g>

      {/* Split seam */}
      <line x1={mid} y1="0" x2={mid} y2={H} stroke="#ffffff" strokeWidth="6" />
      <line x1={mid} y1="0" x2={mid} y2={H} stroke="#334155" strokeWidth="2" strokeDasharray="12 8" />
    </>
  );
}

function RccPillar(): JSX.Element {
  const ground = 372;

  return (
    <>
      <Sky from="#f1f5f9" to="#e2e8f0" />
      <Ground y={ground} fill="#78716c" />

      {/* Underside of the suspended structure */}
      <rect x="0" y="0" width={W} height="96" fill="#94a3b8" stroke="#334155" strokeWidth="3" />
      <rect x="0" y="96" width={W} height="12" fill="#cbd5e1" />

      {/* Formwork on the left column */}
      <rect x="140" y="108" width="140" height={ground - 108} fill="#a16207" opacity="0.28" stroke="#78350f" strokeWidth="2.5" />
      {[160, 230, 300].map((y) => (
        <rect key={y} x="132" y={y} width="156" height="12" fill="#78350f" opacity="0.8" />
      ))}

      {/* Exposed rebar cage on the right column */}
      <g stroke="#334155" strokeWidth="4" fill="none">
        {[470, 500, 530, 560, 590].map((x) => (
          <line key={x} x1={x} y1="108" x2={x} y2={ground} />
        ))}
        {/* Stirrups */}
        {Array.from({ length: 7 }, (_, i) => (
          <rect key={i} x="462" y={130 + i * 36} width="136" height="14" rx="3" stroke="#475569" strokeWidth="3" />
        ))}
      </g>
      <rect x="450" y="108" width="160" height={ground - 108} fill="#cbd5e1" opacity="0.35" />

      {/* Poured concrete at the base */}
      <rect x="440" y={ground - 54} width="180" height="54" fill="#cbd5e1" stroke="#475569" strokeWidth="2.5" />

      <text x="152" y={ground + 42} fontSize="15" fontFamily="ui-monospace, monospace" fill="#475569">
        SHUTTERED
      </text>
      <text x="400" y={ground + 42} fontSize="13" fontFamily="ui-monospace, monospace" fill="#475569">
        Fe500D CAGE · M20 (OR AS PER REQ.)
      </text>
    </>
  );
}

function Temple(): JSX.Element {
  const ground = 366;

  return (
    <>
      <Sky from="#fef3c7" to="#f8fafc" />
      <Ground y={ground} fill="#a8a29e" />

      {/* Rail track for the horizontal move */}
      <rect x="0" y={ground - 22} width={W} height="10" fill="#64748b" stroke="#1e293b" strokeWidth="2" />
      <rect x="0" y={ground - 8} width={W} height="8" fill="#64748b" stroke="#1e293b" strokeWidth="2" />
      {Array.from({ length: 16 }, (_, i) => (
        <rect key={i} x={i * 52} y={ground - 26} width="16" height="26" fill="#78350f" opacity="0.5" />
      ))}

      {/* Base platform on rollers */}
      <rect x="250" y={ground - 46} width="300" height="24" fill="#cbd5e1" stroke="#475569" strokeWidth="2.5" />
      {[280, 340, 400, 460, 520].map((x) => (
        <circle key={x} cx={x} cy={ground - 16} r="9" fill="#e2e8f0" stroke="#334155" strokeWidth="2.5" />
      ))}

      {/* Sanctum + shikhara */}
      <rect x="286" y={ground - 152} width="228" height="106" fill="#fffbeb" stroke="#78350f" strokeWidth="3" />
      <path
        d={`M296 ${ground - 152} Q 400 ${ground - 320} 504 ${ground - 152} Z`}
        fill="#fde68a"
        stroke="#78350f"
        strokeWidth="3"
      />
      {/* Tiered bands on the tower */}
      {[0, 1, 2].map((i) => (
        <path
          key={i}
          d={`M${316 + i * 16} ${ground - 186 - i * 34} Q 400 ${ground - 240 - i * 34} ${484 - i * 16} ${ground - 186 - i * 34}`}
          fill="none"
          stroke="#b45309"
          strokeWidth="2.5"
        />
      ))}
      <circle cx="400" cy={ground - 316} r="12" fill="#d97706" stroke="#78350f" strokeWidth="2.5" />
      {/* Doorway */}
      <rect x="374" y={ground - 108} width="52" height="62" fill="#78350f" opacity="0.85" />

      {/* Movement vector */}
      <g stroke="#0284c7" strokeWidth="3" fill="none">
        <line x1="600" y1={ground - 78} x2="740" y2={ground - 78} strokeDasharray="10 6" />
        <path d="M726 232 L744 244 L726 256" />
      </g>
      <text x="600" y={ground - 92} fontSize="15" fontFamily="ui-monospace, monospace" fill="#0369a1">
        18 m
      </text>
    </>
  );
}

function VillaFlood(): JSX.Element {
  const ground = 352;
  const lift = 108;

  return (
    <>
      <Sky from="#cbd5e1" to="#e2e8f0" />

      {/* Rain */}
      <g stroke="#7dd3fc" strokeWidth="2" opacity="0.5">
        {Array.from({ length: 34 }, (_, i) => {
          const x = (i * 97) % W;
          const y = (i * 53) % 300;
          return <line key={i} x1={x} y1={y} x2={x - 8} y2={y + 22} />;
        })}
      </g>

      <Ground y={ground} fill="#78716c" />
      {/* Standing water */}
      <rect x="0" y={ground - 34} width={W} height="34" fill="#38bdf8" opacity="0.45" />
      <path
        d={`M0 ${ground - 34} Q 60 ${ground - 42} 120 ${ground - 34} T 240 ${ground - 34} T 360 ${ground - 34} T 480 ${ground - 34} T 600 ${ground - 34} T 720 ${ground - 34} T 840 ${ground - 34}`}
        fill="none"
        stroke="#0284c7"
        strokeWidth="2.5"
      />

      {/* Raised plinth clear of the water */}
      <rect x="258" y={ground - lift} width="284" height={lift} fill="#cbd5e1" stroke="#475569" strokeWidth="2.5" />
      {[300, 400, 500].map((x) => (
        <Jack key={x} x={x} baseY={ground} extension={lift - 36} />
      ))}

      <g transform={`translate(0 ${-lift})`}>
        <rect x="244" y={ground - 18} width="312" height="18" fill="#f1f5f9" stroke="#334155" strokeWidth="3" />
        <HouseBody x={258} y={ground - 18} w={284} h={168} />
      </g>

      <Dimension x={206} topY={ground - lift} bottomY={ground} label="7.0 ft" />
    </>
  );
}

function ControlPanel(): JSX.Element {
  return (
    <>
      <Sky from="#f1f5f9" to="#e2e8f0" />

      {/* Console body */}
      <rect x="90" y="80" width="620" height="300" fill="#334155" stroke="#0f172a" strokeWidth="4" rx="10" />
      <rect x="106" y="96" width="588" height="196" fill="#0f172a" rx="6" />

      {/* Six circuit channel readouts */}
      {Array.from({ length: 6 }, (_, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const x = 128 + col * 192;
        const y = 116 + row * 92;
        return (
          <g key={i}>
            <rect x={x} y={y} width="168" height="74" fill="#1e293b" stroke="#475569" strokeWidth="2" rx="4" />
            <text x={x + 12} y={y + 24} fontSize="13" fontFamily="ui-monospace, monospace" fill="#64748b">
              CIRCUIT {i + 1}
            </text>
            <text x={x + 12} y={y + 54} fontSize="24" fontFamily="ui-monospace, monospace" fontWeight="700" fill="#38bdf8">
              {(680 + i * 4).toString()} bar
            </text>
            {/* Channel bar */}
            <rect x={x + 108} y={y + 34} width="48" height="8" fill="#0f172a" rx="4" />
            <rect x={x + 108} y={y + 34} width={26 + i * 4} height="8" fill="#22c55e" rx="4" />
          </g>
        );
      })}

      {/* Control row: amber emergency stop, levers, status lamps */}
      <circle cx="180" cy="336" r="30" fill="#dc2626" stroke="#7f1d1d" strokeWidth="4" />
      <circle cx="180" cy="336" r="18" fill="#ef4444" />
      <text x="180" y="382" textAnchor="middle" fontSize="12" fontFamily="ui-monospace, monospace" fill="#94a3b8">
        E-STOP
      </text>

      {[290, 350, 410].map((x) => (
        <g key={x}>
          <rect x={x - 9} y="312" width="18" height="48" fill="#64748b" rx="4" />
          <rect x={x - 15} y="306" width="30" height="16" fill="#f59e0b" rx="4" />
        </g>
      ))}

      {[500, 542, 584, 626].map((x, i) => (
        <circle key={x} cx={x} cy="336" r="12" fill={i === 3 ? "#f59e0b" : "#22c55e"} stroke="#0f172a" strokeWidth="2" />
      ))}

      {/* Operator silhouettes, for scale */}
      <g fill="#475569" opacity="0.9">
        <circle cx="56" cy="286" r="26" />
        <path d="M14 450 L14 356 Q 14 320 56 320 Q 98 320 98 356 L98 450 Z" />
        <circle cx="748" cy="298" r="23" />
        <path d="M712 450 L712 366 Q 712 334 748 334 Q 784 334 784 366 L784 450 Z" />
      </g>
      {/* Hi-vis vest bands */}
      <rect x="20" y="370" width="72" height="14" fill="#f59e0b" />
      <rect x="716" y="382" width="64" height="12" fill="#f59e0b" />
    </>
  );
}

const SCENES: Record<PlateScene, () => JSX.Element> = {
  "raised-house": RaisedHouse,
  "jack-array": JackArray,
  "commercial-block": CommercialBlock,
  heritage: Heritage,
  "jack-closeup": JackCloseup,
  "before-after": BeforeAfter,
  "rcc-pillar": RccPillar,
  temple: Temple,
  "villa-flood": VillaFlood,
  "control-panel": ControlPanel,
};

interface ProjectPlateProps {
  scene: PlateScene;
  /** Site photograph. Wins over the vector scene when it loads. */
  photo?: string;
  /**
   * Describes the photograph for screen readers. Required alongside `photo` —
   * the vector scenes are decorative, but a real site photograph carries
   * information, so it cannot be shipped unlabelled.
   */
  alt?: string;
  className?: string;
}

export function ProjectPlate({
  scene,
  photo,
  alt,
  className,
}: ProjectPlateProps): JSX.Element {
  const Scene = SCENES[scene];
  // A missing or misnamed file degrades to the vector rather than a broken
  // frame — the grid stays presentable while photos are still being collected.
  const [failed, setFailed] = useState(false);

  if (photo && !failed) {
    return (
      <Image
        src={photo}
        alt={alt ?? ""}
        fill
        // Three-up on desktop, two-up on tablet, full-bleed on mobile.
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className={cn("object-cover", className)}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="presentation"
      aria-hidden
    >
      <Scene />
    </svg>
  );
}
