import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn('uuid')
  course_id: string;

  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 20 })
  category: string; // toefl/ielts/cet4/cet6/daily/business

  @Column({ type: 'varchar', length: 20 })
  difficulty: string; // beginner/intermediate/advanced

  @Column({ type: 'varchar', length: 255 })
  cover_url: string;

  @Column({ type: 'int', default: 0 })
  total_sentences: number;

  @Column({ type: 'int', default: 30 })
  estimated_minutes: number;

  @Column({ type: 'boolean', default: false })
  is_vip_only: boolean;

  @CreateDateColumn()
  created_at: Date;
}
