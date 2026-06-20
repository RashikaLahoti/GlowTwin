import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { Screen } from '../components/ui'
import { useAnalysis, MOCK_RESULT, AnalysisResult } from '../hooks/useAnalysis'
import { analyzeImages, AnalysisError } from '../services/analysis'

const STEPS = [
  'Reading hair texture and porosity',
  'Detecting color history and damage',
  'Analyzing skin tone and undertone',
  'Identifying technique in inspiration',
  'Calculating 12-month cost breakdown',
  'Building your Glow Roadmap',
  'Matching certified specialists',
]

const INSIGHTS = [
  "We're checking whether your hair has been previously bleached — it affects what's safely achievable.",
  "Your skin's undertone determines whether warm or cool tones will look most natural on you.",
  "We're looking at the specific technique in your inspiration photo to estimate sessions needed.",
  "Your hair's current condition affects how far it can be lifted safely in a single visit.",
  "We're calculating every touch-up and product cost so there are no surprises six months in.",
]

const USE_MOCK = !import.meta.env.VITE_FUNCTIONS_BASE_URL ||
  import.meta.env.VITE_FUNCTIONS_BASE_URL.includes('YOUR_PROJECT_ID')

export default function Analyzing() {
  const nav = useNavigate()
  const {
    selfieUrl, inspoUrl,
    selfiePublicId, inspoPublicId,
    city, budget,
    setResult, setAnalysisId,
  } = useAnalysis()

  const [activeStep, setActiveStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [progress, setProgress] = useState(0)
  const [insightIdx, setInsightIdx] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const calledRef = useRef(false)

  useEffect(() => {
    if (calledRef.current) return
    calledRef.current = true

    runAnalysis()
    // Rotate insights every 2.5 s
    const insightTimer = setInterval(() => setInsightIdx((i) => (i + 1) % INSIGHTS.length), 2500)
    return () => clearInterval(insightTimer)
  }, [])

  const runAnalysis = async () => {
    // Animate steps while API call runs in parallel
    const stepDuration = USE_MOCK ? 900 : 1200
    let currentStep = 0

    const stepTimer = setInterval(() => {
      if (currentStep < STEPS.length - 1) {
        setCompletedSteps((prev) => [...prev, currentStep])
        currentStep++
        setActiveStep(currentStep)
      }
    }, stepDuration)

    // Progress bar ticks independently
    const progressTimer = setInterval(() => {
      setProgress((p) => (p < 90 ? p + 1.2 : p))
    }, 120)

    try {
      let result: AnalysisResult

      if (USE_MOCK) {
        // ── Dev / offline mode ────────────────────────────────────────────
        await new Promise((r) => setTimeout(r, STEPS.length * stepDuration))
        result = { ...MOCK_RESULT, city }
      } else {
        // ── Production: call Cloud Function ───────────────────────────────
        const response = await analyzeImages({
          selfieUrl: selfieUrl ?? '',
          selfiePublicId: selfiePublicId ?? '',
          inspirationUrl: inspoUrl ?? '',
          inspoPublicId: inspoPublicId ?? '',
          city,
          budget,
        })
        result = response.result as AnalysisResult
        setAnalysisId(response.analysisId)
      }

      clearInterval(stepTimer)
      clearInterval(progressTimer)

      // Complete all steps
      setCompletedSteps(STEPS.map((_, i) => i))
      setProgress(100)

      setResult(result)
      setTimeout(() => nav('/report'), 500)

    } catch (err) {
      clearInterval(stepTimer)
      clearInterval(progressTimer)

      const msg = err instanceof AnalysisError
        ? err.message
        : 'Analysis failed. Please try again.'

      setError(msg)
      toast.error(msg)
    }
  }

  if (error) {
    return (
      <Screen>
        <nav className="flex items-center justify-between px-5 h-14" style={{ borderBottom: '1px solid var(--gt-border)' }}>
          <span className="font-bold" style={{ fontSize: '1.1rem', color: 'var(--gt-ink)' }}>
            Glow<span style={{ color: 'var(--gt-rose)' }}>Twin</span>
          </span>
        </nav>
        <div className="flex-1 flex flex-col items-center justify-center px-5 text-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ background: 'var(--gt-red-light)', fontSize: '1.5rem' }}>⚠️</div>
          <h2 className="gt-headline" style={{ color: 'var(--gt-ink)' }}>Analysis failed</h2>
          <p className="gt-body" style={{ color: 'var(--gt-stone)', maxWidth: '280px' }}>{error}</p>
          <button onClick={() => { setError(null); calledRef.current = false; runAnalysis() }}
            className="rounded-full px-6"
            style={{ height: '48px', background: 'var(--gt-rose)', color: '#fff', fontSize: '0.875rem', fontWeight: 600 }}>
            Try again
          </button>
          <button onClick={() => nav('/upload-selfie')} style={{ color: 'var(--gt-stone)', fontSize: '0.875rem' }}>
            Change photos
          </button>
        </div>
      </Screen>
    )
  }

  return (
    <Screen>
      <nav className="flex items-center justify-between px-5 h-14"
        style={{ borderBottom: '1px solid var(--gt-border)', background: 'var(--gt-bg)' }}>
        <span className="font-bold" style={{ fontSize: '1.1rem', color: 'var(--gt-ink)' }}>
          Glow<span style={{ color: 'var(--gt-rose)' }}>Twin</span>
        </span>
        <span className="gt-label" style={{ color: 'var(--gt-stone-pale)' }}>Analyzing…</span>
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center px-5 py-8"
        style={{ maxWidth: '480px', margin: '0 auto', width: '100%' }}>

        {/* Photo pair */}
        <div className="flex items-center gap-4 mb-8 animate-fade-in">
          {[selfieUrl, inspoUrl].map((src, i) => (
            <div key={i}>
              {src ? (
                <img src={src} alt={i === 0 ? 'You' : 'Goal'} className="rounded-xl object-cover"
                  style={{ width: '80px', height: '107px', border: `2px solid ${i === 0 ? 'var(--gt-rose)' : 'var(--gt-lavender)'}` }} />
              ) : (
                <div className="rounded-xl flex items-center justify-center"
                  style={{ width: '80px', height: '107px', background: 'var(--gt-surface-2)', border: `2px solid ${i === 0 ? 'var(--gt-rose)' : 'var(--gt-lavender)'}` }}>
                  <span style={{ fontSize: '2rem' }}>📷</span>
                </div>
              )}
            </div>
          ))}
        </div>

        <h2 className="gt-headline mb-6 text-center animate-fade-in" style={{ color: 'var(--gt-ink)', animationDelay: '200ms' }}>
          Reading your photos…
        </h2>

        {/* Steps */}
        <div className="w-full mb-6">
          {STEPS.map((step, i) => {
            const isDone = completedSteps.includes(i)
            const isActive = activeStep === i && !isDone
            return (
              <div key={i} className="flex items-center gap-3 py-3 transition-all duration-300"
                style={{ borderBottom: '1px solid var(--gt-border)' }}>
                <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                  {isDone ? (
                    <div className="w-5 h-5 rounded-full flex items-center justify-center animate-scale-in"
                      style={{ background: 'var(--gt-emerald)' }}>
                      <span style={{ color: '#fff', fontSize: '10px' }}>✓</span>
                    </div>
                  ) : isActive ? (
                    <div className="w-5 h-5 rounded-full"
                      style={{ border: '2px solid var(--gt-rose)', animation: 'gt-pulse-dot 1.2s ease-in-out infinite', background: 'var(--gt-rose-faint)' }} />
                  ) : (
                    <div className="w-5 h-5 rounded-full" style={{ border: '2px solid var(--gt-border)' }} />
                  )}
                </div>
                <span className="gt-body transition-all duration-300"
                  style={{ color: isDone || isActive ? 'var(--gt-ink)' : 'var(--gt-stone-pale)', fontWeight: isActive ? 600 : isDone ? 500 : 400 }}>
                  {step}
                </span>
              </div>
            )
          })}
        </div>

        {/* Progress bar */}
        <div className="w-full mb-6">
          <div className="flex justify-between mb-1">
            <span className="gt-label" style={{ color: 'var(--gt-stone-pale)' }}>Analyzing</span>
            <span className="gt-mono" style={{ color: 'var(--gt-rose)' }}>{Math.round(progress)}%</span>
          </div>
          <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--gt-border)' }}>
            <div className="h-full rounded-full transition-all duration-200"
              style={{ width: `${progress}%`, background: 'var(--gt-rose)' }} />
          </div>
        </div>

        {/* Rotating insight */}
        <div key={insightIdx} className="w-full rounded-2xl p-4 animate-fade-in"
          style={{ background: 'linear-gradient(to right, var(--gt-lavender-light) 0%, var(--gt-surface) 80px)', borderLeft: '3px solid var(--gt-lavender)', border: '1px solid var(--gt-border)', borderLeftWidth: '3px' }}>
          <div className="flex gap-3">
            <span style={{ color: 'var(--gt-lavender)', flexShrink: 0, marginTop: '2px' }}>✦</span>
            <p className="gt-body-sm" style={{ color: 'var(--gt-stone)', fontStyle: 'italic', lineHeight: 1.6 }}>
              {INSIGHTS[insightIdx]}
            </p>
          </div>
        </div>

        {USE_MOCK && (
          <p className="gt-label mt-3 text-center" style={{ color: 'var(--gt-stone-pale)', fontSize: '10px' }}>
            DEMO MODE — set VITE_FUNCTIONS_BASE_URL for live AI analysis
          </p>
        )}

        <p className="gt-body-sm mt-3 text-center" style={{ color: 'var(--gt-stone-pale)' }}>
          This usually takes 15–20 seconds.
        </p>
      </div>
    </Screen>
  )
}
