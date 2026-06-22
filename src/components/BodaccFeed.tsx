"use client";

import { useState } from "react";
import { bodaccMockData, BodaccAnnonce } from "@/data/bodacc-mock";

const TYPE_LABELS: Record<BodaccAnnonce["type"], string> = {
  vente: "Cession de fonds",
  dissolution: "Dissolution",
  creation: "Création",
  modification: "Modification",
};

const TYPE_COLORS: Record<BodaccAnnonce["type"], string> = {
  vente: "bg-[#1B2A4A] text-white",
  dissolution: "bg-[#C4623A] text-white",
  creation: "bg-emerald-700 text-white",
  modification: "bg-[#4A5A78] text-white",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function BodaccFeed() {
  const [filter, setFilter] = useState<BodaccAnnonce["type"] | "all">("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const displayed = filter === "all"
    ? bodaccMockData
    : bodaccMockData.filter((a) => a.type === filter);

  return (
    <section className="bg-[#F5F0E8] py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p className="text-[#C4623A] text-sm font-semibold tracking-widest uppercase mb-3">
                Fil BODACC
              </p>
              <h2
                className="text-3xl md:text-4xl font-bold text-[#1B2A4A] mb-2"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
              >
                Annonces légales en temps réel
              </h2>
              <p className="text-[#4A5A78]">
                Dernières annonces de cession et dissolution publiées au Bulletin Officiel
                des Annonces Civiles et Commerciales.{" "}
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse inline-block" />
                  <span className="text-xs text-amber-700 font-medium">Données de démonstration</span>
                </span>
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {(["all", "vente", "dissolution"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
                    filter === t
                      ? "bg-[#1B2A4A] text-white border-[#1B2A4A]"
                      : "bg-white text-[#4A5A78] border-[#EAE3D6] hover:border-[#1B2A4A]"
                  }`}
                >
                  {t === "all" ? "Toutes" : TYPE_LABELS[t]}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {displayed.map((annonce) => (
            <div
              key={annonce.id}
              className="bg-white rounded-lg border border-[#EAE3D6] overflow-hidden"
            >
              <button
                className="w-full text-left p-5 flex flex-col sm:flex-row sm:items-center gap-3"
                onClick={() => setExpanded(expanded === annonce.id ? null : annonce.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded ${TYPE_COLORS[annonce.type]}`}
                    >
                      {TYPE_LABELS[annonce.type]}
                    </span>
                    <span className="text-xs text-[#4A5A78]">{annonce.id}</span>
                  </div>
                  <p className="font-semibold text-[#1B2A4A] truncate">{annonce.raisonSociale}</p>
                  <p className="text-sm text-[#4A5A78]">
                    {annonce.secteur} · {annonce.ville} ({annonce.departement})
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-[#4A5A78]">{formatDate(annonce.date)}</span>
                  <svg
                    className={`w-4 h-4 text-[#4A5A78] transition-transform ${
                      expanded === annonce.id ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {expanded === annonce.id && (
                <div className="px-5 pb-5 border-t border-[#EAE3D6] pt-4">
                  <p className="text-sm text-[#4A5A78]">{annonce.detail}</p>
                  <a
                    href="#"
                    className="inline-block mt-3 text-xs text-[#C4623A] font-medium hover:underline"
                    onClick={(e) => e.preventDefault()}
                  >
                    Voir l&apos;annonce complète sur BODACC →
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>

        <p className="text-xs text-[#4A5A78] mt-6 text-center">
          Source : BODACC — Bulletin Officiel des Annonces Civiles et Commerciales (données simulées pour démonstration).
          L&apos;intégration de l&apos;API BODACC Open Data sera activée prochainement.
        </p>
      </div>
    </section>
  );
}
