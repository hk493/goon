// AWS Lambda handler for TRIPPIN application
const { createServer } = require('http');
const { parse } = require('url');

// Import all the Netlify functions
const openaiChat = require('./netlify/functions/openai-chat.js');
const openaiGenerate = require('./netlify/functions/openai-generate.js');
const openaiVision = require('./netlify/functions/openai-vision.js');
const tripadvisor = require('./netlify/functions/tripadvisor.js');
const googleMaps = require('./netlify/functions/google-maps.js');
const amadeus = require('./netlify/functions/amadeus.js');
const esim = require('./netlify/functions/esim.js');
const currencyConvert = require('./netlify/functions/currency-convert.js');
const createCheckoutSession = require('./netlify/functions/create-checkout-session.js');
const verifyPayment = require('./netlify/functions/verify-payment.js');

// Route mapping
const routes = {
  '/openai-chat': openaiChat.handler,
  '/openai-generate': openaiGenerate.handler,
  '/openai-vision': openaiVision.handler,
  '/tripadvisor': tripadvisor.handler,
  '/google-maps': googleMaps.handler,
  '/amadeus': amadeus.handler,
  '/esim': esim.handler,
  '/currency-convert': currencyConvert.handler,
  '/create-checkout-session': createCheckoutSession.handler,
  '/verify-payment': verifyPayment.handler,
};

// Convert AWS Lambda event to Netlify function format
function convertEvent(event) {
  const { path, httpMethod, headers, queryStringParameters, body } = event;
  
  return {
    httpMethod,
    headers: headers || {},
    queryStringParameters: queryStringParameters || {},
    body: body || null,
    path,
    isBase64Encoded: event.isBase64Encoded || false
  };
}

// Convert Netlify function response to AWS Lambda format
function convertResponse(response) {
  return {
    statusCode: response.statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      ...response.headers
    },
    body: response.body,
    isBase64Encoded: response.isBase64Encoded || false
  };
}

// Health check endpoint
function healthCheck() {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      status: 'healthy',
      service: 'letsgettrippin',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      endpoints: Object.keys(routes)
    })
  };
}

// Main Lambda handler
exports.handler = async (event, context) => {
  console.log('Lambda event:', JSON.stringify(event, null, 2));
  
  try {
    // Extract path from event
    let path = event.path || event.rawPath || '/';
    
    // Handle API Gateway proxy integration
    if (event.requestContext && event.requestContext.resourcePath) {
      path = event.requestContext.resourcePath;
    }
    
    // Remove stage prefix if present
    if (path.startsWith('/dev/') || path.startsWith('/prod/')) {
      path = path.substring(5); // Remove /dev/ or /prod/
    }
    
    // Handle function paths
    if (path.startsWith('/.netlify/functions/')) {
      path = path.replace('/.netlify/functions', '');
    }
    
    console.log('Processing path:', path);
    
    // Health check
    if (path === '/health' || path === '/api/health') {
      return healthCheck();
    }
    
    // Handle CORS preflight
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          response: data.choices[0].message.content.trim(), // Change translatedText to response
        },
        body: ''
      };
    }
    
    // Route to appropriate function
    const handler = routes[path];
    
    if (handler) {
      console.log(`Routing to handler for path: ${path}`);
      const netlifyEvent = convertEvent(event);
      const response = await handler(netlifyEvent, context);
      return convertResponse(response);
    }
    
    // Default response for unmatched routes
    console.log(`No handler found for path: ${path}`);
    return {
      statusCode: 404,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: 'Not Found',
        message: `No handler found for path: ${path}`,
        timestamp: new Date().toISOString()
      })
    };
    
  } catch (error) {
    console.error('Lambda handler error:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: 'Internal Server Error',
        message: error.message,
        timestamp: new Date().toISOString()
      })
    };
  }
};