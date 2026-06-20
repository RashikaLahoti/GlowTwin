import { useState } from 'react'
import { X } from 'lucide-react'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const TIMES = ['10:00 AM', '11:30 AM', '1:00 PM', '2:30 PM', '4:00 PM', '5:30 PM', '6:00 PM', '7:00 PM']

interface Salon {
  name: string
  price: string
  spec?: string
}

interface Props {
  salon: Salon
  onClose: () => void
  onConfirm: (date: string, time: string) => void
}

export default function BookingModal({ salon, onClose, onConfirm }: Props) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  const today = new Date()
  const dates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    return d
  })

  const handleConfirm = () => {
    if (!selectedDate || !selectedTime) return
    onConfirm(selectedDate, selectedTime)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: 'rgba(0,0,0,0.5)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="w-full rounded-t-3xl animate-fade-up"
        style={{
          background: 'var(--gt-surface)',
          border: '1px solid var(--gt-border)',
          padding: '20px',
          maxWidth: '480px',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        {/* Handle */}
        <div className="w-10 h-1 rounded-full mx-auto mb-4" style={{ background: 'var(--gt-border)' }} />

        {/* Header */}
        <div className="flex items-start justify-between mb-1">
          <div>
            <p className="gt-title" style={{ color: 'var(--gt-ink)' }}>Book at {salon.name}</p>
            <p className="gt-body-sm" style={{ color: 'var(--gt-stone)' }}>{salon.price}</p>
          </div>
          <button onClick={onClose} style={{ color: 'var(--gt-stone-pale)', padding: '4px' }}>
            <X size={20} />
          </button>
        </div>

        {/* Date */}
        <p className="gt-label mt-4 mb-3" style={{ color: 'var(--gt-stone)' }}>Select date</p>
        <div className="grid grid-cols-7 gap-1.5 mb-4">
          {dates.map((d, i) => {
            const isMonday = d.getDay() === 1
            const dateStr = d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
            const isSelected = selectedDate === dateStr
            return (
              <button
                key={i}
                onClick={() => !isMonday && setSelectedDate(dateStr)}
                disabled={isMonday}
                className="flex flex-col items-center justify-center rounded-xl transition-all"
                style={{
                  aspectRatio: '1',
                  background: isSelected ? 'var(--gt-rose)' : 'var(--gt-surface-2)',
                  border: `1.5px solid ${isSelected ? 'var(--gt-rose)' : 'var(--gt-border)'}`,
                  color: isMonday ? 'var(--gt-stone-pale)' : isSelected ? '#fff' : 'var(--gt-ink)',
                  opacity: isMonday ? 0.3 : 1,
                  fontSize: '0.75rem',
                  gap: '2px',
                }}
              >
                <span style={{ fontSize: '9px', fontWeight: 600, opacity: 0.7 }}>{DAYS[d.getDay()]}</span>
                <span style={{ fontWeight: isSelected ? 700 : 500 }}>{d.getDate()}</span>
              </button>
            )
          })}
        </div>

        {/* Time */}
        <p className="gt-label mb-3" style={{ color: 'var(--gt-stone)' }}>Select time</p>
        <div className="grid grid-cols-4 gap-2 mb-5">
          {TIMES.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTime(t)}
              className="rounded-xl py-2.5 transition-all"
              style={{
                border: `1.5px solid ${selectedTime === t ? 'var(--gt-rose)' : 'var(--gt-border)'}`,
                background: selectedTime === t ? 'var(--gt-rose-faint)' : 'var(--gt-surface)',
                color: selectedTime === t ? 'var(--gt-rose)' : 'var(--gt-stone)',
                fontSize: '0.75rem',
                fontWeight: selectedTime === t ? 600 : 400,
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Confirm */}
        <button
          onClick={handleConfirm}
          disabled={!selectedDate || !selectedTime}
          className="w-full rounded-full"
          style={{
            height: '52px',
            background: selectedDate && selectedTime ? 'var(--gt-rose)' : 'var(--gt-border)',
            color: selectedDate && selectedTime ? '#fff' : 'var(--gt-stone-pale)',
            fontSize: '0.75rem',
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            transition: 'all 0.2s',
          }}
        >
          {selectedDate && selectedTime ? 'Confirm Booking →' : 'Select date & time'}
        </button>
      </div>
    </div>
  )
}
