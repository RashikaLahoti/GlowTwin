import { useNavigate } from 'react-router'
import { MapPin, Star, ChevronDown, Calendar } from 'lucide-react'
import { useState } from 'react'
import { Screen, Nav, Content, Chip, AICard } from '../components/ui'
import { useAnalysis } from '../hooks/useAnalysis'
import BookingModal from '../components/BookingModal'

const SALONS = [
  {
    id: 1,
    emoji: '💎',
    name: 'Aarav Studio',
    location: 'Bandra West',
    distance: '2.3 km',
    rating: 4.9,
    reviews: 184,
    spec: 'Free-hand balayage specialist · 7 years · Works with Olaplex on every color service · 23 clients with similar hair profile',
    tags: ['GlowTwin Certified', 'Olaplex'],
    availability: 'Sat, Oct 19',
    price: '₹5,500 – ₹8,000',
    topPick: true,
    aiNote: 'This stylist has worked with 23 clients with similar hair profiles to yours.',
  },
  {
    id: 2,
    emoji: '🌿',
    name: "Riya's Color Lab",
    location: 'Andheri West',
    distance: '3.8 km',
    rating: 4.7,
    reviews: 91,
    spec: 'Balayage + color correction · Expert in previously-colored hair · Bond treatment partner salon',
    tags: ['GlowTwin Certified', 'Color Correction'],
    availability: 'Sun, Oct 20',
    price: '₹4,500 – ₹7,000',
    topPick: false,
  },
  {
    id: 3,
    emoji: '☀️',
    name: 'The Glow Room',
    location: 'Juhu',
    distance: '5.1 km',
    rating: 4.8,
    reviews: 212,
    spec: 'Premium balayage studio · Specializes in high-lift on South Asian hair · Strand test included before every bleach service',
    tags: ['Strand Test Included', 'South Asian Hair'],
    availability: 'Fri, Oct 18',
    price: '₹6,000 – ₹9,000',
    topPick: false,
  },
]

export default function SalonRecommendation() {
  const nav = useNavigate()
  const { result } = useAnalysis()
  const [expanded, setExpanded] = useState<number | null>(1) // top pick expanded by default
  const [bookingSalon, setBookingSalon] = useState<(typeof SALONS)[0] | null>(null)
  const [filter, setFilter] = useState('All')

  if (!result) { nav('/'); return null }

  const filters = ['All', 'Balayage', 'Under ₹7K', 'Available this week', 'Strand test']

  return (
    <Screen>
      <Nav showBack />

      <Content>
        <div className="pt-6 pb-4">
          <h1 className="gt-display mb-2" style={{ color: 'var(--gt-ink)', fontSize: '1.75rem' }}>
            Matched stylists
          </h1>
          <p className="gt-body mb-4" style={{ color: 'var(--gt-stone)' }}>
            Specialists in free-hand balayage near {result.city}.
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

        {/* Salon cards */}
        <div className="space-y-4 mb-6">
          {SALONS.map((salon) => {
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
                  {/* Card header */}
                  <button
                    className="w-full text-left p-5"
                    onClick={() => setExpanded(isExpanded ? null : salon.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: 'var(--gt-surface-2)', fontSize: '1.5rem', border: '1px solid var(--gt-border)' }}
                      >
                        {salon.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="gt-title" style={{ color: 'var(--gt-ink)', fontSize: '1rem' }}>{salon.name}</p>
                          <ChevronDown
                            size={16}
                            style={{
                              color: 'var(--gt-stone-pale)',
                              transform: isExpanded ? 'rotate(180deg)' : 'none',
                              transition: 'transform 0.2s',
                              flexShrink: 0,
                              marginLeft: '8px',
                            }}
                          />
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <MapPin size={11} style={{ color: 'var(--gt-stone-pale)' }} />
                          <span className="gt-body-sm" style={{ color: 'var(--gt-stone-pale)' }}>
                            {salon.location} · {salon.distance}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Star size={11} fill="var(--gt-rose)" style={{ color: 'var(--gt-rose)' }} />
                          <span className="gt-mono" style={{ color: 'var(--gt-rose)' }}>{salon.rating}</span>
                          <span className="gt-body-sm" style={{ color: 'var(--gt-stone-pale)' }}>
                            ({salon.reviews} reviews)
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Expanded content */}
                  {isExpanded && (
                    <div className="px-5 pb-5 animate-fade-in" style={{ borderTop: '1px solid var(--gt-border)' }}>
                      <p className="gt-body-sm mt-4 mb-3" style={{ color: 'var(--gt-stone)', lineHeight: 1.6 }}>{salon.spec}</p>

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

                      {/* Availability + Price */}
                      <div
                        className="flex justify-between items-center py-3 mb-4"
                        style={{ borderTop: '1px solid var(--gt-border)', borderBottom: '1px solid var(--gt-border)' }}
                      >
                        <div className="flex items-center gap-1.5">
                          <Calendar size={14} style={{ color: 'var(--gt-stone-pale)' }} />
                          <span className="gt-body-sm" style={{ color: 'var(--gt-ink)', fontWeight: 500 }}>
                            {salon.availability}
                          </span>
                        </div>
                        <span className="gt-mono" style={{ color: 'var(--gt-rose)', fontWeight: 600 }}>{salon.price}</span>
                      </div>

                      {/* Book button */}
                      <button
                        onClick={() => setBookingSalon(salon)}
                        className="w-full rounded-full"
                        style={{
                          height: '48px',
                          background: salon.topPick ? 'var(--gt-rose)' : 'transparent',
                          border: salon.topPick ? 'none' : '1.5px solid var(--gt-border-strong)',
                          color: salon.topPick ? '#fff' : 'var(--gt-ink)',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                        }}
                      >
                        Book now →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Trust note */}
        <AICard className="mb-6">
          GlowTwin matches by technique certification, not commission. These stylists are verified in free-hand balayage and have experience with chemically-processed hair. We earn a flat fee from partner salons — never a cut of your booking.
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
