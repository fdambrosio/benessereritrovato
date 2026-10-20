interface RateLimitEntry {
  attempts: number;
  firstAttempt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;

// Periodic cleanup to prevent memory leaks
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitMap) {
      if (now - entry.firstAttempt > WINDOW_MS) {
        rateLimitMap.delete(key);
      }
    }
  }, 60 * 1000);
}

export function checkRateLimit(ip: string): { allowed: boolean; retryAfterMs: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now - entry.firstAttempt > WINDOW_MS) {
    rateLimitMap.set(ip, { attempts: 1, firstAttempt: now });
    return { allowed: true, retryAfterMs: 0 };
  }

  if (entry.attempts >= MAX_ATTEMPTS) {
    const retryAfterMs = WINDOW_MS - (now - entry.firstAttempt);
    return { allowed: false, retryAfterMs };
  }

  entry.attempts += 1;
  return { allowed: true, retryAfterMs: 0 };
}
