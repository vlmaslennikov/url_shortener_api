import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { seconds, ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { ProjectThrottlerGuard } from './throttler.guard';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        throttlers: [
          {
            ttl: seconds(Number(configService.get('app').throttleTTL)),
            limit: Number(configService.get('app').throttleLimit),
          },
        ],
        storage: new ThrottlerStorageRedisService(),
      }),
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ProjectThrottlerGuard,
    },
  ],
})
export class ProjectThrottlerModule { }
