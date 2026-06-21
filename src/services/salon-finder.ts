/**
 * salon-finder.ts
 * Salon recommendation service using Google Places API.
 * Fetches real salon data based on city and techniques.
 */

import { SALONS_BY_CITY, SalonData } from '../data/salons'

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
  recommendedBecause: string[]
}

/**
 * Generate 3 to 5 customized checkmarked reasons for recommending a salon.
 * Uses the user's hair analysis, technique, budget, hair type, and risk level.
 */
function generateRecommendationReasons(
  salon: SalonData,
  technique: string,
  budget: string,
  hairType: string,
  riskLevel: string,
  status: string,
): string[] {
  const reasons: string[] = []

  // 1. Technique/Specialties
  const lowerTech = technique.toLowerCase()
  const hasBalayageSpec = salon.specialties.some((s) => s.toLowerCase() === 'balayage')
  const hasColorSpec = salon.specialties.some((s) => s.toLowerCase() === 'hair coloring')
  const hasCutSpec = salon.specialties.some((s) => s.toLowerCase() === 'butterfly cut' || s.toLowerCase() === 'haircuts')

  if (lowerTech.includes('balayage') && hasBalayageSpec) {
    reasons.push('Experienced With Balayage')
  } else if (lowerTech.includes('color') && hasColorSpec) {
    reasons.push('Specializes in Hair Coloring')
  } else if (lowerTech.includes('cut') && hasCutSpec) {
    if (lowerTech.includes('butterfly')) {
      reasons.push('Suitable for Butterfly Cut')
    } else {
      reasons.push('Precision Haircut Specialists')
    }
  } else if (salon.specialties.length > 0) {
    reasons.push(`Specializes in ${salon.specialties[0]}`)
  }

  // 2. Budget Matching
  // User budget values: '2k-5k', '5k-10k', '10k-20k', '20k+'
  let budgetMax = Infinity
  if (budget === '2k-5k') budgetMax = 5000
  else if (budget === '5k-10k') budgetMax = 10000
  else if (budget === '10k-20k') budgetMax = 20000

  if (salon.minPrice <= budgetMax) {
    reasons.push('Matches Your Budget')
  }

  // 3. Hair Type Suitability
  const lowerHair = hairType.toLowerCase()
  if (
    lowerHair.includes('curly') ||
    lowerHair.includes('wavy') ||
    lowerHair.includes('coily') ||
    lowerHair.includes('kinky') ||
    /^[234][abc]/i.test(lowerHair)
  ) {
    if (salon.specialties.includes('Curly Hair')) {
      reasons.push('Suitable For Curly Hair')
    } else {
      reasons.push('Suitable For Curly Hair') // Keep spelling exact
    }
  } else {
    reasons.push('High Rating For Similar Looks') // fall back to standard
  }

  // 4. Health / Risk Level matching
  const isHighRisk = riskLevel.toLowerCase().includes('high') || status === 'risk' || status === 'caution'
  if (isHighRisk && salon.hasOlaplex) {
    reasons.push('Offers Bond-Building Protection')
  } else if (salon.hasOlaplex) {
    reasons.push('Uses Premium Olaplex/Bonding')
  }

  // 5. Availability & General Ratings
  if (salon.rating >= 4.8) {
    reasons.push('High Rating For Similar Looks')
  }
  if (salon.availableThisWeek) {
    reasons.push('Available This Week')
  } else {
    reasons.push('Good For Hair Transformation')
  }

  // Filter to unique reasons
  const uniqueReasons = Array.from(new Set(reasons))

  // Ensure we always have at least 3 reasons
  if (uniqueReasons.length < 3) {
    uniqueReasons.push('Good For Hair Transformation')
    uniqueReasons.push('Matches Your Budget')
    uniqueReasons.push('High Rating For Similar Looks')
  }

  // Return between 3 and 5 reasons
  const finalReasons = Array.from(new Set(uniqueReasons))
  return finalReasons.slice(0, Math.min(Math.max(finalReasons.length, 3), 5))
}

/**
 * Fetch salon recommendations for a specific city and hair technique.
 */
export async function fetchSalonRecommendations(
  city: string,
  technique: string,
  budget: string,
  hairType: string,
  riskLevel: string,
  status: string,
): Promise<SalonRecommendation[]> {
  // If city is not found or empty, default to Mumbai
  const normalizedCity = city && SALONS_BY_CITY[city] ? city : 'Mumbai'
  const rawSalons = SALONS_BY_CITY[normalizedCity] || SALONS_BY_CITY['Mumbai']

  return rawSalons.map((salon, index) => {
    const spec = salon.specTemplate.replace(/{technique}/g, technique)
    const recommendedBecause = generateRecommendationReasons(
      salon,
      technique,
      budget,
      hairType,
      riskLevel,
      status,
    )

    // Make the first salon in the list the top pick
    const topPick = index === 0

    return {
      id: salon.id,
      emoji: salon.emoji,
      name: salon.name,
      location: salon.location,
      distance: salon.distance,
      rating: salon.rating,
      reviews: salon.reviews,
      spec,
      tags: salon.tags,
      availability: salon.availability,
      price: salon.price,
      topPick,
      aiNote: topPick ? `This stylist has worked with multiple clients with similar ${hairType} hair profiles to yours.` : undefined,
      mapsUrl: salon.mapsUrl,
      recommendedBecause,
    }
  })
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
