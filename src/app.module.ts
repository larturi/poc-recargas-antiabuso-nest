import { Module } from '@nestjs/common';
import Redis from 'ioredis';
import { RateLimitService } from './rate-limit/rate-limit.service';
import { RecargasController } from './recargas/recargas.controller';

@Module({
  controllers: [RecargasController],
  providers: [
    {
      provide: 'REDIS',
      useFactory: () => {
        return new Redis({
          host: 'localhost',
          port: 6379,
        });
      },
    },
    {
      provide: RateLimitService,
      useFactory: (redis) => new RateLimitService(redis),
      inject: ['REDIS'],
    },
  ],
})
export class AppModule {}
