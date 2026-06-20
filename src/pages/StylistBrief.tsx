import { useNavigate } from 'react-router'
import { Download, Share2 } from 'lucide-react'
import { toast } from 'sonner'
import { Screen, Nav, Content, StickyBottom, Btn } from '../components/ui'
import { useAnalysis } from '../hooks/useAnalysis'

export default function StylistBrief() {
  const nav = useNavigate()
  const { selfieUrl, inspoUrl, result } = useAnalysis()

  if (!result) { nav('/'); return null }

  const handleDownload = () => {
    toast.success('Stylist Brief saved to your photos 📋')
  }
  const handleShare = () => {
    toast.success('Opening share sheet…')
  }

  return (
    <Screen>
      <Nav
        showBack
        rightSlot={
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5"
            style={{ border: '1px solid var(--gt-border)', fontSize: '0.8125rem', color: 'var(--gt-stone)' }}
          >
            <Download size={14} />
            Download
          </button>
        }
      />

      <Content>
        <div className="pt-6 pb-4">
          <h1 className="gt-display mb-2" style={{ color: 'var(--gt-ink)', fontSize: '1.75rem' }}>
            Your Stylist Brief
          </h1>
          <p className="gt-body mb-6" style={{ color: 'var(--gt-stone)' }}>
            Show this to your stylist before any work begins.
          </p>
        </div>

        {/* THE BRIEF CARD */}
        <div
          className="rounded-2xl overflow-hidden mb-6"
          style={{
            background: 'var(--gt-surface)',
            border: '1.5px solid var(--gt-border-strong)',
            boxShadow: 'var(--gt-shadow-xl)',
          }}
        >
          {/* Header */}
          <div
            className="px-5 py-4 flex items-center justify-between"
            style={{ background: 'var(--gt-rose-faint)', borderBottom: '1px solid var(--gt-border)' }}
          >
            <div>
              <p className="gt-label" style={{ color: 'var(--gt-rose)' }}>GLOWTWIN STYLIST BRIEF</p>
              <p className="gt-body-sm" style={{ color: 'var(--gt-stone-pale)' }}>
                Generated {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'var(--gt-rose)' }}
            >
              <span style={{ color: '#fff', fontSize: '1rem' }}>✦</span>
            </div>
          </div>

          {/* CLIENT GOAL */}
          <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--gt-border)' }}>
            <p className="gt-label mb-3" style={{ color: 'var(--gt-stone)' }}>Client Goal</p>
            <div className="flex gap-4">
              {inspoUrl && (
                <img
                  src={inspoUrl}
                  alt="Goal"
                  className="rounded-xl object-cover flex-shrink-0"
                  style={{ width: '56px', height: '74px' }}
                />
              )}
              <div>
                <p className="gt-title mb-1" style={{ color: 'var(--gt-ink)', fontSize: '1.05rem' }}>
                  {result.technique}
                </p>
                <p className="gt-body-sm" style={{ color: 'var(--gt-stone)', lineHeight: 1.6 }}>
                  Mid-shaft start · Level 8 target · Warm golden blonde · Suits {result.undertone.toLowerCase()} undertone
                </p>
              </div>
            </div>
          </div>

          {/* CURRENT CONDITION */}
          <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--gt-border)' }}>
            <p className="gt-label mb-3" style={{ color: 'var(--gt-stone)' }}>Current Hair Condition</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              {[
                { label: 'Health score', value: `${result.hairHealth} / 10` },
                { label: 'Hair type', value: result.hairType },
                { label: 'Previous processing', value: 'Yes' },
                { label: 'Porosity', value: 'High' },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="gt-label mb-0.5" style={{ color: 'var(--gt-stone-pale)', fontSize: '10px' }}>{label}</p>
                  <p className="gt-body" style={{ color: 'var(--gt-ink)', fontWeight: 500 }}>{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* TECHNIQUE */}
          <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--gt-border)' }}>
            <p className="gt-label mb-3" style={{ color: 'var(--gt-stone)' }}>Recommended Technique</p>
            <div className="space-y-2">
              {[
                'Free-hand balayage, mid-shaft start',
                '20-volume developer MAXIMUM',
                'Use bonding additive in bleach mix (e.g. Olaplex No.1)',
                'Target: Level 6–7 in Session 1 only',
                'Toner after lifting — no exceptions',
              ].map((point, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span style={{ color: 'var(--gt-emerald)', fontSize: '0.875rem', marginTop: '1px' }}>—</span>
                  <p className="gt-body-sm" style={{ color: 'var(--gt-ink)', fontWeight: 500, lineHeight: 1.5 }}>{point}</p>
                </div>
              ))}
            </div>
          </div>

          {/* DO NOT */}
          <div
            className="px-5 py-4"
            style={{ background: 'var(--gt-red-light)', borderBottom: '1px solid var(--gt-border)' }}
          >
            <p className="gt-label mb-3" style={{ color: 'var(--gt-red)' }}>⚠ Do Not</p>
            <div className="space-y-2">
              {[
                'Use 30-volume developer on this hair',
                'Overlap bleach on previously processed sections',
                'Attempt full-head bleach in Session 1',
                'Skip the bond treatment',
              ].map((point, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span style={{ color: 'var(--gt-red)', fontSize: '0.875rem', marginTop: '1px', fontWeight: 700 }}>✕</span>
                  <p className="gt-body-sm" style={{ color: 'var(--gt-red)', fontWeight: 500, lineHeight: 1.5 }}>{point}</p>
                </div>
              ))}
            </div>
          </div>

          {/* SESSIONS + BUDGET */}
          <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--gt-border)' }}>
            <div className="grid grid-cols-2 gap-4">
              <div style={{ borderRight: '1px solid var(--gt-border)', paddingRight: '16px' }}>
                <p className="gt-label mb-1" style={{ color: 'var(--gt-stone-pale)', fontSize: '10px' }}>Sessions needed</p>
                <p className="gt-display" style={{ color: 'var(--gt-rose)', fontSize: '1.5rem' }}>2 – 3</p>
              </div>
              <div>
                <p className="gt-label mb-1" style={{ color: 'var(--gt-stone-pale)', fontSize: '10px' }}>Budget range</p>
                <p className="gt-display" style={{ color: 'var(--gt-rose)', fontSize: '1.5rem' }}>₹5,500+</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            className="px-5 py-3 flex items-center gap-2"
            style={{ background: 'var(--gt-surface-2)' }}
          >
            <span style={{ color: 'var(--gt-rose)', fontSize: '0.875rem' }}>✦</span>
            <p className="gt-body-sm" style={{ color: 'var(--gt-stone-pale)' }}>
              Generated by <strong style={{ color: 'var(--gt-stone)' }}>GlowTwin AI</strong> · Know Before You Glow
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="space-y-3 mb-2">
          <button
            onClick={handleDownload}
            className="w-full flex items-center justify-center gap-2 rounded-full"
            style={{
              height: '52px',
              background: 'var(--gt-rose)',
              color: '#fff',
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            <Download size={16} />
            Download as image
          </button>
          <button
            onClick={handleShare}
            className="w-full flex items-center justify-center gap-2 rounded-full"
            style={{
              height: '52px',
              background: 'transparent',
              border: '1.5px solid var(--gt-border-strong)',
              color: 'var(--gt-ink)',
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            <Share2 size={16} />
            Share with stylist
          </button>
        </div>
      </Content>

      <StickyBottom>
        <Btn onClick={() => nav('/salons')}>Find matched salons →</Btn>
      </StickyBottom>
    </Screen>
  )
}
