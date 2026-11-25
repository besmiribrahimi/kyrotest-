# API Configuration & Lovable Integration Guide

This guide explains:
1. **Where to add your API key** for standard Next.js / Vercel deployments
2. **How to import and wire up this project in Lovable (`lovable.dev`)** safely without leaking your API key

---

## Part 1: Where to Add the API Key (Standard Next.js / Vercel)

All API requests run on the server using environment variables so your API key is **never** leaked to browser users.

### Files That Read the API Key & Endpoint
1. **`app/api/cars/route.ts`**
   - Reads `process.env.APICARS_API_KEY` and `process.env.RINEVO_API_BASE_URL` (defaults to `https://api.rinevoapi.com/api/encar`).
   - Serves both list queries (`/api/cars?limit=40&page=1&brand=...`) and single car lookups (`/api/cars?id=...`).
2. **`lib/inventory-api.ts`**
   - Reads `process.env.APICARS_API_KEY` and `process.env.RINEVO_API_BASE_URL`.
   - Powers server-rendered vehicle detail pages at `app/vehicle/[id]/page.tsx`.
3. **`app/sitemap.ts`**
   - Reads `process.env.APICARS_API_KEY` and `process.env.RINEVO_API_BASE_URL` to populate `/sitemap.xml`.

### Setting Up `.env.local` (Local Development)
Create a file named `.env.local` in the project root (copy from `.env.example`):

```env
APICARS_API_KEY="YOUR_RINEVO_API_KEY"
RINEVO_API_BASE_URL="https://api.rinevoapi.com/api/encar"
NEXT_PUBLIC_SITE_URL="https://yourdomain.com"
```

### Setting Up on Vercel (Production)
1. Push your repository to GitHub (make sure `.env` / `.env.local` are **not** committed — `.gitignore` already excludes them).
2. Import the repository in **Vercel → Add New Project**.
3. Go to **Settings → Environment Variables** and add:
   - `APICARS_API_KEY` = `YOUR_RINEVO_API_KEY`
   - `RINEVO_API_BASE_URL` = `https://api.rinevoapi.com/api/encar`
   - `NEXT_PUBLIC_SITE_URL` = `https://yourdomain.com`
4. Click **Redeploy**.

---

## Part 2: How to Add This Project to Lovable (`lovable.dev`)

### Important Architecture Note Before Importing
This codebase is built on **Next.js 16 (App Router + Server Components + `/api/cars` Route Handler)**.

**Lovable (`lovable.dev`) runs client-side React (Vite / TanStack Start) + Lovable Cloud / Supabase Edge Functions**, and does **not** natively run a Next.js Node server or Next.js `app/api/` route handlers. Also, Lovable's Git sync initializes a *new* repository rather than attaching directly to an existing external repo.

You have **two clean ways** to use this with Lovable:

---

### Option A: Hybrid Setup (Easiest — Keep `/api/cars` on Vercel + UI in Lovable)

If you want to customize the frontend visually in Lovable without rewriting the Next.js backend:
1. Deploy this Next.js project to **Vercel** (with `APICARS_API_KEY` configured in Vercel Environment Variables).
2. Your live API proxy is now available at `https://your-vercel-app.vercel.app/api/cars`.
3. In Lovable, fetch vehicle data from that endpoint (no API key needed in Lovable frontend because Vercel holds `APICARS_API_KEY` securely on the server).

---

### Option B: Full Migration Into Lovable + Lovable Cloud / Supabase Secrets

If you want the **entire** app running inside Lovable:

#### Step 1 — Prepare a Clean ZIP (No Secrets or Build Files)
Before uploading to Lovable, make sure the ZIP contains only clean source files and **excludes**:
- `node_modules/`
- `.next/`
- `.git/`
- `.env` or `.env.local` (never include private keys in a ZIP!)

#### Step 2 — Import Code Into Lovable
1. Open [lovable.dev](https://lovable.dev) and start a new project (or open your workspace).
2. Click the **`+`** button in the prompt bar and upload your clean ZIP / project files (or upload UI components from `components/` and `app/`).
3. Enable **Lovable Cloud** (Supabase backend) on the project so you have server-side Edge Functions and Secrets.

#### Step 3 — Where to Add Your API Key in Lovable (CRITICAL)
**Never** put your API key in frontend files or `VITE_...` environment variables (anything in browser code can be stolen).

Add your API key inside **Lovable Cloud / Supabase Secrets**:
1. Open **Project Settings → Cloud / Secrets** (or ask Lovable: *"Add a secret named `APICARS_API_KEY`"* — Lovable will pop up a secure secret input form).
2. Add these two secrets:
   - Name: `APICARS_API_KEY` → Value: `YOUR_RINEVO_API_KEY`
   - Name: `RINEVO_API_BASE_URL` → Value: `https://api.rinevoapi.com/api/encar`

#### Step 4 — Create the Edge Function Proxy (`supabase/functions/cars/index.ts`)
Replace `app/api/cars/route.ts` with a Lovable Cloud / Supabase Edge Function so the key stays server-side:

```ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("APICARS_API_KEY") ?? "";
    const apiBase = Deno.env.get("RINEVO_API_BASE_URL") ?? "https://api.rinevoapi.com/api/encar";

    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    const upstreamUrl = id
      ? `${apiBase}/cars/${encodeURIComponent(id)}`
      : `${apiBase}/cars?${url.searchParams.toString()}`;

    const upstreamRes = await fetch(upstreamUrl, {
      headers: { "x-api-key": apiKey },
    });

    const data = await upstreamRes.json();

    return new Response(JSON.stringify(data), {
      status: upstreamRes.status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
```

#### Step 5 — Copy-Paste Migration Prompt for Lovable
After uploading the project files and adding the `APICARS_API_KEY` secret in Lovable, paste this prompt into Lovable's chat:

> **Prompt to paste into Lovable:**
> *"Convert the uploaded Next.js App Router codebase into our React + Vite + React Router project:*
> *1. Replace `next/image` with standard `<img>` tags and `next/link` with `react-router-dom` `<Link>`.*
> *2. Replace `useRouter` / `usePathname` / `useSearchParams` from `next/navigation` with React Router equivalents.*
> *3. Create a Supabase Edge Function `cars` that reads `APICARS_API_KEY` and `RINEVO_API_BASE_URL` from Deno secrets, sends the `x-api-key` header to upstream, and handles both list queries and `?id=` lookups (just like `app/api/cars/route.ts`).*
> *4. Update `CatalogClient.tsx` and the vehicle details page `/vehicle/:id` to call the `cars` Edge Function instead of `/api/cars` and Next.js Server Components, keeping `lib/catalog-data.ts` as the offline fallback."*

---

## API Endpoints Reference

| Action | Upstream Endpoint | Auth Header |
| :--- | :--- | :--- |
| List / Filter Vehicles | `GET {RINEVO_API_BASE_URL}/cars?page=1&limit=40&brand=Genesis` | `x-api-key: <APICARS_API_KEY>` |
| Single Vehicle Details | `GET {RINEVO_API_BASE_URL}/cars/{id}` | `x-api-key: <APICARS_API_KEY>` |

> **Security Reminder:** Never commit `.env` or `.env.local`, and never put `APICARS_API_KEY` into `NEXT_PUBLIC_*` or `VITE_*` client variables.
