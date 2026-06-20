# GlowTwin AI — Storage Refactor: Firebase Storage → Cloudinary
# Generated change manifest

## FILES TO DELETE
# (none yet created — this refactor prevents them from ever being created)
# If you have these from a previous branch, delete them:
#   frontend/src/services/storage.ts
#   frontend/src/services/storageService.ts
#   storage.rules  (no longer deployed)

## FILES TO MODIFY
#   firebase.json              → remove storage block + storage emulator
#   .env.example               → remove VITE_FIREBASE_STORAGE_BUCKET, add Cloudinary vars
#   .gitignore                 → unchanged (already correct)
#   frontend/src/hooks/useAnalysis.tsx  → add selfiePublicId, inspoPublicId to context
#   frontend/src/pages/UploadSelfie.tsx → use cloudinary.ts instead of Firebase Storage
#   frontend/src/pages/UploadInspo.tsx  → use cloudinary.ts instead of Firebase Storage
#   frontend/src/pages/Analyzing.tsx    → call analyzeImages Cloud Function with URLs
#   functions/package.json              → add axios, @google/generative-ai
#   functions/src/index.ts              → main Cloud Functions entry

## NEW FILES TO CREATE
#   frontend/src/services/cloudinary.ts   ← Cloudinary direct upload service
#   frontend/src/services/firebase.ts     ← Firebase init (Auth + Firestore only)
#   frontend/src/services/analysis.ts     ← calls analyzeImages Cloud Function
#   functions/package.json
#   functions/tsconfig.json
#   functions/src/index.ts               ← analyzeImages + saveBooking functions
#   functions/src/gemini.ts              ← Gemini Vision integration
#   functions/src/firestore.ts           ← Firestore write helpers
#   functions/.env.example               ← GEMINI_API_KEY, CLOUDINARY_CLOUD_NAME

## ARCHITECTURE SUMMARY
#
#   USER
#    │
#    ├─ uploads selfie → Cloudinary (unsigned preset) → gets { secure_url, public_id }
#    ├─ uploads inspo  → Cloudinary (unsigned preset) → gets { secure_url, public_id }
#    │
#    ├─ calls analyzeImages Cloud Function with:
#    │    { selfieUrl, inspirationUrl, city, budget, userId }
#    │
#    └─ Cloud Function:
#         ├─ fetches both image URLs → converts to base64
#         ├─ sends to Gemini Vision API → structured JSON response
#         ├─ writes analysis doc to Firestore (Admin SDK)
#         └─ returns analysis result to frontend
#
#   Firestore /analyses/{id} stores:
#     userId, selfieUrl, inspirationUrl, selfiePublicId, inspoPublicId,
#     city, budget, result, createdAt, status
