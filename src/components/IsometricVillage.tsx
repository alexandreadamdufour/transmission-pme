"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { bodaccMockData } from "@/data/bodacc-mock";

// ─── Geometry ─────────────────────────────────────────────────────

const W2 = 38;   // half tile width
const H2 = 19;   // half tile height
const TH = 38;   // full tile height
const COLS = 7;
const ROWS = 5;
const OX = 298;  // svg origin x
const OY = 88;   // svg origin y

function iso(col: number, row: number) {
  return {
    x: OX + (col - row) * W2,
    y: OY + (col + row) * H2,
  };
}

// Point on the right wall face parameterised by (u, v) ∈ [0,1]²
function rwPt(x: number, y: number, bh: number, u: number, v: number) {
  return [x + W2 - u * W2, y + H2 - bh + u * H2 + v * bh] as [number, number];
}

function quad(pts: [number, number][]) {
  return pts.map((p) => p.join(",")).join(" ");
}

function wallWindow(x: number, y: number, bh: number, u: number, v: number, dw: number, dh: number) {
  return quad([
    rwPt(x, y, bh, u, v),
    rwPt(x, y, bh, u + dw, v),
    rwPt(x, y, bh, u + dw, v + dh),
    rwPt(x, y, bh, u, v + dh),
  ]);
}

// ─── Building definitions ────────────────────────────────────────────────

interface BDef {
  wallH: number;
  roofH: number;
  wL: string; wR: string; wTop: string;
  rL: string; rR: string;
  chimney: boolean;
  wins: [number, number, number, number][];
  door?: [number, number, number, number];
}

const BDEFS: BDef[] = [
  // 0 — house, terracotta roof
  {
    wallH: 30, roofH: 22,
    wL: "#B0987A", wR: "#CCAF8A", wTop: "#DFC9A8",
    rL: "#8C2E10", rR: "#B84020",
    chimney: true,
    wins: [[0.18, 0.22, 0.20, 0.26], [0.58, 0.22, 0.20, 0.26]],
    door: [0.36, 0.56, 0.26, 0.42],
  },
  // 1 — apartment, slate blue
  {
    wallH: 60, roofH: 10,
    wL: "#3A5470", wR: "#4A6A88", wTop: "#5A7898",
    rL: "#283844", rR: "#384A58",
    chimney: false,
    wins: [
      [0.08, 0.08, 0.20, 0.14], [0.40, 0.08, 0.20, 0.14], [0.72, 0.08, 0.20, 0.14],
      [0.08, 0.33, 0.20, 0.14], [0.40, 0.33, 0.20, 0.14], [0.72, 0.33, 0.14, 0.14],
      [0.08, 0.58, 0.20, 0.14], [0.40, 0.58, 0.20, 0.14],
    ],
    door: [0.36, 0.80, 0.26, 0.20],
  },
  // 2 — shop, warm beige
  {
    wallH: 24, roofH: 0,
    wL: "#907860", wR: "#AEAA88", wTop: "#CCBFA0",
    rL: "#C4623A", rR: "#D4743A",
    chimney: false,
    wins: [[0.08, 0.10, 0.52, 0.56]],
    door: [0.66, 0.32, 0.28, 0.66],
  },
  // 3 — cottage, steep roof
  {
    wallH: 22, roofH: 28,
    wL: "#A09080", wR: "#C0AE98", wTop: "#D8CCB8",
    rL: "#7A3018", rR: "#9A4228",
    chimney: true,
    wins: [[0.25, 0.28, 0.48, 0.42]],
    door: [0.32, 0.58, 0.36, 0.42],
  },
];

function bdef(seed: number) { return BDEFS[seed % BDEFS.length]; }

// ─── SVG building ─────────────────────────────────────────────────────

function Building({ col, row, def, state }: {
  col: number; row: number; def: BDef; state: string;
}) {
  const { x, y } = iso(col, row);
  const bh = def.wallH;
  const rh = def.roofH;
  const burning = state === "burning";

  const leftWall  = `${x-W2},${y+H2-bh} ${x},${y+TH-bh} ${x},${y+TH} ${x-W2},${y+H2}`;
  const rightWall = `${x+W2},${y+H2-bh} ${x},${y+TH-bh} ${x},${y+TH} ${x+W2},${y+H2}`;
  const topFace   = `${x},${y-bh} ${x+W2},${y+H2-bh} ${x},${y+TH-bh} ${x-W2},${y+H2-bh}`;

  const ridgeY = y + H2 - bh - rh;
  const leftRoof  = rh > 0 ? `${x-W2},${y+H2-bh} ${x},${y+TH-bh} ${x},${y-bh} ${x-W2},${ridgeY}` : null;
  const rightRoof = rh > 0 ? `${x+W2},${y+H2-bh} ${x},${y+TH-bh} ${x},${y-bh} ${x+W2},${ridgeY}` : null;

  const chx = x - W2 * 0.52;
  const chy = ridgeY - 14;
  const chH = 13;
  const chW = 5;

  return (
    <g>
      <ellipse cx={x} cy={y + TH + 3} rx={W2 * 0.75} ry={H2 * 0.35} fill="rgba(0,0,0,0.10)" />

      <polygon points={leftWall}  fill={burning ? "#7A1208" : def.wL} />
      <polygon points={rightWall} fill={burning ? "#601008" : def.wR} />
      <polygon points={topFace}   fill={burning ? "#991A10" : def.wTop} />

      {burning && (
        <>
          <polygon points={leftWall}>
            <animate attributeName="fill" values="#7A1208;#B83010;#7A1208" dur="0.8s" repeatCount="indefinite" />
          </polygon>
          <polygon points={rightWall}>
            <animate attributeName="fill" values="#601008;#962810;#601008" dur="0.9s" repeatCount="indefinite" />
          </polygon>
        </>
      )}

      <polygon points={leftWall}  fill="none" stroke="rgba(0,0,0,0.07)" strokeWidth={0.6} />
      <polygon points={rightWall} fill="none" stroke="rgba(0,0,0,0.07)" strokeWidth={0.6} />

      {!burning && leftRoof  && <polygon points={leftRoof}  fill={def.rL} />}
      {!burning && rightRoof && <polygon points={rightRoof} fill={def.rR} />}
      {!burning && rh > 0 && (
        <>
          <polygon points={leftRoof!}  fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth={0.6} />
          <polygon points={rightRoof!} fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth={0.6} />
          <line x1={x-W2} y1={ridgeY} x2={x+W2} y2={ridgeY} stroke="#5A2808" strokeWidth={1} />
          {[0.33, 0.66].map((t, i) => (
            <line
              key={i}
              x1={x - W2 + t * W2} y1={y + H2 - bh + t * (rh + bh - H2)}
              x2={x - W2 + t * W2} y2={ridgeY}
              stroke="rgba(0,0,0,0.08)" strokeWidth={0.5}
            />
          ))}
        </>
      )}

      {def.chimney && !burning && rh > 0 && (
        <g>
          <polygon points={`${chx-chW},${chy+chH/2} ${chx},${chy+chH} ${chx},${chy} ${chx-chW},${chy+chH/2-chH}`} fill="#6A4030" />
          <polygon points={`${chx+chW},${chy+chH/2} ${chx},${chy+chH} ${chx},${chy} ${chx+chW},${chy+chH/2-chH}`} fill="#7A5040" />
          <polygon points={`${chx},${chy-chH} ${chx+chW},${chy+chH/2-chH} ${chx},${chy} ${chx-chW},${chy+chH/2-chH}`} fill="#8A6050" />
          <ellipse cx={chx} cy={chy - chH - 5} rx={3} ry={4} fill="rgba(200,200,200,0.35)">
            <animate attributeName="cy" values={`${chy-chH-5};${chy-chH-14}`} dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.4;0" dur="2s" repeatCount="indefinite" />
            <animate attributeName="rx" values="3;6" dur="2s" repeatCount="indefinite" />
          </ellipse>
        </g>
      )}

      {!burning && def.wins.map(([u, v, dw, dh], i) => (
        <polygon key={i} points={wallWindow(x, y, bh, u, v, dw, dh)} fill="#FFF3A0" opacity={0.88} stroke="#C8A830" strokeWidth={0.5} />
      ))}

      {!burning && def.door && (
        <polygon points={wallWindow(x, y, bh, def.door[0], def.door[1], def.door[2], def.door[3])} fill="#7A5030" stroke="#5A3418" strokeWidth={0.5} />
      )}

      {state === "appearing" && (
        <g opacity={0.65}>
          {[-W2, 0, W2].map((dx, i) => (
            <line key={i} x1={x + dx} y1={y + TH} x2={x + dx} y2={y - bh - rh - 6}
              stroke="#A07840" strokeWidth={1} strokeDasharray="3,3" />
          ))}
          <line x1={x - W2} y1={y + H2} x2={x + W2} y2={y + H2} stroke="#A07840" strokeWidth={0.8} />
          <line x1={x - W2} y1={y + H2 - bh * 0.5} x2={x + W2} y2={y + H2 - bh * 0.5} stroke="#A07840" strokeWidth={0.8} />
        </g>
      )}

      {burning && (
        <g>
          <ellipse cx={x} cy={y - bh + 4} rx={W2 * 0.45} ry={H2 * 0.7} fill="#FF2200" opacity={0}>
            <animate attributeName="opacity" values="0;0.30;0.10;0.28;0" dur="1.8s" repeatCount="indefinite" />
          </ellipse>
          {[
            [x - 10, -4, 5, 10, "#FF6600", "0.42s"],
            [x,       -8, 6, 13, "#FF4400", "0.35s"],
            [x + 9,  -3, 4, 9,  "#FF8800", "0.50s"],
          ].map(([cx2, offY, rx, ry, fill, dur], i) => (
            <ellipse key={i} cx={cx2 as number} cy={y - bh + (offY as number)} rx={rx as number} ry={ry as number} fill={fill as string} opacity={0}>
              <animate attributeName="opacity" values="0;0.95;0.55;0.85;0" dur={dur as string} repeatCount="indefinite" />
              <animate attributeName="ry" values={`${ry};${(ry as number)*1.6};${(ry as number)*1.1};${(ry as number)*1.4};${ry}`} dur={dur as string} repeatCount="indefinite" />
              <animate
                attributeName="cy"
                values={`${y-bh+(offY as number)};${y-bh+(offY as number)-10};${y-bh+(offY as number)-3};${y-bh+(offY as number)-8};${y-bh+(offY as number)}`}
                dur={dur as string} repeatCount="indefinite"
              />
            </ellipse>
          ))}
        </g>
      )}
    </g>
  );
}

// ─── State types ─────────────────────────────────────────────────────

type BState = "idle" | "appearing" | "burning" | "rubble";

interface Bld {
  id: string; col: number; row: number;
  def: BDef; state: BState; stateAt: number;
}

interface VEvent {
  id: string; kind: "cession" | "liquidation";
  label: string; ville: string; secteur: string;
  price: string; at: number;
}

interface PTag {
  id: string; x: number; y: number; text: string; at: number;
}

function makeGrid(): Bld[] {
  const out: Bld[] = [];
  for (let row = 0; row < ROWS; row++)
    for (let col = 0; col < COLS; col++)
      out.push({ id: `${col}-${row}`, col, row, def: bdef(col * 13 + row * 7), state: "idle", stateAt: 0 });
  return out;
}

const PRICES = ["85k€", "150k€", "220k€", "310k€", "470k€", "650k€", "820k€"];
const ICONS  = ["🥖", "🔧", "📚", "🏨", "🚛", "🪵", "👗", "🌿", "💊", "🍽️", "🧀", "💼", "📷", "🎺"];

const ALL_EVENTS: Omit<VEvent, "at">[] = [
  ...bodaccMockData.map((a, i) => ({
    id: a.id,
    kind: (a.type === "dissolution" ? "liquidation" : "cession") as "cession" | "liquidation",
    label: a.raisonSociale, ville: a.ville,
    secteur: ICONS[i % ICONS.length],
    price: a.type === "dissolution" ? "—" : PRICES[i % PRICES.length],
  })),
  { id: "x1", kind: "liquidation", label: "Librairie Les Mots Perdus",  ville: "Arles",   secteur: "📚", price: "—" },
  { id: "x2", kind: "cession",     label: "Fromagerie Martin",           ville: "Annecy",  secteur: "🧀", price: "290k€" },
  { id: "x3", kind: "liquidation", label: "Agence Photo Lumière",   ville: "Rennes",  secteur: "📷", price: "—" },
  { id: "x4", kind: "cession",     label: "Pharmacie du Centre",         ville: "Dijon",   secteur: "💊", price: "520k€" },
  { id: "x5", kind: "liquidation", label: "Cabinet Conseil RH Pro",      ville: "Metz",    secteur: "💼", price: "—" },
  { id: "x6", kind: "cession",     label: "Atelier Céramique Feu",  ville: "Limoges", secteur: "🎺", price: "165k€" },
];

const DATE_A = new Date("2025-01-01").getTime();
const DATE_B = new Date("2025-12-31").getTime();

export default function IsometricVillage() {
  const [buildings,  setBuildings]  = useState<Bld[]>(makeGrid);
  const [events,     setEvents]     = useState<VEvent[]>([]);
  const [priceTags,  setPriceTags]  = useState<PTag[]>([]);
  const [counts,     setCounts]     = useState({ cessions: 0, liquidations: 0 });
  const [speed,      setSpeed]      = useState<0 | 1 | 2 | 4>(1);
  const [scrub,      setScrub]      = useState(0);

  const queueRef    = useRef([...ALL_EVENTS]);
  const buildingRef = useRef(buildings);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => { buildingRef.current = buildings; }, [buildings]);

  const fireEvent = useCallback(() => {
    if (queueRef.current.length === 0) queueRef.current = [...ALL_EVENTS];
    const raw = queueRef.current.shift()!;
    const ev: VEvent = { ...raw, at: Date.now(), id: `${raw.id}-${Date.now()}` };

    const idles = buildingRef.current.filter((b) => b.state === "idle");
    if (!idles.length) return;
    const target = idles[Math.floor(Math.random() * idles.length)];

    if (ev.kind === "cession" && ev.price !== "—") {
      const { x, y } = iso(target.col, target.row);
      setPriceTags((pts) => [
        ...pts.slice(-6),
        { id: `pt-${Date.now()}`, x, y: y - target.def.wallH - target.def.roofH - 8, text: `+${ev.price}`, at: Date.now() },
      ]);
    }

    setBuildings((prev) =>
      prev.map((b) =>
        b.id === target.id
          ? { ...b, state: ev.kind === "cession" ? "appearing" : "burning", stateAt: Date.now() }
          : b
      )
    );
    setEvents((prev) => [ev, ...prev].slice(0, 7));
    setCounts((prev) => ({
      cessions:     prev.cessions     + (ev.kind === "cession"     ? 1 : 0),
      liquidations: prev.liquidations + (ev.kind === "liquidation" ? 1 : 0),
    }));
    setScrub((v) => Math.min(v + 1.4, 100));
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      const now = Date.now();
      setBuildings((prev) =>
        prev.map((b) => {
          if (b.state === "idle" || b.state === "rubble") return b;
          if (now - b.stateAt > 3600)
            return { ...b, state: b.state === "burning" ? "rubble" : "idle", stateAt: now };
          return b;
        })
      );
      setPriceTags((pts) => pts.filter((p) => Date.now() - p.at < 2400));
    }, 450);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      const now = Date.now();
      setBuildings((prev) =>
        prev.map((b) =>
          b.state === "rubble" && now - b.stateAt > 4200
            ? { ...b, state: "appearing", stateAt: now }
            : b
        )
      );
    }, 900);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (speed === 0) return;
    const ms = 2600 / speed;
    setTimeout(fireEvent, 400);
    intervalRef.current = setInterval(fireEvent, ms);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [speed, fireEvent]);

  const sorted = [...buildings].sort((a, b) => (a.col + a.row) - (b.col + b.row));
  const scrubDate = new Date(DATE_A + (DATE_B - DATE_A) * scrub / 100)
    .toLocaleDateString("fr-FR", { month: "long", year: "numeric" });

  return (
    <section className="bg-[#F5F0E8] py-12">
      <div className="max-w-7xl mx-auto px-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-end gap-5">
          <div className="shrink-0">
            <p className="text-[#C4623A] text-xs font-semibold tracking-widest uppercase mb-1">
              Village économique
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#1B2A4A]" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
              Transmissions en cours
            </h2>
          </div>
          <div className="flex-1 max-w-lg">
            <div className="flex justify-between text-xs text-[#6B6560] mb-1.5">
              <span>janv. 2025</span>
              <span className="font-semibold text-[#1B2A4A]">{scrubDate}</span>
              <span>déc. 2025</span>
            </div>
            <input type="range" min={0} max={100} value={scrub}
              onChange={(e) => setScrub(Number(e.target.value))}
              className="w-full h-1.5 cursor-pointer accent-[#C4623A] rounded" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-6 items-start">

        <div className="w-full lg:w-64 shrink-0 space-y-2 max-h-[440px] overflow-hidden">
          <p className="text-[#6B6560] text-xs font-semibold uppercase tracking-wider mb-3">Dernières annonces</p>
          {events.length === 0 && (
            <div className="bg-white rounded-xl p-4 text-sm text-[#6B6560] border border-[#EAE3D6]">En attente d&apos;annonces…</div>
          )}
          {events.map((ev) => (
            <div key={ev.id} className={`bg-white rounded-xl px-4 py-3 shadow-sm border border-[#EAE3D6] ${
              ev.kind === "cession" ? "border-l-[3px] border-l-blue-500" : "border-l-[3px] border-l-red-500"
            }`}>
              <div className="flex items-start gap-2.5">
                <span className="text-xl leading-none mt-0.5 shrink-0">{ev.secteur}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#1B2A4A] text-sm leading-snug truncate">{ev.label}</p>
                  <p className="text-xs text-[#6B6560] mt-0.5">{ev.ville}</p>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${
                      ev.kind === "cession" ? "bg-blue-50 text-blue-700" : "bg-red-50 text-red-700"
                    }`}>{ev.kind === "cession" ? "Cession" : "Liquidation"}</span>
                    {ev.price !== "—" && <span className="text-xs font-semibold text-[#C4623A]">{ev.price}</span>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex-1 min-w-0">
          <svg viewBox="0 0 630 420" className="w-full" style={{ overflow: "visible" }}>
            <defs>
              <radialGradient id="meadow-grad" cx="50%" cy="48%" r="50%">
                <stop offset="0%"   stopColor="#72B87E" />
                <stop offset="55%"  stopColor="#4E9A5E" />
                <stop offset="100%" stopColor="#38784A" />
              </radialGradient>
              <radialGradient id="meadow-hi" cx="42%" cy="38%" r="40%">
                <stop offset="0%"  stopColor="#90D09A" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#90D09A" stopOpacity={0} />
              </radialGradient>
            </defs>

            <ellipse cx={310} cy={235} rx={305} ry={170} fill="url(#meadow-grad)" />
            <ellipse cx={290} cy={210} rx={220} ry={120} fill="url(#meadow-hi)" />
            <ellipse cx={310} cy={235} rx={305} ry={170} fill="none" stroke="#2A6038" strokeWidth={2} opacity={0.3} />

            {sorted.map(({ id, col, row }) => {
              const { x, y } = iso(col, row);
              const pts = `${x},${y} ${x+W2},${y+H2} ${x},${y+TH} ${x-W2},${y+H2}`;
              return <polygon key={`g-${id}`} points={pts} fill="#54A064" stroke="#3E8850" strokeWidth={0.5} />;
            })}

            {sorted.filter((b) => b.state === "rubble").map((b) => {
              const { x, y } = iso(b.col, b.row);
              return (
                <g key={`r-${b.id}`}>
                  <ellipse cx={x} cy={y+TH*0.65} rx={18} ry={8} fill="#6A3018" opacity={0.55} />
                  <rect x={x-9} y={y+TH*0.42} width={6} height={5} fill="#8A4020" rx={0.5} transform={`rotate(18,${x},${y+TH*0.5})`} />
                  <rect x={x+4}  y={y+TH*0.48} width={5} height={4} fill="#6A3018" rx={0.5} transform={`rotate(-12,${x},${y+TH*0.5})`} />
                  <rect x={x-3} y={y+TH*0.55} width={4} height={5} fill="#7A3820" rx={0.5} transform={`rotate(5,${x},${y+TH*0.5})`} />
                </g>
              );
            })}

            {sorted.filter((b) => b.state !== "rubble").map((b) => {
              const { x, y } = iso(b.col, b.row);
              return (
                <g key={b.id} style={{ transformOrigin: `${x}px ${y + TH}px`, animation: b.state === "appearing" ? "iso-pop 0.55s cubic-bezier(.22,1,.36,1) forwards" : undefined }}>
                  <Building col={b.col} row={b.row} def={b.def} state={b.state} />
                </g>
              );
            })}

            {priceTags.map((pt) => (
              <g key={pt.id} style={{ animation: "float-price 2.3s ease-out forwards" }}>
                <rect x={pt.x - 26} y={pt.y - 11} width={52} height={20} rx={10} fill="#1B2A4A" opacity={0.92} />
                <text x={pt.x} y={pt.y + 4} textAnchor="middle" fontSize={10} fontWeight="bold" fill="#4ADE80" style={{ fontFamily: "Inter, sans-serif" }}>{pt.text}</text>
              </g>
            ))}

            <style>{`
              @keyframes iso-pop {
                0%   { transform: scaleY(0);    opacity: 0; }
                65%  { transform: scaleY(1.06); opacity: 1; }
                100% { transform: scaleY(1);    opacity: 1; }
              }
              @keyframes float-price {
                0%   { transform: translateY(0);     opacity: 1; }
                75%  { opacity: 0.8; }
                100% { transform: translateY(-38px); opacity: 0; }
              }
            `}</style>
          </svg>

          <div className="flex items-center justify-end gap-2 mt-3">
            <span className="text-xs text-[#6B6560] mr-1">Vitesse :</span>
            <button onClick={() => setSpeed(0)} className={`w-8 h-7 rounded text-sm border transition-all ${speed === 0 ? "bg-[#1B2A4A] text-white border-[#1B2A4A]" : "bg-white text-[#6B6560] border-[#D5CCB8] hover:border-[#1B2A4A]"}` }>⏸</button>
            {([1, 2, 4] as const).map((s) => (
              <button key={s} onClick={() => setSpeed(s)} className={`px-2.5 h-7 rounded text-xs font-semibold border transition-all ${speed === s ? "bg-[#1B2A4A] text-white border-[#1B2A4A]" : "bg-white text-[#6B6560] border-[#D5CCB8] hover:border-[#1B2A4A]"}`}>×{s}</button>
            ))}
          </div>
        </div>

        <div className="w-full lg:w-48 shrink-0">
          <div className="bg-[#1B2A4A] rounded-2xl p-5 shadow-xl">
            <p className="text-[#4A6FA8] text-xs font-semibold uppercase tracking-wider mb-4">En direct</p>
            <div className="mb-4">
              <div className="text-5xl font-bold text-white tabular-nums leading-none" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>{counts.cessions}</div>
              <div className="text-[#4A6FA8] text-xs mt-1.5 uppercase tracking-wide">transmissions</div>
            </div>
            <div className="border-t border-[#2E3F5C] pt-4 mb-5">
              <div className="text-3xl font-bold text-[#FF6B6B] tabular-nums leading-none" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>{counts.liquidations}</div>
              <div className="text-[#A05050] text-xs mt-1.5 uppercase tracking-wide">liquidations</div>
            </div>
            <a href="#" onClick={(e) => e.preventDefault()}
              className="block bg-[#C4623A] hover:bg-[#D4743A] transition-colors text-white text-xs font-semibold text-center px-3 py-3 rounded-xl leading-snug">
              Faites-vous accompagner pour vendre votre société →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
