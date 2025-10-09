// Debug utilities for API debugging

export const DEBUG_PREFIX = "[DEBUG]";

export function logApiCall(method: string, url: string, data?: any) {
  console.log(`🔥 ${DEBUG_PREFIX} API ${method} ${url} called`);
  if (data) {
    console.log(`📤 ${DEBUG_PREFIX} Request data:`, data);
  }
}

export function logApiResponse(method: string, url: string, response: any) {
  console.log(`📥 ${DEBUG_PREFIX} API ${method} ${url} response:`, response);
}

export function logApiError(method: string, url: string, error: any) {
  console.error(`💥 ${DEBUG_PREFIX} API ${method} ${url} error:`, error);
  if (error instanceof Error) {
    console.error(`💥 ${DEBUG_PREFIX} Error stack:`, error.stack);
  }
}

export function logDatabaseQuery(query: string, params?: any) {
  console.log(`🔍 ${DEBUG_PREFIX} Database query:`, query);
  if (params) {
    console.log(`🔍 ${DEBUG_PREFIX} Query params:`, params);
  }
}

export function logUserAuth(userId?: string) {
  console.log(
    `👤 ${DEBUG_PREFIX} User authentication status:`,
    userId ? "Authenticated" : "Not authenticated"
  );
  console.log(`👤 ${DEBUG_PREFIX} User ID:`, userId || "None");
}

export function logEnvironmentCheck() {
  console.log(`🔧 ${DEBUG_PREFIX} Environment check:`);
  console.log(`  - NODE_ENV:`, process.env.NODE_ENV);
  console.log(`  - DATABASE_URL exists:`, !!process.env.DATABASE_URL);
  console.log(
    `  - GOOGLE_GENERATIVE_AI_API_KEY exists:`,
    !!process.env.GOOGLE_GENERATIVE_AI_API_KEY
  );
}

export function logResponseData(data: any, label = "Response data") {
  console.log(`📊 ${DEBUG_PREFIX} ${label}:`, JSON.stringify(data, null, 2));
}

export function logRequestHeaders(headers: Headers) {
  console.log(
    `📋 ${DEBUG_PREFIX} Request headers:`,
    Object.fromEntries(headers.entries())
  );
}

export function logResponseHeaders(headers: Headers) {
  console.log(
    `📋 ${DEBUG_PREFIX} Response headers:`,
    Object.fromEntries(headers.entries())
  );
}
