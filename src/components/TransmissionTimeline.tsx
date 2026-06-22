"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { timelineData } from "@/data/timeline";

function formatY(value: number) {
  return `${(value / 1000).toFixed(0)}k`;
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1B2A4A] text-white p-4 rounded shadow-lg text-sm">
      <p className="font-semibold mb-2">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color }}>
          {entry.name === "reussies" ? "Transmissions réussies" : "Échecs / disparitions"} :{" "}
          <strong>{entry.value.toLocaleString("fr-FR")}</strong>
        </p>
      ))}
    </div>
  );
};

export default function TransmissionTimeline() {
  return (
    <section className="bg-[#F5F0E8] py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12">
          <p className="text-[#C4623A] text-sm font-semibold tracking-widest uppercase mb-3">
            Projection 2025–2035
          </p>
          <h2
            className="text-3xl md:text-4xl font-bold text-[#1B2A4A] mb-4"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            La vague de transmission année par année
          </h2>
          <p className="text-[#4A5A78] max-w-2xl">
            Le pic est attendu entre 2029 et 2031, lorsque la génération des fondateurs
            nés dans les années 1960 atteindra massivement l&apos;âge de la retraite.
            Sans anticipation, un quart de ces entreprises risquent de disparaître.
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-[#EAE3D6]">
          <ResponsiveContainer width="100%" height={420}>
            <AreaChart data={timelineData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="gradReussies" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1B2A4A" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#1B2A4A" stopOpacity={0.03} />
                </linearGradient>
                <linearGradient id="gradEchecs" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C4623A" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#C4623A" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#EAE3D6" />
              <XAxis dataKey="year" tick={{ fill: "#4A5A78", fontSize: 13 }} />
              <YAxis tickFormatter={formatY} tick={{ fill: "#4A5A78", fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(value) =>
                  value === "reussies" ? "Transmissions réussies" : "Échecs / disparitions"
                }
                wrapperStyle={{ color: "#1B2A4A", fontSize: 13 }}
              />
              <ReferenceLine
                x={2030}
                stroke="#C4623A"
                strokeDasharray="4 4"
                label={{ value: "Pic estimé", position: "top", fill: "#C4623A", fontSize: 12 }}
              />
              <Area
                type="monotone"
                dataKey="reussies"
                stackId="1"
                stroke="#1B2A4A"
                strokeWidth={2}
                fill="url(#gradReussies)"
              />
              <Area
                type="monotone"
                dataKey="echecs"
                stackId="1"
                stroke="#C4623A"
                strokeWidth={2}
                fill="url(#gradEchecs)"
              />
            </AreaChart>
          </ResponsiveContainer>
          <p className="text-xs text-[#4A5A78] mt-4">
            Source : estimations Institut Sapiens d&apos;après données Bpifrance, CCI France et INSEE.
          </p>
        </div>
      </div>
    </section>
  );
}
