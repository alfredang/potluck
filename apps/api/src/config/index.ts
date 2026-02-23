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

  // JWT
  jwtAccessSecret: requireEnv('JWT_ACCESS_SECRET'),
  jwtRefreshSecret: requireEnv('JWT_REFRESH_SECRET'),
  jwtAccessExpiry: '15m',
  jwtRefreshExpiry: '7d',

  // Stripe
  stripeSecretKey: optionalEnv('STRIPE_SECRET_KEY', ''),
  stripePublishableKey: optionalEnv('STRIPE_PUBLISHABLE_KEY', ''),
  stripeWebhookSecret: optionalEnv('STRIPE_WEBHOOK_SECRET', ''),
  stripePriceBasic: optionalEnv('STRIPE_PRICE_BASIC', 'price_basic_monthly'),
  stripePricePro: optionalEnv('STRIPE_PRICE_PRO', 'price_pro_monthly'),
  stripePriceUnlimited: optionalEnv('STRIPE_PRICE_UNLIMITED', 'price_unlimited_monthly'),

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
