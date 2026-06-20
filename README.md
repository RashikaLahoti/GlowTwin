# GlowTwin AI — Know Before You Glow

AI-powered beauty decision platform. Upload your selfie + inspiration look → get an honest hair analysis, full 12-month cost breakdown, and a matched salon specialist.

---

## Architecture

```
Frontend (React + Vite + Tailwind)
  │
  ├─ Cloudinary       → image upload (unsigned preset, auto-delete 24h)
  ├─ Firebase Auth    → optional Google sign-in
  └─ Cloud Functions  → analyzeImages / saveBooking

Cloud Functions (Node 20 + TypeScript)
  │
  ├─ Receives Cloudinary secure_urls
  ├─ Fetches images via axios → base64
  ├─ Sends to Gemini Vision API → structured JSON
  └─ Writes result to Firestore (Admin SDK)

Firestore
  ├─ /users/{userId}
  ├─ /analyses/{analysisId}
  └─ /bookings/{bookingId}

NO Firebase Storage — Cloudinary handles all images.
```

---

## What was removed vs what's used

| Service | Status | Reason |
|---|---|---|
| Firebase Storage | ❌ Removed | Requires Blaze billing |
| `storage.rules` | ❌ Deleted | Not deployed |
| `storageService.ts` | ❌ Never created | |
| Cloudinary | ✅ Added | Free tier, direct upload |
| Firebase Auth | ✅ Kept | Google sign-in |
| Firestore | ✅ Kept | Analysis + booking storage |
| Cloud Functions | ✅ Kept | Gemini integration |
| Gemini Vision | ✅ Kept | Core AI analysis |

---

## Files changed in storage refactor

### Deleted / never created
- `storage.rules` — removed from `firebase.json`, not deployed
- `src/services/storage.ts` — never created
- `src/services/storageService.ts` — never created

### New files created
```
src/services/cloudinary.ts     ← direct Cloudinary upload
src/services/firebase.ts       ← Firebase Auth + Firestore init (no Storage)
src/services/analysis.ts       ← calls analyzeImages Cloud Function
functions/src/index.ts         ← analyzeImages + saveBooking Cloud Functions
functions/src/gemini.ts        ← Gemini Vision integration
functions/src/firestore.ts     ← Firestore Admin SDK helpers
```

### Modified files
```
firebase.json          ← storage block removed, storage emulator removed
.env.example           ← VITE_FIREBASE_STORAGE_BUCKET removed, Cloudinary added
.gitignore             ← storage.rules.debug removed
src/hooks/useAnalysis.tsx ← selfiePublicId + inspoPublicId added to context
src/pages/UploadSelfie.tsx ← uploads to Cloudinary, shows progress
src/pages/UploadInspo.tsx  ← uploads to Cloudinary, shows progress
src/pages/Analyzing.tsx    ← calls analyzeImages Cloud Function
```

---

## Setup

### 1. Clone and install

```bash
git clone <your-repo>
cd glowtwin

# Frontend
npm install

# Cloud Functions
cd functions && npm install && cd ..
```

### 2. Firebase project

```bash
npm install -g firebase-tools
firebase login
firebase projects:create glowtwin-ai   # or use existing
firebase use glowtwin-ai
```

Enable these in Firebase Console:
- Authentication → Google provider
- Firestore Database → create in production mode
- Cloud Functions → requires Blaze plan (pay-as-you-go, free tier generous)

### 3. Cloudinary setup

1. Sign up at cloudinary.com (free tier: 25GB storage, 25GB bandwidth/month)
2. Settings → Upload → Upload Presets → **Add upload preset**
   - Preset name: `glowtwin_uploads`
   - Signing Mode: **Unsigned**
   - Folder: `glowtwin/uploads`
   - Allowed formats: `jpg,jpeg,png,webp,heic`
   - Max file size: 10 MB
3. Note your **Cloud name** from the dashboard

### 4. Gemini API key

1. Go to [aistudio.google.com](https://aistudio.google.com) → Get API key
2. Or: Google Cloud Console → APIs → Generative Language API → Credentials

### 5. Environment variables

**Frontend** — copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in:
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...

VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=glowtwin_uploads

VITE_FUNCTIONS_BASE_URL=http://127.0.0.1:5001/your-project-id/us-central1
```

**Cloud Functions** — copy `functions/.env.example` to `functions/.env`:

```bash
cp functions/.env.example functions/.env
```

Fill in:
```
GEMINI_API_KEY=your-gemini-api-key
```

### 6. Deploy Firestore rules

```bash
firebase deploy --only firestore:rules,firestore:indexes
```

### 7. Run locally

**Terminal 1 — Firebase emulators:**
```bash
firebase emulators:start --only auth,firestore,functions
```

**Terminal 2 — Frontend dev server:**
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

> **Demo mode:** If `VITE_FUNCTIONS_BASE_URL` is not set or contains `YOUR_PROJECT_ID`,
> the Analyzing screen uses mock data — no Cloud Function call is made.
> You'll see "DEMO MODE" label on the analysis screen.

### 8. Deploy to production

```bash
# Build frontend
npm run build

# Deploy functions + Firestore rules
firebase deploy --only functions,firestore

# Deploy frontend to Firebase Hosting (optional)
firebase deploy --only hosting
```

---

## Firestore data model

```
/analyses/{analysisId}
  userId: string | undefined
  selfieUrl: string              ← Cloudinary secure_url
  inspirationUrl: string         ← Cloudinary secure_url
  selfiePublicId: string         ← Cloudinary public_id
  inspoPublicId: string          ← Cloudinary public_id
  city: string
  budget: string
  status: 'pending' | 'processing' | 'complete' | 'error'
  result: GlowTwinAnalysis       ← written by Cloud Function
  createdAt: Timestamp
  completedAt: Timestamp

  /bookings/{bookingId}
    salon: string
    date: string
    time: string
    stylistBriefSent: true
    createdAt: Timestamp

/users/{userId}
  email: string
  displayName: string
  createdAt: Timestamp

/bookings/{bookingId}            ← top-level mirror for easy querying
  (same as sub-collection above)
```

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend framework | React 18 + Vite 6 |
| Styling | Tailwind CSS v4 |
| Routing | React Router v7 |
| Toasts | Sonner |
| Icons | Lucide React |
| Image upload | Cloudinary (unsigned preset) |
| Auth | Firebase Auth (Google) |
| Database | Cloud Firestore |
| Backend | Firebase Cloud Functions v2 (Node 20) |
| AI | Google Gemini 1.5 Flash (Vision) |
| Image fetching | Axios (in Cloud Function) |

---

## Hackathon demo flow

1. Open app → Landing page
2. Tap "Analyze My Look"
3. Upload selfie (drag & drop or file picker) → uploads to Cloudinary live
4. Upload inspiration photo → same
5. Select city + budget → "Analyze My Look"
6. Watch 7-step analysis animation while Gemini runs
7. Reality Report → honest Gemini analysis, hair health score
8. Cost Breakdown → 12-month TCO reveal
9. Glow Roadmap → month-by-month plan
10. Stylist Brief → screenshot-worthy card, download / share
11. Salon Matching → 3 matched specialists
12. Book → date picker → Booking Confirmation

**For demo without API keys:** Leave `VITE_FUNCTIONS_BASE_URL` unset.
Mock data runs automatically — full UI flow works offline.
