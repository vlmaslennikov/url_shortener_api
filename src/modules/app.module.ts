import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { MongoDBModule } from 'src/providers/mongodb/mongodb.module';
import { ProjectThrottlerModule } from 'src/shared/throttler/throttler.module';
import { RedisInternalModule } from '../providers/redis/redis.module';
import ShortLinkDataModule from './short-link-data/short-link-data.module';
import redisConfig from 'src/shared/config/redis.config';
import mongodbConfig from 'src/shared/config/mongodb.config';
import swaggerConfig from 'src/shared/config/swagger.config';
import appConfig from 'src/shared/config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [
        appConfig,
        mongodbConfig,
        redisConfig,
        swaggerConfig,
      ],
    }),
    MongoDBModule,
    RedisInternalModule,
    ProjectThrottlerModule,
    ShortLinkDataModule,
  ],
})
export default class AppModule { }
