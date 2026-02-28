import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit {
  private client: any;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    try {
      this.client = createClient({
        url: `redis://${this.configService.get('REDIS_HOST', 'localhost')}:${this.configService.get('REDIS_PORT', 6379)}`,
      });

      this.client.on('error', (err) => console.error('Redis Client Error', err));
      this.client.on('connect', () => console.log('✅ Redis Connected'));

      await this.client.connect();
    } catch (error) {
      console.error('Redis connection failed:', error);
      // 开发环境继续运行，不报错
    }
  }

  /**
   * 获取缓存
   */
  async get(key: string): Promise<string | null> {
    try {
      if (!this.client?.isReady) return null;
      return await this.client.get(key);
    } catch (error) {
      console.error('Redis get error:', error);
      return null;
    }
  }

  /**
   * 设置缓存
   */
  async set(key: string, value: string, ttl?: number): Promise<void> {
    try {
      if (!this.client?.isReady) return;
      if (ttl) {
        await this.client.setEx(key, ttl, value);
      } else {
        await this.client.set(key, value);
      }
    } catch (error) {
      console.error('Redis set error:', error);
    }
  }

  /**
   * 删除缓存
   */
  async del(key: string): Promise<void> {
    try {
      if (!this.client?.isReady) return;
      await this.client.del(key);
    } catch (error) {
      console.error('Redis del error:', error);
    }
  }

  /**
   * 获取 JSON 数据
   */
  async getJson<T>(key: string): Promise<T | null> {
    const data = await this.get(key);
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  /**
   * 设置 JSON 数据
   */
  async setJson(key: string, value: any, ttl?: number): Promise<void> {
    await this.set(key, JSON.stringify(value), ttl);
  }

  /**
   * 缓存装饰器辅助方法
   */
  async cacheOrFetch<T>(key: string, fetchFn: () => Promise<T>, ttl: number = 300): Promise<T> {
    // 尝试从缓存获取
    const cached = await this.getJson<T>(key);
    if (cached) return cached;

    // 执行查询
    const data = await fetchFn();

    // 存入缓存
    await this.setJson(key, data, ttl);

    return data;
  }
}
