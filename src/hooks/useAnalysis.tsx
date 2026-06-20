import React, { createContext, useContext, useState, ReactNode } from 'react'

export interface AnalysisResult {
  verdict: string
  status: 'achievable' | 'caution' | 'risk'
  statusLabel: string
  hairHealth: number
  hairType: string
  undertone: string
  technique: string
  faceShape: string
  riskLevel: string
  realityPoints: string[]
  costs: {
    initial: string
    toning: string
    bond: string
    products: string
    total: string
  }
  roadmilestones: {
    phase: string
    title: string
    desc: string
    tags: string[]
    cost: string
    type: 'home' | 'salon' | 'maintenance'
    note?: string
  }[]
  alternatives: { name: string; why: string; match: string; emoji: string }[]
  aiCostNote: string
  city: string
}

export interface BookingInfo {
  salon: string
  date: string
  time: string
  analysisId?: string
}

interface AnalysisCtx {
  // Image data for display (data URLs or Cloudinary secure_urls)
  selfieUrl: string | null
  inspoUrl: string | null
  // Cloudinary public_ids — stored in Firestore, used for cleanup/transforms
  selfiePublicId: string | null
  inspoPublicId: string | null
  // User inputs
  city: string
  budget: string
  // Firestore doc ID returned by Cloud Function
  analysisId: string | null
  // Full analysis result from Gemini (via Cloud Function)
  result: AnalysisResult | null
  booking: BookingInfo | null

  setSelfieUrl: (u: string) => void
  setInspoUrl: (u: string) => void
  setSelfiePublicId: (id: string) => void
  setInspoPublicId: (id: string) => void
  setCity: (c: string) => void
  setBudget: (b: string) => void
  setAnalysisId: (id: string) => void
  setResult: (r: AnalysisResult) => void
  setBooking: (b: BookingInfo) => void
  reset: () => void
}

const Ctx = createContext<AnalysisCtx | null>(null)

// ── Mock result ─────────────────────────────────────────────────────────────
// Used when VITE_FUNCTIONS_BASE_URL is not set or in offline dev mode.
// The real result comes from Gemini via the Cloud Function.
export const MOCK_RESULT: AnalysisResult = {
  verdict:
    "This look is achievable — but not immediately. Your hair has been chemically processed before and needs 6–8 weeks of conditioning before it's ready for this level of lift. The technique (free-hand balayage to Level 8) is right for your face shape and undertone. The main risk is uneven lift if your hair isn't prepped.",
  status: 'achievable',
  statusLabel: 'Achievable with prep',
  hairHealth: 6.2,
  hairType: '2C Wavy',
  undertone: 'Warm Golden',
  technique: 'Free-hand Balayage',
  faceShape: 'Oval',
  riskLevel: 'Moderate (with prep)',
  realityPoints: [
    'Your hair has previous chemical processing — this limits how far it can be lifted safely in one session.',
    'Balayage at this level requires toning every 6–8 weeks to prevent brassiness. Budget for that.',
    'In monsoon months (June–September), fresh blonde color fades and brasses faster.',
  ],
  costs: {
    initial: '₹5,500',
    toning: '₹18,000',
    bond: '₹6,000',
    products: '₹4,800',
    total: '₹34,300 – ₹38,500',
  },
  aiCostNote:
    "The toning appointments are the part most people don't budget for. At ₹3,000 every 8 weeks, that's ₹18,000 per year — more than 3× the initial session cost.",
  roadmilestones: [
    {
      phase: 'Phase 1',
      title: 'Hair Prep Phase',
      desc: 'Begin a protein + moisture treatment protocol. Use a bond-building treatment at home twice weekly. This brings your hair health score from 6.2 to a target of 8.0+ — the minimum safe threshold for bleaching.',
      tags: ['At home', '8 weeks'],
      cost: '₹1,200 – ₹2,000',
      type: 'home',
      note: 'Critical step — do not skip this phase.',
    },
    {
      phase: 'Phase 2',
      title: 'First Lightening Session',
      desc: 'Free-hand balayage from mid-shaft. Target: Level 6–7 only. Your stylist uses 20-volume developer maximum. A bonding additive must be used in the bleach mix.',
      tags: ['Salon visit', '3–4 hours'],
      cost: '₹5,500 – ₹7,000',
      type: 'salon',
    },
    {
      phase: 'Phase 3',
      title: 'Color Maintenance Window',
      desc: 'Use a purple toning shampoo twice weekly. Deep conditioning mask once weekly. Avoid heat above 180°C. Hair colour looks best in weeks 2–6 after the session.',
      tags: ['At home', '6–8 weeks'],
      cost: '₹800 / month',
      type: 'maintenance',
    },
    {
      phase: 'Phase 4',
      title: 'Target Color Achieved',
      desc: 'If hair health is above 7.5, your stylist lifts to the final Level 8 target. A toner is applied to achieve the golden blonde tone. This is your goal — achieved.',
      tags: ['Salon visit', '2–3 hours'],
      cost: '₹3,000 – ₹4,500',
      type: 'salon',
      note: 'Bring your Stylist Brief to this appointment.',
    },
  ],
  alternatives: [
    { name: 'Honey Brunette Highlights', why: 'Warm caramel highlights on your natural base. No bleach needed, same warmth.', match: '91% vibe match · Low risk', emoji: '🌿' },
    { name: 'Copper Balayage', why: 'Lifts to Level 6 only — far safer. Vibrant, warm, and stunning on your undertone.', match: '88% vibe match · Medium risk', emoji: '🌅' },
    { name: 'Face-Framing Babylights', why: 'Delicate lightening only around the face. Minimal damage, maximum glow effect.', match: '85% vibe match · Very low risk', emoji: '☀️' },
  ],
  city: 'Mumbai',
}

// ── Provider ─────────────────────────────────────────────────────────────────
export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [selfieUrl, setSelfieUrl] = useState<string | null>(null)
  const [inspoUrl, setInspoUrl] = useState<string | null>(null)
  const [selfiePublicId, setSelfiePublicId] = useState<string | null>(null)
  const [inspoPublicId, setInspoPublicId] = useState<string | null>(null)
  const [city, setCity] = useState('Mumbai')
  const [budget, setBudget] = useState('')
  const [analysisId, setAnalysisId] = useState<string | null>(null)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [booking, setBooking] = useState<BookingInfo | null>(null)

  const reset = () => {
    setSelfieUrl(null); setInspoUrl(null)
    setSelfiePublicId(null); setInspoPublicId(null)
    setCity('Mumbai'); setBudget('')
    setAnalysisId(null); setResult(null); setBooking(null)
  }

  return (
    <Ctx.Provider value={{
      selfieUrl, inspoUrl, selfiePublicId, inspoPublicId,
      city, budget, analysisId, result, booking,
      setSelfieUrl, setInspoUrl, setSelfiePublicId, setInspoPublicId,
      setCity, setBudget, setAnalysisId, setResult, setBooking,
      reset,
    }}>
      {children}
    </Ctx.Provider>
  )
}

export function useAnalysis() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAnalysis must be inside AnalysisProvider')
  return ctx
}
