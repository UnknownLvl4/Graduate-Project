import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({name: 'firstname'})
  firstName: string;

  @Column({name: 'lastname'})
  lastName: string;

  @Column({ unique: true })
  phone: string;

  @Column()
  address: string;
}