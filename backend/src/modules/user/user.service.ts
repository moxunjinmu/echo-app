import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findById(user_id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { user_id } });
  }

  async update(user_id: string, updateData: Partial<User>): Promise<User> {
    await this.userRepository.update(user_id, updateData);
    return this.findById(user_id);
  }

  /**
   * 获取学习总结
   */
  async getStudySummary() {
    // TODO: 从数据库查询真实数据
    return {
      week_checkin: [
        { day: '一', checked: true },
        { day: '二', checked: true },
        { day: '三', checked: false },
        { day: '四', checked: true },
        { day: '五', checked: false },
        { day: '六', checked: false },
        { day: '日', checked: false },
      ],
      today_completed_minutes: 12,
      today_target_minutes: 20,
      total_minutes: 480,
      total_sentences: 156,
      average_accuracy: 82,
      continuous_days: 5,
    };
  }

  /**
   * 获取在学课程列表
   */
  async getInProgressCourses() {
    // TODO: 从数据库查询真实数据
    return [
      {
        course_id: 'course_001',
        title: '托福听力校园对话精选',
        completed_sentences: 12,
        total_sentences: 45,
        average_score: 85,
      },
      {
        course_id: 'course_002',
        title: '日常实用口语50句',
        completed_sentences: 30,
        total_sentences: 50,
        average_score: 78,
      },
    ];
  }
}
