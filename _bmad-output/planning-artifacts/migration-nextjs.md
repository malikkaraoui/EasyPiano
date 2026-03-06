# Migration EasyPiano : React 19 + Vite → Next.js 15 + App Router

## Contexte

EasyPiano est une marketplace de réservation d'accordeurs de piano. Stack actuelle :
- React 19 + Vite (SPA)
- Firebase (Auth, Realtime Database, Storage, Hosting)
- Stripe Connect
- Vitest + React Testing Library

**Besoin critique :** SEO pour les pages publiques (landing, profils pros, recherche). Une SPA React ne suffit pas — Google ne voit que `<div id="root"></div>` vide.

**Solution :** Migration vers Next.js 15 avec App Router pour avoir du Server-Side Rendering (SSR) automatique sur les pages publiques, tout en gardant l'interactivité client-side pour les dashboards.

## Objectifs de la Migration

1. **Pages publiques SSR** (landing, profils pros, recherche) → SEO optimal
2. **Dashboards SPA** (client, pro, admin) → Interactivité full client-side
3. **Garder Firebase** (Auth, RTDB, Storage) + Stripe Connect
4. **Garder la structure** `src/` existante autant que possible
5. **Zero downtime** : déploiement progressif

## Architecture Cible

```
easypiano/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Landing page (SSR)
│   ├── search/
│   │   └── page.tsx              # Page recherche (SSR)
│   ├── pro/
│   │   └── [proId]/
│   │       └── page.tsx          # Profil pro (SSR)
│   ├── dashboard/
│   │   ├── client/
│   │   │   └── page.tsx          # Dashboard client (CSR)
│   │   ├── pro/
│   │   │   └── page.tsx          # Dashboard pro (CSR)
│   │   └── admin/
│   │       └── page.tsx          # Dashboard admin (CSR)
│   ├── booking/
│   │   └── [proId]/
│   │       └── page.tsx          # Page booking (CSR)
│   └── api/                      # API Routes (optionnel)
├── src/
│   ├── components/               # Composants React existants
│   ├── services/                 # Firebase, Stripe (inchangé)
│   ├── hooks/                    # Custom hooks (inchangé)
│   ├── context/                  # AuthContext, etc. (inchangé)
│   └── utils/                    # Helpers (inchangé)
├── public/                       # Assets statiques
├── next.config.js                # Config Next.js
├── firebase.json                 # Config Firebase Hosting
└── package.json
```

## Étapes de Migration

### Phase 1 : Setup Next.js

1. **Installer Next.js 15 + dépendances**

```bash
npm install next@latest react@latest react-dom@latest
npm install --save-dev @types/node @types/react @types/react-dom
```

2. **Créer la structure App Router**

```bash
mkdir -p app/{dashboard/{client,pro,admin},search,pro/[proId],booking/[proId],api}
```

3. **Créer `next.config.js`**

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Firebase Storage pour les images
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
  // Variables d'environnement publiques
  env: {
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    NEXT_PUBLIC_FIREBASE_DATABASE_URL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  },
  // Output pour Firebase Hosting
  output: 'export', // À RETIRER après migration complète (SSR nécessite Node.js server)
}

module.exports = nextConfig
```

**IMPORTANT :** Au début, utilise `output: 'export'` pour générer un site statique compatible Firebase Hosting. Une fois la migration complète, tu devras déployer sur Vercel ou Firebase Functions pour le SSR.

4. **Mettre à jour `package.json`**

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest"
  }
}
```

### Phase 2 : Migrer les Pages Publiques (SSR)

#### 2.1 Landing Page

Créer `app/page.tsx` :

```typescript
import { Metadata } from 'next'
import Hero from '@/src/components/Hero'
import SearchBar from '@/src/components/SearchBar'

export const metadata: Metadata = {
  title: 'EasyPiano - Accordeur de Piano en Suisse | Réservation en ligne',
  description: 'Trouvez et réservez un accordeur de piano qualifié en Suisse. Prix fixe 125 CHF, booking instantané, pros validés.',
  openGraph: {
    title: 'EasyPiano - Accordeur de Piano',
    description: 'Réservation en ligne d\'accordeurs de piano qualifiés',
    url: 'https://easypiano.ch',
    siteName: 'EasyPiano',
    locale: 'fr_CH',
    type: 'website',
  },
}

export default function HomePage() {
  return (
    <main>
      <Hero />
      <SearchBar />
      {/* Autres sections */}
    </main>
  )
}
```

#### 2.2 Page Recherche

Créer `app/search/page.tsx` :

```typescript
import { Metadata } from 'next'
import { Suspense } from 'react'
import SearchResults from '@/src/components/SearchResults'

export const metadata: Metadata = {
  title: 'Recherche Accordeurs - EasyPiano',
  description: 'Recherchez un accordeur de piano disponible par lieu et date',
}

export default function SearchPage() {
  return (
    <main>
      <h1>Recherche d'accordeurs</h1>
      <Suspense fallback={<div>Chargement...</div>}>
        <SearchResults />
      </Suspense>
    </main>
  )
}
```

#### 2.3 Profil Pro (Dynamic Route)

Créer `app/pro/[proId]/page.tsx` :

```typescript
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProProfile from '@/src/components/ProProfile'
import { getProById } from '@/src/services/database'

type Props = {
  params: { proId: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const pro = await getProById(params.proId)

  if (!pro) {
    return {
      title: 'Accordeur introuvable - EasyPiano',
    }
  }

  return {
    title: `${pro.name} - Accordeur de Piano | EasyPiano`,
    description: `${pro.name}, accordeur professionnel depuis ${pro.experience} ans. Note ${pro.rating}/5. Réservez en ligne.`,
    openGraph: {
      title: `${pro.name} - Accordeur de Piano`,
      description: pro.bio,
      images: [pro.photoURL],
    },
  }
}

export default async function ProPage({ params }: Props) {
  const pro = await getProById(params.proId)

  if (!pro) {
    notFound()
  }

  return <ProProfile pro={pro} />
}
```

**Note :** `getProById` doit être adapté pour fonctionner côté serveur (voir Phase 3).

### Phase 3 : Adapter Firebase pour SSR

#### 3.1 Firebase Admin SDK (Server-Side)

Créer `src/services/firebase-admin.ts` :

```typescript
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getDatabase } from 'firebase-admin/database'

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  })
}

export const adminDb = getDatabase()
```

**Variables d'environnement à ajouter** (`.env.local`) :

```
FIREBASE_PROJECT_ID=project-963262605515
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@project-963262605515.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

#### 3.2 Adapter `database.js` pour SSR

Créer `src/services/database-server.ts` :

```typescript
import { adminDb } from './firebase-admin'

export async function getProById(proId: string) {
  const snapshot = await adminDb.ref(`pros/${proId}`).once('value')
  return snapshot.val()
}

export async function getAvailablePros(location: string, date: string) {
  // Logique de recherche côté serveur
  const snapshot = await adminDb.ref('pros').once('value')
  const pros = snapshot.val()
  // Filtrer par location + date
  return Object.values(pros || {}).filter(/* ... */)
}
```

### Phase 4 : Migrer les Dashboards (CSR)

Les dashboards restent **client-side only** (pas de SSR nécessaire).

Créer `app/dashboard/client/page.tsx` :

```typescript
'use client' // IMPORTANT : directive Next.js pour CSR

import { useAuth } from '@/src/hooks/useAuth'
import { redirect } from 'next/navigation'
import ClientDashboard from '@/src/pages/ClientDashboard'

export default function ClientDashboardPage() {
  const { user, loading } = useAuth()

  if (loading) return <div>Chargement...</div>
  if (!user) redirect('/login')

  return <ClientDashboard />
}
```

**Important :** Tous les composants utilisant des hooks Firebase (`useAuth`, `useFirebase`) doivent être marqués `'use client'`.

### Phase 5 : Root Layout + Providers

Créer `app/layout.tsx` :

```typescript
import './globals.css'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/src/context/AuthProvider'
import Navbar from '@/src/components/Navbar'
import Footer from '@/src/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  metadataBase: new URL('https://easypiano.ch'),
  title: {
    default: 'EasyPiano - Accordeur de Piano en Suisse',
    template: '%s | EasyPiano',
  },
  description: 'Réservation en ligne d\'accordeurs de piano qualifiés',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <AuthProvider>
          <Navbar />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
```

### Phase 6 : Déploiement

#### Option A : Déploiement Vercel (Recommandé pour SSR)

1. Push sur GitHub
2. Connecter le repo à Vercel
3. Ajouter les variables d'environnement dans Vercel Dashboard
4. Deploy automatique

#### Option B : Firebase Hosting + Cloud Functions (SSR)

1. Installer Firebase Functions :

```bash
npm install firebase-functions@latest firebase-admin@latest
```

2. Créer `functions/src/index.ts` :

```typescript
import * as functions from 'firebase-functions'
import next from 'next'

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev, conf: { distDir: '.next' } })
const handle = app.getRequestHandler()

export const nextServer = functions.https.onRequest(async (req, res) => {
  await app.prepare()
  return handle(req, res)
})
```

3. Mettre à jour `firebase.json` :

```json
{
  "hosting": {
    "public": "out",
    "rewrites": [
      {
        "source": "**",
        "function": "nextServer"
      }
    ]
  },
  "functions": {
    "source": "functions"
  }
}
```

## Checklist Migration

- [ ] Phase 1 : Setup Next.js 15 + App Router
- [ ] Phase 2 : Migrer landing page (SSR)
- [ ] Phase 2 : Migrer page recherche (SSR)
- [ ] Phase 2 : Migrer profils pros (SSR + dynamic routes)
- [ ] Phase 3 : Setup Firebase Admin SDK pour SSR
- [ ] Phase 3 : Adapter `database.js` pour server-side
- [ ] Phase 4 : Migrer dashboard client (CSR)
- [ ] Phase 4 : Migrer dashboard pro (CSR)
- [ ] Phase 4 : Migrer dashboard admin (CSR)
- [ ] Phase 5 : Créer Root Layout + Providers
- [ ] Phase 5 : Migrer Navbar + Footer
- [ ] Phase 6 : Tester en local (`npm run dev`)
- [ ] Phase 6 : Build production (`npm run build`)
- [ ] Phase 6 : Déployer sur Vercel ou Firebase Functions
- [ ] Phase 7 : Tester SEO (Google Search Console, Lighthouse)
- [ ] Phase 7 : Configurer sitemap.xml + robots.txt

## Points d'Attention

1. **Firebase Auth côté serveur** : Utilise Firebase Admin SDK, pas le SDK client
2. **`'use client'` directive** : Tous les composants avec hooks/state doivent l'avoir
3. **Images** : Utilise `next/image` pour l'optimisation automatique
4. **Env variables** : Préfixe `NEXT_PUBLIC_` pour variables client-side
5. **Stripe Checkout** : Fonctionne identique, pas de changement
6. **React Router → Next.js routing** : Remplace `<Link>` par `next/link`, `useNavigate` par `useRouter` (from 'next/navigation')

## Ressources

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [Next.js + Firebase Guide](https://nextjs.org/docs/pages/building-your-application/data-fetching/fetching-caching-and-revalidating)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Vercel Deployment](https://vercel.com/docs)

## Commandes Utiles

```bash
# Dev local
npm run dev

# Build production
npm run build

# Start production
npm start

# Analyser le bundle
npm install @next/bundle-analyzer
ANALYZE=true npm run build
```

---

**Prêt pour migration !** Ouvre ce fichier dans une nouvelle fenêtre Claude et lance la migration étape par étape.