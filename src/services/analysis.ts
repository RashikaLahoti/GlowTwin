/**
 * analysis.ts
 * Frontend service that calls the analyzeImages Cloud Function.
 *
 * Flow:
 *   1. Frontend uploads both images to Cloudinary (in UploadSelfie/UploadInspo pages)
 *   2. Frontend calls analyzeImages() here with the secure_urls + public_ids
 *   3. Cloud Function fetches images from Cloudinary → base64 → Gemini Vision
 *   4. Cloud Function writes result to Firestore and returns it
 *   5. Frontend stores result in AnalysisContext and navigates to /report
 */

const FUNCTIONS_BASE =
  (import.meta.env.VITE_FUNCTIONS_BASE_URL as string | undefined) ??
  'http://localhost:5000/api'

export interface AnalyzeImagesRequest {
  selfieUrl: string
  selfiePublicId: string
  inspirationUrl: string
  inspoPublicId: string
  city: string
  budget: string
  userId?: string          // optional — for saving to database
  idToken?: string         // JWT Access token — passed in Authorization header
}

export interface AnalyzeImagesResponse {
  analysisId: string       // Firestore doc ID
  result: GeminiAnalysisResult
}

/** The structured output Gemini returns (mirrors MOCK_RESULT in useAnalysis.tsx) */
export interface GeminiAnalysisResult {
  verdict: string
  status: 'achievable' | 'caution' | 'risk'
  statusLabel: string
  hairHealth: number
  hairType: string
  undertone: string
  technique: string
  faceShape: string
  riskLevel: string
  realityPoints: string[]
  costs: {
    initial: string
    toning: string
    bond: string
    products: string
    total: string
  }
  aiCostNote: string
  roadmilestones: {
    phase: string
    title: string
    desc: string
    tags: string[]
    cost: string
    type: 'home' | 'salon' | 'maintenance'
    note?: string
  }[]
  alternatives: {
    name: string
    why: string
    match: string
    emoji: string
  }[]
  city: string
}

export class AnalysisError extends Error {
  constructor(message: string, public readonly code?: string) {
    super(message)
    this.name = 'AnalysisError'
  }
}

/**
 * Call the analyzeImages Cloud Function.
 * Returns the full Gemini analysis result + Firestore analysisId.
 */
export async function analyzeImages(
  request: AnalyzeImagesRequest,
): Promise<AnalyzeImagesResponse> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (request.idToken) {
    headers['Authorization'] = `Bearer ${request.idToken}`
  }

  const url = `${FUNCTIONS_BASE}/analyses/analyze`

  let response: Response
  try {
    response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(request),
    })
  } catch (err) {
    throw new AnalysisError(
      'Could not reach the analysis server. Check your connection or emulator.',
      'NETWORK_ERROR',
    )
  }

  const body = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new AnalysisError(
      body?.error ?? `Analysis failed (HTTP ${response.status})`,
      body?.code ?? 'FUNCTION_ERROR',
    )
  }

  if (!body?.result) {
    throw new AnalysisError('Analysis returned an unexpected response.', 'INVALID_RESPONSE')
  }

  return body as AnalyzeImagesResponse
}

/**
 * Call the saveBooking Cloud Function.
 * Writes a booking sub-document to Firestore.
 */
export async function saveBooking(params: {
  analysisId: string
  salon: string
  date: string
  time: string
  idToken?: string
}): Promise<void> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (params.idToken) headers['Authorization'] = `Bearer ${params.idToken}`

  const url = `${FUNCTIONS_BASE}/bookings`
  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(params),
  })

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new AnalysisError(body?.error ?? 'Booking save failed.', 'BOOKING_ERROR')
  }
}
