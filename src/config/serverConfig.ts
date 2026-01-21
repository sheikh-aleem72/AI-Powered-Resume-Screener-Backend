import dotenv from 'dotenv';

dotenv.config();
// const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
// dotenv.config({ path: envFile });

interface EnvConfig {
  PORT: number;
  DB_URL: string;
  JWT_ACCESS_SECRET: string;
  JWT_REFRESH_SECRET: string;
  JWT_ACCESS_EXPIRES_IN: string;
  JWT_REFRESH_EXPIRES_IN: string;
  SMTP_HOST: string;
  SMTP_PORT: number;
  SMTP_SECURE: boolean;
  SMTP_USER: string;
  SMTP_PASS: string;
  OTP_EXPIRES_MINUTES: number;
  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_API_SECRET: string;
  CLOUDINARY_API_KEY: string;
  PARSER_SERVICE_URL: string;
  REDIS_URL: string;
  MAX_RESUMES_PER_BATCH: number;
  MAX_TOTAL_BYTES_PER_BATCH: number;
}

const getEnvVar = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing environment variable: ${key}`);
  return value;
};

export const env: EnvConfig = {
  PORT: Number(getEnvVar('PORT')),
  DB_URL: getEnvVar('DB_URL'),
  JWT_ACCESS_SECRET: getEnvVar('JWT_ACCESS_SECRET'),
  JWT_REFRESH_SECRET: getEnvVar('JWT_REFRESH_SECRET'),
  JWT_REFRESH_EXPIRES_IN: getEnvVar('JWT_REFRESH_EXPIRES_IN'),
  JWT_ACCESS_EXPIRES_IN: getEnvVar('JWT_ACCESS_EXPIRES_IN'),
  SMTP_HOST: getEnvVar('SMTP_HOST'),
  SMTP_PORT: Number(getEnvVar('SMTP_PORT')),
  SMTP_SECURE: Boolean(getEnvVar('SMTP_SECURE')),
  SMTP_USER: getEnvVar('SMTP_USER'),
  SMTP_PASS: getEnvVar('SMTP_PASS'),
  OTP_EXPIRES_MINUTES: Number(getEnvVar('OTP_EXPIRES_MINUTES')),
  CLOUDINARY_API_KEY: getEnvVar('CLOUDINARY_API_KEY'),
  CLOUDINARY_API_SECRET: getEnvVar('CLOUDINARY_API_SECRET'),
  CLOUDINARY_CLOUD_NAME: getEnvVar('CLOUDINARY_CLOUD_NAME'),
  PARSER_SERVICE_URL: getEnvVar('PARSER_SERVICE_URL'),
  REDIS_URL: getEnvVar('REDIS_URL'),
  MAX_RESUMES_PER_BATCH: 50,
  MAX_TOTAL_BYTES_PER_BATCH: 200 * 1024 * 1024,
};
