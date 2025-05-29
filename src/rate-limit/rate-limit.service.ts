import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';

import {
  RATE_LIMIT_BLOCK_DURATION_SECONDS,
  RATE_LIMIT_BLOCK_KEY_PREFIX,
  RATE_LIMIT_DURATION_SECONDS,
  RATE_LIMIT_KEY_PREFIX,
  RATE_LIMIT_MAX_REQUESTS,
} from 'src/constants';

@Injectable()
export class RateLimitService {
  constructor(@Inject('REDIS') private readonly redis: Redis) {}

  async isAllowed(visitorId: string): Promise<boolean> {
    const key = `${RATE_LIMIT_KEY_PREFIX}:${visitorId}`;
    const count = await this.redis.incr(key);
    if (count === 1) {
      await this.redis.expire(key, RATE_LIMIT_DURATION_SECONDS);
    }
    return count <= RATE_LIMIT_MAX_REQUESTS;
  }

  async block(visitorId: string): Promise<void> {
    const key = `${RATE_LIMIT_BLOCK_KEY_PREFIX}:${visitorId}`;
    await this.redis.set(key, '1', 'EX', RATE_LIMIT_BLOCK_DURATION_SECONDS);
  }

  async isBlocked(visitorId: string): Promise<boolean> {
    const key = `${RATE_LIMIT_BLOCK_KEY_PREFIX}:${visitorId}`;
    return (await this.redis.exists(key)) === 1;
  }
}
