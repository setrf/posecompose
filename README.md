PoseCompose
===========

Create realistic group photos by compositing individual people into a background scene using Google Gemini. Upload one background photo and multiple subject photos, remove backgrounds for subjects, arrange them, and generate a final composite image.

Live Production: https://posecompose.com (canonical) and https://www.posecompose.com (content host)

Table of Contents
-----------------

- Overview
- Features
- Architecture
- Frontend (Vite/React/TS)
- Backend API Proxy (Express)
- Infrastructure (Nginx, TLS, domains)
- Local Development
- Build & Artifacts
- Deployments
- Configuration
- Security
- Caching & Performance
- Operational Runbook
- Troubleshooting
- Directory Structure
- Roadmap / Future Improvements

Overview
--------

PoseCompose is a static, single‑page application (SPA) built with Vite + React + TypeScript and styled with Tailwind + shadcn/ui. It communicates with a small server‑side Node/Express proxy that calls Google’s Generative Language (Gemini) API using a server‑held API key. The server key is never embedded in the browser bundle or exposed to clients.

Features
--------

- Upload a background photo (or choose a sample scene).
- Upload multiple person photos; remove backgrounds per person.
- Arrange (order) selected people for composition.
- Choose output aspect ratios and social formats.
- Generate a final composite image via the Gemini API.
- Download/view generated results.

Architecture
------------

- Frontend: Vite + React + TypeScript SPA compiled to static assets (HTML/CSS/JS) in `dist/`.
- Backend: Node/Express service running on `127.0.0.1:4005` provides a single endpoint:
  - `POST /api/gemini/generate-content` → forwards to Google’s Gemini generateContent endpoint using the server‑held API key.
- Nginx:
  - Serves static assets for the site (domain root).
  - Proxies `/api/` requests to the backend service.
  - TLS is provided by Let’s Encrypt via Certbot; HSTS is enabled.
  - Apex domain redirects permanently to the www host for canonicalization.

Frontend (Vite/React/TS)
------------------------

- Entry: `index.html`, source under `src/`.
- UI toolkit: Tailwind CSS + shadcn/ui components.
- Key components:
  - `GroupPhotoGenerator.tsx` – orchestrates steps and generation flow.
  - `BackgroundUpload.tsx` – background chooser and file uploads.
  - `PersonUpload.tsx` – person photo uploads; triggers background removal.
  - `PersonSelection.tsx` – selection and ordering of subjects.
  - `ResultDisplay.tsx` – shows/completes the generated composite.
  - `FormatSelection.tsx` – social format presets and aspect ratios.
- Image processing (client‑side):
  - Background removal is done via API calls to Gemini.
  - People images are drawn side‑by‑side on a temporary canvas and then composited into a final canvas sized to the target aspect ratio. The stitched “people strip” is exported as JPEG to ensure compatibility with the upstream API.
  - The final request sends two inline images to Gemini: the background (JPEG) and the stitched people (JPEG).

Backend API Proxy (Express)
--------------------------

- Location on server: `/opt/posecompose-api`.
- Service file: `/etc/systemd/system/posecompose-api.service` (enabled at boot).
- Env file (owner root, mode 600): `/etc/posecompose-api.env` containing:
  - `GEMINI_API_KEY=<YOUR_SERVER_SIDE_KEY>` (stored securely, never sent to clients)
  - `PORT=4005`
- Server code: `server.js` uses Express JSON body parsing and forwards requests to:
  - `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent`
  - API key is supplied via `x-goog-api-key` header.
- Health endpoint: `GET /healthz` → `{ ok: true }`.
- JSON body limit: 30 MB (to match Nginx limits and large base64 payloads).

Infrastructure (Nginx, TLS, domains)
------------------------------------

- Static site root: `/var/www/apps/posecompose` (deployed build artifacts).
- Vhost: `/etc/nginx/sites-available/posecompose.com` (symlinked in `sites-enabled`).
- Canonical host: `www.posecompose.com` serves content; apex `posecompose.com` redirects 301 to `https://www.posecompose.com`.
- TLS: Let’s Encrypt/Certbot, auto‑renewal timer managed by systemd.
- Security headers: HSTS, X‑Content‑Type‑Options, X‑Frame‑Options, Referrer‑Policy.
- Caching:
  - HTML (root/index.html): `Cache-Control: no-store, no-cache, must-revalidate, max-age=0`.
  - Assets (`.css/.js/.png/.jpg/.jpeg/.gif/.svg/.ico/.webmanifest`): `Cache-Control: public, max-age=604800, immutable` with 7‑day expiry.
- Favicon: explicitly disabled (returns 204 with `no-store`) to avoid stale icons.

Local Development
-----------------

Requirements
- Node.js 18+ and npm

Install and run
```sh
npm ci
npm run dev
```

Open http://localhost:8080

Build & Artifacts
-----------------

Build for production
```sh
npm run build
```

Outputs to `dist/` with hashed assets and `index.html` for static hosting at a domain root. If hosting under a subpath (e.g., `/apps/posecompose/`), build with a base path:
```sh
npm run build -- --base=/apps/posecompose/
```

Deployments
-----------

Static files
- Deployed to: `/var/www/apps/posecompose`
- Helper command on the server:
```sh
/usr/local/bin/deploy_static /root/Projects/apps/posecompose-repo/dist posecompose
```

Nginx vhost (summary)
- Content host (HTTPS): `www.posecompose.com` serves from `/var/www/apps/posecompose` and proxies `/api/`.
- Apex redirect (HTTPS): `posecompose.com` → `https://www.posecompose.com$request_uri`.
- HTTP: both apex and www redirect to HTTPS www.

Backend service management
```sh
# Check status
systemctl status posecompose-api.service

# View logs
journalctl -u posecompose-api -n 200 -f

# Restart after changes
sudo systemctl restart posecompose-api.service
```

Nginx operations
```sh
sudo nginx -t && sudo systemctl reload nginx
```

Configuration
-------------

Environment / Secrets
- Google Gemini API key is stored server‑side in `/etc/posecompose-api.env` and read by the backend service.
- Do not embed keys in the frontend; the app calls the server proxy at `/api/gemini/generate-content`.

Body/Request Sizes
- Nginx `client_max_body_size` = 30 MB on the vhost.
- Express JSON limit = 30 MB.

Domains & Canonicalization
- Canonical content domain: `www.posecompose.com`.
- Apex `posecompose.com` always 301 redirects to the www host to avoid split caching and ensure consistent linking.

Security
--------

- API key protection: Key exists only in `/etc/posecompose-api.env`, never sent to the client or stored in static assets.
- TLS + HSTS: Enforced via Nginx configuration; renewals handled by Certbot.
- Favicon disabled: Prevents stale browser caching of icons when branding changes.
- Optional hardening not yet enabled (candidates):
  - Content Security Policy (CSP) tuned for the current stack.
  - Nginx rate‑limiting on `/api/` to mitigate abuse.

Caching & Performance
---------------------

- HTML is marked as no‑store/no‑cache to prevent stale app shells.
- Static assets are long‑cached and content‑hashed, safe to cache for 7 days.
- Client uses canvas compositing and exports JPEG (quality 0.9) to reduce payload size and maximize API compatibility.

Operational Runbook
-------------------

Deploy a new build
```sh
cd /root/Projects/apps/posecompose-repo
npm ci
npm run build
/usr/local/bin/deploy_static dist posecompose
sudo nginx -t && sudo systemctl reload nginx
```

Rotate the API key
```sh
sudo editor /etc/posecompose-api.env   # update GEMINI_API_KEY
sudo systemctl restart posecompose-api.service
```

Check backend health
```sh
curl -s http://127.0.0.1:4005/healthz
```

Troubleshooting
---------------

Symptoms and remedies:

- 404 on `/api/gemini/generate-content`:
  - Ensure Nginx keeps the `/api/` prefix intact: `proxy_pass http://127.0.0.1:4005;` (no trailing slash).
  - Confirm backend is running: `systemctl status posecompose-api.service`.

- 413 Request Entity Too Large:
  - Increase Nginx `client_max_body_size` and Express JSON limit (both set to 30 MB here).

- 400 INVALID_ARGUMENT from Gemini:
  - Ensure images are sent as JPEG (no alpha) and sizes are reasonable. The app exports stitched people as JPEG.
  - Retry with smaller images or fewer subjects if bandwidth‑constrained.

- Apex shows old version while www is fresh:
  - This app enforces apex → www redirect to avoid split cache. If you ever disable the redirect, keep HTML no‑store headers.

Directory Structure
-------------------

```
apps/posecompose-repo/
├─ index.html
├─ package.json
├─ vite.config.ts
├─ public/
│  ├─ placeholder.svg
│  └─ robots.txt
├─ src/
│  ├─ components/
│  │  ├─ GroupPhotoGenerator.tsx
│  │  ├─ BackgroundUpload.tsx
│  │  ├─ PersonUpload.tsx
│  │  ├─ PersonSelection.tsx
│  │  ├─ ResultDisplay.tsx
│  │  ├─ FormatSelection.tsx
│  │  └─ ui/*
│  └─ main.tsx …
└─ dist/ (build output)
```

Roadmap / Future Improvements
-----------------------------

- Add CSP and strict security headers tailored to current external resources (Google Fonts, etc.).
- Implement Nginx rate limiting for `/api/` to throttle abusive traffic.
- Add GitHub Actions workflow for automated build/deploy over SSH.
- Add client‑side downscaling of very large uploads to reduce latency.
- Optional branding (favicon/social image) pipeline.
