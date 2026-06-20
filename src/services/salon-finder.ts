/**
 * salon-finder.ts
 * Salon recommendation service using Google Places API.
 * Fetches real salon data based on city and techniques.
 */

export interface SalonRecommendation {
  id: string
  emoji: string
  name: string
  location: string
  distance: string
  rating: number
  reviews: number
  spec: string
  tags: string[]
  availability: string
  price: string
  topPick: boolean
  aiNote?: string
  mapsUrl: string
  phone?: string
}

/**
 * Fetch salon recommendations for a specific city and hair technique.
 * 
 * Note: This is a placeholder for Google Places API integration.
 * In production, you would:
 * 1. Add Google Places API key to .env.local (VITE_GOOGLE_PLACES_API_KEY)
 * 2. Create a backend endpoint that calls Google Places API
 * 3. Filter results by salon reviews mentioning the specific technique
 * 
 * For now, returns hardcoded recommendations.
 */
export async function fetchSalonRecommendations(
  city: string,
  technique: string,
): Promise<SalonRecommendation[]> {
  // Placeholder: Return hardcoded recommendations
  // In production, call your backend endpoint:
  // const response = await fetch(`${FUNCTIONS_BASE}/getSalons?city=${city}&technique=${technique}`)
  // return response.json()

  console.warn('[GlowTwin] Using hardcoded salon recommendations. Connect Google Places API in production.')

  // Hardcoded recommendations (fallback)
  const salons: SalonRecommendation[] = [
    {
      id: '1',
      emoji: '💎',
      name: 'Aarav Studio',
      location: 'Bandra West',
      distance: '2.3 km',
      rating: 4.9,
      reviews: 184,
      spec: `${technique} specialist · 7 years · Works with Olaplex on every color service · 23 clients with similar hair profile`,
      tags: ['GlowTwin Certified', 'Olaplex'],
      availability: 'Sat, Oct 19',
      price: '₹5,500 – ₹8,000',
      topPick: true,
      aiNote: 'This stylist has worked with 23 clients with similar hair profiles to yours.',
      mapsUrl: 'https://maps.google.com/?q=Aarav+Studio+Bandra',
    },
    {
      id: '2',
      emoji: '🌿',
      name: "Riya's Color Lab",
      location: 'Andheri West',
      distance: '3.8 km',
      rating: 4.7,
      reviews: 91,
      spec: `${technique} + color correction · Expert in previously-colored hair · Bond treatment partner salon`,
      tags: ['GlowTwin Certified', 'Color Correction'],
      availability: 'Sun, Oct 20',
      price: '₹4,500 – ₹7,000',
      topPick: false,
      mapsUrl: 'https://maps.google.com/?q=Riyas+Color+Lab+Andheri',
    },
    {
      id: '3',
      emoji: '☀️',
      name: 'The Glow Room',
      location: 'Juhu',
      distance: '5.1 km',
      rating: 4.8,
      reviews: 212,
      spec: `Premium ${technique} studio · Specializes in high-lift on South Asian hair · Strand test included before every bleach service`,
      tags: ['Strand Test Included', 'South Asian Hair'],
      availability: 'Fri, Oct 18',
      price: '₹6,000 – ₹9,000',
      topPick: false,
      mapsUrl: 'https://maps.google.com/?q=The+Glow+Room+Juhu',
    },
  ]

  return salons
}

/**
 * Format salon data for display in UI.
 * Adds UI-specific fields like emoji selection based on rating.
 */
export function formatSalonForDisplay(salon: SalonRecommendation) {
  return {
    ...salon,
    ratingEmoji: salon.rating >= 4.8 ? '⭐' : salon.rating >= 4.5 ? '✨' : '🌟',
    reviewsLabel: `${salon.reviews} ${salon.reviews === 1 ? 'review' : 'reviews'}`,
  }
}
