import axios from 'axios';
import { validateGeminiResponse } from '../validations/schemas.js';

/**
 * Fetch an image from a URL and return it as a base64 string + MIME type.
 * Retries up to 3 times on network errors.
 */
async function fetchImageAsBase64(url, retries = 3) {
  if (url.startsWith('data:image/')) {
    try {
      const parts = url.split(',');
      const mimeType = parts[0].split(';')[0].split(':')[1] || 'image/jpeg';
      const base64 = parts[1];
      return { base64, mimeType };
    } catch (err) {
      throw new Error(`Invalid data URI format: ${err.message}`);
    }
  }

  let lastError = null;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await axios.get(url, {
        responseType: 'arraybuffer',
        timeout: 15000,
        headers: { 'User-Agent': 'GlowTwin-AI/1.0' },
      });

      const buffer = Buffer.from(response.data);
      const base64 = buffer.toString('base64');
      const contentType = response.headers['content-type'] ?? 'image/jpeg';
      const mimeType = contentType.split(';')[0].trim();

      return { base64, mimeType };
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      const delay = Math.pow(2, attempt) * 1000; // Exponential backoff: 1s, 2s, 4s
      if (attempt < retries - 1) {
        console.warn(
          `[GlowTwin Server] Image fetch attempt ${attempt + 1}/${retries} failed, retrying in ${delay}ms`
        );
        await new Promise((r) => setTimeout(r, delay));
      }
    }
  }

  throw new Error(`Failed to fetch image after ${retries} attempts: ${lastError?.message}`);
}

/**
 * Build the structured prompt for Gemini.
 */
function buildPrompt(city, budget) {
  return `You are GlowTwin AI, a professional hair and beauty advisor with 15 years of experience as a trichologist and colorist specializing in South Asian hair.

You have been given TWO images:
  Image 1: The client's current selfie
  Image 2: Their inspiration look (a hairstyle/color they want to achieve)

Your job is to give an honest, expert assessment — not optimistic marketing copy.

City context: ${city || 'India'}
Budget context: ${budget || 'not specified'}

Analyze both images carefully and return a JSON object (and ONLY a JSON object, no markdown, no preamble) with this exact structure:

{
  "verdict": "2-3 sentence honest assessment of whether this look is achievable for this specific person. Mention the technique needed, main risks, and main opportunity. Sound like a trusted expert, not a salesperson.",
  "status": "achievable" | "caution" | "risk",
  "statusLabel": "Human-friendly label like 'Achievable with prep' or 'Challenging but possible' or 'Not recommended right now'",
  "hairHealth": <number 1-10 based on visible hair condition in selfie>,
  "hairType": "<e.g. 2C Wavy, 4B Coily, 1A Straight>",
  "undertone": "<e.g. Warm Golden, Cool Ash, Neutral>",
  "technique": "<specific technique visible in inspiration image, e.g. Free-hand Balayage, Ombre, Box Braids, Keratin Blowout>",
  "faceShape": "<e.g. Oval, Round, Heart, Square, Diamond>",
  "riskLevel": "<e.g. Low, Moderate (with prep), High — do not attempt now>",
  "realityPoints": [
    "<honest point 1 — about hair health or processing history>",
    "<honest point 2 — about maintenance or ongoing cost reality>",
    "<honest point 3 — about timing, climate, or a specific technical risk>"
  ],
  "costs": {
    "initial": "<e.g. ₹4,500 – ₹7,000>",
    "toning": "<total annual toning cost if applicable, else 'Not required'>",
    "bond": "<bond treatment cost if needed, else 'Not required'>",
    "products": "<estimated annual home product cost>",
    "total": "<total 12-month cost range>"
  },
  "aiCostNote": "1-2 sentences highlighting the surprising cost truth most people don't know about this specific look.",
  "roadmilestones": [
    {
      "phase": "Phase 1",
      "title": "<milestone title>",
      "desc": "<2-3 sentences of specific advice>",
      "tags": ["<e.g. At home>", "<e.g. 8 weeks>"],
      "cost": "<cost for this phase>",
      "type": "home" | "salon" | "maintenance",
      "note": "<optional: critical warning or tip>"
    },
    { ... },
    { ... },
    { ... }
  ],
  "alternatives": [
    {
      "name": "<alternative look name>",
      "why": "<why this is a better or safer option for this person>",
      "match": "<e.g. 91% vibe match · Low risk>",
      "emoji": "<single relevant emoji>"
    },
    { ... },
    { ... }
  ],
  "city": "${city || 'India'}"
}

CRITICAL RULES:
- All prices must be in Indian Rupees (₹).
- roadmilestones must have exactly 3–5 phases that are specific and actionable.
- alternatives must have exactly 3 options.
- realityPoints must have exactly 3 points.
- hairHealth must be a number between 1 and 10.
- status must be exactly "achievable", "caution", or "risk" — nothing else.
- Do NOT include any text outside the JSON object.
- Do NOT use markdown code fences.
- If you cannot determine something from the images, make a reasonable professional estimate.`;
}

/**
 * Attempts to repair and parse potentially malformed JSON responses from Gemini.
 */
function attemptJSONRepair(text) {
  let cleaned = text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();

  // Remove trailing commas in arrays/objects
  cleaned = cleaned.replace(/,(\s*[}\]])/g, '$1');

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    throw new Error(`JSON repair failed. Text length: ${cleaned.length}. Error: ${err.message}`);
  }
}

/**
 * Run Gemini Vision analysis attempt via OpenRouter.
 */
async function runGeminiAnalysisAttempt(selfieUrl, inspirationUrl, city, budget, apiKey) {
  // 1. Fetch both images in parallel
  const [selfieImg, inspoImg] = await Promise.all([
    fetchImageAsBase64(selfieUrl),
    fetchImageAsBase64(inspirationUrl),
  ]);

  const apiToken = apiKey || process.env.OPENROUTER_API_KEY;

  if (!apiToken) {
    throw new Error('OpenRouter API key is not configured.');
  }

  const promptText = buildPrompt(city, budget);

  // 2. Setup OpenRouter API request
  const response = await axios.post(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      model: 'google/gemini-2.5-flash',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: promptText,
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:${selfieImg.mimeType};base64,${selfieImg.base64}`,
              },
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:${inspoImg.mimeType};base64,${inspoImg.base64}`,
              },
            },
          ],
        },
      ],
      temperature: 0.3,
      max_tokens: 2048,
    },
    {
      headers: {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.data?.choices?.[0]?.message?.content) {
    throw new Error('OpenRouter returned an empty completion response.');
  }

  const rawText = response.data.choices[0].message.content.trim();

  // 3. Parse JSON
  let parsed;
  try {
    parsed = attemptJSONRepair(rawText);
  } catch (err) {
    throw new Error(`Failed to parse Gemini response as JSON: ${err.message}`);
  }

  // 4. Validate structure
  const validation = validateGeminiResponse(parsed);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  return validation.data;
}

const MAX_RETRIES = 2;

/**
 * Main export: runs Gemini Vision analysis with retries and exponential backoff.
 */
export async function runGeminiAnalysis(selfieUrl, inspirationUrl, city, budget, apiKey) {
  let lastError = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await runGeminiAnalysisAttempt(selfieUrl, inspirationUrl, city, budget, apiKey);
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      console.warn(
        `[GlowTwin Server] Gemini analysis attempt ${attempt + 1}/${MAX_RETRIES + 1} failed: ${lastError.message}`
      );

      if (attempt < MAX_RETRIES) {
        const delay = Math.pow(2, attempt) * 2000; // 2s, 4s
        await new Promise((r) => setTimeout(r, delay));
      }
    }
  }

  throw new Error(`Gemini analysis failed after ${MAX_RETRIES + 1} attempts: ${lastError?.message}`);
}
