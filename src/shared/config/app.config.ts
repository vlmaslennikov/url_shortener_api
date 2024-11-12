import { registerAs } from '@nestjs/config';


export default registerAs('app', () => ({
  port: process.env.SERVER_PORT || 3001,
  baseUrl: process.env.BASE_URL || 'http://localhost:3001',
  env: process.env.NODE_ENV || 'develop',
  throttleTTL: process.env.THROTTLE_TTL || 60,
  throttleLimit: process.env.THROTTLE_LIMIT || 10,
  cors: process.env.CORS,
  shortCodeLength: Number(process.env.SHORT_CODE_LENGTH),
}));