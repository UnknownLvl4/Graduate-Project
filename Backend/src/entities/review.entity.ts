import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('review')
export class Review {
  @PrimaryGeneratedColumn('uuid')
  review_id: string;

  @Column({ type: 'uuid' })
  product_id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'text' })
  comment: string;

  @CreateDateColumn()
  created_at: Date;
}