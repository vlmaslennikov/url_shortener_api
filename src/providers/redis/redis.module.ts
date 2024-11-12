import { Module } from '@nestjs/common';
import { RedisModule, RedisModuleOptions } from '@liaoliaots/nestjs-redis';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService,
      ): Promise<RedisModuleOptions> => ({
        config: {
          url: configService.get('redis').url,
          onClientCreated(client) {
            client.on('error', (err) => {
              console.error('Redis connecting error', err);
            });
            client.on('ready', () => {
              console.debug('Redis connected successfully');
            });
          },
        },
      }),
    }),
  ],
})
export class RedisInternalModule { }
