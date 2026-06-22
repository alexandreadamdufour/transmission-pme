export interface RegionData {
  id: string;
  name: string;
  entreprises: number;
  emplois: number;
  intensity: number; // 0-1, pour la choroplèthe
  tauxRisque: number; // % risque de disparition
}

export const regionsData: RegionData[] = [
  { id: "11", name: "Île-de-France",       entreprises: 142000, emplois: 680000, intensity: 0.95, tauxRisque: 22 },
  { id: "84", name: "Auvergne-Rhône-Alpes",entreprises: 78000,  emplois: 370000, intensity: 0.80, tauxRisque: 26 },
  { id: "93", name: "Provence-Alpes-Côte d'Azur", entreprises: 58000, emplois: 210000, intensity: 0.72, tauxRisque: 28 },
  { id: "32", name: "Hauts-de-France",     entreprises: 52000,  emplois: 195000, intensity: 0.68, tauxRisque: 30 },
  { id: "76", name: "Occitanie",           entreprises: 50000,  emplois: 185000, intensity: 0.65, tauxRisque: 27 },
  { id: "44", name: "Grand Est",           entreprises: 48000,  emplois: 178000, intensity: 0.63, tauxRisque: 29 },
  { id: "75", name: "Nouvelle-Aquitaine",  entreprises: 55000,  emplois: 200000, intensity: 0.70, tauxRisque: 25 },
  { id: "28", name: "Normandie",           entreprises: 35000,  emplois: 128000, intensity: 0.52, tauxRisque: 31 },
  { id: "52", name: "Pays de la Loire",    entreprises: 38000,  emplois: 140000, intensity: 0.55, tauxRisque: 24 },
  { id: "53", name: "Bretagne",            entreprises: 32000,  emplois: 118000, intensity: 0.48, tauxRisque: 26 },
  { id: "27", name: "Bourgogne-Franche-Comté", entreprises: 26000, emplois: 95000, intensity: 0.40, tauxRisque: 33 },
  { id: "24", name: "Centre-Val de Loire", entreprises: 24000,  emplois: 88000,  intensity: 0.36, tauxRisque: 32 },
  { id: "94", name: "Corse",              entreprises: 8000,   emplois: 28000,  intensity: 0.20, tauxRisque: 35 },
];
