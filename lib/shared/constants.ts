export const LAMBDA_CONFIG = {
  AUTH_FUNCTION_NAME: 'adify-auth-service',
  RUNTIME: 'nodejs18.x',
  TIMEOUT_SECONDS: 30,
  MEMORY_SIZE_MB: 512,
} as const;

export const API_CONFIG = {
  API_NAME: 'adify-api',
  STAGE: 'dev',
  CORS_ORIGINS: ['*'], // Configure as needed for production
} as const;

export const STACK_CONFIG = {
  LAMBDA_STACK_NAME: 'AdifyLambdaStack',
  API_GATEWAY_STACK_NAME: 'AdifyApiGatewayStack',
} as const;


export const DEFAULT_VALUES = {
  AWS_ACCOUNT: '204822905305', // Replace with your default AWS account ID
  AWS_REGION: 'us-east-1',
  STAGE: 'dev' as const,
  APP_NAME: 'Aidfy',
} as const;


export type StageName = "DEV" | "BETA" | "PROD";

export type EnvironmentName = "DEV" | "DEV2" | "DEV3" | "DEV4" | "DEV5" | "BETA" | "PROD";