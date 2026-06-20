import { useNavigate } from 'react-router'
import { Share2, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { Screen, Nav, Content, StickyBottom, Btn, Card, AICard, Chip, TruthDivider, PhotoPair, HealthBar } from '../components/ui'
import { useAnalysis } from '../hooks/useAnalysis'

const METRIC_ROWS = (r: ReturnType<typeof useAnalysis>['result']) => [
  { label: 'Hair health', value: null, isBar: true, barValue: r?.hairHealth ?? 0 },
  { label: 'Hair type', value: r?.hairType ?? '—', color: 'var(--gt-ink)' },
  { label: 'Skin undertone', value: r?.undertone ?? '—', color: 'var(--gt-emerald)' },
  { label: 'Technique needed', value: r?.technique ?? '—', color: 'var(--gt-ink)' },
  { label: 'Face shape', value: r?.faceShape ?? '—', color: 'var(--gt-ink)' },
  { label: 'Processing risk', value: r?.riskLevel ?? '—', color: 'var(--gt-amber)' },
]

export default function RealityReport() {
  const nav = useNavigate()
  const { selfieUrl, inspoUrl, result } = useAnalysis()

  if (!result) { nav('/'); return null }

  const chipVariant = result.status === 'achievable' ? 'achievable' : result.status === 'caution' ? 'caution' : 'risk'

  return (
    <Screen>
      <Nav
        showBack
        rightSlot={
          <button
            onClick={() => toast.success('Report link copied!')}
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5"
            style={{ border: '1px solid var(--gt-border)', fontSize: '0.8125rem', color: 'var(--gt-stone)' }}
          >
            <Share2 size={14} />
            Share
          </button>
        }
      />

      <Content>
        <div className="pt-6 pb-4">
          {/* Photo pair */}
          <PhotoPair selfie={selfieUrl} inspo={inspoUrl} size={72} />
          <TruthDivider label="Your Reality" />

          {/* AI Verdict */}
          <AICard className="mb-4">
            {result.verdict}
          </AICard>

          {/* Status chip */}
          <div className="mb-5">
            <Chip
              label={result.statusLabel}
              variant={chipVariant}
              icon={chipVariant === 'achievable' ? '✓' : chipVariant === 'caution' ? '!' : '⚠'}
            />
          </div>

          {/* Metrics card */}
          <Card className="mb-4">
            {METRIC_ROWS(result).map((row, i) => (
              <div
                key={i}
                style={{ borderBottom: i < METRIC_ROWS(result).length - 1 ? '1px solid var(--gt-border)' : 'none' }}
              >
                {row.isBar ? (
                  <div className="py-3">
                    <div className="flex justify-between mb-1">
                      <span className="gt-body" style={{ color: 'var(--gt-stone)' }}>{row.label}</span>
                      <span className="gt-mono" style={{ color: 'var(--gt-rose)' }}>
                        {result.hairHealth} / 10
                      </span>
                    </div>
                    <HealthBar value={result.hairHealth} />
                  </div>
                ) : (
                  <div className="flex justify-between items-center" style={{ height: '44px' }}>
                    <span className="gt-body" style={{ color: 'var(--gt-stone)' }}>{row.label}</span>
                    <span className="gt-body" style={{ color: row.color, fontWeight: 500, textAlign: 'right', maxWidth: '55%' }}>
                      {row.value}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </Card>

          <TruthDivider label="What this means" />

          {/* Reality check */}
          <div
            className="rounded-2xl p-5 mb-4"
            style={{
              background: 'var(--gt-red-light)',
              border: '1px solid rgba(196,80,58,0.2)',
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle size={18} style={{ color: 'var(--gt-red)', flexShrink: 0 }} />
              <p className="gt-title" style={{ color: 'var(--gt-red)' }}>The honest part</p>
            </div>
            <p className="gt-body-sm mb-3" style={{ color: 'var(--gt-stone)' }}>
              Three things your stylist should know.
            </p>
            <div className="space-y-3">
              {result.realityPoints.map((pt, i) => (
                <div key={i} className="flex gap-2.5">
                  <div
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2"
                    style={{ background: 'var(--gt-red)' }}
                  />
                  <p className="gt-body-sm" style={{ color: 'var(--gt-stone)', lineHeight: 1.6 }}>{pt}</p>
                </div>
              ))}
            </div>
          </div>

          <TruthDivider label="Safer alternatives" />

          {/* Alternatives */}
          <div className="space-y-3 mb-6">
            {result.alternatives.map((alt, i) => (
              <div
                key={i}
                className="rounded-2xl p-4 flex gap-4 items-start transition-all duration-200 cursor-pointer"
                style={{
                  background: 'var(--gt-surface)',
                  border: '1px solid var(--gt-border)',
                  boxShadow: 'var(--gt-shadow-md)',
                }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'var(--gt-surface-2)', fontSize: '1.25rem' }}
                >
                  {alt.emoji}
                </div>
                <div>
                  <p className="gt-title mb-1" style={{ color: 'var(--gt-ink)', fontSize: '1rem' }}>{alt.name}</p>
                  <p className="gt-body-sm mb-1.5" style={{ color: 'var(--gt-stone)' }}>{alt.why}</p>
                  <span className="gt-label" style={{ color: 'var(--gt-emerald)', fontSize: '10px' }}>✓ {alt.match}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Content>

      <StickyBottom>
        <Btn onClick={() => nav('/cost')}>See full cost breakdown →</Btn>
        <button
          onClick={() => nav('/roadmap')}
          className="w-full mt-2 gt-body"
          style={{ color: 'var(--gt-rose)', padding: '10px', fontWeight: 500 }}
        >
          Skip to roadmap →
        </button>
      </StickyBottom>
    </Screen>
  )
}
