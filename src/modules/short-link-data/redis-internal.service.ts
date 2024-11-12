import { Injectable } from '@nestjs/common';
import { RedisService } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';

@Injectable()
export class RedisInternalService {
  private readonly redisClient: Redis;

  constructor(
    private readonly redisService: RedisService,
  ) {
    this.redisClient = this.redisService.getOrThrow();
  }

  async getData(key: string): Promise<string | null> {
    return this.redisClient.get(key);
  }

  async saveData(key: string, value: string): Promise<void> {
    await this.redisClient.set(key, value);
  }
}
