import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  order_id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'varchar', length: 20 })
  product_type: string; // monthly/quarterly/yearly

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'varchar', length: 20 })
  payment_method: string; // wechat/alipay/apple_iap

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status: string; // pending/success/failed/refunded

  @Column({ type: 'datetime', nullable: true })
  paid_at: Date;

  @CreateDateColumn()
  created_at: Date;
}
