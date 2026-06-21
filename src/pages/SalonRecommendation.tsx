import { useNavigate } from 'react-router'
import { MapPin, Star, ChevronDown } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Screen, Nav, Content, Chip, AICard } from '../components/ui'
import { useAnalysis } from '../hooks/useAnalysis'
import BookingModal from '../components/BookingModal'
import { fetchSalonRecommendations, SalonRecommendation as SalonRec } from '../services/salon-finder'

export default function SalonRecommendation() {
  const nav = useNavigate()
  const { result, budget } = useAnalysis()
  const [salons, setSalons] = useState<SalonRec[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [bookingSalon, setBookingSalon] = useState<SalonRec | null>(null)
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    if (!result) return

    let active = true
    setLoading(true)

    fetchSalonRecommendations(
      result.city,
      result.technique,
      budget,
      result.hairType,
      result.riskLevel,
      result.status
    )
      .then((data) => {
        if (active) {
          setSalons(data)
          setLoading(false)
          if (data.length > 0) {
            setExpanded(data[0].id) // top pick expanded by default
          }
        }
      })
      .catch((err) => {
        console.error('Failed to fetch salon recommendations:', err)
        if (active) {
          setLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [result, budget])

  if (!result) {
    nav('/')
    return null
  }

  const filters = ['All', 'Balayage', 'Under ₹7K', 'Available this week', 'Strand test']

  // Implement the filtering logic
  const filteredSalons = salons.filter((salon) => {
    if (filter === 'All') return true
    if (filter === 'Balayage') {
      return (
        salon.name.toLowerCase().includes('balayage') ||
        salon.spec.toLowerCase().includes('balayage') ||
        salon.tags.some((t) => t.toLowerCase().includes('balayage'))
      )
    }
    if (filter === 'Under ₹7K') {
      const parts = salon.price.split(/[–-]/)
      if (parts.length > 0) {
        const minVal = parseInt(parts[0].replace(/[^\d]/g, ''), 10)
        if (!isNaN(minVal)) {
          return minVal <= 7000
        }
      }
      return true
    }
    if (filter === 'Available this week') {
      return salon.recommendedBecause.includes('Available This Week')
    }
    if (filter === 'Strand test') {
      return (
        salon.tags.some((t) => t.toLowerCase().includes('strand')) ||
        salon.spec.toLowerCase().includes('strand')
      )
    }
    return true
  })

  return (
    <Screen>
      <Nav showBack />

      <Content>
        <div className="pt-6 pb-4">
          <h1 className="gt-display mb-2" style={{ color: 'var(--gt-ink)', fontSize: '1.75rem' }}>
            Matched specialists
          </h1>
          <p className="gt-body mb-4" style={{ color: 'var(--gt-stone)' }}>
            Specialists in {result.technique.toLowerCase()} near {result.city}.
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-5 -mx-5 px-5" style={{ scrollbarWidth: 'none' }}>
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="flex-shrink-0 px-4 rounded-full gt-body-sm transition-all"
              style={{
                height: '32px',
                border: `1.5px solid ${filter === f ? 'var(--gt-rose)' : 'var(--gt-border)'}`,
                background: filter === f ? 'var(--gt-rose)' : 'var(--gt-surface)',
                color: filter === f ? '#fff' : 'var(--gt-stone)',
                fontWeight: filter === f ? 600 : 400,
                whiteSpace: 'nowrap',
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="space-y-4 mb-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="gt-skeleton rounded-2xl"
                style={{ height: '180px', width: '100%' }}
              />
            ))}
          </div>
        ) : filteredSalons.length === 0 ? (
          <div className="text-center py-10">
            <p className="gt-body" style={{ color: 'var(--gt-stone)' }}>
              No salons found matching the selected filter.
            </p>
          </div>
        ) : (
          /* Salon cards */
          <div className="space-y-6 mb-6">
            {filteredSalons.map((salon) => {
              const isExpanded = expanded === salon.id
              return (
                <div key={salon.id}>
                  {salon.topPick && (
                    <div className="flex items-center gap-1.5 mb-2">
                      <Star size={12} fill="var(--gt-rose)" style={{ color: 'var(--gt-rose)' }} />
                      <span className="gt-label" style={{ color: 'var(--gt-rose)', fontSize: '10px' }}>Top Match</span>
                    </div>
                  )}
                  <div
                    className="rounded-2xl overflow-hidden transition-all duration-300"
                    style={{
                      background: 'var(--gt-surface)',
                      border: `1px solid ${salon.topPick ? 'var(--gt-rose)' : 'var(--gt-border)'}`,
                      boxShadow: salon.topPick ? 'var(--gt-shadow-lg)' : 'var(--gt-shadow-md)',
                    }}
                  >
                    {/* Card header / Main Details */}
                    <div className="p-5">
                      <div className="flex items-start gap-3">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: 'var(--gt-surface-2)', fontSize: '1.5rem', border: '1px solid var(--gt-border)' }}
                        >
                          {salon.emoji}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="gt-title" style={{ color: 'var(--gt-ink)', fontSize: '1.1rem' }}>
                                {salon.name}
                              </p>
                              <div className="flex items-center gap-1 mt-1">
                                <Star size={12} fill="var(--gt-rose)" style={{ color: 'var(--gt-rose)' }} />
                                <span className="gt-mono" style={{ color: 'var(--gt-rose)', fontWeight: 600 }}>{salon.rating}</span>
                                <span className="gt-body-sm" style={{ color: 'var(--gt-stone-pale)' }}>
                                  ({salon.reviews} reviews)
                                </span>
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <span className="gt-mono" style={{ color: 'var(--gt-rose)', fontWeight: 700, fontSize: '0.9rem' }}>
                                {salon.price}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Recommended Because Section */}
                      <div
                        className="mt-4 p-4 rounded-xl"
                        style={{
                          background: 'var(--gt-rose-faint)',
                          border: '1px solid var(--gt-rose-light)',
                        }}
                      >
                        <p className="gt-label mb-2.5" style={{ color: 'var(--gt-rose)', fontSize: '10px', letterSpacing: '0.08em' }}>
                          Recommended Because
                        </p>
                        <div className="space-y-2">
                          {salon.recommendedBecause.map((reason, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <span style={{ color: 'var(--gt-emerald)', fontWeight: 700, fontSize: '1.1rem', lineHeight: 1 }}>✓</span>
                              <span className="gt-body-sm" style={{ color: 'var(--gt-ink)', fontWeight: 500 }}>
                                {reason}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-3 mt-4">
                        <button
                          onClick={() => setBookingSalon(salon)}
                          className="flex-1 rounded-full transition-all hover:opacity-90 active:scale-[0.98]"
                          style={{
                            height: '48px',
                            background: 'var(--gt-rose)',
                            color: '#fff',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            letterSpacing: '0.06em',
                            textTransform: 'uppercase',
                            border: 'none',
                            cursor: 'pointer',
                          }}
                        >
                          Book now
                        </button>
                        <button
                          onClick={() => setExpanded(isExpanded ? null : salon.id)}
                          className="px-4 rounded-full flex items-center justify-center gap-1.5 transition-all"
                          style={{
                            height: '48px',
                            background: 'transparent',
                            border: '1.5px solid var(--gt-border-strong)',
                            color: 'var(--gt-stone)',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          {isExpanded ? 'Hide Info' : 'Details'}
                          <ChevronDown
                            size={14}
                            style={{
                              transform: isExpanded ? 'rotate(180deg)' : 'none',
                              transition: 'transform 0.2s',
                            }}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Expanded details */}
                    {isExpanded && (
                      <div
                        className="px-5 pb-5 pt-4 animate-fade-in"
                        style={{ borderTop: '1px solid var(--gt-border)', background: 'var(--gt-bg)' }}
                      >
                        <div className="flex items-center gap-1.5 mb-3">
                          <MapPin size={13} style={{ color: 'var(--gt-stone-pale)' }} />
                          <span className="gt-body-sm" style={{ color: 'var(--gt-stone)' }}>
                            {salon.location} · {salon.distance}
                          </span>
                        </div>

                        <p className="gt-body-sm mb-4" style={{ color: 'var(--gt-stone)', lineHeight: 1.6 }}>
                          {salon.spec}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {salon.tags.map((tag) => (
                            <Chip key={tag} label={tag} variant={tag.includes('GlowTwin') ? 'achievable' : 'neutral'} />
                          ))}
                        </div>

                        {/* AI note */}
                        {salon.aiNote && (
                          <div
                            className="rounded-xl p-3 mb-4"
                            style={{
                              background: 'var(--gt-lavender-light)',
                              borderLeft: '3px solid var(--gt-lavender)',
                            }}
                          >
                            <p className="gt-body-sm" style={{ color: 'var(--gt-stone)', fontStyle: 'italic' }}>
                              ✦ {salon.aiNote}
                            </p>
                          </div>
                        )}

                        {/* Google Maps link */}
                        <div className="pt-2">
                          <a
                            href={salon.mapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="gt-body-sm inline-flex items-center gap-1 transition-all"
                            style={{ color: 'var(--gt-rose)', fontWeight: 600, textDecoration: 'underline' }}
                          >
                            View on Google Maps
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Trust note */}
        <AICard className="mb-6">
          GlowTwin matches by technique certification, not commission. These stylists are verified in {result.technique.toLowerCase()} and have experience with chemically-processed hair. We earn a flat fee from partner salons — never a cut of your booking.
        </AICard>

        <div className="pb-4">
          <div className="h-px mb-4" style={{ background: 'var(--gt-border)' }} />
          <p className="gt-body-sm text-center" style={{ color: 'var(--gt-stone-pale)' }}>
            Don't see what you're looking for?{' '}
            <span style={{ color: 'var(--gt-rose)', fontWeight: 500, cursor: 'pointer' }}>
              Request a salon
            </span>
          </p>
        </div>
      </Content>

      {/* Booking modal */}
      {bookingSalon && (
        <BookingModal
          salon={bookingSalon}
          onClose={() => setBookingSalon(null)}
          onConfirm={(date, time) => {
            setBookingSalon(null)
            nav('/confirmed', { state: { salon: bookingSalon.name, date, time } })
          }}
        />
      )}
    </Screen>
  )
}
