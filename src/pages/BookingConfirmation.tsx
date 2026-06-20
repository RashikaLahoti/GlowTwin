import { useNavigate, useLocation } from 'react-router'
import { useEffect, useState } from 'react'
import { CalendarPlus, Bell } from 'lucide-react'
import { toast } from 'sonner'
import { Screen, Card, Btn } from '../components/ui'
import { useAnalysis } from '../hooks/useAnalysis'
import { saveBooking } from '../services/analysis'
import { useAuth } from '../contexts/auth-context'

export default function BookingConfirmation() {
  const nav = useNavigate()
  const location = useLocation()
  const { setBooking, analysisId } = useAnalysis()
  const { idToken } = useAuth()
  const [checked, setChecked] = useState(false)

  const state = (location.state ?? {}) as { salon?: string; date?: string; time?: string }
  const salon = state.salon ?? 'Aarav Studio'
  const date = state.date ?? 'Saturday, Oct 19'
  const time = state.time ?? '11:00 AM'

  useEffect(() => {
    setBooking({ salon, date, time })
    
    if (analysisId) {
      saveBooking({
        analysisId,
        salon,
        date,
        time,
        idToken: idToken ?? undefined,
      }).catch((err) => {
        console.error('[GlowTwin] Error saving booking to backend:', err)
      })
    }

    const t = setTimeout(() => setChecked(true), 300)
    return () => clearTimeout(t)
  }, [])

  return (
    <Screen>
      {/* Minimal nav */}
      <nav
        className="flex items-center justify-between px-5 h-14"
        style={{ borderBottom: '1px solid var(--gt-border)' }}
      >
        <button
          className="font-bold"
          style={{ fontSize: '1.1rem', color: 'var(--gt-ink)' }}
          onClick={() => nav('/')}
        >
          Glow<span style={{ color: 'var(--gt-rose)' }}>Twin</span>
        </button>
        <button
          onClick={() => nav('/')}
          style={{ color: 'var(--gt-stone-pale)', fontSize: '1.25rem' }}
          aria-label="Close"
        >
          ✕
        </button>
      </nav>

      <div
        className="flex-1 flex flex-col items-center px-5 py-12"
        style={{ maxWidth: '480px', margin: '0 auto', width: '100%' }}
      >
        {/* Animated check */}
        <div
          className="flex items-center justify-center mb-6"
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'var(--gt-emerald-light)',
            border: '2px solid var(--gt-emerald)',
            transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            transform: checked ? 'scale(1)' : 'scale(0.3)',
            opacity: checked ? 1 : 0,
          }}
        >
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <path
              d="M8 18L15 25L28 11"
              stroke="var(--gt-emerald)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                strokeDasharray: 60,
                strokeDashoffset: checked ? 0 : 60,
                transition: 'stroke-dashoffset 0.6s ease 0.4s',
              }}
            />
          </svg>
        </div>

        {/* Headline */}
        <div
          className="text-center mb-8"
          style={{
            opacity: checked ? 1 : 0,
            transform: checked ? 'translateY(0)' : 'translateY(8px)',
            transition: 'all 0.35s ease 0.5s',
          }}
        >
          <h1
            className="gt-display mb-2"
            style={{ color: 'var(--gt-ink)', fontSize: '2rem' }}
          >
            You're booked.
          </h1>
          <p className="gt-body" style={{ color: 'var(--gt-stone)' }}>
            Walk in prepared. Your stylist already knows your hair story.
          </p>
        </div>

        {/* Appointment card */}
        <div
          className="w-full mb-5"
          style={{
            opacity: checked ? 1 : 0,
            transform: checked ? 'translateY(0)' : 'translateY(12px)',
            transition: 'all 0.35s ease 0.65s',
          }}
        >
          <Card>
            <p className="gt-title mb-4" style={{ color: 'var(--gt-ink)' }}>Appointment summary</p>
            <div className="space-y-0">
              {[
                { label: 'Salon', value: salon },
                { label: 'Date', value: date },
                { label: 'Time', value: time },
                { label: 'Stylist Brief', value: 'Sent ✓', valueColor: 'var(--gt-emerald)' },
              ].map(({ label, value, valueColor }, i, arr) => (
                <div
                  key={label}
                  className="flex justify-between items-center"
                  style={{
                    height: '44px',
                    borderBottom: i < arr.length - 1 ? '1px solid var(--gt-border)' : 'none',
                  }}
                >
                  <span className="gt-body-sm" style={{ color: 'var(--gt-stone)' }}>{label}</span>
                  <span className="gt-body" style={{ color: valueColor ?? 'var(--gt-ink)', fontWeight: 500 }}>{value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Prep reminder */}
        <div
          className="w-full mb-6"
          style={{
            opacity: checked ? 1 : 0,
            transform: checked ? 'translateY(0)' : 'translateY(12px)',
            transition: 'all 0.35s ease 0.8s',
          }}
        >
          <div
            className="rounded-2xl p-4"
            style={{
              background: 'linear-gradient(to right, var(--gt-lavender-light) 0%, var(--gt-surface) 80px)',
              borderLeft: '3px solid var(--gt-lavender)',
              border: '1px solid var(--gt-border)',
              borderLeftWidth: '3px',
            }}
          >
            <div className="flex gap-3">
              <Bell size={18} style={{ color: 'var(--gt-lavender)', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <p className="gt-body-sm mb-2" style={{ color: 'var(--gt-stone)', lineHeight: 1.6 }}>
                  ✦ Your conditioning protocol should start 8 weeks before your appointment. Set a reminder so you don't miss the prep window.
                </p>
                <button
                  onClick={() => toast.success('Reminder set for 8 weeks before your appointment!')}
                  className="rounded-full px-4 py-2"
                  style={{
                    border: '1px solid var(--gt-lavender)',
                    color: 'var(--gt-lavender)',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    background: 'var(--gt-lavender-light)',
                  }}
                >
                  Set prep reminder
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div
          className="w-full space-y-3"
          style={{
            opacity: checked ? 1 : 0,
            transition: 'opacity 0.35s ease 0.95s',
          }}
        >
          <button
            onClick={() => toast.success('Opening calendar…')}
            className="w-full flex items-center justify-center gap-2 rounded-full"
            style={{
              height: '52px',
              border: '1.5px solid var(--gt-border-strong)',
              color: 'var(--gt-ink)',
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              background: 'var(--gt-surface)',
            }}
          >
            <CalendarPlus size={16} />
            Add to Calendar
          </button>
          <button
            onClick={() => nav('/')}
            className="w-full gt-body py-3"
            style={{ color: 'var(--gt-stone)' }}
          >
            Back to home
          </button>
        </div>

        {/* Referral nudge */}
        <div
          className="mt-8 text-center"
          style={{
            opacity: checked ? 1 : 0,
            transition: 'opacity 0.35s ease 1.1s',
          }}
        >
          <p className="gt-body-sm" style={{ color: 'var(--gt-stone-pale)' }}>
            Know someone planning a salon visit?
          </p>
          <button
            onClick={() => toast.success('Share link copied!')}
            className="gt-body-sm mt-1"
            style={{ color: 'var(--gt-rose)', fontWeight: 500 }}
          >
            Share GlowTwin →
          </button>
        </div>
      </div>
    </Screen>
  )
}
