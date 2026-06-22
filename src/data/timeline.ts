export interface TimelinePoint {
  year: number;
  transmissions: number;
  reussies: number;
  echecs: number;
}

export const timelineData: TimelinePoint[] = [
  { year: 2025, transmissions: 45000,  reussies: 32000, echecs: 13000 },
  { year: 2026, transmissions: 55000,  reussies: 38000, echecs: 17000 },
  { year: 2027, transmissions: 68000,  reussies: 46000, echecs: 22000 },
  { year: 2028, transmissions: 82000,  reussies: 54000, echecs: 28000 },
  { year: 2029, transmissions: 91000,  reussies: 59000, echecs: 32000 },
  { year: 2030, transmissions: 98000,  reussies: 62000, echecs: 36000 },
  { year: 2031, transmissions: 95000,  reussies: 61000, echecs: 34000 },
  { year: 2032, transmissions: 88000,  reussies: 58000, echecs: 30000 },
  { year: 2033, transmissions: 76000,  reussies: 51000, echecs: 25000 },
  { year: 2034, transmissions: 62000,  reussies: 43000, echecs: 19000 },
  { year: 2035, transmissions: 48000,  reussies: 34000, echecs: 14000 },
];
