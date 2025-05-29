import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RateLimitService {
  constructor(@Inject('REDIS') private readonly redis: Redis) {}

  async isAllowed(visitorId: string): Promise<boolean> {
    const key = `rate:${visitorId}`;
    const count = await this.redis.incr(key);
    if (count === 1) {
      await this.redis.expire(key, 60); // TTL 60 segundos
    }
    return count <= 10;
  }

  async block(visitorId: string): Promise<void> {
    const key = `rate:block:${visitorId}`;
    await this.redis.set(key, '1', 'EX', 900); // bloqueo por 15 min
  }

  async isBlocked(visitorId: string): Promise<boolean> {
    const key = `rate:block:${visitorId}`;
    return (await this.redis.exists(key)) === 1;
  }
}
