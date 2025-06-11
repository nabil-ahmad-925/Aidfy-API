export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
} as const;

export const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
} as const;

export const ERROR_MESSAGES = {
  INVALID_JSON: 'Invalid JSON in request body',
  MISSING_BODY_SIGNUP: 'Request body is required for signup',
  MISSING_BODY_LOGIN: 'Request body is required for login',
  MISSING_CREDENTIALS: 'Username and password are required TS',
  ROUTE_NOT_FOUND: 'Route not found or method not allowed',
  INTERNAL_ERROR: 'Internal server error',
  SOMETHING_WRONG: 'Something went wrong'
} as const;