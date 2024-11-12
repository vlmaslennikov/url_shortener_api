import { registerAs } from '@nestjs/config';

export default registerAs('mongodb', () => ({
  uri: process.env.MONGO_DB_URI,
  host: process.env.MONGO_DB_HOST,
  port: Number(process.env.MONGO_DB_PORT),
  username: process.env.MONGO_DB_USERNAME,
  password: process.env.MONGO_DB_PASSWORD,
  database: process.env.MONGO_INIT_DATABASE,
}));