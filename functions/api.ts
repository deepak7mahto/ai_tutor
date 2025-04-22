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
  // Parse the body for POST/PUT requests
  if (event.body && (event.httpMethod === 'POST' || event.httpMethod === 'PUT')) {
    try {
      event.body = JSON.parse(event.body);
    } catch (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Invalid JSON payload' })
      };
    }
  }

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
