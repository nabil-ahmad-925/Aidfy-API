import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

// User related types
export interface User {
  username: string;
  email?: string;
}

// Authentication request types
export interface SignupRequest {
  username: string;
  password: string;
  email?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

// Authentication response types
export interface SignupResponse {
  message: string;
  user: User;
  success: true;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
  success: true;
}



// Lambda event and response types
export interface LambdaEvent extends APIGatewayProxyEvent {}
export interface LambdaResult extends APIGatewayProxyResult {}
export interface LambdaContext extends Context {}

// API Response types
export interface ApiResponse<T = any> {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}

export interface SuccessResponse<T = any> {
  message: string;
  data?: T;
  success: true;
}

export interface ErrorResponse {
  message: string;
  error?: string;
  requestedRoute?: string;
  availableRoutes?: string[];
}

// HTTP Methods
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS';

// Route handler type
export type RouteHandler = (
  event: LambdaEvent,
  context?: LambdaContext
) => Promise<LambdaResult>;

// Route configuration
export interface RouteConfig {
  [method: string]: {
    [path: string]: RouteHandler;
  };
}

// Validation error type
export interface ValidationError extends Error {
  isJoi?: boolean;
  details?: Array<{ message: string; path: string[] }>;
  statusCode?: number;
}