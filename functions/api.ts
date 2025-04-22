import { handler as serverHandler } from '../src/server';
import { Handler } from '@netlify/functions';

interface NetlifyResponse {
  statusCode: number;
  headers?: {
    [key: string]: string | boolean | number;
  };
  body: string;
}

// Export the handler for Netlify Functions
export const handler: Handler = async (event, context) => {
  // Add headers for CORS
  const response = await serverHandler(event, context) as NetlifyResponse;
  
  if (!response.headers) {
    response.headers = {};
  }

  // Add CORS headers
  response.headers['Access-Control-Allow-Origin'] = '*';
  response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
  response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';

  return response;
};
