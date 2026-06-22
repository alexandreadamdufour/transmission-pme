export default function Footer() {
  return (
    <footer className="bg-[#1B2A4A] text-[#4A5A78] py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <p className="text-[#C4623A] font-semibold text-sm tracking-widest uppercase mb-3">
              Institut Sapiens
            </p>
            <p className="text-sm leading-relaxed">
              Think tank indépendant dédié à l&apos;analyse économique et aux politiques
              publiques françaises et européennes.
            </p>
          </div>
          <div>
            <p className="text-white text-sm font-semibold mb-3">Sources de données</p>
            <ul className="space-y-1 text-sm">
              <li>Bpifrance — Études PME</li>
              <li>CCI France — Observatoire</li>
              <li>INSEE — Démographie des entreprises</li>
              <li>BODACC — Annonces légales</li>
            </ul>
          </div>
          <div>
            <p className="text-white text-sm font-semibold mb-3">À propos de ce projet</p>
            <p className="text-sm leading-relaxed">
              Visualisation de données sur la vague de transmission des PME françaises
              2025-2035. Les projections sont des estimations à des fins de sensibilisation.
            </p>
          </div>
        </div>
        <div className="border-t border-[#2E3F5C] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span>© 2025 Institut Sapiens — Tous droits réservés</span>
          <span>Données mises à jour : juin 2025</span>
        </div>
      </div>
    </footer>
  );
}
