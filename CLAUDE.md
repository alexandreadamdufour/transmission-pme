# Transmission PME — Institut Sapiens

Data visualization website on the French SME transmission wave (2025-2035).

## Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS v4
- **Charts**: Recharts
- **Maps**: react-simple-maps
- **Deployment**: Vercel

## Design System

| Token | Value |
|-------|-------|
| Navy | `#1B2A4A` |
| Terracotta | `#C4623A` |
| Cream | `#F5F0E8` |
| Navy light | `#2E3F5C` |

Font stack: `Inter` (UI) + `Playfair Display` (headings)

## Project Structure

```
src/
  app/
    layout.tsx          # Root layout with fonts, metadata
    page.tsx            # Home page composing all sections
  components/
    Hero.tsx            # 4 key stats banner
    RegionMap.tsx       # Interactive France choropleth
    TransmissionTimeline.tsx  # 2025-2035 area chart
    BodaccFeed.tsx      # Live/mock BODACC feed
    Footer.tsx
  data/
    regions.ts          # Static transmission data by region
    bodacc-mock.ts      # Mock BODACC announcements
    timeline.ts         # Year-by-year wave data
```

## Dev Commands

```bash
npm run dev      # Start dev server on :3000
npm run build    # Production build
npm run lint     # ESLint check
npm run typecheck # tsc --noEmit
```

## Data Notes

- **BODACC feed**: Currently mocked in `src/data/bodacc-mock.ts`. Replace with real BODACC API (`https://bodacc-datadila.opendatasoft.com/api/explore/v2.1/`) when available.
- **Region data**: Static estimates from Bpifrance / CCI studies. Update when official 2025 data is published.

## Publishing

Published under **Institut Sapiens** branding. All copy is in French.
