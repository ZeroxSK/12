# BuildBox — Best YouTube Projects

Dark-grid site with curated coding + maker projects. No build step — just open `index.html`.

## Run
- Double-click `index.html`, or: `npx serve .` / `python3 -m http.server`

## Features
- Search, category pills, level filter, sort, saved ★ (localStorage)
- Watch in modal, YouTube link, + Add your own (paste any YouTube URL)
- Hybrid live mode: ⚙ API → paste YouTube Data API v3 key → search bar queries YouTube live

## Get a YouTube API key (free)
1. console.cloud.google.com → new project → enable **YouTube Data API v3**
2. Credentials → Create → API key → copy
3. Paste in site via ⚙ API button

## Replace videos
Edit `CURATED` in `app.js`: set `youtubeId` to the 11-char ID from any YouTube URL.
