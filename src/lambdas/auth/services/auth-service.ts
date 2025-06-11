import { HTTP_STATUS } from "../utils/constants";
import { createErrorResponse, createSuccessResponse } from "../utils/response";
import { LambdaContext, LambdaEvent, LambdaResult, LoginRequest, SignupRequest, User } from "../utils/types";
import { parseAndValidateBody } from "../utils/validation";

 

export async function handleLogin(
  event: LambdaEvent,
  context?: LambdaContext
): Promise<LambdaResult> {
  try {
    // Parse and validate request body
    const body = parseAndValidateBody(event, 'login') as LoginRequest;
    const { username, password } = body;

    console.log(`Login attempt for username: ${username}`);

    // TODO: Add actual login logic here
    // - Verify user credentials
    // - Generate JWT token
    // - Return user data

    const user: User = { username };
    const token = 'mock-jwt-token';
    const message = `User ${username} logged in successfully!`;

    return createSuccessResponse(HTTP_STATUS.OK, message, user, token);

  } catch (error: any) {
    console.error('Invalid JSON in request body for login:', error);
    
    if (error.statusCode) {
      return createErrorResponse(error.statusCode, error.message);
    }
    
    return createErrorResponse(HTTP_STATUS.BAD_REQUEST, error.message);
  }
}
 

export async function handleSignup(
  event: LambdaEvent,
  context?: LambdaContext
): Promise<LambdaResult> {
  try {
    // Parse and validate request body
    const body = parseAndValidateBody(event, 'signup') as SignupRequest;
    const { username, password } = body;

    console.log(`Signup attempt for username: ${username}`);

    // TODO: Add actual signup logic here
    // - Check if user exists
    // - Hash password
    // - Save to database
    // - Generate tokens

    const user: User = { username };
    const message = `User ${username} signed up successfully!`;

    return createSuccessResponse(HTTP_STATUS.CREATED, message, user);

  } catch (error: any) {
    console.error('Invalid JSON in request body for signup:', error);
    
    if (error.statusCode) {
      return createErrorResponse(error.statusCode, error.message);
    }
    
    return createErrorResponse(HTTP_STATUS.BAD_REQUEST, error.message);
  }
}