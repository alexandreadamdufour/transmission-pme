export interface BodaccAnnonce {
  id: string;
  date: string;
  type: "vente" | "dissolution" | "creation" | "modification";
  raisonSociale: string;
  secteur: string;
  ville: string;
  departement: string;
  detail: string;
}

export const bodaccMockData: BodaccAnnonce[] = [
  {
    id: "2025-BD-001247",
    date: "2025-06-20",
    type: "vente",
    raisonSociale: "Boulangerie Artisanale Dupont",
    secteur: "Alimentation & Restauration",
    ville: "Lyon",
    departement: "Rhône",
    detail: "Cession du fonds de commerce de boulangerie-pâtisserie, 4 salariés.",
  },
  {
    id: "2025-BD-001231",
    date: "2025-06-19",
    type: "vente",
    raisonSociale: "Garage Méca-Plus SARL",
    secteur: "Réparation automobile",
    ville: "Bordeaux",
    departement: "Gironde",
    detail: "Vente du fonds artisanal de réparation mécanique, 6 salariés.",
  },
  {
    id: "2025-BD-001218",
    date: "2025-06-18",
    type: "dissolution",
    raisonSociale: "Imprimerie Leclerc & Fils SAS",
    secteur: "Imprimerie",
    ville: "Strasbourg",
    departement: "Bas-Rhin",
    detail: "Dissolution anticipée faute de repreneur, 12 emplois supprimés.",
  },
  {
    id: "2025-BD-001205",
    date: "2025-06-18",
    type: "vente",
    raisonSociale: "Cabinet Optique Martinet",
    secteur: "Santé & Optique",
    ville: "Nantes",
    departement: "Loire-Atlantique",
    detail: "Cession de l'officine optique, 3 salariés. Repreneur interne.",
  },
  {
    id: "2025-BD-001192",
    date: "2025-06-17",
    type: "vente",
    raisonSociale: "Transports Beaumont SA",
    secteur: "Transport & Logistique",
    ville: "Lille",
    departement: "Nord",
    detail: "Cession de parts sociales, flotte de 8 véhicules, 9 salariés.",
  },
  {
    id: "2025-BD-001180",
    date: "2025-06-17",
    type: "dissolution",
    raisonSociale: "Menuiserie Rondeau EURL",
    secteur: "Artisanat du bois",
    ville: "Clermont-Ferrand",
    departement: "Puy-de-Dôme",
    detail: "Cessation d'activité, retraite du gérant sans successeur, 2 salariés.",
  },
  {
    id: "2025-BD-001165",
    date: "2025-06-16",
    type: "vente",
    raisonSociale: "Hôtel Le Relais des Vosges",
    secteur: "Hôtellerie",
    ville: "Épinal",
    departement: "Vosges",
    detail: "Cession du fonds hôtelier 2 étoiles, 18 chambres, 5 salariés.",
  },
  {
    id: "2025-BD-001149",
    date: "2025-06-15",
    type: "vente",
    raisonSociale: "Plomberie Chauffage Vidal",
    secteur: "BTP & Énergie",
    ville: "Toulouse",
    departement: "Haute-Garonne",
    detail: "Reprise par salarié (RES), activité de plomberie-chauffage, 7 salariés.",
  },
];
