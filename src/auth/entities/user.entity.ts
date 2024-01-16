/* eslint-disable prettier/prettier */
import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
@Entity()
@Unique(['email'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  salt: string;



  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    console.log('Provided password:', password);
    console.log('Hashed password:', this.password);
    console.log('Is password valid:', bcrypt.compareSync(password, this.password)); // Используйте bcrypt.compareSync
    return bcrypt.compareSync(password, this.password);
  }
}
