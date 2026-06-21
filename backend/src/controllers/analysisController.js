import Analysis from '../models/Analysis.js';
import { runGeminiAnalysis } from '../services/geminiService.js';

// Validate Cloudinary URLs
const isCloudinaryUrl = (u) =>
  typeof u === 'string' &&
  (u.startsWith('https://res.cloudinary.com/') || u.startsWith('data:image/'));

/**
 * @desc    Request AI image analysis
 * @route   POST /api/analyses/analyze
 */
export const analyze = async (req, res, next) => {
  const {
    selfieUrl,
    selfiePublicId,
    inspirationUrl,
    inspoPublicId,
    city = 'India',
    budget = '',
  } = req.body;

  try {
    if (!selfieUrl || !inspirationUrl) {
      return res.status(400).json({
        error: 'selfieUrl and inspirationUrl are required.',
        code: 'MISSING_IMAGES',
      });
    }

    if (!isCloudinaryUrl(selfieUrl) || !isCloudinaryUrl(inspirationUrl)) {
      return res.status(400).json({
        error: 'Image URLs must be Cloudinary secure_urls or valid base64 image data.',
        code: 'INVALID_IMAGE_URL',
      });
    }

    const openRouterApiKey = process.env.OPENROUTER_API_KEY;
    if (!openRouterApiKey) {
      return res.status(500).json({
        error: 'OPENROUTER_API_KEY is not configured on the server.',
        code: 'MISSING_API_KEY',
      });
    }

    // Attach authenticated user ID if present (optional auth)
    const userId = req.user ? req.user._id : undefined;

    // Create pending document
    const analysis = await Analysis.create({
      userId,
      selfieUrl,
      inspirationUrl,
      selfiePublicId: selfiePublicId ?? '',
      inspoPublicId: inspoPublicId ?? '',
      city,
      budget,
      status: 'pending',
    });

    console.log(`[Analysis Controller] Analysis ${analysis._id} created as pending. User ID: ${userId || 'anonymous'}`);

    try {
      // Run Gemini visual analysis
      const result = await runGeminiAnalysis(
        selfieUrl,
        inspirationUrl,
        city,
        budget,
        openRouterApiKey
      );

      // Save complete status
      analysis.status = 'complete';
      analysis.result = result;
      analysis.completedAt = new Date();
      await analysis.save();

      console.log(`[Analysis Controller] Analysis ${analysis._id} finished successfully.`);
      res.status(200).json({
        analysisId: analysis._id,
        result,
      });
    } catch (geminiErr) {
      console.error("========== FULL AI ERROR ==========");
      console.error(geminiErr);

      if (geminiErr?.response?.data) {
        console.error(
          JSON.stringify(geminiErr.response.data, null, 2)
        );
      }

      const errMsg =
        geminiErr instanceof Error
          ? geminiErr.message
          : String(geminiErr);

      analysis.status = 'error';
      analysis.errorMessage = errMsg;
      await analysis.save();

      return res.status(500).json({
        error: errMsg,
        code: 'GEMINI_ERROR',
        analysisId: analysis._id,
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user analyses history
 * @route   GET /api/analyses
 */
export const getUserAnalyses = async (req, res, next) => {
  try {
    const analyses = await Analysis.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: analyses.length,
      analyses,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get specific analysis document
 * @route   GET /api/analyses/:id
 */
export const getAnalysisById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const analysis = await Analysis.findById(id);

    if (!analysis) {
      return res.status(404).json({ error: 'Analysis not found', code: 'ANALYSIS_NOT_FOUND' });
    }

    // Ownership check (only if analysis is tied to a user)
    if (analysis.userId) {
      const isOwner = req.user && req.user._id.toString() === analysis.userId.toString();
      if (!isOwner) {
        return res.status(403).json({
          error: 'Access denied: you do not own this analysis',
          code: 'FORBIDDEN_OWNERSHIP',
        });
      }
    }

    res.status(200).json({
      success: true,
      analysis,
    });
  } catch (error) {
    next(error);
  }
};
