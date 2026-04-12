# Retail Management Frontend

Next.js PWA frontend for the Retail Management System.

## Tech Stack

- **Framework:** Next.js 16 with App Router
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **State Management:** Zustand
- **Server State:** TanStack Query (React Query)
- **Offline Storage:** Dexie.js (IndexedDB)
- **UI Components:** shadcn/ui + Radix UI
- **Icons:** Lucide React
- **HTTP Client:** Axios
- **Testing:** Vitest + Playwright

## Prerequisites

- Node.js 20+
- npm 10+
- Backend API running on http://localhost:8080

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local

# Start development server
npm run dev
```

Open http://localhost:3000

### With Turbopack (Faster)

```bash
npm run dev:turbo
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run dev:turbo` | Start with Turbopack (faster) |
| `npm run build` | Create production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint + Prettier check |
| `npm run lint:fix` | Fix lint issues |
| `npm run type-check` | TypeScript type checking |
| `npm run test` | Run unit tests (Vitest) |
| `npm run test:ci` | Run tests with coverage |
| `npm run test:e2e` | Run E2E tests (Playwright) |

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Protected dashboard
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/
│   ├── auth/              # Auth components (AuthGuard)
│   └── ui/                # UI components (Button, Card, Input, etc.)
├── hooks/                 # Custom React hooks
│   └── use-auth.ts        # Auth hooks (useSignIn, useLogout, etc.)
├── lib/
│   ├── api/               # API client and endpoints
│   │   ├── client.ts      # Axios client with interceptors
│   │   └── auth.ts        # Auth API functions
│   ├── db/                # Dexie.js offline database
│   └── utils.ts           # Utility functions
├── providers/             # React context providers
│   └── query-provider.tsx # TanStack Query provider
├── stores/                # Zustand stores
│   ├── auth-store.ts      # Auth state
│   └── ui-store.ts        # UI state (sidebar, theme)
└── test/                  # Test setup
```

## Environment Variables

Create `.env.local` from `.env.local.example`:

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8080/api` | Backend API URL |
| `NEXT_PUBLIC_APP_NAME` | `Retail Management` | App name |
| `NEXT_PUBLIC_ENABLE_OFFLINE_MODE` | `true` | Enable offline support |

## Features

### Authentication
- Multi-tenant login (organization code + email)
- JWT access/refresh token flow
- Automatic token refresh
- Protected routes with `AuthGuard`

### Offline Support
- IndexedDB storage via Dexie.js
- Sync queue for offline operations
- Online/offline detection

### State Management
- Zustand for client state (auth, UI)
- TanStack Query for server state
- Persistent auth state

## Pages

| Route | Description | Auth Required |
|-------|-------------|---------------|
| `/` | Landing page | No |
| `/login` | Sign in | No |
| `/register` | Sign up (create organization) | No |
| `/dashboard` | Main dashboard | Yes |

## Testing

```bash
# Unit tests
npm run test

# With coverage
npm run test:ci

# E2E tests
npm run test:e2e

# E2E with UI
npm run test:e2e:ui
```

## Building for Production

```bash
npm run build
npm run start
```

## Code Quality

```bash
# Lint check
npm run lint

# Fix lint issues
npm run lint:fix

# Type check
npm run type-check
```
