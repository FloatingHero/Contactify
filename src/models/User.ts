import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Contact } from './Contact';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false, type: 'varchar' })
  name!: string;

  @Column({ nullable: false, unique: true, type: 'varchar' })
  email!: string;

  @Column({ nullable: false, type: 'varchar' })
  password!: string;

  @Column({ nullable: true, type: 'varchar' })
  profile_image!: string;

  //* relationships
  @ManyToMany(() => Contact)
  @JoinTable({ name: 'users_contacts' })
  contacts!: Contact[];
}
