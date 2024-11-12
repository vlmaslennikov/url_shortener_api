import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => ({
  url: process.env.REDIS_URI,
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
}));
