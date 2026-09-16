import { getCurrentUsageMonth, readQuota } from './aiController.js';

export async function meController(req, res) {
  try {
    const quota = await readQuota(req.user_id, getCurrentUsageMonth());
    return res.status(200).json(quota);
  } catch (error) {
    console.error('[me] Failed to read quota:', error);
    return res.status(503).json({
      error: 'QUOTA_SERVICE_UNAVAILABLE',
      message: 'The quota service is temporarily unavailable.',
    });
  }
}
