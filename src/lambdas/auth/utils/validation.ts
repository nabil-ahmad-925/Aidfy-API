 
import { ERROR_MESSAGES, HTTP_STATUS } from './constants';
import { LambdaEvent } from './types';

export function parseAndValidateBody(event: LambdaEvent, operation: 'signup' | 'login'): any {
  // Check if body exists
  if (!event.body) {
    const error = new Error(
      operation === 'signup' 
        ? ERROR_MESSAGES.MISSING_BODY_SIGNUP 
        : ERROR_MESSAGES.MISSING_BODY_LOGIN
    );
    (error as any).statusCode = HTTP_STATUS.BAD_REQUEST;
    throw error;
  }

  // Parse JSON
  let body: any;
  try {
    body = JSON.parse(event.body || '{}');
  } catch (parseError) {
    const error = new Error(ERROR_MESSAGES.INVALID_JSON);
    (error as any).statusCode = HTTP_STATUS.BAD_REQUEST;
    throw error;
  }

  // Validate required fields
  const { username, password } = body;
  if (!username || !password) {
    const error = new Error(ERROR_MESSAGES.MISSING_CREDENTIALS);
    (error as any).statusCode = HTTP_STATUS.BAD_REQUEST;
    throw error;
  }

  return body;
}