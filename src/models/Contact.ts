import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import {User} from './User';

@Entity('contacts')
export class Contact {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false, type: 'varchar' })
  name!: string;

  @Column({ nullable: false, type: 'varchar' })
  surname!: string;

  @Column({ nullable: true, unique: true, type: 'varchar' })
  email!: string;

  @Column({ nullable: true, type: 'integer' })
  tel!: number;

  @Column({ nullable: true, type: 'varchar' })
  image!: string;

  @ManyToMany(() => User, user => user.contacts)
  users!: User[]

}
