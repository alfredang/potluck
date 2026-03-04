import 'dotenv/config';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function optionalEnv(name: string, defaultValue: string): string {
  return process.env[name] ?? defaultValue;
}

// Warn about missing JWT secrets but don't crash — the server can still start
// and return 500 on protected routes until secrets are configured.
function warnEnv(name: string, fallback: string): string {
  const value = process.env[name];
  if (!value) {
    console.warn(
      `[config] WARNING: ${name} is not set. Using an insecure fallback. ` +
        `Authentication will not work correctly until this is configured.`
    );
    return fallback;
  }
  return value;
}

export const config = {
  // Server
  nodeEnv: optionalEnv('NODE_ENV', 'development'),
  port: parseInt(optionalEnv('PORT', '3001'), 10),
  host: optionalEnv('HOST', '0.0.0.0'),
  appUrl: optionalEnv('APP_URL', 'http://localhost:3000'),
  apiUrl: optionalEnv('API_URL', 'http://localhost:3001'),

  // Database
  databaseUrl: requireEnv('DATABASE_URL'),

  // Redis
  redisUrl: optionalEnv('REDIS_URL', ''),

  // JWT — required for auth to work but not for the server to start
  jwtAccessSecret: warnEnv('JWT_ACCESS_SECRET', 'INSECURE_FALLBACK_ACCESS_SECRET_CHANGE_ME'),
  jwtRefreshSecret: warnEnv('JWT_REFRESH_SECRET', 'INSECURE_FALLBACK_REFRESH_SECRET_CHANGE_ME'),
  jwtAccessExpiry: '15m',
  jwtRefreshExpiry: '7d',

  // Stripe
  stripeSecretKey: optionalEnv('STRIPE_SECRET_KEY', ''),
  stripePublishableKey: optionalEnv('STRIPE_PUBLISHABLE_KEY', ''),
  stripeWebhookSecret: optionalEnv('STRIPE_WEBHOOK_SECRET', ''),
  stripePriceBasic: optionalEnv('STRIPE_PRICE_BASIC', 'price_basic_monthly'),
  stripePricePro: optionalEnv('STRIPE_PRICE_PRO', 'price_pro_monthly'),
  stripePriceUnlimited: optionalEnv('STRIPE_PRICE_UNLIMITED', 'price_unlimited_monthly'),

  // HitPay
  hitpayApiKey: optionalEnv('HITPAY_API_KEY', ''),

  // Google OAuth
  googleClientId: optionalEnv('GOOGLE_CLIENT_ID', ''),
  googleClientSecret: optionalEnv('GOOGLE_CLIENT_SECRET', ''),

  // Google Maps
  googleMapsApiKey: optionalEnv('GOOGLE_MAPS_API_KEY', ''),

  // Storage (Cloudflare R2)
  r2AccountId: optionalEnv('R2_ACCOUNT_ID', ''),
  r2AccessKeyId: optionalEnv('R2_ACCESS_KEY_ID', ''),
  r2SecretAccessKey: optionalEnv('R2_SECRET_ACCESS_KEY', ''),
  r2BucketName: optionalEnv('R2_BUCKET_NAME', 'homechef-uploads'),
  r2PublicUrl: optionalEnv('R2_PUBLIC_URL', ''),

  // Feature flags
  isDevelopment: optionalEnv('NODE_ENV', 'development') === 'development',
  isProduction: optionalEnv('NODE_ENV', 'development') === 'production',
} as const;

export type Config = typeof config;
