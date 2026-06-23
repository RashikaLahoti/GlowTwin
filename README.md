# 🌟 GlowTwin AI — Know Before You Glow

> An AI-powered beauty decision platform that helps users understand whether their dream hairstyle is realistically achievable, what it will cost, and which salon is best suited to achieve it.

## 🔗 Live Demo

**Frontend:** https://glow-twin.vercel.app/
**Backend:** https://glowtwin.onrender.com
**GitHub:** https://github.com/RashikaLahoti/GlowTwin

---

## 📌 The Problem

Millions of people choose hairstyles and hair colors from Instagram, Pinterest, and celebrity photos without understanding:

* Whether the look is actually achievable on their current hair
* The risk of hair damage
* The true maintenance cost over time
* Which salon specializes in the required technique
* How to communicate technical requirements to a stylist

As a result, users often face disappointing results, unnecessary expenses, and avoidable hair damage.

---

## 💡 The Solution

GlowTwin AI acts as a personal beauty advisor.

Users upload:

1. Their current selfie
2. An inspiration hairstyle image

The platform then:

* Analyzes both images using AI
* Evaluates feasibility and hair health
* Estimates the total cost of ownership
* Creates a personalized beauty roadmap
* Generates a stylist brief
* Recommends suitable salons based on city, budget, and hairstyle requirements

---

## ✨ Key Features

### 🧠 AI Reality Report

Compares the user's selfie with their inspiration image and generates:

* Hair Health Score
* Hair Type Detection
* Face Shape Analysis
* Undertone Identification
* Technique Detection
* Risk Assessment
* Honest Feasibility Verdict

---

### 💰 Cost Prediction Engine

Provides transparent cost estimates including:

* Initial salon visit
* Toning sessions
* Bond repair treatments
* Home care products
* Estimated annual maintenance cost

---

### 🛣️ Glow Roadmap

Creates a step-by-step transformation plan with:

* Preparation phase
* Salon treatment phase
* Maintenance milestones
* Recovery recommendations

---

### 📄 Stylist Brief

Generates a salon-ready summary containing:

* Target look
* Recommended technique
* Hair condition
* Risk factors
* Professional notes

This helps users communicate clearly with stylists.

---

### 🏙️ City-Based Salon Marketplace

Supports salon recommendations based on:

* User city
* Budget range
* Hair goals
* Technique requirements

Current supported cities:

* Bhopal
* Mumbai
* Bangalore

Each recommendation includes reasons such as:

* Matches your budget
* Specializes in your target technique
* Suitable for your hair type
* Available this week

---

### 📅 Appointment Booking

Users can:

* Select a recommended salon
* Choose date and time
* Save booking information
* Store appointment history

---

## 📸 Screenshots

### Landing Page

*Add screenshot here*

### Upload Flow

*Add screenshot here*

### Reality Report

*Add screenshot here*

### Glow Roadmap

*Add screenshot here*

### Salon Recommendations

*Add screenshot here*

---

## 🏗️ Architecture Overview

GlowTwin is built on a decoupled, secure client-server architecture:

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

### Workflow

1. User uploads selfie and inspiration image.
2. Images are stored on Cloudinary.
3. Image URLs are sent to the backend.
4. Backend downloads and processes images.
5. AI generates structured analysis.
6. Result is validated and stored in MongoDB.
7. Frontend displays reports and recommendations.

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

The backend follows a structured AI workflow:

### Step 1

Fetches selfie and inspiration images.

### Step 2

Converts images into a format suitable for AI processing.

### Step 3

Sends both images with a detailed prompt to Gemini Vision through OpenRouter.

### Step 4

Receives structured JSON output.

### Step 5

Validates the response using Zod schemas.

### Step 6

Stores results in MongoDB.

### Step 7

Returns the final report to the frontend.

Additional safeguards:

* JSON repair utility
* Schema validation
* Retry mechanism
* Error handling
* Exponential backoff

---

## 📡 API Endpoints

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh
```

### Analysis

```http
POST /api/analyses/analyze
GET  /api/analyses
GET  /api/analyses/:id
```

### Bookings

```http
POST /api/bookings
GET  /api/bookings
```

---

## ⚙️ Local Setup

### Clone Repository

```bash
git clone https://github.com/RashikaLahoti/GlowTwin.git

cd GlowTwin
```

### Install Frontend Dependencies

```bash
npm install
```

### Install Backend Dependencies

```bash
cd backend
npm install
```

---

### Frontend Environment Variables

Create a `.env` file in the root directory.

```env
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name

VITE_CLOUDINARY_UPLOAD_PRESET=glowtwin_uploads

VITE_FUNCTIONS_BASE_URL=http://localhost:5000/api
```

---

### Backend Environment Variables

Create a `.env` file inside the backend folder.

```env
PORT=5000

MONGODB_URI=your_mongodb_uri

JWT_ACCESS_SECRET=your_access_secret

JWT_REFRESH_SECRET=your_refresh_secret

OPENROUTER_API_KEY=your_openrouter_api_key

ALLOWED_ORIGINS=http://localhost:5173
```

---

### Run Backend

```bash
cd backend

npm run dev
```

---

### Run Frontend

```bash
npm run dev
```

---

## 🚀 Deployment

### Backend

Deploy on:

* Render

Required environment variables:

```env
MONGODB_URI
OPENROUTER_API_KEY
JWT_ACCESS_SECRET
JWT_REFRESH_SECRET
ALLOWED_ORIGINS
```

---

### Frontend

Deploy on:

* Vercel

Update:

```env
VITE_FUNCTIONS_BASE_URL=https://your-backend-url.onrender.com/api
```

before building.

---

## 🎯 Why This Project Matters

Most beauty platforms focus on inspiration.

GlowTwin focuses on reality.

Instead of encouraging users to blindly follow trends, GlowTwin helps them make informed decisions based on:

* Hair health
* Budget
* Maintenance commitment
* Professional feasibility

This reduces unnecessary spending, prevents hair damage, and improves communication between clients and salons.

---

## 🔮 Future Scope

* Real salon partnerships
* Real-time salon availability
* Advanced recommendation engine
* Personalized beauty profiles
* User analysis history dashboard
* Beauty product recommendations
* AI-powered hairstyle simulation

---

### ✨ GlowTwin AI

**Know the reality before the transformation.**
