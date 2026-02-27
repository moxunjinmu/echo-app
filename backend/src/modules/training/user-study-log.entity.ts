import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Sentence } from '../course/sentence.entity';

@Entity('user_study_logs')
export class UserStudyLog {
  @PrimaryGeneratedColumn('increment')
  log_id: number;

  @Column({ type: 'uuid' })
  user_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'uuid' })
  course_id: string;

  @Column({ type: 'uuid' })
  sentence_id: string;

  @ManyToOne(() => Sentence)
  @JoinColumn({ name: 'sentence_id' })
  sentence: Sentence;

  @Column({ type: 'text', nullable: true })
  recognized_text: string;

  @Column({ type: 'int', nullable: true })
  accuracy_score: number; // 0-100

  @Column({ type: 'boolean', default: false })
  is_weak: boolean; // 准确度 <60%

  @Column({ type: 'varchar', length: 20 })
  client_type: string; // weapp/flutter_ios/flutter_android

  @CreateDateColumn()
  created_at: Date;
}
