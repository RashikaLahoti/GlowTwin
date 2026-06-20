import { useNavigate } from 'react-router'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Screen, Nav, Content, StickyBottom, Btn, Card, AICard, TruthDivider } from '../components/ui'
import { useAnalysis } from '../hooks/useAnalysis'

const BAR_COLORS = ['var(--gt-lavender)', 'var(--gt-amber)', 'var(--gt-rose)', 'var(--gt-border-strong)']

interface CostBreakdown {
  initial?: string
  toning?: string
  bond?: string
  products?: string
  total?: string
}

const BREAKDOWN_ITEMS = (costs: CostBreakdown | undefined) => [
  { label: 'Initial session', amount: costs?.initial ?? '₹5,500', pct: 16, note: 'The exciting one' },
  { label: 'Toning touch-ups × 6', amount: costs?.toning ?? '₹18,000', pct: 52, note: 'Every 8 weeks' },
  { label: 'Bond treatment', amount: costs?.bond ?? '₹6,000', pct: 17, note: 'Prep + sessions' },
  { label: 'Home care products', amount: costs?.products ?? '₹4,800', pct: 14, note: 'Purple shampoo, masks' },
]

export default function CostPrediction() {
  const nav = useNavigate()
  const { result } = useAnalysis()
  const [animated, setAnimated] = useState(false)
  const [expanded, setExpanded] = useState<number | null>(null)

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 200)
    return () => clearTimeout(t)
  }, [])

  if (!result) { nav('/'); return null }

  return (
    <Screen>
      <Nav
        showBack
        rightSlot={
          <button
            onClick={() => toast.success('Estimate saved!')}
            className="gt-label rounded-full px-3 py-1.5"
            style={{ border: '1px solid var(--gt-border)', color: 'var(--gt-stone)', fontSize: '0.72rem' }}
          >
            Save
          </button>
        }
      />

      <Content>
        <div className="pt-6 pb-2">
          <h1 className="gt-display mb-2" style={{ color: 'var(--gt-ink)', fontSize: '1.75rem' }}>
            What this look<br />actually costs.
          </h1>
          <p className="gt-body mb-6" style={{ color: 'var(--gt-stone)' }}>
            Over 12 months, including every touch-up and product.
          </p>
        </div>

        {/* Hero total */}
        <div
          className="rounded-2xl p-6 mb-6"
          style={{
            background: 'var(--gt-surface)',
            border: '1px solid var(--gt-border)',
            boxShadow: 'var(--gt-shadow-lg)',
          }}
        >
          <p className="gt-label mb-2" style={{ color: 'var(--gt-stone)' }}>Year 1 total</p>
          <p
            className="gt-display mb-4"
            style={{ color: 'var(--gt-rose)', fontSize: '2.25rem', letterSpacing: '-0.02em' }}
          >
            {result.costs.total}
          </p>
          <div className="h-px mb-4" style={{ background: 'var(--gt-border)' }} />
          <p className="gt-body-sm" style={{ color: 'var(--gt-stone)', fontStyle: 'italic', lineHeight: 1.6 }}>
            Most people only budget for the first session. The ongoing cost is 4× more.
          </p>
        </div>

        <TruthDivider label="Breakdown" />

        {/* Cost breakdown */}
        <Card className="mb-6">
          {BREAKDOWN_ITEMS(result.costs).map((item, i) => (
            <div key={i} style={{ marginBottom: i < 3 ? '20px' : '0' }}>
              <button
                className="w-full text-left"
                onClick={() => setExpanded(expanded === i ? null : i)}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="gt-body" style={{ color: 'var(--gt-ink)', fontWeight: 500 }}>{item.label}</span>
                  <span className="gt-mono" style={{ color: 'var(--gt-rose)' }}>{item.amount}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'var(--gt-border)' }}>
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: animated ? `${item.pct}%` : '0%',
                        background: BAR_COLORS[i],
                        transitionDelay: `${i * 100}ms`,
                      }}
                    />
                  </div>
                  <span className="gt-body-sm flex-shrink-0" style={{ color: 'var(--gt-stone-pale)', width: '32px', textAlign: 'right' }}>
                    {item.pct}%
                  </span>
                </div>
              </button>
              {expanded === i && (
                <div
                  className="mt-2 rounded-xl px-3 py-2 animate-fade-in"
                  style={{ background: 'var(--gt-surface-2)' }}
                >
                  <p className="gt-body-sm" style={{ color: 'var(--gt-stone)' }}>{item.note}</p>
                </div>
              )}
            </div>
          ))}
        </Card>

        {/* AI insight */}
        <AICard className="mb-6">
          {result.aiCostNote}
        </AICard>

        {/* Monthly cost */}
        <div
          className="rounded-2xl p-5 mb-6 flex justify-between items-center"
          style={{ background: 'var(--gt-rose-faint)', border: '1px solid var(--gt-border)' }}
        >
          <div>
            <p className="gt-label mb-0.5" style={{ color: 'var(--gt-stone)' }}>Monthly average</p>
            <p className="gt-body-sm" style={{ color: 'var(--gt-stone)', lineHeight: 1.5 }}>
              After the initial investment
            </p>
          </div>
          <p className="gt-display" style={{ color: 'var(--gt-rose)', fontSize: '1.75rem' }}>₹2,400</p>
        </div>
      </Content>

      <StickyBottom>
        <Btn onClick={() => nav('/roadmap')}>See my roadmap →</Btn>
        <button
          onClick={() => toast.success('Estimate saved!')}
          className="w-full mt-2 gt-body"
          style={{ color: 'var(--gt-stone)', padding: '10px' }}
        >
          Save this estimate
        </button>
      </StickyBottom>
    </Screen>
  )
}
