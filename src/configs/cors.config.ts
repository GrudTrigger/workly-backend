export const corsConfig = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'WWW-Authenticate',
    'Authorization',
    'Accept',
    'Access-Control-Allow-Origin',
    'Access-Control-Allow-Credentials',
    'X-Requested-With',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers',
    'Access-Control-Expose-Headers',
  ],
  preflightContinue: false,
  optionsSuccessStatus: 200,
  credentials: true,
};
