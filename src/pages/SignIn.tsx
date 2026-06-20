import { useNavigate } from 'react-router'
import { Mail } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Screen, Nav, Card } from '../components/ui'
import { useAuth } from '../contexts/auth-context'

export default function SignIn() {
  const nav = useNavigate()
  const { signInWithGoogle } = useAuth()
  const [loading, setLoading] = useState(false)

  const handleGoogle = async () => {
    setLoading(true)
    try {
      await signInWithGoogle()
      toast.success('Signed in with Google')
      nav('/upload-selfie')
    } catch (err) {
      toast.error('Google Sign-In failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Screen>
      <Nav showBack />
      <div
        className="flex-1 flex flex-col px-5 pt-8 pb-8"
        style={{ maxWidth: '480px', margin: '0 auto', width: '100%' }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: 'var(--gt-rose-faint)', border: '1px solid var(--gt-border)' }}
          >
            <span style={{ fontSize: '1.5rem' }}>✨</span>
          </div>
          <h1 className="gt-display mb-2" style={{ color: 'var(--gt-ink)', fontSize: '1.75rem' }}>
            Welcome.
          </h1>
          <p className="gt-body text-center" style={{ color: 'var(--gt-stone)', maxWidth: '260px', lineHeight: 1.7 }}>
            Save your results and revisit your roadmap anytime.
          </p>
        </div>

        {/* Auth buttons */}
        <div className="space-y-3 mb-6">
          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full flex items-center gap-3 rounded-full transition-all duration-200"
            style={{
              height: '52px',
              background: 'var(--gt-surface)',
              border: '1.5px solid var(--gt-border-strong)',
              boxShadow: 'var(--gt-shadow-sm)',
              padding: '0 20px',
              opacity: loading ? 0.7 : 1,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--gt-ink)', flex: 1, textAlign: 'center' }}>
              {loading ? 'Signing in…' : 'Continue with Google'}
            </span>
          </button>

          <button
            className="w-full flex items-center gap-3 rounded-full transition-all duration-200"
            style={{
              height: '52px',
              background: 'var(--gt-surface)',
              border: '1.5px solid var(--gt-border-strong)',
              boxShadow: 'var(--gt-shadow-sm)',
              padding: '0 20px',
            }}
            onClick={() => toast.info('Email sign-in coming soon')}
          >
            <Mail size={20} style={{ color: 'var(--gt-stone)' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--gt-ink)', flex: 1, textAlign: 'center' }}>
              Continue with Email
            </span>
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px" style={{ background: 'var(--gt-border)' }} />
          <span className="gt-body-sm" style={{ color: 'var(--gt-stone-pale)' }}>or</span>
          <div className="flex-1 h-px" style={{ background: 'var(--gt-border)' }} />
        </div>

        {/* Skip */}
        <button
          className="w-full"
          style={{ height: '52px', color: 'var(--gt-stone)', fontSize: '0.9375rem' }}
          onClick={() => nav('/upload-selfie')}
        >
          Continue without account
        </button>

        {/* Trust note */}
        <div className="mt-auto pt-8">
          <Card>
            <div className="flex items-start gap-3">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'var(--gt-emerald-light)' }}
              >
                <span style={{ fontSize: '0.875rem' }}>🔒</span>
              </div>
              <div>
                <p className="gt-label mb-1" style={{ color: 'var(--gt-emerald)' }}>Privacy First</p>
                <p className="gt-body-sm" style={{ color: 'var(--gt-stone)', lineHeight: 1.6 }}>
                  <strong style={{ color: 'var(--gt-ink)' }}>Your photos are never stored.</strong>{' '}
                  We analyze them in real-time and immediately delete all image data.
                </p>
              </div>
            </div>
          </Card>
          <p className="gt-body-sm text-center mt-4" style={{ color: 'var(--gt-stone-pale)', lineHeight: 1.6 }}>
            By continuing, you agree to our{' '}
            <span style={{ color: 'var(--gt-rose)' }}>Privacy Policy</span> and{' '}
            <span style={{ color: 'var(--gt-rose)' }}>Terms</span>.
          </p>
        </div>
      </div>
    </Screen>
  )
}
