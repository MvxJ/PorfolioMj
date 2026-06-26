# Portfolio — Maksymilian Jachymczak

Trilingual (PL / EN / UK) portfolio built with **Astro**, content-managed through the
lightweight, git-based **Sveltia CMS** (`/admin`), deployed on **Cloudflare**.

- **Static, zero-JS by default** — fast, SEO-friendly, easy for AI agents to read.
- **Content in the CMS** — hero, about, projects, experience, education, certifications,
  contact and appearance settings are all edited in the panel, no code required.
- **Appearance as data** — theme, accent color, fonts, animations and background are set
  in the panel; visitors can locally override the theme and language.

---

## 1. Requirements

- **Node.js ≥ 20** (22+ recommended) and **npm**
- Git

Check your versions:

```bash
node -v
npm -v
```

---

## 2. Quick start (run locally)

```bash
# 1. install dependencies
npm install

# 2. start the dev server
npm run dev
```

The site is available at **http://localhost:4321** (redirects to `/pl`).

> Note: in `dev` mode some interactive components (e.g. the experience list) hydrate
> only once they scroll into view — this is expected. The full, final look is best
> checked against a production build (section 4).

---

## 3. Which CMS and how it's wired in

The chosen CMS is **Sveltia CMS** — lightweight, git-based, no database and no backend.
It runs entirely in the browser. How it's wired into the project:

- **`public/admin/index.html`** — loads Sveltia from a CDN (pinned version) at `/admin`.
- **`public/admin/config.yml`** — defines the backend (GitHub), i18n and all collections
  (must stay in sync with `src/content.config.ts`).
- **`src/content/**`** — content as JSON files; saving in the panel = a commit to the repo.
- **`functions/auth.js` + `functions/callback.js`** — GitHub OAuth login handled by
  **Cloudflare Pages Functions in this same project** (see section 6).

### Local editing (no GitHub login)

The config already has `local_backend: true`. Just **one command**:

```bash
npm run dev:cms      # runs both: Astro (4321) + the local CMS proxy (8081)
```

Then open **http://localhost:4321/admin/index.html** → "Work with Local Repository".
Every save writes straight to the files in `src/content/` (you commit to git yourself).

> In `dev` mode use the full path `/admin/index.html` (the Astro dev server doesn't
> rewrite `/admin/` → `index.html`). On Cloudflare plain `/admin` works.

> Alternatively, in a Chromium browser, Sveltia can open the repo folder directly
> (File System Access API) — then the proxy isn't needed, but `npm run dev:cms` is the
> simplest, most reliable route.

---

## 4. Production build & preview

```bash
# build the static site into dist/
npm run build

# preview the built site locally
npm run preview
```

Type-check (optional):

```bash
npm run check
```

After `npm run build`, the `dist/` folder contains all 3 language versions, `/admin`,
`sitemap-index.xml`, `robots.txt`, `llms.txt` and the `_headers` file.

---

## 5. Managing content (in the `/admin` panel)

The panel is in Polish (the owner's language). Sections:

| Panel section | What you edit |
|---|---|
| **Ustawienia witryny → Wygląd** (Site settings → Appearance) | theme, accent color, fonts, animations, background, default language |
| **Ustawienia witryny → Dane** (→ Details) | name, role, email, social media |
| **Ustawienia witryny → SEO** | default title/description, OG image |
| **Hero** | greeting, role, tagline, buttons (PL/EN/UK) |
| **O mnie** (About) | bio, location, photo, stats |
| **Kontakt** (Contact) | intro text |
| **Projekty** (Projects) | add/edit projects (cover, gallery, technologies, description) |
| **Doświadczenie** (Experience) | work roles (company, logo, dates, technologies, achievements) |
| **Edukacja / Certyfikaty / Technologie** (Education / Certifications / Technologies) | list entries |

### Adding a new project
"Projekty" → **New Projekt** → fill in the fields, toggling PL/EN/UK on the multilingual
fields → upload the cover and gallery images → **Save**.

### Adding a new role (experience)
"Doświadczenie" → **New Stanowisko** → fill in the company, dates (`YYYY-MM`, empty "Do"
= "present"), technologies and achievements.

### Changing the site-wide color / theme
"Ustawienia witryny → Wygląd" → set the **accent color** and **theme** → **Save**.
The whole palette recomputes automatically (based on `color-mix`).

---

## 6. Deploy to Cloudflare Pages (with a working CMS — one project)

The site is fully static, so deploys are instant, and CMS login is handled by
**Cloudflare Pages Functions in the same project** (`functions/auth.js`,
`functions/callback.js`) — **no separate worker and no `auth.` subdomain**.

### Step 1 — connect the repo (once)
1. Push the repository to GitHub.
2. Cloudflare → **Workers & Pages → Create → Pages → Connect to Git** → pick the repo.
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Output directory: `dist`
3. **Save and Deploy.** Every push to `main` (including CMS commits) rebuilds the site.

> `functions/` is auto-detected by Cloudflare Pages — no configuration needed.

### Step 2 — enable CMS login (GitHub OAuth)
1. GitHub → Settings → Developer settings → **OAuth Apps → New**:
   - Homepage URL: `https://<your-domain>` (e.g. `https://maks-portfolio.pages.dev`)
   - **Authorization callback URL:** `https://<your-domain>/callback`
   - note the **Client ID** and **Client Secret**.
2. Cloudflare → project → **Settings → Environment variables** → add (Production):
   - `GITHUB_CLIENT_ID`
   - `GITHUB_CLIENT_SECRET`
3. In `public/admin/config.yml` set:
   - `backend.repo: <owner>/<repo>`
   - `backend.base_url: https://<your-domain>`
4. Redeploy. Now **https://<your-domain>/admin** → "Login with GitHub" works, and saving
   content commits to the repo and automatically rebuilds the site.

> Locally, `local_backend: true` still works (section 3) — OAuth isn't needed to edit on
> your own machine. In production Sveltia ignores it anyway.

> Note: Pages Functions (`functions/`) run on **Cloudflare Pages**. If you prefer the
> "Workers + static assets" variant, there's a ready `wrangler.jsonc` (`assets → ./dist`),
> but then OAuth needs a separate worker — Pages is faster and simpler.

---

## 7. Project structure

```
src/
├── content/            # CMS content (JSON) — settings, hero, about, contact,
│                       #   projects/, experience/, education/, certs/, tech/
├── content.config.ts   # collection schemas (Zod) — paired with public/admin/config.yml
├── i18n/               # static UI translations (PL/EN/UK) — not content
├── lib/                # theme, content (getters), routing, seo, dates
├── layouts/            # BaseLayout (head/SEO/fonts) → PageLayout (nav/footer/background)
├── components/
│   ├── primitives/     # Icon, TechIcon, Flag, Button, Badge, Divider
│   ├── molecules/      # ProjectCard
│   ├── sections/       # Hero, About, Skills, Experience, Projects, Contact, ...
│   └── islands/        # interactive React islands (theme, lang, background, tilt, ...)
├── styles/             # tokens.css, base.css, components.css
└── pages/[locale]/     # routes for the 3 languages + projects/[slug]
public/
├── admin/              # Sveltia CMS (index.html + config.yml)
└── assets/images/      # tech logos, project images, OG, uploads
functions/              # Cloudflare Pages Functions — GitHub OAuth for the CMS
├── auth.js             #   GET /auth     → start GitHub login
└── callback.js         #   GET /callback → exchange code for token
```

## 8. Useful commands

| Command | What it does |
|---|---|
| `npm run dev` | dev server (`localhost:4321`) |
| `npm run dev:cms` | Astro **+** local CMS at once (single command) |
| `npm run cms:proxy` | just the local CMS backend (edit files without OAuth) |
| `npm run build` | production build into `dist/` |
| `npm run preview` | preview the build |
| `npm run check` | type-check (`astro check`) |

---

## 9. Note on the starter content

The original prototype files (`portfolio-data.jsx`) weren't available during the build,
so the content (bio, project descriptions, experience) was **pre-filled with professional
copy** in all three languages, based on known companies and technologies.
**Review and edit it in the `/admin` panel** — that's exactly what the CMS is for.
Also update the social links (`github.com/maksjach`, `linkedin.com/in/maksjach`) and email
under "Ustawienia witryny → Dane" (Site settings → Details).
