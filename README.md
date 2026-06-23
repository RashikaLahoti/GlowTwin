# 🌟 GlowTwin AI — Know Before You Glow

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black&style=flat-square)](#)
[![Vite](https://img.shields.io/badge/Vite-6.3-646CFF?logo=vite&style=flat-square)](#)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?logo=tailwindcss&style=flat-square)](#)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?logo=node.js&logoColor=white&style=flat-square)](#)
[![Express](https://img.shields.io/badge/Express-4.19-000000?logo=express&logoColor=white&style=flat-square)](#)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white&style=flat-square)](#)
[![Gemini](https://img.shields.io/badge/Google_Gemini-2.5_Flash-4285F4?logo=google-gemini&logoColor=white&style=flat-square)](#)
[![OpenRouter](https://img.shields.io/badge/OpenRouter-API-7E56C2?style=flat-square)](#)

GlowTwin AI is a security-hardened, visual beauty-decision platform that takes the guessing out of high-stakes hair and beauty transformations. By analyzing a client's selfie alongside their inspiration look, GlowTwin predicts chemical feasibility, outlines a comprehensive 12-month Cost of Ownership (TCO), creates a tailored hair prep roadmap, generates a shareable Stylist Brief, and matches them with certified local specialists.

---

## ⚠️ The Problem

1. **High-Stakes Feasibility Blunders:** Chemical hair processing (e.g., bleaching dark South Asian hair to platinum blonde) carries severe risks of irreversible chemical burns, hair breakage, and patchy color distribution.
2. **Hidden 12-Month Maintenance Costs:** Salon clients are often blindsided by the "Total Cost of Ownership" (TCO). A ₹5,500 initial balayage session actually costs ₹35,000+ annually when factoring in toning, bond builders, and specialized home products.
3. **Mismatched Stylists:** Clients select salons based on proximity or generic reviews rather than verifying if the stylist is certified in their specific target technique (e.g., free-hand balayage).
4. **Lost in Translation:** Clients struggle to communicate technical specifications (undertones, current hair history, developer strength limits) to their stylists, leading to mismatched results.

---

## ✨ The GlowTwin Solution

GlowTwin bridges the gap between client aspirations, financial reality, hair health, and professional salon implementation:

*   **AI Visual Analysis (Reality Report):** Evaluates hair type, natural undertones, face shape, and current hair health (1–10 score) by comparing the user's selfie and inspiration image.
*   **Total Cost of Ownership (TCO) Calculator:** Predicts costs over a 12-month horizon (initial session, regular toning, bond treatments, home care products) with an honest "AI Cost Note".
*   **Glow Roadmap:** Delivers a 3-to-5 phase step-by-step prep and maintenance roadmap (e.g., at-home moisture/protein protocols to raise hair health score before bleaching).
*   **Stylist Brief:** Generates a downloadable, technical brief card specifying hair properties, target technique, and developer limits for the client to share with their stylist.
*   **Salon Specialist Matcher:** Recommends verified local salons in **Mumbai**, **Bangalore**, and **Bhopal** filtered by certified specialties, budget thresholds, availability, and bond-building capability (e.g., Olaplex).
*   **JWT-Authenticated Bookings:** Allows users to schedule appointments and saves booking briefs securely in MongoDB.

---

## 🏗️ Architecture Overview

GlowTwin AI is built on a decoupled, secure client-server architecture:

```
                      ┌────────────────────────┐
                      │    Client Browser      │
                      │  (React + Tailwind v4) │
                      └───────────┬────────────┘
                                  │
          1. Direct Upload        │ 2. POST /analyze
          (Unsigned Preset)       │    with image URLs
                                  ▼
 ┌───────────────┐      ┌──────────────────┐      ┌───────────────┐
 │  Cloudinary   │      │ Express Backend  │      │    MongoDB    │
 │ Image Hosting │      │     (Node.js)    │      │   Database    │
 └──────┬────────┘      └─────────┬────────┘      └───────┬───────┘
        ▲                         │                       ▲
        │ 4. Downloads Base64     │ 3. Create Pending Doc │ 7. Updates Doc
        │    & sends to Gemini    │ 6. Zod Validate & Save│    to Complete
        │                         ▼                       │
        │             ┌──────────────────────┐            │
        └─────────────┤    OpenRouter API    ├────────────┘
                      │ (Gemini 2.5 Flash)   │
                      └──────────────────────┘
```

### Decoupled Media Handling
To bypass database payload bottlenecks and optimize transfer speeds, the frontend uploads images directly to Cloudinary using an unsigned upload preset (configured with a 10MB limit and a 24-hour auto-delete lifecycle). Only the secure HTTPS URLs and public IDs are transmitted to the backend.

---

## 🛠️ Technology Stack

| Layer | Technologies | Key Features |
|---|---|---|
| **Frontend Framework** | React 18 · Vite 6 · TypeScript 5.4 | Single Page App, lightning-fast rendering, route lazy loading. |
| **Styling & Icons** | Tailwind CSS v4 · Lucide React | Curated, dark-mode/glassmorphism aesthetics, responsive layouts. |
| **Routing & Toasts** | React Router v7 · Sonner | Smooth, client-side page transitions and feedback. |
| **Database** | MongoDB · Mongoose | Flexible document modeling for users, analyses, and bookings. |
| **Backend API** | Node.js (v20+) · Express | Structured MVC pattern, security middleware, JWT authentication. |
| **AI Vision Processor** | OpenRouter API · Gemini 2.5 Flash | Multimodal visual processing, schema-enforced analysis. |
| **Media Pipeline** | Cloudinary Unsigned Upload API | Fast image uploads, automatic thumbnail transformations, auto-cleanup. |
| **Validation & Safety** | Zod · Rate Limit Middleware · BCryptJS | strict schema enforcement, endpoint rate limits, password hashing. |

---

## 🧠 AI Analysis Pipeline

The visual analysis pipeline is engineered for high reliability:

1. **Structured Multimodal Prompting:** The backend queries `google/gemini-2.5-flash` via OpenRouter. The prompt forces Gemini to act as a seasoned South Asian trichologist and colorist.
2. **Strict JSON Constraints:** Gemini is instructed to respond *only* with a clean JSON object conforming to an exact structural schema.
3. **Resiliency & JSON Repair:** The backend includes a repair helper that automatically strips markdown code fences, trailing commas, and formatting bugs before parsing.
4. **Zod Validation:** The backend validates the parsed response using a strict Zod schema (`GeminiAnalysisSchema`). If the array limits (exactly 3 reality points, 3 alternatives, 3-5 milestones) or ranges (hair health 1-10) are violated, the pipeline retries.
5. **Exponential Backoff:** If the analysis fails, the backend triggers up to **2 retries** with exponential backoff (2s → 4s delays) before returning an error.

---

## 💅 Salon Recommendation System

Matches are generated dynamically using `src/services/salon-finder.ts` matching client specifications with salon criteria:

*   **Technique Matching:** Recommends salons specializing in the exact technique detected by Gemini (e.g., Balayage, Precision Cuts).
*   **Budget Alignment:** Compares the salon's minimum pricing thresholds against the user's selected budget range.
*   **Curly Hair Filters:** Flags salons with verified specialties in curly/wavy hair types (Types 2A–4C).
*   **Damage/Risk Mitigation:** Matches high-risk analyses with salons offering premium bond-building protection (Olaplex).
*   **Availability:** Highlights salons with immediate openings ("Available This Week").

---

## 📡 API Overview

The Express backend exposes the following routes under `/api`:

### 🔐 Authentication (`/api/auth`)
*   `POST /register` - Registers a new user. Hashes password using BCryptJS and sets a secure HttpOnly refresh token cookie.
*   `POST /login` - Authenticates user credentials. Returns a short-lived access JWT (15-minute expiry) and sets a refresh cookie.
*   `POST /google-mock` - Hackathon bypass endpoint. Authenticates or registers a demo Google user, returning access tokens without requiring external OAuth setups.
*   `POST /refresh` - Reads the refresh token from cookie or request body, validating it to issue a new access token.
*   `POST /logout` - Clears the HttpOnly refresh token cookie.

### 🧠 AI Analyses (`/api/analyses`)
*   `POST /analyze` - *(Rate Limited: 5 req/min)* Accepts `selfieUrl`, `selfiePublicId`, `inspirationUrl`, `inspoPublicId`, `city`, `budget`. Runs Gemini Vision analysis and logs a pending document in MongoDB, which updates to complete upon success. (Supports optional authentication to tie analyses to users).
*   `GET /` - *(Requires Authentication)* Returns the logged-in user's analysis history, ordered newest first.
*   `GET /:id` - *(Optional Authentication)* Fetches a specific analysis. Enforces ownership security checks if a user is associated with the analysis.

### 📅 Bookings (`/api/bookings`)
*   `POST /` - Saves a salon booking (`analysisId`, `salon`, `date`, `time`). Verifies the analysis ID exists.
*   `GET /` - *(Requires Authentication)* Fetches the logged-in user's booking records, populating full analysis details.

---

## ⚙️ Local Development Setup

### Prerequisites
*   Node.js 20+ installed
*   MongoDB installed locally (running on `mongodb://127.0.0.1:27017`) or a MongoDB Atlas URI
*   Cloudinary Account (Free Tier)
*   OpenRouter API Key (to query Gemini 2.5 Flash)

---

### Step 1: Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd glowtwin

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

---

### Step 2: Configure Environment Variables

#### Frontend Configuration
Create a `.env` file in the **root directory**:

```env
# Cloudinary Configuration
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=glowtwin_uploads

# Backend API Endpoint
VITE_FUNCTIONS_BASE_URL=http://localhost:5000/api
```

#### Backend Configuration
Create a `.env` file inside the `backend` directory:

```env
# Server Port & Mode
PORT=5000
NODE_ENV=development

# Database Connection (Local fallback is used if empty)
MONGODB_URI=mongodb://127.0.0.1:27017/glowtwin

# JWT Encryption Keys (Generate strong keys for production)
JWT_ACCESS_SECRET=your_jwt_access_secret_key_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here

# OpenRouter API Key
OPENROUTER_API_KEY=your_openrouter_api_key_here

# CORS Configuration (Origins permitted to make API requests)
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173
```

---

### Step 3: Configure Cloudinary Presets

To enable unsigned uploads directly from the frontend:
1. Log in to [Cloudinary](https://cloudinary.com).
2. Go to **Settings** (gear icon) → **Upload** → **Upload presets**.
3. Click **Add upload preset**.
4. Configure as follows:
   *   **Preset name:** `glowtwin_uploads` (must match `VITE_CLOUDINARY_UPLOAD_PRESET`).
   *   **Signing mode:** `Unsigned` (critical for client-side uploads).
   *   **Folder:** `glowtwin/uploads`.
   *   **Allowed formats:** `jpg, jpeg, png, webp, heic`.
   *   **Max file size:** `10` MB.
5. Click **Save**.

---

### Step 4: Run Locally

Start the servers in separate terminal sessions:

**Terminal 1 (Backend API):**
```bash
cd backend
npm run dev
```
*App will connect to MongoDB and start nodemon at [http://localhost:5000](http://localhost:5000).*

**Terminal 2 (Frontend Client):**
```bash
npm run dev
```
*Launches the Vite development server at [http://localhost:5173](http://localhost:5173).*

---

### 💡 Hackathon Demo Mode (Offline / No Keys Setup)

To test the application instantly without setting up API keys, simply **leave the backend server offline**. 

When the frontend fails to reach the backend, it detects the connection failure and automatically falls back to **Demo Mode** using a high-fidelity mock dataset (`MOCK_RESULT` inside [useAnalysis.tsx](file:///c:/dev/Clonned%20GlowTwin/Clonned%20GlowTwin/src/hooks/useAnalysis.tsx)). A clear "DEMO MODE" badge will appear in the UI, enabling a zero-configuration walkthrough of the entire user path.

---

## 🌍 Deployment Details

### Backend Deployment (Render / Heroku)
The Express backend is production-ready for deployment on platform services (e.g., Render, Heroku):
1. Connect your repository to Render.
2. Create a Web Service pointing to the root directory, with build command `cd backend && npm install` and start command `cd backend && npm start`.
3. Add the production environment variables (e.g., `MONGODB_URI` using Atlas, `OPENROUTER_API_KEY`, etc.).
4. Set `ALLOWED_ORIGINS` to your production frontend URL.

### Frontend Deployment (Vercel / Netlify / Firebase Hosting)
Build the frontend asset bundle:
```bash
npm run build
```
This generates optimized HTML, CSS, and JS assets in the `dist` directory (~250KB gzipped). Upload this folder to Vercel, Netlify, or Firebase Hosting. Ensure `VITE_FUNCTIONS_BASE_URL` in the frontend production configuration points to the live backend URL.

---

## 💼 Business Model & Scalability

GlowTwin AI is designed to scale with a clear, value-first monetization path:

1. **Lead Generation Model:** Instead of charging booking commissions that alienate salons, GlowTwin matches users based on technique fit and charges a flat lead fee or listing fee to partner salons.
2. **Product Affiliation:** The 12-month Cost Breakdown recommends specialized care products (sulfate-free shampoo, bond repair creams). GlowTwin can integrate affiliate shopping links directly into the report.
3. **B2B Certification:** Salons can pay to list their certified stylists as "GlowTwin Verified," boosting their rank in search queries.
4. **Scalability:** By shifting compute workloads (Gemini API vision processing) to serverless APIs and offloading image storage to Cloudinary, server overhead remains extremely low. Database read/write scales efficiently on MongoDB.

---

## 🌟 Unique Selling Proposition (USP)

Unlike generic beauty apps, GlowTwin acts as an **independent hair advocate**. It tells the client the hard truth: whether their dream hair is chemically safe to achieve, how much it will *actually* cost them over the next year, and which local specialist has the validated skills to do it safely. It's the ultimate "know before you glow" tool.
