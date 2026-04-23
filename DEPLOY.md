# Deployment Guide

Pick one. All three are free for this project's traffic level.

---

## ⚡ Option 1 — Vercel (fastest, recommended)

**~2 minutes from zip to live URL.**

### Web UI (zero CLI)

1. Go to [vercel.com/new](https://vercel.com/new) and sign in with GitHub/Google.
2. Click **"Import"** → pick **"Upload"** (bottom of the page) and drag the `flatmate-finder` folder, **or** push it to a GitHub repo first and import that.
3. Vercel auto-detects Vite. Before clicking Deploy, expand **Environment Variables** and add:
   - `VITE_GOOGLE_MAPS_API_KEY` = `your_key_here`
   - `VITE_GOOGLE_MAPS_MAP_ID` = `your_map_id` *(optional)*
4. Click **Deploy**. You'll get a URL like `flatmate-finder-xyz.vercel.app` in ~60s.

### CLI (even faster if you have Node)

```bash
cd flatmate-finder
npx vercel
# follow prompts, link a project
npx vercel env add VITE_GOOGLE_MAPS_API_KEY
# paste your key when prompted, choose "Production"
npx vercel --prod
```

### 🔒 Lock the API key to your domain

After deploy, go to [Google Cloud Console → Credentials](https://console.cloud.google.com/google/maps-apis/credentials), edit your key, and under **Application restrictions → HTTP referrers** add:
- `https://*.vercel.app/*`
- `https://your-custom-domain.com/*` *(if you add one)*

Otherwise anyone who views the page source can steal your key.

---

## 🟢 Option 2 — Netlify

### Web UI

1. Go to [app.netlify.com/drop](https://app.netlify.com/drop) and sign in.
2. Run `npm install && npm run build` locally first (Netlify Drop needs the built `dist/` folder).
3. Drag the `dist/` folder onto the page. Live URL in seconds.

> **But** — env vars won't be set this way. For a real deploy with env vars, push to GitHub and use the git integration:

### GitHub integration (recommended)

1. Push `flatmate-finder` to a GitHub repo.
2. [app.netlify.com/start](https://app.netlify.com/start) → **Import from Git** → pick your repo.
3. Build settings are auto-filled from `netlify.toml`.
4. Under **Advanced → Environment variables**, add `VITE_GOOGLE_MAPS_API_KEY`.
5. Deploy.

### CLI

```bash
cd flatmate-finder
npx netlify-cli deploy --build --prod
# first run will prompt you to link/create a site
npx netlify-cli env:set VITE_GOOGLE_MAPS_API_KEY your_key_here
npx netlify-cli deploy --build --prod
```

🔒 Add `https://*.netlify.app/*` to your API key's allowed referrers.

---

## 🐙 Option 3 — GitHub Pages

Good if you want everything tied to a repo. The workflow file is already at `.github/workflows/deploy.yml`.

1. Create a new GitHub repo and push this project to it.
2. Go to repo **Settings → Pages** → set **Source** to **"GitHub Actions"**.
3. Go to **Settings → Secrets and variables → Actions → New repository secret**:
   - Name: `VITE_GOOGLE_MAPS_API_KEY`
   - Value: your key
   - *(Optional)* add `VITE_GOOGLE_MAPS_MAP_ID` the same way
4. Push to `main` — the workflow runs automatically and publishes to `https://<username>.github.io/<repo>/`.

**Note:** GH Pages serves from a subpath. Add this to `vite.config.js`:

```js
// vite.config.js
export default defineConfig({
  plugins: [react()],
  base: '/flatmate-finder/',  // <-- match your repo name
});
```

🔒 Add `https://<username>.github.io/*` to your API key's allowed referrers.

---

## Quick comparison

| Host           | Setup time | Custom domain | Env vars | Best for |
|----------------|------------|---------------|----------|----------|
| **Vercel**     | 2 min      | Free          | Easy UI  | Fastest path to a live URL |
| **Netlify**    | 3 min      | Free          | Easy UI  | If you already use Netlify |
| **GH Pages**   | 10 min     | Free          | Via secrets | If you want everything in Git |

---

## ⚠️ Before you deploy — two things

1. **The listings data is bundled into the JS.** Anyone can download it by viewing source. Fine for a prototype; if the data is sensitive, move it behind an API.
2. **Restrict your Google Maps API key by HTTP referrer** (see the 🔒 sections above). An unrestricted key can be abused and you'll get billed.
