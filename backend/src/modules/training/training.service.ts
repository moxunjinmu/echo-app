import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserStudyLog } from './user-study-log.entity';

@Injectable()
export class TrainingService {
  constructor(
    @InjectRepository(UserStudyLog)
    private studyLogRepository: Repository<UserStudyLog>,
  ) {}

  /**
   * 提交训练结果
   */
  async submitTraining(data: {
    course_id: string;
    sentence_id: string;
    recognized_text: string;
    accuracy_score: number;
    client_type: string;
    user_id: string;
  }) {
    // 判断是否为弱项（准确度 < 60%）
    const is_weak = data.accuracy_score < 60;

    const log = this.studyLogRepository.create({
      user_id: data.user_id,
      course_id: data.course_id,
      sentence_id: data.sentence_id,
      recognized_text: data.recognized_text,
      accuracy_score: data.accuracy_score,
      is_weak,
      client_type: data.client_type,
    });

    await this.studyLogRepository.save(log);

    return {
      success: true,
      is_weak,
      message: is_weak
        ? '已加入弱项库，建议加强练习'
        : '表现良好，继续保持！',
    };
  }

  /**
   * 语音识别（模拟）
   */
  async recognizeSpeech(audioData: string) {
    // TODO: 集成腾讯云/阿里云 ASR
    // 当前返回模拟结果
    return {
      text: 'Hello world',
      confidence: 0.95,
      is_final: true,
    };
  }

  /**
   * 获取用户弱项列表
   */
  async getUserWeakness(userId: string) {
    return this.studyLogRepository.find({
      where: { user_id: userId, is_weak: true },
      order: { accuracy_score: 'ASC', created_at: 'DESC' },
      take: 20,
    });
  }
}
