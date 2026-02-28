import { Test, TestingModule } from '@nestjs/testing';
import { CacheService } from '../src/common/services/cache.service';
import { RedisService } from '../src/common/services/redis.service';

describe('CacheService', () => {
  let service: CacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CacheService,
        {
          provide: RedisService,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
            getJson: jest.fn(),
            setJson: jest.fn(),
            cacheOrFetch: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CacheService>(CacheService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
