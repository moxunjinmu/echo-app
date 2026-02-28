import { Injectable } from '@nestjs/common';
import { RedisService } from '../services/redis.service';

@Injectable()
export class CacheService {
  constructor(private readonly redisService: RedisService) {}

  /**
   * 课程列表缓存（5分钟）
   */
  async getCourses(category: string) {
    const key = `courses:${category || 'all'}`;
    return this.redisService.cacheOrFetch(
      key,
      async () => {
        // 这里会被实际的 CourseService 调用
        return null;
      },
      300,
    );
  }

  /**
   * 课程详情缓存（10分钟）
   */
  async getCourseDetail(courseId: string) {
    const key = `course:${courseId}`;
    return this.redisService.cacheOrFetch(key, async () => null, 600);
  }

  /**
   * 清除课程缓存
   */
  async clearCourseCache(courseId?: string) {
    if (courseId) {
      await this.redisService.del(`course:${courseId}`);
    }
    // 清除所有课程列表缓存
    const categories = ['all', 'toefl', 'ielts', 'daily', 'business'];
    for (const cat of categories) {
      await this.redisService.del(`courses:${cat}`);
    }
  }

  /**
   * 用户每日免费额度
   */
  async getUserDailyQuota(userId: string, type: 'training' | 'ai') {
    const key = `quota:${userId}:${type}:${new Date().toISOString().split('T')[0]}`;
    const value = await this.redisService.get(key);
    return value ? parseInt(value) : 0;
  }

  /**
   * 增加用户每日使用量
   */
  async incrementUserDailyQuota(userId: string, type: 'training' | 'ai') {
    const key = `quota:${userId}:${type}:${new Date().toISOString().split('T')[0]}`;
    const current = await this.getUserDailyQuota(userId, type);
    await this.redisService.set(key, String(current + 1), 86400); // 24小时过期
    return current + 1;
  }

  /**
   * 验证码存储（5分钟）
   */
  async setVerificationCode(phone: string, code: string) {
    const key = `verify:${phone}`;
    await this.redisService.set(key, code, 300);
  }

  /**
   * 验证码验证
   */
  async verifyCode(phone: string, code: string): Promise<boolean> {
    const key = `verify:${phone}`;
    const stored = await this.redisService.get(key);
    if (stored === code) {
      await this.redisService.del(key);
      return true;
    }
    return false;
  }
}
