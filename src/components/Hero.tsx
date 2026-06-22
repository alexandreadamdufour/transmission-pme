const stats = [
  {
    value: "700 000",
    label: "entreprises à transmettre",
    sublabel: "d'ici 2035",
    accent: false,
  },
  {
    value: "3,3 M",
    label: "emplois concernés",
    sublabel: "en France métropolitaine",
    accent: false,
  },
  {
    value: "10 ans",
    label: "pour agir",
    sublabel: "fenêtre 2025-2035",
    accent: true,
  },
  {
    value: "25 %",
    label: "risque de disparition",
    sublabel: "faute de repreneur",
    accent: true,
  },
];

export default function Hero() {
  return (
    <section className="bg-[#1B2A4A] text-white">
      {/* Header bar */}
      <div className="border-b border-[#2E3F5C]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[#C4623A] font-semibold text-sm tracking-widest uppercase">
              Institut Sapiens
            </span>
            <span className="text-[#4A5A78] text-sm">·</span>
            <span className="text-[#4A5A78] text-sm">Observatoire de la transmission</span>
          </div>
          <span className="text-[#4A5A78] text-xs">2025 – 2035</span>
        </div>
      </div>

      {/* Main hero */}
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="max-w-3xl mb-16">
          <p className="text-[#C4623A] text-sm font-semibold tracking-widest uppercase mb-4">
            Rapport stratégique
          </p>
          <h1
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            La vague de transmission des PME françaises
          </h1>
          <p className="text-[#A8B8D4] text-lg leading-relaxed">
            Une génération entière de chefs d&apos;entreprise approche de la retraite.
            La France dispose d&apos;une décennie pour organiser la plus grande vague de
            transmission de son tissu économique. Voici les données.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[#2E3F5C]">
          {stats.map((stat) => (
            <div
              key={stat.value}
              className="bg-[#1B2A4A] p-8 flex flex-col justify-between min-h-[160px]"
            >
              <div>
                <div
                  className={`text-4xl md:text-5xl font-bold mb-1 ${
                    stat.accent ? "text-[#C4623A]" : "text-white"
                  }`}
                  style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                >
                  {stat.value}
                </div>
                <div className="text-white font-medium mt-2">{stat.label}</div>
              </div>
              <div className="text-[#4A5A78] text-sm mt-2">{stat.sublabel}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
