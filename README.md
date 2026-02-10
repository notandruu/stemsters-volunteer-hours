# Stemsters Volunteer Hours Tracker

A web app for [Stemsters](https://stemsters.org) volunteers to look up their verified volunteer hours. Search by name, school, and ID to see total hours and a detailed breakdown by date and activity type.

**Live:** https://hours.stemsters.org

## Tech Stack

- **React 18** + TypeScript
- **Vite** (SWC) for bundling
- **Tailwind CSS** + **shadcn/ui** for styling and components
- **TanStack Query** for async data fetching
- **React Hook Form** + **Zod** for form validation
- **Framer Motion** for animations
- **React Router** for client-side routing
- Deployed on **Vercel**

## Project Structure

```
src/
├── pages/
│   ├── Index.tsx              # main search page
│   └── NotFound.tsx           # 404 page
├── components/
│   ├── SearchForm.tsx         # name/school/id search form
│   ├── ResultsCard.tsx        # total hours display
│   ├── HoursBreakdownTable.tsx # per-date activity breakdown
│   ├── Logo.tsx               # stemsters logo
│   └── ui/                    # shadcn/ui primitives
├── hooks/
│   ├── useVolunteerHours.ts   # csv fetch + search logic
│   ├── use-mobile.tsx         # mobile detection
│   └── use-toast.ts           # toast notifications
├── utils/
│   └── volunteerUtils.ts      # csv parsing, search, hour calculation
├── assets/                    # images and icons
└── lib/
    └── utils.ts               # tailwind cn() helper
```

## How It Works

### Data Source

There is no backend or database. The app fetches a **public Google Sheets CSV export** on page load. The spreadsheet is maintained by Stemsters leadership and contains all verified volunteer activity records.

### Search Flow

1. User enters their name, high school, and optionally their student ID
2. The app searches the CSV data for matching records (case-insensitive)
3. Results show total hours and a breakdown table grouped by date

### Activity Types and Hours

| Activity | Hours per Entry |
|----------|----------------|
| Volunteer Event | 2 |
| Meeting Attendance | 1 |
| Volunteer Referral | 0.5 |
| Instagram Repost | 0.5 |

## Development

```sh
git clone https://github.com/notandruu/stemsters-volunteer-hours.git
cd stemsters-volunteer-hours
npm install
npm run dev
```

Dev server runs at `http://localhost:8080`.

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | start dev server |
| `npm run build` | production build to `dist/` |
| `npm run preview` | preview production build |
| `npm run lint` | run eslint |

## Deployment

Deployed on Vercel with SPA rewrites. Push to `main` triggers automatic deployment.

```sh
npm run build  # outputs to dist/
```
