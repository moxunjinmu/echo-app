import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './course.entity';
import { Sentence } from './sentence.entity';

@Injectable()
export class CourseService implements OnModuleInit {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    @InjectRepository(Sentence)
    private sentenceRepository: Repository<Sentence>,
  ) {}

  /**
   * 应用启动时初始化模拟数据
   */
  async onModuleInit() {
    const count = await this.courseRepository.count();
    if (count === 0) {
      await this.initializeMockData();
    }
  }

  /**
   * 初始化模拟课程数据
   */
  private async initializeMockData() {
    const courses = [
      {
        course_id: 'course_001',
        title: '托福听力校园对话精选',
        description: '攻克新题型，先听后说直觉反射',
        category: 'toefl',
        difficulty: 'advanced',
        cover_url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400',
        total_sentences: 45,
        estimated_minutes: 30,
        is_vip_only: false,
      },
      {
        course_id: 'course_002',
        title: '日常实用口语50句',
        description: '适合零基础，培养英语语感',
        category: 'daily',
        difficulty: 'beginner',
        cover_url: 'https://images.unsplash.com/photo-1543109740-4bdb38fda756?w=400',
        total_sentences: 50,
        estimated_minutes: 15,
        is_vip_only: false,
      },
      {
        course_id: 'course_003',
        title: '外企高频会议实战',
        description: '摆脱哑巴英语，地道职场表达',
        category: 'business',
        difficulty: 'intermediate',
        cover_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400',
        total_sentences: 30,
        estimated_minutes: 20,
        is_vip_only: true,
      },
    ];

    for (const courseData of courses) {
      const course = this.courseRepository.create(courseData);
      await this.courseRepository.save(course);
    }

    console.log('✅ 模拟课程数据初始化完成');
  }

  /**
   * 获取课程列表
   */
  async findAll(category?: string): Promise<Course[]> {
    const where: any = {};
    if (category) {
      where.category = category;
    }

    // TODO: 添加缓存优化
    return this.courseRepository.find({
      where,
      order: { created_at: 'DESC' },
    });
  }

  /**
   * 获取课程详情
   */
  async findOne(id: string): Promise<Course | null> {
    // TODO: 添加缓存优化
    return this.courseRepository.findOne({
      where: { course_id: id },
    });
  }

  /**
   * 获取课程句子列表
   */
  async getSentences(courseId: string): Promise<Sentence[]> {
    // TODO: 添加缓存优化
    return this.sentenceRepository.find({
      where: { course_id: courseId },
      order: { sentence_index: 'ASC' },
    });
  }

  /**
   * 创建课程
   */
  async createCourse(data: Partial<Course>): Promise<Course> {
    const course = this.courseRepository.create(data);
    return this.courseRepository.save(course);
  }

  /**
   * 更新课程
   */
  async updateCourse(id: string, data: Partial<Course>): Promise<Course | null> {
    await this.courseRepository.update(id, data);
    return this.findOne(id);
  }

  /**
   * 删除课程
   */
  async deleteCourse(id: string): Promise<void> {
    await this.courseRepository.delete(id);
  }
}
