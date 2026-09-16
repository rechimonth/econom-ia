import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { authMiddleware } from './middleware/authMiddleware.js';
import { aiController } from './controllers/aiController.js';
import { meController } from './controllers/meController.js';

const app = express();
const port = Number(process.env.PORT || 8787);

const allowedOrigins = (process.env.FRONTEND_ORIGINS || 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.disable('x-powered-by');

if (process.env.TRUST_PROXY === 'true') {
  app.set('trust proxy', 1);
}

app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('CORS_ORIGIN_NOT_ALLOWED'));
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type'],
    credentials: false,
  }),
);

app.use(express.json({ limit: '64kb' }));

const ipLimiter = rateLimit({
  windowMs: 60_000,
  limit: 60,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'RATE_LIMITED', message: 'Too many requests. Please try again later.' },
});

const perUserAiLimiter = rateLimit({
  windowMs: 60_000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  keyGenerator: (req) => req.user_id,
  message: { error: 'AI_RATE_LIMITED', message: 'Too many AI requests. Please try again later.' },
});

const healthLimiter = rateLimit({
  windowMs: 60_000,
  limit: 30,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'RATE_LIMITED', message: 'Too many health checks.' },
});

app.get('/health', healthLimiter, (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/api/me', ipLimiter, authMiddleware, meController);
app.post('/api/ai', ipLimiter, authMiddleware, perUserAiLimiter, aiController);

app.use((error, _req, res, _next) => {
  if (error?.message === 'CORS_ORIGIN_NOT_ALLOWED') {
    return res.status(403).json({ error: 'CORS_ORIGIN_NOT_ALLOWED', message: 'The request origin is not allowed.' });
  }

  if (error?.type === 'entity.too.large') {
    return res.status(413).json({ error: 'REQUEST_TOO_LARGE', message: 'Request payload is too large.' });
  }

  console.error('[server] Unhandled error:', error);
  return res.status(500).json({ error: 'INTERNAL_SERVER_ERROR', message: 'An unexpected server error occurred.' });
});

app.listen(port, () => {
  console.log(`Econom-IA API listening on port ${port}`);
});
