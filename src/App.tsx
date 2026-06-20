import { Routes, Route, Navigate } from 'react-router'
import { Toaster } from 'sonner'
import Landing from './pages/Landing'
import SignIn from './pages/SignIn'
import UploadSelfie from './pages/UploadSelfie'
import UploadInspo from './pages/UploadInspo'
import Analyzing from './pages/Analyzing'
import RealityReport from './pages/RealityReport'
import CostPrediction from './pages/CostPrediction'
import GlowRoadmap from './pages/GlowRoadmap'
import StylistBrief from './pages/StylistBrief'
import SalonRecommendation from './pages/SalonRecommendation'
import BookingConfirmation from './pages/BookingConfirmation'
import { AnalysisProvider } from './hooks/useAnalysis'
import { AuthProvider } from './contexts/auth-context'

export default function App() {
  return (
    <AuthProvider>
      <AnalysisProvider>
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: '#FFFFFF',
            color: '#1A1714',
            border: '1px solid #E8E3DC',
            borderRadius: '999px',
            fontSize: '0.875rem',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            boxShadow: '0 4px 16px rgba(26,23,20,0.08)',
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/upload-selfie" element={<UploadSelfie />} />
        <Route path="/upload-inspo" element={<UploadInspo />} />
        <Route path="/analyzing" element={<Analyzing />} />
        <Route path="/report" element={<RealityReport />} />
        <Route path="/cost" element={<CostPrediction />} />
        <Route path="/roadmap" element={<GlowRoadmap />} />
        <Route path="/brief" element={<StylistBrief />} />
        <Route path="/salons" element={<SalonRecommendation />} />
        <Route path="/confirmed" element={<BookingConfirmation />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </AnalysisProvider>
    </AuthProvider>
  )
}
