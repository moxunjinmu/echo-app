import { Module, Global } from '@nestjs/common';
import { RedisService } from './services/redis.service';
import { CacheService } from './services/cache.service';

@Global()
@Module({
  providers: [RedisService, CacheService],
  exports: [RedisService, CacheService],
})
export class CommonModule {}
