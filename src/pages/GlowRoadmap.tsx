import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { Screen, Nav, Content, StickyBottom, Btn, AICard } from '../components/ui'
import { useAnalysis } from '../hooks/useAnalysis'

const TYPE_COLORS = {
  home: 'var(--gt-emerald)',
  salon: 'var(--gt-rose)',
  maintenance: 'var(--gt-lavender)',
}
const TYPE_BG = {
  home: 'var(--gt-emerald-light)',
  salon: 'var(--gt-rose-faint)',
  maintenance: 'var(--gt-lavender-light)',
}

export default function GlowRoadmap() {
  const nav = useNavigate()
  const { result } = useAnalysis()

  if (!result) { nav('/'); return null }

  return (
    <Screen>
      <Nav
        showBack
        rightSlot={
          <button
            onClick={() => toast.success('Roadmap saved!')}
            className="gt-label rounded-full px-3 py-1.5"
            style={{ border: '1px solid var(--gt-border)', color: 'var(--gt-stone)', fontSize: '0.72rem' }}
          >
            □ Save
          </button>
        }
      />

      <Content>
        <div className="pt-6 pb-4">
          <h1 className="gt-display mb-2" style={{ color: 'var(--gt-ink)', fontSize: '1.75rem' }}>
            Your path to<br />the look.
          </h1>
          <p className="gt-body mb-2" style={{ color: 'var(--gt-stone)' }}>
            {result.roadmilestones.length} phases. Every step mapped. No guessing.
          </p>
        </div>

        {/* Progress track */}
        <div className="relative mb-8">
          <div className="flex items-center gap-2 mb-1">
            <span className="gt-label" style={{ color: 'var(--gt-rose)', fontSize: '10px' }}>You are here</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--gt-border)' }}>
            <div
              className="h-full rounded-full gt-bar-fill"
              style={{ width: '8%', background: 'var(--gt-rose)' }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="gt-label" style={{ color: 'var(--gt-stone-pale)', fontSize: '10px' }}>Today</span>
            <span className="gt-label" style={{ color: 'var(--gt-stone-pale)', fontSize: '10px' }}>Month 4</span>
          </div>
        </div>

        {/* AI Note */}
        <AICard className="mb-6">
          Your roadmap is based on your current analysis. As your hair changes, we'll update it.
        </AICard>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div
            className="absolute"
            style={{
              left: '11px',
              top: '12px',
              bottom: '12px',
              width: '1px',
              background: 'linear-gradient(to bottom, var(--gt-rose), rgba(196,149,106,0.1))',
            }}
          />

          <div className="space-y-4 pl-8">
            {result.roadmilestones.map((m, i) => (
              <div key={i} className="relative">
                {/* Dot */}
                <div
                  className="absolute flex items-center justify-center"
                  style={{
                    left: '-32px',
                    top: '14px',
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    background: i === 0 ? TYPE_COLORS[m.type] : 'var(--gt-bg)',
                    border: `2px solid ${TYPE_COLORS[m.type]}`,
                    boxShadow: i === 0 ? `0 0 0 4px ${TYPE_BG[m.type]}` : 'none',
                    zIndex: 1,
                  }}
                >
                  {i === 0 && <div className="w-2 h-2 rounded-full" style={{ background: '#fff' }} />}
                </div>

                {/* Card */}
                <div
                  className="rounded-2xl p-5 transition-all duration-200"
                  style={{
                    background: 'var(--gt-surface)',
                    border: `1px solid var(--gt-border)`,
                    borderLeft: `3px solid ${TYPE_COLORS[m.type]}`,
                    boxShadow: 'var(--gt-shadow-md)',
                  }}
                >
                  <p className="gt-label mb-1" style={{ color: 'var(--gt-stone-pale)' }}>{m.phase}</p>
                  <p className="gt-title mb-2" style={{ color: 'var(--gt-ink)' }}>{m.title}</p>
                  <p className="gt-body-sm mb-3" style={{ color: 'var(--gt-stone)', lineHeight: 1.6 }}>{m.desc}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {m.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-full gt-label"
                        style={{
                          border: '1px solid var(--gt-border)',
                          color: 'var(--gt-stone)',
                          fontSize: '10px',
                          background: 'var(--gt-surface-2)',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Cost */}
                  <div
                    className="flex justify-between items-center pt-3"
                    style={{ borderTop: '1px solid var(--gt-border)' }}
                  >
                    <span className="gt-body-sm" style={{ color: 'var(--gt-stone-pale)' }}>Estimated cost</span>
                    <span className="gt-mono" style={{ color: 'var(--gt-rose)', fontWeight: 600 }}>{m.cost}</span>
                  </div>

                  {/* Note */}
                  {m.note && (
                    <div
                      className="mt-3 rounded-xl px-3 py-2"
                      style={{ background: TYPE_BG[m.type] }}
                    >
                      <p className="gt-body-sm" style={{ color: TYPE_COLORS[m.type], fontWeight: 500 }}>
                        ✦ {m.note}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="h-6" />
      </Content>

      <StickyBottom>
        <Btn onClick={() => nav('/brief')}>Get my Stylist Brief →</Btn>
      </StickyBottom>
    </Screen>
  )
}
