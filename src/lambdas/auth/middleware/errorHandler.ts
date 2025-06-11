import { createInternalErrorResponse } from "../utils/response";
import { LambdaEvent, LambdaResult } from "../utils/types";

 

export function errorHandler(error: Error, event: LambdaEvent): LambdaResult {
  console.error(`An unexpected error occurred: ${error.message}`, error);
  
  const isDevelopment = process.env.NODE_ENV === 'development';
  return createInternalErrorResponse(error, isDevelopment);
}