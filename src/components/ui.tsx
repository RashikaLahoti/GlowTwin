import React, { ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { ChevronLeft, ArrowRight } from 'lucide-react'

/* ─── NAVBAR ──────────────────────────────────────────── */
interface NavProps {
  showBack?: boolean
  rightSlot?: ReactNode
  transparent?: boolean
}
export function Nav({ showBack, rightSlot, transparent }: NavProps) {
  const nav = useNavigate()
  return (
    <nav
      className="sticky top-0 z-50 flex items-center justify-between px-5 h-14"
      style={{
        background: transparent ? 'transparent' : 'rgba(250,248,245,0.92)',
        backdropFilter: 'blur(20px)',
        borderBottom: transparent ? 'none' : '1px solid var(--gt-border)',
      }}
    >
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            onClick={() => nav(-1)}
            className="flex items-center justify-center w-8 h-8 rounded-full transition-colors"
            style={{ color: 'var(--gt-stone)' }}
            aria-label="Go back"
          >
            <ChevronLeft size={20} strokeWidth={2} />
          </button>
        )}
        <button
          onClick={() => nav('/')}
          className="font-bold tracking-tight"
          style={{ fontSize: '1.1rem', color: 'var(--gt-ink)' }}
        >
          Glow<span style={{ color: 'var(--gt-rose)' }}>Twin</span>
        </button>
      </div>
      {rightSlot && <div>{rightSlot}</div>}
    </nav>
  )
}

/* ─── STEP PROGRESS ───────────────────────────────────── */
export function StepProgress({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex gap-1 px-5 pt-3 pb-1">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="h-1 flex-1 rounded-full transition-all duration-500"
          style={{ background: i < current ? 'var(--gt-rose)' : 'var(--gt-border)' }}
        />
      ))}
    </div>
  )
}

/* ─── PRIMARY BUTTON ──────────────────────────────────── */
interface BtnProps {
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  loading?: boolean
  variant?: 'primary' | 'secondary' | 'ghost'
  className?: string
  type?: 'button' | 'submit'
  icon?: ReactNode
}
export function Btn({ children, onClick, disabled, loading, variant = 'primary', className = '', type = 'button', icon }: BtnProps) {
  const base = 'flex items-center justify-center gap-2 w-full h-13 rounded-full font-semibold transition-all duration-200 select-none cursor-pointer disabled:cursor-not-allowed'
  const styles = {
    primary: {
      background: disabled ? 'var(--gt-border)' : 'var(--gt-rose)',
      color: disabled ? 'var(--gt-stone-pale)' : '#fff',
      boxShadow: disabled ? 'none' : 'var(--gt-shadow-sm)',
    },
    secondary: {
      background: 'transparent',
      color: 'var(--gt-ink)',
      border: '1.5px solid var(--gt-border-strong)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--gt-rose)',
      fontSize: '0.9375rem',
    },
  }
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${className}`}
      style={{ ...styles[variant], height: '52px', fontSize: '0.75rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}
    >
      {loading ? (
        <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeOpacity="0.25" />
          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ) : (
        <>
          {children}
          {icon && icon}
        </>
      )}
    </button>
  )
}

/* ─── CARD ────────────────────────────────────────────── */
export function Card({ children, className = '', style = {} }: { children: ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`rounded-2xl ${className}`}
      style={{
        background: 'var(--gt-surface)',
        border: '1px solid var(--gt-border)',
        padding: '20px',
        boxShadow: 'var(--gt-shadow-md)',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

/* ─── AI CARD (lavender) ──────────────────────────────── */
export function AICard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl ${className}`}
      style={{
        background: 'linear-gradient(to right, var(--gt-lavender-light) 0%, var(--gt-surface) 80px)',
        border: '1px solid var(--gt-border)',
        borderLeft: '3px solid var(--gt-lavender)',
        padding: '20px',
      }}
    >
      <div className="flex gap-3">
        <span style={{ color: 'var(--gt-lavender)', fontSize: '1rem', flexShrink: 0, marginTop: '2px' }}>✦</span>
        <div style={{ color: 'var(--gt-stone)', lineHeight: 1.7, fontSize: '0.9375rem' }}>{children}</div>
      </div>
    </div>
  )
}

/* ─── STATUS CHIP ─────────────────────────────────────── */
type ChipVariant = 'achievable' | 'caution' | 'risk' | 'ai' | 'neutral' | 'emerald'
export function Chip({ label, variant = 'neutral', icon }: { label: string; variant?: ChipVariant; icon?: string }) {
  const styles: Record<ChipVariant, { bg: string; color: string }> = {
    achievable: { bg: 'var(--gt-emerald-light)', color: 'var(--gt-emerald)' },
    caution: { bg: 'var(--gt-amber-light)', color: 'var(--gt-amber)' },
    risk: { bg: 'var(--gt-red-light)', color: 'var(--gt-red)' },
    ai: { bg: 'var(--gt-lavender-light)', color: 'var(--gt-lavender)' },
    neutral: { bg: 'var(--gt-surface-2)', color: 'var(--gt-stone)' },
    emerald: { bg: 'var(--gt-emerald-light)', color: 'var(--gt-emerald)' },
  }
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3"
      style={{
        height: '28px',
        fontSize: '0.72rem',
        fontWeight: 600,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        ...styles[variant],
      }}
    >
      {icon && <span>{icon}</span>}
      {label}
    </span>
  )
}

/* ─── TRUTH DIVIDER ───────────────────────────────────── */
export function TruthDivider({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 my-6">
      <div className="flex-1 h-px" style={{ background: 'var(--gt-border)' }} />
      {label && (
        <span
          className="gt-label"
          style={{ color: 'var(--gt-stone)', whiteSpace: 'nowrap', padding: '0 4px' }}
        >
          {label}
        </span>
      )}
      <div className="flex-1 h-px" style={{ background: 'var(--gt-border)' }} />
    </div>
  )
}

/* ─── HEALTH BAR ──────────────────────────────────────── */
export function HealthBar({ value, max = 10 }: { value: number; max?: number }) {
  const pct = (value / max) * 100
  const color = pct < 40 ? 'var(--gt-red)' : pct < 65 ? 'var(--gt-amber)' : 'var(--gt-emerald)'
  return (
    <div className="mt-2">
      <div className="flex justify-between mb-1">
        <span style={{ fontSize: '0.75rem', color: 'var(--gt-stone-pale)' }}>Health</span>
        <span style={{ fontSize: '0.75rem', color: 'var(--gt-rose)', fontWeight: 600 }}>{value}</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--gt-border)' }}>
        <div
          className="h-full rounded-full gt-bar-fill"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  )
}

/* ─── UPLOAD ZONE ─────────────────────────────────────── */
interface UploadZoneProps {
  label: string
  hint: string
  icon: ReactNode
  preview: string | null
  onFile: (url: string) => void
}
export function UploadZone({ label, hint, icon, preview, onFile }: UploadZoneProps) {
  const [dragging, setDragging] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => onFile(e.target?.result as string)
    reader.readAsDataURL(file)
  }

  return (
    <div
      className="relative rounded-3xl overflow-hidden transition-all duration-200 cursor-pointer"
      style={{
        border: `1.5px dashed ${preview ? 'var(--gt-rose)' : dragging ? 'var(--gt-rose)' : 'var(--gt-border-strong)'}`,
        background: dragging ? 'var(--gt-rose-faint)' : 'var(--gt-surface-2)',
        minHeight: '240px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem',
      }}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault(); setDragging(false)
        const file = e.dataTransfer.files[0]
        if (file) handleFile(file)
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
      />
      {preview ? (
        <>
          <img src={preview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
          <div
            className="absolute bottom-0 left-0 right-0 flex items-center justify-center"
            style={{ background: 'rgba(250,248,245,0.9)', backdropFilter: 'blur(8px)', height: '44px' }}
          >
            <span style={{ fontSize: '0.8125rem', color: 'var(--gt-rose)', fontWeight: 600 }}>Tap to change</span>
          </div>
        </>
      ) : (
        <>
          <div style={{ color: 'var(--gt-rose)', fontSize: '2rem' }}>{icon}</div>
          <p className="gt-title" style={{ color: 'var(--gt-stone)', textAlign: 'center', padding: '0 20px' }}>{label}</p>
          <p className="gt-body-sm" style={{ color: 'var(--gt-stone-pale)', textAlign: 'center' }}>{hint}</p>
          <p className="gt-body-sm" style={{ color: 'var(--gt-stone-pale)', textAlign: 'center', marginTop: '-4px' }}>
            Tap or drag & drop
          </p>
        </>
      )}
    </div>
  )
}

/* ─── PHOTO PAIR ──────────────────────────────────────── */
export function PhotoPair({ selfie, inspo, size = 72 }: { selfie: string | null; inspo: string | null; size?: number }) {
  const h = size * (4 / 3)
  const placeholder = (label: string, color: string) => (
    <div
      className="rounded-xl flex items-center justify-center"
      style={{ width: size, height: h, background: 'var(--gt-surface-2)', border: `1.5px solid ${color}`, flexShrink: 0 }}
    >
      <span style={{ fontSize: '1.5rem' }}>📷</span>
    </div>
  )
  return (
    <div className="flex gap-4 justify-center">
      <div className="flex flex-col items-center gap-1.5">
        {selfie
          ? <img src={selfie} alt="You" className="rounded-xl object-cover" style={{ width: size, height: h }} />
          : placeholder('You', 'var(--gt-rose)')}
        <span className="gt-label" style={{ color: 'var(--gt-stone-pale)', fontSize: '10px' }}>You</span>
      </div>
      <div className="flex items-center" style={{ marginBottom: '18px' }}>
        <ArrowRight size={16} style={{ color: 'var(--gt-stone-pale)' }} />
      </div>
      <div className="flex flex-col items-center gap-1.5">
        {inspo
          ? <img src={inspo} alt="Goal" className="rounded-xl object-cover" style={{ width: size, height: h }} />
          : placeholder('Goal', 'var(--gt-lavender)')}
        <span className="gt-label" style={{ color: 'var(--gt-stone-pale)', fontSize: '10px' }}>The goal</span>
      </div>
    </div>
  )
}

/* ─── SCREEN WRAPPER ──────────────────────────────────── */
export function Screen({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`min-h-screen flex flex-col animate-fade-in ${className}`}
      style={{ background: 'var(--gt-bg)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {children}
    </div>
  )
}

/* ─── CONTENT WRAPPER ─────────────────────────────────── */
export function Content({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`flex-1 px-5 pb-8 ${className}`} style={{ maxWidth: '480px', margin: '0 auto', width: '100%' }}>
      {children}
    </div>
  )
}

/* ─── STICKY BOTTOM CTA ───────────────────────────────── */
export function StickyBottom({ children }: { children: ReactNode }) {
  return (
    <div
      className="sticky bottom-0 px-5 pb-6 pt-4"
      style={{ background: 'linear-gradient(to top, var(--gt-bg) 80%, transparent)', zIndex: 10 }}
    >
      {children}
    </div>
  )
}
