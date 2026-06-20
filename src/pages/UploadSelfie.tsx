import { useNavigate } from 'react-router'
import { useState, useRef } from 'react'
import { Camera, ImageUp, ChevronDown } from 'lucide-react'
import { toast } from 'sonner'
import { Screen, Nav, StepProgress, Content, StickyBottom, Btn } from '../components/ui'
import { useAnalysis } from '../hooks/useAnalysis'
import { uploadToCloudinary, CloudinaryUploadError } from '../services/cloudinary'

const TIPS = [
  'Face fully visible, front-facing',
  'Good natural lighting',
  'No sunglasses or hats',
  'No filters or heavy editing',
]

export default function UploadSelfie() {
  const nav = useNavigate()
  const { selfieUrl, setSelfieUrl, setSelfiePublicId } = useAnalysis()
  const [tipsOpen, setTipsOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  // ── Handle file selected from input ───────────────────────────────────────
  const handleFile = async (file: File) => {
    // Show local preview immediately — feels instant
    const reader = new FileReader()
    reader.onload = (e) => setSelfieUrl(e.target?.result as string)
    reader.readAsDataURL(file)

    // Upload to Cloudinary in background
    setUploading(true)
    setUploadProgress(0)
    abortRef.current = new AbortController()

    try {
      const result = await uploadToCloudinary(file, {
        onProgress: setUploadProgress,
        signal: abortRef.current.signal,
      })
      // Replace local preview with Cloudinary secure_url
      setSelfieUrl(result.secure_url)
      setSelfiePublicId(result.public_id)
      toast.success('Selfie uploaded ✓')
    } catch (err) {
      if (err instanceof CloudinaryUploadError) {
        toast.error(err.message)
      } else {
        toast.error('Upload failed. Please try again.')
      }
      // Keep local preview so user doesn't lose their selection
    } finally {
      setUploading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) handleFile(file)
    else toast.error('Please drop an image file.')
  }

  const [dragging, setDragging] = useState(false)

  return (
    <Screen>
      <Nav showBack />
      <StepProgress current={1} total={4} />

      <Content>
        <div className="pt-6 pb-4">
          <h1 className="gt-display mb-2" style={{ color: 'var(--gt-ink)', fontSize: '1.75rem' }}>
            Your selfie
          </h1>
          <p className="gt-body" style={{ color: 'var(--gt-stone)' }}>
            Take or upload a clear front-facing photo.
          </p>
        </div>

        {/* Upload zone */}
        <div
          className="relative rounded-3xl overflow-hidden transition-all duration-200 cursor-pointer mb-4"
          style={{
            border: `1.5px dashed ${selfieUrl ? 'var(--gt-rose)' : dragging ? 'var(--gt-rose)' : 'var(--gt-border-strong)'}`,
            background: dragging ? 'var(--gt-rose-faint)' : 'var(--gt-surface-2)',
            minHeight: '240px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
          }}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleInputChange}
          />

          {selfieUrl ? (
            <>
              <img src={selfieUrl} alt="Your selfie" className="absolute inset-0 w-full h-full object-cover" />
              {/* Upload progress overlay */}
              {uploading && (
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center gap-3"
                  style={{ background: 'rgba(250,248,245,0.85)', backdropFilter: 'blur(4px)' }}
                >
                  <p className="gt-body-sm" style={{ color: 'var(--gt-stone)', fontWeight: 500 }}>
                    Uploading… {uploadProgress}%
                  </p>
                  <div className="w-32 h-1 rounded-full overflow-hidden" style={{ background: 'var(--gt-border)' }}>
                    <div
                      className="h-full rounded-full transition-all duration-200"
                      style={{ width: `${uploadProgress}%`, background: 'var(--gt-rose)' }}
                    />
                  </div>
                </div>
              )}
              {/* Change overlay (when not uploading) */}
              {!uploading && (
                <div
                  className="absolute bottom-0 left-0 right-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                  style={{ background: 'rgba(250,248,245,0.9)', backdropFilter: 'blur(8px)', height: '44px' }}
                >
                  <span style={{ fontSize: '0.8125rem', color: 'var(--gt-rose)', fontWeight: 600 }}>Tap to change</span>
                </div>
              )}
            </>
          ) : (
            <>
              <div style={{ color: 'var(--gt-rose)', fontSize: '2rem' }}><Camera size={32} /></div>
              <p className="gt-title" style={{ color: 'var(--gt-stone)', textAlign: 'center', padding: '0 20px' }}>
                Your Selfie
              </p>
              <p className="gt-body-sm" style={{ color: 'var(--gt-stone-pale)', textAlign: 'center' }}>
                Front-facing · Good lighting
              </p>
              <p className="gt-body-sm" style={{ color: 'var(--gt-stone-pale)', textAlign: 'center' }}>
                Tap or drag & drop
              </p>
            </>
          )}
        </div>

        {/* Quick options */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            { icon: <Camera size={18} />, label: 'Take a photo' },
            { icon: <ImageUp size={18} />, label: 'Upload photo' },
          ].map((o, i) => (
            <button
              key={i}
              onClick={() => inputRef.current?.click()}
              className="flex items-center justify-center gap-2 rounded-full transition-all"
              style={{
                height: '44px', border: '1px solid var(--gt-border)',
                background: 'var(--gt-surface)', fontSize: '0.8125rem',
                fontWeight: 500, color: 'var(--gt-stone)',
              }}
            >
              {o.icon}{o.label}
            </button>
          ))}
        </div>

        {/* Tips */}
        <button
          onClick={() => setTipsOpen(!tipsOpen)}
          className="w-full flex items-center justify-between rounded-xl px-4 transition-all mb-4"
          style={{
            height: '44px',
            background: tipsOpen ? 'var(--gt-rose-faint)' : 'var(--gt-surface-2)',
            border: '1px solid var(--gt-border)',
          }}
        >
          <span className="gt-body-sm" style={{ color: 'var(--gt-stone)', fontWeight: 500 }}>
            💡 Tips for best results
          </span>
          <ChevronDown size={16} style={{ color: 'var(--gt-stone-pale)', transform: tipsOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
        </button>

        {tipsOpen && (
          <div className="rounded-xl px-4 py-3 mb-4 animate-fade-in" style={{ background: 'var(--gt-rose-faint)', border: '1px solid var(--gt-border)' }}>
            {TIPS.map((t, i) => (
              <div key={i} className="flex items-center gap-2 py-1.5">
                <span style={{ color: 'var(--gt-emerald)', fontSize: '0.875rem' }}>✓</span>
                <span className="gt-body-sm" style={{ color: 'var(--gt-stone)' }}>{t}</span>
              </div>
            ))}
          </div>
        )}

        {/* Privacy note */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: 'var(--gt-emerald)' }} />
          <p className="gt-body-sm" style={{ color: 'var(--gt-stone-pale)' }}>
            Uploaded to Cloudinary with auto-delete after 24 hours. Never stored on our servers.
          </p>
        </div>
      </Content>

      <StickyBottom>
        <Btn
          onClick={() => nav('/upload-inspo')}
          disabled={!selfieUrl || uploading}
          loading={uploading}
        >
          {uploading ? 'Uploading…' : selfieUrl ? 'Continue →' : 'Add your selfie to continue'}
        </Btn>
      </StickyBottom>
    </Screen>
  )
}
