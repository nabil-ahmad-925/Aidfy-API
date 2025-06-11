 
import * as aws_secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as cdk from 'aws-cdk-lib';
import { StageName } from './shared/constants';

export const getEnvironmentConfig = (stack: cdk.Stack, stage: StageName) => {

  const getSecrets = (id: string, secretArn: string) => {
    return aws_secretsmanager.Secret.fromSecretAttributes(stack, id, {
      secretCompleteArn: secretArn,
    });
  };

  const stripeSecrets = getSecrets("IrisAIAssistantSecrets-Stripe", "arn:aws:secretsmanager:us-east-1:806191645249:secret:IrisAIAssistantSecrets-Stripe-a6gaPr");
  const openaiSecrets = getSecrets("IrisAIAssistantSecrets-OpenAI", "arn:aws:secretsmanager:us-east-1:806191645249:secret:IrisAIAssistantSecrets-OpenAI-CRfKII");
  const otherSecrets = getSecrets("IrisAIAssistantSecrets", "arn:aws:secretsmanager:us-east-1:806191645249:secret:IrisAIAssistantSecrets-iYWNKY");

  // Common Secrets (Same for DEV, BETA, and PROD)
  const stripeApiSecret = stripeSecrets.secretValueFromJson("stripeApiSecret").toString();
  const stripeApiKey = stripeSecrets.secretValueFromJson("stripeApiKey").toString();
  const openaiApiKey = openaiSecrets.secretValueFromJson("tiffany@tiffanyhoughton.com").toString();
  const openaiApiKey2 = openaiSecrets.secretValueFromJson("admoffit@usc.edu").toString();
  const openaiApiKeyBackup = openaiSecrets.secretValueFromJson("contact@irisai.app").toString();
  const loopmessageApiKey = otherSecrets.secretValueFromJson("LOOPMESSAGE_API_KEY_PROD").toString();
  const loopmessageApiSecret = otherSecrets.secretValueFromJson("LOOPMESSAGE_API_SECRET_PROD").toString();
  const sendblueApiKey = otherSecrets.secretValueFromJson("SENDBLUE_API_KEY_PROD").toString();
  const sendblueApiSecret = otherSecrets.secretValueFromJson("SENDBLUE_API_SECRET_PROD").toString();
  const slidespeakApiKey = otherSecrets.secretValueFromJson("SLIDESPEAK_API_KEY").toString();
  const firebase_credentials = otherSecrets.secretValueFromJson("FIREBASE_CREDENTIALS").toString();
  const IRIS_EVERYONE_FIREBASE_API_KEY = otherSecrets.secretValueFromJson("IRIS_EVERYONE_FIREBASE_API_KEY").toString();
  const winstonAIApiKey = otherSecrets.secretValueFromJson("WINSTON_AI_API_KEY").toString();
  const LOOPMESSAGE_WEBHOOK_AUTH_SECRET_DEV = otherSecrets.secretValueFromJson("LOOPMESSAGE_WEBHOOK_AUTH_SECRET_DEV").toString();
  const LOOPMESSAGE_WEBHOOK_AUTH_SECRET_BETA = otherSecrets.secretValueFromJson("LOOPMESSAGE_WEBHOOK_AUTH_SECRET_BETA").toString();
  const LOOPMESSAGE_WEBHOOK_AUTH_SECRET_PROD = otherSecrets.secretValueFromJson("LOOPMESSAGE_WEBHOOK_AUTH_SECRET_PROD").toString();
  const twilioPhoneNumber = "+18885303844";
  const canvasApiKey = otherSecrets.secretValueFromJson("CANVAS_API_KEY").toString();

  // Normalize all "DEV*" environments (DEV, DEV2, DEV3, etc.) to "DEV"
  const normalizedStage = stage.startsWith("DEV") ? "DEV" : stage;

  const envConfig: Record<string, Record<string, string>> = {
    DEV: {
      stage,
      openai_api_key: openaiApiKey,
      openai_api_key_2: openaiApiKey2,
      openai_api_key_backup: openaiApiKeyBackup,
      stripe_api_secret: stripeApiSecret,
      stripe_api_key: stripeApiKey,
      loopmessage_api_key: loopmessageApiKey,
      loopmessage_api_secret: loopmessageApiSecret,
      sendblue_api_key: sendblueApiKey,
      sendblue_api_secret: sendblueApiSecret,
      twilio_phone_number: twilioPhoneNumber,
      slidespeak_api_key : slidespeakApiKey,
      firebase_credentials:firebase_credentials,
      IRIS_EVERYONE_FIREBASE_API_KEY:IRIS_EVERYONE_FIREBASE_API_KEY,
      LOOPMESSAGE_WEBHOOK_AUTH_SECRET: LOOPMESSAGE_WEBHOOK_AUTH_SECRET_DEV,
      winston_ai_api_key: winstonAIApiKey,
      canvas_api_key: canvasApiKey,
      FRONTEND_BASE_URL: "https://dev-edu-irisai-app.web.app",
      BASE_URL: "https://vuc9tokiy8.execute-api.us-east-1.amazonaws.com/DEV",
    },
    BETA: {
      stage,
      openai_api_key: openaiApiKey,
      openai_api_key_2: openaiApiKey2,
      openai_api_key_backup: openaiApiKeyBackup,
      stripe_api_secret: stripeApiSecret,
      stripe_api_key: stripeApiKey,
      loopmessage_api_key: loopmessageApiKey,
      loopmessage_api_secret: loopmessageApiSecret,
      sendblue_api_key: sendblueApiKey,
      sendblue_api_secret: sendblueApiSecret,
      twilio_phone_number: twilioPhoneNumber,
      slidespeak_api_key : slidespeakApiKey,
      firebase_credentials: firebase_credentials,
      IRIS_EVERYONE_FIREBASE_API_KEY:IRIS_EVERYONE_FIREBASE_API_KEY,
      LOOPMESSAGE_WEBHOOK_AUTH_SECRET: LOOPMESSAGE_WEBHOOK_AUTH_SECRET_BETA,
      winston_ai_api_key: winstonAIApiKey,
      canvas_api_key: canvasApiKey,
    },
    PROD: {
      stage,
      openai_api_key: openaiApiKey,
      openai_api_key_2: openaiApiKey2,
      openai_api_key_backup: openaiApiKeyBackup,
      stripe_api_secret: stripeApiSecret,
      stripe_api_key: stripeApiKey,
      loopmessage_api_key: loopmessageApiKey,
      loopmessage_api_secret: loopmessageApiSecret,
      sendblue_api_key: sendblueApiKey,
      sendblue_api_secret: sendblueApiSecret,
      twilio_phone_number: twilioPhoneNumber,
      slidespeak_api_key : slidespeakApiKey,
      firebase_credentials: firebase_credentials,
      IRIS_EVERYONE_FIREBASE_API_KEY:IRIS_EVERYONE_FIREBASE_API_KEY,
      LOOPMESSAGE_WEBHOOK_AUTH_SECRET: LOOPMESSAGE_WEBHOOK_AUTH_SECRET_PROD,     
      winston_ai_api_key: winstonAIApiKey,
      canvas_api_key: canvasApiKey,
      FRONTEND_BASE_URL: "https://edu.irisai.app",
      BASE_URL: "https://1ig7ulobgc.execute-api.us-east-1.amazonaws.com/PROD",
    }
  };

  return envConfig[normalizedStage] || envConfig["DEV"];
};

