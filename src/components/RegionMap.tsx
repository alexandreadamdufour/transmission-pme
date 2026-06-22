"use client";

import { useState } from "react";
import { regionsData, RegionData } from "@/data/regions";

const REGION_POSITIONS: Record<string, { x: number; y: number; w: number; h: number; label: string }> = {
  "11": { x: 320, y: 140, w: 90, h: 70,  label: "Île-de-France" },
  "32": { x: 230, y: 60,  w: 120, h: 80, label: "Hauts-de-France" },
  "44": { x: 360, y: 80,  w: 130, h: 90, label: "Grand Est" },
  "28": { x: 180, y: 130, w: 130, h: 70, label: "Normandie" },
  "52": { x: 140, y: 235, w: 110, h: 80, label: "Pays de la Loire" },
  "24": { x: 270, y: 210, w: 100, h: 75, label: "Centre-Val de Loire" },
  "53": { x: 80,  y: 195, w: 100, h: 90, label: "Bretagne" },
  "27": { x: 370, y: 210, w: 110, h: 80, label: "Bourg.-Fr.-Comté" },
  "75": { x: 130, y: 325, w: 140, h: 120, label: "Nouvelle-Aquitaine" },
  "76": { x: 260, y: 365, w: 140, h: 110, label: "Occitanie" },
  "84": { x: 360, y: 295, w: 130, h: 110, label: "Auv.-Rhône-Alpes" },
  "93": { x: 390, y: 390, w: 120, h: 90, label: "PACA" },
  "94": { x: 440, y: 450, w: 50,  h: 50, label: "Corse" },
};

function intensityToColor(intensity: number): string {
  const r = Math.round(27  + (1 - intensity) * 180);
  const g = Math.round(42  + (1 - intensity) * 160);
  const b = Math.round(74  + (1 - intensity) * 120);
  return `rgb(${r},${g},${b})`;
}

export default function RegionMap() {
  const [hovered, setHovered] = useState<RegionData | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const regionById = Object.fromEntries(regionsData.map((r) => [r.id, r]));

  return (
    <section className="bg-[#1B2A4A] py-20 text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12">
          <p className="text-[#C4623A] text-sm font-semibold tracking-widest uppercase mb-3">
            Cartographie régionale
          </p>
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Intensité de transmission par région
          </h2>
          <p className="text-[#A8B8D4] max-w-2xl">
            Les régions les plus peuplées concentrent le plus grand nombre d&apos;entreprises à
            transmettre, mais les territoires ruraux affichent des taux de risque plus élevés
            faute d&apos;écosystèmes de repreneurs.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="relative">
            <svg
              viewBox="0 0 560 530"
              className="w-full max-w-lg mx-auto"
              style={{ filter: "drop-shadow(0 4px 24px rgba(0,0,0,0.3))" }}
            >
              {Object.entries(REGION_POSITIONS).map(([id, pos]) => {
                const region = regionById[id];
                if (!region) return null;
                const color = intensityToColor(region.intensity);
                const isHovered = hovered?.id === id;
                return (
                  <g key={id}>
                    <rect
                      x={pos.x}
                      y={pos.y}
                      width={pos.w}
                      height={pos.h}
                      rx={4}
                      fill={color}
                      stroke={isHovered ? "#C4623A" : "#1B2A4A"}
                      strokeWidth={isHovered ? 2.5 : 1}
                      style={{ cursor: "pointer", transition: "all 0.15s" }}
                      onMouseEnter={(e) => {
                        setHovered(region);
                        const rect = (e.target as SVGRectElement)
                          .closest("svg")!
                          .getBoundingClientRect();
                        setTooltipPos({
                          x: e.clientX - rect.left,
                          y: e.clientY - rect.top,
                        });
                      }}
                      onMouseLeave={() => setHovered(null)}
                    />
                    <text
                      x={pos.x + pos.w / 2}
                      y={pos.y + pos.h / 2 - 4}
                      textAnchor="middle"
                      fontSize={9}
                      fill="rgba(255,255,255,0.85)"
                      style={{ pointerEvents: "none", fontFamily: "Inter, sans-serif" }}
                    >
                      {pos.label.split(" ").map((word, i, arr) => (
                        <tspan key={i} x={pos.x + pos.w / 2} dy={i === 0 ? (arr.length > 1 ? -6 : 0) : 12}>
                          {word}
                        </tspan>
                      ))}
                    </text>
                    <text
                      x={pos.x + pos.w / 2}
                      y={pos.y + pos.h / 2 + 14}
                      textAnchor="middle"
                      fontSize={10}
                      fontWeight="bold"
                      fill="white"
                      style={{ pointerEvents: "none" }}
                    >
                      {(region.intensity * 100).toFixed(0)}%
                    </text>
                  </g>
                );
              })}

              {hovered && (
                <g transform={`translate(${Math.min(tooltipPos.x, 350)},${Math.min(tooltipPos.y - 80, 430)})`}>
                  <rect width={200} height={90} rx={6} fill="#1B2A4A" stroke="#C4623A" strokeWidth={1.5} opacity={0.97} />
                  <text x={12} y={22} fontSize={11} fontWeight="bold" fill="white">
                    {hovered.name}
                  </text>
                  <text x={12} y={42} fontSize={10} fill="#A8B8D4">
                    {hovered.entreprises.toLocaleString("fr-FR")} entreprises
                  </text>
                  <text x={12} y={57} fontSize={10} fill="#A8B8D4">
                    {hovered.emplois.toLocaleString("fr-FR")} emplois
                  </text>
                  <text x={12} y={74} fontSize={10} fill="#C4623A">
                    {hovered.tauxRisque}% de risque de disparition
                  </text>
                </g>
              )}
            </svg>

            <div className="flex items-center gap-3 justify-center mt-4">
              <span className="text-[#4A5A78] text-xs">Faible intensité</span>
              <div className="flex gap-0.5">
                {[0.15, 0.35, 0.55, 0.70, 0.85, 1.0].map((v) => (
                  <div
                    key={v}
                    className="w-7 h-3 rounded-sm"
                    style={{ backgroundColor: intensityToColor(v) }}
                  />
                ))}
              </div>
              <span className="text-[#4A5A78] text-xs">Forte intensité</span>
            </div>
          </div>

          <div className="space-y-3">
            {[...regionsData]
              .sort((a, b) => b.entreprises - a.entreprises)
              .map((r) => (
                <div
                  key={r.id}
                  className={`p-4 rounded border transition-all cursor-default ${
                    hovered?.id === r.id
                      ? "border-[#C4623A] bg-[#2E3F5C]"
                      : "border-[#2E3F5C] bg-[#1B2A4A] hover:border-[#4A5A78]"
                  }`}
                  onMouseEnter={() => setHovered(r)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{r.name}</span>
                    <span className="text-[#C4623A] text-sm font-semibold">
                      {r.tauxRisque}% risque
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-[#A8B8D4]">
                    <span>{r.entreprises.toLocaleString("fr-FR")} entreprises</span>
                    <span>{r.emplois.toLocaleString("fr-FR")} emplois</span>
                  </div>
                  <div className="mt-2 h-1.5 bg-[#2E3F5C] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${r.intensity * 100}%`,
                        background: `linear-gradient(to right, #2E3F5C, #C4623A)`,
                      }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}
