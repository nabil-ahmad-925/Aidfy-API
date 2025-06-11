// /src/utils/response.ts
 
import { HTTP_STATUS, ERROR_MESSAGES } from './constants';
import { ErrorResponse, LambdaResult, SuccessResponse } from './types';

export function createResponse<T>(
  statusCode: number,
  data: SuccessResponse<T> | ErrorResponse,
  additionalHeaders: Record<string, string> = {}
): LambdaResult {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    ...additionalHeaders
  };

  return {
    statusCode,
    headers,
    body: JSON.stringify(data)
  };
}

export function createSuccessResponse<T>(
  statusCode: number,
  message: string,
  user?: T,
  token?: string
): LambdaResult {
  const responseData: any = {
    message,
    success: true
  };

  if (user) {
    responseData.user = user;
  }

  if (token) {
    responseData.token = token;
  }

  return createResponse(statusCode, responseData);
}

export function createErrorResponse(
  statusCode: number,
  message: string,
  requestedRoute?: string,
  availableRoutes?: string[]
): LambdaResult {
  const errorResponse: ErrorResponse = {
    message
  };

  if (requestedRoute) {
    errorResponse.requestedRoute = requestedRoute;
  }

  if (availableRoutes) {
    errorResponse.availableRoutes = availableRoutes;
  }

  return createResponse(statusCode, errorResponse);
}

export function createInternalErrorResponse(
  error: Error,
  isDevelopment: boolean = false
): LambdaResult {
  const message = isDevelopment ? error.message : ERROR_MESSAGES.SOMETHING_WRONG;
  
  return createErrorResponse(
    HTTP_STATUS.INTERNAL_SERVER_ERROR,
    ERROR_MESSAGES.INTERNAL_ERROR,
    undefined,
    undefined
  );
}