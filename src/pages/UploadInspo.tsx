import { useNavigate } from 'react-router'
import { Sparkles, ChevronDown } from 'lucide-react'
import { useState, useRef } from 'react'
import { toast } from 'sonner'
import { Screen, Nav, StepProgress, Content, StickyBottom, Btn, AICard } from '../components/ui'
import { useAnalysis } from '../hooks/useAnalysis'
import { uploadToCloudinary, CloudinaryUploadError } from '../services/cloudinary'

const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad']
const BUDGETS = [
  { value: '2k-5k', label: '₹2,000 – ₹5,000' },
  { value: '5k-10k', label: '₹5,000 – ₹10,000' },
  { value: '10k-20k', label: '₹10,000 – ₹20,000' },
  { value: '20k+', label: '₹20,000+' },
]

export default function UploadInspo() {
  const nav = useNavigate()
  const {
    selfieUrl, inspoUrl, setInspoUrl, setInspoPublicId,
    city, setCity, budget, setBudget,
  } = useAnalysis()

  const [inspoOpen, setInspoOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const canContinue = !!inspoUrl && !uploading && !!city

  const handleFile = async (file: File) => {
    // Immediate local preview
    const reader = new FileReader()
    reader.onload = (e) => setInspoUrl(e.target?.result as string)
    reader.readAsDataURL(file)

    setUploading(true)
    setUploadProgress(0)

    try {
      const result = await uploadToCloudinary(file, { onProgress: setUploadProgress })
      setInspoUrl(result.secure_url)
      setInspoPublicId(result.public_id)
      toast.success('Inspiration uploaded ✓')
    } catch (err) {
      if (err instanceof CloudinaryUploadError) toast.error(err.message)
      else toast.error('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) handleFile(file)
    else toast.error('Please drop an image file.')
  }

  return (
    <Screen>
      <Nav showBack />
      <StepProgress current={2} total={4} />

      <Content>
        <div className="pt-6 pb-4">
          <h1 className="gt-display mb-2" style={{ color: 'var(--gt-ink)', fontSize: '1.75rem' }}>Your inspiration</h1>
          <p className="gt-body" style={{ color: 'var(--gt-stone)' }}>The look you want — celebrity photo, screenshot, anything.</p>
        </div>

        {/* Selfie confirmed chip */}
        {selfieUrl && (
          <div className="flex items-center gap-2 mb-4 animate-fade-in">
            <div className="relative flex-shrink-0">
              <img src={selfieUrl} alt="Selfie" className="rounded-lg object-cover" style={{ width: '40px', height: '53px' }} />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
                style={{ background: 'var(--gt-emerald)', border: '2px solid var(--gt-bg)' }}>
                <span style={{ color: '#fff', fontSize: '8px' }}>✓</span>
              </div>
            </div>
            <p className="gt-body-sm" style={{ color: 'var(--gt-stone)' }}>Selfie added ✓ — now add your inspiration.</p>
          </div>
        )}

        {/* Upload zone */}
        <div
          className="relative rounded-3xl overflow-hidden transition-all duration-200 cursor-pointer mb-4"
          style={{
            border: `1.5px dashed ${inspoUrl ? 'var(--gt-rose)' : dragging ? 'var(--gt-rose)' : 'var(--gt-border-strong)'}`,
            background: dragging ? 'var(--gt-rose-faint)' : 'var(--gt-surface-2)',
            minHeight: '240px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
          }}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <input ref={inputRef} type="file" accept="image/*" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />

          {inspoUrl ? (
            <>
              <img src={inspoUrl} alt="Inspiration" className="absolute inset-0 w-full h-full object-cover" />
              {uploading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3"
                  style={{ background: 'rgba(250,248,245,0.85)', backdropFilter: 'blur(4px)' }}>
                  <p className="gt-body-sm" style={{ color: 'var(--gt-stone)', fontWeight: 500 }}>Uploading… {uploadProgress}%</p>
                  <div className="w-32 h-1 rounded-full overflow-hidden" style={{ background: 'var(--gt-border)' }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${uploadProgress}%`, background: 'var(--gt-rose)' }} />
                  </div>
                </div>
              )}
              {!uploading && (
                <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                  style={{ background: 'rgba(250,248,245,0.9)', backdropFilter: 'blur(8px)', height: '44px' }}>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--gt-rose)', fontWeight: 600 }}>Tap to change</span>
                </div>
              )}
            </>
          ) : (
            <>
              <div style={{ color: 'var(--gt-rose)' }}><Sparkles size={32} /></div>
              <p className="gt-title" style={{ color: 'var(--gt-stone)', textAlign: 'center', padding: '0 20px' }}>Your Inspiration Look</p>
              <p className="gt-body-sm" style={{ color: 'var(--gt-stone-pale)', textAlign: 'center' }}>Instagram · Pinterest · Screenshot</p>
              <p className="gt-body-sm" style={{ color: 'var(--gt-stone-pale)', textAlign: 'center' }}>Tap or drag & drop</p>
            </>
          )}
        </div>

        {/* Where to find */}
        <button onClick={() => setInspoOpen(!inspoOpen)}
          className="w-full flex items-center justify-between rounded-xl px-4 mb-4 transition-all"
          style={{ height: '44px', background: 'var(--gt-surface-2)', border: '1px solid var(--gt-border)' }}>
          <span className="gt-body-sm" style={{ color: 'var(--gt-stone)', fontWeight: 500 }}>Where to find inspiration</span>
          <ChevronDown size={16} style={{ color: 'var(--gt-stone-pale)', transform: inspoOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
        </button>

        {inspoOpen && (
          <div className="flex flex-wrap gap-2 mb-4 animate-fade-in">
            {['Instagram', 'Pinterest', 'Screenshot', 'Celebrity photo', 'Magazine'].map((s) => (
              <span key={s} className="px-3 py-1.5 rounded-full gt-body-sm"
                style={{ border: '1px solid var(--gt-border)', color: 'var(--gt-stone)', background: 'var(--gt-surface)' }}>{s}</span>
            ))}
          </div>
        )}

        <AICard className="mb-5">
          The more specific your inspiration photo, the better your analysis. A close-up showing the
          exact colour, cut, and texture gives us far more to work with.
        </AICard>

        {/* City */}
        <div className="mb-4">
          <label className="gt-label block mb-2" style={{ color: 'var(--gt-stone)' }}>Your city</label>
          <select value={city} onChange={(e) => setCity(e.target.value)}
            className="w-full rounded-xl px-4 gt-body appearance-none"
            style={{ height: '52px', background: 'var(--gt-surface-2)', border: '1.5px solid var(--gt-border)', color: city ? 'var(--gt-ink)' : 'var(--gt-stone-pale)', outline: 'none' }}>
            <option value="">Select your city</option>
            {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Budget */}
        <div className="mb-6">
          <label className="gt-label block mb-2" style={{ color: 'var(--gt-stone)' }}>Budget for first session</label>
          <div className="grid grid-cols-2 gap-2">
            {BUDGETS.map((b) => (
              <button key={b.value} onClick={() => setBudget(b.value)}
                className="rounded-xl py-3 px-4 gt-body-sm transition-all"
                style={{
                  border: `1.5px solid ${budget === b.value ? 'var(--gt-rose)' : 'var(--gt-border)'}`,
                  background: budget === b.value ? 'var(--gt-rose-faint)' : 'var(--gt-surface)',
                  color: budget === b.value ? 'var(--gt-rose)' : 'var(--gt-stone)',
                  fontWeight: budget === b.value ? 600 : 400,
                }}>
                {b.label}
              </button>
            ))}
          </div>
        </div>

        {/* Privacy note */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: 'var(--gt-emerald)' }} />
          <p className="gt-body-sm" style={{ color: 'var(--gt-stone-pale)' }}>
            Images are uploaded to Cloudinary and auto-deleted after 24 hours.
          </p>
        </div>
      </Content>

      <StickyBottom>
        <Btn onClick={() => nav('/analyzing')} disabled={!canContinue} loading={uploading}>
          {uploading ? 'Uploading…' : canContinue ? 'Analyze My Look →' : 'Add inspiration & city to continue'}
        </Btn>
      </StickyBottom>
    </Screen>
  )
}
