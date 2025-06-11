import { handleLogin, handleSignup } from "../services/auth-service";
import { ERROR_MESSAGES, HTTP_STATUS } from "../utils/constants";
import { createErrorResponse } from "../utils/response";
import { LambdaContext, LambdaEvent, LambdaResult, RouteConfig } from "../utils/types";
 

const ROUTES: RouteConfig = {
  'POST': {
    '/auth/v1/signup': handleSignup,
    '/auth/v1/login':  handleLogin,
  }
  // Add other methods (GET, PUT, DELETE) and paths as needed
};

export async function routeHandler(
  event: LambdaEvent,
  context: LambdaContext
): Promise<LambdaResult> {
  const { path, httpMethod } = event;
  
  console.log(`Processing request: ${httpMethod} ${path}`);
  
  // Check if handler exists for the given HTTP method and path
  const methodHandlers = ROUTES[httpMethod];
  if (methodHandlers) {
    const targetHandler = methodHandlers[path];
    if (targetHandler) {
      console.log(`Found handler for route: ${httpMethod} ${path}`);
      return await targetHandler(event, context);
    }
  }
  
  // No matching route found
  console.log(`No handler found for route: ${httpMethod} ${path}`);
  
  const availableRoutes = Object.keys(ROUTES)
    .map(method => Object.keys(ROUTES[method]).map(route => `${method} ${route}`))
    .flat();
  
  console.log('Available routes:', availableRoutes);
  
  return createErrorResponse(
    HTTP_STATUS.NOT_FOUND,
    ERROR_MESSAGES.ROUTE_NOT_FOUND,
    `${httpMethod} ${path}`,
    availableRoutes
  );
}