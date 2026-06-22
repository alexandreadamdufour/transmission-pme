"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { bodaccMockData } from "@/data/bodacc-mock";

// ─── Isometric geometry helpers ───────────────────────────────────────────────

const TILE_W = 64;
const TILE_H = 32;
const COLS = 8;
const ROWS = 6;
const OFFSET_X = 280;
const OFFSET_Y = 60;

function isoToScreen(col: number, row: number) {
  return {
    x: OFFSET_X + (col - row) * (TILE_W / 2),
    y: OFFSET_Y + (col + row) * (TILE_H / 2),
  };
}

// ─── Building shapes ─────────────────────────────────────────────────────

type BuildingType = "shop" | "office" | "house" | "warehouse";

interface BuildingDef {
  type: BuildingType;
  h: number;
  topColor: string;
  leftColor: string;
  rightColor: string;
  roofColor: string;
}

const BUILDING_DEFS: BuildingDef[] = [
  { type: "shop",      h: 28, topColor: "#3a5a8a", leftColor: "#2E3F5C", rightColor: "#1B2A4A", roofColor: "#4A6FA8" },
  { type: "office",    h: 56, topColor: "#3a5a8a", leftColor: "#2E3F5C", rightColor: "#1B2A4A", roofColor: "#4A6FA8" },
  { type: "house",     h: 32, topColor: "#5a6e52", leftColor: "#3d4f38", rightColor: "#2d3a29", roofColor: "#7a9670" },
  { type: "warehouse", h: 20, topColor: "#7a6a4a", leftColor: "#5a4e38", rightColor: "#3d3528", roofColor: "#9a8a5a" },
];

function pickDef(seed: number): BuildingDef {
  return BUILDING_DEFS[seed % BUILDING_DEFS.length];
}

function buildingPaths(col: number, row: number, def: BuildingDef) {
  const { x, y } = isoToScreen(col, row);
  const w2 = TILE_W / 2;
  const h4 = TILE_H / 2;
  const bh = def.h;

  const top = [
    `${x},${y - bh}`,
    `${x + w2},${y + h4 - bh}`,
    `${x},${y + TILE_H - bh}`,
    `${x - w2},${y + h4 - bh}`,
  ].join(" ");

  const left = [
    `${x - w2},${y + h4 - bh}`,
    `${x},${y + TILE_H - bh}`,
    `${x},${y + TILE_H}`,
    `${x - w2},${y + h4}`,
  ].join(" ");

  const right = [
    `${x + w2},${y + h4 - bh}`,
    `${x},${y + TILE_H - bh}`,
    `${x},${y + TILE_H}`,
    `${x + w2},${y + h4}`,
  ].join(" ");

  return { top, left, right, cx: x, cy: y - bh + TILE_H / 2 };
}

// ─── State types ──────────────────────────────────────────────────────────────

type BuildingState = "idle" | "appearing" | "burning" | "rubble";

interface Building {
  id: string;
  col: number;
  row: number;
  def: BuildingDef;
  state: BuildingState;
  stateAt: number;
}

interface VillageEvent {
  id: string;
  kind: "cession" | "liquidation";
  label: string;
  ville: string;
  at: number;
}

function makeGrid(): Building[] {
  const buildings: Building[] = [];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const seed = col * 13 + row * 7;
      buildings.push({
        id: `${col}-${row}`,
        col,
        row,
        def: pickDef(seed),
        state: "idle",
        stateAt: 0,
      });
    }
  }
  return buildings;
}

const EXTENDED_EVENTS = [
  ...bodaccMockData.map((a) => ({
    id: a.id,
    kind: (a.type === "dissolution" ? "liquidation" : "cession") as "cession" | "liquidation",
    label: a.raisonSociale,
    ville: a.ville,
    at: 0,
  })),
  { id: "fake-1", kind: "liquidation" as const, label: "Librairie Les Mots Perdus", ville: "Arles", at: 0 },
  { id: "fake-2", kind: "cession" as const,     label: "Fromagerie Martin", ville: "Annecy", at: 0 },
  { id: "fake-3", kind: "liquidation" as const, label: "Agence Photo Lumière", ville: "Rennes", at: 0 },
  { id: "fake-4", kind: "cession" as const,     label: "Pharmacie du Centre", ville: "Dijon", at: 0 },
  { id: "fake-5", kind: "liquidation" as const, label: "Cabinet Conseil RH Pro", ville: "Metz", at: 0 },
  { id: "fake-6", kind: "cession" as const,     label: "Atelier Céramique Feu", ville: "Limoges", at: 0 },
];

export default function IsometricVillage() {
  const [buildings, setBuildings] = useState<Building[]>(makeGrid);
  const [events, setEvents] = useState<VillageEvent[]>([]);
  const [counts, setCounts] = useState({ cessions: 0, liquidations: 0 });
  const tickRef = useRef(0);
  const eventQueueRef = useRef([...EXTENDED_EVENTS]);

  const fireEvent = useCallback(() => {
    if (eventQueueRef.current.length === 0) {
      eventQueueRef.current = [...EXTENDED_EVENTS];
    }
    const ev = { ...eventQueueRef.current.shift()!, at: Date.now() };
    ev.id = `${ev.id}-${Date.now()}`;

    setBuildings((prev) => {
      const idles = prev.filter((b) => b.state === "idle");
      if (!idles.length) return prev;
      const target = idles[Math.floor(Math.random() * idles.length)];
      return prev.map((b) =>
        b.id === target.id
          ? { ...b, state: ev.kind === "cession" ? "appearing" : "burning", stateAt: Date.now() }
          : b
      );
    });

    setEvents((prev) => [ev, ...prev].slice(0, 8));
    setCounts((prev) => ({
      cessions: prev.cessions + (ev.kind === "cession" ? 1 : 0),
      liquidations: prev.liquidations + (ev.kind === "liquidation" ? 1 : 0),
    }));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setBuildings((prev) =>
        prev.map((b) => {
          if (b.state === "idle" || b.state === "rubble") return b;
          const age = Date.now() - b.stateAt;
          if (age > 3500) return { ...b, state: b.state === "burning" ? "rubble" : "idle", stateAt: Date.now() };
          return b;
        })
      );
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setBuildings((prev) =>
        prev.map((b) => {
          if (b.state !== "rubble") return b;
          const age = Date.now() - b.stateAt;
          if (age > 4000) return { ...b, state: "appearing", stateAt: Date.now() };
          return b;
        })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      tickRef.current++;
      fireEvent();
    }, 2500);
    setTimeout(fireEvent, 600);
    return () => clearInterval(id);
  }, [fireEvent]);

  const sorted = [...buildings].sort((a, b) => (a.col + a.row) - (b.col + b.row));

  return (
    <section className="bg-[#0D1929] py-16 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <p className="text-[#C4623A] text-sm font-semibold tracking-widest uppercase mb-2">
          Village économique
        </p>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <h2
            className="text-3xl md:text-4xl font-bold text-white"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Transmissions en cours
          </h2>
          <div className="flex gap-4">
            <div className="bg-[#1B2A4A] border border-[#2E3F5C] rounded px-4 py-2 text-center min-w-[100px]">
              <div className="text-2xl font-bold text-white tabular-nums">{counts.cessions}</div>
              <div className="text-xs text-[#4A6FA8] mt-0.5">Cessions</div>
            </div>
            <div className="bg-[#2A1010] border border-[#5a2020] rounded px-4 py-2 text-center min-w-[100px]">
              <div className="text-2xl font-bold text-[#ff6b6b] tabular-nums">{counts.liquidations}</div>
              <div className="text-xs text-[#a05050] mt-0.5">Liquidations</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-8 items-start">
        <div className="w-full lg:w-64 shrink-0 space-y-2 lg:max-h-[420px] overflow-hidden">
          <p className="text-[#4A5A78] text-xs font-semibold uppercase tracking-wider mb-3">
            Dernières annonces
          </p>
          {events.map((ev) => (
            <div
              key={ev.id}
              className={`rounded border px-3 py-2.5 text-xs ${
                ev.kind === "cession"
                  ? "border-[#2E3F5C] bg-[#1B2A4A]"
                  : "border-[#5a2020] bg-[#2A1010]"
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span
                  className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    ev.kind === "cession" ? "bg-[#4A6FA8]" : "bg-[#C4623A]"
                  }`}
                />
                <span className={`font-semibold ${ev.kind === "cession" ? "text-[#A8C0E0]" : "text-[#ff8888]"}`}>
                  {ev.kind === "cession" ? "Cession" : "Liquidation"}
                </span>
              </div>
              <p className="text-white font-medium leading-snug">{ev.label}</p>
              <p className="text-[#4A5A78] mt-0.5">{ev.ville}</p>
            </div>
          ))}
          {events.length === 0 && (
            <p className="text-[#2E3F5C] text-xs italic">En attente d&apos;annonces…</p>
          )}
        </div>

        <div className="flex-1 relative">
          <svg
            viewBox="0 0 660 420"
            className="w-full max-w-2xl mx-auto"
            style={{ overflow: "visible" }}
          >
            {sorted.map(({ id, col, row }) => {
              const { x, y } = isoToScreen(col, row);
              const w2 = TILE_W / 2;
              const h2 = TILE_H / 2;
              const pts = [
                `${x},${y}`,
                `${x + w2},${y + h2}`,
                `${x},${y + TILE_H}`,
                `${x - w2},${y + h2}`,
              ].join(" ");
              return (
                <polygon
                  key={`ground-${id}`}
                  points={pts}
                  fill="#0f1f35"
                  stroke="#1a2d45"
                  strokeWidth={0.5}
                />
              );
            })}

            {sorted.map((b) => {
              const { top, left, right, cx, cy } = buildingPaths(b.col, b.row, b.def);

              if (b.state === "rubble") {
                const { x, y } = isoToScreen(b.col, b.row);
                return (
                  <g key={b.id}>
                    <ellipse cx={x} cy={y + TILE_H * 0.6} rx={14} ry={6} fill="#3d1a1a" opacity={0.7} />
                    <rect x={x - 8} y={y + TILE_H * 0.4} width={5} height={5} fill="#5a2020" transform={`rotate(15,${x},${y})`} />
                    <rect x={x + 3} y={y + TILE_H * 0.45} width={4} height={4} fill="#4a1a1a" transform={`rotate(-10,${x},${y})`} />
                  </g>
                );
              }

              return (
                <g
                  key={b.id}
                  style={{
                    transformOrigin: `${cx}px ${cy}px`,
                    animation:
                      b.state === "appearing"
                        ? `iso-appear 0.6s cubic-bezier(.22,1,.36,1) forwards`
                        : undefined,
                  }}
                >
                  <style>{`
                    @keyframes iso-appear {
                      from { transform: scaleY(0); opacity: 0; }
                      to   { transform: scaleY(1); opacity: 1; }
                    }
                  `}</style>

                  {b.state === "burning" && (
                    <ellipse
                      cx={cx}
                      cy={cy + b.def.h * 0.5}
                      rx={TILE_W * 0.55}
                      ry={TILE_H * 0.9}
                      fill="#ff3300"
                      opacity={0}
                    >
                      <animate attributeName="opacity" values="0;0.35;0.15;0.4;0.2;0" dur="3s" repeatCount="1" />
                    </ellipse>
                  )}

                  <polygon points={left} fill={b.state === "burning" ? "#8B1A1A" : b.def.leftColor}>
                    {b.state === "burning" && (
                      <animate attributeName="fill" values="#8B1A1A;#CC2200;#8B1A1A;#AA1100;#8B1A1A" dur="0.8s" repeatCount="indefinite" />
                    )}
                  </polygon>
                  <polygon points={right} fill={b.state === "burning" ? "#6B1010" : b.def.rightColor}>
                    {b.state === "burning" && (
                      <animate attributeName="fill" values="#6B1010;#991800;#6B1010;#881500;#6B1010" dur="0.9s" repeatCount="indefinite" />
                    )}
                  </polygon>
                  <polygon points={top} fill={b.state === "burning" ? "#AA2200" : b.def.topColor}>
                    {b.state === "burning" && (
                      <animate attributeName="fill" values="#AA2200;#FF4400;#AA2200;#DD3300;#AA2200" dur="0.7s" repeatCount="indefinite" />
                    )}
                  </polygon>

                  {b.state !== "burning" && (
                    <polygon points={top} fill={b.def.roofColor} opacity={0.3} />
                  )}

                  {b.state === "idle" && b.def.h >= 32 && (() => {
                    const { x, y } = isoToScreen(b.col, b.row);
                    const wx = x + TILE_W * 0.1;
                    const wy = y + TILE_H * 0.3 - b.def.h + 6;
                    return (
                      <g opacity={0.7}>
                        <rect x={wx} y={wy} width={4} height={3} fill="#FFE87A" rx={0.5} />
                        <rect x={wx + 8} y={wy} width={4} height={3} fill="#FFE87A" rx={0.5} />
                        {b.def.h >= 50 && <rect x={wx} y={wy + 10} width={4} height={3} fill="#FFE87A" rx={0.5} />}
                        {b.def.h >= 50 && <rect x={wx + 8} y={wy + 10} width={4} height={3} fill="#FFE87A" rx={0.5} />}
                      </g>
                    );
                  })()}

                  {b.state === "burning" && (() => {
                    const { x, y } = isoToScreen(b.col, b.row);
                    return (
                      <g>
                        {[0, 1, 2].map((i) => (
                          <ellipse
                            key={i}
                            cx={x + (i - 1) * 8}
                            cy={y - b.def.h + 4}
                            rx={5}
                            ry={8}
                            fill={i === 1 ? "#FF6600" : "#FF3300"}
                            opacity={0}
                          >
                            <animate attributeName="opacity" values="0;0.9;0.5;0.8;0" dur={`${0.5 + i * 0.15}s`} repeatCount="indefinite" />
                            <animate attributeName="ry" values="8;14;9;12;8" dur={`${0.4 + i * 0.1}s`} repeatCount="indefinite" />
                            <animate
                              attributeName="cy"
                              values={`${y - b.def.h + 4};${y - b.def.h - 4};${y - b.def.h + 2};${y - b.def.h - 2};${y - b.def.h + 4}`}
                              dur={`${0.5 + i * 0.12}s`}
                              repeatCount="indefinite"
                            />
                          </ellipse>
                        ))}
                      </g>
                    );
                  })()}

                  {b.state === "appearing" && (
                    <circle cx={cx} cy={cy - b.def.h / 2} r={16} fill="none" stroke="#4A6FA8" strokeWidth={1.5} opacity={0}>
                      <animate attributeName="r" values="8;28" dur="0.5s" fill="freeze" />
                      <animate attributeName="opacity" values="0.8;0" dur="0.5s" fill="freeze" />
                    </circle>
                  )}
                </g>
              );
            })}
          </svg>

          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2 text-xs text-[#4A5A78]">
              <span className="w-3 h-3 rounded-sm bg-[#3a5a8a] inline-block" />
              Cession réussie
            </div>
            <div className="flex items-center gap-2 text-xs text-[#4A5A78]">
              <span className="w-3 h-3 rounded-sm bg-[#C4623A] inline-block" />
              Liquidation judiciaire
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
