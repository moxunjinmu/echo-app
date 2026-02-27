import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Course } from './course.entity';

@Entity('sentences')
export class Sentence {
  @PrimaryGeneratedColumn('uuid')
  sentence_id: string;

  @Column({ type: 'uuid' })
  course_id: string;

  @ManyToOne(() => Course)
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @Column({ type: 'int' })
  sentence_index: number; // 从 1 开始

  @Column({ type: 'varchar', length: 255 })
  audio_url: string;

  @Column({ type: 'text' })
  text_en: string;

  @Column({ type: 'text' })
  text_cn: string;

  @Column({ type: 'float', nullable: true })
  start_time: number;

  @Column({ type: 'float', nullable: true })
  end_time: number;
}
