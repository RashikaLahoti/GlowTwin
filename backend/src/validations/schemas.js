import { z } from 'zod';

const CostsSchema = z.object({
  initial: z.string().min(1, 'Initial cost is required'),
  toning: z.string().min(1, 'Toning cost is required'),
  bond: z.string().min(1, 'Bond cost is required'),
  products: z.string().min(1, 'Products cost is required'),
  total: z.string().min(1, 'Total cost is required'),
});

const RoadmilestoneSchema = z.object({
  phase: z.string().min(1),
  title: z.string().min(1),
  desc: z.string().min(1),
  tags: z.array(z.string()).min(1),
  cost: z.string().min(1),
  type: z.enum(['home', 'salon', 'maintenance']),
  note: z.string().optional(),
});

const AlternativeSchema = z.object({
  name: z.string().min(1),
  why: z.string().min(1),
  match: z.string().min(1),
emoji: z.string().min(1).max(10),
});

export const GeminiAnalysisSchema = z.object({
  verdict: z.string().min(10, 'Verdict must be at least 10 characters'),
  status: z.enum(['achievable', 'caution', 'risk']),
  statusLabel: z.string().min(1),
  hairHealth: z.number().min(1).max(10),
  hairType: z.string().min(1),
  undertone: z.string().min(1),
  technique: z.string().min(1),
  faceShape: z.string().min(1),
  riskLevel: z.string().min(1),
  realityPoints: z.array(z.string()).min(3).max(3),
  costs: CostsSchema,
  aiCostNote: z.string().min(10),
  roadmilestones: z.array(RoadmilestoneSchema).min(3).max(5),
  alternatives: z.array(AlternativeSchema).min(3).max(3),
  city: z.string().min(1),
});

/**
 * Validate that data matches the expected Gemini response format.
 */
export function validateGeminiResponse(data) {
  try {
    const validated = GeminiAnalysisSchema.parse(data);
    return { valid: true, data: validated };
  } catch (err) {
    if (err instanceof z.ZodError) {
      const errors = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ');
      return { valid: false, error: `Validation failed: ${errors}` };
    }
    return { valid: false, error: 'Unknown validation error' };
  }
}
