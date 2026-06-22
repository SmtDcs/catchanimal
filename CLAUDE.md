# CatchCat — Project Context for AI (June 2026)

## Project Goal
A fun browser-based game where users use their **live camera** to detect real cats or dogs (like a real-world Pokemon Go + camera catcher), play a minigame, "catch" them, and get a collectible card with:
- Funny generated name
- Detected breed/species
- Snapshot photo from the moment of catch

Long-term: Turn these into real ERC-721 NFTs on the **Monad** blockchain.

**Important principles from user:**
- Only live camera (no photo upload)
- Real client-side AI (no server for detection)
- Must work well on phone
- Keep it fun and simple first

## Tech Stack
- **Frontend**: Next.js 16 (App Router) in `/frontend`
- **Styling**: Tailwind CSS v4 (`@import "tailwindcss"`)
- **AI Detection**: TensorFlow.js + `@tensorflow-models/coco-ssd` (COCO-SSD) — fully client-side, lazy loaded
- **Minigame**: Custom drag-and-drop (pointer + touch events)
- **Persistence**: Currently `localStorage` (demo)
- **Deployment**: Vercel (frontend only, Root Directory = `frontend`)
- **Contracts**: Hardhat + Solidity in root (`contracts/CatNFT.sol`)
- **Blockchain**: Monad Testnet (Chain ID 10143)
- **GitHub**: https://github.com/SmtDcs/catchanimal.git

## Current Feature Status (as of latest local state)

### Working
- Live camera access (`getUserMedia` with back camera preference)
- Real AI detection:
  - Loads COCO-SSD model on demand
  - Detects "cat" or "dog" with > 0.6 confidence
  - Assigns a plausible breed from a small list
  - Generates funny name (e.g. "Sir Meowington", "Sergeant Barkley")
- Interactive minigame: Drag the food can (🥫) to hit the target area
- Photo capture: Uses hidden `<canvas>` to snapshot the video frame when detected
- Collection page: Lists caught pets with photo, name, breed, confidence, timestamp (localStorage)
- Discover page: List of simulated "wild" spawns near user, can "catch" them into collection
- Dark themed UI with cards (GlassCard), buttons, etc. — Tailwind v4 fixes applied (postcss.config.mjs + @import syntax)

### Not Yet Implemented / Demo Only
- Real on-chain mint (ERC721)
- IPFS upload for photos/metadata
- Any on-chain data persistence
- Advanced stats/rarity/evolution
- Real geolocation + map for wild spawns (currently static/simulated list)
- Wallet connection actually calling mint (button exists but no-op)

## Known Current Issue (User Reported Right Now)
**"Canlı kamera sistemi çalışmıyor"** — Live camera system is not working.

Relevant code is almost entirely in:
`frontend/src/app/catch/page.tsx` (429 lines)

Key parts:
- `startCamera()` → `navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } ... } })`
- `loadModel()` → dynamic import of @tensorflow/tfjs + @tensorflow-models/coco-ssd, tries WebGL then CPU fallback
- `runDetection()` → `await model.detect(video)`, looks for cat/dog with score > 0.6
- If nothing good is detected → shows Turkish alert
- On success → generates funny name, calls `captureFrame()`, shows minigame

### Likely Causes for Camera Not Working
1. **Model loading is slow or silent-failing** on first use (big download + inference). There is `isLoadingModel` state but it is not being set to true properly before the await.
2. **No animal in view** or confidence never exceeds 0.6 → just the "hiçbir kedi veya köpek tespit edilemedi" alert.
3. **WebGL not available** on the device → falls back to very slow CPU mode.
4. **HTTPS / permission issues** on certain browsers (especially mobile). The Vercel link is HTTPS, which is good.
5. The flow requires clicking "AI ile Tespit Et" explicitly (not automatic continuous detection).
6. On some phones the video element might not be ready when detect is called.

Current quick wins that would help:
- Show a clear "Model yükleniyor... (birkaç saniye sürebilir)" state while loading the TensorFlow model for the first time.
- Set `isLoadingModel` to true before `loadModel()` and false after.
- Better error messages (distinguish between "no animal found" vs "model failed to load").
- Consider a "Tekrar dene" button or make detection easier to trigger.

## Project Structure (Important)
```
catchcat-monad/
├── contracts/              # Hardhat (CatNFT.sol is the main one for future minting)
├── frontend/               # The actual Next.js app (this is what Vercel deploys)
│   ├── src/app/catch/page.tsx          # ← 90% of the current logic lives here
│   ├── src/app/collection/page.tsx
│   ├── src/app/discover/page.tsx
│   ├── src/app/layout.tsx
│   └── ...
├── hardhat.config.ts
└── CLAUDE.md               # This file
```

**Deployment note**: On Vercel, Root Directory must be set to `frontend`.

## How to Continue Development With This File
When starting a new chat with Claude 3.5 / Cursor Composer / any other model:

**First message / instruction to the new AI:**

"Read the file CLAUDE.md at the root of the project. This is the full current context for the CatchCat project. Continue development from the exact state described in this file. The main current blocker is that the live camera system is not working."

This file + the source code should let the new AI pick up without losing the history.

## Current High-Level Plan (June 2026)
1. Make the live camera + AI detection reliably work on phone (current priority).
2. Polish the catch → minigame → collection flow.
3. Decide on next big chunk: real on-chain mint (using the existing CatNFT.sol) or improving collection / map.
4. Keep everything client-side for detection and core gameplay.

## Local Development
```bash
cd frontend
npm run dev
```

Test the camera flow at /catch.

---

**Summary for new AI:**  
We have a working prototype of the core loop (camera → AI detection → minigame → catch with photo + funny name). The UI styling is fixed. The only major current blocker reported by the user is "canlı kamera sistemi çalışmıyor". Focus there first, then ask what the next priority is.

Keep changes pragmatic and test on actual phone when possible.