import { supabaseAdmin } from '../supabaseAdmin.js';

export async function authMiddleware(req, res, next) {
  try {
    const authorization = req.get('Authorization');

    if (!authorization || !authorization.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'AUTH_REQUIRED',
        message: 'Authentication is required.',
      });
    }

    const token = authorization.slice('Bearer '.length).trim();

    if (!token) {
      return res.status(401).json({
        error: 'AUTH_REQUIRED',
        message: 'Authentication is required.',
      });
    }

    const {
      data: { user },
      error,
    } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        error: 'AUTH_INVALID',
        message: 'The authentication token is invalid or expired.',
      });
    }

    req.user_id = user.id;
    req.user = user;

    return next();
  } catch (error) {
    console.error('[auth] Unexpected authentication error:', error);
    return res.status(401).json({
      error: 'AUTH_INVALID',
      message: 'Unable to validate authentication.',
    });
  }
}
