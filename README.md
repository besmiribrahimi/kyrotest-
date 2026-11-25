# Advanced Koryo — Korean Vehicle Export Catalog

Direct Korean vehicle sourcing and export platform built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, and **TypeScript**.

Features bilingual English / Arabic (`LTR` / `RTL`) support, real-time Encar vehicle catalog & filtering, vehicle detail & inspection reports, Ro-Ro shipping calculator, and automated WhatsApp inquiry links.

---

## Quick Start (Local & Production)

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in your API key and site URL:

```bash
cp .env.example .env.local
```

```env
# Server-side Vehicle API Key (never prefix with NEXT_PUBLIC_)
APICARS_API_KEY="your_api_key_here"

# Upstream API Base URL
RINEVO_API_BASE_URL="https://api.rinevoapi.com/api/encar"

# Your production website URL (used for SEO metadata, sitemap, and share links)
NEXT_PUBLIC_SITE_URL="https://yourdomain.com"
```

> **Note:** Without `APICARS_API_KEY`, the site automatically runs in offline demo mode using the curated fallback inventory in `lib/catalog-data.ts`.

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Production Build

```bash
npm run build
npm start
```

---

## Where the API Key & Endpoints Are Configured

All API keys stay strictly on the **server side** (never exposed to browser JavaScript):

| File | Purpose |
| :--- | :--- |
| [`.env.example`](.env.example) | Environment variable template (`APICARS_API_KEY`, `RINEVO_API_BASE_URL`, `NEXT_PUBLIC_SITE_URL`) |
| [`app/api/cars/route.ts`](app/api/cars/route.ts) | Next.js API Route Handler (`GET /api/cars`) for catalog search, pagination, single-car lookup (`?id=`), and fallback catalog |
| [`lib/inventory-api.ts`](lib/inventory-api.ts) | Server-side vehicle detail & inspection report loader (`getInventoryCarDetails`) used by `/vehicle/[id]` |
| [`app/sitemap.ts`](app/sitemap.ts) | Dynamic XML sitemap generator fetching live vehicle URLs |
| [`lib/catalog-data.ts`](lib/catalog-data.ts) | Static fallback vehicle catalog used when no API key is set or upstream times out |

---

## Customizing Branding & Contact Info

Update your company name, domain, WhatsApp number, email, and Seoul/office address in:

- [`lib/seo.ts`](lib/seo.ts) — `siteConfig` (company name, domain, email, phone, WhatsApp, address, SEO metadata)
- [`public/logo.jpg`](public/logo.jpg) & [`public/logo.png`](public/logo.png) — Brand logo & favicon
- Search for `821072290580` across `components/` and `app/` to update all WhatsApp inquiry button numbers

---

## Deploying to Vercel or Importing to Lovable

- **Vercel (Recommended — Native Next.js):** Push to GitHub, import on [vercel.com](https://vercel.com), add `APICARS_API_KEY`, `RINEVO_API_BASE_URL`, and `NEXT_PUBLIC_SITE_URL` in **Project Settings → Environment Variables**, and deploy.
- **Lovable (`lovable.dev`):** See the dedicated step-by-step guide in **[LOVABLE_AND_API_GUIDE.md](LOVABLE_AND_API_GUIDE.md)**.
